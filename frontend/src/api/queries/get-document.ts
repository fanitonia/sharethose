import { queryOptions, useQuery } from "@tanstack/react-query";

import type { Document } from "@/api/contracts";
import { apiClient } from "@/lib/axios";

function fetchDocument(documentSlug: string) {
  return apiClient
    .get<Document>(`api/documents/${documentSlug}`)
    .then((res) => res.data);
}

const documentKeys = {
  document: (documentSlug: string) => ["document", documentSlug] as const,
};

function documentQueryOptions(documentSlug: string) {
  return queryOptions({
    queryKey: documentKeys.document(documentSlug),
    queryFn: () => fetchDocument(documentSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

function useGetDocument(documentSlug: string) {
  return useQuery(documentQueryOptions(documentSlug));
}

export { fetchDocument, documentQueryOptions, useGetDocument };
