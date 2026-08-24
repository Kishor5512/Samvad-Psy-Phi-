import { useState, useEffect, useCallback } from 'react';
import phrasesData from '../data/phrases.json';

const STORAGE_KEY = 'samvaad-progress';

/**
 * Custom hook for managing ISL learning progress in localStorage.
 * @returns {{
 *   completedIds: string[],
 *   markComplete: (id: string) => void,
 *   totalCount: number,
 *   resetProgress: () => void
 * }}
 */
export function useProgress() {
  const [completedIds, setCompletedIds] = useState([]);

  // Total count of phrases in system
  const totalCount = phrasesData ? phrasesData.length : 0;

  // Initialize state from localStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const storedIds = Array.isArray(parsed.completedIds) ? parsed.completedIds : [];
        setCompletedIds(storedIds);
      }
    } catch (err) {
      console.error('Failed to parse samvaad-progress from localStorage', err);
    }
  }, []);

  /**
   * Mark a phrase as completed and save to localStorage.
   * @param {string} id - Phrase ID to mark completed
   */
  const markComplete = useCallback((id) => {
    if (!id) return;

    setCompletedIds((prevIds) => {
      const newIds = prevIds.includes(id) ? prevIds : [...prevIds, id];

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedIds: newIds }));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }

      return newIds;
    });
  }, []);

  /**
   * Reset all progress in localStorage.
   */
  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setCompletedIds([]);
    } catch (e) {
      console.error('Failed to reset progress', e);
    }
  }, []);

  return {
    completedIds,
    markComplete,
    totalCount,
    resetProgress
  };
}

export default useProgress;
