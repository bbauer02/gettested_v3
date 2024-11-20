'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';



// ----------------------------------------------------------------------

export function QuestionDetailsView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Question details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Question', href: paths.dashboard.question.root },
          { name: 'Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      QuestionDetailsView
    </DashboardContent>
  );
}
