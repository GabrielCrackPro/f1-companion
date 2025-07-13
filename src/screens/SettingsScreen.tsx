import { View } from "react-native";
import { SettingToggle } from "../components";
import { useCustomTheme } from "../hooks";

export const SettingsScreen = () => {
  const { mode, toggleTheme } = useCustomTheme();
  return (
    <View>
      <SettingToggle
        title="Dark Mode"
        value={mode === "dark"}
        description="Enable dark mode"
        onPress={toggleTheme}
      />
    </View>
  );
};
