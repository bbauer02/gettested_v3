import { useMemo, useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import { 
  Stack, 
  TextField, 
  Card, 
  CardHeader, 
  Divider, 
  Typography, 
  Button,
  MenuItem,
  InputAdornment
} from '@mui/material';

import { useGetTests } from 'src/actions/test';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

import DynamicTestLevelForm from 'src/components/gettested-custom/dynamic-test-level-form';

export function SubjectCreateStep1({ onLevelsChange }) {
  const { watch, setValue, control, formState: { errors }, clearErrors } = useFormContext();
  const { tests, testsLoading } = useGetTests(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const values = watch();

  // Afficher les valeurs pour le débogage
  useEffect(() => {
    console.log('Step1 - values:', values);
    console.log('Step1 - selectedTest:', selectedTest);
    console.log('Step1 - selectedLevel:', selectedLevel);
  }, [values, selectedTest, selectedLevel]);

  // Mettre à jour hasLevels lorsque le test change
  useEffect(() => {
    if (selectedTest && selectedTest.Levels && selectedTest.Levels.length > 0) {
      console.log('Test has levels, setting hasLevels to true');
      onLevelsChange(true);
    } else {
      console.log('Test has no levels, setting hasLevels to false');
      onLevelsChange(false);
    }
  }, [selectedTest, onLevelsChange]);

  // Initialiser selectedTest et selectedLevel à partir des valeurs du formulaire
  useEffect(() => {
    if (tests && tests.length > 0) {
      // Chercher le test par ID
      if (values.test_id) {
        const foundTest = tests.find(test => 
          test.id === values.test_id || test.test_id === values.test_id
        );
        
        if (foundTest && (!selectedTest || (selectedTest.id !== foundTest.id && selectedTest.test_id !== foundTest.test_id))) {
          console.log('Setting selectedTest:', foundTest);
          setSelectedTest(foundTest);
        }

        // Chercher le niveau par ID si le test est trouvé
        if (foundTest && foundTest.Levels && values.level_id) {
          const foundLevel = foundTest.Levels.find(level => 
            level.id === values.level_id || level.level_id === values.level_id
          );
          
          if (foundLevel && (!selectedLevel || (selectedLevel.id !== foundLevel.id && selectedLevel.level_id !== foundLevel.level_id))) {
            console.log('Setting selectedLevel:', foundLevel);
            setSelectedLevel(foundLevel);
          }
        }
      }
    }
  }, [tests, values.test_id, values.level_id, selectedTest, selectedLevel]);

  // Mettre à jour les valeurs test_id et level_id lorsque les sélections changent
  useEffect(() => {
    if (selectedTest) {
      const testId = selectedTest.id || selectedTest.test_id;
      if (testId) {
        console.log('Setting test_id to:', testId);
        setValue('test_id', testId, { shouldValidate: true });
        clearErrors('test_id');
      }
    }
    
    if (selectedLevel) {
      const levelId = selectedLevel.id || selectedLevel.level_id;
      if (levelId) {
        console.log('Setting level_id to:', levelId);
        setValue('level_id', levelId, { shouldValidate: true });
        clearErrors('level_id');
      }
    }
  }, [selectedTest, selectedLevel, setValue, clearErrors]);

  // Fonction pour gérer le changement de test
  const handleTestChange = (value) => {
    console.log('handleTestChange called with:', value);
    
    // Réinitialiser le niveau à chaque changement de test
    setSelectedLevel(null);
    setValue('level_id', null);
    
    // Mettre à jour le test sélectionné
    setSelectedTest(value);
    
    // Si aucun test n'est sélectionné, réinitialiser test_id
    if (!value) {
      setValue('test_id', null);
    } else {
      // Définir immédiatement test_id pour éviter les problèmes de synchronisation
      const testId = value.id || value.test_id;
      if (testId) {
        setValue('test_id', testId, { shouldValidate: true });
      }
    }
  };

  // Fonction pour gérer le changement de niveau
  const handleLevelChange = (value) => {
    console.log('handleLevelChange called with:', value);
    setSelectedLevel(value);
    
    // Si aucun niveau n'est sélectionné, réinitialiser level_id
    if (!value) {
      setValue('level_id', null);
    } else {
      // Définir immédiatement level_id pour éviter les problèmes de synchronisation
      const levelId = value.id || value.level_id;
      if (levelId) {
        setValue('level_id', levelId, { shouldValidate: true });
      }
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Informations générales
      </Typography>

      <RHFTextField
        name="title"
        label="Titre du sujet"
        placeholder="Ex: Sujet d'examen - Test de compétences 2025"
        required
      />
      
      <RHFTextField
        name="description"
        label="Description"
        placeholder="Décrivez brièvement ce sujet d'examen"
        multiline
        rows={4}
        required
      />

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Test et niveau
      </Typography>

      <Controller
        name="test_id"
        control={control}
        render={({ field }) => (
          <DynamicTestLevelForm
            tests={tests}
            selectedTest={selectedTest}
            selectedLevel={selectedLevel}
            onTestChange={handleTestChange}
            onLevelChange={handleLevelChange}
          />
        )}
      />

      {/* Afficher les valeurs actuelles pour le débogage */}
      <Typography variant="caption" color="text.secondary">
        Valeurs actuelles: test_id={values.test_id}, level_id={values.level_id}
      </Typography>

      {/* Afficher les erreurs de validation */}
      {errors.test_id && (
        <Typography color="error" variant="caption">
          {errors.test_id.message}
        </Typography>
      )}
      
      {errors.level_id && (
        <Typography color="error" variant="caption">
          {errors.level_id.message}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Configuration du sujet
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField
          name="totalDuration"
          label="Durée totale"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
          }}
          required
        />
        
        <RHFTextField
          name="totalPoints"
          label="Points totaux"
          type="number"
          required
        />
      </Stack>

      <RHFTextField
        name="requiredPoints"
        label="Points requis pour réussir"
        type="number"
        required
        helperText="Le nombre de points nécessaires pour valider le sujet"
      />
    </Stack>
  );
}

SubjectCreateStep1.propTypes = {
  onLevelsChange: PropTypes.func.isRequired,
};
