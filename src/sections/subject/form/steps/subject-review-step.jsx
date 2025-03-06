import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Stack, 
  Typography, 
  Divider, 
  Card, 
  CardHeader, 
  CardContent,
  Alert,
  Box,
  Chip,
  Button,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';

export function SubjectReviewStep({ generatedSubject, onReset }) {
  const router = useRouter();
  const [expandedQuestion, setExpandedQuestion] = useState(false);

  if (!generatedSubject) {
    return (
      <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
        <Typography variant="h6" color="text.secondary">
          Aucun sujet généré
        </Typography>
        <Button variant="contained" onClick={onReset}>
          Créer un nouveau sujet
        </Button>
      </Stack>
    );
  }

  const { subject, stats } = generatedSubject;

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedQuestion(isExpanded ? panel : false);
  };

  const handleViewSubject = () => {
    router.push(paths.dashboard.subject.view(subject.subject_id));
  };

  return (
    <Stack spacing={3}>
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="subtitle1">
          {generatedSubject.message || 'Sujet généré avec succès'}
        </Typography>
      </Alert>

      <Card>
        <CardHeader title="Informations du sujet" />
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                ID
              </Typography>
              <Typography variant="body2">{subject.subject_id}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Titre
              </Typography>
              <Typography variant="body2">{subject.title}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body2">{subject.description}</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Test ID
              </Typography>
              <Chip label={subject.test_id} size="small" color="primary" />
            </Stack>

            {subject.level_id && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Niveau ID
                </Typography>
                <Chip label={subject.level_id} size="small" color="primary" />
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Statistiques" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Questions
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {stats.questionCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Points totaux
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {stats.totalPoints}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Durée totale
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {Math.floor(stats.totalDuration)} min
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Distribution des types de questions
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Nombre</TableCell>
                    <TableCell align="right">Points</TableCell>
                    <TableCell align="right">Pourcentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.questionTypeDistribution.map((type) => (
                    <TableRow key={type.type}>
                      <TableCell component="th" scope="row">
                        {type.type}
                      </TableCell>
                      <TableCell align="right">{type.count}</TableCell>
                      <TableCell align="right">{type.points}</TableCell>
                      <TableCell align="right">{type.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Couverture des compétences
            </Typography>
            <Stack spacing={2}>
              {stats.skillsCoverage
                .filter((skill) => skill.percentage > 0)
                .map((skill) => (
                  <Box key={skill.skill_id}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">{skill.label}</Typography>
                      <Typography variant="body2">{skill.percentage}%</Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.percentage} 
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Questions générées" />
        <CardContent>
          <Stack spacing={2}>
            {subject.questions.map((question) => (
              <Accordion 
                key={question.question_id}
                expanded={expandedQuestion === question.question_id}
                onChange={handleAccordionChange(question.question_id)}
              >
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                    <Chip 
                      label={question.question_data.type} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Typography>{question.label}</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {question.duration} min
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {question.points} pts
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2">Instruction:</Typography>
                    <Box dangerouslySetInnerHTML={{ __html: question.instruction }} />
                    
                    <Divider />
                    
                    <Typography variant="subtitle2">Contenu:</Typography>
                    {question.question_data.type === 'MCQ' && (
                      <Box>
                        <Typography variant="body2">{question.question_data.content.text}</Typography>
                        <Stack spacing={1} sx={{ mt: 2 }}>
                          {question.question_data.content.choices.map((choice) => (
                            <Box 
                              key={choice.id}
                              sx={{ 
                                p: 1, 
                                borderRadius: 1, 
                                bgcolor: choice.isCorrect ? 'success.lighter' : 'background.neutral'
                              }}
                            >
                              <Typography variant="body2">
                                {choice.isCorrect && <Iconify icon="eva:checkmark-circle-fill" color="success.main" sx={{ mr: 1 }} />}
                                {choice.text}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}
                    
                    {question.question_data.type === 'Highlight' && (
                      <Box>
                        <Typography variant="body2">{question.question_data.content.text}</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Réponses attendues:</Typography>
                          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                            {question.question_data.content.answers.map((answer, index) => (
                              <Chip 
                                key={index} 
                                label={answer} 
                                color="success" 
                                size="small"
                              />
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    )}
                    
                    {question.question_data.type === 'Speaking' && (
                      <Box>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle2">Temps de préparation:</Typography>
                            <Typography variant="body2">{question.question_data.content.preparation_time} secondes</Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle2">Temps de parole:</Typography>
                            <Typography variant="body2">{question.question_data.content.speaking_time} secondes</Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle2">Sujets:</Typography>
                            <Stack spacing={1}>
                              {question.question_data.content.topics.map((topic, index) => (
                                <Typography key={index} variant="body2">• {topic}</Typography>
                              ))}
                            </Stack>
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle2">Critères d'évaluation:</Typography>
                            <Stack spacing={1}>
                              {question.question_data.content.criteria.map((criterion, index) => (
                                <Typography key={index} variant="body2">• {criterion}</Typography>
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
                    )}
                    
                    <Divider />
                    
                    <Typography variant="subtitle2">Compétences évaluées:</Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {question.skills.map((skill) => (
                        <Chip 
                          key={skill.skill_id} 
                          label={skill.label} 
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleViewSubject}>
          Voir le sujet complet
        </Button>
        <Button variant="outlined" onClick={onReset}>
          Créer un nouveau sujet
        </Button>
      </Stack>
    </Stack>
  );
}

SubjectReviewStep.propTypes = {
  generatedSubject: PropTypes.object,
  onReset: PropTypes.func,
};
