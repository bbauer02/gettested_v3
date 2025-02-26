'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export function SubjectView() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard hasContent acceptPower={1} currentPower={user.systemRole.power}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="View a subject"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Subject', href: paths.dashboard.subject.root },
            { name: 'View subject' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        SubjectView

      </DashboardContent>
    </RoleBasedGuard>
  );
}
