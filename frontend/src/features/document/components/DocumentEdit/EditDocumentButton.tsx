import { useNavigate } from "@tanstack/react-router";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { EditKeyDialog } from "@/features/document/components/DocumentEdit/EditKeyDialog";
import type { Document } from "@/features/document/types/api";
import { getEditKey } from "@/features/document/utils/editKeyStorage";

interface EditDocumentButtonProps {
  document: Document;
  className?: string;
}

function EditDocumentButton({ document, className }: EditDocumentButtonProps) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleClick() {
    if (getEditKey(document.slug)) {
      navigate({
        to: "/doc/$documentSlug/edit",
        params: { documentSlug: document.slug },
      });
      return;
    }

    setDialogOpen(true);
  }

  return (
    <>
      <Button variant="secondary" className={className} onClick={handleClick}>
        Edit document
      </Button>
      <EditKeyDialog document={document} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}

export { EditDocumentButton };
