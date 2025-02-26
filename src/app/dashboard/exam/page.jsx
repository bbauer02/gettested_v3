import { CONFIG } from 'src/global-config';

import { ExamListView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Exam list | Dashboard - ${CONFIG.appName}` };

export default function Page() {

  return <ExamListView />;
}
