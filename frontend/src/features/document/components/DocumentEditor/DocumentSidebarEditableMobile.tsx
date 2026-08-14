import { useState } from "react";

import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { useDocumentEditor } from "@/features/document/context/DocumentEditorContext";

import { DocumentSidebarEditable } from "./DocumentSidebarEditable";

interface DocumentSidebarEditableMobileProps {
  className?: string;
}

function DocumentSidebarEditableMobile({ className }: DocumentSidebarEditableMobileProps) {
  const [open, setOpen] = useState(false);
  const { draft } = useDocumentEditor();

  return (
    <div className={className}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open navigation" />}>
          <MenuIcon className="size-8" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SheetTitle className="sr-only">{draft.title}</SheetTitle>
          <DocumentSidebarEditable
            onPageSelect={() => setOpen(false)}
            className="h-full w-full bg-card/80 py-5"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export { DocumentSidebarEditableMobile };
