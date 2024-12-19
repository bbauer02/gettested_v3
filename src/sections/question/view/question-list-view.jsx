'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';



// ----------------------------------------------------------------------

export function QuestionListView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List question"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Question', href: paths.dashboard.question.root },
          { name: 'List question' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      QuestionListView
    </DashboardContent>
  );
}
