import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiClient } from "@lib/axios";

import type { Document } from "@api/contracts";

function getDocumentFn(documentSlug: string) {
  return apiClient
    .get<Document>(`api/documents/${documentSlug}`)
    .then((res) => res.data);
}

function getDocumentQueryOptions(documentSlug: string) {
  return queryOptions({
    queryKey: ["document", documentSlug],
    queryFn: () => getDocumentFn(documentSlug),
  });
}

function useGetDocument(documentSlug: string) {
  return useQuery(getDocumentQueryOptions(documentSlug));
}

export { getDocumentFn, getDocumentQueryOptions, useGetDocument };
