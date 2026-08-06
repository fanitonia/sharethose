import Markdown from "react-markdown";
import remarkDefinitionList from "remark-definition-list";
import emoji from "remark-emoji";
import remarkFlexibleContainers from "remark-flexible-containers";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkGfm from "remark-gfm";
import remarkIns from "remark-ins";
import supersub from "remark-supersub";

import { cn } from "@/lib/utils";

import { markdownComponents } from "./components";

function MarkdownRenderer({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn("markdown-content", className)}>
      <Markdown
        remarkPlugins={[
          [remarkGfm, { singleTilde: false }],
          [emoji, { emoticon: true }],
          remarkIns,
          remarkFlexibleMarkers,
          remarkFlexibleContainers,
          remarkDefinitionList,
          supersub,
        ]}
        components={markdownComponents}
      >
        {source}
      </Markdown>
    </div>
  );
}

export { MarkdownRenderer };
