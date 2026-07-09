import "@tanstack/react-query";
import axios, { type AxiosError } from "axios";

interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  traceId?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

function isProblemDetails(value: unknown): value is ProblemDetails {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.title === "string" && typeof candidate.status === "number"
  );
}

function isProblemDetailsError(
  error: unknown
): error is AxiosError<ProblemDetails> {
  return axios.isAxiosError(error) && isProblemDetails(error.response?.data);
}

function getProblemDetails(error: unknown): ProblemDetails | undefined {
  return isProblemDetailsError(error) ? error.response?.data : undefined;
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<ProblemDetails>;
  }
}

export { getProblemDetails, isProblemDetails, isProblemDetailsError };
export type { ProblemDetails };
