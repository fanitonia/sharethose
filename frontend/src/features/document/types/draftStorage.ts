import type { DocumentDraft } from "./draft";

type DraftStorage = {
  created?: {
    draft: DocumentDraft;
    createdAt: string;
  };
  edited: {
    documentId: string;
    draft: DocumentDraft;
    createdAt: string;
  }[];
};

export type { DraftStorage };
