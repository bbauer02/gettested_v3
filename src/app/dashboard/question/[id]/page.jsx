import { CONFIG } from 'src/global-config';

import { QuestionDetailsView } from 'src/sections/question/view';

export const metadata = { title: `Question details | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  return <QuestionDetailsView />;
}
