import { useState } from "react";

import { DraftRecoveryDialog } from "@/features/document/components";
import { MAX_PAGE_COUNT } from "@/features/document/constants";
import { DocumentEditorContext } from "@/features/document/context/editor-context";
import { useDocumentDraft } from "@/features/document/hooks/useDocumentDraft";
import type { DocumentDraft } from "@/features/document/types/draft";

interface DocumentEditorProviderProps {
  children: React.ReactNode;
  initialDraft?: DocumentDraft;
  documentId?: string;
}

function DocumentEditorProvider({
  children,
  initialDraft,
  documentId,
}: DocumentEditorProviderProps) {
  const { draft, ...actions } = useDocumentDraft({ documentId, initialDraft });
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  function clearDraft() {
    actions.clearDraft();
    setSelectedPageIndex(0);
  }

  function addPage() {
    if (draft.pages.length >= MAX_PAGE_COUNT) {
      return;
    }

    actions.addPage();
    setSelectedPageIndex(draft.pages.length);
  }

  function deletePage(index: number) {
    if (draft.pages.length === 1 || !draft.pages[index]) {
      return;
    }

    actions.deletePage(index);
    setSelectedPageIndex((currentIndex) =>
      index < currentIndex ? currentIndex - 1 : Math.min(currentIndex, draft.pages.length - 2)
    );
  }

  function selectPage(index: number) {
    if (draft.pages[index]) {
      setSelectedPageIndex(index);
    }
  }

  return (
    <>
      <DocumentEditorContext.Provider
        value={{
          draft,
          ...actions,
          clearDraft,
          addPage,
          deletePage,
          selectedPageIndex,
          selectPage,
        }}
      >
        {children}
      </DocumentEditorContext.Provider>
      <DraftRecoveryDialog
        open={actions.hasPendingDraft}
        onDiscard={actions.discardDraft}
        onRestore={actions.restoreDraft}
      />
    </>
  );
}

export { DocumentEditorProvider };
