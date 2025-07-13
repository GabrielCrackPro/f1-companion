import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useCustomTheme } from "../../hooks";
import { Session } from "../../models";
import { isSessionFinished } from "../../utils";
import { Icon, Text } from "../shared";
import { SessionCountdown } from "./SessionCountdown";

interface SessionItemProps {
  session: Session;
  next: Session | null;
  onPress?: (session: Session) => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  next,
  onPress,
}) => {
  const { colors } = useCustomTheme();
  const pressDisabled = ["FP1", "FP2", "FP3"].includes(session.name);

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

  const getSessionPeriod = () => {
    const start = session.time;

    if (!start) return "";

    const [hourStr, minuteStr] = start.split(":");
    const startHour = parseInt(hourStr, 10);
    const startMinute = parseInt(minuteStr, 10);

    let durationMinutes = 60;

    const nameLower = session.name.toLowerCase();

    if (nameLower.includes("race")) {
      durationMinutes = 120;
    } else if (nameLower.includes("sprint")) {
      durationMinutes = 45;
    } else if (
      nameLower.includes("fp") ||
      nameLower.includes("qualifying") ||
      nameLower.includes("practice")
    ) {
      durationMinutes = 60;
    }

    const endDate = new Date();
    endDate.setHours(startHour);
    endDate.setMinutes(startMinute + durationMinutes);

    const pad = (n: number) => n.toString().padStart(2, "0");

    const endHour = pad(endDate.getHours());
    const endMinute = pad(endDate.getMinutes());

    return `${start} - ${endHour}:${endMinute}`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => !pressDisabled && onPress?.(session)}
      disabled={pressDisabled}
      style={defaultStyle}
    >
      <View style={styles.row}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.primary }]}>
            {session.name} {session.date}
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
                {getSessionPeriod()}
              </Text>
            </View>
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
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

        {!pressDisabled && sessionFinished && (
          <Icon
            name="chevron-right"
            family="material-community"
            size={24}
            color={colors.primary}
          />
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
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
