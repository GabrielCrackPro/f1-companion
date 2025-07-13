import React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useAnimatedColors } from "../hooks/useAnimatedColors";

interface AnimatedContainerProps {
  children: React.ReactNode;
  style?: any;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ 
  children, 
  style 
}) => {
  const { styles } = useAnimatedColors();

  return (
    <Animated.View
      style={[styles.background, containerStyle, style]}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      {children}
    </Animated.View>
  );
};

const containerStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
}).container; 