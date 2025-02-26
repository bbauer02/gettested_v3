'use client';

import Card from '@mui/material/Card';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function SessionListView() {

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Sessions List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Session', href: paths.dashboard.session.root },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          SessionListView
        </Card>
      </DashboardContent>
    </>
  )

}
