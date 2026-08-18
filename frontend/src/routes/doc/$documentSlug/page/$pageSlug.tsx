import { createFileRoute, getRouteApi, notFound } from "@tanstack/react-router";

import { NotFound } from "@/components/feedback/empty/not-found";

import { MarkdownRenderer } from "@/features/document/components/markdown";

export const Route = createFileRoute("/doc/$documentSlug/page/$pageSlug")({
  component: RouteComponent,
  notFoundComponent: () => <NotFound className="m-auto" />,
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
