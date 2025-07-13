import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Appearance } from "react-native";
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStorage } from "../hooks/useStorage";

type Theme = "light" | "dark";

interface AnimatedThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  animatedColors: {
    background: SharedValue<number>;
    card: SharedValue<number>;
    text: SharedValue<number>;
    primary: SharedValue<number>;
    border: SharedValue<number>;
    notification: SharedValue<number>;
  };
}

export const AnimatedThemeContext = createContext<
  AnimatedThemeContextType | undefined
>(undefined);

export const AnimatedThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = Appearance.getColorScheme() as Theme;
  const { value: storedTheme, setValue } = useStorage<Theme>(
    "app-theme",
    colorScheme ?? "light"
  );

  const theme: Theme = storedTheme ?? "light";

  const backgroundAnim = useSharedValue(theme === "light" ? 0 : 1);
  const cardAnim = useSharedValue(theme === "light" ? 0 : 1);
  const textAnim = useSharedValue(theme === "light" ? 0 : 1);
  const primaryAnim = useSharedValue(theme === "light" ? 0 : 1);
  const borderAnim = useSharedValue(theme === "light" ? 0 : 1);
  const notificationAnim = useSharedValue(theme === "light" ? 0 : 1);

  useEffect(() => {
    const targetValue = theme === "light" ? 0 : 1;
    const duration = 300;

    backgroundAnim.value = withTiming(targetValue, { duration });
    cardAnim.value = withTiming(targetValue, { duration });
    textAnim.value = withTiming(targetValue, { duration });
    primaryAnim.value = withTiming(targetValue, { duration });
    borderAnim.value = withTiming(targetValue, { duration });
    notificationAnim.value = withTiming(targetValue, { duration });
  }, [theme]);

  const toggleTheme = () => {
    setValue(theme === "light" ? "dark" : "light");
  };

  const animatedColors = useMemo(
    () => ({
      background: backgroundAnim,
      card: cardAnim,
      text: textAnim,
      primary: primaryAnim,
      border: borderAnim,
      notification: notificationAnim,
    }),
    []
  );

  const value = useMemo(
    () => ({ theme, toggleTheme, animatedColors }),
    [theme, animatedColors]
  );

  return (
    <AnimatedThemeContext.Provider value={value}>
      {children}
    </AnimatedThemeContext.Provider>
  );
};

export const useAnimatedTheme = () => {
  const context = useContext(AnimatedThemeContext);
  if (!context) {
    throw new Error(
      "useAnimatedTheme must be used within an AnimatedThemeProvider"
    );
  }
  return context;
};

export const createAnimatedColorStyle = (
  animatedValue: Animated.SharedValue<number>,
  lightColor: string,
  darkColor: string
) => {
  return useAnimatedStyle(() => {
    const color = interpolateColor(
      animatedValue.value,
      [0, 1],
      [lightColor, darkColor]
    );
    return { color };
  });
};

export const createAnimatedBackgroundStyle = (
  animatedValue: Animated.SharedValue<number>,
  lightColor: string,
  darkColor: string
) => {
  return useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      [lightColor, darkColor]
    );
    return { backgroundColor };
  });
};
