import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetSubjects() {
  const url = `${endpoints.subject.list}`;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      subjects: data?.subjects || [],
      subjectsLoading: isLoading,
      subjectsError: error,
      subjectsValidating: isValidating,
      subjectsEmpty: !isLoading && !data?.subjects.length,
    }),
    [data?.subjects, error, isLoading, isValidating]
  );

  return memoizedValue;
}
