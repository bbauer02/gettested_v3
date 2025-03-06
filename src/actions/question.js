import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { endpoints, fetcher } from 'src/lib/axios';
import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetQuestions(child = false) {
  const url = `${endpoints.question.list}?child=${child}`;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnReconnect: true,
    dedupingInterval: 1000,
  });
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

  const { data, error, isValidating } = useSWR(url, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnReconnect: true,
    dedupingInterval: 1000,
  });
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

/**
 * Crée une nouvelle question
 * @param {Object} questionData - Les données de la question à créer
 * @returns {Promise<Object>} - La réponse de l'API
 */
export async function createQuestion(questionData) {
  try {
    console.log('📤 Envoi des données pour création:', questionData);
    
    // Vérification que test_id est présent
    if (!questionData.test_id) {
      throw new Error("L'identifiant du test est requis.");
    }
    
    const response = await axiosInstance.post(endpoints.question.list, questionData);
    
    // Mettre à jour tous les caches pertinents
    const listUrl = endpoints.question.list;
    
    // Fonction pour mettre à jour le cache avec les nouvelles données
    const updateCache = async (url) => {
      try {
        // Récupérer les données actuelles du cache
        const currentData = await fetcher(url);
        
        if (currentData && currentData.questions) {
          // Ajouter la nouvelle question aux données existantes
          const updatedQuestions = [
            response.data.question, // Nouvelle question
            ...currentData.questions, // Questions existantes
          ];
          
          // Mettre à jour le cache avec les nouvelles données
          mutate(
            url,
            { ...currentData, questions: updatedQuestions },
            false // Ne pas revalider immédiatement
          );
        }
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du cache pour ${url}:`, error);
        // En cas d'erreur, forcer une revalidation complète
        mutate(url);
      }
    };
    
    // Mettre à jour les différents caches
    await Promise.all([
      updateCache(listUrl),
      updateCache(`${listUrl}?child=true`),
      updateCache(`${listUrl}?child=false`),
    ]);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création de la question:', error);
    throw error;
  }
}

/**
 * Met à jour une question existante
 * @param {number|string} questionId - L'identifiant de la question à mettre à jour
 * @param {Object} questionData - Les nouvelles données de la question
 * @returns {Promise<Object>} - La réponse de l'API
 */
export async function updateQuestion(questionId, questionData) {
  try {
    console.log(`📤 Mise à jour de la question ${questionId}:`, questionData);
    
    // Vérification que test_id est présent
    if (!questionData.test_id) {
      throw new Error("L'identifiant du test est requis.");
    }
    
    const response = await axiosInstance.put(`${endpoints.question.details}/${questionId}`, questionData);
    
    // Mettre à jour tous les caches pertinents
    const listUrl = endpoints.question.list;
    
    // Fonction pour mettre à jour le cache avec les données mises à jour
    const updateCache = async (url) => {
      try {
        // Récupérer les données actuelles du cache
        const currentData = await fetcher(url);
        
        if (currentData && currentData.questions) {
          // Mettre à jour la question dans le tableau
          const updatedQuestions = currentData.questions.map(question => 
            question.question_id === questionId ? response.data.question : question
          );
          
          // Mettre à jour le cache avec les nouvelles données
          mutate(
            url,
            { ...currentData, questions: updatedQuestions },
            false // Ne pas revalider immédiatement
          );
        }
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du cache pour ${url}:`, error);
        // En cas d'erreur, forcer une revalidation complète
        mutate(url);
      }
    };
    
    // Mettre à jour les différents caches
    await Promise.all([
      updateCache(listUrl),
      updateCache(`${listUrl}?child=true`),
      updateCache(`${listUrl}?child=false`),
      // Également mettre à jour le cache de la question individuelle
      mutate(`${endpoints.question.preview}/${questionId}`, response.data, false)
    ]);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour de la question ${questionId}:`, error);
    throw error;
  }
}
