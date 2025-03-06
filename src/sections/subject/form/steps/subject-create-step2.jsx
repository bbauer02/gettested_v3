import { useFormContext } from 'react-hook-form';
import { 
  Stack, 
  Typography, 
  Divider, 
  Card, 
  CardHeader, 
  CardContent,
  Alert,
  Box,
  Chip
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useGetTests } from 'src/actions/test';
import { useEffect, useState } from 'react';

export function SubjectCreateStep2() {
  const { watch } = useFormContext();
  const values = watch();
  const { tests, testsLoading } = useGetTests(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [hasLevels, setHasLevels] = useState(false);

  // Trouver les tests et niveaux à partir des IDs
  useEffect(() => {
    if (tests && tests.length > 0) {
      // Recherche du test par ID (vérifier à la fois id et test_id)
      if (values.test_id) {
        const foundTest = tests.find(test => 
          test.id === values.test_id || test.test_id === values.test_id
        );
        
        if (foundTest) {
          setSelectedTest(foundTest);
          
          // Vérifier si le test a des niveaux
          setHasLevels(foundTest.Levels && foundTest.Levels.length > 0);
          
          // Recherche du niveau par ID si le test est trouvé
          if (foundTest.Levels && values.level_id) {
            const foundLevel = foundTest.Levels.find(level => 
              level.id === values.level_id || level.level_id === values.level_id
            );
            
            if (foundLevel) {
              setSelectedLevel(foundLevel);
            }
          }
        }
      }
    }
  }, [tests, values.test_id, values.level_id]);

  // Afficher les valeurs pour le débogage
  useEffect(() => {
    console.log('SubjectQuestionsStep - values:', values);
    console.log('SubjectQuestionsStep - selectedTest:', selectedTest);
    console.log('SubjectQuestionsStep - selectedLevel:', selectedLevel);
  }, [values, selectedTest, selectedLevel]);

  return (
    <Stack spacing={3}>
      <Typography variant="h6" gutterBottom>
        Configuration de la génération
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Vérifiez les informations ci-dessous avant de générer le sujet. Le système va créer un sujet d'examen avec des questions adaptées au test et au niveau sélectionnés.
      </Alert>

      <Card>
        <CardHeader title="Récapitulatif" />
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Titre
              </Typography>
              <Typography variant="body2">{values.title || 'Non défini'}</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Test
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                {selectedTest ? (
                  <>
                    <Typography variant="body2">{selectedTest.label}</Typography>
                  </>
                ) : (
                  <Chip 
                    label={values.test_id ? `ID: ${values.test_id} (nom non trouvé)` : "Non sélectionné"} 
                    size="small" 
                    color={values.test_id ? "warning" : "error"}
                  />
                )}
              </Stack>
            </Stack>

            {hasLevels && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Niveau
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {selectedLevel ? (
                    <>
                      <Typography variant="body2">{selectedLevel.label}</Typography>
                    </>
                  ) : (
                    <Chip 
                      label={values.level_id ? `ID: ${values.level_id} (nom non trouvé)` : "Non sélectionné"} 
                      size="small" 
                      color={values.level_id ? "warning" : "error"}
                    />
                  )}
                </Stack>
              </Stack>
            )}

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Durée totale
              </Typography>
              <Typography variant="body2">{values.totalDuration} minutes</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Points totaux
              </Typography>
              <Typography variant="body2">{values.totalPoints} points</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Points requis
              </Typography>
              <Typography variant="body2">{values.requiredPoints} points</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Alert severity="warning">
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="eva:alert-triangle-fill" />
          <Typography variant="body2">
            La génération peut prendre quelques instants. Veuillez ne pas fermer cette page pendant le processus.
          </Typography>
        </Stack>
      </Alert>
    </Stack>
  );
}
