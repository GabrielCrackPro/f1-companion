import { IconFamily } from "../types/icon.types";

export const ROUTE_ICON_MAP: Record<
  string,
  { focused: string; unfocused: string; family: IconFamily }
> = {
  Home: {
    focused: "home-sharp",
    unfocused: "home-outline",
    family: "ionicons",
  },
  Races: {
    focused: "flag-checkered",
    unfocused: "flag-checkered",
    family: "material-community",
  },
  Drivers: {
    focused: "racing-helmet",
    unfocused: "racing-helmet",
    family: "material-community",
  },
  Settings: {
    focused: "settings-sharp",
    unfocused: "settings-outline",
    family: "ionicons",
  },
};
