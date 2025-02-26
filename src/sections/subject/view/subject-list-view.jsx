'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetTests } from 'src/actions/test';
import { useGetSubjects } from 'src/actions/subject';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SubjectTableToolbar } from '../table/subject-table-toolbar';
import { SubjectTableFiltersResult } from '../table/subject-table-filters-result';
import {
  RenderCellTest,
  RenderCellTitle,
  RenderCellPoints,
  RenderCellDuration,
  RenderCellQuestions,
  RenderCellDescription,
} from '../table/subject-table-row';

// Constants
const HIDE_COLUMNS = {
  description: true
};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

// Custom toolbar component
function CustomToolbar({
                         filters,
                         canReset,
                         selectedRowIds,
                         filteredResults,
                         onOpenConfirmDeleteRows,
                         tests,
                       }) {
  return (
    <>
      <GridToolbarContainer>
        <SubjectTableToolbar filters={filters} options={{ tests }} />

        <GridToolbarQuickFilter />

        <Box
          sx={{
            gap: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarExport />
        </Box>
      </GridToolbarContainer>

      {canReset && (
        <SubjectTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

export function SubjectListView() {
  const confirmDialog = useBoolean();
  const { tests } = useGetTests(true);
  const { subjects, subjectsLoading } = useGetSubjects();

  const [tableData, setTableData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogType, setDialogType] = useState('');
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const filters = useSetState({
    tests: [],
    levels: []
  });

  const { state: currentFilters } = filters;

  useEffect(() => {
    if (subjects?.length) {
      setTableData(subjects);
    }
  }, [subjects]);

  const canReset = !!(currentFilters.tests?.length || currentFilters.levels?.length);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: currentFilters,
  });

  const handleOpenConfirmDelete = useCallback((id) => {
    setSelectedRow(id);
    setDialogType('single');
    confirmDialog.onTrue();
  }, [confirmDialog]);

  const handleOpenConfirmDeleteMultiple = useCallback(() => {
    setDialogType('multiple');
    confirmDialog.onTrue();
  }, [confirmDialog]);

  const handleDelete = useCallback(() => {
    if (dialogType === 'single' && selectedRow) {
      const deleteRow = tableData.filter((row) => row.subject_id !== selectedRow);
      setTableData(deleteRow);
      toast.success('Delete success!');
      setSelectedRow(null);
    } else if (dialogType === 'multiple' && selectedRowIds.length) {
      const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.subject_id));
      setTableData(deleteRows);
      toast.success('Delete success!');
      setSelectedRowIds([]);
    }
    confirmDialog.onFalse();
  }, [dialogType, selectedRow, selectedRowIds, tableData, confirmDialog]);

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={handleOpenConfirmDeleteMultiple}
        tests={tests}
      />
    ),
    [canReset, filters, selectedRowIds, dataFiltered.length, handleOpenConfirmDeleteMultiple, tests]
  );

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <RenderCellTitle
          params={params}
          href={paths.dashboard.subject.details(params.row.subject_id)}
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      hideable: true,
      renderCell: (params) => <RenderCellDescription params={params} />,
    },
    {
      field: 'test',
      headerName: 'Test/Level',
      flex: 1,
      hideable: false,
      renderCell: (params) => <RenderCellTest params={params} />,
    },
    {
      field: 'questionCount',
      headerName: 'Questions',
      flex: 1,
      hideable: false,
      renderCell: (params) => <RenderCellQuestions params={params} />,
    },
    {
      field: 'totalPoints',
      headerName: 'Total Points',
      flex: 1,
      hideable: false,
      renderCell: (params) => <RenderCellPoints params={params} />,
    },
    {
      field: 'totalDuration',
      headerName: 'Duration',
      flex: 1,
      hideable: false,
      renderCell: (params) => <RenderCellDuration params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          component={RouterLink}
          href={paths.dashboard.subject.details(params.row.subject_id)}
        />,
        <GridActionsCellItem
          key="edit"
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          component={RouterLink}
          href={paths.dashboard.subject.edit(params.row.subject_id)}
        />,
        <GridActionsCellItem
          key="delete"
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleOpenConfirmDelete(params.row.subject_id)}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Subjects List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Subject', href: paths.dashboard.subject.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.subject.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Subject
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ height: 720 }}>
          <DataGrid
            getRowId={(row) => row.subject_id}
            rows={dataFiltered}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            loading={subjectsLoading}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={setColumnVisibilityModel}
            onRowSelectionModelChange={setSelectedRowIds}
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent title="No subjects found" />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              columnsManagement: { getTogglableColumns },
            }}
            sx={{
              [`& .${gridClasses.cell}`]: {
                alignItems: 'center',
                display: 'inline-flex'
              }
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{' '}
            <strong>
              {dialogType === 'single'
                ? 'this subject'
                : `${selectedRowIds.length} subjects`}
            </strong>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, filters }) {
  const { tests, levels } = filters;

  if (!tests?.length) {
    return inputData;
  }

  return inputData.filter((subject) => {
    // Check if subject's test is in selected tests
    if (!tests.includes(subject.test?.label)) {
      return false;
    }

    // If no levels selected or subject has no level, include it
    if (!levels?.length || !subject.level) {
      return true;
    }

    // Check if subject's level matches any selected level
    const subjectLevel = `${subject.test.label} - ${subject.level.label}`;
    return levels.includes(subjectLevel);
  });
}
