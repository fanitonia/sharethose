import type { Components } from "react-markdown";

import { Anchor } from "./elements/Anchor";
import { Blockquote } from "./elements/Blockquote";
import { Code } from "./elements/Code";
import * as Headings from "./elements/Headings";
import { HorizontalRule } from "./elements/HorizontalRule";
import { Image } from "./elements/Image";
import { ListItem, OrderedList, UnorderedList } from "./elements/List";
import Mark from "./elements/Mark";
import { Pre } from "./elements/Pre";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "./elements/Table";

export const markdownComponents: Components = {
  a: ({ href, children, ...rest }) => (
    <Anchor href={href} {...rest}>
      {children}
    </Anchor>
  ),
  blockquote: ({ children, ...rest }) => (
    <Blockquote {...rest}>{children}</Blockquote>
  ),
  code: ({ children, ...rest }) => <Code {...rest}>{children}</Code>,
  pre: ({ children, ...rest }) => <Pre {...rest}>{children}</Pre>,
  h1: ({ children, ...rest }) => (
    <Headings.Heading1 {...rest}>{children}</Headings.Heading1>
  ),
  h2: ({ children, ...rest }) => (
    <Headings.Heading2 {...rest}>{children}</Headings.Heading2>
  ),
  h3: ({ children, ...rest }) => (
    <Headings.Heading3 {...rest}>{children}</Headings.Heading3>
  ),
  h4: ({ children, ...rest }) => (
    <Headings.Heading4 {...rest}>{children}</Headings.Heading4>
  ),
  h5: ({ children, ...rest }) => (
    <Headings.Heading5 {...rest}>{children}</Headings.Heading5>
  ),
  h6: ({ children, ...rest }) => (
    <Headings.Heading6 {...rest}>{children}</Headings.Heading6>
  ),
  hr: ({ ...rest }) => <HorizontalRule {...rest} />,
  img: ({ ...rest }) => <Image {...rest} />,
  table: ({ children, ...rest }) => <Table {...rest}>{children}</Table>,
  thead: ({ children, ...rest }) => <TableHead {...rest}>{children}</TableHead>,
  tbody: ({ children, ...rest }) => <TableBody {...rest}>{children}</TableBody>,
  tr: ({ children, ...rest }) => <TableRow {...rest}>{children}</TableRow>,
  th: ({ children, ...rest }) => (
    <TableHeaderCell {...rest}>{children}</TableHeaderCell>
  ),
  td: ({ children, ...rest }) => <TableCell {...rest}>{children}</TableCell>,
  ul: ({ children, ...rest }) => (
    <UnorderedList {...rest}>{children}</UnorderedList>
  ),
  ol: ({ children, ...rest }) => (
    <OrderedList {...rest}>{children}</OrderedList>
  ),
  li: ({ children, ...rest }) => <ListItem {...rest}>{children}</ListItem>,
  mark: ({ children }) => <Mark>{children}</Mark>,
};
