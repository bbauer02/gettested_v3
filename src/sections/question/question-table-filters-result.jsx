import { useCallback } from 'react';
import { upperFirst } from 'es-toolkit';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

export function QuestionTableFiltersResult({ filters, totalResults, sx }) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  // Gestionnaire pour supprimer un test
  const handleRemoveTest = useCallback(
    (inputValue) => {
      const newTests = currentFilters.tests.filter((item) => item !== inputValue);

      // Supprime les niveaux associés au test supprimé
      const newLevels = currentFilters.levels.filter(
        (level) => !level.startsWith(inputValue)
      );

      updateFilters({
        ...currentFilters,
        tests: newTests,
        levels: newLevels
      });
    },
    [updateFilters, currentFilters]
  );

  // Gestionnaire pour supprimer un niveau
  const handleRemoveLevel = useCallback(
    (levelToRemove) => {
      const newLevels = currentFilters.levels.filter(level => level !== levelToRemove);

      // Si c'est le dernier niveau d'un test, ne pas modifier les tests sélectionnés
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
      onReset={() => resetFilters()}
      sx={sx}
    >
      {/* Affichage des tests filtrés */}
      <FiltersBlock
        label="Tests:"
        isShow={!!currentFilters.tests.length}
      >
        {currentFilters.tests.map((test) => (
          <Chip
            {...chipProps}
            key={`test-${test}`}
            label={upperFirst(test)}
            onDelete={() => handleRemoveTest(test)}
          />
        ))}
      </FiltersBlock>

      {/* Affichage des niveaux filtrés */}
      <FiltersBlock
        label="Levels:"
        isShow={!!(currentFilters.levels && currentFilters.levels.length)}
      >
        {currentFilters.levels && currentFilters.levels.map((level) => (
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
