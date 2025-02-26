import React, { useState, useEffect } from 'react';

import { Stack, TextField, FormControl, Autocomplete } from '@mui/material';

const DynamicTestLevelForm = ({ tests, onTestChange, onLevelChange, selectedTest, selectedLevel }) => {
  const [testLevels, setTestLevels] = useState([]);

  // Effet pour mettre à jour les Levels en fonction du Test sélectionné
  useEffect(() => {
    if (selectedTest) {
      setTestLevels(selectedTest.Levels || []);
    } else {
      setTestLevels([]);
    }
  }, [selectedTest]);

  return (
    <Stack direction="row" spacing={3}>
      {/* Select pour les Tests */}
      <FormControl fullWidth>
        <Autocomplete
          options={tests}
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(option, value) => option.test_id === value.test_id}
          value={selectedTest}
          onChange={(event, value) => {
            onTestChange(value); // Notifier le parent du changement
            setTestLevels(value?.Levels || []); // Mettre à jour les Levels
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select a test" />
          )}
        />
      </FormControl>

      {/* Select pour les Levels */}
      <FormControl fullWidth>
        <Autocomplete
          options={testLevels}
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(option, value) => option.level_id === value.level_id}
          value={selectedLevel}
          onChange={(event, value) => {
            onLevelChange(value); // Notifier le parent du changement
          }}
          disabled={!selectedTest || !testLevels.length}
          renderInput={(params) => (
            <TextField {...params} label="Select a level" />
          )}
        />
      </FormControl>
    </Stack>
  );
};

export default DynamicTestLevelForm;
