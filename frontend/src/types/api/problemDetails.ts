interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  traceId?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export type { ProblemDetails };
