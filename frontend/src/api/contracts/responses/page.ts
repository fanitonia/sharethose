interface Page {
  id: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  name: string;
  content: string;
  pageNumber: number;
}

export type { Page };
