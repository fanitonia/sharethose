import Markdown from "react-markdown";
import remarkDefinitionList from "remark-definition-list";
import emoji from "remark-emoji";
import remarkFlexibleContainers from "remark-flexible-containers";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkGfm from "remark-gfm";
import remarkIns from "remark-ins";
import supersub from "remark-supersub";

import { cn } from "@/lib/utils";

import { customComponents } from "./components";

// TODO: somehow we need to make codeblocks scroolable sidways
function MarkdownRenderer({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn("typeset", className)}>
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
        components={customComponents}
      >
        {source}
      </Markdown>
    </div>
  );
}

export { MarkdownRenderer };
