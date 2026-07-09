function Code({
  children,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <code className="border bg-muted px-1" {...rest}>
      {children}
    </code>
  );
}
// TODO: thema'ya göre renkleri ayarla.
export { Code };
