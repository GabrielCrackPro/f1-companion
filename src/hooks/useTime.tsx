import axios from "axios";
import { useCallback, useState } from "react";

export const useTime = () => {
  const [isTrackTime, setIsTrackTime] = useState(false);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTrackTime = useCallback(() => {
    setIsTrackTime((prev) => !prev);
  }, []);

  const getTrackTime = useCallback(async (lat: number, long: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${long}`
      );

      if (data?.dateTime) {
        setCurrentTime(data.dateTime);
        return data.dateTime;
      } else {
        throw new Error("No datetime returned from timeapi.io");
      }
    } catch (err: any) {
      setError("Failed to fetch time from API");
      console.error("getTrackTime error:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isTrackTime,
    toggleTrackTime,
    getTrackTime,
    currentTime,
    isLoading,
    error,
  };
};
