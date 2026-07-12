import { Link } from "@tanstack/react-router";

import type { Document } from "@/api/contracts";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { MenuIcon } from "lucide-react";

import { buttonVariants } from "../ui/button";

function DocumentSidebar({
  document,
  className,
}: {
  document: Document;
  className?: string;
}) {
  return (
    <aside className={className}>
      <div className="flex h-full min-h-0 w-full flex-col gap-6">
        <div className="border-b border-border pb-4">
          <h1 className="px-4 text-center text-2xl font-semibold text-foreground">
            {document.title}
          </h1>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <ul className="flex w-full flex-col">
            {document.pages.map((page) => (
              <li key={page.id} className="flex w-full">
                <Link
                  to="/doc/$documentSlug/$pageSlug"
                  params={{
                    documentSlug: document.slug,
                    pageSlug: page.slug,
                  }}
                  activeProps={{
                    className: "bg-muted text-foreground",
                  }}
                  className={buttonVariants({
                    variant: "ghost",
                    className: cn(
                      "w-full justify-center rounded-none px-0 text-center"
                    ),
                  })}
                >
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </aside>
  );
}

function DocumentSidebarMobile({
  document,
  className,
}: {
  document: Document;
  className?: string;
}) {
  return (
    <div className={className}>
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Open navigation" />
          }
        >
          <MenuIcon className="size-8" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SheetTitle className="sr-only">{document.title}</SheetTitle>
          <DocumentSidebar
            document={document}
            className="h-full w-full bg-card/80 py-5"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export { DocumentSidebar, DocumentSidebarMobile };
