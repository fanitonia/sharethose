import { getProblemDetails } from "@/utilities/getProblemDetails";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DatePickerWithTime } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

import { useUpdateDocumentExpiration, useUpdateDocumentPassword } from "@/features/document/api";
import type { Document } from "@/features/document/types/api";

interface DocumentSettingsDialogProps {
  document: Document;
  editKey: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SettingsFieldProps {
  children: React.ReactNode;
  description: string;
  disabled: boolean;
  label: string;
  onSave: () => void;
}

function SettingsField({ children, description, disabled, label, onSave }: SettingsFieldProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        {children}
        <Button variant="outline" disabled={disabled} onClick={onSave}>
          Save
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
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

  const isPending = updateExpiration.isPending || updatePassword.isPending;

  function showUpdateError(error: unknown) {
    const problemDetails = getProblemDetails(error);

    toast.add({
      type: "error",
      title: problemDetails?.title ?? "Failed to update settings.",
      description: problemDetails?.detail,
    });
  }

  function saveExpiration() {
    updateExpiration.mutate(
      {
        request: { expireAt: expireAt?.toISOString() ?? null },
        documentId,
        editKey,
      },
      {
        onSuccess: () => {
          toast.add({ type: "success", title: "Expiration updated." });
        },
        onError: showUpdateError,
      }
    );
  }

  function savePassword() {
    updatePassword.mutate(
      {
        request: { password: password.trim() ? password.trim() : null },
        documentId,
        editKey,
      },
      {
        onSuccess: () => {
          setPassword("");
          toast.add({ type: "success", title: "Password updated." });
        },
        onError: showUpdateError,
      }
    );
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      updateExpiration.reset();
      updatePassword.reset();
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Document settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <SettingsField
            label="Expires at"
            description="Clear the date to remove expiration."
            disabled={isPending}
            onSave={saveExpiration}
          >
            <DatePickerWithTime
              disablePastDates
              disabled={isPending}
              id="document-expire-at"
              onChange={setExpireAt}
              value={expireAt}
            />
          </SettingsField>
          <SettingsField
            label="Password"
            description="Leave empty to remove password protection."
            disabled={isPending}
            onSave={savePassword}
          >
            <Input
              id="document-password"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </SettingsField>
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

export { DocumentSettingsDialog };
