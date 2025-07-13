import React from "react";
import {
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { useAnimatedColors } from "../../hooks/useAnimatedColors";

interface AnimatedListItemProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  animated?: boolean;
  delay?: number;
  index?: number;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  style,
  onPress,
  animated = true,
  delay = 0,
  index = 0,
  ...props
}) => {
  const { styles } = useAnimatedColors();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98);
      opacity.value = withTiming(0.8);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
    }
  };

  const itemContent = (
    <Animated.View
      style={[
        styles.card,
        itemStyle,
        animatedStyle,
        style,
      ]}
      entering={
        animated
          ? SlideInRight.delay(delay + index * 50).duration(400)
          : undefined
      }
      exiting={animated ? SlideOutLeft.duration(300) : undefined}
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
        {...props}
      >
        {itemContent}
      </TouchableOpacity>
    );
  }

  return itemContent;
};

const itemStyle: ViewStyle = {
  borderRadius: 8,
  padding: 12,
  marginVertical: 4,
  marginHorizontal: 16,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowRadius: 4,
  elevation: 2,
}; 