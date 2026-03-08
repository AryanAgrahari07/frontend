import { QueryClient, QueryFunction, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { apiRequestRaw } from "@/lib/api";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  if (url.startsWith("http")) {
    // External URL (no refresh logic)
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    await throwIfResNotOk(res);
    return res;
  }

  const res = await apiRequestRaw(method, url, data);
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const queryUrl = queryKey.join("/") as string;

      // External URL: no refresh logic
      const res = queryUrl.startsWith("http")
        ? await fetch(queryUrl, { credentials: "include" })
        : await apiRequestRaw("GET", queryUrl);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      // Don't toast 401/403s globally — they redirect to login
      if (error?.message?.startsWith("401") || error?.message?.startsWith("403")) return;
      // FE-3: Show a non-intrusive toast for query errors on operational pages.
      // Suppress on background queries (those with initialData) to avoid noise on prefetches.
      if (query.state.data !== undefined) return; // stale data already shown; just warn internally
      console.warn("Global Query Error:", error);
      toast({
        title: "Data load failed",
        description: error?.message || "Could not refresh data. Please check your connection.",
        variant: "destructive",
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      toast({
        title: "Action Failed",
        description: error?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  }),
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute stale time - data will refetch after invalidation
      retry: (failureCount, error: any) => {
        if (error?.message?.startsWith("401") || error?.message?.startsWith("403")) return false;
        if (error?.message?.startsWith("429")) return false; // FE-3 FIX: Don't retry rate-limited requests
        return failureCount < 2; // retry network errors twice
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
    mutations: {
      retry: false,
    },
  },
});
