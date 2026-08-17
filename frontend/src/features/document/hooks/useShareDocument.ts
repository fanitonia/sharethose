import { useMemo, useState } from "react";

import { useCreateDocument } from "@/features/document/api";
import type { DocumentWithKey } from "@/features/document/types/api";
import type { DocumentDraft } from "@/features/document/types/draft";
import { convertToCreateDocumentRequest } from "@/features/document/types/draft";
import { validateDraft } from "@/features/document/types/validation";

type ShareDialogState = "idle" | "validation" | "result";

interface UseShareDocumentOptions {
  onSuccess?: () => void;
}

function useShareDocument(draft: DocumentDraft, options?: UseShareDocumentOptions) {
  const createDocument = useCreateDocument();
  const [dialogState, setDialogState] = useState<ShareDialogState>("idle");
  const [sharedDocument, setSharedDocument] = useState<DocumentWithKey | null>(null);
  const [error, setError] = useState<unknown>(null);

  const validationErrors = useMemo(() => validateDraft(draft).errors, [draft]);

  function share() {
    if (!validateDraft(draft).success) {
      setDialogState("validation");
      return;
    }

    setError(null);
    createDocument.mutate(convertToCreateDocumentRequest(draft), {
      onSuccess: (data) => {
        options?.onSuccess?.();
        setSharedDocument(data);
        setDialogState("result");
      },
      onError: (mutationError) => {
        setError(mutationError);
        setDialogState("result");
      },
    });
  }

  function reset() {
    setDialogState("idle");
    setError(null);
    setSharedDocument(null);
  }

  return {
    share,
    dialogState,
    sharedDocument,
    error,
    validationErrors,
    isPending: createDocument.isPending,
    reset,
  };
}

export { useShareDocument };
export type { ShareDialogState };
