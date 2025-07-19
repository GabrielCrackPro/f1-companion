import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useCustomTheme, useSeasonContext } from "../../hooks";
import { Race, RaceNavigationProp } from "../../models";
import {
  formatDate,
  formatTime,
  getNextSession,
  isRaceFinished,
  isRaceToday,
} from "../../utils";
import { Icon } from "../shared/atoms/Icon";
import { Text } from "../shared/atoms/Text";
import { SessionCountdown } from "./SessionCountdown";
import { circuitData } from "../../../assets/circuits/data";
import { Image } from "expo-image";

interface RaceItemProps {
  race: Race | null;
  isNextRace?: boolean;
}

export const RaceItem: React.FC<RaceItemProps> = ({
  race,
  isNextRace = false,
}) => {
  const { colors } = useCustomTheme();
  const finished = isRaceFinished(race);
  const today = isRaceToday(race);

  const { season } = useSeasonContext();
  const { navigate } = useNavigation<RaceNavigationProp>();

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

  const goToRace = () => {
    if (race) {
      navigate("Race", {
        season,
        round: race.round,
        name: race.raceName,
        circuit: race.Circuit,
        laps: circuitData.find((c) => c.id === race.Circuit.circuitId)?.laps,
        finished,
        today,
      });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={goToRace}
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
