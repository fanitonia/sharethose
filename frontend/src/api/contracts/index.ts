import type { CreateDocumentRequest } from "./requests/create-document";
import type { CreatePageRequest } from "./requests/create-page";
import type {
  UpdateDocumentContentRequest,
  UpdateDocumentExpireDateRequest,
  UpdateDocumentPasswordRequest,
} from "./requests/update-document";
import type { UpdatePageRequest } from "./requests/update-page";
import type { Document } from "./responses/document";
import type { DocumentWithKey } from "./responses/document-with-key";
import type { Page } from "./responses/page";

export type {
  CreateDocumentRequest,
  CreatePageRequest,
  Document,
  DocumentWithKey,
  Page,
  UpdateDocumentContentRequest,
  UpdateDocumentExpireDateRequest,
  UpdateDocumentPasswordRequest,
  UpdatePageRequest,
};
