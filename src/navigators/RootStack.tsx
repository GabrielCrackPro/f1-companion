import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { RaceHeader, SeasonSelector } from "../components";
import { useSeasonContext } from "../hooks";
import {
  LapsScreen,
  RaceDetailScreen,
  RaceResultsScreen,
  SeasonReasultsScreen,
} from "../screens";
import { HomeTabs } from "./HomeTabs";

export const RootStack = () => {
  const Stack = createNativeStackNavigator();

  const { seasonSelectorRef, season, handleSeasonSelect } = useSeasonContext();

  return (
    <>
      <Stack.Navigator initialRouteName="Root">
        <Stack.Screen
          name="Root"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Group>
          <Stack.Screen
            name="Race"
            component={RaceDetailScreen}
            options={{
              header: () => <RaceHeader />,
            }}
          />
          <Stack.Screen
            name="Laps"
            component={LapsScreen}
            options={{
              header: () => <RaceHeader isLaps />,
            }}
          />
          <Stack.Screen
            name="Results"
            component={RaceResultsScreen}
            options={{
              header: () => <RaceHeader isResults />,
            }}
          />
        </Stack.Group>
        <Stack.Screen name="SeasonResults" component={SeasonReasultsScreen} />
      </Stack.Navigator>
      <SeasonSelector
        ref={seasonSelectorRef}
        selectedSeason={season}
        onSeasonSelect={handleSeasonSelect}
      />
    </>
  );
};
