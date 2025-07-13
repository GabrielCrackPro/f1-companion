import React from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useAnimatedColors } from "../../../hooks/useAnimatedColors";
import { Icon } from "./Icon";
import { IconFamily } from "../../../types/icon.types";
import { AnimatedText } from "./AnimatedText";

type ButtonVariant = "primary" | "outline" | "icon" | "chip";

interface AnimatedButtonProps extends TouchableOpacityProps {
  leftIcon?: string;
  rightIcon?: string;
  iconFamily?: IconFamily;
  iconSize?: number;
  label?: string;
  disabled?: boolean;
  activeOpacity?: number;
  variant?: ButtonVariant;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onClearPress?: () => void;
  animated?: boolean;
  delay?: number;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  leftIcon,
  rightIcon,
  iconFamily = "material-icons",
  iconSize = 24,
  label,
  disabled = false,
  activeOpacity = 0.8,
  variant = "primary",
  textStyle,
  style,
  onPress,
  onClearPress,
  animated = true,
  delay = 0,
  ...props
}) => {
  const { styles, colors } = useAnimatedColors();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95);
      opacity.value = withTiming(0.8);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
    }
  };

  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      minHeight: 48,
    };

    switch (variant) {
      case "primary":
        return [
          baseStyle,
          { backgroundColor: colors.primary },
          animatedStyle,
          style,
        ];
      case "outline":
        return [
          baseStyle,
          {
            borderWidth: 1,
            borderColor: colors.primary,
            backgroundColor: "transparent",
          },
          animatedStyle,
          style,
        ];
      case "icon":
        return [
          baseStyle,
          {
            paddingHorizontal: 8,
            paddingVertical: 8,
            borderRadius: 24,
            backgroundColor: "transparent",
          },
          animatedStyle,
          style,
        ];
      case "chip":
        return [
          baseStyle,
          {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
          },
          animatedStyle,
          style,
        ];
      default:
        return [baseStyle, animatedStyle, style];
    }
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseStyle: TextStyle = {
      fontSize: 16,
      fontWeight: "600",
    };

    switch (variant) {
      case "primary":
        return [baseStyle, { color: "#FFFFFF" }, textStyle];
      case "outline":
        return [baseStyle, { color: colors.primary }, textStyle];
      case "chip":
        return [baseStyle, { color: colors.text }, textStyle];
      default:
        return [baseStyle, { color: colors.text }, textStyle];
    }
  };

  return (
    <Animated.View
      entering={animated ? FadeIn.delay(delay).duration(300) : undefined}
      exiting={animated ? FadeOut.duration(200) : undefined}
    >
      <TouchableOpacity
        style={getButtonStyle()}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={activeOpacity}
        {...props}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            family={iconFamily}
            size={iconSize}
            color={variant === "primary" ? "#FFFFFF" : colors.primary}
            style={{ marginRight: 8 }}
          />
        )}
        
        {label && (
          <AnimatedText style={getTextStyle()}>
            {label}
          </AnimatedText>
        )}
        
        {rightIcon && (
          <Icon
            name={rightIcon}
            family={iconFamily}
            size={iconSize}
            color={variant === "primary" ? "#FFFFFF" : colors.primary}
            style={{ marginLeft: 8 }}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}; 