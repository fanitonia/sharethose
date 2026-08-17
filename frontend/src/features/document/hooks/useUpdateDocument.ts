import { useNavigate, useRouter } from "@tanstack/react-router";

import { useMemo, useState } from "react";

import { useUpdateDocumentContent } from "@/features/document/api";
import type { Document } from "@/features/document/types/api";
import type { DocumentDraft } from "@/features/document/types/draft";
import { convertToUpdateDocumentRequest } from "@/features/document/types/draft";
import { validateDraft } from "@/features/document/types/validation";

type SaveDialogState = "idle" | "validation" | "error";

interface UseUpdateDocumentOptions {
  editKey: string;
  onSuccess?: () => void;
}

function useUpdateDocument(
  draft: DocumentDraft,
  document: Document,
  options: UseUpdateDocumentOptions
) {
  const navigate = useNavigate();
  const router = useRouter();
  const updateDocument = useUpdateDocumentContent();
  const [dialogState, setDialogState] = useState<SaveDialogState>("idle");
  const [error, setError] = useState<unknown>(null);

  const validationErrors = useMemo(() => validateDraft(draft).errors, [draft]);

  function save() {
    if (!validateDraft(draft).success) {
      setDialogState("validation");
      return;
    }

    setError(null);
    updateDocument.mutate(
      {
        request: convertToUpdateDocumentRequest(draft, document),
        documentId: document.id,
        editKey: options.editKey,
      },
      {
        onSuccess: async (data) => {
          options.onSuccess?.();
          setDialogState("idle");
          await router.invalidate();
          navigate({
            to: "/doc/$documentSlug/page",
            params: { documentSlug: data.slug },
          });
        },
        onError: (mutationError) => {
          setError(mutationError);
          setDialogState("error");
        },
      }
    );
  }

  function reset() {
    setDialogState("idle");
    setError(null);
  }

  return {
    save,
    dialogState,
    error,
    validationErrors,
    isPending: updateDocument.isPending,
    reset,
  };
}

export { useUpdateDocument };
export type { SaveDialogState };
