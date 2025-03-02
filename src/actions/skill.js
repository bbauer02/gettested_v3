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

// Fonction unique pour récupérer tous les skills
export function useGetSkills(child = false) {
  const url = `${endpoints.skill.list}?child=${child}`;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  
  // Retourner tous les skills
  return useMemo(
    () => ({
      skills: data?.data || [],
      skillsLoading: isLoading,
      skillsError: error,
      skillsValidating: isValidating,
      skillsEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );
}

// Fonction pour récupérer les skills par test directement depuis l'API
export function useGetSkillsByTest(testId) {
  // Construire l'URL uniquement si testId est défini
  const url = testId ? `${endpoints.skill.list}?test_id=${testId}&child=true` : null;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  
  return useMemo(
    () => ({
      skills: data?.data || [],
      skillsLoading: isLoading,
      skillsError: error,
      skillsValidating: isValidating,
      skillsEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );
}
