import { NavigationContainer } from "@react-navigation/native";
import { darkTheme } from "./constants/themes";
import { SeasonProvider } from "./contexts/SeasonContext";
import { useCalendar } from "./hooks";
import { RootStack } from "./navigators/RootStack";

export default function App() {
  // Request calendar permission
  useCalendar();

  return (
    <SeasonProvider>
      <NavigationContainer theme={darkTheme}>
        <RootStack />
      </NavigationContainer>
    </SeasonProvider>
  );
}
