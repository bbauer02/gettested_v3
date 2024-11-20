'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';



// ----------------------------------------------------------------------

export function QuestionEditView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit question"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Question', href: paths.dashboard.question.root },
          { name: 'Edit question' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      QuestionEditView
    </DashboardContent>
  );
}
