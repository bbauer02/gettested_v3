import { TextField, Typography, Box, Stack } from '@mui/material';

export function FillInTheBlanks({ question, userAnswer, setUserAnswer, submitted }) {
  const { content } = question;

  const handleChange = (event, index) => {
    setUserAnswer((prev) => ({
      ...prev,
      [index]: event.target.value,
    }));
  };

  return (
    <Stack spacing={2}>
      {/* Remplace <p> par <Typography component="span"> pour éviter l’erreur */}
      <Typography variant="body1" component="div">
        {content.text.split(content.blankSymbol).map((part, index, array) => (
          <span key={index}>
                        {part}
            {index < array.length - 1 && (
              <TextField
                value={userAnswer[index] || ''}
                onChange={(e) => handleChange(e, index)}
                variant="outlined"
                size="small"
                sx={{ mx: 1, width: 100 }}
                disabled={submitted}
              />
            )}
                    </span>
        ))}
      </Typography>

      {submitted && (
        <Box sx={{ color: 'primary.main', mt: 2 }}>
          ✅ Réponses correctes : {content.answers.join(', ')}
        </Box>
      )}
    </Stack>
  );
}
