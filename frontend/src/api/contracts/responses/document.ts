import type { Page } from "./page";

interface Document {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  expiresAt: Date;
  pages: Page[];
}

export type { Document };
