import { useCallback, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

export function ExamTableToolbar({ filters, options }) {
  const { state: currentFilters, setState: updateFilters } = filters;


  const [selectedTests, setSelectedTests] = useState(currentFilters.tests || []);
  const [selectedLevels, setSelectedLevels] = useState(currentFilters.levels || []);

  // Gérer la sélection des tests
  const handleChangeTest = useCallback(
    (event) => {
      const { value } = event.target;
      setSelectedTests(typeof value === 'string' ? value.split(',') : value);

      // Mettre à jour la liste des niveaux disponibles
      const availableLevels = options.tests
        .filter((test) => value.includes(test.label))
        .flatMap((test) =>
          test.Levels.map((level) => ({
            level_id: level.level_id,
            label: `${test.label} - ${level.label}`,
          }))
        );

      // Conserver uniquement les niveaux sélectionnés qui sont encore valides
      const validSelectedLevels = selectedLevels.filter((level) =>
        availableLevels.some((availableLevel) => availableLevel.label === level)
      );

      setSelectedLevels(validSelectedLevels);
      updateFilters({
        ...currentFilters,
        tests: value,
        levels: validSelectedLevels,
      });
    },
    [options.tests, currentFilters, selectedLevels, updateFilters]
  );

  // Gérer la sélection des niveaux
  const handleChangeLevel = useCallback((event) => {
    const { value } = event.target;
    setSelectedLevels(value);
  }, []);

  // Appliquer le filtre de test
  const handleFilterTest = useCallback(() => {
    updateFilters({
      ...currentFilters,
      tests: selectedTests,
      levels: selectedLevels,
    });
  }, [updateFilters, selectedTests, selectedLevels, currentFilters]);

  // Appliquer le filtre de niveau
  const handleFilterLevel = useCallback(() => {
    updateFilters({
      ...currentFilters,
      levels: selectedLevels,
    });
  }, [updateFilters, selectedLevels, currentFilters]);

  // Calculer les niveaux disponibles basés sur les tests sélectionnés
  const availableLevels = options.tests
    .filter(test => selectedTests.includes(test.label) && test.Levels && test.Levels.length > 0)
    .flatMap(test => test.Levels.map(level => ({
      level_id: level.level_id,
      label: `${test.label} - ${level.label}`
    })));

  const hasAvailableLevels = useCallback(() => options.tests
    .filter((test) => selectedTests.includes(test.label))
    .some((test) => test.Levels && test.Levels.length > 0), [selectedTests, options.tests]);

  return (
    <>
      {/* Sélection des Tests */}
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-test-select">Test</InputLabel>
        <Select
          multiple
          value={selectedTests}
          onChange={handleChangeTest}
          onClose={handleFilterTest}
          input={<OutlinedInput label="Test" />}
          renderValue={(selected) => selected.join(', ')}
          inputProps={{ id: 'filter-test-select' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.tests.map((option) => (
            <MenuItem key={option.test_id} value={option.label}>
              <Checkbox disableRipple size="small" checked={selectedTests.includes(option.label)} />
              {option.label}
            </MenuItem>
          ))}

          <MenuItem
            onClick={handleFilterTest}
            sx={[
              (theme) => ({
                justifyContent: 'center',
                fontWeight: theme.typography.button,
                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              }),
            ]}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl>

      {/* Sélection des Levels */}
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-level-select">Level</InputLabel>
        <Select
          disabled={!selectedTests.length || !hasAvailableLevels()}
          multiple
          value={selectedLevels}
          onChange={handleChangeLevel}
          onClose={handleFilterLevel}
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
                checked={selectedLevels.includes(option.label)}
              />
              {option.label}
            </MenuItem>
          ))}

          <MenuItem
            onClick={handleFilterLevel}
            sx={[
              (theme) => ({
                justifyContent: 'center',
                fontWeight: theme.typography.button,
                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              }),
            ]}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
