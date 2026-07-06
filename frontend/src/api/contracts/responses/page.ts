interface Page {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  pageName: string;
  content: string;
  pageNumber: number;
}

export type { Page };
