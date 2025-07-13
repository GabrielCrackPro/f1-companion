import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useAnimatedColors } from "../../hooks/useAnimatedColors";

interface AnimatedLoadingProps {
  size?: number;
  color?: string;
  style?: any;
}

export const AnimatedLoading: React.FC<AnimatedLoadingProps> = ({
  size = 40,
  color,
  style,
}) => {
  const { colors } = useAnimatedColors();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000 }),
      -1,
      false
    );
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const spinnerColor = color || colors.primary;

  return (
    <Animated.View
      style={[styles.container, style]}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderColor: spinnerColor,
            borderTopColor: "transparent",
          },
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  spinner: {
    borderWidth: 3,
    borderRadius: 50,
  },
}); 