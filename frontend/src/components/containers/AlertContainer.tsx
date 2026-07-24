import { cn } from "@/lib/utils";

import { Item, ItemContent } from "@/components/ui/item";

interface AlertContainerProps {
  children: React.ReactNode;
  className?: string;
}

function AlertContainer({ children, className }: AlertContainerProps) {
  return (
    <Item
      className={cn("border border-destructive/20 bg-destructive/5 text-destructive", className)}
    >
      <ItemContent className="space-y-2">{children}</ItemContent>
    </Item>
  );
}

export { AlertContainer };
