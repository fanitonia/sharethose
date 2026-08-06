import { cn } from "@/lib/utils";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";

import { MarkdownRenderer } from "@/features/document/components/MarkdownRenderer";
import { PAGE_CONTENT_MAX_LENGTH } from "@/features/document/types/validation";

interface MarkdownEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  className?: string;
}

function MarkdownEditor({ content, onContentChange, className }: MarkdownEditorProps) {
  const isExtraLargeScreen = useMediaQuery("(min-width: 80rem)");

  return (
    <div className={cn(className)}>
      <ResizablePanelGroup orientation={isExtraLargeScreen ? "horizontal" : "vertical"}>
        <ResizablePanel minSize="25%">
          <div className="flex h-full flex-col">
            <Textarea
              placeholder="Enter your markdown here..."
              value={content}
              onChange={(event) => onContentChange(event.target.value)}
              className={cn("h-full resize-none rounded-none p-5", className)}
              spellCheck={false}
              maxLength={PAGE_CONTENT_MAX_LENGTH}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize="25%">
          <MarkdownRenderer className="px-5 py-2" source={content}></MarkdownRenderer>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export { MarkdownEditor };
