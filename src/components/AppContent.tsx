import { NavigationContainer } from "@react-navigation/native";
import { darkTheme, lightTheme } from "../constants";
import { useAnimatedTheme } from "../contexts/AnimatedThemeContext";
import { SeasonProvider } from "../contexts/SeasonContext";
import { useCalendar } from "../hooks/useCalendar";
import { RootStack } from "../navigators/RootStack";
import { AnimatedContainer } from "./AnimatedContainer";

export const AppContent = () => {
  useCalendar();

  const { theme } = useAnimatedTheme();

  return (
    <AnimatedContainer>
      <NavigationContainer theme={theme === "dark" ? darkTheme : lightTheme}>
        <SeasonProvider>
          <RootStack />
        </SeasonProvider>
      </NavigationContainer>
    </AnimatedContainer>
  );
};
