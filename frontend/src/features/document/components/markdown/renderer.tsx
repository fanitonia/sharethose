import Markdown from "react-markdown";
import remarkDefinitionList from "remark-definition-list";
import emoji from "remark-emoji";
import remarkFlexibleContainers from "remark-flexible-containers";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkGfm from "remark-gfm";
import remarkIns from "remark-ins";
import supersub from "remark-supersub";
import type { PluggableList } from "unified";

import { cn } from "@/lib/utils";

import { customComponents } from "./custom-components";

interface MarkdownRendererProps {
  source: string;
  className?: string;
}

const remarkPlugins: PluggableList = [
  [remarkGfm, { singleTilde: false }],
  [emoji, { emoticon: true }],
  remarkIns,
  remarkFlexibleMarkers,
  remarkFlexibleContainers,
  remarkDefinitionList,
  supersub,
];

// TODO: somehow we need to make codeblocks scrollable sidways
function MarkdownRenderer({ source, className }: MarkdownRendererProps) {
  return (
    <div className={cn("typeset", className)}>
      <Markdown remarkPlugins={remarkPlugins} components={customComponents}>
        {source}
      </Markdown>
    </div>
  );
}

export { MarkdownRenderer };
