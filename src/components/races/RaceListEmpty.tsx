import { StyleSheet, View } from "react-native";
import { Icon, Text } from "../shared";
import { useTheme } from "@react-navigation/native";

export const RaceListEmpty: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Icon
        name="flag-checkered"
        family="font-awesome-5"
        size={60}
        color={colors.primary}
      />
      <Text>RaceListEmpty</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
});
