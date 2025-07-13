import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  SlideInUp,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useAnimatedColors } from "../../hooks/useAnimatedColors";

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  animated?: boolean;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  onPress,
  animated = true,
  delay = 0,
}) => {
  const { styles } = useAnimatedColors();
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98);
      shadowOpacity.value = withTiming(0.2);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
      shadowOpacity.value = withTiming(0.1);
    }
  };

  const cardContent = (
    <Animated.View
      style={[styles.card, cardStyle, animatedStyle, style]}
      entering={animated ? SlideInUp.delay(delay).duration(400) : undefined}
      exiting={animated ? SlideOutDown.duration(300) : undefined}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const cardStyle: ViewStyle = {
  borderRadius: 12,
  padding: 16,
  marginVertical: 8,
  marginHorizontal: 16,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowRadius: 8,
  elevation: 4,
};
