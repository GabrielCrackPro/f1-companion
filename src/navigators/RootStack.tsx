import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { RaceDetailScreen, RaceResultsScreen } from "../screens";
import { HomeTabs } from "./HomeTabs";
import { Header, RaceHeader } from "../components";

export const RootStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Root">
      <Stack.Screen
        name="Root"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Race"
        component={RaceDetailScreen}
        options={{
          header: () => <RaceHeader />,
        }}
      />
      <Stack.Screen
        name="Results"
        component={RaceResultsScreen}
        options={{
          header: () => <RaceHeader isResults />,
        }}
      />
    </Stack.Navigator>
  );
};
