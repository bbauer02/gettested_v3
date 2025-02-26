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

export function useGetExam(filters = null) {
  const url = `${endpoints.exam.list}`;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  return useMemo(
    () => ({
      exams: data?.exams || [],
      examsLoading: isLoading,
      examsError: error,
      examsValidating: isValidating,
      examsEmpty: !isLoading && !data?.exams.length,
    }),
    [data?.exams, error, isLoading, isValidating]
  );
}
