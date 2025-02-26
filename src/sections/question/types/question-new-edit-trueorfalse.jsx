import { useFormContext } from 'react-hook-form';
import Stack from "@mui/material/Stack";
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import { Field } from 'src/components/hook-form';

export function QuestionNewEditTrueOrFalse() {
  const { setValue, watch } = useFormContext();
  const values = watch();

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Question</Typography>
          <Field.Editor name="truefalseQuestion" sx={{ maxHeight: 480 }} placeholder="Enter your true/false question"/>
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Correct Answer</Typography>
          <RadioGroup
            name="correctAnswer"
            value={String(values.correctAnswer)}
            onChange={(event) => {
              setValue('correctAnswer', event.target.value === 'true', {
                shouldValidate: true,
                shouldDirty: true
              });
            }}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="True"
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="False"
            />
          </RadioGroup>
        </Stack>
      </Stack>
    </Box>
  );
}







