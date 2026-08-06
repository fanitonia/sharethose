import { useState } from "react";

import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import type { Document } from "@/features/document/types/api";

import { DocumentSidebar } from "./DocumentSidebar";

interface DocumentSidebarMobileProps {
  document: Document;
  className?: string;
}

function DocumentSidebarMobile({ document, className }: DocumentSidebarMobileProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open navigation" />}>
          <MenuIcon className="size-8" />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle className="sr-only">{document.title}</SheetTitle>
          <DocumentSidebar
            document={document}
            onPageSelect={() => setOpen(false)}
            className="h-full w-full py-5"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export { DocumentSidebarMobile };
