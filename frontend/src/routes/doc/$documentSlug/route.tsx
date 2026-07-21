import { Outlet, createFileRoute } from "@tanstack/react-router";

import { ProblemDetailsError } from "@/components/feedback/error/ProblemDetailsError";

import { documentQueryOptions } from "@/features/document/api";
import {
  DocumentSidebar,
  DocumentSidebarMobile,
} from "@/features/document/components/DocumentSidebar";

export const Route = createFileRoute("/doc/$documentSlug")({
  loader: async ({ params: { documentSlug }, context: { queryClient } }) => {
    return queryClient.ensureQueryData(documentQueryOptions(documentSlug));
  },
  pendingComponent: () => <div className="m-4">Loading document...</div>,
  errorComponent: ({ error }) => (
    <ProblemDetailsError error={error} fallbackMessage="Failed to load document." />
  ),
  component: RouteComponent,
});

function RouteComponent() {
  const document = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      {/* mobile header & sidebar */}
      <div className="flex w-full items-center bg-card px-4 py-4 lg:hidden">
        <DocumentSidebarMobile document={document} className="absolute lg:hidden" />
        <h2 className="flex-1 text-center text-lg font-semibold text-foreground">
          {document.title}
        </h2>
      </div>

      <div className="flex min-h-screen w-full gap-5">
        <DocumentSidebar
          document={document}
          className="hidden h-screen w-72 shrink-0 justify-center bg-card/80 py-5 lg:sticky lg:top-0 lg:flex xl:w-80"
        />

        {/* page view */}
        <div className="h-full max-w-4xl min-w-0 grow p-5 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
