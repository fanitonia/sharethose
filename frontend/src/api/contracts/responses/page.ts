interface Page {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  content: string;
  pageNumber: number;
}

export type { Page };
