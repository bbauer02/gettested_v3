'use client';

import PropTypes from 'prop-types';
import { useState, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function HighlightPreview({ content, userAnswer, onAnswerChange, disabled }) {
  const { text, answers = [] } = content;
  const textRef = useRef(null);
  const theme = useTheme();

  // Fonction pour actualiser les surlignages dans le texte
  const updateHighlights = (selectedTexts) => {
    const contentElement = textRef.current;
    if (!contentElement) return;

    // Réinitialiser le texte
    contentElement.innerHTML = text;

    // Appliquer les surlignages
    selectedTexts.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      contentElement.innerHTML = contentElement.innerHTML.replace(
        regex,
        `<mark style="background-color: #FFF176; padding: 2px 0; border-radius: 2px;">$1</mark>`
      );
    });
  };

  const handleTextSelect = () => {
    if (disabled) return;

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText && !selectedText.includes('\n')) {
      const newSelectedTexts = [...(userAnswer || []), selectedText];
      onAnswerChange(newSelectedTexts);
      updateHighlights(newSelectedTexts);
      selection.removeAllRanges();
    }
  };

  const handleRemoveSelection = (textToRemove) => {
    const newSelectedTexts = userAnswer.filter(t => t !== textToRemove);
    onAnswerChange(newSelectedTexts);
    updateHighlights(newSelectedTexts);
  };

  return (
    <Stack spacing={3}>
      {/* Zone de texte */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
          border: `1px solid ${theme.palette.divider}`,
          cursor: disabled ? 'default' : 'text',
        }}
      >
        <Typography
          ref={textRef}
          variant="body1"
          component="div"
          onMouseUp={handleTextSelect}
          sx={{
            fontSize: '1.1rem',
            lineHeight: 1.8,
            userSelect: disabled ? 'none' : 'text',
            '& ::selection': {
              backgroundColor: !disabled ? '#FFF59D' : 'transparent',
            },
            '& mark': {
              backgroundColor: '#FFF176',
              padding: '2px 0',
              borderRadius: '2px',
            }
          }}
        >
          {text}
        </Typography>
      </Paper>

      {/* Chips des sélections */}
      {userAnswer?.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {userAnswer.map((text, index) => (
            <Chip
              key={index}
              label={text}
              disabled={disabled}
              onDelete={disabled ? undefined : () => handleRemoveSelection(text)}
              sx={{
                my: 0.5,
                bgcolor: theme.palette.mode === 'light' ? '#FFB74D' : '#FFA726', // Orange plus foncé
                color: 'grey.900',
                fontWeight: 500,
                borderRadius: 1,
                '& .MuiChip-deleteIcon': {
                  color: 'grey.800',
                  '&:hover': {
                    color: 'error.dark',
                  },
                },
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? '#FFA726' : '#FF9800',
                },
                ...(disabled && {
                  opacity: 0.7,
                  bgcolor: theme.palette.mode === 'light' ? '#FFB74D' : '#FFA726',
                }),
              }}
            />
          ))}
        </Stack>
      )}

      {/* Affichage des réponses correctes */}
      {disabled && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'light' ? 'success.lighter' : 'success.darker',
            border: `1px solid ${theme.palette.success.main}`,
          }}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
              Correct terms to highlight:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {answers.map((answer, index) => (
                <Chip
                  key={index}
                  label={answer}
                  size="small"
                  sx={{
                    bgcolor: 'success.main',
                    color: 'success.contrastText',
                    fontWeight: 500,
                    my: 0.5,
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}

HighlightPreview.propTypes = {
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  userAnswer: PropTypes.arrayOf(PropTypes.string),
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
