import type { ComponentPropsWithoutRef } from "react";

function isExternalHref(href?: string) {
  if (!href) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    return (
      /^(http:|https:)$/.test(url.protocol) &&
      url.origin !== window.location.origin
    );
  } catch {
    return false;
  }
}

function Anchor({
  href,
  children,
  rel,
  target,
  ...rest
}: ComponentPropsWithoutRef<"a">) {
  const isExternal = isExternalHref(href);

  return (
    <a
      href={href}
      className="text-link underline"
      rel={isExternal ? (rel ?? "noopener noreferrer") : rel}
      target={isExternal ? (target ?? "_blank") : target}
      {...rest}
    >
      {children}
    </a>
  );
}

export { Anchor };
