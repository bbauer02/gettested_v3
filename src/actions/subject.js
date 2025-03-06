import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';

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

export function useGetSubject(id) {
  const url = id ? `${endpoints.subject.preview}/${id}` : null;

  const { data, error, isValidating } = useSWR(url, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  });
  
  return useMemo(
    () => ({
      subject: data?.subject || null,
      subjectLoading: !data && !error,
      subjectError: error,
      subjectValidating: isValidating,
    }),
    [data, error, isValidating]
  );
}

export async function updateSubject(id, subjectData) {
  try {
    const response = await axios.put(`${endpoints.subject.update}/${id}`, subjectData);
    
    // Invalider le cache de la liste des sujets
    mutate(endpoints.subject.list);
    
    // Invalider le cache du sujet individuel
    mutate(`${endpoints.subject.preview}/${id}`);
    
    return response.data;
  } catch (error) {
    console.error('Error while updating the subject.', error);
    throw error;
  }
}

export async function createSubject(subjectData) {
  try {
    const response = await axios.post(endpoints.subject.create, subjectData);
    
    // Invalider le cache de la liste des sujets pour afficher le nouveau sujet
    mutate(endpoints.subject.list);
    
    return response.data;
  } catch (error) {
    console.error('Error while creating the subject.', error);
    throw error;
  }
}

export async function generateSubject(subjectData) {
  try {
    const response = await axios.post(endpoints.subject.generate, subjectData);
    
    // Invalider le cache de la liste des sujets
    mutate(endpoints.subject.list);
    
    return response.data;
  } catch (error) {
    console.error('Error while generating the subject.', error);
    throw error;
  }
}
