import { FormControlLabel, RadioGroup, Radio } from '@mui/material';

export function MultipleChoice({ question, userAnswer, setUserAnswer, submitted }) {
  const handleChange = (event) => {
    setUserAnswer(event.target.value);
  };

  return (
    <RadioGroup name="mcq" value={userAnswer} onChange={handleChange}>
      {question.content.choices.map((choice, index) => (
        <FormControlLabel
          key={index}
          value={choice.text}
          control={<Radio disabled={submitted} />}
          label={choice.text}
        />
      ))}
    </RadioGroup>
  );
}
