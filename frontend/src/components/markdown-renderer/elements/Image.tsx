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
      className={cn("h-auto object-cover my-3", className)}
      loading="lazy"
      {...rest}
    />
  );
}

export { Image };
