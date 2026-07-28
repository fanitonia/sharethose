import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/axios";

function validateEditKey(documentId: string, editKey: string) {
  return apiClient.post(`/api/documents/${documentId}/validate-key`, null, {
    headers: {
      "X-Document-Key": editKey,
    },
  });
}

function useValidateEditKey(documentId: string) {
  return useMutation({
    mutationFn: (editKey: string) => validateEditKey(documentId, editKey),
  });
}

export { useValidateEditKey };
