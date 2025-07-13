import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { useAnimatedColors } from "../../hooks/useAnimatedColors";

type TransitionType = "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right";

interface AnimatedScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  transition?: TransitionType;
  duration?: number;
  delay?: number;
}

export const AnimatedScreen: React.FC<AnimatedScreenProps> = ({
  children,
  style,
  transition = "fade",
  duration = 300,
  delay = 0,
}) => {
  const { styles } = useAnimatedColors();

  const getEnteringAnimation = () => {
    switch (transition) {
      case "fade":
        return FadeIn.delay(delay).duration(duration);
      case "slide-up":
        return SlideInUp.delay(delay).duration(duration);
      case "slide-down":
        return SlideInRight.delay(delay).duration(duration);
      case "slide-left":
        return SlideInRight.delay(delay).duration(duration);
      case "slide-right":
        return SlideInRight.delay(delay).duration(duration);
      default:
        return FadeIn.delay(delay).duration(duration);
    }
  };

  const getExitingAnimation = () => {
    switch (transition) {
      case "fade":
        return FadeOut.duration(duration);
      case "slide-up":
        return SlideOutDown.duration(duration);
      case "slide-down":
        return SlideOutLeft.duration(duration);
      case "slide-left":
        return SlideOutLeft.duration(duration);
      case "slide-right":
        return SlideOutLeft.duration(duration);
      default:
        return FadeOut.duration(duration);
    }
  };

  return (
    <Animated.View
      style={[styles.background, screenStyle, style]}
      entering={getEnteringAnimation()}
      exiting={getExitingAnimation()}
    >
      {children}
    </Animated.View>
  );
};

const screenStyle: ViewStyle = {
  flex: 1,
}; 