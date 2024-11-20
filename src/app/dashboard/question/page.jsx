import { CONFIG } from 'src/config-global';

import { QuestionListView} from "src/sections/question/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Question list | Dashboard - ${CONFIG.appName}` };
export default function Page() {
  return <QuestionListView />;
}
