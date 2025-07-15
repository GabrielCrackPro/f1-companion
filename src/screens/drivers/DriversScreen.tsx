import { View } from "react-native";
import { ScreenWrapper, Text } from "../../components";

export const DriversScreen: React.FC = () => {
  return (
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>DriversScreen</Text>
      </View>
    </ScreenWrapper>
  );
};
