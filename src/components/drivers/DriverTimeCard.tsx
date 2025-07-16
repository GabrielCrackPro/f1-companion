import React from "react";
import { StyleSheet, View } from "react-native";
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useCustomTheme } from "../../hooks";
import { Driver, LapTiming } from "../../models";
import { AnimatedCard, Button, Text } from "../shared";

interface DriverTimeCardProps {
  driver: Driver;
  timing: LapTiming;
  onPress: (driverId: string) => void;
}

export const DriverTimeCard: React.FC<DriverTimeCardProps> = ({
  timing,
  driver,
  onPress,
}) => {
  const { colors } = useCustomTheme();

  const pos = Number(timing.position);
  const posValue = useSharedValue(pos);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      borderWidth: 2,
      borderColor: interpolateColor(
        posValue.value,
        [1, 2, 3],
        [colors.primary, colors.card, colors.card]
      ),
    };
  });

  const animatedPositionStyle = useAnimatedStyle(() => {
    posValue.value = pos;
    return {
      color: interpolateColor(
        posValue.value,
        [1, 2, 3],
        [colors.primary, colors.text, colors.text]
      ),
    };
  });

  const animatedTimeStyle = useAnimatedStyle(() => {
    posValue.value = pos;
    return {
      color: interpolateColor(
        posValue.value,
        [1, 2, 3],
        ["#9836a9ff", colors.text, colors.text]
      ),
    };
  });

  return (
    <AnimatedCard style={[styles.card, animatedContainerStyle]}>
      <View style={styles.positionContainer}>
        <Text style={[styles.positionText, animatedPositionStyle]}>
          {timing.position}
        </Text>
      </View>

      <View style={styles.driverContainer}>
        <Text style={styles.driverName} numberOfLines={1}>
          {driver.givenName} {driver.familyName}
        </Text>
        <Text
          bold
          style={[
            styles.driverId,
            { color: driver.constructor ? driver.constructor?.color : "" },
          ]}
        >
          {driver.constructor ? driver.constructor.name : "-"}
        </Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, animatedTimeStyle]}>{timing.time}</Text>
        <Button
          variant="icon"
          iconFamily="ionicons"
          leftIcon="chevron-forward"
          onPress={() => onPress(timing.driverId)}
        />
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  positionContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  positionText: {
    fontSize: 18,
    fontWeight: "700",
  },
  driverContainer: {
    flex: 1,
    justifyContent: "center",
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  driverId: {
    fontSize: 12,
    opacity: 0.6,
  },
  timeContainer: {
    marginLeft: 12,
    alignItems: "center",
    flexDirection: "row",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DriverTimeCard;
