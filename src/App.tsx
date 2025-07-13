import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { AppContent, ErrorBoundary } from "./components";
import { AnimatedThemeProvider } from "./contexts/AnimatedThemeContext";
import { configureReanimatedLogger } from "react-native-reanimated";

configureReanimatedLogger({
  strict: false,
});

export default function App() {
  return (
    <AnimatedThemeProvider>
      <ErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <AppContent />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </AnimatedThemeProvider>
  );
}
