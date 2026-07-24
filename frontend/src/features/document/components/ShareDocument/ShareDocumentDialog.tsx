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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import type { ShareDialogState } from "@/features/document/hooks/useShareDocument";
import type { DocumentWithKey } from "@/features/document/types/api";
import type { ValidationErrorGroup } from "@/features/document/utils/getValidationErrorGroups";

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
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fix validation errors</DialogTitle>
            <DialogDescription>Resolve these issues before sharing.</DialogDescription>
          </DialogHeader>
          <AlertContainer>
            <ScrollArea>
              <div className="max-h-96 space-y-3">
                {validationErrors.map((group) => (
                  <div key={group.key} className="flex flex-col gap-1.5">
                    <p className="flex items-center gap-1.5 font-medium">
                      <group.icon className="size-3.5" />
                      {group.title}
                    </p>
                    <ul className="list-disc pl-8 text-foreground">
                      {group.errors.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AlertContainer>
        </DialogContent>
      </Dialog>
    );
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
