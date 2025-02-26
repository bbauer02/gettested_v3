'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function QuestionPreviewHeader({ question }) {
  const {
    label,
    test,
    level,
    duration,
    points,
    skills = [],
    question_data
  } = question;

  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.neutral', p: 3 }}>
      {/* Identification de la question */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ position: 'relative', flexGrow: 1 }}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Question Reference
              </Typography>
              <Typography variant="h4">{label}</Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Chip
                size="medium"
                color="info"
                label={question_data.type}
                icon={<Iconify icon="mdi:form-textbox" />}
              />

              <Chip
                size="medium"
                color="primary"
                label={test.label}
                icon={<Iconify icon="mdi:certificate" />}
              />

              <Chip
                size="medium"
                color="secondary"
                label={level.label}
                icon={<Iconify icon="mdi:stairs" />}
              />
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={4}
            sx={{
              pt: 2,
              px: 3,
              pb: 2.5,
              borderRadius: 1,
              bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.100' : 'grey.900'
            }}
          >
            <Stack spacing={0.5} alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="mdi:clock-outline" width={20} sx={{ color: 'text.secondary' }} />
                <Typography variant="subtitle1">Duration</Typography>
              </Stack>
              <Typography variant="h6">{duration} seconds</Typography>
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Stack spacing={0.5} alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="mdi:star-outline" width={20} sx={{ color: 'text.secondary' }} />
                <Typography variant="subtitle1">Points</Typography>
              </Stack>
              <Typography variant="h6">{points} pts</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* Section des compétences */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Iconify icon="mdi:lightbulb-outline" color={theme.palette.primary.main} />
          Skills Assessment
        </Typography>

        <Stack spacing={2}>
          {skills.map((skill) => (
            <Box
              key={skill.skill_id}
              sx={{
                position: 'relative',
                pl: skill.parent ? 4 : 0,
              }}
            >
              {skill.parent && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="mdi:folder-outline" sx={{ color: 'text.secondary' }} />
                    <Typography variant="subtitle1">
                      {skill.parent.label}
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {skill.parent && (
                <Box
                  sx={{
                    left: 28,
                    width: 2,
                    height: 24,
                    position: 'absolute',
                    bgcolor: 'divider',
                  }}
                />
              )}

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light'
                      ? 'primary.lighter'
                      : 'primary.darker',
                  border: `1px solid ${theme.palette.primary.main}`,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="mdi:check-circle" sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                    {skill.label}
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

QuestionPreviewHeader.propTypes = {
  question: PropTypes.shape({
    label: PropTypes.string,
    test: PropTypes.shape({
      label: PropTypes.string,
    }),
    level: PropTypes.shape({
      label: PropTypes.string,
    }),
    duration: PropTypes.number,
    points: PropTypes.number,
    skills: PropTypes.array,
    question_data: PropTypes.object,
  }),
};
