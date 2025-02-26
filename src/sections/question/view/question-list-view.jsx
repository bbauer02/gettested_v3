'use client';

import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback,forwardRef } from 'react';

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
import { useGetSkills } from 'src/actions/skill';
import { useGetQuestions } from 'src/actions/question';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QuestionTableToolbar } from '../question-table-toolbar';
import { QuestionTableFiltersResult } from '../question-table-filters-result';
import {
  RenderCellTest,
  RenderCellLabel,
  RenderCellPoints,
  RenderCellDuration,
  RenderCellQuestionType,
} from '../question-table-row';
// ----------------------------------------------------------------------
const HIDE_COLUMNS = { label: true };

const HIDE_COLUMNS_TOGGLABLE = ['actions'];
export function QuestionListView() {

  const confirmDialog = useBoolean();

  const { questions, questionsLoading } = useGetQuestions();
  const { tests } = useGetTests(true);
  const { skills } = useGetSkills();

  const [tableData, setTableData] = useState(questions);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const filters = useSetState({ tests: [], levels: [], skills: [] });
  const { state: currentFilters } = filters;

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (questions.length) {
      setTableData(questions);
    }
  }, [questions]);

  const canReset = currentFilters.tests.length > 0 || currentFilters.levels.length > 0 || currentFilters.skills.length > 0;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: currentFilters,
  });

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

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
        skills={skills}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFilters, selectedRowIds, tests]
  );

  const columns = [
    {
      field: 'label',
      headerName: 'Label',
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <RenderCellLabel params={params} href={paths.dashboard.question.details(params.row.id)} />
      ),
    },
    {
      field: 'test',
      headerName: 'Test/Level',
      flex: 1,
      hideable: false,
      renderCell: (params) => {
        // console.log("params : ", params)
        return (
          <RenderCellTest params={params} />
        );
      }
    },
    {
      field: 'question_data.type',
      headerName: 'Question type',
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <RenderCellQuestionType params={params} />
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <RenderCellDuration params={params} />
      ),
    },
    {
      field: 'points',
      headerName: 'Points',
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <RenderCellPoints params={params} />
      ),
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
          href={paths.dashboard.question.preview(params.row.question_id)}
        />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          href={paths.dashboard.question.edit(params.row.question_id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleDeleteRow(params.row.question_id)}
          sx={{ color: 'error.main' }}
        />,
      ],
    }
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
            heading="Questions List"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Question', href: paths.dashboard.question.root },
              { name: 'List' },
            ]}
            action={
              <Button
                component={RouterLink}
                href={paths.dashboard.question.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New question
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
              getRowId={(row) => row.question_id}
              checkboxSelection
              disableRowSelectionOnClick
              rows={dataFiltered}
              columns={columns}
              loading={questionsLoading}
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
                         skills
                       }) {
  return (
    <>
      <GridToolbarContainer>
        <QuestionTableToolbar
          filters={filters}
          options={{ tests, skills }}
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
        <QuestionTableFiltersResult
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

  return inputData.filter((question) => {
    // Vérifie d'abord si le test de la question est dans les tests sélectionnés
    if (!tests.includes(String(question.test.label))) {
      return false;
    }

    // Si aucun niveau n'est sélectionné, on accepte la question
    if (!levels || !levels.length) {
      return true;
    }

    // Vérifie s'il existe des niveaux sélectionnés pour ce test spécifique
    const testLevels = levels.filter(level => level.startsWith(question.test.label));

    // Si aucun niveau n'est sélectionné pour ce test spécifique, on accepte toutes ses questions
    if (testLevels.length === 0) {
      return true;
    }

    // Sinon, on vérifie si le niveau de la question correspond à un des niveaux sélectionnés
    const questionLevel = `${question.test.label} - ${question.level.label}`;
    return testLevels.includes(questionLevel);
  });
}
