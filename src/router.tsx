import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { GlobalLoading } from "@/components/global-loading";

export const getRouter = () => {

  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingMinMs: 150, // Only show if loading takes > 150ms to avoid flashing on instant loads
    defaultPendingComponent: GlobalLoading,
  });

  return router;
};
