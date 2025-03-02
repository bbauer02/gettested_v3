'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

import { ExamNewEditForm} from "../exam-new-edit-form";

// ----------------------------------------------------------------------

export function ExamCreateView() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard hasContent acceptPower={1} currentPower={user.systemRole.power}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Create a new exam"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Exam', href: paths.dashboard.exam.root },
            { name: 'New exam' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ExamNewEditForm />

      </DashboardContent>
    </RoleBasedGuard>
  );
}
