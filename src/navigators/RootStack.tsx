import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { RaceHeader } from "../components/races/RaceHeader";
import { SeasonSelector } from "../components/seasons/SeasonSelector";
import { useSeasonContext } from "../hooks";
import { DriverDetailScreen } from "../screens/drivers/DriverDetailScreen";
import { LapsScreen } from "../screens/races/LapsScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { PitStopsScreen } from "../screens/races/PitStopsScreen";
import { RaceDetailScreen } from "../screens/races/RaceDetailScreen";
import { RaceResultsScreen } from "../screens/races/RaceResultsScreen";
import { SeasonReasultsScreen } from "../screens/season/SeasonReasultsScreen";
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
        <Stack.Group>
          <Stack.Screen name="Driver" component={DriverDetailScreen} />
        </Stack.Group>
        <Stack.Screen name="SeasonResults" component={SeasonReasultsScreen} />
        <Stack.Screen name="Pitstops" component={PitStopsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
      <SeasonSelector
        ref={seasonSelectorRef}
        selectedSeason={season}
        onSeasonSelect={handleSeasonSelect}
      />
    </>
  );
};
