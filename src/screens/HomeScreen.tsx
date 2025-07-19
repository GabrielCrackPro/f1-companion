import { View } from "react-native";
import { Button } from "../components/shared/atoms/Button";
import { ScreenWrapper } from "../components/shared/ScreenWrapper";
import { Text } from "../components/shared/atoms/Text";
import { useNotifications } from "../hooks";

export const HomeScreen: React.FC = () => {
  const { scheduleNotification } = useNotifications();
  return (
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Home Screen</Text>
        <Button
          label="Schedule Notification"
          onPress={() => {
            scheduleNotification({
              title: "Notification Title",
              body: "Notification Body",
              data: { key: "value" },
            });
          }}
        />
      </View>
    </ScreenWrapper>
  );
};
