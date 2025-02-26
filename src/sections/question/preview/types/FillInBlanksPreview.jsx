'use client';

import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { escapeRegExp } from 'src/utils/escape-regexp';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function FillInBlanksPreview({ content, userAnswer, onAnswerChange, disabled }) {
  const { text, blankSymbol = '___', answers = [] } = content;
  const theme = useTheme();

  useEffect(() => {
    if (!userAnswer) {
      const blankCount = (text.match(new RegExp(escapeRegExp(blankSymbol), 'g')) || []).length;
      onAnswerChange(Array(blankCount).fill(''));
    }
  }, [text, blankSymbol, userAnswer, onAnswerChange]);

  const handleAnswerChange = (index) => (event) => {
    const newAnswers = [...(userAnswer || [])];
    newAnswers[index] = event.target.value;
    onAnswerChange(newAnswers);
  };

  const isAnswerCorrect = (index) => {
    if (!disabled || !userAnswer?.[index]) return null;
    return userAnswer[index].toLowerCase().trim() === answers[index].toLowerCase().trim();
  };

  const renderText = () => {
    const parts = text.split(blankSymbol);

    return (
      <Box sx={{ position: 'relative' }}>
        {parts.map((part, index) => (
          <Box key={index} component="span">
            {part}
            {index < parts.length - 1 && (
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mx: 1 }}>
                <TextField
                  size="small"
                  value={userAnswer?.[index] || ''}
                  onChange={handleAnswerChange(index)}
                  disabled={disabled}
                  placeholder="..."
                  error={disabled && !isAnswerCorrect(index)}
                  sx={{
                    width: '120px',
                    '& .MuiInputBase-root': {
                      bgcolor: 'background.paper',
                      ...(disabled && isAnswerCorrect(index) && {
                        bgcolor: 'success.lighter',
                        borderColor: 'success.main',
                      }),
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderWidth: 2,
                        ...(disabled && isAnswerCorrect(index) && {
                          borderColor: 'success.main',
                        }),
                      },
                    },
                    '& input': {
                      textAlign: 'center',
                      typography: 'body1',
                      fontWeight: 500,
                    },
                  }}
                  InputProps={{
                    endAdornment: disabled && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mr: 1,
                        }}
                      >
                        <Iconify
                          icon={isAnswerCorrect(index) ? "mdi:check-circle" : "mdi:close-circle"}
                          sx={{
                            color: isAnswerCorrect(index) ? 'success.main' : 'error.main',
                          }}
                        />
                      </Box>
                    ),
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Stack spacing={3}>
      {/* Zone de texte avec les blancs */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="body1"
          component="div"
          sx={{
            fontSize: '1.1rem',
            lineHeight: 2.5,
          }}
        >
          {renderText()}
        </Typography>
      </Paper>

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
              Correct answers:
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              {answers.map((answer, index) => (
                <Box
                  key={index}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.success.main}`,
                    bgcolor: 'success.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'success.darker', fontSize: '0.9rem' }}
                  >
                    Blank {index + 1}:
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'success.darker', fontWeight: 600 }}
                  >
                    {answer}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}

FillInBlanksPreview.propTypes = {
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.string).isRequired,
    blankSymbol: PropTypes.string,
  }).isRequired,
  userAnswer: PropTypes.arrayOf(PropTypes.string),
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
