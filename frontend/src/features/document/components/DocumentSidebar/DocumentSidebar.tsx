import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import { useState } from "react";

import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import type { Document } from "@/features/document/types/api";

interface DocumentSidebarProps {
  document: Document;
  onPageSelect?: () => void;
  className?: string;
}

function DocumentSidebar({ document, onPageSelect, className }: DocumentSidebarProps) {
  return (
    <nav className={className}>
      <div className="flex h-full min-h-0 w-full flex-col gap-6">
        <div className="border-b border-border pb-4">
          <h1 className="px-4 text-center text-2xl font-semibold text-wrap text-foreground">
            {document.title}
          </h1>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <ul className="flex w-full flex-col">
            {document.pages.map((page) => (
              <li key={page.id} className="flex w-full">
                <Link
                  to="/doc/$documentSlug/page/$pageSlug"
                  params={{
                    documentSlug: document.slug,
                    pageSlug: page.slug,
                  }}
                  activeProps={{
                    className: "bg-muted text-foreground",
                  }}
                  className={buttonVariants({
                    variant: "ghost",
                    className: cn("w-full justify-center rounded-none px-0 text-center"),
                  })}
                  onClick={onPageSelect}
                >
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </nav>
  );
}

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

export { DocumentSidebar, DocumentSidebarMobile };
