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
    <ul className="list-outside list-disc space-y-1 pl-5" {...rest}>
      {children}
    </ul>
  );
}

// TODO: : numbers bigger than 9 are not aligned properly, fix that
function OrderedList({ children, ...rest }: OrderedListProps) {
  return (
    <ol className="list-outside list-decimal space-y-1 pl-5" {...rest}>
      {children}
    </ol>
  );
}

function ListItem({ children, ...rest }: ListItemProps) {
  return (
    <li className="py-1 pl-1" {...rest}>
      {children}
    </li>
  );
}

export { UnorderedList, OrderedList, ListItem };
