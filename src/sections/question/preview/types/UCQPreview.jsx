'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UCQPreview({ content, userAnswer, onAnswerChange, disabled }) {
  const { text, choices } = content;
  const theme = useTheme();

  const handleChange = (event) => {
    onAnswerChange(Number(event.target.value));
  };

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
      <RadioGroup value={userAnswer || ''} onChange={handleChange}>
        <Stack spacing={2}>
          {choices.map((choice) => {
            const isSelected = userAnswer === choice.id;
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
                  value={choice.id}
                  control={
                    <Radio
                      disabled={disabled}
                      icon={<Iconify icon="mdi:radiobox-blank" />}
                      checkedIcon={<Iconify icon="mdi:radiobox-marked" />}
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
      </RadioGroup>

      {/* Correct answer display */}
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
              Correct answer:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'success.dark',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Iconify icon="mdi:check-circle" />
              {choices.find(choice => choice.isCorrect)?.text}
            </Typography>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}

UCQPreview.propTypes = {
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
  userAnswer: PropTypes.number,
  onAnswerChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
