import type { UpdatePageRequest } from "./updatePage";

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
