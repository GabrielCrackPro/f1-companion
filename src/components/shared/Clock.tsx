import { useCallback, useEffect, useState, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useCustomTheme } from "../../hooks/useCustomTheme";
import { useTime } from "../../hooks/useTime";
import { Text } from "./atoms/Text";

interface ClockProps {
  lat?: number;
  long?: number;
}

export const Clock: React.FC<ClockProps> = ({ lat, long }) => {
  const { colors } = useCustomTheme();
  const { getTrackTime, isLoading: isTrackLoading, error } = useTime();

  const [localTime, setLocalTime] = useState<string>("");
  const [trackTime, setTrackTime] = useState<string>("");
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const formatTime = useCallback((date: Date | string) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }), []);

  // Memoize the coordinates to prevent unnecessary API calls
  const coordinates = useMemo(() => ({ lat, long }), [lat, long]);

  useEffect(() => {
    let isMounted = true;

    const updateLocal = () => {
      if (isMounted) {
        setLocalTime(formatTime(new Date()));
        setIsLocalLoading(false);
      }
    };

    updateLocal();
    const interval = setInterval(updateLocal, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [formatTime]);

  useEffect(() => {
    let isMounted = true;
    let trackInterval: NodeJS.Timeout | null = null;

    const fetchTrackTime = async () => {
      if (lat && long && isMounted) {
        const time = await getTrackTime(lat, long);
        if (time && isMounted) {
          setTrackTime(formatTime(time));
        }
      }
    };

    fetchTrackTime();
    
    // Set up interval for track time updates
    trackInterval = setInterval(fetchTrackTime, trackTime ? 60000 : 2000);

    return () => {
      isMounted = false;
      if (trackInterval) {
        clearInterval(trackInterval);
      }
    };
  }, [lat, long, getTrackTime, formatTime, trackTime]);

  const containerStyle = useMemo(() => [
    styles.container, 
    { backgroundColor: colors.card }
  ], [colors.card]);

  const timeRowStyle = useMemo(() => styles.timeRow, []);
  const labelStyle = useMemo(() => styles.label, []);
  const timeStyle = useMemo(() => styles.time, []);

  return (
    <View style={containerStyle}>
      {/* Local Time */}
      <View style={timeRowStyle}>
        <Text style={labelStyle}>Local:</Text>
        {isLocalLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={timeStyle}>{localTime}</Text>
        )}
      </View>

      {/* Track Time */}
      <View style={timeRowStyle}>
        <Text style={labelStyle}>Track:</Text>
        {isTrackLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={timeStyle}>{trackTime || "-"}</Text>
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
    padding: 16,
    borderRadius: 8,
    margin: 8,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  time: {
    fontSize: 14,
    fontFamily: "monospace",
  },
});
