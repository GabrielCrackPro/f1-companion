import React, { createContext, useMemo } from "react";
import { Appearance } from "react-native";
import { useStorage } from "../hooks/useStorage";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = Appearance.getColorScheme() as Theme;
  const { value: storedTheme, setValue } = useStorage<Theme>(
    "app-theme",
    colorScheme ?? "light"
  );

  const theme: Theme = storedTheme ?? "light";

  const toggleTheme = () => {
    setValue(theme === "light" ? "dark" : "light");
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
