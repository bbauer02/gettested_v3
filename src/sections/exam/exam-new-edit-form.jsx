import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import { useRouter } from 'src/routes/hooks';

import { useGetTests } from 'src/actions/test';
import { updateExam, createExam } from 'src/actions/exam';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useGetSkills, useGetSkillsByTest } from 'src/actions/skill';

export function ExamNewEditForm({ currentExam = null }) {
  const router = useRouter();
  const initialLoadRef = useRef(false);

  const { tests, testsLoading } = useGetTests(true);
  const { skills: allSkills, skillsLoading } = useGetSkills(true);
  
  const [testLevels, setTestLevels] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(currentExam?.Test?.test_id || null);
  
  // Récupérer les skills en fonction du test sélectionné (directement depuis l'API)
  const { skills: testSkills, skillsLoading: testSkillsLoading } = useGetSkillsByTest(selectedTestId);

  const defaultValues = useMemo(
    () => ({
      label: currentExam?.label || '',
      test_id: currentExam?.Test || null,
      level_id: currentExam?.Level || null,
      isWritten: currentExam?.isWritten || false,
      isOption: currentExam?.isOption || false,
      price: currentExam?.price || 0,
      coeff: currentExam?.coeff || 1,
      nbrQuestions: currentExam?.nbrQuestions || 0,
      duration: currentExam?.duration || 0,
      successScore: currentExam?.successScore || 0,
      skills: currentExam?.skills || [],
    }),
    [currentExam]
  );

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentExam && tests && !initialLoadRef.current) {
      console.log('Initialisation du formulaire avec les valeurs par défaut');
      reset(defaultValues);
      initialLoadRef.current = true;
      
      // Si un examen est chargé avec un test, nous devons également charger les niveaux associés
      if (currentExam.Test) {
        // Trouver le test complet dans la liste des tests pour avoir accès aux niveaux
        const fullTest = tests.find(test => test.test_id === currentExam.Test.test_id) || 
                        tests.flatMap(test => test.child || []).find(child => child.test_id === currentExam.Test.test_id);
        
        if (fullTest && fullTest.Levels) {
          setTestLevels(fullTest.Levels);
        }
        
        // Log pour déboguer les skills de l'examen en cours d'édition
        console.log('Skills de l\'examen en édition:', currentExam.skills);
        
        // Vérifier si les skills sont des objets complets ou juste des IDs
        if (currentExam.skills && currentExam.skills.length > 0) {
          // Si les skills sont des IDs, les convertir en objets complets
          if (typeof currentExam.skills[0] !== 'object') {
            // Attendre que les skills du test soient chargés
            if (testSkills && testSkills.length > 0) {
              const skillObjects = currentExam.skills.map(skillId => 
                testSkills.find(s => s.skill_id === skillId)
              ).filter(Boolean);
              
              console.log('Skills convertis en objets:', skillObjects);
              setValue('skills', skillObjects);
            }
          }
        }
      }
    }
  }, [currentExam, tests, reset, setValue, defaultValues, testSkills]);

  // Charger les compétences de l'examen en cours d'édition
  const skillsLoadedRef = useRef(false);
  
  useEffect(() => {
    if (currentExam && testSkills && testSkills.length > 0 && selectedTestId === currentExam.Test?.test_id && !skillsLoadedRef.current) {
      console.log('Chargement initial des compétences de l\'examen...');
      skillsLoadedRef.current = true;
      
      // Convertir les IDs des skills en objets complets
      if (currentExam.skills && currentExam.skills.length > 0) {
        const skillObjects = currentExam.skills
          .map(skillId => {
            if (typeof skillId === 'object' && skillId.skill_id) {
              return testSkills.find(s => s.skill_id === skillId.skill_id);
            }
            return testSkills.find(s => s.skill_id === skillId);
          })
          .filter(Boolean);
        
        console.log('Skills convertis en objets pour le test actuel:', skillObjects);
        setValue('skills', skillObjects);
      }
    }
  }, [currentExam, testSkills, selectedTestId, setValue]);

  // Logs pour déboguer le chargement des skills
  useEffect(() => {
    console.log('Skills chargés depuis l\'API:', allSkills);
    console.log('Tests chargés depuis l\'API:', tests);
    console.log('Chargement des skills en cours:', skillsLoading);
  }, [allSkills, tests, skillsLoading]);
  
  // Surveiller les changements de test sélectionné
  useEffect(() => {
    if (selectedTestId) {
      console.log('Test ID sélectionné:', selectedTestId);
      console.log('Skills disponibles:', testSkills);
    }
  }, [selectedTestId, testSkills]);

  // Surveiller les changements de test dans le formulaire
  const selectedTest = watch('test_id');
  
  // Définir handleTestChange de manière plus simple
  function handleTestChange(newTest) {
    console.log('NOUVEAU handleTestChange appelé avec:', newTest);
    
    if (!newTest) {
      // Si aucun test n'est sélectionné, réinitialiser les valeurs
      console.log('Réinitialisation des valeurs car aucun test sélectionné');
      setValue('test_id', null);
      setValue('level_id', null);
      setValue('skills', []);
      setTestLevels([]);
      setSelectedTestId(null);
      return;
    }
    
    // Extraire l'ID du test (qu'il soit un objet complet ou juste un ID)
    const testId = newTest.test_id;
    console.log('Nouveau test ID:', testId);
    console.log('Ancien test ID:', selectedTestId);
    
    // Si le même test est déjà sélectionné, ne rien faire
    if (testId === selectedTestId) {
      console.log('Même test déjà sélectionné, pas de changement');
      return;
    }
    
    // Trouver le test complet dans la liste des tests
    const fullTest = tests?.find(test => test.test_id === testId) || 
                    tests?.flatMap(test => test.child || []).find(child => child.test_id === testId);
    
    console.log('Test complet trouvé:', fullTest);
    
    // Mettre à jour le test ID sélectionné
    setSelectedTestId(testId);
    
    // Charger les niveaux associés au test sélectionné
    if (fullTest && fullTest.Levels) {
      console.log('Mise à jour des niveaux:', fullTest.Levels);
      setTestLevels(fullTest.Levels);
    } else {
      console.log('Aucun niveau trouvé, réinitialisation');
      setTestLevels([]);
    }
    
    // Réinitialiser le niveau quand on change de test
    setValue('level_id', null);
    
    // Réinitialiser les skills quand on change de test
    setValue('skills', []);
    console.log('Compétences réinitialisées suite au changement de test');
  }
  
  // Détecter les changements de test et appeler handleTestChange
  useEffect(() => {
    console.log('Effet pour le test déclenché, selectedTest =', selectedTest);
    // Ne pas déclencher handleTestChange si nous sommes en train de réinitialiser le formulaire
    if (initialLoadRef.current && selectedTest && (!selectedTestId || selectedTest.test_id !== selectedTestId)) {
      console.log('Changement de test détecté, appel de handleTestChange');
      handleTestChange(selectedTest);
    }
  }, [selectedTest, selectedTestId]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Formater les données pour l'API
      const formattedData = {
        label: data.label,
        test_id: data.test_id.test_id,
        level_id: data.level_id ? data.level_id.level_id : null,
        isWritten: data.isWritten,
        isOption: data.isOption,
        price: Number(data.price),
        coeff: Number(data.coeff),
        nbrQuestions: Number(data.nbrQuestions),
        duration: Number(data.duration),
        successScore: Number(data.successScore),
        skills: data.skills.map(skill => {
          // Vérifier si skill est un objet ou un ID
          if (typeof skill === 'object' && skill.skill_id) {
            return skill.skill_id;
          }
          return skill;
        }),
      };

      console.info('DATA', formattedData);

      // Appel API
      if (currentExam) {
        await updateExam(currentExam.exam_id, formattedData);
        console.log('Mise à jour de l\'examen:', formattedData);
      } else {
        await createExam(formattedData);
        console.log('Création d\'un nouvel examen:', formattedData);
      }

      toast.success(currentExam ? 'Mise à jour réussie!' : 'Création réussie!');

      // Redirection vers la liste des examens
      router.push(paths.dashboard.exam.root);
    } catch (error) {
      console.error(error);
      
      // Afficher un message d'erreur plus spécifique si disponible
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
      toast.error(errorMessage);
    }
  });

  // Gérer les skills en fonction du test sélectionné
  const getTestSkills = useCallback(() => {
    console.log('getTestSkills appelé');
    
    if (!selectedTestId) {
      console.log('Aucun test sélectionné, retour tableau vide');
      return [];
    }
    
    // Utiliser directement testSkills qui est chargé depuis l'API
    return testSkills || [];
  }, [selectedTestId, testSkills]);

  // Sections du formulaire
  const renderDetails = (
    <Card>
      <CardHeader title="Général" subheader="Informations principales de l'examen" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Nom de l'examen</Typography>
          <Field.Text name="label" placeholder="Ex: Examen de certification..." />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Stack spacing={1.5} sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Typography variant="subtitle2">Test</Typography>
            <Field.Autocomplete
              name="test_id"
              placeholder="Choisissez un test"
              autoHighlight
              options={tests || []}
              defaultValue={null}
              onChange={(event, newValue) => {
                console.log("onChange direct de l'Autocomplete appelé avec:", newValue);
                handleTestChange(newValue);
              }}
              getOptionLabel={(option) => option?.label || ''}
              isOptionEqualToValue={(option, value) => option?.test_id === value?.test_id}
              renderOption={(props, option) => (
                <li {...props} key={option.test_id}>
                  {option.label}
                </li>
              )}
              sx={{ width: '100%' }}
            />
          </Stack>

          <Stack spacing={1.5} sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Typography variant="subtitle2">Niveau</Typography>
            <Field.Autocomplete
              name="level_id"
              placeholder="Choisissez un niveau"
              autoHighlight
              disabled={!selectedTestId || !testLevels || testLevels.length === 0 || testsLoading}
              options={testLevels || []}
              onChange={(event, newValue) => {
                console.log("Niveau sélectionné:", newValue);
              }}
              getOptionLabel={(option) => option?.label || ''}
              isOptionEqualToValue={(option, value) => option?.level_id === value?.level_id}
              renderOption={(props, option) => (
                <li {...props} key={option.level_id}>
                  {option.label}
                </li>
              )}
              sx={{ width: '100%' }}
            />
          </Stack>
        </Stack>

        <Stack spacing={1.5} sx={{ width: '100%' }}>
          <Typography variant="subtitle2">Compétences associées</Typography>
          <Field.Autocomplete
            name="skills"
            multiple
            label="Compétences"
            placeholder="+ Sélectionner des compétences"
            disabled={!selectedTestId || testSkillsLoading}
            loading={testSkillsLoading}
            disableCloseOnSelect
            options={getTestSkills()}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              if (!option) return '';
              return option.label;
            }}
            isOptionEqualToValue={(option, value) => {
              if (!option || !value) return false;
              // Vérifier si on compare des objets ou des IDs
              if (typeof value === 'object' && value.skill_id) {
                return option.skill_id === value.skill_id;
              }
              // Si value est un ID directement
              if (typeof value === 'string' || typeof value === 'number') {
                return option.skill_id === value;
              }
              return option.skill_id === value.skill_id;
            }}
            onChange={(event, newValue) => {
              console.log('Nouvelles compétences sélectionnées:', newValue);
              setValue('skills', newValue, { shouldValidate: true });
            }}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <li
                  {...otherProps}
                  key={option.skill_id}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      pl: option.parent_id ? 2 : 0,
                      py: 0.75,
                      borderLeft: (theme) => option.parent_id ?
                        `1px solid ${theme.palette.divider}` : 'none',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderLeftColor: (theme) => option.parent_id ?
                          theme.palette.primary.light : 'none'
                      }
                    }}
                  >
                    {option.parent_id && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mr: 1,
                          '&::before': {
                            content: '""',
                            width: '12px',
                            height: '1px',
                            bgcolor: 'divider',
                            mr: 1
                          }
                        }}
                      >
                        <Iconify
                          key={`icon-${option.skill_id}`}
                          icon="eva:arrow-right-outline"
                          width={16}
                          sx={{ color: 'text.secondary' }}
                        />
                      </Box>
                    )}
                    {option.label}
                  </Box>
                </li>
              );
            }}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.skill_id || index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {option.parent_id && (
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {getTestSkills()
                            .find(skill => skill.skill_id === option.parent_id)?.label} →
                        </Typography>
                      )}
                      {option.label}
                    </Box>
                  }
                  size="small"
                  color="info"
                  variant="soft"
                  onDelete={() => {
                    const currentSkills = [...(watch('skills') || [])];
                    const updatedSkills = currentSkills.filter(
                      skill => skill.skill_id !== option.skill_id
                    );
                    setValue('skills', updatedSkills, { shouldValidate: true });
                    console.log('Compétence supprimée:', option.label);
                  }}
                />
              ))
            }
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Propriétés"
        subheader="Durée, prix, coefficient..."
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Stack spacing={1.5} sx={{ width: '100%' }}>
            <Typography variant="subtitle2">Durée (minutes)</Typography>
            <Field.Text
              name="duration"
              placeholder="60"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>Min :</Box>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Stack spacing={1.5} sx={{ width: '100%' }}>
            <Typography variant="subtitle2">Prix</Typography>
            <Field.Text
              name="price"
              placeholder="0"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>€ :</Box>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Stack spacing={1.5} sx={{ width: '100%' }}>
            <Typography variant="subtitle2">Coefficient</Typography>
            <Field.Text
              name="coeff"
              placeholder="1"
              type="number"
            />
          </Stack>
          <Stack spacing={1.5} sx={{ width: '100%' }}>
            <Typography variant="subtitle2">Nombre de questions</Typography>
            <Field.Text
              name="nbrQuestions"
              placeholder="10"
              type="number"
            />
          </Stack>
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Score de réussite</Typography>
          <Field.Text
            name="successScore"
            placeholder="70"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>% :</Box>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <FormControlLabel
            control={<Field.Switch name="isWritten" />}
            label="Examen écrit"
            sx={{ width: '100%' }}
          />
          <FormControlLabel
            control={<Field.Switch name="isOption" />}
            label="Option"
            sx={{ width: '100%' }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {renderDetails}
        {renderProperties}

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {currentExam ? 'Enregistrer les modifications' : 'Créer l\'examen'}
        </LoadingButton>
      </Stack>
    </Form>
  );
}
