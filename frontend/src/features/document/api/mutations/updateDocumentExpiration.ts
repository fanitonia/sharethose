import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/axios";

import type { Document, UpdateDocumentExpireDateRequest } from "@/features/document/types/api";

import { documentKeys } from "../queries/getDocument";

function updateDocumentExpiration(
  request: UpdateDocumentExpireDateRequest,
  documentId: string,
  editKey: string
) {
  return apiClient
    .patch<Document>(`/api/documents/${documentId}/expire`, request, {
      headers: { "X-Document-Key": editKey },
    })
    .then((res) => res.data);
}

function useUpdateDocumentExpiration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      documentId,
      editKey,
    }: {
      request: UpdateDocumentExpireDateRequest;
      documentId: string;
      editKey: string;
    }) => updateDocumentExpiration(request, documentId, editKey),
    onSuccess: (data) => {
      queryClient.setQueryData(documentKeys.document(data.slug), data);
    },
  });
}

export { useUpdateDocumentExpiration };
