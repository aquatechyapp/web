import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

export function ReactQueryProviderComponent({
  children
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
