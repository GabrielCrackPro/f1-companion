import { View } from "react-native";
import { SettingToggle } from "../components";
import { useCustomTheme } from "../hooks";

export const SettingsScreen = () => {
  const { theme, toggleTheme } = useCustomTheme();
  return (
    <View>
      <SettingToggle
        title="Dark Mode"
        value={theme === "dark"}
        description="Enable dark mode"
        onPress={toggleTheme}
      />
    </View>
  );
};
