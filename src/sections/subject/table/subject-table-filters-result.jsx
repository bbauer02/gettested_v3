import { useCallback } from 'react';
import { upperFirst } from 'es-toolkit';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

export function SubjectTableFiltersResult({ filters, totalResults, sx }) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  // Handle removing a test
  const handleRemoveTest = useCallback(
    (testToRemove) => {
      const newTests = currentFilters.tests.filter((test) => test !== testToRemove);

      // Remove levels associated with the removed test
      const newLevels = currentFilters.levels.filter(
        (level) => !level.startsWith(testToRemove)
      );

      updateFilters({
        ...currentFilters,
        tests: newTests,
        levels: newLevels
      });
    },
    [updateFilters, currentFilters]
  );

  // Handle removing a level
  const handleRemoveLevel = useCallback(
    (levelToRemove) => {
      const newLevels = currentFilters.levels.filter((level) => level !== levelToRemove);
      updateFilters({
        ...currentFilters,
        levels: newLevels
      });
    },
    [updateFilters, currentFilters]
  );

  return (
    <FiltersResult
      totalResults={totalResults}
      onReset={resetFilters}
      sx={sx}
    >
      <FiltersBlock
        label="Tests:"
        isShow={!!currentFilters.tests?.length}
      >
        {currentFilters.tests?.map((test) => (
          <Chip
            {...chipProps}
            key={`test-${test}`}
            label={upperFirst(test)}
            onDelete={() => handleRemoveTest(test)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="Levels:"
        isShow={!!(currentFilters.levels?.length)}
      >
        {currentFilters.levels?.map((level) => (
          <Chip
            {...chipProps}
            key={`level-${level}`}
            label={upperFirst(level)}
            onDelete={() => handleRemoveLevel(level)}
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
