import { NavigationContainer } from "@react-navigation/native";
import { darkTheme, lightTheme } from "../constants";
import { SeasonProvider } from "../contexts/SeasonContext";
import { useCalendar, useThemeContext } from "../hooks";
import { RootStack } from "../navigators/RootStack";

export const AppContent = () => {
  useCalendar();

  const { theme } = useThemeContext();

  return (
    <NavigationContainer theme={theme === "dark" ? darkTheme : lightTheme}>
      <SeasonProvider>
        <RootStack />
      </SeasonProvider>
    </NavigationContainer>
  );
};
