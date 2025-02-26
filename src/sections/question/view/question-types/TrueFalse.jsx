import { FormControlLabel, RadioGroup, Radio } from '@mui/material';

export function TrueFalse({ question, userAnswer, setUserAnswer, submitted }) {
  const handleChange = (event) => {
    setUserAnswer(event.target.value);
  };

  return (
    <RadioGroup name="truefalse" value={userAnswer} onChange={handleChange}>
      <FormControlLabel value="true" control={<Radio disabled={submitted} />} label="Vrai" />
      <FormControlLabel value="false" control={<Radio disabled={submitted} />} label="Faux" />
    </RadioGroup>
  );
}
