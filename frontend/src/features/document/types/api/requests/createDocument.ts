import type { CreatePageRequest } from "./createPage.ts";

interface CreateDocumentRequest {
  title: string;
  slug?: string;
  password?: string;
  expireAt?: string;
  pages: CreatePageRequest[];
}

export type { CreateDocumentRequest };
