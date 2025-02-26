import { useEffect, useRef } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

export function QuestionNewEditMcqUcq({ currentQuestion = null }) {
  const { control, setValue, watch, trigger } = useFormContext();

  // 🔹 Récupération dynamique du type de question
  const questionType = watch('type')?.value || 'MCQ'; // Par défaut, MCQ

  // 🔹 Définition correcte du champ (MCQ ou UCQ)
  const fieldArrayName = questionType === 'MCQ' ? 'mcq' : 'ucq';
  const choicesPath = `${fieldArrayName}.choices`;
  const textPath = `${fieldArrayName}.text`;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: choicesPath, // On pointe bien sur mcq.choices ou ucq.choices
  });

  const values = watch();

  // ✅ Empêcher la boucle infinie avec useRef()
  const isFirstRender = useRef(true);

  useEffect(() => {
    const currentQuestion = values?.[fieldArrayName];

    if (currentQuestion?.choices && isFirstRender.current) {
      console.log('💡 Debug - Chargement des réponses :', currentQuestion.choices);

      // Mise à jour du texte de la question
      setValue(textPath, currentQuestion.text || '');

      // Injection des réponses dans useFieldArray
      replace(
        currentQuestion.choices.map(choice => ({
          answer: choice.text ?? '',
          isCorrect: choice.isCorrect ?? false
        }))
      );

      isFirstRender.current = false; // ✅ Empêche la mise à jour infinie
    }
  }, [questionType, setValue, replace, values, fieldArrayName, textPath]);

  // ✅ Correction du toggle "Correct" pour mettre à jour `isCorrect`
  const handleAnswerChange = (index, value) => {
    console.log(`🔄 Toggle correct pour index ${index} : ${value}`);

    if (questionType === 'MCQ') {
      // Pour MCQ (choix multiples), on peut cocher plusieurs cases
      setValue(`${choicesPath}.${index}.isCorrect`, value, {
        shouldValidate: true,
        shouldDirty: true
      });
    } else {
      // Pour UCQ (choix unique), on doit décocher les autres cases
      fields.forEach((_, i) => {
        setValue(`${choicesPath}.${i}.isCorrect`, i === index ? value : false, {
          shouldValidate: true,
          shouldDirty: true
        });
      });
    }

    // ✅ Forcer la mise à jour de l'UI
    trigger(choicesPath);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>

        {/* Champ de la question */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">{questionType} Question</Typography>
          <Field.Editor
            name={textPath}
            sx={{ minHeight: 200 }}
          />
        </Stack>

        {/* Section des réponses */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Answers</Typography>

          {currentQuestion && fields.length === 0 && (
            <Typography variant="body2" color="error">
              ❌ Aucune réponse chargée. Vérifiez que `currentQuestion` contient bien des `choices`.
            </Typography>
          )}

          {fields.map((item, index) => (
            <Stack
              key={item.id}
              direction='row'
              spacing={2}
              alignItems='center'
              sx={{ width: 1, mb: 2 }}
            >
              <Field.Text
                size='small'
                name={`${choicesPath}.${index}.answer`}
                placeholder='Enter an answer...'
                sx={{ flexGrow: 1 }}
              />

              {questionType === 'MCQ' ? (
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch(`${choicesPath}.${index}.isCorrect`)} // 🔥 Correction ici
                      onChange={(event) => handleAnswerChange(index, event.target.checked)}
                    />
                  }
                  label='Correct'
                />
              ) : (
                <FormControlLabel
                  control={
                    <Radio
                      checked={watch(`${choicesPath}.${index}.isCorrect`)} // 🔥 Correction ici
                      onChange={(event) => handleAnswerChange(index, event.target.checked)}
                    />
                  }
                  label='Correct'
                />
              )}

              <Button
                size='small'
                color='error'
                onClick={() => remove(index)}
              >
                <Iconify icon='solar:trash-bin-trash-bold' />
              </Button>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      {/* Bouton pour ajouter une nouvelle réponse */}
      <Button
        size='medium'
        color='primary'
        startIcon={<Iconify icon='mingcute:add-line' />}
        onClick={() => append({ answer: '', isCorrect: false })}
      >
        Add Answer Option
      </Button>

      {/* Texte d'aide */}
      <Typography
        variant='caption'
        sx={{
          display: 'block',
          mt: 2,
          color: 'text.secondary',
          fontStyle: 'italic'
        }}
      >
        {questionType === 'MCQ'
          ? 'Toggle switches to mark correct answers. Multiple correct answers are allowed.'
          : 'Select one radio button to mark the correct answer. Only one answer can be correct.'
        }
      </Typography>
    </Box>
  );
}
