import { useCallback, useState, useEffect } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

export function SubjectTableToolbar({ filters, options }) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const [localTests, setLocalTests] = useState(currentFilters.tests || []);
  const [localLevels, setLocalLevels] = useState(currentFilters.levels || []);

  // Sync local state with filter state
  useEffect(() => {
    setLocalTests(currentFilters.tests || []);
    setLocalLevels(currentFilters.levels || []);
  }, [currentFilters]);

  // Handle test selection
  const handleChangeTest = useCallback((event) => {
    const { value } = event.target;
    const newTests = typeof value === 'string' ? value.split(',') : value;
    setLocalTests(newTests);

    // Get available levels for selected tests
    const availableLevels = options.tests
      .filter((test) => newTests.includes(test.label))
      .flatMap((test) =>
        test.Levels?.map((level) => ({
          level_id: level.level_id,
          label: `${test.label} - ${level.label}`,
        })) || []
      );

    // Keep only valid levels in selection
    const newLevels = localLevels.filter((level) =>
      availableLevels.some((availableLevel) => availableLevel.label === level)
    );
    setLocalLevels(newLevels);

    // Update parent filters
    updateFilters({
      ...currentFilters,
      tests: newTests,
      levels: newLevels,
    });
  }, [options.tests, currentFilters, localLevels, updateFilters]);

  // Handle level selection
  const handleChangeLevel = useCallback((event) => {
    const { value } = event.target;
    setLocalLevels(value);
    updateFilters({
      ...currentFilters,
      levels: value,
    });
  }, [currentFilters, updateFilters]);

  // Calculate available levels based on selected tests
  const availableLevels = options.tests
    ?.filter((test) => localTests.includes(test.label))
    .flatMap((test) =>
      test.Levels?.map((level) => ({
        level_id: level.level_id,
        label: `${test.label} - ${level.label}`,
      })) || []
    ) || [];

  const hasAvailableLevels = options.tests
    ?.filter((test) => localTests.includes(test.label))
    .some((test) => test.Levels?.length > 0);

  return (
    <>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-test-select">Test</InputLabel>
        <Select
          multiple
          value={localTests}
          onChange={handleChangeTest}
          input={<OutlinedInput label="Test" />}
          renderValue={(selected) => selected.join(', ')}
          inputProps={{ id: 'filter-test-select' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.tests?.map((option) => (
            <MenuItem key={option.test_id} value={option.label}>
              <Checkbox
                disableRipple
                size="small"
                checked={localTests.includes(option.label)}
              />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-level-select">Level</InputLabel>
        <Select
          disabled={!localTests.length || !hasAvailableLevels}
          multiple
          value={localLevels}
          onChange={handleChangeLevel}
          input={<OutlinedInput label="Level" />}
          renderValue={(selected) => selected.join(', ')}
          inputProps={{ id: 'filter-level-select' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {availableLevels.map((option) => (
            <MenuItem key={option.level_id} value={option.label}>
              <Checkbox
                disableRipple
                size="small"
                checked={localLevels.includes(option.label)}
              />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
