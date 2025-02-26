import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';

export function RenderCellTitle({ params, href }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        p: 1,
        '&:hover': {
          bgcolor: 'action.hover',
          borderRadius: 1,
        },
      }}
    >
      <Link
        component={RouterLink}
        href={href}
        color="inherit"
        noWrap
        sx={{
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:book-bold" width={20} />
          <strong>{params.row.title}</strong>
        </Stack>
      </Link>
    </Box>
  );
}

export function RenderCellDescription({ params }) {
  return (
    <Typography
      variant="body2"
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        color: 'text.secondary',
        px: 1,
      }}
    >
      {params.row.description}
    </Typography>
  );
}

export function RenderCellTest({ params }) {
  if (!params.row.test) return null;

  return (
    <Stack direction="row" spacing={1} sx={{ px: 1 }}>
      <Chip
        label={params.row.test.label}
        size="small"
        color="primary"
        sx={{
          fontWeight: 600,
          borderRadius: 1,
        }}
      />
      {params.row.level && (
        <Chip
          label={params.row.level.label}
          size="small"
          color="secondary"
          sx={{
            fontWeight: 600,
            borderRadius: 1,
          }}
        />
      )}
    </Stack>
  );
}

export function RenderCellQuestions({ params }) {
  const hasQuestions = params.row.questionCount > 0;
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        px: 1,
        color: hasQuestions ? 'text.primary' : 'text.disabled',
      }}
    >
      <Iconify
        icon={hasQuestions ? "solar:questions-square-bold" : "solar:shield-cross-bold"}
        width={20}
      />
      <Typography
        variant="body2"
        sx={{ fontWeight: hasQuestions ? 600 : 400 }}
      >
        {hasQuestions ? params.row.questionCount : 'No questions'}
      </Typography>
    </Stack>
  );
}

export function RenderCellPoints({ params }) {
  const hasPoints = params.row.totalPoints;
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        px: 1,
        color: hasPoints ? 'text.primary' : 'text.disabled',
      }}
    >
      <Iconify
        icon={hasPoints ? "solar:star-bold" : "solar:star-broken"}
        width={20}
        sx={{ color: hasPoints ? 'warning.main' : 'inherit' }}
      />
      <Typography
        variant="body2"
        sx={{ fontWeight: hasPoints ? 600 : 400 }}
      >
        {hasPoints || '-'}
      </Typography>
    </Stack>
  );
}

export function RenderCellDuration({ params }) {
  const hasDuration = params.row.totalDuration;
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        px: 1,
        color: hasDuration ? 'text.primary' : 'text.disabled',
      }}
    >
      <Iconify
        icon={hasDuration ? "solar:clock-circle-bold" : "solar:clock-circle-broken"}
        width={20}
        sx={{ color: hasDuration ? 'info.main' : 'inherit' }}
      />
      <Typography
        variant="body2"
        sx={{ fontWeight: hasDuration ? 600 : 400 }}
      >
        {hasDuration ? `${hasDuration} min` : '-'}
      </Typography>
    </Stack>
  );
}


