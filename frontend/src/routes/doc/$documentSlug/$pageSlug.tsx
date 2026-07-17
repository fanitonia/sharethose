import { createFileRoute, getRouteApi, notFound } from "@tanstack/react-router";

import { MarkdownRenderer } from "@/features/document/components/MarkdownRenderer";

// TODO: create not found component for pages
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

  return <MarkdownRenderer source={page.content}></MarkdownRenderer>;
}
