import { useCallback, useRef, useState, useEffect } from "react";
import { axiosClient } from "../config";
import { AxiosResponse } from "axios";

function isFulfilled<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

const getCacheKey = (url: string, params?: Record<string, any>) => {
  const query = params ? JSON.stringify(params) : "";
  return `${url}?${query}`;
};

const MAX_CACHE_SIZE = 100; // Limit cache to prevent memory leaks

export const useAxios = <T = any,>(baseEndpoint: string) => {
  const [data, setData] = useState<T | (T | null)[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, T>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function to clear cache and abort requests
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    cacheRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const get = useCallback(
    async (params?: Record<string, any>) => {
      const endpoint = baseEndpoint;

      if (!endpoint) {
        const message = "No endpoint provided to Axios hook.";
        console.error(message);
        setError(message);
        return null;
      }

      const cacheKey = getCacheKey(endpoint, params);

      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey)!;
        setData(cached);
        return cached;
      }

      // Abort previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get<T>(endpoint, { 
          params,
          signal: abortControllerRef.current.signal
        });
        
        // Check cache size and remove oldest entries if needed
        if (cacheRef.current.size >= MAX_CACHE_SIZE) {
          const firstKey = cacheRef.current.keys().next().value;
          if (firstKey) {
            cacheRef.current.delete(firstKey);
          }
        }
        
        cacheRef.current.set(cacheKey, response.data);
        setData(response.data);
        return response.data;
      } catch (err: any) {
        // Don't set error if request was aborted
        if (err.name === 'AbortError') {
          return null;
        }
        
        console.error("Error fetching data", err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "An error occurred while fetching data.";
        setError(message || "An error occurred while fetching data.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseEndpoint]
  );

  const getMultiple = useCallback(
    async (endpoints: string[], params?: Record<string, any>) => {
      if (!endpoints || endpoints.length === 0) {
        const message = "No endpoints provided to getMultiple.";
        console.error(message);
        setError(message);
        return null;
      }

      const cacheKeys = endpoints.map((ep) => getCacheKey(ep, params));
      const uncachedIndexes: number[] = [];

      cacheKeys.forEach((key, index) => {
        if (!cacheRef.current.has(key)) {
          uncachedIndexes.push(index);
        }
      });

      const fetchNeeded = uncachedIndexes.length > 0;

      if (fetchNeeded) setLoading(true);
      setError(null);

      try {
        const fetchPromises = await Promise.allSettled(
          endpoints.map((ep, idx) => {
            const key = cacheKeys[idx];

            if (cacheRef.current.has(key)) {
              return Promise.resolve({
                data: cacheRef.current.get(key),
              } as AxiosResponse<T>);
            }

            return axiosClient.get<T>(ep, { params });
          })
        );

        const results: (T | null)[] = fetchPromises.map((result, idx) => {
          const key = cacheKeys[idx];

          if (isFulfilled(result)) {
            const data = result.value.data;
            
            // Check cache size and remove oldest entries if needed
            if (cacheRef.current.size >= MAX_CACHE_SIZE) {
              const firstKey = cacheRef.current.keys().next().value;
              if (firstKey) {
                cacheRef.current.delete(firstKey);
              }
            }
            
            cacheRef.current.set(key, data);
            return data;
          }

          return null;
        });

        setData(results);
        return results;
      } catch (err: any) {
        console.error("Error fetching multiple data", err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "An error occurred while fetching multiple data.";
        setError(String(message));
        return null;
      } finally {
        if (fetchNeeded) setLoading(false);
      }
    },
    []
  );

  return { get, getMultiple, data, loading, error, cleanup };
};
