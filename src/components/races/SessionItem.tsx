import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Session } from "../../models";
import { isSessionFinished } from "../../utils";
import { Icon, Text } from "../shared";
import { SessionCountdown } from "./SessionCountdown";

interface SessionItemProps {
  session: Session;
  next: Session | null;
  onPress?: () => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  next,
  onPress,
}) => {
  const { colors } = useTheme();

  const [sessionFinished] = useState(
    isSessionFinished(session.date, session.time)
  );

  const defaultStyle: StyleProp<ViewStyle> = {
    ...styles.card,
    backgroundColor: colors.card,
    borderColor:
      !sessionFinished && next?.name === session.name
        ? colors.primary
        : colors.border,
    borderWidth: !sessionFinished && next?.name === session.name ? 2 : 0,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={defaultStyle}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.primary }]}>
          {session.name}
        </Text>
        {session.date && !sessionFinished ? (
          <View style={{ alignItems: "center", gap: 8 }}>
            {next?.name === session.name && (
              <SessionCountdown
                showLabel={false}
                nextSession={session as Session}
              />
            )}
            <Text style={[styles.subtitle, { color: colors.text }]}>
              {session.date} {session.time && `• ${session.time}`}
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon
              name="flag-checkered"
              family="font-awesome-5"
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Finished
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  content: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
});
