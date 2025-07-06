import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { formatDate } from "../../utils";
import { Text } from "../shared";

interface SessionCountdownProps {
  nextSession?: {
    name: string;
    dateTime: string;
  };
}

export const SessionCountdown: React.FC<SessionCountdownProps> = ({
  nextSession,
}) => {
  const { colors } = useTheme();

  const [remaining, setRemaining] = useState(
    getRemainingTime(nextSession?.dateTime || "")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemainingTime(nextSession?.dateTime || ""));
    }, 1000);

    return () => clearInterval(interval);
  }, [nextSession?.dateTime]);

  if (remaining.total <= 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.expired}>Session has started</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Next:{" "}
        <Text bold style={{ color: colors.primary }}>
          {nextSession?.name}
        </Text>{" "}
        {formatDate(nextSession?.dateTime || "")}
      </Text>
      <Text style={styles.time}>
        {`${remaining.days}:${remaining.hours}:${remaining.minutes}:${remaining.seconds}`}
      </Text>
    </View>
  );
};

const getRemainingTime = (target: string) => {
  const total = new Date(target).getTime() - new Date().getTime();

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
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
