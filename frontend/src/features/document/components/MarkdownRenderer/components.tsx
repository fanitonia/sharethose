import type { Components } from "react-markdown";

import { Anchor } from "./components/Anchor";
import { Blockquote } from "./components/Blockquote";
import { Code } from "./components/Code";
import * as Headings from "./components/Headings";
import { HorizontalRule } from "./components/HorizontalRule";
import { Image } from "./components/Image";
import { ListItem, OrderedList, UnorderedList } from "./components/List";
import Mark from "./components/Mark";
import Paragraph from "./components/Paragraph";
import { Pre } from "./components/Pre";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "./components/Table";

export const markdownComponents: Components = {
  a: ({ href, children, ...rest }) => (
    <Anchor href={href} {...rest}>
      {children}
    </Anchor>
  ),
  blockquote: ({ children, ...rest }) => <Blockquote {...rest}>{children}</Blockquote>,
  code: ({ children, ...rest }) => <Code {...rest}>{children}</Code>,
  pre: ({ children, ...rest }) => <Pre {...rest}>{children}</Pre>,
  h1: ({ children, id, ...rest }) => (
    <Headings.Heading1 id={id} {...rest}>
      {children}
    </Headings.Heading1>
  ),
  h2: ({ children, id, ...rest }) => (
    <Headings.Heading2 id={id} {...rest}>
      {children}
    </Headings.Heading2>
  ),
  h3: ({ children, id, ...rest }) => (
    <Headings.Heading3 id={id} {...rest}>
      {children}
    </Headings.Heading3>
  ),
  h4: ({ children, id, ...rest }) => (
    <Headings.Heading4 id={id} {...rest}>
      {children}
    </Headings.Heading4>
  ),
  h5: ({ children, id, ...rest }) => (
    <Headings.Heading5 id={id} {...rest}>
      {children}
    </Headings.Heading5>
  ),
  h6: ({ children, id, ...rest }) => (
    <Headings.Heading6 id={id} {...rest}>
      {children}
    </Headings.Heading6>
  ),
  hr: ({ ...rest }) => <HorizontalRule {...rest} />,
  img: ({ ...rest }) => <Image {...rest} />,
  table: ({ children, ...rest }) => <Table {...rest}>{children}</Table>,
  thead: ({ children, ...rest }) => <TableHead {...rest}>{children}</TableHead>,
  tbody: ({ children, ...rest }) => <TableBody {...rest}>{children}</TableBody>,
  tr: ({ children, ...rest }) => <TableRow {...rest}>{children}</TableRow>,
  th: ({ children, ...rest }) => <TableHeaderCell {...rest}>{children}</TableHeaderCell>,
  td: ({ children, ...rest }) => <TableCell {...rest}>{children}</TableCell>,
  ul: ({ children, ...rest }) => <UnorderedList {...rest}>{children}</UnorderedList>,
  ol: ({ children, ...rest }) => <OrderedList {...rest}>{children}</OrderedList>,
  li: ({ children, ...rest }) => <ListItem {...rest}>{children}</ListItem>,
  mark: ({ children }) => <Mark>{children}</Mark>,
  p: ({ children }) => <Paragraph>{children}</Paragraph>,
};
