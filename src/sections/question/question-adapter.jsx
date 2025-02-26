// API vers le formulaire
export const apiToForm = (question) => {
  if (!question) return null;

  const baseValues = {
    label: question.label || '',
    instruction: question.instruction || '',
    timemax: question.duration || 0,
    point: question.points || 0,
    test: question.test || null,
    level: question.level || null,
    skills: question.skills || [],
    type: question.question_data ? {
      value: question.question_data.type,
      label: question.question_data.type
    } : null
  };

  if (!question.question_data) return baseValues;

  switch (question.question_data.type) {
    case 'MCQ':
    case 'UCQ':
      return {
        ...baseValues,
        mcqQuestion: question.question_data.content.text,
        mcqItems: question.question_data.content.choices.map(choice => ({
          id: choice.id,
          answer: choice.text,
          isCorrect: choice.isCorrect
        }))
      };

    case 'FillInTheBlanks':
      return {
        ...baseValues,
        sentence: question.question_data.content.text,
        blankSymbol: question.question_data.content.blankSymbol || '___',
        blankAnswers: question.question_data.content.answers.map(answer => ({
          answer
        }))
      };

    case 'Highlight':
      return {
        ...baseValues,
        sentence: question.question_data.content.text,
        highlightAnswers: question.question_data.content.answers
      };

    case 'TrueFalse':
      return {
        ...baseValues,
        truefalseQuestion: question.question_data.content.text,
        correctAnswer: question.question_data.content.answer
      };

    default:
      return baseValues;
  }
};

// Formulaire vers l'API
export const formToApi = (formData) => {
  const baseData = {
    label: formData.label,
    instruction: formData.instruction,
    duration: Number(formData.timemax),
    points: Number(formData.point),
    test_id: formData.test.test_id,
    level_id: formData.level?.level_id,
    skills: formData.skills.map(skill => ({
      skill_id: skill.skill_id,
      label: skill.label,
      parent_id: skill.parent_id
    }))
  };

  let questionData = {
    type: formData.type.value,
    content: {}
  };

  switch (formData.type.value) {
    case 'MCQ':
    case 'UCQ':
      questionData.content = {
        text: formData.mcqQuestion,
        choices: formData.mcqItems.map((item, index) => ({
          id: item.id || index + 1,
          text: item.answer,
          isCorrect: item.isCorrect
        }))
      };
      break;

    case 'FillInTheBlanks':
      questionData.content = {
        text: formData.sentence,
        blankSymbol: formData.blankSymbol,
        answers: formData.blankAnswers.map(item => item.answer)
      };
      break;

    case 'Highlight':
      questionData.content = {
        text: formData.sentence,
        answers: formData.highlightAnswers
      };
      break;

    case 'TrueFalse':
      questionData.content = {
        text: formData.truefalseQuestion,
        answer: formData.correctAnswer
      };
      break;
  }

  return {
    ...baseData,
    question_data: questionData
  };
};

// Validation spécifique par type
export const validateQuestionData = (data) => {
  // eslint-disable-next-line default-case
  switch (data.type) {
    case 'UCQ':
      const correctAnswers = data.question_data.content.choices.filter(choice => choice.isCorrect);
      if (correctAnswers.length !== 1) {
        throw new Error('UCQ must have exactly one correct answer');
      }
      break;

    case 'FillInTheBlanks':
      const blankCount = (data.question_data.content.text.match(new RegExp(data.question_data.content.blankSymbol, 'g')) || []).length;
      if (blankCount !== data.question_data.content.answers.length) {
        throw new Error('Number of answers must match number of blanks');
      }
      break;
  }
};
