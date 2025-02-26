import { CONFIG } from 'src/global-config';

import { SessionListView } from 'src/sections/session/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Session list | Dashboard - ${CONFIG.appName}` };

export default function Page() {

  return <SessionListView />;
}
