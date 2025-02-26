'use client';

import PropTypes from 'prop-types';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function MCQPreview({ content, userAnswer, onAnswerChange, disabled }) {
  const { text, choices } = content;
  const theme = useTheme();

  useEffect(() => {
    if (!userAnswer) {
      onAnswerChange([]);
    }
  }, [userAnswer, onAnswerChange]);

  const handleChange = (choiceId) => (event) => {
    const { checked } = event.target;
    const newAnswer = userAnswer || [];

    if (checked) {
      onAnswerChange([...newAnswer, choiceId]);
    } else {
      onAnswerChange(newAnswer.filter(id => id !== choiceId));
    }
  };

  const isChecked = (choiceId) => userAnswer ? userAnswer.includes(choiceId) : false;

  return (
    <Stack spacing={3}>
      {/* Question text */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body1" sx={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
          {text}
        </Typography>
      </Paper>

      {/* Choices */}
      <Stack spacing={2}>
        {choices.map((choice) => {
          const isSelected = isChecked(choice.id);
          const isCorrect = disabled && choice.isCorrect;
          const isWrong = disabled && isSelected && !choice.isCorrect;

          return (
            <Paper
              key={choice.id}
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'transparent',
                transition: 'all 0.2s',
                ...(isSelected && !disabled && {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.lighter',
                }),
                ...(isCorrect && {
                  borderColor: 'success.main',
                  bgcolor: 'success.lighter',
                }),
                ...(isWrong && {
                  borderColor: 'error.main',
                  bgcolor: 'error.lighter',
                }),
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked(choice.id)}
                    onChange={handleChange(choice.id)}
                    disabled={disabled}
                    icon={<Iconify icon="mdi:square-outline" />}
                    checkedIcon={<Iconify icon="mdi:checkbox-marked" />}
                    sx={{
                      '&.Mui-checked': {
                        color: disabled ?
                          (choice.isCorrect ? 'success.main' : 'error.main')
                          : 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '1rem',
                        color: disabled ?
                          (isCorrect ? 'success.main' : (isWrong ? 'error.main' : 'text.primary'))
                          : 'text.primary',
                      }}
                    >
                      {choice.text}
                    </Typography>
                    {disabled && choice.isCorrect && (
                      <Iconify icon="mdi:check-circle" sx={{ color: 'success.main' }} />
                    )}
                  </Stack>
                }
                sx={{
                  m: 0,
                  py: 1,
                  px: 2,
                  width: 1,
                  '&:hover': !disabled && {
                    bgcolor: 'action.hover',
                  },
                }}
              />
            </Paper>
          );
        })}
      </Stack>

      {/* Correct answers display */}
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
              Correct answers:
            </Typography>
            <Stack spacing={1}>
              {choices
                .filter(choice => choice.isCorrect)
                .map((choice, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      color: 'success.dark',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Iconify icon="mdi:check-circle" />
                    {choice.text}
                  </Typography>
                ))}
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}

MCQPreview.propTypes = {
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        isCorrect: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
  userAnswer: PropTypes.arrayOf(PropTypes.number),
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
