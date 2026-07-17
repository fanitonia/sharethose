import type { Page } from "./page";

interface Document {
  id: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  title: string;
  expireAt: string | null;
  pages: Page[];
}

export type { Document };
