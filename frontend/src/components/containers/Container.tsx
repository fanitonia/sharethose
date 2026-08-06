import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

import { Item, ItemContent } from "@/components/ui/item";

const containerVariants = cva("", {
  variants: {
    variant: {
      default: "border border-default/20 bg-default/5 text-default",
      destructive: "border border-destructive/20 bg-destructive/4 text-destructive"
    },
  },
  defaultVariants: {
    variant: "default",
  },
});


interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: VariantProps<typeof containerVariants>["variant"];
}

function Container({ children, className, variant }: ContainerProps) {
  return (
    <Item
      className={cn(
        containerVariants({ variant }),
        className
      )}
    >
      <ItemContent className="space-y-2">{children}</ItemContent>
    </Item>
  );
}

export { Container };
