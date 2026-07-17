import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/axios";

import type { CreateDocumentRequest, DocumentWithKey } from "@/features/document/types/api";

import { documentKeys } from "../queries/getDocument";

function createDocument(request: CreateDocumentRequest) {
  return apiClient.post<DocumentWithKey>("/api/documents", request).then((res) => res.data);
}

function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocument,
    onSuccess: (data) => {
      queryClient.setQueryData(documentKeys.document(data.document.slug), data.document);
    },
  });
}

export { useCreateDocument };
