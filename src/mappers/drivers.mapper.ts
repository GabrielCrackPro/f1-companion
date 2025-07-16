import { constructors } from "../constants";

export const driversMapper = (data: any) => {
  return data.MRData.DriverTable.Drivers.map((d: any) => ({
    ...d,
    constructor: constructors.find((c) => c.drivers.includes(d.driverId)),
  }));
};

export const driverMapper = (data: any) => {
  return data.MRData.DriverTable.Drivers[0];
};
