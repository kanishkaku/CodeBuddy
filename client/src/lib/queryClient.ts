import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const defaultOptions: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // Get auth token from Supabase if available
  try {
    const { supabase } = await import('./supabase');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${session.access_token}`,
        'X-User-Id': session.user?.id || ''
      };
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Make sure headers are properly merged
  if (options?.headers) {
    mergedOptions.headers = { 
      ...defaultOptions.headers, 
      ...options.headers 
    };
  }
  
  const res = await fetch(url, mergedOptions);

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get auth token from Supabase if available
    let headers: HeadersInit = {};
    
    try {
      const { supabase } = await import('./supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers = {
          'Authorization': `Bearer ${session.access_token}`,
          'X-User-Id': session.user?.id || ''
        };
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
      headers
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
