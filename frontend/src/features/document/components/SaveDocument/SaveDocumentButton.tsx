import { ProblemDetailsError } from "@/components/feedback/error/ProblemDetailsError";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useDocumentEditor } from "@/features/document/context/DocumentEditorContext";
import { useSaveDocument } from "@/features/document/hooks/useSaveDocument";
import type { Document } from "@/features/document/types/api";

import { ValidationErrorsDialog } from "../ShareDocument/ValidationErrorsDialog";

interface SaveDocumentButtonProps {
  className?: string;
  document: Document;
  editKey: string;
}

function SaveDocumentButton({ className, document, editKey }: SaveDocumentButtonProps) {
  const { draft, clearDraft } = useDocumentEditor();
  const { save, dialogState, error, validationErrors, isPending, reset } = useSaveDocument(
    draft,
    document,
    { editKey, onSuccess: clearDraft }
  );

  return (
    <>
      <Button className={className} disabled={isPending} onClick={save}>
        {isPending ? "Saving..." : "Save"}
      </Button>
      {dialogState === "validation" && (
        <ValidationErrorsDialog validationErrors={validationErrors} onClose={reset} />
      )}
      {dialogState === "error" && (
        <Dialog open onOpenChange={(open) => !open && reset()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Failed to save document</DialogTitle>
            </DialogHeader>
            <ProblemDetailsError error={error} fallbackMessage="Please try again." />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export { SaveDocumentButton };
