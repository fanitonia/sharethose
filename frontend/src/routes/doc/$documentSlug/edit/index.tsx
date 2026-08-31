import { Navigate, createFileRoute, getRouteApi } from "@tanstack/react-router";

import { useGetDocument } from "@/features/document/api";
import {
  DocumentEditorMobileSidebar,
  DocumentEditorSidebar,
  MarkdownEditor,
  UpdateDocumentActions,
} from "@/features/document/components/editor";
import { DocumentEditorProvider } from "@/features/document/context/editor-provider";
import { useDocumentEditor } from "@/features/document/hooks/useDocumentEditor";
import type { Document } from "@/features/document/types/api";
import { convertDocumentToDraft } from "@/features/document/types/draft";
import { getEditKey } from "@/features/document/utils/editKeyStorage";

export const Route = createFileRoute("/doc/$documentSlug/edit/")({
  component: RouteComponent,
});

const documentRoute = getRouteApi("/doc/$documentSlug");

function RouteComponent() {
  const { documentSlug } = Route.useParams();
  const loaderDocument = documentRoute.useLoaderData();
  const { data: document = loaderDocument } = useGetDocument(documentSlug);
  const editKey = getEditKey(document.slug);

  if (!editKey) {
    return <Navigate to="/doc/$documentSlug" params={{ documentSlug: document.slug }} replace />;
  }

  return (
    <DocumentEditorProvider
      documentId={document.id}
      initialDraft={convertDocumentToDraft(document)}
    >
      <EditDocumentEditor document={document} editKey={editKey} />
    </DocumentEditorProvider>
  );
}

interface EditDocumentEditorProps {
  document: Document;
  editKey: string;
}

function EditDocumentEditor({ document, editKey }: EditDocumentEditorProps) {
  const { draft, selectedPageIndex, updatePageContent } = useDocumentEditor();
  const selectedPage = draft.pages[selectedPageIndex];

  return (
    <>
      <div className="h-screen bg-background">
        <div className="flex w-full items-center bg-card px-4 py-4 lg:hidden">
          <DocumentEditorMobileSidebar />
          <h1 className="flex-1 text-center text-lg font-semibold text-foreground">
            {draft.title}
          </h1>
        </div>
        <div className="flex h-full flex-row lg:h-screen">
          <DocumentEditorSidebar className="hidden h-screen w-72 shrink-0 justify-center bg-card/80 py-5 lg:sticky lg:top-0 lg:flex xl:w-80" />
          <div className="flex h-full flex-1 flex-col">
            <div className="flex items-center gap-2 border bg-card px-4 py-4">
              <UpdateDocumentActions document={document} editKey={editKey} className="ml-auto" />
            </div>
            <MarkdownEditor
              className="min-h-0 flex-1"
              content={selectedPage.content}
              onContentChange={(content) => updatePageContent(selectedPageIndex, content)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
