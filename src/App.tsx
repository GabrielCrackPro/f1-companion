import { NavigationContainer } from "@react-navigation/native";
import { darkTheme } from "./constants/themes";
import { RootStack } from "./navigators/RootStack";

export default function App() {
  return (
    <NavigationContainer theme={darkTheme}>
      <RootStack />
    </NavigationContainer>
  );
}
