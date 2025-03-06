import { useEffect, useRef } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

export function QuestionNewEditUcq({ currentQuestion = null }) {
  const { control, setValue, watch, trigger } = useFormContext();

  // Chemins pour les champs du formulaire
  const choicesPath = 'ucq.choices';
  const textPath = 'ucq.text';

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: choicesPath,
  });

  const values = watch();
  const isFirstRender = useRef(true);

  // Chargement initial des données
  useEffect(() => {
    const currentQuestionData = values?.ucq;

    if (currentQuestionData?.choices && isFirstRender.current) {
      console.log('💡 Debug - Chargement des réponses UCQ:', currentQuestionData.choices);

      // Mise à jour du texte de la question
      setValue(textPath, currentQuestionData.text || '');

      // Injection des réponses dans useFieldArray
      if (currentQuestionData.choices.length > 0) {
        replace(
          currentQuestionData.choices.map(choice => ({
            answer: choice.text ?? '',
            isCorrect: !!choice.isCorrect // Conversion explicite en booléen
          }))
        );
      } else if (fields.length === 0) {
        // Ajouter deux choix vides par défaut si aucun choix n'existe
        append({ answer: '', isCorrect: false });
        append({ answer: '', isCorrect: false });
      }

      isFirstRender.current = false;
    }
  }, [values, setValue, replace, append, fields.length, textPath]);

  // Initialisation par défaut si aucun champ n'existe
  useEffect(() => {
    if (fields.length === 0 && isFirstRender.current) {
      append({ answer: '', isCorrect: false });
      append({ answer: '', isCorrect: false });
      isFirstRender.current = false;
    }
  }, [fields.length, append]);

  // Gestion du changement d'état "correct" pour une réponse
  const handleAnswerChange = (index) => {
    console.log(`🔄 Toggle correct pour UCQ index ${index}`);
    
    // Pour UCQ, une seule réponse peut être correcte
    fields.forEach((_, i) => {
      setValue(`${choicesPath}.${i}.isCorrect`, i === index, {
        shouldValidate: true,
        shouldDirty: true
      });
    });
    
    // Forcer la mise à jour de l'UI
    trigger(choicesPath);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>

        {/* Champ de la question */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">UCQ Question</Typography>
          <Field.Editor
            name={textPath}
            sx={{ minHeight: 200 }}
          />
        </Stack>

        {/* Section des réponses */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Answers</Typography>

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

              <FormControlLabel
                control={
                  <Radio
                    checked={!!watch(`${choicesPath}.${index}.isCorrect`)}
                    onChange={() => handleAnswerChange(index)}
                  />
                }
                label='Correct'
              />

              <Button
                size='small'
                color='error'
                onClick={() => remove(index)}
                disabled={fields.length <= 2}
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
        Select one radio button to mark the correct answer. Only one answer can be correct.
      </Typography>
    </Box>
  );
} 