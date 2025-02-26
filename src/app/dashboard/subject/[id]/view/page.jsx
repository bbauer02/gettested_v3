import { CONFIG } from 'src/global-config';

import { SubjectView } from 'src/sections/subject/view';

// ----------------------------------------------------------------------

export const metadata = { title: `View a subject | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <SubjectView />;
}
