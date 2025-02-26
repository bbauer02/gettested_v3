import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Switch from '@mui/material/Switch';
import Divider from "@mui/material/Divider";
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

export function QuestionNewEditMcq() {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'mcqItems'
  });

  const values = watch();

  return (
    <Box sx={{ p: 3 }}>
      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {/* Question field */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Question</Typography>
          <Field.Editor
            name="mcqQuestion"
            sx={{ minHeight: 200 }}
          />
        </Stack>

        {/* Answers section */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Answers</Typography>

          {fields.map((item, index) => (
            <Stack
              key={item.id}
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ width: 1, mb: 2 }}
            >
              <Field.Text
                size="small"
                name={`mcqItems[${index}].answer`}
                placeholder="Enter an answer..."
                sx={{ flexGrow: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={values.mcqItems?.[index]?.isCorrect || false}
                    onChange={(event) => {
                      setValue(`mcqItems[${index}].isCorrect`, event.target.checked, {
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                  />
                }
                label="Correct"
              />

              <Button
                size="small"
                color="error"
                onClick={() => remove(index)}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </Button>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      {/* Add answer button */}
      <Button
        size="medium"
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={() => append({ answer: '', isCorrect: false })}
      >
        Add Answer Option
      </Button>

      {/* Helper text */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: 2,
          color: 'text.secondary',
          fontStyle: 'italic'
        }}
      >
        Toggle switches to mark correct answers. Multiple correct answers are allowed.
      </Typography>
    </Box>
  );
}
