import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { Header } from "../components";
import { Icon } from "../components/shared/atoms";
import { ROUTE_ICON_MAP } from "../constants/routes";
import { RacesScreen, SettingsScreen } from "../screens";
import { HomeScreen } from "../screens/HomeScreen";

const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
  const renderIcon = (
    routeName: string,
    focused: boolean,
    color: string,
    size: number
  ) => {
    const {
      focused: focusedIcon,
      unfocused,
      family,
    } = ROUTE_ICON_MAP[routeName];
    const iconName = focused ? focusedIcon : unfocused;
    return <Icon name={iconName} family={family} size={size} color={color} />;
  };

  const renderLabel = (routeName: string, focused: boolean, color: string) => {
    if (!focused) {
      return <Text style={{ color, fontSize: 10 }}>{routeName}</Text>;
    }
    return null;
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color, size }) =>
          renderIcon(route.name, focused, color, size),
        tabBarLabel: ({ focused, color }) =>
          renderLabel(route.name, focused, color),
        header: () => <Header route={route} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Races" component={RacesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
