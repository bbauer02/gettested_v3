import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl, withCredentials: true });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
  },
  test: {
    list: '/api/tests',
  },
  skill: {
    list: '/api/skills',
  },
  question: {
    list: '/api/questions',
    details: '/api/questions',
    preview: '/api/questions',
    create: '/api/questions',
    update: '/api/questions',
    delete: '/api/questions',
  },
  subject: {
    list: '/api/subjects',
    details: '/api/subjects',
    preview: '/api/subjects',
    generate: '/api/subjects/generate',
    create: '/api/subjects',
    update: '/api/subjects',
    delete: '/api/subjects',
  },
  exam: {
    list: '/api/exams',
    details: '/api/exams',
    preview: '/api/exams',
    update: '/api/exams',
    create: '/api/exams',
  }
};
