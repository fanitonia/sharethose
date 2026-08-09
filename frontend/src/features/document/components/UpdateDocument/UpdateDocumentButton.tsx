import { ProblemDetailsError } from "@/components/feedback/error/ProblemDetailsError";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useDocumentEditor } from "@/features/document/context/DocumentEditorContext";
import { useUpdateDocument } from "@/features/document/hooks/useUpdateDocument";
import type { Document } from "@/features/document/types/api";

import { ValidationErrorsDialog } from "../ValidationErrors";

interface SaveDocumentButtonProps {
  className?: string;
  document: Document;
  editKey: string;
}

function UpdateDocumentButton({ className, document, editKey }: SaveDocumentButtonProps) {
  const { draft, clearDraft } = useDocumentEditor();
  const { save, dialogState, error, validationErrors, isPending, reset } = useUpdateDocument(
    draft,
    document,
    { editKey, onSuccess: clearDraft }
  );

  return (
    <>
      <Button variant="outline" className={className} disabled={isPending} onClick={save}>
        {isPending ? "Updating..." : "Update"}
      </Button>
      {dialogState === "validation" && (
        <ValidationErrorsDialog validationErrors={validationErrors} onClose={reset} />
      )}
      {dialogState === "error" && (
        <Dialog open onOpenChange={(open) => !open && reset()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Failed to update document</DialogTitle>
            </DialogHeader>
            <ProblemDetailsError error={error} fallbackMessage="Please try again." />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export { UpdateDocumentButton };
