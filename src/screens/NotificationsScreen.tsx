import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { interpolateColor, useAnimatedStyle } from "react-native-reanimated";
import { Button } from "../components/shared/atoms/Button";
import { List } from "../components/shared/List";
import { NotificationCard } from "../components/notifications/NotificationCard";
import { darkTheme, lightTheme } from "../constants";
import { useAnimatedTheme } from "../contexts";
import { useNotifications } from "../hooks";
import { StoredNotification } from "../models";

export const NotificationsScreen: React.FC = () => {
  const { getUnreadNotifications, clearNotifications } = useNotifications();
  const { animatedColors } = useAnimatedTheme();
  const [unread, setUnread] = useState<StoredNotification[]>([]);

  const fetchUnread = useCallback(async () => {
    const notifications = await getUnreadNotifications();
    setUnread(notifications);
  }, [getUnreadNotifications]);

  useEffect(() => {
    fetchUnread();
  }, [fetchUnread]);

  const handleClear = async () => {
    await clearNotifications();
    setUnread([]);
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      animatedColors.card.value,
      [0, 1],
      [lightTheme.colors.card, darkTheme.colors.card]
    );
    return {
      backgroundColor: bg,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button label="Clear All" onPress={handleClear} />
      </View>
      <List
        items={unread}
        countVisible={false}
        keyExtractor={(item) => item.id}
        renderItem={(item) => (
          <NotificationCard notification={item} onActionPress={fetchUnread} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "600",
  },
});
