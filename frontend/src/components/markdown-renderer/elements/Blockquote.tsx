function Blockquote({ children, ...rest }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="border-l-4 border-muted-foreground bg-muted/50 pl-4 py-1 my-2"
      {...rest}
    >
      {children}
    </blockquote>
  );
}

export { Blockquote };
