import { Navigate, createFileRoute, getRouteApi } from "@tanstack/react-router";

export const Route = createFileRoute("/doc/$documentId/")({
  component: RouteComponent,
});

const documentRoute = getRouteApi("/doc/$documentId");

function RouteComponent() {
  const { documentId } = Route.useParams();
  const document = documentRoute.useLoaderData();

  if (document.pages.length === 0) {
    return (
      <div className="mx-auto h-full max-w-4xl min-w-0 p-5 sm:p-6 lg:p-8">
        <div className="rounded-md border border-border p-4 text-sm text-muted-foreground">
          This document has no pages yet.
        </div>
      </div>
    );
  }

  return (
    <Navigate
      to="/doc/$documentId/$pageName"
      params={{
        documentId,
        pageName: document.pages[0].pageName,
      }}
      replace
    />
  );
}
