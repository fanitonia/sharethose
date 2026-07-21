import { Item, ItemContent } from "@/components/ui/item";
import { cn } from "@/lib/utils";

interface AlertContainerProps {
  children: React.ReactNode;
  className?: string;
}

function AlertContainer({ children, className }: AlertContainerProps) {
  return (
    <Item
      className={cn("border border-destructive/30 bg-destructive/10 text-destructive", className)}
    >
      <ItemContent className="space-y-2">{children}</ItemContent>
    </Item>
  );
}

export { AlertContainer };
