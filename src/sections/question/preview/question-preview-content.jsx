'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import MCQPreview from './types/MCQPreview';
import UCQPreview from './types/UCQPreview';
import HighlightPreview from './types/HighlightPreview';
import FillInBlanksPreview from './types/FillInBlanksPreview';

// ----------------------------------------------------------------------

export default function QuestionPreviewContent({ question }) {
  const [userAnswer, setUserAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const theme = useTheme();

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswer(null);
    setIsSubmitted(false);
  };

  const getQuestionComponent = () => {
    const { type, content } = question.question_data;

    const props = {
      content,
      userAnswer,
      onAnswerChange: setUserAnswer,
      disabled: isSubmitted,
    };

    switch (type) {
      case 'MCQ':
        return <MCQPreview {...props} />;
      case 'UCQ':
        return <UCQPreview {...props} />;
      case 'FillInTheBlanks':
        return <FillInBlanksPreview {...props} />;
      case 'Highlight':
        return <HighlightPreview {...props} />;
      default:
        return null;
    }
  };

  return (
    <Stack spacing={3}>
      {/* Section Instructions */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:information" color="primary.main" />
            <Typography variant="h6">Instructions</Typography>
          </Stack>

          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: question.instruction }} />
          </Box>
        </Stack>
      </Paper>

      {/* Section Question */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Iconify icon="mdi:pencil" color="primary.main" />
          <Typography variant="h6">Question</Typography>
        </Stack>

        <Box sx={{ p: 3 }}>
          {getQuestionComponent()}
        </Box>

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{
            p: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
          }}
        >
          {isSubmitted ? (
            <>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleReset}
                startIcon={<Iconify icon="mdi:refresh" />}
              >
                Try Again
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!userAnswer}
              startIcon={<Iconify icon="mdi:check-circle" />}
            >
              Check Answer
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Résultat */}
      {isSubmitted && (
        <Alert
          severity={Math.random() > 0.5 ? "success" : "error"}
          variant="outlined"
          sx={{
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: 24
            }
          }}
        >
          {Math.random() > 0.5 ? (
            <>
              <Typography variant="subtitle1" paragraph>
                Excellent work! Your answer is correct.
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You've successfully demonstrated your understanding of this concept.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="subtitle1" paragraph>
                Not quite right. Here's the correct answer:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                [Afficher la bonne réponse ici selon le type de question]
              </Typography>
            </>
          )}
        </Alert>
      )}
    </Stack>
  );
}
