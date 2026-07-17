import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import { StrictMode } from "react";

import { ThemeProvider } from "@/context/ThemeProvider";

import { TooltipProvider } from "@/components/ui/tooltip";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import "./styles/index.css";

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPendingMs: 250,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
