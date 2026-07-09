import { Outlet, createFileRoute } from "@tanstack/react-router";

import { getDocumentQueryOptions } from "@api/queries/get-document";

import { Sidebar } from "@components/document-viewer";
import ProblemDetailsError from "@components/feedback/problem-details-error";

export const Route = createFileRoute("/doc/$documentSlug")({
  loader: async ({ params: { documentSlug }, context: { queryClient } }) => {
    return queryClient.ensureQueryData(getDocumentQueryOptions(documentSlug));
  },
  pendingComponent: () => <div className="m-4">Loading document...</div>,
  errorComponent: ({ error }) => (
    <ProblemDetailsError
      error={error}
      fallbackMessage="Failed to load document."
    />
  ),
  component: RouteComponent,
});

function RouteComponent() {
  const document = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full gap-4">
        <Sidebar
          document={document}
          className="hidden h-screen w-72 shrink-0 justify-center bg-card/80 py-5 lg:sticky lg:top-0 lg:flex xl:w-80"
        />

        {/* page view */}
        <Outlet />

        <aside className="hidden shrink-0 border-2 p-5 xl:flex xl:flex-col">
          <div className="flex h-full flex-col gap-6">
            <div className="flex-1 p-4 text-sm text-muted-foreground">
              Placeholder for stats/actions content
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
