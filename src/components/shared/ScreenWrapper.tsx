import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface ScreenWrapperProps {
  children: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  const isFocused = useIsFocused();

  const translateY = useSharedValue(20);
  useEffect(() => {
    translateY.value = withTiming(isFocused ? 0 : 100, {
      duration: isFocused ? 400 : 250,
      easing: Easing.out(Easing.cubic),
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
