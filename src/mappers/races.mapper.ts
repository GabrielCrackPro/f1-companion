import { commonMapper } from "./common.mapper";

export const racesMapper = (data: any) => {
  const common = commonMapper(data);
  data = {
    ...common,
    data: data.MRData.RaceTable.Races,
  };

  return data;
};
