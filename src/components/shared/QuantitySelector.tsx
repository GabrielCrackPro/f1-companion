import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import AnimatedReanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { darkTheme, lightTheme } from "../../constants";
import { useAnimatedTheme } from "../../contexts";
import { Button } from "./atoms/Button";
import { Text } from "./atoms/Text";

interface QuantitySelectorProps {
  value: number;
  max: number;
  min?: number;
  label?: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onMin?: () => void;
  onMax?: () => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  max,
  min = 1,
  label,
  onIncrement,
  onDecrement,
  onMin,
  onMax,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { animatedColors } = useAnimatedTheme();

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      animatedColors.card.value,
      [0, 1],
      [lightTheme.colors.card, darkTheme.colors.card]
    );
    return {
      backgroundColor: bg,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    };
  });

  useEffect(() => {
    scaleAnim.setValue(0.7);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [value]);

  const isDecrementDisabled = value === min;
  const isIncrementDisabled = value === max;
  const quantityText = `${value} of ${max}${label ? ` ${label}` : ""}`;

  return (
    <AnimatedReanimated.View style={animatedBackgroundStyle}>
      <Button
        variant="icon"
        iconFamily="font-awesome"
        leftIcon="angle-double-left"
        onPress={onMin}
        disabled={value === min}
        style={[styles.smallButton, value === min && styles.buttonDisabled]}
      />
      <Button
        variant="icon"
        iconFamily="ionicons"
        leftIcon="chevron-back"
        disabled={isDecrementDisabled}
        onPress={onDecrement}
        style={[
          styles.smallButton,
          isDecrementDisabled && styles.buttonDisabled,
        ]}
      />

      <Animated.View
        style={[styles.valueContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.valueText}>{quantityText}</Text>
      </Animated.View>

      <Button
        variant="icon"
        iconFamily="ionicons"
        rightIcon="chevron-forward"
        disabled={isIncrementDisabled}
        onPress={onIncrement}
        style={[
          styles.smallButton,
          isIncrementDisabled && styles.buttonDisabled,
        ]}
      />
      <Button
        variant="icon"
        iconFamily="font-awesome"
        rightIcon="angle-double-right"
        onPress={onMax}
        disabled={value === max}
        style={[styles.smallButton, value === max && styles.buttonDisabled]}
      />
    </AnimatedReanimated.View>
  );
};

const styles = StyleSheet.create({
  smallButton: {
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  valueContainer: {
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  valueText: {
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.3,
  },
});
