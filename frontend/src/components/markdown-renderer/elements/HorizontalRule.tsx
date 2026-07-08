function HorizontalRule({ ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr className="my-4 border-t border-muted-foreground w-full" {...props} />
  );
}

export { HorizontalRule };
