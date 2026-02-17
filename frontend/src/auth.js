const STORAGE_KEY = 'project-break-auth';

export function getAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}
