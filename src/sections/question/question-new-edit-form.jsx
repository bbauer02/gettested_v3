import { z as zod } from 'zod';
import {useMemo, useEffect, useState} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller,  useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useGetTests} from "src/actions/test";
import {QuestionNewEditMcq} from "./question-new-edit-mcq";


export const NewQuestionSchema = zod.object({
  label: zod.string().min(1, { message: 'Label is required!' }),
  instruction: zod.string().min(1, { message: 'instruction is required!' }),
  timemax: zod.number().min(1, { message: 'Duration is required!' }),
  point: zod.number().min(1, { message: 'Point is required!' }),
  test:schemaHelper.objectOrNull({message: { required_error: 'test is required!' },}),
  level: zod.object({level_id: zod.number(), label: zod.string(),}).nullable(),
  type:schemaHelper.objectOrNull({message: { required_error: 'type is required!' },}),
}).superRefine((data, ctx) => {
    // Validation plus détaillée
    if (data.test && data.test.Levels.length  && !data.level) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: "Level is required when a test is selected",
        path: ["level"]
      });
    }
});

const questionTypes = [
  { value: 'MCQ', label: 'MCQ' },
  { value: 'UCQ', label: 'UCQ' },
  { value: 'TrueFalse', label: 'True or False' },
  { value: 'FillInTheBlanks', label: 'Fill In The Blanks' },
  { value: 'Highlight', label: 'Highlight' },
];

export function QuestionNewEditForm({ currentQuestion }) {


  const router = useRouter();

  const { tests, testsLoading } = useGetTests(true);

  const [testLevels, setTestLevels] = useState(null);

  const [questionType, setQuestionType] = useState(null);

  const defaultValues = useMemo(
    () => ({
      label: currentQuestion?.label || '',
      instruction: currentQuestion?.instruction || '',
      timemax: currentQuestion?.timemax || 0,
      point: currentQuestion?.point || 0,
      test:currentQuestion?.test || null,
      level:currentQuestion?.level || null,
      type:currentQuestion?.type || null,
      mcqItems: currentQuestion?.mcqItems || [
        {
          answer: '',
          isCorrect: false
        },
      ],
    }),
    [currentQuestion]
  );


  const methods = useForm({
    mode: 'all',
   // resolver: zodResolver(NewQuestionSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  console.log(fields)
  useEffect(() => {
    if (currentQuestion) {
      reset(defaultValues);
    }
  }, [currentQuestion, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      toast.success(currentQuestion ? 'Update success!' : 'Create success!');
      // reset();
      // router.push(paths.dashboard.question.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleTestChange = (selectedTest) => {
    if(selectedTest) {
      setTestLevels(selectedTest.Levels);
      // Réinitialiser le level quand on change de test
      methods.setValue('level', null);
    } else {
      setTestLevels(null);
    }
  };

  const handleTypeChange = (selectedType) => {
    if(selectedType) {
      setQuestionType(selectedType);
      // Réinitialiser le level quand on change de test
      methods.setValue('type', null);
    } else {
      setQuestionType(null);
    }
  };

  const renderDetails = (
    <Card>
      <CardHeader title="General" subheader="Label, instruction" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Label</Typography>
          <Field.Text name="label" placeholder="Ex: Question 1 ..." />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}  sx={{ width: '100%' }}>
          <Stack spacing={1.5}  sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Typography variant="subtitle2">Test</Typography>
            <Field.Autocomplete
              name="test"
              placeholder="Choisissez un test"
              autoHighlight
              options={tests}
              defaultValue={null}
              getOptionLabel={(option) => {
                // Gestion plus robuste des labels
                if (typeof option === 'string') return option;
                if (!option) return '';
                return option.label || '';
              }}
              isOptionEqualToValue={(option, value) => {
                // Gestion plus robuste de la comparaison
                if (!option || !value) return false;
                if (typeof option === 'string' || typeof value === 'string') return option === value;
                return option.test_id === value.test_id;
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.test_id}>
                  {option.label}
                </li>
              )}

              onChange={(event, value) => {
                handleTestChange(value);
                methods.setValue('test', value, {
                  shouldValidate: true,
                  shouldDirty: true
                });
              }}
              sx={{ width: '100%' }} // Assure que l'Autocomplete prend toute la largeur
            />
          </Stack>
          <Stack spacing={1.5}  sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Typography variant="subtitle2">Level</Typography>
            <Field.Autocomplete
              disabled={!testLevels}
              name="level"
              placeholder="Choisissez un level"
              autoHighlight
              options={testLevels || []}
              defaultValue={null}
              getOptionLabel={(option) => {
                // Gestion plus robuste des labels
                if (typeof option === 'string') return option;
                if (!option) return '';
                return option.label || '';
              }}
              isOptionEqualToValue={(option, value) => {
                // Gestion plus robuste de la comparaison
                if (!option || !value) return false;
                if (typeof option === 'string' || typeof value === 'string') return option === value;
                return option.level_id === value.level_id;
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.level_id}>
                  {option.label}
                </li>
              )}
              sx={{ width: '100%' }} // Assure que l'Autocomplete prend toute la largeur
            />
          </Stack>
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Instruction</Typography>
          <Field.Editor name="instruction" sx={{ maxHeight: 480 }} />
        </Stack>

      </Stack>


    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Properties"
        subheader="Duration, points..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Max. Duration in minutes</Typography>
          <Field.Text
            name="timemax"
            placeholder="60"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>minutes :</Box>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Point(s)</Typography>
          <Field.Text
            name="point"
            placeholder="1234"
            type="number"
          />
        </Stack>


      </Stack>
    </Card>
  );

  const renderQuestionTypes = (
    <Card>
      <CardHeader
        title="Question types"
        subheader="Qcm, True or False, Fill in the blank ..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Question type</Typography>
          <Field.Autocomplete
            name="type"
            placeholder="Choisissez un type de question"
            autoHighlight
            options={questionTypes || []}
            defaultValue={null}
            getOptionLabel={(option) => {
              // Gestion plus robuste des labels
              if (typeof option === 'string') return option;
              if (!option) return '';
              return option.label || '';
            }}
            isOptionEqualToValue={(option, value) => {
              // Gestion plus robuste de la comparaison
              if (!option || !value) return false;
              if (typeof option === 'string' || typeof value === 'string') return option === value;
              return option.value === value.value;
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {option.label}
              </li>
            )}
            sx={{ width: '100%' }} // Assure que l'Autocomplete prend toute la largeur

            onChange={(event, value) => {
              handleTypeChange(value);
              methods.setValue('type', value, {
                shouldValidate: true,
                shouldDirty: true
              });
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );



  const renderActions = (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ flexGrow: 1, pl: 3 }}
      />

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!currentQuestion ? 'Create question' : 'Save changes'}
      </LoadingButton>
    </Box>
  );



  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {renderProperties}
        {renderQuestionTypes}
        <QuestionNewEditMcq />
        {renderActions}
      </Stack>
    </Form>
  );

}
