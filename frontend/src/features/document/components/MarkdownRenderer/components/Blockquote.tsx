function Blockquote({ children, ...rest }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-2 border-l-4 border-muted-foreground bg-muted/50 py-1 pl-4" {...rest}>
      {children}
    </blockquote>
  );
}

export { Blockquote };
