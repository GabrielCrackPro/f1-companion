import { StyleSheet, View, TouchableOpacity } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { useCustomTheme } from "../../hooks";
import { NotificationType, StoredNotification } from "../../models";
import { Text, Icon } from "../shared";
import { formatDate, formatTime } from "../../utils";

interface NotificationCardProps {
  notification: StoredNotification;
  onActionPress?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onActionPress,
}) => {
  const { colors } = useCustomTheme();

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      layout={Layout.springify()}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.primary }]}>
          {notification.title}
        </Text>
        {notification.type !== NotificationType.NOTIFICATION ? (
          <TouchableOpacity
            onPress={onActionPress}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={styles.actionButton}
          >
            <Icon
              family="material-icons"
              name="chevron-right"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {notification.body ? (
        <Text style={styles.body}>{notification.body}</Text>
      ) : null}
      <Text style={styles.body}>{formatDate(notification.date)}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    paddingRight: 8,
  },
  body: {
    fontSize: 14,
  },
  actionButton: {
    marginLeft: 8,
    padding: 4,
  },
});
