import type { ValidationErrorGroup } from "@/types/validationErrorGroup";

import { createContext } from "react";

import type { DocumentDraft } from "@/features/document/types/draft";

interface DocumentEditorContextValue {
  draft: DocumentDraft;
  selectedPageIndex: number;
  validationErrors: ValidationErrorGroup[];
  validate: () => boolean;
  clearDraft: () => void;
  hasPendingDraft: boolean;
  restoreDraft: () => void;
  discardDraft: () => void;
  setTitle: (title: string) => void;
  renamePage: (index: number, name: string) => void;
  updatePageContent: (index: number, content: string) => void;
  addPage: () => void;
  deletePage: (index: number) => void;
  selectPage: (index: number) => void;
}

const DocumentEditorContext = createContext<DocumentEditorContextValue | null>(null);

export { DocumentEditorContext };
export type { DocumentEditorContextValue };
