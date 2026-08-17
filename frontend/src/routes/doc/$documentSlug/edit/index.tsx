import { Navigate, createFileRoute, getRouteApi } from "@tanstack/react-router";

import { useState } from "react";

import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DocumentEditorMobileSidebar,
  DocumentEditorSidebar,
  DocumentSettingsDialog,
  EditorActions,
  MarkdownEditor,
} from "@/features/document/components";
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
  const { draft, selectedPageIndex, updatePageContent } = useDocumentEditor();
  const selectedPage = draft.pages[selectedPageIndex];
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

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
              <Button
                variant="outline"
                size="icon"
                aria-label="Document settings"
                onClick={() => setOpenSettingsDialog(true)}
              >
                <Settings />
              </Button>
              <EditorActions document={document} editKey={editKey} className="ml-auto flex gap-2" />
            </div>
            <MarkdownEditor
              className="min-h-0 flex-1"
              content={selectedPage.content}
              onContentChange={(content) => updatePageContent(selectedPageIndex, content)}
            />
          </div>
        </div>
      </div>
      <DocumentSettingsDialog
        document={document}
        editKey={editKey}
        open={openSettingsDialog}
        onOpenChange={setOpenSettingsDialog}
      />
    </>
  );
}
