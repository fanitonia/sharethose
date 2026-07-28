import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/doc/$documentSlug/edit/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/doc/$documentSlug/edit/"!</div>
}
