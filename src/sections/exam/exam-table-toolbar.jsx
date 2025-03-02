import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// Mock imports - you'll need to replace with actual data from your API
import { useGetTests } from 'src/actions/test';

// ----------------------------------------------------------------------

export function ExamTableToolbar({ filters, options }) {
  const { currentFilters = { tests: [], levels: [] }, onFilters } = filters || {};
  const { tests = [], levels = [] } = options || {};

  const [selectedTests, setSelectedTests] = useState(currentFilters.tests || []);
  const [selectedLevels, setSelectedLevels] = useState(currentFilters.levels || []);

  // Gérer la sélection des tests
  const handleChangeTests = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;
      setSelectedTests(typeof value === 'string' ? value.split(',') : value);
    },
    []
  );

  // Gérer la sélection des niveaux
  const handleChangeLevels = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;
      setSelectedLevels(typeof value === 'string' ? value.split(',') : value);
    },
    []
  );

  // Mettre à jour les filtres lorsque les sélections changent
  useEffect(() => {
    if (onFilters) {
      onFilters('tests', selectedTests);
      onFilters('levels', selectedLevels);
    }
  }, [onFilters, selectedTests, selectedLevels]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' }, 
      alignItems: { xs: 'flex-start', md: 'center' },
      justifyContent: 'space-between',
      p: 2.5,
      gap: 2
    }}>
      <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
        {/* Sélection des Tests */}
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel id="test-select-label">Tests</InputLabel>
          <Select
            labelId="test-select-label"
            multiple
            value={selectedTests}
            onChange={handleChangeTests}
            input={<OutlinedInput label="Tests" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={tests.find((test) => test.test_id === value)?.label || value}
                    size="small"
                  />
                ))}
              </Box>
            )}
          >
            {tests.map((test) => (
              <MenuItem key={test.test_id} value={test.test_id}>
                <Checkbox checked={selectedTests.indexOf(test.test_id) > -1} />
                {test.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sélection des Niveaux */}
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel id="level-select-label">Niveaux</InputLabel>
          <Select
            labelId="level-select-label"
            multiple
            value={selectedLevels}
            onChange={handleChangeLevels}
            input={<OutlinedInput label="Niveaux" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={levels.find((level) => level.level_id === value)?.label || value}
                    size="small"
                  />
                ))}
              </Box>
            )}
          >
            {levels.map((level) => (
              <MenuItem key={level.level_id} value={level.level_id}>
                <Checkbox checked={selectedLevels.indexOf(level.level_id) > -1} />
                {level.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}

ExamTableToolbar.propTypes = {
  filters: PropTypes.shape({
    currentFilters: PropTypes.object,
    onFilters: PropTypes.func
  }),
  options: PropTypes.shape({
    tests: PropTypes.array,
    levels: PropTypes.array
  })
};
