import { CONFIG } from 'src/global-config';

import { ExamCreateView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new exam | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ExamCreateView />;
}
