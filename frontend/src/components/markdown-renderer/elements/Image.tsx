import { cn } from "@lib/utils";

function Image({
  src,
  alt,
  title,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"img">) {
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      className={cn("my-3 h-auto max-w-full object-cover", className)}
      loading="lazy"
      {...rest}
    />
  );
}

export { Image };
