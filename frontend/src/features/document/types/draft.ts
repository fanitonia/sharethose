import type { CreateDocumentRequest } from "./api";

interface DraftPage {
  id: string;
  name: string;
  content: string;
}

interface DocumentDraft {
  title: string;
  pages: DraftPage[];
  selectedPageIndex: number;
}

function convertToCreateDocumentRequest(draft: DocumentDraft): CreateDocumentRequest {
  return {
    title: draft.title,
    pages: draft.pages.map(({ name, content }) => ({ name, content })),
  };
}

export type { DocumentDraft, DraftPage };
export { convertToCreateDocumentRequest };
