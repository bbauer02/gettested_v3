import { CONFIG } from 'src/global-config';

import { SubjectCreateView } from 'src/sections/subject/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new subject | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <SubjectCreateView />;
}
