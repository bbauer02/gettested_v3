import { z as zod } from 'zod';
import {useMemo, useEffect, useState, useCallback} from 'react';
import { useForm, Controller,  useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
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

import { useGetTests} from "src/actions/test";

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useGetSkills} from '../../actions/skill';
import {
  QuestionNewEditMcqUcq,
  QuestionNewEditHighlight,
  QuestionNewEditTrueOrFalse,
  QuestionNewEditFillTheBlank,
} from './types';

export const NewQuestionSchema = zod.object({
  label: zod.string().min(1, { message: 'Label is required!' }),
  instruction: zod.string().min(1, { message: 'instruction is required!' }),
  duration: zod.number().min(1, { message: 'Duration is required!' }),
  points: zod.number().min(1, { message: 'Point is required!' }),
  test: zod.object({
    // Define your test object properties here
  }).nullable({
    message: 'test is required!'
  }),
  level: zod.object({level_id: zod.number(), label: zod.string(),}).nullable(),
  skills: zod.string().array().min(1, { message: 'Must have at least 1 skill!' }),
  type: zod.object({
    // Define your type object properties here
  }).nullable({
    message: 'type is required!'
  }),
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

export function QuestionNewEditForm({ currentQuestion = null }) {


  const router = useRouter();

  const { tests, testsLoading } = useGetTests(true);

  const { skills, skillsLoading } = useGetSkills(true);


  const [testLevels, setTestLevels] = useState(null);

  const [questionType, setQuestionType] = useState(null);


  const defaultValues = useMemo(
    () => {
      // Valeurs de base communes à tous les types
      const baseValues = {
        label: currentQuestion?.label || '',
        instruction: currentQuestion?.instruction || '',
        duration: currentQuestion?.duration || 0,
        points: currentQuestion?.points || 0,
        test: currentQuestion?.test || null,
        level: currentQuestion?.level || null,
        skills: currentQuestion?.skills || [],
        type: currentQuestion?.question_data ? {
          value: currentQuestion.question_data.type,
          label: currentQuestion.question_data.type
        } : null
      };

      // Si pas de question existante, retourner juste les valeurs de base
      if (!currentQuestion) {
        return baseValues;
      }

      // Si question existante, ajouter les champs spécifiques selon le type
      switch (currentQuestion.question_data.type) {
        case 'MCQ':
          return {
            ...baseValues,
            mcq: {
              text: currentQuestion.question_data.content.text,
              choices: currentQuestion.question_data.content.choices
            }
          };
        case 'UCQ':
          return {
            ...baseValues,
            ucq: {
              text: currentQuestion.question_data.content.text,
              choices: currentQuestion.question_data.content.choices
            }
          };

        case 'FillInTheBlanks':
          return {
            ...baseValues,
            fillintheblanks: {
              blanksymbol: currentQuestion.question_data.content.blankSymbol,
              answers: currentQuestion.question_data.content.answers,
              text: currentQuestion.question_data.content.text
            }
          };

        case 'Highlight':
          return {
            ...baseValues,
            highlight: {
              text: currentQuestion.question_data.content.text,
              answers: currentQuestion.question_data.content.answers
            }
          };

        default:
          return baseValues;
      }
    },
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

  useEffect(() => {
    if (currentQuestion) {
      setQuestionType({ value: currentQuestion.question_data.type, label:currentQuestion.question_data.type  });
      reset(defaultValues);
    }
  }, [currentQuestion, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        label: data.label,
        instruction: data.instruction,
        duration: Number(data.duration),
        points: Number(data.points),
        test: {
          test_id: data.test.test_id,
          label: data.test.label
        },
        level: {
          level_id: data.level.level_id,
          label: data.level.label
        },
        skills: data.skills.map(skill => ({
          skill_id: skill.skill_id,
          label: skill.label
        })),
        type: data.type.value,
        question: null // Sera défini selon le type
      };

      // Formater la question selon le type
      switch (data.type.value) {
        case 'MCQ':
          formattedData.question = {
            text: data.mcqQuestion,
            choices: data.mcqItems.map(item => ({
              text: item.answer,
              isCorrect: item.isCorrect
            }))
          };
          break;

        case 'UCQ':
          formattedData.question = {
            text: data.mcqQuestion,
            choices: data.mcqItems.map(item => ({
              text: item.answer,
              isCorrect: item.isCorrect
            })),
            // Vérification qu'une seule réponse est correcte
            correctAnswer: data.mcqItems.find(item => item.isCorrect)?.answer
          };
          break;

        case 'TrueFalse':
          formattedData.question = {
            text: data.truefalseQuestion,
            answer: data.correctAnswer
          };
          break;

        case 'FillInTheBlanks':
          formattedData.question = {
            text: data.sentence,
            blankSymbol: data.blankSymbol,
            answers: data.blankAnswers.map(item => item.answer)
          };
          break;

        case 'Highlight':
          formattedData.question = {
            text: data.sentence,
            answers: data.highlightAnswers
          };
          break;

        default:
          throw new Error('Invalid question type');
      }

      // Validations spécifiques
      validateQuestionData(formattedData);

      console.info('DATA', formattedData);
      toast.success(currentQuestion ? 'Update success!' : 'Create success!');
    } catch (error) {
      console.error(error);
    }
  });

  // Gérer les skills en fonction du test sélectionné
  const getTestSkills = useCallback((selectedTest) => {
    if (!selectedTest) return [];
    // Si c'est un test enfant (parent_id existe), on cherche les skills du parent
    const testIdToUse = selectedTest.parent_id ? selectedTest.parent_id : selectedTest.test_id;
    return skills?.filter(skill => skill.test_id === testIdToUse) || [];
  }, [skills]);

  const handleTestChange = (selectedTest) => {
    if(selectedTest) {
      setTestLevels(selectedTest.Levels);
      // Réinitialiser le level quand on change de test
      methods.setValue('level', null);
      methods.setValue('skills', []);
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

  // Fonction de validation supplémentaire
  const validateQuestionData = (data) => {
    switch (data.type) {
      case 'UCQ':
        // Vérifier qu'il y a exactement une réponse correcte
        const correctAnswers = data.question.choices.filter(choice => choice.isCorrect);
        if (correctAnswers.length !== 1) {
          throw new Error('UCQ must have exactly one correct answer');
        }
        break;

      case 'FillInTheBlanks':
        // Vérifier que le nombre de réponses correspond au nombre de blancs
        const blankCount = (data.question.text.match(new RegExp(data.question.blankSymbol, 'g')) || []).length;
        if (blankCount !== data.question.answers.length) {
          throw new Error('Number of answers must match number of blanks');
        }
        break;

      // Ajouter d'autres validations si nécessaire
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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ width: '100%' }}>
          <Stack spacing={1.5} sx={{ width: { xs: '100%', sm: '50%' } }}>
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
                if (typeof option === 'string' || typeof value === 'string')
                  return option === value;
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
                  shouldDirty: true,
                });
              }}
              sx={{ width: '100%' }} // Assure que l'Autocomplete prend toute la largeur
            />
          </Stack>
          <Stack spacing={1.5} sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Typography variant="subtitle2">Level</Typography>
            <Field.Autocomplete
              disabled={!testLevels || !testLevels.length}
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
                if (typeof option === 'string' || typeof value === 'string')
                  return option === value;
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
        <Stack spacing={1.5} sx={{ width: '100%' }}>
          <Typography variant="subtitle2">Compétences associées</Typography>
          <Field.Autocomplete
            name="skills"
            label="Skills"
            placeholder="+ Sélectionner des compétences"
            multiple
            freeSolo
            disabled={!methods.watch('test')}
            disableCloseOnSelect
            options={getTestSkills(methods.watch('test'))}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              if (!option) return '';
              return option.label;
            }}
            isOptionEqualToValue={(option, value) => {
              if (!option || !value) return false;
              return option.skill_id === value.skill_id;
            }}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <li
                  {...otherProps}
                  key={option.skill_id}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      pl: option.parent_id ? 2 : 0,
                      py: 0.75,
                      // Ligne verticale pour les sous-compétences
                      borderLeft: (theme) => option.parent_id ?
                        `1px solid ${theme.palette.divider}` : 'none',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        // Changement de couleur de la ligne au survol
                        borderLeftColor: (theme) => option.parent_id ?
                          theme.palette.primary.light : 'none'
                      }
                    }}
                  >
                    {option.parent_id && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mr: 1,
                          // Ligne horizontale pour connecter à la ligne verticale
                          '&::before': {
                            content: '""',
                            width: '12px',
                            height: '1px',
                            bgcolor: 'divider',
                            mr: 1
                          }
                        }}
                      >
                        <Iconify
                          key={`icon-${option.skill_id}`}
                          icon="eva:arrow-right-outline"
                          width={16}
                          sx={{ color: 'text.secondary' }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: option.parent_id ? 400 : 600,
                        color: option.parent_id ? 'text.secondary' : 'text.primary'
                      }}
                    >
                      {option.label}
                    </Typography>
                  </Box>
                </li>
              );
            }}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.skill_id || index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {option.parent_id && (
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {getTestSkills(methods.watch('test'))
                            .find(skill => skill.skill_id === option.parent_id)?.label} →
                        </Typography>
                      )}
                      {option.label}
                    </Box>
                  }
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
          {methods.formState.errors.skills && (
            <Typography variant="caption" sx={{ color: 'error.main' }}>
              {methods.formState.errors.skills.message}
            </Typography>
          )}
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
            name="duration"
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
            name="points"
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
        {questionType && (questionType.value === "MCQ" ||  questionType.value === "UCQ" ) ? <QuestionNewEditMcqUcq  currentQuestion={ currentQuestion } /> : ""}
        {questionType && questionType.value === "TrueFalse" && <QuestionNewEditTrueOrFalse  currentQuestion={ currentQuestion }/>}
        {questionType && questionType.value === "FillInTheBlanks" && <QuestionNewEditFillTheBlank currentQuestion={ currentQuestion } />}
        {questionType && questionType.value === "Highlight" && <QuestionNewEditHighlight  currentQuestion={ currentQuestion }/>}
        {renderActions}
      </Stack>
    </Form>
  );

}
