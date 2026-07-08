function Code({
  children,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <code {...rest}>{children}</code>;
}

export { Code };
