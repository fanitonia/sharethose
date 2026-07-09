import { cn } from "@/lib/utils";

import type { Page } from "@api/contracts";

import MarkdownRenderer from "@components/markdown-renderer";

function PageView({ page, className }: { page: Page; className?: string }) {
  return (
    <div className={cn("", className)}>
      <MarkdownRenderer markdown={page.content} />
    </div>
  );
}

export default PageView;
