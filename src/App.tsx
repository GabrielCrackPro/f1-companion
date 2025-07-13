import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { AppContent, ErrorBoundary } from "./components";
import { ThemeProvider } from "./contexts/ThemeContext";
import { configureReanimatedLogger } from "react-native-reanimated";

configureReanimatedLogger({
  strict: false,
});

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
