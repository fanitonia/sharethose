import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export { DocumentSidebar };
