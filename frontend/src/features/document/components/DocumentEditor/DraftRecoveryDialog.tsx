import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DraftRecoveryDialogProps {
  open: boolean;
  onRestore: () => void;
  onDiscard: () => void;
}

function DraftRecoveryDialog({ open, onRestore, onDiscard }: DraftRecoveryDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Load saved draft?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes from a previous session. Load them or delete them and start
            over.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="destructive" onClick={onDiscard}>
            Delete draft and start over
          </AlertDialogAction>
          <AlertDialogAction onClick={onRestore}>Load draft</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DraftRecoveryDialog };
