import React from "react";

function Heading1({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h1 className="my-4 text-3xl font-bold" id={id}>
      {children}
    </h1>
  );
}

function Heading2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 className="my-4 text-2xl font-bold" id={id}>
      {children}
    </h2>
  );
}

function Heading3({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 className="my-4 text-xl font-bold" id={id}>
      {children}
    </h3>
  );
}

function Heading4({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h4 className="my-4 text-lg font-bold" id={id}>
      {children}
    </h4>
  );
}

function Heading5({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h5 className="my-4 text-base font-bold" id={id}>
      {children}
    </h5>
  );
}

function Heading6({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h6 className="my-4 text-sm font-bold" id={id}>
      {children}
    </h6>
  );
}

export { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 };
