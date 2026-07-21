import { CopyLinkInput } from "@/components/actions/CopyLinkInput";
import { ProblemDetailsError } from "@/components/feedback/error/ProblemDetailsError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

import { useShareDocument } from "@/features/document/hooks/useShareDocument";
import type { CreateDocumentRequest } from "@/features/document/types/api";

interface ShareDocumentButtonProps {
  document: CreateDocumentRequest;
  onShared?: () => void;
}

function ShareDocumentButton({ document, onShared }: ShareDocumentButtonProps) {
  const { share, sharedDocument, error, isPending, reset } = useShareDocument(onShared);
  const [canDialogOpen, setCanDialogOpen] = useState(false);

  function onShareDocument() {
    share(document);
    setCanDialogOpen(true);
  }

  function shouldDisplayDialog() {
    return canDialogOpen && (sharedDocument !== null || error !== null);
  }

  const documentUrl = sharedDocument
    ? `${window.location.origin}/doc/${sharedDocument.document.slug}`
    : "";

  return (
    <>
      <Button className="ml-auto" disabled={isPending} onClick={onShareDocument}>
        {isPending ? "Sharing..." : "Share"}
      </Button>
      <Dialog
        open={shouldDisplayDialog()}
        onOpenChange={(open) => {
          if (!open) setCanDialogOpen(false);
        }}
        onOpenChangeComplete={(open) => {
          if (!open) reset();
        }}
      >
        {sharedDocument ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Document shared</DialogTitle>
              <DialogDescription>Anyone with this link can view the document.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <CopyLinkInput value={documentUrl} />
              {/* TODO: make this a generic warning component */}
              <div className="space-y-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <p>
                  Keep this edit key safe. It is required to edit your document and cannot be
                  recovered.
                </p>
                <CopyLinkInput
                  className="text-foreground"
                  value={sharedDocument !== null ? sharedDocument.editKey : ""}
                  hideValue
                />
              </div>
            </div>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Failed to share document</DialogTitle>
            </DialogHeader>
            <ProblemDetailsError error={error} fallbackMessage="Please try again." />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

export { ShareDocumentButton };
