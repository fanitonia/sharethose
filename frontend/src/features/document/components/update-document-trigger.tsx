import { ProblemDetails } from "@/components/feedback/error/problem-details";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDocumentEditor } from "@/features/document/hooks/useDocumentEditor";
import { useUpdateDocument } from "@/features/document/hooks/useUpdateDocument";
import type { Document } from "@/features/document/types/api";

import { ValidationErrors } from "../../../components/feedback/error/validation-errors";

interface UpdateDocumentButtonProps {
  className?: string;
  document: Document;
  editKey: string;
}

function UpdateDocumentButton({ className, document, editKey }: UpdateDocumentButtonProps) {
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
        <Dialog open onOpenChange={(open) => !open && reset()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fix validation errors</DialogTitle>
              <DialogDescription>Resolve these issues before updating.</DialogDescription>
            </DialogHeader>
            <ValidationErrors validationErrors={validationErrors} />
          </DialogContent>
        </Dialog>
      )}
      {dialogState === "error" && (
        <Dialog open onOpenChange={(open) => !open && reset()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Failed to update document</DialogTitle>
            </DialogHeader>
            <ProblemDetails error={error} fallbackMessage="Please try again." />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export { UpdateDocumentButton };
