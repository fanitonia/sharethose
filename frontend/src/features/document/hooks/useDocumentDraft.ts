import { useEffect, useMemo, useReducer, useRef } from "react";

import { MAX_PAGE_COUNT } from "@/features/document/constants";
import type { DocumentDraft, DraftPage } from "@/features/document/types/draft";
import { validateDraft } from "@/features/document/types/validation";

const draftStorageKey = "draft-document";

type DraftAction =
  | { type: "SET_TITLE"; title: string }
  | { type: "RENAME_PAGE"; index: number; name: string }
  | { type: "UPDATE_PAGE_CONTENT"; index: number; content: string }
  | { type: "ADD_PAGE" }
  | { type: "DELETE_PAGE"; index: number }
  | { type: "SELECT_PAGE"; index: number };

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
    selectedPageIndex: 0,
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

function loadDraft(): DocumentDraft {
  try {
    const rawDraft = localStorage.getItem(draftStorageKey);

    if (!rawDraft) {
      return createEmptyDraft();
    }

    const value: unknown = JSON.parse(rawDraft);

    if (typeof value !== "object" || value === null) {
      return createEmptyDraft();
    }

    const draft = value as Record<string, unknown>;

    if (
      typeof draft.title !== "string" ||
      !Array.isArray(draft.pages) ||
      draft.pages.length === 0 ||
      !draft.pages.every(isStoredPage)
    ) {
      return createEmptyDraft();
    }

    return {
      title: draft.title,
      pages: draft.pages.map((page) => ({
        id: typeof page.id === "string" ? page.id : crypto.randomUUID(),
        name: page.name,
        content: page.content,
      })),
      selectedPageIndex:
        typeof draft.selectedPageIndex === "number" &&
        draft.selectedPageIndex >= 0 &&
        draft.selectedPageIndex < draft.pages.length
          ? draft.selectedPageIndex
          : 0,
    };
  } catch {
    return createEmptyDraft();
  }
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
        selectedPageIndex: state.pages.length,
      };
    case "DELETE_PAGE":
      if (state.pages.length === 1 || !state.pages[action.index]) {
        return state;
      }

      return {
        ...state,
        pages: state.pages.filter((_, index) => index !== action.index),
        selectedPageIndex:
          action.index < state.selectedPageIndex
            ? state.selectedPageIndex - 1
            : Math.min(state.selectedPageIndex, state.pages.length - 2),
      };
    case "SELECT_PAGE":
      return state.pages[action.index] ? { ...state, selectedPageIndex: action.index } : state;
  }
}

function useDocumentDraft() {
  const [draft, dispatch] = useReducer(reducer, undefined, loadDraft);
  const persistenceVersion = useRef(0);
  const validationErrors = useMemo(() => validateDraft(draft).errors, [draft]);

  useEffect(() => {
    const version = persistenceVersion.current;
    const timeoutId = window.setTimeout(() => {
      if (version === persistenceVersion.current) {
        localStorage.setItem(draftStorageKey, JSON.stringify(draft));
      }
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [draft]);

  function clearDraft() {
    persistenceVersion.current += 1;
    localStorage.removeItem(draftStorageKey);
  }

  function validate() {
    return validateDraft(draft).success;
  }

  return {
    draft,
    validationErrors,
    validate,
    clearDraft,
    setTitle: (title: string) => dispatch({ type: "SET_TITLE", title }),
    renamePage: (index: number, name: string) => dispatch({ type: "RENAME_PAGE", index, name }),
    updatePageContent: (index: number, content: string) =>
      dispatch({ type: "UPDATE_PAGE_CONTENT", index, content }),
    addPage: () => dispatch({ type: "ADD_PAGE" }),
    deletePage: (index: number) => dispatch({ type: "DELETE_PAGE", index }),
    selectPage: (index: number) => dispatch({ type: "SELECT_PAGE", index }),
  };
}

export { useDocumentDraft };
