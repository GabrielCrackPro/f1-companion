import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useAnimatedColors } from "../../hooks/useAnimatedColors";
import { AnimatedButton } from "./atoms/AnimatedButton";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colors } = useAnimatedColors();
  const rotation = useSharedValue(theme === "dark" ? 180 : 0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleToggle = () => {
    rotation.value = withSpring(rotation.value + 180);
    toggleTheme();
  };

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <AnimatedButton
        variant="icon"
        leftIcon={theme === "light" ? "dark-mode" : "light-mode"}
        iconSize={24}
        onPress={handleToggle}
        style={styles.button}
        animated={false}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
}); 