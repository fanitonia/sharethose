import { Link } from "@tanstack/react-router";

import { cn } from "@lib/utils";

import type { Document } from "@api/contracts";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";

import { buttonVariants } from "../ui/button";

function Sidebar({
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
          <h1 className="text-center text-2xl font-semibold text-foreground">
            {document.title}
          </h1>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <ul className="flex w-full flex-col">
            {document.pages.map((page) => (
              <li key={page.id} className="flex w-full">
                <Link
                  to="/doc/$documentId/$pageName"
                  params={{
                    documentId: document.id.toString(),
                    pageName: page.pageName,
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
                  {page.pageName}
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </aside>
  );
}

export default Sidebar;
