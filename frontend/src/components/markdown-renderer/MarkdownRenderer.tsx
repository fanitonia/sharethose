import Markdown from "react-markdown";
import remarkDefinitionList from "remark-definition-list";
import emoji from "remark-emoji";
import remarkFlexibleContainers from "remark-flexible-containers";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkGfm from "remark-gfm";
import remarkIns from "remark-ins";
import supersub from "remark-supersub";

import { markdownComponents } from "./markdown-components";

// TOOD: style containers
function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <div className="markdown-content max-w-full">
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
        {markdown}
      </Markdown>
    </div>
  );
}

export default MarkdownRenderer;
