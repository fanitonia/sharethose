import { Input as InputPrimitive } from "@base-ui/react/input";
import { type VariantProps, cva } from "class-variance-authority";

import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva("w-full min-w-0 bg-transparent outline-none", {
  variants: {
    variant: {
      default:
        "h-9 rounded-md border border-input px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
      inline:
        "h-auto rounded-none border-0 px-0 py-0 shadow-none transition-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Input({
  className,
  type,
  variant,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Input };
