import type { CreateDocumentRequest, Document, UpdateDocumentContentRequest } from "./api";

interface DraftPage {
  id: string;
  documentPageId?: number;
  name: string;
  content: string;
}

interface DocumentDraft {
  title: string;
  pages: DraftPage[];
}

function convertToCreateDocumentRequest(draft: DocumentDraft): CreateDocumentRequest {
  return {
    title: draft.title,
    pages: draft.pages.map(({ name, content }) => ({ name, content })),
  };
}

function convertDocumentToDraft(document: Document): DocumentDraft {
  return {
    title: document.title,
    pages: document.pages.map((page) => ({
      id: crypto.randomUUID(),
      documentPageId: page.id,
      name: page.name,
      content: page.content,
    })),
  };
}

function convertToUpdateDocumentRequest(draft: DocumentDraft): UpdateDocumentContentRequest {
  return {
    title: draft.title,
    pages: draft.pages.map(({ documentPageId, name, content }) =>
      documentPageId !== undefined ? { id: documentPageId, name, content } : { name, content }
    ),
  };
}

export type { DocumentDraft, DraftPage };
export { convertToCreateDocumentRequest, convertDocumentToDraft, convertToUpdateDocumentRequest };
