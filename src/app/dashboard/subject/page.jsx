import { CONFIG } from 'src/global-config';

import { SubjectListView } from 'src/sections/subject/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Question list | Dashboard - ${CONFIG.appName}` };

export default function Page() {

  return <SubjectListView />;
}
