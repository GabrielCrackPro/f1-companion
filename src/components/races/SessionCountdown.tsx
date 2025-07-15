import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useCustomTheme } from "../../hooks";
import { Session } from "../../models";
import { formatRemainingTime, getRemainingTime } from "../../utils";
import { Text } from "../shared";

interface SessionCountdownProps {
  showLabel?: boolean;
  nextSession?: Session;
}

export const SessionCountdown: React.FC<SessionCountdownProps> = ({
  showLabel = true,
  nextSession,
}) => {
  const { colors } = useCustomTheme();

  const getTargetDateTime = () => {
    if (!nextSession?.date || !nextSession?.time) return null;

    const now = new Date();
    const year = now.getFullYear();

    const splitDate = nextSession.date.includes("/")
      ? nextSession.date.split("/")
      : nextSession.date.split("-");

    let month: number, day: number;

    if (splitDate.length === 2) {
      [month, day] = splitDate.map(Number);
    } else if (splitDate.length === 3) {
      [, month, day] = splitDate.map(Number); // ignoramos el año
    } else {
      return null;
    }

    const [hour, minute] = nextSession.time.split(":").map(Number);

    if ([month, day, hour, minute].some(Number.isNaN)) return null;

    return new Date(year, month - 1, day, hour, minute);
  };

  const [remaining, setRemaining] = useState(() =>
    getRemainingTime(getTargetDateTime())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemainingTime(getTargetDateTime()));
    }, 1000);

    return () => clearInterval(interval);
  }, [nextSession?.date, nextSession?.time]);

  if (!remaining || remaining.total <= 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.expired}>Session has started</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {showLabel && (
        <Text style={styles.label}>
          Next:{" "}
          <Text bold style={{ color: colors.primary }}>
            {nextSession?.name}
          </Text>
        </Text>
      )}
      <Text style={styles.time}>{formatRemainingTime(remaining)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  time: {
    fontSize: 18,
    fontWeight: "bold",
  },
  expired: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
  },
});
