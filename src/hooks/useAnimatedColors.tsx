import { darkTheme, lightTheme } from "../constants";
import {
  createAnimatedBackgroundStyle,
  createAnimatedColorStyle,
  useAnimatedTheme,
} from "../contexts/AnimatedThemeContext";

const colorKeys = [
  "background",
  "card",
  "text",
  "primary",
  "border",
  "notification",
] as const;

export const useAnimatedColors = () => {
  const { animatedColors, theme, toggleTheme } = useAnimatedTheme();

  const lightColors = lightTheme.colors;
  const darkColors = darkTheme.colors;

  const styles = Object.fromEntries(
    colorKeys.map((key) => [
      key,
      key === "background" || key === "card"
        ? createAnimatedBackgroundStyle(
            animatedColors[key],
            lightColors[key],
            darkColors[key]
          )
        : createAnimatedColorStyle(
            animatedColors[key],
            lightColors[key],
            darkColors[key]
          ),
    ])
  ) as Record<(typeof colorKeys)[number], any>;

  const colors = Object.fromEntries(
    colorKeys.map((key) => [
      key,
      theme === "light" ? lightColors[key] : darkColors[key],
    ])
  ) as Record<(typeof colorKeys)[number], string>;

  return {
    theme,
    toggleTheme,
    styles,
    colors,
  };
};
