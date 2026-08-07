import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark as theme } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { isValidElement } from "react";

type CodeChildProps = {
  children?: React.ReactNode;
  className?: string;
};

function Pre({ children }: React.ComponentPropsWithoutRef<"pre">) {
  if (!isValidElement<CodeChildProps>(children)) {
    return <pre>{children}</pre>;
  }

  const { children: codeChildren, className } = children.props;
  const match = /language-(\w+)/.exec(className || "");

  return (
    <SyntaxHighlighter
      language={match?.[1]}
      style={theme}
      PreTag="pre"
      customStyle={{ padding: "0.75em 1em" }}
    >
      {String(codeChildren).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
}

export { Pre };
