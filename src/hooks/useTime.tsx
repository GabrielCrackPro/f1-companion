import { useState } from "react";

export const useTime = () => {
  const [isTrackTime, setIsTrackTime] = useState(false);

  const toggleTrackTime = () => setIsTrackTime((prev) => !prev);

  const getTrackTime = (lat: number, long: number) => {
    return {
      lat,
      long,
    };
  };

  return {
    isTrackTime,
    toggleTrackTime,
    getTrackTime,
  };
};
