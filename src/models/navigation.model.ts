import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Circuit } from "./circuit.model";

type RaceScreen = {
  season: number;
  round: number;
  name: string;
  finished?: boolean;
  today?: boolean;
  session?: string;
  circuit?: Circuit;
};

export type TabNavigationParamList = {
  Home: undefined;
  Race: RaceScreen;
  Results: RaceScreen;
  SeasonResults: { season: number };
};

export type RaceNavigationProp = NativeStackNavigationProp<
  TabNavigationParamList,
  "Race"
>;

export type RaceRouteProp = RouteProp<TabNavigationParamList, "Race">;
