import { useTheme as useRNTheme } from "@react-navigation/native";
import { useThemeContext } from "./useThemeContext";

export const useCustomTheme = () => {
  const { theme, toggleTheme } = useThemeContext();
  const nativeTheme = useRNTheme();

  return {
    mode: theme,
    colors: nativeTheme.colors,
    toggleTheme,
  };
};
