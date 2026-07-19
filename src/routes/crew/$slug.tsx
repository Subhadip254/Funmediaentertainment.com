import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout parent for /crew/$slug and /crew/$slug/works.
// Actual content is in $slug/index.tsx and $slug/works.tsx respectively.
export const Route = createFileRoute("/crew/$slug")({
  component: () => <Outlet />,
});
