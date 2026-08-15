import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { DRAFT_EXPIRATION_MS, MAX_PAGE_COUNT } from "@/features/document/constants";
import type { DocumentDraft, DraftPage } from "@/features/document/types/draft";
import type { DraftStorage } from "@/features/document/types/draftStorage";
import { validateDraft } from "@/features/document/types/validation";

const draftStorageKey = "document-drafts-v2";

interface UseDocumentDraftOptions {
  initialDraft?: DocumentDraft;
  documentId?: string;
}

type DraftAction =
  | { type: "SET_TITLE"; title: string }
  | { type: "RENAME_PAGE"; index: number; name: string }
  | { type: "UPDATE_PAGE_CONTENT"; index: number; content: string }
  | { type: "ADD_PAGE" }
  | { type: "DELETE_PAGE"; index: number }
  | { type: "RESET"; draft: DocumentDraft };

function createPage(): DraftPage {
  return {
    id: crypto.randomUUID(),
    name: "Untitled Page",
    content: "",
  };
}

function createEmptyDraft(): DocumentDraft {
  return {
    title: "Untitled Document",
    pages: [createPage()],
  };
}

function isStoredPage(value: unknown): value is Omit<DraftPage, "id"> & {
  id?: unknown;
} {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const page = value as Record<string, unknown>;
  return typeof page.name === "string" && typeof page.content === "string";
}

function isDraftStorage(value: unknown): value is DraftStorage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const storage = value as Record<string, unknown>;
  return Array.isArray(storage.edited);
}

function isExpired(createdAt: string): boolean {
  const createdAtTime = new Date(createdAt).getTime();
  return Number.isNaN(createdAtTime) || Date.now() - createdAtTime > DRAFT_EXPIRATION_MS;
}

function isStoredDraft(value: unknown): value is { draft: DocumentDraft; createdAt: string } {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const storedDraft = value as Record<string, unknown>;
  const draft = storedDraft.draft as Record<string, unknown>;
  return (
    typeof storedDraft.createdAt === "string" &&
    typeof draft === "object" &&
    draft !== null &&
    typeof draft.title === "string" &&
    Array.isArray(draft.pages) &&
    draft.pages.length > 0 &&
    draft.pages.every(isStoredPage)
  );
}

function draftsAreEqual(left: DocumentDraft, right: DocumentDraft): boolean {
  return (
    left.title === right.title &&
    left.pages.length === right.pages.length &&
    left.pages.every(
      (page, index) =>
        page.name === right.pages[index]?.name && page.content === right.pages[index]?.content
    )
  );
}

function readDraftStorage(): DraftStorage {
  try {
    const rawStorage = localStorage.getItem(draftStorageKey);

    if (!rawStorage) {
      return { edited: [] };
    }

    const value: unknown = JSON.parse(rawStorage);
    if (!isDraftStorage(value)) {
      localStorage.removeItem(draftStorageKey);
      return { edited: [] };
    }

    const created =
      isStoredDraft(value.created) && !isExpired(value.created.createdAt)
        ? value.created
        : undefined;
    const edited = value.edited.filter(
      (entry): entry is DraftStorage["edited"][number] =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as Record<string, unknown>).documentId === "string" &&
        isStoredDraft(entry) &&
        !isExpired(entry.createdAt)
    );
    const storage = { created, edited };

    if (created || edited.length > 0) {
      localStorage.setItem(draftStorageKey, JSON.stringify(storage));
    } else {
      localStorage.removeItem(draftStorageKey);
    }

    return storage;
  } catch {
    localStorage.removeItem(draftStorageKey);
    return { edited: [] };
  }
}

function findStoredDraft(options?: UseDocumentDraftOptions): DocumentDraft | undefined {
  const storage = readDraftStorage();
  const storedDraft = options?.documentId
    ? storage.edited.find((entry) => entry.documentId === options.documentId)
    : storage.created;

  return storedDraft?.draft;
}

function reducer(state: DocumentDraft, action: DraftAction): DocumentDraft {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.title };
    case "RENAME_PAGE":
      return {
        ...state,
        pages: state.pages.map((page, index) =>
          index === action.index ? { ...page, name: action.name } : page
        ),
      };
    case "UPDATE_PAGE_CONTENT":
      return {
        ...state,
        pages: state.pages.map((page, index) =>
          index === action.index ? { ...page, content: action.content } : page
        ),
      };
    case "ADD_PAGE":
      if (state.pages.length >= MAX_PAGE_COUNT) {
        return state;
      }

      return {
        ...state,
        pages: [...state.pages, createPage()],
      };
    case "DELETE_PAGE":
      if (state.pages.length === 1 || !state.pages[action.index]) {
        return state;
      }

      return {
        ...state,
        pages: state.pages.filter((_, index) => index !== action.index),
      };
    case "RESET":
      return action.draft;
  }
}

function useDocumentDraft(options?: UseDocumentDraftOptions) {
  const initialDraft = options?.initialDraft;
  const documentId = options?.documentId;
  const [initialState] = useState(() => {
    const fallbackDraft = initialDraft ?? createEmptyDraft();
    const storedDraft = findStoredDraft(options);

    return {
      fallbackDraft,
      pendingDraft:
        storedDraft && !draftsAreEqual(storedDraft, fallbackDraft) ? storedDraft : undefined,
    };
  });
  const [draft, dispatch] = useReducer(reducer, initialState.fallbackDraft);
  const [pendingDraft, setPendingDraft] = useState(initialState.pendingDraft);
  const persistenceVersion = useRef(0);
  const skipNextPersistence = useRef(false);
  const validationErrors = useMemo(() => validateDraft(draft).errors, [draft]);

  useEffect(() => {
    if (pendingDraft) {
      return;
    }

    if (skipNextPersistence.current) {
      skipNextPersistence.current = false;
      return;
    }

    const version = persistenceVersion.current;
    const timeoutId = window.setTimeout(() => {
      if (version === persistenceVersion.current) {
        const storage = readDraftStorage();
        const createdAt = new Date().toISOString();

        if (documentId) {
          const existingDraft = storage.edited.find((entry) => entry.documentId === documentId);
          storage.edited = [
            ...storage.edited.filter((entry) => entry.documentId !== documentId),
            { documentId, draft, createdAt: existingDraft?.createdAt ?? createdAt },
          ];
        } else {
          storage.created = { draft, createdAt: storage.created?.createdAt ?? createdAt };
        }

        localStorage.setItem(draftStorageKey, JSON.stringify(storage));
      }
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [documentId, draft, pendingDraft]);

  function removeStoredDraft() {
    const storage = readDraftStorage();

    if (documentId) {
      storage.edited = storage.edited.filter((entry) => entry.documentId !== documentId);
    } else {
      delete storage.created;
    }

    if (storage.created || storage.edited.length > 0) {
      localStorage.setItem(draftStorageKey, JSON.stringify(storage));
    } else {
      localStorage.removeItem(draftStorageKey);
    }
  }

  function restoreDraft() {
    if (!pendingDraft) {
      return;
    }

    dispatch({ type: "RESET", draft: pendingDraft });
    setPendingDraft(undefined);
  }

  function discardDraft() {
    if (!pendingDraft) {
      return;
    }

    persistenceVersion.current += 1;
    skipNextPersistence.current = true;
    removeStoredDraft();
    dispatch({ type: "RESET", draft: initialState.fallbackDraft });
    setPendingDraft(undefined);
  }

  function clearDraft() {
    persistenceVersion.current += 1;
    skipNextPersistence.current = true;
    removeStoredDraft();

    dispatch({ type: "RESET", draft: initialState.fallbackDraft });
  }

  function validate() {
    return validateDraft(draft).success;
  }

  return {
    draft,
    validationErrors,
    validate,
    clearDraft,
    hasPendingDraft: Boolean(pendingDraft),
    restoreDraft,
    discardDraft,
    setTitle: (title: string) => dispatch({ type: "SET_TITLE", title }),
    renamePage: (index: number, name: string) => dispatch({ type: "RENAME_PAGE", index, name }),
    updatePageContent: (index: number, content: string) =>
      dispatch({ type: "UPDATE_PAGE_CONTENT", index, content }),
    addPage: () => dispatch({ type: "ADD_PAGE" }),
    deletePage: (index: number) => dispatch({ type: "DELETE_PAGE", index }),
  };
}

export { useDocumentDraft };
