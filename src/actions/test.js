import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------


export function useGetTests(child=false) {
  const url = `${endpoints.test.list}?child=${child}`;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      tests: data?.tests || [],
      testsLoading: isLoading,
      testsError: error,
      testsValidating: isValidating,
      testsEmpty: !isLoading && !data?.tests.length,
    }),
    [data?.tests, error, isLoading, isValidating]
  );

  return memoizedValue;
}
