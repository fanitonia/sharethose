import { useState } from "react";

import { useCreateDocument } from "@/features/document/api";
import type { CreateDocumentRequest, DocumentWithKey } from "@/features/document/types/api";

function useShareDocument(onSuccess?: () => void) {
  const createDocument = useCreateDocument();
  const [sharedDocument, setSharedDocument] = useState<DocumentWithKey | null>(null);
  const [error, setError] = useState<unknown>(null);

  function share(document: CreateDocumentRequest) {
    setError(null);
    createDocument.mutate(document, {
      onSuccess: (data) => {
        setSharedDocument(data);
        onSuccess?.();
      },
      onError: setError,
    });
  }

  function reset() {
    setSharedDocument(null);
    setError(null);
  }

  return {
    share,
    sharedDocument,
    error,
    isPending: createDocument.isPending,
    reset,
  };
}

export { useShareDocument };
