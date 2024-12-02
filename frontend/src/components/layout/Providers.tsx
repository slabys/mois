"use client";

import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30,
          },
        },
      }),
    [],
  );
  return (
    <QueryClientProvider client={queryClient}>
      <Notifications />
      {children}
    </QueryClientProvider>
  );
};

export default Providers;
