import React from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import { Icon, Text } from "../shared";
import { Race } from "../../models";
import { SessionCountdown } from "./SessionCountdown";
import { formatDate, formatTime } from "../../utils";

interface RaceItemProps {
  race: Race | null;
  onPress?: () => void;
  isNextRace?: boolean;
}

const isRaceFinished = (race: Race | null) =>
  race ? new Date(race.date).getTime() < Date.now() : false;

const isRaceToday = (race: Race | null) => {
  if (!race) return false;
  const date = new Date(race.date);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const getNextSession = (race: Race | null) => {
  if (!race) return null;

  const sessionKeys: [keyof Race, string][] = [
    ["FirstPractice", "FP1"],
    ["SecondPractice", "FP2"],
    ["ThirdPractice", "FP3"],
    ["SprintQualifying", "SQ"],
    ["Sprint", "Sprint"],
    ["Qualifying", "Qualifying"],
    ["date", "Race"], // fallback
  ];

  for (const [key, label] of sessionKeys) {
    const session = race[key] as { date: string; time: string } | undefined;
    if (!session?.date || !session?.time) continue;

    const sessionTime = new Date(`${session.date}T${session.time}`);
    if (sessionTime.getTime() > Date.now()) {
      return {
        name: label,
        dateTime: `${session.date}T${session.time}`,
      };
    }
  }

  return null;
};

export const RaceItem: React.FC<RaceItemProps> = ({
  race,
  onPress,
  isNextRace = false,
}) => {
  const { colors } = useTheme();
  const finished = isRaceFinished(race);
  const today = isRaceToday(race);

  const containerStyle: StyleProp<ViewStyle> = {
    ...styles.container,
    backgroundColor: finished ? colors.border : colors.card,
    borderWidth: today || finished || isNextRace ? 2 : 0,
    borderStyle: today || finished ? "solid" : isNextRace ? "dashed" : "solid",
    borderColor: today
      ? colors.primary
      : finished
      ? colors.border
      : isNextRace
      ? colors.primary
      : "transparent",
  };

  const nextSession = isNextRace ? getNextSession(race) : null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={containerStyle}
    >
      {finished && (
        <View style={styles.iconContainer}>
          <Icon
            name="flag-checkered"
            family="font-awesome-5"
            size={24}
            color={colors.text}
          />
        </View>
      )}
      {today && !finished && (
        <View style={styles.iconContainer}>
          <Icon
            name="calendar"
            family="ionicons"
            size={24}
            color={colors.text}
          />
        </View>
      )}
      {isNextRace && (
        <View style={[styles.iconContainer, { margin: 0 }]}>
          <Icon
            name="timer-outline"
            family="material-community"
            size={24}
            color={colors.text}
          />
        </View>
      )}
      <View style={styles.textContainer}>
        <Text bold size={14} style={{ marginBottom: 4, color: colors.primary }}>
          {`Round ${race?.round} - ${formatDate(race?.date || "")}`}
        </Text>
        <Text style={styles.name}>{race?.raceName}</Text>
        <Text style={styles.time}>
          Race time: {formatTime(race?.time || "")}
        </Text>

        {isNextRace && nextSession && (
          <SessionCountdown nextSession={nextSession} />
        )}
      </View>

      <Icon
        name="chevron-forward"
        family="ionicons"
        size={24}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  iconContainer: {
    marginRight: 8,
    gap: 8,
  },
  name: {
    fontSize: 16,
    marginBottom: 2,
  },
  time: {
    fontSize: 13,
    color: "#888",
  },
});
