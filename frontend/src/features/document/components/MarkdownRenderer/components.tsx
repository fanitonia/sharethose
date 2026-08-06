import type { Components } from "react-markdown";
import { Pre } from "./components/Pre";

export const customComponents: Components = {
  pre: ({ children, ...rest }) => <Pre {...rest}>{children}</Pre>,
};
