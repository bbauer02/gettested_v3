import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from '@mui/material/Typography';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

export function QuestionNewEditHighlight() {
  const { setValue, watch } = useFormContext();
  const [selectedText, setSelectedText] = useState('');
  const [answers, setAnswers] = useState([]);
  const sentence = watch('sentence') || '';

  // Observer les changements de sélection de texte
  const handleTextSelect = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
      setSelectedText(text);
    }
  };

  // Ajouter une réponse à la liste
  const handleAddAnswer = () => {
    if (selectedText && !answers.includes(selectedText)) {
      const newAnswers = [...answers, selectedText];
      setAnswers(newAnswers);
      setValue('highlightAnswers', newAnswers, {
        shouldValidate: true,
        shouldDirty: true
      });
      setSelectedText('');
    }
  };

  // Supprimer une réponse
  const handleRemoveAnswer = (answerToRemove) => {
    const newAnswers = answers.filter(answer => answer !== answerToRemove);
    setAnswers(newAnswers);
    setValue('highlightAnswers', newAnswers, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  // Mettre en surbrillance les correspondances dans la prévisualisation
  const highlightMatches = (text) => {
    let result = text;
    answers.forEach(answer => {
      const regex = new RegExp(`(${answer})`, 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    });
    return result;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Instructions */}
        <Alert severity="info">
          Enter your text below, then select words or phrases that students should highlight.
          Click "Add to answers" after each selection.
        </Alert>

        {/* Zone de texte */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Text Content</Typography>
          <Box
            onMouseUp={handleTextSelect}
            sx={{ position: 'relative' }}
          >
            <Field.Editor
              name="sentence"
              sx={{ minHeight: 200 }}
            />
          </Box>
        </Stack>

        {/* Zone d'ajout de réponse */}
        {selectedText && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">
              Selected text: &#34;{selectedText}&#34;
            </Typography>
            <Button
              size="small"
              onClick={handleAddAnswer}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add to answers
            </Button>
          </Stack>
        )}

        <Divider flexItem sx={{ borderStyle: 'dashed' }} />

        {/* Liste des réponses attendues */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Expected Highlights</Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {answers.map((answer, index) => (
              <Chip
                key={index}
                label={answer}
                onDelete={() => handleRemoveAnswer(answer)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>

          {answers.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No highlights added yet. Select text above and click "Add to answers"
            </Typography>
          )}
        </Stack>

        {/* Prévisualisation */}
        {sentence && answers.length > 0 && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Preview</Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.neutral',
                borderRadius: 1
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: highlightMatches(sentence.replace(/(<([^>]+)>)/gi, ''))
                }}
              />
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
