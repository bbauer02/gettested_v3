'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

import SubjectNewEditForm from "../form/subject-new-edit-form";
// ----------------------------------------------------------------------

export function SubjectCreateView() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard hasContent acceptPower={1} currentPower={user.systemRole.power}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Create a new subject"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Subject', href: paths.dashboard.subject.root },
            { name: 'New subject' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <SubjectNewEditForm />

      </DashboardContent>
    </RoleBasedGuard>
  );
}
