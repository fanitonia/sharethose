import { Navigate, createFileRoute, getRouteApi } from "@tanstack/react-router";

export const Route = createFileRoute("/doc/$documentSlug/")({
  component: RouteComponent,
});

const documentRoute = getRouteApi("/doc/$documentSlug");

function RouteComponent() {
  const { documentSlug } = Route.useParams();
  const document = documentRoute.useLoaderData();

  return (
    <Navigate
      to="/doc/$documentSlug/page/$pageSlug"
      params={{
        documentSlug,
        pageSlug: document.pages[0].slug,
      }}
      replace
    />
  );
}
