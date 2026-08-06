import type { CreateDocumentRequest, Document, UpdateDocumentContentRequest } from "./api";

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

function convertDocumentToDraft(document: Document): DocumentDraft {
  return {
    title: document.title,
    pages: document.pages.map((page) => ({
      id: crypto.randomUUID(),
      name: page.name,
      content: page.content,
    })),
    selectedPageIndex: 0,
  };
}

function convertToUpdateDocumentRequest(
  draft: DocumentDraft,
  document: Document
): UpdateDocumentContentRequest {
  return {
    title: draft.title,
    pages: draft.pages.map((page, index) => {
      const existingPage = document.pages[index];

      return existingPage
        ? { id: existingPage.id, name: page.name, content: page.content }
        : { name: page.name, content: page.content };
    }),
  };
}

export type { DocumentDraft, DraftPage };
export { convertToCreateDocumentRequest, convertDocumentToDraft, convertToUpdateDocumentRequest };
