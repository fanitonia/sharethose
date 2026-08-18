import { useState } from "react";

import { Ellipsis, MenuIcon, Pencil, Plus, Trash2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { MAX_PAGE_COUNT } from "@/features/document/constants";
import { useDocumentEditor } from "@/features/document/hooks/useDocumentEditor";
import { useInlineEdit } from "@/features/document/hooks/useInlineEdit";
import { PAGE_NAME_MAX_LENGTH, TITLE_MAX_LENGTH } from "@/features/document/types/validation";

interface DocumentEditorSidebarProps {
  className?: string;
  onPageSelect?: () => void;
}

function DocumentEditorSidebar({ className, onPageSelect }: DocumentEditorSidebarProps) {
  const { draft, setTitle, addPage, selectedPageIndex, selectPage, deletePage, renamePage } =
    useDocumentEditor();
  const titleEdit = useInlineEdit(setTitle);
  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null);
  const pageEdit = useInlineEdit((name) => {
    if (editingPageIndex !== null) {
      renamePage(editingPageIndex, name);
    }
    setEditingPageIndex(null);
  });

  function startRenaming(index: number) {
    setEditingPageIndex(index);
    pageEdit.start(draft.pages[index].name || "");
  }

  return (
    <nav className={className}>
      <div className="flex h-full min-h-0 w-full flex-col gap-6">
        {/* Title section */}
        <div className="group relative border-b border-border pb-4">
          {titleEdit.editing ? (
            <Input
              variant="inline"
              autoFocus
              aria-label="Rename document"
              className="px-10 text-center text-2xl font-semibold text-foreground"
              value={titleEdit.value}
              maxLength={TITLE_MAX_LENGTH}
              onChange={(event) => titleEdit.setValue(event.target.value)}
              onBlur={titleEdit.commit}
              onKeyDown={(event) => {
                if (event.key === "Enter") titleEdit.commit();
                if (event.key === "Escape") titleEdit.cancel();
              }}
            />
          ) : (
            <div className="flex justify-center">
              <div className="relative flex-1">
                <h1
                  className={cn(
                    "px-6 text-center text-2xl font-semibold wrap-break-word text-foreground",
                    !draft.title && "text-destructive"
                  )}
                >
                  {draft.title || "Please enter a title"}
                </h1>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-1/2 right-[4%] -translate-y-1/2 lg:opacity-0 lg:transition-opacity lg:group-focus-within:opacity-100 lg:group-hover:opacity-100"
                        aria-label="Rename document"
                        onClick={() => titleEdit.start(draft.title)}
                      />
                    }
                  >
                    <Pencil />
                  </TooltipTrigger>
                  <TooltipContent>Click to rename</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
        {/* Pages header section */}
        <div className="flex items-center justify-between border-y border-border px-6 py-1">
          <div className="flex h-full items-center gap-3">
            <p className="font-semibold">Pages</p>
            <p className="text-sm text-muted-foreground">
              {draft.pages.length} / {MAX_PAGE_COUNT}
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Add page"
                  onClick={addPage}
                  disabled={draft.pages.length >= MAX_PAGE_COUNT}
                >
                  <Plus />
                </Button>
              }
            />
            <TooltipContent>
              <p>{draft.pages.length >= MAX_PAGE_COUNT ? "Page limit reached" : "Add page"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {/* Pages list section */}
        <ScrollArea className="min-h-0 flex-1">
          <ul className="flex w-full flex-col">
            {draft.pages.map((page, index) => (
              <li
                key={page.id}
                className={cn(
                  "group relative flex w-full flex-col hover:bg-secondary",
                  index === selectedPageIndex && "bg-secondary"
                )}
              >
                <div className="relative flex w-full items-center">
                  {editingPageIndex === index ? (
                    <Input
                      variant="inline"
                      autoFocus
                      aria-label={`Rename page ${index + 1}`}
                      className="flex-1 px-3 py-2 text-center text-sm"
                      value={pageEdit.value}
                      maxLength={PAGE_NAME_MAX_LENGTH}
                      onChange={(event) => pageEdit.setValue(event.target.value)}
                      onBlur={pageEdit.commit}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") pageEdit.commit();
                        if (event.key === "Escape") pageEdit.cancel();
                      }}
                    />
                  ) : (
                    <Button
                      variant="ghost"
                      className={cn(
                        "min-w-0 flex-1 justify-center rounded-none px-0 text-center",
                        !page.name && "text-destructive"
                      )}
                      onClick={() => {
                        selectPage(index);
                        onPageSelect?.();
                      }}
                    >
                      {page.name || "Please enter a page name"}
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 text-white opacity-100 transition-opacity group-hover:text-muted-foreground group-hover:opacity-100 hover:bg-transparent focus-visible:opacity-100 lg:opacity-0"
                        />
                      }
                    >
                      <Ellipsis className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => startRenaming(index)}>
                        <Pencil className="mr-1" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => deletePage(index)}>
                        <Trash2Icon className="mr-1" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </nav>
  );
}

interface DocumentSidebarEditableMobileProps {
  className?: string;
}

function DocumentEditorMobileSidebar({ className }: DocumentSidebarEditableMobileProps) {
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
          <DocumentEditorSidebar
            onPageSelect={() => setOpen(false)}
            className="h-full w-full bg-card/80 py-5"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export { DocumentEditorSidebar, DocumentEditorMobileSidebar };
