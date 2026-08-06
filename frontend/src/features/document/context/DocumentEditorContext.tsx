import { createContext, useContext } from "react";

import { useDocumentDraft } from "@/features/document/hooks/useDocumentDraft";
import type { DocumentDraft, DraftPage } from "@/features/document/types/draft";
import type { DraftValidationErrors } from "@/features/document/types/validation";

interface DocumentEditorContextValue {
  draft: DocumentDraft;
  title: string;
  pages: DraftPage[];
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
  storageKey?: string;
  initialDraft?: DocumentDraft;
}

function DocumentEditorProvider({
  children,
  storageKey,
  initialDraft,
}: DocumentEditorProviderProps) {
  const { draft, ...actions } = useDocumentDraft({ storageKey, initialDraft });

  return (
    <DocumentEditorContext.Provider value={{ draft, ...draft, ...actions }}>
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
