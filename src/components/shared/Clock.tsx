import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useCustomTheme, useTime } from "../../hooks";
import { Text } from "./atoms";

interface ClockProps {
  lat: number;
  long: number;
}

export const Clock: React.FC<ClockProps> = ({ lat, long }) => {
  const { colors } = useCustomTheme();
  const { getTrackTime, isLoading: isTrackLoading, error } = useTime();

  const [localTime, setLocalTime] = useState<string>("");
  const [trackTime, setTrackTime] = useState<string>("");
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const formatTime = (date: Date | string) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    const updateLocal = () => {
      setLocalTime(formatTime(new Date()));
      setIsLocalLoading(false);
    };

    updateLocal();
    const interval = setInterval(updateLocal, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTrackTime = async () => {
      if (lat && long) {
        const time = await getTrackTime(lat, long);
        if (time) {
          setTrackTime(formatTime(time));
        }
      }
    };

    fetchTrackTime();
    const interval = setInterval(fetchTrackTime, trackTime ? 60000 : 2000);
    return () => clearInterval(interval);
  }, [lat, long, getTrackTime]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Local Time */}
      <View style={styles.timeRow}>
        <Text style={styles.label}>Local:</Text>
        {isLocalLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={styles.time}>{localTime}</Text>
        )}
      </View>

      {/* Track Time */}
      <View style={styles.timeRow}>
        <Text style={styles.label}>Track:</Text>
        {isTrackLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={styles.time}>{trackTime || "-"}</Text>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text style={{ color: colors.notification, marginTop: 4 }}>
          Track time unavailable: {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
  },
  time: {
    fontSize: 16,
    fontVariant: ["tabular-nums"],
  },
});
