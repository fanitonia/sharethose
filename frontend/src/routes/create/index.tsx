import { createFileRoute } from "@tanstack/react-router";

import {
  DocumentEditorMobileSidebar,
  DocumentEditorSidebar,
  MarkdownEditor,
  ShareDocumentButton,
} from "@/features/document/components";
import { DocumentEditorProvider } from "@/features/document/context/editor-provider";
import { useDocumentEditor } from "@/features/document/hooks/useDocumentEditor";

export const Route = createFileRoute("/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DocumentEditorProvider>
      <CreateDocumentEditor />
    </DocumentEditorProvider>
  );
}

function CreateDocumentEditor() {
  const { draft, selectedPageIndex, updatePageContent } = useDocumentEditor();
  const selectedPage = draft.pages[selectedPageIndex];

  return (
    <div className="h-screen bg-background">
      <div className="flex w-full items-center bg-card px-4 py-4 lg:hidden">
        <DocumentEditorMobileSidebar />
        <h1 className="flex-1 text-center text-lg font-semibold text-foreground">{draft.title}</h1>
      </div>
      <div className="flex h-full flex-row lg:h-screen">
        <DocumentEditorSidebar className="hidden h-screen w-72 shrink-0 justify-center bg-card/80 py-5 lg:sticky lg:top-0 lg:flex xl:w-80" />
        <div className="flex h-full flex-1 flex-col">
          <div className="flex items-center border bg-card px-4 py-4">
            <ShareDocumentButton />
          </div>
          <MarkdownEditor
            className="min-h-0 flex-1"
            content={selectedPage.content}
            onContentChange={(content) => updatePageContent(selectedPageIndex, content)}
          />
        </div>
      </div>
    </div>
  );
}
