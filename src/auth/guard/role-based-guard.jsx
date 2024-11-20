'use client';

import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export function RoleBasedGuard({ sx, children, hasContent, currentRole, acceptRoles, currentPower, acceptPower }) {

  // Fonction qui vérifie l'accès
  const checkAccess = () => {
    // Si on a spécifié des rôles acceptés, on vérifie le rôle
    if (typeof acceptRoles !== 'undefined') {
      return acceptRoles.includes(currentRole);
    }

    // Sinon si on a spécifié une puissance minimale, on vérifie la puissance
    if (typeof acceptPower !== 'undefined') {
      return parseInt(currentPower, 10) >= parseInt(acceptPower, 10);
    }

    // Si aucun critère n'est spécifié, on autorise l'accès
    return true;
  };

  // Si l'accès est refusé

  if (!checkAccess()) {
    return hasContent ? (
        <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Permission denied
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>
              You do not have permission to access this page.
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
          </m.div>
        </Container>
    ) : null;
  }



  return <> {children} </>;
}
