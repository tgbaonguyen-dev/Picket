import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/bills/subscriptions")({
  component: () => <Outlet />,
});
