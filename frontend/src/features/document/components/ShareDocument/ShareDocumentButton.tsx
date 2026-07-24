import { Button } from "@/components/ui/button";

import { useDocumentEditor } from "@/features/document/context/DocumentEditorContext";
import { useShareDocument } from "@/features/document/hooks/useShareDocument";

import { ShareDocumentDialog } from "./ShareDocumentDialog";

function ShareDocumentButton() {
  const { draft, clearDraft } = useDocumentEditor();
  const { share, dialogState, sharedDocument, error, validationErrors, isPending, reset } =
    useShareDocument(draft, { onSuccess: clearDraft });

  return (
    <>
      <Button className="ml-auto" disabled={isPending} onClick={share}>
        {isPending ? "Sharing..." : "Share"}
      </Button>
      <ShareDocumentDialog
        state={dialogState}
        sharedDocument={sharedDocument}
        error={error}
        validationErrors={validationErrors}
        onClose={reset}
      />
    </>
  );
}

export { ShareDocumentButton };
