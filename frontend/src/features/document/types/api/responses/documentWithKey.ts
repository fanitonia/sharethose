import type { Document } from "./document";

interface DocumentWithKey {
  editKey: string;
  document: Document;
}

export type { DocumentWithKey };
