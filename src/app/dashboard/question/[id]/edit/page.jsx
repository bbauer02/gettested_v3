import { CONFIG } from 'src/global-config';

import { QuestionEditView } from 'src/sections/question/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Edit a question | Dashboard - ${CONFIG.appName}` };

export default function Page({ params }) {
  return <QuestionEditView question_id={params.id}/>;
}
