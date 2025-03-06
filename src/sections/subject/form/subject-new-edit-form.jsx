import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'sonner';

import { Form } from 'src/components/hook-form';
import { generateSubject } from 'src/actions/subject';

import { Stepper, SubjectCreateStep1, SubjectCreateStep2 } from './steps';
import { SubjectReviewStep } from './steps/subject-review-step';

// ----------------------------------------------------------------------

const STEPS = ['Informations du sujet', 'Configuration', 'Génération et revue'];

// Schéma de validation pour le formulaire
const SubjectSchema = zod.object({
  title: zod.string().min(1, 'Le titre est requis'),
  description: zod.string().min(1, 'La description est requise'),
  test_id: zod.number().nullable().refine(val => val !== null && val > 0, {
    message: 'Le test est requis',
  }),
  level_id: zod.number().nullable(),
  totalDuration: zod.number().positive('La durée totale est requise'),
  totalPoints: zod.number().positive('Le nombre total de points est requis'),
  requiredPoints: zod.number().positive('Le nombre de points requis est requis'),
});

export default function SubjectNewEditForm({ currentSubject = null }) {
  const [activeStep, setActiveStep] = useState(0);
  const [generatedSubject, setGeneratedSubject] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasLevels, setHasLevels] = useState(false);
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      title: currentSubject?.title || '',
      description: currentSubject?.description || '',
      test_id: currentSubject?.test_id || null,
      level_id: currentSubject?.level_id || null,
      totalDuration: currentSubject?.totalDuration || 360,
      totalPoints: currentSubject?.totalPoints || 1200,
      requiredPoints: currentSubject?.requiredPoints || 1000,
    }), 
    [currentSubject]
  );

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(SubjectSchema),
    defaultValues,
  });

  const {
    reset,
    trigger,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    watch,
    setValue,
    getValues,
  } = methods;

  const values = watch();
  
  // Surveiller les changements de test_id et réinitialiser level_id si hasLevels est false
  useEffect(() => {
    if (!hasLevels && values.level_id) {
      console.log('Test has no levels but level_id is set, resetting level_id');
      setValue('level_id', null);
    }
  }, [values.test_id, hasLevels, setValue, values.level_id]);

  // Afficher les valeurs pour le débogage
  useEffect(() => {
    console.log('SubjectNewEditForm - values:', values);
    console.log('SubjectNewEditForm - errors:', errors);
    console.log('SubjectNewEditForm - activeStep:', activeStep);
  }, [values, errors, activeStep]);

  // Afficher les erreurs dans la console pour le débogage
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form errors:', errors);
    }
  }, [errors]);

  const handleNext = useCallback(
    async () => {
      // Valider tous les champs pour l'étape 1
      if (activeStep === 0) {
        const fieldsToValidate = ['title', 'description', 'test_id', 'totalDuration', 'totalPoints', 'requiredPoints'];
        const isValid = await trigger(fieldsToValidate);
        
        if (isValid) {
          // Vérifier explicitement les valeurs
          const currentValues = getValues();
          console.log('Moving to next step with values:', currentValues);
          
          if (!currentValues.test_id) {
            toast.error('Veuillez sélectionner un test');
            return;
          }
          
          // Vérifier si le niveau est requis et présent
          if (hasLevels && !currentValues.level_id) {
            toast.error('Veuillez sélectionner un niveau');
            return;
          }
          
          setActiveStep((currentStep) => currentStep + 1);
        } else {
          // Afficher un message d'erreur
          toast.error('Veuillez remplir tous les champs obligatoires');
        }
      } else {
        setActiveStep((currentStep) => currentStep + 1);
      }
    },
    [activeStep, trigger, getValues, hasLevels]
  );

  const handleBack = useCallback(() => {
    setActiveStep((currentStep) => currentStep - 1);
  }, []);

  const handleReset = useCallback(() => {
    reset();
    setActiveStep(0);
    setGeneratedSubject(null);
  }, [reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsGenerating(true);
      console.log('Submitting data:', data);
      
      // Appel à l'API pour générer le sujet
      const response = await generateSubject(data);
      if (response.success) {
        setGeneratedSubject(response);
        toast.success(response.message || 'Sujet généré avec succès');
        handleNext();
      } else {
        toast.error(response.message || 'Erreur lors de la génération du sujet');
      }
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du sujet');
    } finally {
      setIsGenerating(false);
    }
  });

  const completedStep = activeStep === STEPS.length;

  return (
    <>
      <Card
        sx={{
          p: 5,
          width: 1,
          mx: 'auto',
          maxWidth: 720,
        }}
      >
        <Stepper steps={STEPS} activeStep={activeStep} />
        <Form methods={methods} onSubmit={onSubmit}>
          <Box
            sx={[
              (theme) => ({
                p: 3,
                mb: 3,
                gap: 3,
                minHeight: 240,
                display: 'flex',
                borderRadius: 1.5,
                flexDirection: 'column',
                border: `dashed 1px ${theme.vars.palette.divider}`,
              }),
            ]}
          >
            {activeStep === 0 && <SubjectCreateStep1 onLevelsChange={setHasLevels} />}
            {activeStep === 1 && <SubjectCreateStep2 />}
            {activeStep === 2 && <SubjectReviewStep generatedSubject={generatedSubject} />}
            {completedStep && <SubjectReviewStep generatedSubject={generatedSubject} onReset={handleReset} />}
          </Box>
          {!completedStep && (
            <Box sx={{ display: 'flex' }}>
              {activeStep !== 0 && <Button onClick={handleBack}>Retour</Button>}

              <Box sx={{ flex: '1 1 auto' }} />

              {activeStep === 0 && (
                <Button 
                  type="button" 
                  variant="contained" 
                  onClick={handleNext}
                  disabled={!values.title || !values.description || !values.test_id || (hasLevels && !values.level_id)}
                >
                  Suivant
                </Button>
              )}

              {activeStep === 1 && (
                <LoadingButton 
                  type="submit" 
                  variant="contained" 
                  loading={isGenerating}
                  disabled={!values.test_id || (hasLevels && !values.level_id)}
                >
                  Générer le sujet
                </LoadingButton>
              )}

              {activeStep === STEPS.length - 1 && (
                <Button type="button" variant="contained" onClick={handleReset}>
                  Créer un nouveau sujet
                </Button>
              )}
            </Box>
          )}
        </Form>
      </Card>
    </>
  );
}
