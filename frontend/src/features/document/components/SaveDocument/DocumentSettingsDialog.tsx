import { useState } from "react";

import { Settings } from "lucide-react";

import { ProblemDetailsError } from "@/components/feedback/error/ProblemDetailsError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useUpdateDocumentExpiration, useUpdateDocumentPassword } from "@/features/document/api";
import type { Document } from "@/features/document/types/api";

interface DocumentSettingsDialogProps {
  document: Document;
  editKey: string;
}

function toDateTimeLocalValue(isoDate: string | null): string {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function DocumentSettingsDialog({ document, editKey }: DocumentSettingsDialogProps) {
  const documentId = document.id;
  const updateExpiration = useUpdateDocumentExpiration();
  const updatePassword = useUpdateDocumentPassword();

  const [expireAt, setExpireAt] = useState(() => toDateTimeLocalValue(document.expireAt));
  const [password, setPassword] = useState("");

  const error = updateExpiration.error ?? updatePassword.error;
  const isPending = updateExpiration.isPending || updatePassword.isPending;
  const isSuccess = updateExpiration.isSuccess || updatePassword.isSuccess;

  function saveExpiration() {
    updateExpiration.mutate({
      request: { expireAt: expireAt ? new Date(expireAt).toISOString() : null },
      documentId,
      editKey,
    });
  }

  function savePassword() {
    updatePassword.mutate({
      request: { password: password.trim() ? password.trim() : null },
      documentId,
      editKey,
    });
  }
  // TODO: there are bugs, improve the feedbacks, add delete button...
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline" size="icon" aria-label="Document settings" />}
      >
        <Settings />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Document settings</DialogTitle>
          <DialogDescription>Update expiration date or password protection.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="document-expire-at" className="text-sm font-medium">
              Expires at
            </label>
            <div className="flex gap-2">
              <Input
                id="document-expire-at"
                type="datetime-local"
                value={expireAt}
                onChange={(event) => setExpireAt(event.target.value)}
              />
              <Button variant="outline" disabled={isPending} onClick={saveExpiration}>
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty to remove the expiration date.
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="document-password" className="text-sm font-medium">
              Password
            </label>
            <div className="flex gap-2">
              <Input
                id="document-password"
                type="password"
                placeholder={document ? "New password" : "Password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button variant="outline" disabled={isPending} onClick={savePassword}>
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty to remove password protection.
            </p>
          </div>
          {error ? (
            <ProblemDetailsError error={error} fallbackMessage="Failed to update settings." />
          ) : null}
          {isSuccess && !error ? (
            <p className="text-sm text-muted-foreground">Settings updated.</p>
          ) : null}
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

export { DocumentSettingsDialog };
