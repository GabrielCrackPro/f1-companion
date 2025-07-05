import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Header } from "../components";
import { ROUTE_ICON_MAP } from "../constants/routes";
import { Icon } from "../components/shared/atoms";

export const HomeTabs = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: navigation.getState().index === 0,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          iconName = focused
            ? ROUTE_ICON_MAP[route.name].focused
            : ROUTE_ICON_MAP[route.name].unfocused;

          return (
            <Icon
              name={iconName as any}
              family="ionicons"
              size={size}
              color={color}
            />
          );
        },
        header: ({ route }) => {
          return <Header route={route} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
};
