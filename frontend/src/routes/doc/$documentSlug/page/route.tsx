import { Outlet, createFileRoute, getRouteApi } from "@tanstack/react-router";

import { EditDocumentButton } from "@/features/document/components/DocumentEdit";
import {
  DocumentSidebar,
  DocumentSidebarMobile,
} from "@/features/document/components/DocumentSidebar";

export const Route = createFileRoute("/doc/$documentSlug/page")({
  component: RouteComponent,
});

const documentRoute = getRouteApi("/doc/$documentSlug");

function RouteComponent() {
  const document = documentRoute.useLoaderData();

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
        <div className="flex h-screen max-w-4xl min-w-0 grow p-5 sm:p-6 lg:p-8">
          <Outlet />
        </div>
        <div className="fixed right-4 bottom-6 z-50 xl:static xl:mr-4 xl:mb-6 xl:max-h-fit xl:self-end">
          <EditDocumentButton document={document} className="rounded-none" />
        </div>
      </div>
    </div>
  );
}
