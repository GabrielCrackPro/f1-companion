import { NavigationContainer } from "@react-navigation/native";
import { darkTheme, lightTheme } from "../constants";
import { useAnimatedTheme } from "../contexts/AnimatedThemeContext";
import { SeasonProvider } from "../contexts/SeasonContext";
import { useCalendar } from "../hooks/useCalendar";
import { RootStack } from "../navigators/RootStack";
import { AnimatedContainer } from "./AnimatedContainer";
import { useNotifications } from "../hooks";

export const AppContent: React.FC = () => {
  useCalendar();
  useNotifications();

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
