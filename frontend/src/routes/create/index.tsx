import { createFileRoute } from "@tanstack/react-router";

import { useState } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { ProblemDetailsError } from "@/components/feedback/errors/ProblemDetailsError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DocumentSidebarEditable,
  DocumentSidebarEditableMobile,
} from "@/features/document/components/DocumentSidebar";
import { MarkdownEditor } from "@/features/document/components/MarkdownEditor";
import {
  DocumentEditorProvider,
  useDocumentEditor,
} from "@/features/document/context/DocumentEditorContext";
import { useShareDocument } from "@/features/document/hooks/useShareDocument";
import { convertToCreateDocumentRequest } from "@/features/document/types/draft";

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
  const { draft, clearDraft, updatePageContent } = useDocumentEditor();
  const { share, sharedDocument, error, isPending, reset } = useShareDocument(clearDraft);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const selectedPage = draft.pages[draft.selectedPageIndex];

  function shareDocument() {
    share(convertToCreateDocumentRequest(draft));
  }

  async function copyDocumentUrl() {
    if (!sharedDocument) {
      return;
    }

    const documentUrl = `${window.location.origin}/doc/${sharedDocument.document.slug}`;
    try {
      await navigator.clipboard.writeText(documentUrl);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  const documentUrl = sharedDocument
    ? `${window.location.origin}/doc/${sharedDocument.document.slug}`
    : "";

  return (
    <div className="h-screen bg-background">
      <div className="flex w-full items-center bg-card px-4 py-4 lg:hidden">
        <DocumentSidebarEditableMobile />
        <h1 className="flex-1 text-center text-lg font-semibold text-foreground">{draft.title}</h1>
      </div>
      <div className="flex h-full flex-row lg:h-screen">
        <DocumentSidebarEditable className="hidden h-screen w-72 shrink-0 justify-center bg-card/80 py-5 lg:sticky lg:top-0 lg:flex xl:w-80" />
        <div className="flex h-full flex-1 flex-col">
          <div className="flex items-center border bg-card px-4 py-4">
            <Button className="ml-auto" disabled={isPending} onClick={shareDocument}>
              {isPending ? "Sharing..." : "Share"}
            </Button>
          </div>
          <MarkdownEditor
            className="min-h-0 flex-1"
            content={selectedPage.content}
            onContentChange={(content) => updatePageContent(draft.selectedPageIndex, content)}
          />
        </div>
      </div>
      {/* TODO: make this a component */}
      <Dialog
        open={sharedDocument !== null || error !== null}
        onOpenChange={(open) => {
          if (!open) {
            reset();
            setCopyStatus("idle");
          }
        }}
      >
        <DialogContent>
          {sharedDocument ? (
            <>
              <DialogHeader>
                <DialogTitle>Document shared</DialogTitle>
                <DialogDescription>Anyone with this link can view the document.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    aria-label="Document link"
                    className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm"
                    onFocus={(event) => event.currentTarget.select()}
                    readOnly
                    value={documentUrl}
                  />
                  <Button
                    aria-label="Copy document link"
                    onClick={copyDocumentUrl}
                    size="icon"
                    type="button"
                    variant="outline"
                  >
                    {/* TODO: we can use a toast notification, also make this copy button a reusable component */}
                    {copyStatus === "copied" ? <CheckIcon /> : <CopyIcon />}
                  </Button>
                </div>
                <p aria-live="polite" className="text-sm text-muted-foreground">
                  {copyStatus === "copied"
                    ? "Document link copied."
                    : copyStatus === "failed"
                      ? "Unable to copy the document link."
                      : null}
                </p>
                {/* TODO: add copy edit key button */}
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  Keep this edit key safe. It is required to edit your document and cannot be
                  recovered.
                  <div className="mt-2 font-mono break-all text-foreground">
                    {sharedDocument.editKey}
                  </div>
                </div>
              </div>
              <DialogFooter showCloseButton />
            </>
          ) : (
            // TODO: make this a generic error component
            <>
              <DialogHeader>
                <DialogTitle>Failed to share document</DialogTitle>
              </DialogHeader>
              <ProblemDetailsError error={error} fallbackMessage="Please try again." />
              <DialogFooter showCloseButton />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
