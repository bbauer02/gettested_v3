import PropTypes from 'prop-types';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Radio from '@mui/material/Radio';
import Button from "@mui/material/Button";
import Switch from '@mui/material/Switch';
import Divider from "@mui/material/Divider";
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

export function QuestionNewEditMcqUcq({ type = 'MCQ', title = 'Question' }) {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'mcqItems'
  });

  const values = watch();
  const isMultipleChoice = type === 'MCQ';

  const handleAnswerChange = (index, value) => {
    if (isMultipleChoice) {
      // Pour QCM : toggle la réponse sélectionnée
      setValue(`mcqItems[${index}].isCorrect`, value, {
        shouldValidate: true,
        shouldDirty: true
      });
    } else {
      // Pour QCU : désélectionne toutes les autres réponses
      fields.forEach((_, i) => {
        setValue(`mcqItems[${i}].isCorrect`, i === index ? value : false, {
          shouldValidate: true,
          shouldDirty: true
        });
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {/* Question field */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">{title}</Typography>
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

              {isMultipleChoice ? (
                // Switch pour QCM
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.mcqItems?.[index]?.isCorrect || false}
                      onChange={(event) => handleAnswerChange(index, event.target.checked)}
                    />
                  }
                  label="Correct"
                />
              ) : (
                // Radio pour QCU
                <FormControlLabel
                  control={
                    <Radio
                      checked={values.mcqItems?.[index]?.isCorrect || false}
                      onChange={(event) => handleAnswerChange(index, event.target.checked)}
                    />
                  }
                  label="Correct"
                />
              )}

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
        {isMultipleChoice
          ? "Toggle switches to mark correct answers. Multiple correct answers are allowed."
          : "Select one radio button to mark the correct answer. Only one answer can be correct."
        }
      </Typography>
    </Box>
  );
}

QuestionNewEditMcqUcq.propTypes = {
  type: PropTypes.oneOf(['MCQ', 'UCQ']),
  title: PropTypes.string
};
