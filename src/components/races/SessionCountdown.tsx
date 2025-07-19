import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useCustomTheme } from "../../hooks";
import { Session } from "../../models";
import { formatRemainingTime, getRemainingTime } from "../../utils";
import { Text } from "../shared/atoms/Text";

interface SessionCountdownProps {
  showLabel?: boolean;
  nextSession?: Session;
}

export const SessionCountdown: React.FC<SessionCountdownProps> = ({
  showLabel = true,
  nextSession,
}) => {
  const { colors, theme } = useCustomTheme();

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
      [, month, day] = splitDate.map(Number);
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

  const scale = useSharedValue(1);
  const progress = useSharedValue(theme === "light" ? 0 : 1);

  useEffect(() => {
    progress.value = withTiming(theme === "light" ? 0 : 1, { duration: 500 });
  }, [theme, progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemainingTime(getTargetDateTime()));
      scale.value = withSequence(withSpring(1.2), withSpring(1));
    }, 1000);

    return () => clearInterval(interval);
  }, [nextSession?.date, nextSession?.time, scale]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.card, colors.card]
    );
    return {
      backgroundColor,
      borderColor: "transparent",
    };
  }, [colors.card]);

  const animatedTimeStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [colors.text, colors.text]
    );

    return {
      color,
      transform: [{ scale: scale.value }],
      fontWeight: "bold",
      fontSize: 18,
    };
  });

  if (!remaining || remaining.total <= 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.expired}>Session has started</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      {showLabel && (
        <Text style={[styles.label, { color: colors.text }]}>
          Next:{" "}
          <Text bold style={{ color: colors.primary }}>
            {nextSession?.name}
          </Text>
        </Text>
      )}
      <Animated.Text style={animatedTimeStyle}>
        {formatRemainingTime(remaining)}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  expired: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
  },
});
