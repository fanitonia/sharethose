import type { Document } from "@api/contracts";

import { Button } from "../ui/button";

function Sidebar({
  document,
  className,
}: {
  document: Document;
  className?: string;
}) {
  return (
    <aside className={className}>
      <div className="flex h-full w-full flex-col gap-6 overflow-y-auto">
        <div className="border-b border-border pb-4">
          <h1 className="text-center text-2xl font-semibold text-foreground">
            {document.title}
          </h1>
        </div>
        <ul className="flex w-full flex-col">
          {document.pages.map((page) => (
            <li key={page.id} className="flex w-full">
              <Button
                variant={"ghost"}
                className="h-11 w-full justify-center rounded-none px-0 text-center"
              >
                {page.pageName}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
