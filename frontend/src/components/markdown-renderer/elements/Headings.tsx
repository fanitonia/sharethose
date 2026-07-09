import React from "react";

function Heading1({ children }: { children: React.ReactNode }) {
  return <h1 className="my-4 text-3xl font-bold">{children}</h1>;
}

function Heading2({ children }: { children: React.ReactNode }) {
  return <h2 className="my-4 text-2xl font-bold">{children}</h2>;
}

function Heading3({ children }: { children: React.ReactNode }) {
  return <h3 className="my-4 text-xl font-bold">{children}</h3>;
}

function Heading4({ children }: { children: React.ReactNode }) {
  return <h4 className="my-4 text-lg font-bold">{children}</h4>;
}

function Heading5({ children }: { children: React.ReactNode }) {
  return <h5 className="my-4 text-base font-bold">{children}</h5>;
}

function Heading6({ children }: { children: React.ReactNode }) {
  return <h6 className="my-4 text-sm font-bold">{children}</h6>;
}

export { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 };
