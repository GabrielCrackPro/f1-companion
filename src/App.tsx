import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import { darkTheme } from "./constants/themes";
import { SeasonProvider } from "./contexts/SeasonContext";
import { useCalendar } from "./hooks";
import { RootStack } from "./navigators/RootStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function App() {
  useCalendar();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer theme={darkTheme}>
          <SeasonProvider>
            <RootStack />
          </SeasonProvider>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
