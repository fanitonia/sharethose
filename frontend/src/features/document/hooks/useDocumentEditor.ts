import { useContext } from "react";

import { DocumentEditorContext } from "@/features/document/context/editor-context";

function useDocumentEditor() {
  const context = useContext(DocumentEditorContext);

  if (!context) {
    throw new Error("useDocumentEditor must be used within a DocumentEditorProvider.");
  }

  return context;
}

export { useDocumentEditor };
