'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

import { useGetQuestion } from '../../../actions/question';
import { QuestionNewEditForm} from "../question-new-edit-form";

// ----------------------------------------------------------------------

export function QuestionEditView({ question_id=null }) {
  const { user } = useAuthContext();
  const { question, questionLoading } = useGetQuestion(question_id);

  return (
    <RoleBasedGuard hasContent acceptPower={1} currentPower={user.systemRole.power}>
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

        <QuestionNewEditForm currentQuestion={question} />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
