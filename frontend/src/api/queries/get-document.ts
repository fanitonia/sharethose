import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiClient } from "@lib/axios";

import type { Document } from "@api/contracts";

function getDocumentFn(documentId: string) {
  return apiClient
    .get<Document>(`api/documents/${documentId}`)
    .then((res) => res.data);
}

function getDocumentQueryOptions(documentId: string) {
  return queryOptions({
    queryKey: ["document", documentId],
    queryFn: () => getDocumentFn(documentId),
  });
}

function useGetDocument(documentId: string) {
  return useQuery(getDocumentQueryOptions(documentId));
}

export { getDocumentFn, getDocumentQueryOptions, useGetDocument };
