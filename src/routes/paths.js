// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    exam: {
      root:  `${ROOTS.DASHBOARD}/exam`,
      new: `${ROOTS.DASHBOARD}/exam/new`,
      details: (id) => `${ROOTS.DASHBOARD}/exam/${id}/view`,
      list: `${ROOTS.DASHBOARD}/exam/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/exam/${id}/edit`,
    },
    question: {
      root:  `${ROOTS.DASHBOARD}/question`,
      new: `${ROOTS.DASHBOARD}/question/new`,
      details: (id) => `${ROOTS.DASHBOARD}/question/${id}`,
      preview: (id) => `${ROOTS.DASHBOARD}/question/${id}/preview`,
      list: `${ROOTS.DASHBOARD}/question/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/question/${id}/edit`,
    },
    session: {
      root:  `${ROOTS.DASHBOARD}/session`,
      new: `${ROOTS.DASHBOARD}/session/new`,
      details: (id) => `${ROOTS.DASHBOARD}/session/${id}/view`,
      list: `${ROOTS.DASHBOARD}/session/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/session/${id}/edit`,
    },
    subject: {
      root:  `${ROOTS.DASHBOARD}/subject`,
      new: `${ROOTS.DASHBOARD}/subject/new`,
      details: (id) => `${ROOTS.DASHBOARD}/subject/${id}/view`,
      list: `${ROOTS.DASHBOARD}/subject/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/subject/${id}/edit`,
    },
  },
};
