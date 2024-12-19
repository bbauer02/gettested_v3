'use client';

import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function RoleInfo({ data = [], sx, ...other }) {
  const { user } = useAuthContext();
  const mediaQuery = 'sm';

  let displayInstitutName = `${CONFIG.appName} v${CONFIG.appVersion}`;
  let displayRole = user?.systemRole.label;
  if (user?.instituts && user?.instituts.length >= 1) {
    displayInstitutName = `${displayInstitutName} | ${user?.instituts[0].Institut.label}`;
    displayRole = user?.instituts[0].Role.label;
  }
  return (
    <>
      <Box
        component="img"
        alt={displayInstitutName}
        src={`${CONFIG.assetsDir}/assets/icons/role-info/icon_default.svg`}
        sx={{ width: 20, height: 20, borderRadius: '50%' }}
      />
      <Box
        component="span"
        sx={{
          typography: 'h6',
          display: { xs: 'none', [mediaQuery]: 'inline-flex' },
        }}
      >
        {displayInstitutName}
      </Box>
      <Label
        color="default"
        sx={{
          typography: 'subtitle3',
          height: 22,
          display: { xs: 'none', [mediaQuery]: 'inline-flex' },
        }}
      >
        {displayRole}
      </Label>
    </>
  );
}
