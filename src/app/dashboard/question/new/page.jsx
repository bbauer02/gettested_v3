import { CONFIG } from 'src/global-config';

import { QuestionCreateView } from 'src/sections/question/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new question | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <QuestionCreateView />;
}
