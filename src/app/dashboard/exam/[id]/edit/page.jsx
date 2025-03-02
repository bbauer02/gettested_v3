import { CONFIG } from 'src/global-config';

import { ExamEditView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Edit an exam | Dashboard - ${CONFIG.appName}` };

export default function Page({ params }) {
  return <ExamEditView exam_id={params.id}/>;
}
