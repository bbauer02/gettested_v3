'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

import { useGetExam} from '../../../actions/exam';
import { ExamNewEditForm} from "../exam-new-edit-form";

// ----------------------------------------------------------------------

export function ExamEditView({ exam_id=null }) {
  const { user } = useAuthContext();
  const { exam, examLoading } = useGetExam(exam_id);



  return (
    <RoleBasedGuard hasContent acceptPower={1} currentPower={user.systemRole.power}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Edit exam"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Exam', href: paths.dashboard.exam.root },
            { name: 'Edit exam' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ExamNewEditForm currentExam={exam} />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
