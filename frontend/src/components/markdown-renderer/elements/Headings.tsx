import React from "react";

function Heading1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold my-4">{children}</h1>;
}

function Heading2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold my-4">{children}</h2>;
}

function Heading3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-bold my-4">{children}</h3>;
}

function Heading4({ children }: { children: React.ReactNode }) {
  return <h4 className="text-lg font-bold my-4">{children}</h4>;
}

function Heading5({ children }: { children: React.ReactNode }) {
  return <h5 className="text-base font-bold my-4">{children}</h5>;
}

function Heading6({ children }: { children: React.ReactNode }) {
  return <h6 className="text-sm font-bold my-4">{children}</h6>;
}

export { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 };
