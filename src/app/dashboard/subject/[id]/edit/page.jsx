import { CONFIG } from 'src/global-config';

import { SubjectEditView } from 'src/sections/subject/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Edit a subject | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <SubjectEditView />;
}
