'use client';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Card from '@mui/material/Card';

import { paths } from 'src/routes/paths';

import { useGetTests } from 'src/actions/test';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ExamTableToolbar } from 'src/sections/exam/exam-table-toolbar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'label', label: 'Epreuve', align: 'left' },
  { id: 'test', label: 'Test / Niveau', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'optionnal', label: 'Status', align: 'left' },
  { id: 'questions', label: 'Nb Questions', align: 'center' },
  { id: 'duration', label: 'Durée(min.)', align: 'center' },
  { id: 'coeff', label: 'Coeff.', align: 'center' },
  { id: 'score', label: 'Score', align: 'center' },
  { id: 'price', label: 'Prix', align: 'center' },
  { id: 'action', label: 'Action', align: 'center' },
];

// ----------------------------------------------------------------------
export function ExamListView() {
  const table = useTable({ defaultOrderBy: 'label' });

  const { tests } = useGetTests(true);

  const filters = useSetState({
    label: '',
    test: null,
    level: null,
  });

  return (
    <DashboardContent>
        <CustomBreadcrumbs
          heading="Exams List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Exam', href: paths.dashboard.exam.root },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card  sx={{
          minHeight: 640,
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          height: { xs: 800, md: '1px' },
          flexDirection: { md: 'column' },
        }}>
          <ExamTableToolbar
            filters={filters}
            options={{ tests }}
            onResetPage={table.onResetPage}
          />
        </Card>
      </DashboardContent>
  )

}
