import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  question: icon('ic-question'),
  subject: icon('ic-subject'),
  exam: icon('ic-exam'),
  session: icon('ic-session'),

};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview 6.0.0',
    items: [
      { title: 'One', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Two', path: paths.dashboard.two, icon: ICONS.ecommerce },
      { title: 'Three', path: paths.dashboard.three, icon: ICONS.analytics },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Exam',
        path: paths.dashboard.group.root,
        icon: ICONS.exam,
        children: [
          { title: 'List', path: paths.dashboard.exam.root },
          { title: 'Create', path: paths.dashboard.exam.new },
        ],
      },
      {
        title: 'Question',
        path: paths.dashboard.question.root,
        icon: ICONS.question,
        children: [
          { title: 'List', path: paths.dashboard.question.root },
          { title: 'Create', path: paths.dashboard.question.new },
        ],
      },
      {
        title: 'Subject',
        path: paths.dashboard.subject.root,
        icon: ICONS.subject,
        children: [
          { title: 'List', path: paths.dashboard.subject.root },
          { title: 'Create', path: paths.dashboard.subject.new },
        ],
      },
      {
        title: 'Session',
        path: paths.dashboard.session.root,
        icon: ICONS.session,
        children: [
          { title: 'List', path: paths.dashboard.session.root },
          { title: 'Create', path: paths.dashboard.session.new },
        ],
      }
    ],
  },
];
