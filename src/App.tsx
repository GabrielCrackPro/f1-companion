import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { AnimatedThemeProvider } from "./contexts/AnimatedThemeContext";
import { configureReanimatedLogger } from "react-native-reanimated";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppContent } from "./components/AppContent";

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
