'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QuestionNewEditForm} from "../question-new-edit-form";

import { useAuthContext } from 'src/auth/hooks';


import { RoleBasedGuard } from 'src/auth/guard';
// ----------------------------------------------------------------------

export function QuestionCreateView() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard hasContent acceptPower={1} currentPower={user.systemRole.power}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Create a new question"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Question', href: paths.dashboard.question.root },
            { name: 'New question' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

          <QuestionNewEditForm />

      </DashboardContent>
    </RoleBasedGuard>
  );
}
