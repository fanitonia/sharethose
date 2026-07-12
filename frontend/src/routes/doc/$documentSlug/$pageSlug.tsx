import { createFileRoute, getRouteApi, notFound } from "@tanstack/react-router";

import { DocumentPageContent } from "@/components/document";

export const Route = createFileRoute("/doc/$documentSlug/$pageSlug")({
  component: RouteComponent,
  notFoundComponent: () => <div>Page not found</div>,
});

const documentRoute = getRouteApi("/doc/$documentSlug");

function RouteComponent() {
  const { pageSlug } = Route.useParams();
  const document = documentRoute.useLoaderData();
  const page = document.pages.find((candidate) => candidate.slug === pageSlug);

  if (!page) {
    throw notFound();
  }

  return <DocumentPageContent page={page} />;
}
