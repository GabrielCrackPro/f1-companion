import { constructors, driversImages } from "../constants";

export const driversMapper = (data: any) => {
  return data.MRData.DriverTable.Drivers.map((d: any) => ({
    ...d,
    constructor: constructors.find((c) => c.drivers.includes(d.driverId)),
    image: driversImages.find((i) => i.id === d.driverId)?.image,
    flag: driversImages.find((i) => i.id === d.driverId)?.flag,
  }));
};

export const driverMapper = (data: any) => {
  return data.MRData.DriverTable.Drivers[0];
};
