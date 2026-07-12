import type { UpdatePageRequest } from "./update-page";

interface UpdateDocumentContentRequest {
  title: string;
  pages: UpdatePageRequest[];
}

interface UpdateDocumentExpireDateRequest {
  expireAt: string | null;
}

interface UpdateDocumentPasswordRequest {
  password: string | null;
}

export type {
  UpdateDocumentContentRequest,
  UpdateDocumentExpireDateRequest,
  UpdateDocumentPasswordRequest,
};
