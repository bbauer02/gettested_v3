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

export function useGetSkills(child = false) {
  const url = `${endpoints.skill.list}?child=${child}`;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  return useMemo(
    () => ({
      skills: data?.skills || [],
      skillsLoading: isLoading,
      skillsError: error,
      skillsValidating: isValidating,
      skillsEmpty: !isLoading && !data?.skills.length,
    }),
    [data?.skills, error, isLoading, isValidating]
  );
}
