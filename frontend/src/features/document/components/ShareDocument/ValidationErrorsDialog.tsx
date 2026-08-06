import { AlertContainer } from "@/components/containers/AlertContainer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { ValidationErrorGroup } from "@/features/document/utils/getValidationErrorGroups";

interface ValidationErrorsDialogProps {
  validationErrors: ValidationErrorGroup[];
  onClose: () => void;
}

function ValidationErrorsDialog({ validationErrors, onClose }: ValidationErrorsDialogProps) {
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

export { ValidationErrorsDialog };
