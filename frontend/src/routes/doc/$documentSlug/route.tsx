import { Outlet, createFileRoute } from "@tanstack/react-router";

import { ProblemDetails } from "@/components/feedback/error/problem-details";

import { documentQueryOptions } from "@/features/document/api";

export const Route = createFileRoute("/doc/$documentSlug")({
  loader: async ({ params: { documentSlug }, context: { queryClient } }) => {
    return queryClient.ensureQueryData(documentQueryOptions(documentSlug));
  },
  // TODO: create a better loading state (skeleton or spinner?)
  pendingComponent: () => <div className="m-4">Loading document...</div>,
  errorComponent: ({ error }) => (
    <ProblemDetails error={error} fallbackMessage="Failed to load document." />
  ),
  component: Outlet,
});
