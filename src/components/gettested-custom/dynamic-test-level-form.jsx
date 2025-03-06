import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField, FormControl, Autocomplete } from '@mui/material';

const DynamicTestLevelForm = ({ tests, onTestChange, onLevelChange, selectedTest, selectedLevel }) => {
  const [testLevels, setTestLevels] = useState([]);

  // Effet pour mettre à jour les Levels en fonction du Test sélectionné
  useEffect(() => {
    if (selectedTest) {
      console.log('DynamicTestLevelForm - Setting testLevels from selectedTest:', selectedTest);
      const levels = selectedTest.Levels || [];
      setTestLevels(levels);
      
      // Si le test n'a pas de niveaux, réinitialiser le niveau sélectionné
      if (levels.length === 0 && selectedLevel) {
        console.log('Test has no levels, resetting selectedLevel');
        onLevelChange(null);
      }
    } else {
      setTestLevels([]);
      if (selectedLevel) {
        console.log('No test selected, resetting selectedLevel');
        onLevelChange(null);
      }
    }
  }, [selectedTest, selectedLevel, onLevelChange]);

  // Afficher les valeurs pour le débogage
  useEffect(() => {
    console.log('DynamicTestLevelForm - selectedTest:', selectedTest);
    console.log('DynamicTestLevelForm - selectedLevel:', selectedLevel);
    console.log('DynamicTestLevelForm - testLevels:', testLevels);
  }, [selectedTest, selectedLevel, testLevels]);

  const getTestId = (test) => test?.id || test?.test_id;
  const getLevelId = (level) => level?.id || level?.level_id;

  return (
    <Stack direction="row" spacing={3}>
      {/* Select pour les Tests */}
      <FormControl fullWidth>
        <Autocomplete
          options={tests || []}
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(option, value) => {
            if (!option || !value) return false;
            return getTestId(option) === getTestId(value);
          }}
          value={selectedTest}
          onChange={(event, value) => {
            console.log('Test changed to:', value);
            onTestChange(value); // Notifier le parent du changement
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Sélectionner un test" 
              error={!selectedTest}
              helperText={!selectedTest ? "Le test est requis" : ""}
            />
          )}
        />
      </FormControl>

      {/* Select pour les Levels */}
      <FormControl fullWidth>
        <Autocomplete
          options={testLevels}
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(option, value) => {
            if (!option || !value) return false;
            return getLevelId(option) === getLevelId(value);
          }}
          value={selectedLevel}
          onChange={(event, value) => {
            console.log('Level changed to:', value);
            onLevelChange(value); // Notifier le parent du changement
          }}
          disabled={!selectedTest || !testLevels.length}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Sélectionner un niveau" 
              error={selectedTest && testLevels.length > 0 && !selectedLevel}
              helperText={
                selectedTest && testLevels.length === 0 
                  ? "Aucun niveau disponible pour ce test" 
                  : selectedTest && testLevels.length > 0 && !selectedLevel 
                    ? "Le niveau est requis" 
                    : ""
              }
            />
          )}
        />
      </FormControl>
    </Stack>
  );
};

DynamicTestLevelForm.propTypes = {
  tests: PropTypes.array,
  onTestChange: PropTypes.func.isRequired,
  onLevelChange: PropTypes.func.isRequired,
  selectedTest: PropTypes.object,
  selectedLevel: PropTypes.object,
};

export default DynamicTestLevelForm;
