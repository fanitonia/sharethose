import { createContext, useContext, useState } from "react";

import { MAX_PAGE_COUNT } from "@/features/document/constants";
import { useDocumentDraft } from "@/features/document/hooks/useDocumentDraft";
import type { DocumentDraft } from "@/features/document/types/draft";
import type { DraftValidationErrors } from "@/features/document/types/validation";

interface DocumentEditorContextValue {
  draft: DocumentDraft;
  selectedPageIndex: number;
  validationErrors: DraftValidationErrors;
  validate: () => boolean;
  clearDraft: () => void;
  setTitle: (title: string) => void;
  renamePage: (index: number, name: string) => void;
  updatePageContent: (index: number, content: string) => void;
  addPage: () => void;
  deletePage: (index: number) => void;
  selectPage: (index: number) => void;
}

const DocumentEditorContext = createContext<DocumentEditorContextValue | null>(null);

interface DocumentEditorProviderProps {
  children: React.ReactNode;
  initialDraft?: DocumentDraft;
  documentId?: string;
}

function DocumentEditorProvider({
  children,
  initialDraft,
  documentId,
}: DocumentEditorProviderProps) {
  const { draft, ...actions } = useDocumentDraft({ documentId, initialDraft });
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  function clearDraft() {
    actions.clearDraft();
    setSelectedPageIndex(0);
  }

  function addPage() {
    if (draft.pages.length >= MAX_PAGE_COUNT) {
      return;
    }

    actions.addPage();
    setSelectedPageIndex(draft.pages.length);
  }

  function deletePage(index: number) {
    if (draft.pages.length === 1 || !draft.pages[index]) {
      return;
    }

    actions.deletePage(index);
    setSelectedPageIndex((currentIndex) =>
      index < currentIndex ? currentIndex - 1 : Math.min(currentIndex, draft.pages.length - 2)
    );
  }

  function selectPage(index: number) {
    if (draft.pages[index]) {
      setSelectedPageIndex(index);
    }
  }

  return (
    <DocumentEditorContext.Provider
      value={{
        draft,
        ...actions,
        clearDraft,
        addPage,
        deletePage,
        selectedPageIndex,
        selectPage,
      }}
    >
      {children}
    </DocumentEditorContext.Provider>
  );
}

function useDocumentEditor() {
  const context = useContext(DocumentEditorContext);

  if (!context) {
    throw new Error("useDocumentEditor must be used within a DocumentEditorProvider.");
  }

  return context;
}

export { DocumentEditorProvider, useDocumentEditor };
