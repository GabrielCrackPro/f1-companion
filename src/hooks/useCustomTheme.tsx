import { useTheme } from "@react-navigation/native";
import { useAnimatedTheme } from "../contexts/AnimatedThemeContext";
import { lightTheme, darkTheme } from "../constants";

export const useCustomTheme = () => {
  const { theme, toggleTheme, animatedColors } = useAnimatedTheme();
  
  // Try to get React Navigation theme, but provide fallback if not available
  let navigationTheme;
  try {
    navigationTheme = useTheme();
  } catch (error) {
    // If React Navigation theme is not available, use our theme constants
    navigationTheme = { colors: theme === "dark" ? darkTheme.colors : lightTheme.colors };
  }

  return {
    theme,
    colors: navigationTheme.colors,
    animatedColors,
    toggleTheme,
  };
};
