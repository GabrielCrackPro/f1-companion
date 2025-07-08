import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RaceScreen = {
  season: number;
  round: number;
  name: string;
  finished?: boolean;
  today?: boolean;
  session?: string;
};

export type TabNavigationParamList = {
  Home: undefined;
  Race: RaceScreen;
  Results: RaceScreen;
};

export type RaceNavigationProp = NativeStackNavigationProp<
  TabNavigationParamList,
  "Race"
>;

export type RaceRouteProp = RouteProp<TabNavigationParamList, "Race">;
