import { useNavigate } from "@tanstack/react-router";

import { useValidateEditKey } from "@/features/document/api";
import type { Document } from "@/features/document/types/api";
import { setEditKey } from "@/features/document/utils/editKeyStorage";

function useEditKeyValidation(document: Document) {
  const navigate = useNavigate();
  const validateEditKey = useValidateEditKey(document.id);

  function validate(editKey: string) {
    validateEditKey.mutate(editKey, {
      onSuccess: () => {
        setEditKey(document.slug, editKey);
        navigate({
          to: "/doc/$documentSlug/edit",
          params: { documentSlug: document.slug },
        });
      },
    });
  }

  function reset() {
    validateEditKey.reset();
  }

  return {
    validate,
    error: validateEditKey.error,
    isPending: validateEditKey.isPending,
    reset,
  };
}

export { useEditKeyValidation };
