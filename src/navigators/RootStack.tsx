import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { HomeTabs } from "./HomeTabs";

export const RootStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Root" component={HomeTabs} />
    </Stack.Navigator>
  );
};
