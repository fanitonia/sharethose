import type { Components } from "react-markdown";

import { Pre } from "./pre";

export const customComponents: Components = {
  pre: ({ children }) => <Pre>{children}</Pre>,
};
