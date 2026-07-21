import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dev/forge')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/dev/forge"!</div>
}
