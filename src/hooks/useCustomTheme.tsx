import { useTheme } from "@react-navigation/native";
import { useAnimatedTheme } from "../contexts/AnimatedThemeContext";

export const useCustomTheme = () => {
  const { theme, toggleTheme, animatedColors } = useAnimatedTheme();
  const { colors } = useTheme();

  return {
    theme,
    colors,
    animatedColors,
    toggleTheme,
  };
};
