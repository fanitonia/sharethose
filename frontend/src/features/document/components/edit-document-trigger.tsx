import { useNavigate } from "@tanstack/react-router";

import { useState } from "react";

import { ProblemDetails } from "@/components/feedback/error/problem-details";
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

import { useValidateEditKey } from "@/features/document/api";
import type { Document } from "@/features/document/types/api";
import { clearEditKey, getEditKey, setEditKey } from "@/features/document/utils/editKeyStorage";

interface EditDocumentTriggerProps {
  document: Document;
  className?: string;
}

function EditDocumentTrigger({ document, className }: EditDocumentTriggerProps) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editKey, setEditKeyValue] = useState("");
  const validateEditKey = useValidateEditKey(document.id);

  function navigateToEditor() {
    navigate({
      to: "/doc/$documentSlug/edit",
      params: { documentSlug: document.slug },
    });
  }

  function handleClick() {
    const storedEditKey = getEditKey(document.slug);

    if (storedEditKey) {
      validateEditKey.mutate(storedEditKey, {
        onSuccess: navigateToEditor,
        onError: (error) => {
          if (error.status === 401 || error.status === 403) {
            clearEditKey(document.slug);
          }

          setDialogOpen(true);
        },
      });
      return;
    }

    setDialogOpen(true);
  }

  function handleClose() {
    setEditKeyValue("");
    validateEditKey.reset();
    setDialogOpen(false);
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEditKey = editKey.trim();

    if (!trimmedEditKey || validateEditKey.isPending) {
      return;
    }

    validateEditKey.mutate(trimmedEditKey, {
      onSuccess: () => {
        setEditKey(document.slug, trimmedEditKey);
        navigateToEditor();
      },
    });
  }

  return (
    <>
      <Button variant="secondary" className={className} onClick={handleClick}>
        Edit document
      </Button>
      <Dialog open={dialogOpen} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
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
              onChange={(event) => setEditKeyValue(event.target.value)}
            />
            {validateEditKey.error ? (
              <ProblemDetails
                error={validateEditKey.error}
                fallbackMessage="Invalid edit key. Please check the key and try again."
              />
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={validateEditKey.isPending || !editKey.trim()}>
                {validateEditKey.isPending ? "Validating..." : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { EditDocumentTrigger };
