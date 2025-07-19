import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Header } from "../components/shared/Header";
import { Icon } from "../components/shared/atoms/Icon";
import { ROUTE_ICON_MAP } from "../constants/routes";
import { DriversScreen } from "../screens/drivers/DriversScreen";
import { RacesScreen } from "../screens/races/RacesScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { HomeScreen } from "../screens/HomeScreen";

const Tab = createBottomTabNavigator();

const AnimatedIcon = ({
  routeName,
  focused,
  color,
  size,
}: {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
}) => {
  const [isFocused, setIsFocused] = useState(focused);

  // when `focused` changes, trigger animation
  useEffect(() => {
    setIsFocused(focused);
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(focused ? 1.2 : 1, { duration: 200 }),
        },
        {
          translateY: withTiming(focused ? -4 : 0, { duration: 200 }),
        },
      ],
      opacity: withTiming(focused ? 1 : 0.6, { duration: 200 }),
    };
  }, [focused]);

  const { focused: focusedIcon, unfocused, family } = ROUTE_ICON_MAP[routeName];
  const iconName = focused ? focusedIcon : unfocused;

  return (
    <Animated.View style={animatedStyle}>
      <Icon name={iconName} family={family} size={size} color={color} />
    </Animated.View>
  );
};

const AnimatedLabel = ({
  routeName,
  focused,
  color,
}: {
  routeName: string;
  focused: boolean;
  color: string;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(focused ? 1 : 0, { duration: 200 }),
      transform: [
        {
          translateY: withTiming(focused ? 0 : 5, { duration: 200 }),
        },
      ],
    };
  }, [focused]);

  return (
    <Animated.Text style={[{ fontSize: 10, color }, animatedStyle]}>
      {routeName}
    </Animated.Text>
  );
};

export const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color, size }) => (
          <AnimatedIcon
            routeName={route.name}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        tabBarLabel: ({ focused, color }) => (
          <AnimatedLabel
            routeName={route.name}
            focused={focused}
            color={color}
          />
        ),
        header: () => <Header route={route} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Races" component={RacesScreen} />
      <Tab.Screen name="Drivers" component={DriversScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
