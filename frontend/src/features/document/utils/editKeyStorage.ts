function getStorageKey(documentSlug: string): string {
  return `document-edit-key-${documentSlug}`;
}

function getEditKey(documentSlug: string): string | null {
  try {
    return sessionStorage.getItem(getStorageKey(documentSlug));
  } catch {
    return null;
  }
}

function setEditKey(documentSlug: string, editKey: string): void {
  try {
    sessionStorage.setItem(getStorageKey(documentSlug), editKey);
  } catch {
    // sessionStorage unavailable (e.g. disabled); edit key stays in memory only
  }
}

function clearEditKey(documentSlug: string): void {
  try {
    sessionStorage.removeItem(getStorageKey(documentSlug));
  } catch {
    // ignore
  }
}

export { getEditKey, setEditKey, clearEditKey };
