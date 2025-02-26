import useSWR from 'swr';
import { useMemo } from 'react';

import { endpoints, fetcher } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetQuestions(child = false) {
  const url = `${endpoints.question.list}?child=${child}`;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  return useMemo(
    () => ({
      questions: data?.questions || [],
      questionsLoading: isLoading,
      questionsError: error,
      questionsValidating: isValidating,
      questionsEmpty: !isLoading && !data?.questions.length,
    }),
    [data?.questions, error, isLoading, isValidating]
  );
}

export function useGetQuestion(id) {
  const url = id ? `${endpoints.question.preview}/${id}` : null;

  const { data, error, isValidating } = useSWR(url, fetcher, swrOptions);
  return useMemo(
    () => ({
      question: data?.question || null,
      questionLoading: !data && !error,
      questionError: error,
      questionValidating: isValidating,
    }),
    [data, error, isValidating]
  );
}
