import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Item, ItemContent } from "@/components/ui/item";

const containerVariants = cva("border", {
  variants: {
    variant: {
      default: "border-default/20 bg-default/5 text-default",
      destructive: "border-destructive/20 bg-destructive/4 text-destructive",
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
    <Item className={cn(containerVariants({ variant }), className)}>
      <ItemContent className="space-y-2">{children}</ItemContent>
    </Item>
  );
}

export { Container };
