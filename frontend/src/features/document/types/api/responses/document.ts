import type { Page } from "./page";

interface Document {
  id: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  title: string;
  expireAt: string | null;
  pages: Page[];
}

export type { Document };
