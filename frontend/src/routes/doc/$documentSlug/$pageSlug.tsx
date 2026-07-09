import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { PageView } from "@/components/document-viewer";

export const Route = createFileRoute("/doc/$documentSlug/$pageSlug")({
  component: RouteComponent,
});

const documentRoute = getRouteApi("/doc/$documentSlug");

function RouteComponent() {
  const { pageSlug } = Route.useParams();
  const document = documentRoute.useLoaderData();
  const page = document.pages.find((candidate) => candidate.slug === pageSlug);

  if (!page) {
    return (
      <div className="mx-auto h-full max-w-4xl min-w-0 p-5 sm:p-6 lg:p-8">
        <div className="rounded-md border border-border p-4 text-sm text-muted-foreground">
          Page not found.
        </div>
      </div>
    );
  }

  return (
    <PageView
      page={page}
      className="mx-auto h-full max-w-4xl min-w-0 p-5 sm:p-6 lg:p-8"
    />
  );
}
