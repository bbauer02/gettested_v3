'use client';

import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
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
import { useGetExams } from 'src/actions/exam';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExamTableToolbar } from '../exam-table-toolbar';
import { ExamTableFiltersResult } from '../exam-table-filters-result';
import {
  RenderCellType,
  RenderCellExam,
  RenderCellCoeff,
  RenderCellDuration,
} from '../exam-table-row';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
  { value: true, label: 'Written' },
  { value: false, label: 'Oral' },
];

const HIDE_COLUMNS = { test: false };

const HIDE_COLUMNS_TOGGLABLE = ['test', 'actions'];

// ----------------------------------------------------------------------

export function ExamListView() {
  const confirmDialog = useBoolean();

  const { exams = [], examsLoading } = useGetExams();

  const { tests = [] } = useGetTests(true);

  const [tableData, setTableData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const filters = useSetState({ tests: [], levels: [] });
  const { state: currentFilters } = filters;

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (exams.length) {
      setTableData(exams);
    }
  }, [exams]);

  const canReset = currentFilters.tests.length > 0 || currentFilters.levels.length > 0;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: currentFilters
  });

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.exam_id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.exam_id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmDialog.onTrue}
        tests={tests}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFilters, selectedRowIds, tests]
  );

  const columns = [
    { field: 'test', headerName: 'Test', filterable: false,
      valueGetter: (params) => params?.row?.Test?.label || ''},
    {
      field: 'label',
      headerName: 'Exam',
      flex: 1,
      minWidth: 280,
      hideable: false,
      renderCell: (params) => (
        <RenderCellExam params={params} href={paths.dashboard.exam.details(params.row.exam_id)} />
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 120,
      editable: false,
      renderCell: (params) => <RenderCellDuration params={params} />,
    },
    {
      field: 'coeff',
      headerName: 'Coefficient',
      width: 120,
      editable: false,
      renderCell: (params) => <RenderCellCoeff params={params} />,
    },
    {
      field: 'nbrQuestions',
      headerName: 'Questions',
      width: 120,
      editable: false,
    },
    {
      field: 'successScore',
      headerName: 'Success Score',
      width: 140,
      editable: false,
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
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          href={paths.dashboard.exam.details(params.row.exam_id)}
        />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          href={paths.dashboard.exam.edit(params.row.exam_id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleDeleteRow(params.row.exam_id)}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Exams"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Exam', href: paths.dashboard.exam.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.exam.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New exam
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            minHeight: 640,
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: '1px' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered || []}
            columns={columns}
            loading={examsLoading}
            getRowId={(row) => row?.exam_id || Math.random()}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              toolbar: { setFilterButtonEl },
              panel: { anchorEl: filterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

function CustomToolbar({
                         filters,
                         canReset,
                         selectedRowIds,
                         filteredResults,
                         setFilterButtonEl,
                         onOpenConfirmDeleteRows,
                         tests,
                       }) {
  return (
    <>
      <GridToolbarContainer>
        <ExamTableToolbar
          filters={filters}
          options={{ tests }}
        />

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
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Box>
      </GridToolbarContainer>

      {canReset && (
        <ExamTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

export const GridActionsLinkItem = forwardRef((props, ref) => {
  const { href, label, icon, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx}>
      <Link
        component={RouterLink}
        href={href}
        underline="none"
        color="inherit"
        sx={{ width: 1, display: 'flex', alignItems: 'center' }}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        {label}
      </Link>
    </MenuItem>
  );
});

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { tests, levels } = filters;

  if (!tests.length) {
    return inputData;
  }
  return inputData.filter((exam) => {
    // Vérifie d'abord si le test de l'examen est dans les tests sélectionnés
    if ( !tests.includes(String(exam.Test.label))) {
      return false;
    }

    // Si aucun niveau n'est sélectionné, on accepte l'examen
    if (!levels || !levels.length) {
      return true;
    }

    // Vérifie s'il existe des niveaux sélectionnés pour ce test spécifique
    const testLevels = levels.filter(level => level.startsWith(exam.Test.label));

    // Si aucun niveau n'est sélectionné pour ce test spécifique, on accepte tous ses examens
    if (testLevels.length === 0) {
      return true;
    }

    // Si l'examen n'a pas de niveau, on l'accepte quand même
    if (!exam.Level) {
      return true;
    }

    // Sinon, on vérifie si le niveau de l'examen correspond à un des niveaux sélectionnés
    const examLevel = `${exam.Test.label} - ${exam.Level.label}`;
    return testLevels.includes(examLevel);
  });
}
