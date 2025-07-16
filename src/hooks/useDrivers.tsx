import { useCallback } from "react";
import { driverMapper, driversMapper } from "../mappers";
import { useAxios } from "./useAxios";
import { useSeasonContext } from "./useSeasonContext";

export const useDrivers = () => {
  const { season } = useSeasonContext();
  const { getMultiple, get } = useAxios("drivers");

  const getDrivers = useCallback(async () => {
    const response = await getMultiple([`${season}/drivers`]);

    if (!response) return null;

    return driversMapper(response[0]);
  }, [getMultiple]);

  const getDriverById = useCallback(
    async (driverId: string) => {
      const response = await getMultiple([`/drivers/${driverId}`]);
      if (!response) return null;
      return driverMapper(response[0]);
    },
    [getMultiple]
  );

  return {
    getDrivers,
    getDriverById,
  };
};
