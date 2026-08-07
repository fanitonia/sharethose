import { Navigate, createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import {
  DocumentSidebarEditable,
  DocumentSidebarEditableMobile,
} from "@/features/document/components/DocumentEditor";
import { MarkdownEditor } from "@/features/document/components/MarkdownEditor";
import {
  DocumentSettingsDialog,
  SaveDocumentButton,
} from "@/features/document/components/SaveDocument";
import {
  DocumentEditorProvider,
  useDocumentEditor,
} from "@/features/document/context/DocumentEditorContext";
import type { Document } from "@/features/document/types/api";
import { convertDocumentToDraft } from "@/features/document/types/draft";
import { getEditKey } from "@/features/document/utils/editKeyStorage";

export const Route = createFileRoute("/doc/$documentSlug/edit/")({
  component: RouteComponent,
});

const documentRoute = getRouteApi("/doc/$documentSlug");

function RouteComponent() {
  const document = documentRoute.useLoaderData();
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
  const { draft, updatePageContent } = useDocumentEditor();
  const selectedPage = draft.pages[draft.selectedPageIndex];
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-background">
      <div className="flex w-full items-center bg-card px-4 py-4 lg:hidden">
        <DocumentSidebarEditableMobile />
        <h1 className="flex-1 text-center text-lg font-semibold text-foreground">{draft.title}</h1>
      </div>
      <div className="flex h-full flex-row lg:h-screen">
        <DocumentSidebarEditable className="hidden h-screen w-72 shrink-0 justify-center bg-card/80 py-5 lg:sticky lg:top-0 lg:flex xl:w-80" />
        <div className="flex h-full flex-1 flex-col">
          <div className="flex items-center gap-2 border bg-card px-4 py-4">
            <DocumentSettingsDialog document={document} editKey={editKey} />
            <div className="ml-auto flex gap-2">
              {/* TODO: make this a component */}
              <Button
                variant="secondary"
                onClick={() =>
                  navigate({
                    to: "/doc/$documentSlug",
                    params: { documentSlug: document.slug },
                  })
                }
              >
                Cancel
              </Button>
              <SaveDocumentButton document={document} editKey={editKey} />
            </div>
          </div>
          <MarkdownEditor
            className="min-h-0 flex-1"
            content={selectedPage.content}
            onContentChange={(content) => updatePageContent(draft.selectedPageIndex, content)}
          />
        </div>
      </div>
    </div>
  );
}
