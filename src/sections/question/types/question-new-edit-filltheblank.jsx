import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Typography from '@mui/material/Typography';

import { Field } from 'src/components/hook-form';

export function QuestionNewEditFillTheBlank({ currentQuestion = null }) {
  const { control, setValue, watch } = useFormContext();

  // 🔹 Utilisation correcte de useFieldArray pour fillintheblanks.answers
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'fillintheblanks.answers' // Correction ici
  });

  // Récupération des valeurs du formulaire
  const values = watch();

  // 🔹 Correction des valeurs surveillées
  const sentence = values?.fillintheblanks?.text || '';
  const blankSymbol = values?.fillintheblanks?.blanksymbol || '___';

  // Définir la valeur par défaut pour blankSymbol lors du premier rendu
  useEffect(() => {
    // Initialiser le symbole de blanc s'il n'est pas défini
    if (!values?.fillintheblanks?.blanksymbol) {
      setValue('fillintheblanks.blanksymbol', '___', {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  }, [setValue, values?.fillintheblanks]);

  // Fonction pour échapper les caractères spéciaux dans la regex
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Fonction pour compter les occurrences du symbole dans le texte
  const countBlanks = (text) => {
    const regex = new RegExp(escapeRegExp(blankSymbol), 'g');
    return (text.match(regex) || []).length;
  };

  // 🔹 Mise à jour dynamique des réponses en fonction du nombre de blancs
  useEffect(() => {
    const blankCount = countBlanks(sentence);
    const currentAnswers = fields.map(field => field.answer);

    if (blankCount > currentAnswers.length) {
      // Ajout de nouvelles réponses en conservant les existantes
      const newAnswers = [...currentAnswers];

      for (let i = currentAnswers.length; i < blankCount; i++) {
        newAnswers.push({ answer: "" });
      }
      replace(newAnswers);
    } else if (blankCount < currentAnswers.length) {
      // Suppression des réponses en trop
      replace(currentAnswers.slice(0, blankCount).map(answer => ({ answer })));
    }
  }, [sentence, blankSymbol, fields.length, replace]);

  // 🔹 Chargement initial des réponses si la question existe
  useEffect(() => {
    if (currentQuestion?.question_data?.content?.answers) {
      replace(currentQuestion.question_data.content.answers.map(answer => ({ answer })));
    }
  }, [currentQuestion, replace]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>

        {/* Configuration du symbole de remplacement */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Blank Symbol</Typography>
          <Field.Text
            name="fillintheblanks.blanksymbol"
            size="small"
            placeholder="___"
            helperText={`Use this symbol in your text to indicate blanks. Current symbol: ${blankSymbol}`}
            sx={{ maxWidth: 200 }}
          />
        </Stack>

        <Divider flexItem sx={{ borderStyle: 'dashed' }} />

        {/* Texte avec blancs */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Text with Blanks</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Use <Box component="span" sx={{ fontWeight: 'bold' }}>{blankSymbol}</Box> to
            indicate where blanks should appear. Example: "The capital of France is {blankSymbol}."
          </Alert>
          <Field.Editor
            name="fillintheblanks.text"
            sx={{ minHeight: 200 }}
          />
        </Stack>

        <Divider flexItem sx={{ borderStyle: 'dashed' }} />

        {/* Section des réponses */}
        {fields.length > 0 && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Answers for Blanks</Typography>

            {fields.map((field, index) => (
              <Stack
                key={field.id}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Typography variant="body2" sx={{ minWidth: 80 }}>
                  Blank #{index + 1}:
                </Typography>

                <Field.Text
                  name={`fillintheblanks.answers.${index}.answer`}
                  size="small"
                  placeholder="Enter the correct answer..."
                  sx={{ flexGrow: 1 }}
                />

                <button type="button" onClick={() => remove(index)}>❌</button>
              </Stack>
            ))}

            <button type="button" onClick={() => append({ answer: "" })}>
              ➕ Ajouter une réponse
            </button>
          </Stack>
        )}

        {fields.length === 0 && (
          <Alert severity="info">
            Add blanks to your text using {blankSymbol} to create answer fields.
          </Alert>
        )}

        {/* Preview section */}
        {sentence && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Preview</Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.neutral',
                borderRadius: 1
              }}
            >
              <Typography>
                {sentence.replace(/(<([^>]+)>)/gi, '').split(blankSymbol).map((part, index, array) => (
                  <span key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          mx: 0.5,
                          bgcolor: 'primary.lighter',
                          borderRadius: 0.5
                        }}
                      >
                        (BLANK {index + 1})
                      </Box>
                    )}
                  </span>
                ))}
              </Typography>
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
