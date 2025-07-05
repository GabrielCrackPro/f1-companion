import { useCallback, useState } from "react";
import { axiosClient } from "../config";

export const useAxios = <T = any,>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = useCallback(
    async (params?: Record<string, any>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get<T>(endpoint, { params });
        setData(response.data);
        return response.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          "An error occurred while fetching data.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { get, data, loading, error };
};
