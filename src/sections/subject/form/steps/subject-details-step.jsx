import { useMemo, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { Stack, TextField, Card, CardHeader, Divider, Typography, Button } from '@mui/material';

import { useGetTests } from 'src/actions/test';

import DynamicTestLevelForm from 'src/components/gettested-custom/dynamic-test-level-form'; // Assurez-vous que c'est le bon chemin

export function SubjectDetailsStep() {
  const { watch } = useFormContext();
  const { tests, testsLoading } = useGetTests(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);



  const { control, setValue } = useFormContext();

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Subject Name"
        name="name"
        required
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        multiline
        rows={4}
      />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Controller
          name="test"
          control={control}
          render={({ field }) => (
            <DynamicTestLevelForm
              tests={tests}
              selectedTest={selectedTest}
              selectedLevel={selectedLevel}
              onTestChange={(value) => {
                setSelectedTest(value);
                field.onChange(value); // Mettre à jour la valeur du champ "test"
              }}
              onLevelChange={(value) => {
                setSelectedLevel(value);
                setValue('level', value);
                // Mettre à jour la valeur du champ "level" si nécessaire
              }}
            />
          )}
        />
      </Stack>
    </Stack>
  );
}
