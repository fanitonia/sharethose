import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { PageView, Sidebar } from "@/components/document-viewer";

import { getDocumentQueryOptions } from "@api/queries/get-document";

import ProblemDetailsError from "@components/feedback/problem-details-error";

// TODO: replace pending and error components
export const Route = createFileRoute("/doc/$documentId")({
  loader: async ({ params: { documentId }, context: { queryClient } }) => {
    return queryClient.ensureQueryData(getDocumentQueryOptions(documentId));
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
  const { documentId } = Route.useParams();
  const { data: document } = useSuspenseQuery(
    getDocumentQueryOptions(documentId)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full gap-4">
        {/* TODO: replace with a dropdown on md and below */}
        <Sidebar
          document={document}
          className="hidden h-screen w-72 shrink-0 justify-center bg-card/80 py-5 lg:sticky lg:top-0 lg:flex xl:w-80"
        />

        <PageView
          page={document.pages[0]}
          className="mx-auto h-full max-w-4xl min-w-0 p-5 sm:p-6 lg:p-8"
        />

        {/* TODO: fill with stats/actions content */}
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
