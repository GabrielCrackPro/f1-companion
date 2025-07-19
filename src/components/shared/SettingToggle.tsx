import { StyleSheet, Switch, View } from "react-native";
import { Text } from "./atoms/Text";
import { useCustomTheme } from "../../hooks";

interface SettingToggleProps {
  title: string;
  description: string;
  value: boolean;
  onPress: () => void;
}

export const SettingToggle: React.FC<SettingToggleProps> = ({
  title,
  description,
  value,
  onPress,
}) => {
  const { colors } = useCustomTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onPress}
        thumbColor="#fff"
        trackColor={{ false: colors.border, true: colors.primary }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
});
