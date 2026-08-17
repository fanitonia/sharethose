import { useState } from "react";

import { ProblemDetails } from "@/components/feedback/error/problem-details";
import { Button } from "@/components/ui/button";
import { DatePickerWithTime } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useUpdateDocumentExpiration, useUpdateDocumentPassword } from "@/features/document/api";
import type { Document } from "@/features/document/types/api";

interface DocumentSettingsDialogProps {
  document: Document;
  editKey: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DocumentSettingsDialog({
  document,
  editKey,
  open,
  onOpenChange,
}: DocumentSettingsDialogProps) {
  const documentId = document.id;
  const updateExpiration = useUpdateDocumentExpiration();
  const updatePassword = useUpdateDocumentPassword();

  const [expireAt, setExpireAt] = useState<Date | undefined>(() =>
    document.expireAt ? new Date(document.expireAt) : undefined
  );
  const [password, setPassword] = useState("");

  const error = updateExpiration.error ?? updatePassword.error;
  const isPending = updateExpiration.isPending || updatePassword.isPending;
  const isSuccess = updateExpiration.isSuccess || updatePassword.isSuccess;

  function saveExpiration() {
    updateExpiration.mutate({
      request: { expireAt: expireAt?.toISOString() ?? null },
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
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
                <DatePickerWithTime
                  disablePastDates
                  disabled={isPending}
                  id="document-expire-at"
                  onChange={setExpireAt}
                  value={expireAt}
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
                  placeholder="New password"
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
              <ProblemDetails error={error} fallbackMessage="Failed to update settings." />
            ) : null}
            {isSuccess && !error ? (
              <p className="text-sm text-muted-foreground">Settings updated.</p>
            ) : null}
          </div>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  );
}

export { DocumentSettingsDialog };
