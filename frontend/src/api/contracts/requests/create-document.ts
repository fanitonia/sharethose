import type { CreatePageRequest } from "./create-page.ts";

interface CreateDocumentRequest {
  title: string;
  slug: string;
  password?: string | null;
  expireAt: Date | null;
  pages: CreatePageRequest[];
}

export type { CreateDocumentRequest };
