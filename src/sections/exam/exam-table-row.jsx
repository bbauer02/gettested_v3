import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellDuration({ params }) {
  if (!params?.row) return null;

  // La durée est en secondes, convertir en heures et minutes
  const seconds = params.row.duration || 0;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return (
    <Tooltip title={`${minutes} minutes total`}>
      <Box component="span">
        {hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`}
      </Box>
    </Tooltip>
  );
}

export function RenderCellOption({ params }) {
  if (!params?.row) return null;

  return (
    <Label variant="soft" color={params.row.isOption ? 'warning' : 'success'}>
      {params.row.isOption ? 'Optional' : 'Required'}
    </Label>
  );
}

export function RenderCellType({ params }) {
  if (!params?.row) return null;

  return (
    <Label variant="soft" color={params.row.isWritten ? 'info' : 'primary'}>
      {params.row.isWritten ? 'Written' : 'Oral'}
    </Label>
  );
}

export function RenderCellCoeff({ params }) {
  if (!params?.row) return null;
  return (
    <Box sx={{ textAlign: 'center', width: '100%' }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: '50%',
          bgcolor: 'primary.lighter',
          color: 'primary.main',
          fontWeight: 'bold',
        }}
      >
        {params.row.coeff}
      </Box>
    </Box>
  );
}

export function RenderCellExam({ params, href }) {
  if (!params?.row) return null;

  const testName = params.row.Test?.label || '';
  const levelName = params.row.Level?.label || '';
  const testLevel = testName && levelName ? `${testName} - ${levelName}` : testName || 'N/A';
  const isOptional = params.row.isOption;

  return (
    <Box
      sx={{
        py: 2,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Link component={RouterLink} href={href} color="inherit">
              {params.row.label}
            </Link>
            <Label
              variant="soft"
              color={isOptional ? 'warning' : 'success'}
              sx={{ ml: 1 }}
            >
              {isOptional ? 'Optional' : 'Required'}
            </Label>
            <Label variant="soft" color={params.row.isWritten ? 'info' : 'primary'}>
              {params.row.isWritten ? 'Written' : 'Oral'}
            </Label>
          </Box>
        }
        secondary={testLevel}
        slotProps={{
          primary: { noWrap: false },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
    </Box>
  );
}
