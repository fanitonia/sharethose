import type { ProblemDetails } from "@/types/api/problemDetails";
import "@tanstack/react-query";
import axios, { type AxiosError } from "axios";

function isProblemDetails(value: unknown): value is ProblemDetails {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.title === "string" && typeof candidate.status === "number";
}

function isProblemDetailsError(error: unknown): error is AxiosError<ProblemDetails> {
  return axios.isAxiosError(error) && isProblemDetails(error.response?.data);
}

function getProblemDetails(error: unknown): ProblemDetails | undefined {
  return isProblemDetailsError(error) ? error.response?.data : undefined;
}

export { getProblemDetails };
