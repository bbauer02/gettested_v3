import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axios,  { endpoints, fetcher } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetExams(filters = null) {
  const url = `${endpoints.exam.list}`;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });
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

export function useGetExam(id) {
  const url = id ? `${endpoints.exam.preview}/${id}` : null;

  const { data, error, isValidating } = useSWR(url, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  });
  
  return useMemo(
    () => ({
      exam: data?.exam || null,
      examLoading: !data && !error,
      examError: error,
      examValidating: isValidating,
    }),
    [data, error, isValidating]
  );
}

export async function updateExam(id, examData) {
  try {
    const response = await axios.put(`${endpoints.exam.update}/${id}`, examData);
    
    // Invalider le cache de la liste des examens
    mutate(endpoints.exam.list);
    
    // Invalider le cache de l'examen individuel
    mutate(`${endpoints.exam.preview}/${id}`);
    
    return response.data;
  } catch (error) {
    console.error('Error while updating the exam.', error);
    throw error;
  }
}

export async function createExam(examData) {
  try {
    const response = await axios.post(endpoints.exam.create, examData);
    
    // Invalider le cache de la liste des examens pour afficher le nouvel examen
    mutate(endpoints.exam.list);
    
    return response.data;
  } catch (error) {
    console.error('Error while creating the exam.', error);
    throw error;
  }
}


