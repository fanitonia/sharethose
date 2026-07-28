import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/axios";

import type { Document, UpdateDocumentContentRequest } from "@/features/document/types/api";

import { documentKeys } from "../queries/getDocument";

function updateDocumentContent(
  request: UpdateDocumentContentRequest,
  documentId: string,
  editKey: string
) {
  return apiClient
    .put<Document>(`/api/documents/${documentId}`, request, {
      headers: { "X-Document-Key": editKey },
    })
    .then((res) => res.data);
}

function useUpdateDocumentContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      documentId,
      editKey,
    }: {
      request: UpdateDocumentContentRequest;
      documentId: string;
      editKey: string;
    }) => updateDocumentContent(request, documentId, editKey),
    onSuccess: (data) => {
      queryClient.setQueryData(documentKeys.document(data.slug), data);
    },
  });
}

export { useUpdateDocumentContent };
