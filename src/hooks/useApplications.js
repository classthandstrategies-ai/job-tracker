import { useCallback, useEffect, useRef, useState } from 'react';
import { createApplication, normalizeApplication } from '../models/application';

const STORAGE_KEY = 'job-tracker:applications';

/**
 * Read and validate the persisted application list from localStorage.
 * Anything corrupt (bad JSON, non-array, junk records) is discarded rather
 * than thrown, so a damaged store degrades to an empty list instead of a
 * crashed app.
 *
 * @returns {Application[]}
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeApplication).filter(Boolean);
  } catch {
    // Corrupt JSON or storage unavailable (e.g. private mode) — start clean.
    return [];
  }
}

/**
 * useApplications — owns the list of job applications and keeps it in sync
 * with localStorage.
 *
 * State is hydrated lazily (the initializer runs only on first render), and
 * every change is written back through a single effect that watches the list.
 *
 * @returns {{
 *   applications: Application[],
 *   addApplication: (input?: object) => Application,
 *   updateApplication: (id: string, patch: object) => void,
 *   removeApplication: (id: string) => void,
 *   clearAll: () => void,
 * }}
 */
export function useApplications() {
  // Lazy initializer: loadFromStorage runs once, not on every render.
  const [applications, setApplications] = useState(loadFromStorage);

  // Skip the very first write-back so we don't immediately re-persist the
  // value we just read (a harmless but wasteful round-trip).
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // Quota exceeded or storage blocked — nothing useful to do client-side.
    }
  }, [applications]);

  const addApplication = useCallback((input = {}) => {
    const application = createApplication(input);
    setApplications((prev) => [application, ...prev]);
    return application;
  }, []);

  const updateApplication = useCallback((id, patch) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...patch, id: app.id } : app)),
    );
  }, []);

  const removeApplication = useCallback((id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setApplications([]);
  }, []);

  // Replace the entire list — used for seeding demo data and (later) import.
  const replaceAll = useCallback((next) => {
    setApplications(Array.isArray(next) ? next : []);
  }, []);

  return {
    applications,
    addApplication,
    updateApplication,
    removeApplication,
    clearAll,
    replaceAll,
  };
}
