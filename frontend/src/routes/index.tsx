import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-16">
      <div className="flex max-w-xl flex-col items-center text-center">
        <p className="font-geist-mono text-xl text-muted-foreground">ShareThose</p>
        <h1 className="mt-5 font-heading text-5xl font-semibold tracking-normal text-balance sm:text-6xl">
          Write. Share.
        </h1>
        <p className="mt-5 max-w-sm text-base text-muted-foreground">
          Free, private link sharing for markdown documents.
        </p>
        <Button
          className="mt-8 px-5"
          render={<Link to="/create">Create Document</Link>}
          nativeButton={false}
        ></Button>
      </div>
    </main>
  );
}
