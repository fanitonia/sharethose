import type { Page } from "@/api/contracts";
import MarkdownRenderer from "@/components/markdown";

function DocumentPageContent({
  page,
  className,
}: {
  page: Page;
  className?: string;
}) {
  return <MarkdownRenderer markdown={page.content} className={className} />;
}

export default DocumentPageContent;
