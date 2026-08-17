import { useNavigate } from "@tanstack/react-router";

import { useState } from "react";

import { LogOut, MoreHorizontalIcon, Trash } from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDocumentEditor } from "@/features/document/hooks/useDocumentEditor";
import type { Document } from "@/features/document/types/api";

import { UpdateDocumentButton } from "./update-document-trigger";

interface EditorActionsProps {
  document: Document;
  editKey: string;
  className?: string;
}

function EditorActions({ document, editKey, className }: EditorActionsProps) {
  const { clearDraft } = useDocumentEditor();
  const [isStartOverOpen, setIsStartOverOpen] = useState(false);

  const navigate = useNavigate();
  return (
    <>
      <div className={className}>
        <ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline">
                  <MoreHorizontalIcon />
                </Button>
              }
            />
            <DropdownMenuContent className="w-40">
              <DropdownMenuGroup>
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
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={() => setIsStartOverOpen(true)}>
                  <Trash />
                  Start Over
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <UpdateDocumentButton document={document} editKey={editKey} />
        </ButtonGroup>
      </div>
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
    </>
  );
}

export { EditorActions };
