import { CONFIG } from 'src/global-config';
import axios, { endpoints } from 'src/lib/axios';

import { QuestionPreview } from 'src/sections/question/preview';

export const  metadata = { title: `Question preview | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
   return <QuestionPreview question_id={params.id} />;
}
