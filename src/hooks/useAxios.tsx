import { useCallback, useRef, useState } from "react";
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

export const useAxios = <T = any,>(baseEndpoint: string) => {
  const [data, setData] = useState<T | (T | null)[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, T>>(new Map());

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

      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get<T>(endpoint, { params });
        cacheRef.current.set(cacheKey, response.data);
        setData(response.data);
        return response.data;
      } catch (err: any) {
        console.error("Error fetching data", err);
        const message =
          err?.response?.data?.message ||
          "An error occurred while fetching data.";
        setError(message);
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
          "An error occurred while fetching multiple data.";
        setError(message);
        return null;
      } finally {
        if (fetchNeeded) setLoading(false);
      }
    },
    []
  );

  return { get, getMultiple, data, loading, error };
};
