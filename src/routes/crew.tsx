import { createFileRoute, Outlet } from "@tanstack/react-router";

// This file is the layout parent for all /crew/* routes.
// Actual page content lives in crew/index.tsx, crew/$slug/index.tsx, etc.
export const Route = createFileRoute("/crew")({
  component: () => <Outlet />,
});
