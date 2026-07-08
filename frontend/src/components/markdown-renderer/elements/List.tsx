import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ListProps = ComponentPropsWithoutRef<"ul"> & {
  children: ReactNode;
};

type OrderedListProps = ComponentPropsWithoutRef<"ol"> & {
  children: ReactNode;
};

type ListItemProps = ComponentPropsWithoutRef<"li"> & {
  children: ReactNode;
};

function UnorderedList({ children, ...rest }: ListProps) {
  return (
    <ul className="list-disc list-outside pl-5 space-y-1" {...rest}>
      {children}
    </ul>
  );
}

// TODO: : numbers bigger than 9 are not aligned properly, fix that
function OrderedList({ children, ...rest }: OrderedListProps) {
  return (
    <ol className="list-decimal list-outside pl-5 space-y-1" {...rest}>
      {children}
    </ol>
  );
}

function ListItem({ children, ...rest }: ListItemProps) {
  return (
    <li className="pl-1 py-1" {...rest}>
      {children}
    </li>
  );
}

export { UnorderedList, OrderedList, ListItem };
