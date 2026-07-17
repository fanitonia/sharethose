import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark as theme } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { isValidElement } from "react";

type CodeChildProps = {
  children?: React.ReactNode;
  className?: string;
};

function Pre({ children, ...rest }: React.ComponentPropsWithoutRef<"pre">) {
  if (!isValidElement<CodeChildProps>(children)) {
    return (
      <pre {...rest} className="my-2">
        {children}
      </pre>
    );
  }

  const { children: codeChildren, className } = children.props;
  const match = /language-(\w+)/.exec(className || "");

  return (
    <SyntaxHighlighter
      {...rest}
      language={match?.[1]}
      style={theme}
      PreTag="pre"
      customStyle={{ marginTop: 12, marginBottom: 12 }}
    >
      {String(codeChildren).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
}

export { Pre };
