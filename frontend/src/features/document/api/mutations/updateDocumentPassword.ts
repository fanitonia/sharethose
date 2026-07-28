import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/axios";

import type { Document, UpdateDocumentPasswordRequest } from "@/features/document/types/api";

import { documentKeys } from "../queries/getDocument";

function updateDocumentPassword(
  request: UpdateDocumentPasswordRequest,
  documentId: string,
  editKey: string
) {
  return apiClient
    .patch<Document>(`/api/documents/${documentId}/password`, request, {
      headers: { "X-Document-Key": editKey },
    })
    .then((res) => res.data);
}

function useUpdateDocumentPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      documentId,
      editKey,
    }: {
      request: UpdateDocumentPasswordRequest;
      documentId: string;
      editKey: string;
    }) => updateDocumentPassword(request, documentId, editKey),
    onSuccess: (data) => {
      queryClient.setQueryData(documentKeys.document(data.slug), data);
    },
  });
}

export { useUpdateDocumentPassword };
