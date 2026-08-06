import { useState } from "react";

import { ProblemDetailsError } from "@/components/feedback/error/ProblemDetailsError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useEditKeyValidation } from "@/features/document/hooks/useEditKeyValidation";
import type { Document } from "@/features/document/types/api";

interface EditKeyDialogProps {
  document: Document;
  open: boolean;
  onClose: () => void;
}

function EditKeyDialog({ document, open, onClose }: EditKeyDialogProps) {
  const [editKey, setEditKey] = useState("");
  const { validate, error, isPending, reset } = useEditKeyValidation(document);

  function handleClose() {
    setEditKey("");
    reset();
    onClose();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!editKey.trim() || isPending) {
      return;
    }

    validate(editKey.trim());
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit document</DialogTitle>
          <DialogDescription>
            Enter the edit key you received when sharing this document.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            autoFocus
            type="password"
            placeholder="Edit key"
            aria-label="Edit key"
            value={editKey}
            onChange={(event) => setEditKey(event.target.value)}
          />
          {error ? (
            <ProblemDetailsError
              error={error}
              fallbackMessage="Invalid edit key. Please check the key and try again."
            />
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !editKey.trim()}>
              {isPending ? "Validating..." : "Continue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { EditKeyDialog };
