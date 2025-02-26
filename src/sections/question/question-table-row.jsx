import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

export function RenderCellLabel({ params, href }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Link
        component={RouterLink}
        href={href}
        color="inherit"
        noWrap
      >
        <strong>{params.row.label}</strong>
      </Link>
    </Box>
  );
}

export function RenderCellDuration({ params }) {
  return (
    <Typography variant={'body2'}>
      {params.row.duration} min
    </Typography>
  )
}

export function RenderCellPoints({ params }) {
  return (
    <Typography variant={'body2'}>
      {params.row.points}
    </Typography>
  )
}

export function RenderCellQuestionType({ params }) {
  return (
    <Chip
      label={params.row.question_data.type}
      size="small"
      color="info"
    />
  );
}
export function RenderCellTest({ params }) {
  return (
    <>
      {!params.row.level ? (
        <Chip label={params.value.label} size="small" color="primary" />
      ) : (
        <Stack direction="row" spacing={1}>
          <Chip label={params.value.label} size="small" color="primary" />
          <Chip label={params.row.level.label} size="small" color="secondary" />
        </Stack>
      )}
    </>
  );
}
export function RenderCellSkills({ params }) {
  return (
    <Stack direction="row" spacing={1}>
      {params.value.split(', ').map((skill) => (
        <Chip
          key={skill}
          label={skill}
          size="small"
          variant="outlined"
        />
      ))}
    </Stack>
  );
}

export function RenderCellQuestion({ params, href }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Link
        component={RouterLink}
        href={href}
        color="inherit"
        noWrap
      >
        {params.row.question_data.content.text}
      </Link>
    </Box>
  );
}
