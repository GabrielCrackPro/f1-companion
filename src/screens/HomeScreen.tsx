import { View } from "react-native";
import { Button, ScreenWrapper, Text } from "../components";
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
