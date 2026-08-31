import { useNavigate } from "@tanstack/react-router";

import { useState } from "react";

import { LogOut, MoreHorizontalIcon, Settings, Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDocumentEditor } from "@/features/document/hooks/useDocumentEditor";
import type { Document } from "@/features/document/types/api";

import { DocumentSettings } from "./document-settings";
import { UpdateDocumentButton } from "./update-document-trigger";

interface UpdateDocumentActionsProps {
  document: Document;
  editKey: string;
  className?: string;
}

function UpdateDocumentActions({ document, editKey, className }: UpdateDocumentActionsProps) {
  const { clearDraft } = useDocumentEditor();
  const [isStartOverOpen, setIsStartOverOpen] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  const navigate = useNavigate();
  return (
    <>
      <ButtonGroup className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline">
                <MoreHorizontalIcon />
              </Button>
            }
          />
          <DropdownMenuContent className="w-45">
            <DropdownMenuGroup>
              {/* Document Settings Button */}
              <DropdownMenuItem onClick={() => setOpenSettingsDialog(true)}>
                <Settings />
                Document Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* Save and Exit Button */}
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: "/doc/$documentSlug",
                    params: { documentSlug: document.slug },
                  })
                }
              >
                <LogOut />
                Save and Exit
              </DropdownMenuItem>
              {/* Start Over Button */}
              <DropdownMenuItem variant="destructive" onClick={() => setIsStartOverOpen(true)}>
                <Trash />
                Start Over
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpdateDocumentButton document={document} editKey={editKey} />
      </ButtonGroup>
      {/* Start Over Confirmation Dialog */}
      <AlertDialog open={isStartOverOpen} onOpenChange={setIsStartOverOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                clearDraft();
                setIsStartOverOpen(false);
              }}
            >
              Start Over
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Document Settings Dialog */}
      <Dialog open={openSettingsDialog} onOpenChange={setOpenSettingsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Settings</DialogTitle>
            <DialogDescription>Update the settings for this document.</DialogDescription>
          </DialogHeader>
          <DocumentSettings
            key={document.expireAt ?? "no-expiration"}
            document={document}
            editKey={editKey}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export { UpdateDocumentActions };
