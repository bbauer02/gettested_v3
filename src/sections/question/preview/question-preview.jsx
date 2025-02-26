'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetQuestion } from 'src/actions/question';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import QuestionPreviewHeader from './question-preview-header';
import QuestionPreviewContent from './question-preview-content';

// ----------------------------------------------------------------------

export default function QuestionPreview({ question_id }) {

  const { question } = useGetQuestion(question_id);

  if (!question) {
    return null;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Question Preview"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Questions', href: paths.dashboard.question.root },
          { name: question.label },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.question.edit(question.question_id)}
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Edit
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <QuestionPreviewHeader question={question} />

        <Stack sx={{ p: 3 }}>
          <QuestionPreviewContent question={question} />
        </Stack>
      </Card>
    </DashboardContent>
  );
}

QuestionPreview.propTypes = {
  question: PropTypes.object,
};
