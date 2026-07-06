import type { UpdatePageRequest } from "./update-page";

interface UpdateDocumentContentRequest {
  title: string;
  pages: UpdatePageRequest[];
}

export type { UpdateDocumentContentRequest };
