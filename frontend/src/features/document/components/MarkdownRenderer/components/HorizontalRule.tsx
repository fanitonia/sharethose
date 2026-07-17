function HorizontalRule({ ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className="my-4 w-full border-t border-muted-foreground" {...props} />;
}

export { HorizontalRule };
