import { useState } from "react";

import { Ellipsis, Pencil, Plus, Trash2Icon } from "lucide-react";
import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { MAX_PAGE_COUNT } from "@/features/document/constants";
import { useDocumentEditor } from "@/features/document/context/DocumentEditorContext";
import { useInlineEdit } from "@/features/document/hooks/useInlineEdit";
import { PAGE_NAME_MAX_LENGTH, TITLE_MAX_LENGTH } from "@/features/document/types/validation";

interface EditorSidebarProps {
  className?: string;
  onPageSelect?: () => void;
}

function DocumentSidebarEditable({ className, onPageSelect }: EditorSidebarProps) {
  return (
    <nav className={className}>
      <div className="flex h-full min-h-0 w-full flex-col gap-6">
        <EditorTitleHeader />
        <EditorPageHeader />
        <EditorPageList onPageSelect={onPageSelect} />
      </div>
    </nav>
  );
}

function EditorTitleHeader() {
  const { title, setTitle } = useDocumentEditor();
  const edit = useInlineEdit(setTitle);
  // FIXME: buggy, when we click it sometimes not working
  return (
    <div className="group relative border-b border-border pb-4">
      {edit.editing ? (
        <input
          autoFocus
          aria-label="Rename document"
          className="w-full bg-transparent px-10 text-center text-2xl font-semibold text-foreground outline"
          value={edit.value}
          maxLength={TITLE_MAX_LENGTH}
          onChange={(event) => edit.setValue(event.target.value)}
          onBlur={edit.commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              edit.commit();
            }
            if (event.key === "Escape") {
              edit.cancel();
            }
          }}
        />
      ) : (
        <div className="flex justify-center">
          <div className="relative flex-1">
            <h1
              className={cn(
                "px-6 text-center text-2xl font-semibold wrap-break-word text-foreground",
                !title && "text-destructive"
              )}
            >
              {title || "Please enter a title"}
            </h1>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-1/2 right-[4%] -translate-y-1/2 lg:opacity-0 lg:transition-opacity lg:group-focus-within:opacity-100 lg:group-hover:opacity-100"
                    aria-label="Rename document"
                    onClick={() => edit.start(title)}
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
  );
}

function EditorPageHeader() {
  const { pages, addPage } = useDocumentEditor();

  return (
    <div className="flex items-center justify-between border-y border-border px-6 py-1">
      <div className="flex h-full items-center gap-3">
        <p className="font-semibold">Pages</p>
        <p className="text-sm text-muted-foreground">
          {pages.length} / {MAX_PAGE_COUNT}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Add page"
              onClick={addPage}
              disabled={pages.length >= MAX_PAGE_COUNT}
            >
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{pages.length >= MAX_PAGE_COUNT ? "Page limit reached" : "Add page"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function EditorPageList({ onPageSelect }: Pick<EditorSidebarProps, "onPageSelect">) {
  const { pages, selectedPageIndex, selectPage, deletePage, renamePage } = useDocumentEditor();
  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null);
  const edit = useInlineEdit((name) => {
    if (editingPageIndex !== null) {
      renamePage(editingPageIndex, name);
    }
    setEditingPageIndex(null);
  });

  function startRenaming(index: number) {
    setEditingPageIndex(index);
    edit.start(pages[index].name || "");
  }

  return (
    <ScrollArea className="min-h-0 flex-1">
      <ul className="flex w-full flex-col">
        {pages.map((page, index) => (
          <li
            key={page.id}
            className={cn(
              "group relative flex w-full flex-col hover:bg-secondary",
              index === selectedPageIndex && "bg-secondary"
            )}
          >
            <div className="relative flex w-full items-center">
              {editingPageIndex === index ? (
                <input
                  autoFocus
                  aria-label={`Rename page ${index + 1}`}
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-center text-sm outline"
                  value={edit.value}
                  maxLength={PAGE_NAME_MAX_LENGTH}
                  onChange={(event) => edit.setValue(event.target.value)}
                  onBlur={edit.commit}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      edit.commit();
                    }
                    if (event.key === "Escape") {
                      edit.cancel();
                    }
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
  );
}

function DocumentSidebarEditableMobile({ className }: EditorSidebarProps) {
  const [open, setOpen] = useState(false);
  const { title } = useDocumentEditor();

  return (
    <div className={className}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open navigation" />}>
          <MenuIcon className="size-8" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SheetTitle className="sr-only">{title}</SheetTitle>
          <DocumentSidebarEditable
            onPageSelect={() => {
              setOpen(false);
            }}
            className="h-full w-full bg-card/80 py-5"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export { DocumentSidebarEditable, DocumentSidebarEditableMobile };
