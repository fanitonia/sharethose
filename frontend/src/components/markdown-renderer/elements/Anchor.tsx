function Anchor({
  href,
  children,
  ...rest
}: {
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className="text-link underline" {...rest}>
      {children}
    </a>
  );
}

export { Anchor };
