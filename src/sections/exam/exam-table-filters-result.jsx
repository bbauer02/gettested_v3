import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

// Mock imports - you'll need to replace with actual data from your API
import { useGetTests } from 'src/actions/test';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function ExamTableFiltersResult({ filters, totalResults, sx }) {
  const { tests } = useGetTests();

  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveTest = useCallback(
    (inputValue) => {
      const newValue = currentFilters.test.filter((item) => item !== inputValue);

      updateFilters({ test: newValue });
    },
    [updateFilters, currentFilters.test]
  );

  const handleRemoveLevel = useCallback(
    (inputValue) => {
      const newValue = currentFilters.level.filter((item) => item !== inputValue);

      updateFilters({ level: newValue });
    },
    [updateFilters, currentFilters.level]
  );

  const getTestLabel = (testId) => {
    // Find test in main tests array
    const test = tests?.find(t => t.test_id.toString() === testId);
    if (test) return test.label;

    // If not found, check in child tests
    for (const parent of tests || []) {
      if (parent.child && Array.isArray(parent.child)) {
        const childTest = parent.child.find(t => t.test_id.toString() === testId);
        if (childTest) return childTest.label;
      }
    }

    return testId;
  };

  const getLevelLabel = (levelId) => {
    // Check all possible locations for levels
    for (const test of tests || []) {
      // Check in main test's levels
      if (test.Levels && Array.isArray(test.Levels)) {
        const level = test.Levels.find(l => l.level_id.toString() === levelId);
        if (level) return level.label;
      }

      // Check in child tests' levels
      if (test.child && Array.isArray(test.child)) {
        for (const child of test.child) {
          if (child.Levels && Array.isArray(child.Levels)) {
            const level = child.Levels.find(l => l.level_id.toString() === levelId);
            if (level) return level.label;
          }
        }
      }
    }

    return levelId;
  };

  return (
    <FiltersResult totalResults={totalResults} onReset={() => resetFilters()} sx={sx}>
      <FiltersBlock label="Test:" isShow={!!currentFilters?.test?.length}>
        {currentFilters?.test?.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={getTestLabel(item)}
            onDelete={() => handleRemoveTest(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Level:" isShow={!!currentFilters?.level?.length}>
        {currentFilters?.level?.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={getLevelLabel(item)}
            onDelete={() => handleRemoveLevel(item)}
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
