import { View } from "react-native";
import { ScreenWrapper, SettingToggle } from "../components";
import { useCustomTheme } from "../hooks";
import { useAnimatedTheme } from "../contexts";

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useAnimatedTheme();
  return (
    <ScreenWrapper>
      <View>
        <SettingToggle
          title="Dark Mode"
          value={theme === "dark"}
          description="Enable dark mode"
          onPress={toggleTheme}
        />
      </View>
    </ScreenWrapper>
  );
};
