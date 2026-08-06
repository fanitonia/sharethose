import { CopyLinkInput } from "@/components/actions/CopyLinkInput";
import { AlertContainer } from "@/components/containers/AlertContainer";
import { ProblemDetailsError } from "@/components/feedback/error/ProblemDetailsError";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { ShareDialogState } from "@/features/document/hooks/useShareDocument";
import type { DocumentWithKey } from "@/features/document/types/api";
import type { ValidationErrorGroup } from "@/features/document/utils/getValidationErrorGroups";

import { ValidationErrorsDialog } from "./ValidationErrorsDialog";

interface ShareDocumentDialogProps {
  state: ShareDialogState;
  sharedDocument: DocumentWithKey | null;
  error: unknown;
  validationErrors: ValidationErrorGroup[];
  onClose: () => void;
}

function getDocumentUrl(sharedDocument: DocumentWithKey): string {
  return `${window.location.origin}/doc/${sharedDocument.document.slug}`;
}

function ShareDocumentDialog({
  state,
  sharedDocument,
  error,
  validationErrors,
  onClose,
}: ShareDocumentDialogProps) {
  if (state === "idle") {
    return null;
  }

  if (state === "validation") {
    return <ValidationErrorsDialog validationErrors={validationErrors} onClose={onClose} />;
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      {sharedDocument ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document shared</DialogTitle>
            <DialogDescription>Anyone with this link can view the document.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <CopyLinkInput value={getDocumentUrl(sharedDocument)} />
            <AlertContainer>
              <p>
                Keep this edit key safe. It is required to edit your document and cannot be
                recovered.
              </p>
              <CopyLinkInput className="text-foreground" value={sharedDocument.editKey} hideValue />
            </AlertContainer>
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
  );
}

export { ShareDocumentDialog };
