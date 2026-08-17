import { CopyLinkInput } from "@/components/actions/copy-link";
import { ProblemDetails } from "@/components/feedback/error/problem-details";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDocumentEditor } from "@/features/document/hooks/useDocumentEditor";
import { useShareDocument } from "@/features/document/hooks/useShareDocument";
import type { DocumentWithKey } from "@/features/document/types/api";

import { ValidationErrors } from "../../../components/feedback/error/validation-errors";

// TOOD: find a better solution for this
function getDocumentUrl(sharedDocument: DocumentWithKey): string {
  return `${window.location.origin}/doc/${sharedDocument.document.slug}`;
}

function ShareDocumentButton() {
  const { draft, clearDraft } = useDocumentEditor();
  const { share, dialogState, sharedDocument, error, validationErrors, isPending, reset } =
    useShareDocument(draft, { onSuccess: clearDraft });

  return (
    <>
      <Button className="ml-auto" disabled={isPending} onClick={share}>
        {isPending ? "Sharing..." : "Share"}
      </Button>
      {dialogState === "validation" ? (
        <Dialog open onOpenChange={(open) => !open && reset()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fix validation errors</DialogTitle>
              <DialogDescription>Resolve these issues before sharing.</DialogDescription>
            </DialogHeader>
            <ValidationErrors validationErrors={validationErrors} />
          </DialogContent>
        </Dialog>
      ) : dialogState === "result" ? (
        <Dialog open onOpenChange={(open) => !open && reset()}>
          {sharedDocument ? (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Document shared</DialogTitle>
                <DialogDescription>Anyone with this link can view the document.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <CopyLinkInput value={getDocumentUrl(sharedDocument)} />
                <Container variant="destructive">
                  <p>
                    Keep this edit key safe. It is required to edit your document and cannot be
                    recovered.
                  </p>
                  <CopyLinkInput
                    className="text-foreground"
                    value={sharedDocument.editKey}
                    hideValue
                  />
                </Container>
              </div>
            </DialogContent>
          ) : (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Failed to share document</DialogTitle>
              </DialogHeader>
              <ProblemDetails error={error} fallbackMessage="Please try again." />
            </DialogContent>
          )}
        </Dialog>
      ) : null}
    </>
  );
}

export { ShareDocumentButton };
