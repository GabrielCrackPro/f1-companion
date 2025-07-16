import { useMemo } from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAnimatedTheme } from "../../../contexts";
import { IconFamily } from "../../../types/icon.types";
import {
  ButtonVariant,
  getButtonColors,
  getVariantStyle,
} from "../../../utils";
import { Icon } from "./Icon";
import { Text } from "./Text";

// use Animated version of TouchableOpacity
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps extends TouchableOpacityProps {
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
  onClearPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  leftIcon,
  rightIcon,
  iconFamily = "material-icons",
  iconSize = 24,
  variant = "primary",
  textStyle,
  style,
  disabled = false,
  activeOpacity = 0.8,
  onPress,
  onClearPress,
  ...props
}) => {
  const { theme, animatedColors } = useAnimatedTheme();
  const isChip = variant === "chip";

  // get dynamic colors
  const { background, border, text } = getButtonColors(variant);

  // base style for each variant (no backgroundColor here)
  const variantStyle = useMemo(() => getVariantStyle(variant), [variant]);

  const buttonBaseStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      opacity: disabled ? 0.5 : 1,
    }),
    [disabled]
  );

  // animated background and border
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = animatedColors.background
      ? interpolateColor(
          animatedColors.background.value,
          [0, 1],
          [background.light, background.dark]
        )
      : theme === "light"
      ? background.light
      : background.dark;

    const borderColor = animatedColors.border
      ? interpolateColor(
          animatedColors.border.value,
          [0, 1],
          [border.light, border.dark]
        )
      : theme === "light"
      ? border.light
      : border.dark;

    return {
      backgroundColor,
      borderColor,
      borderWidth: variant === "outline" || variant === "chip" ? 1 : 0,
    };
  }, [
    animatedColors.background?.value,
    animatedColors.border?.value,
    background.light,
    background.dark,
    border.light,
    border.dark,
    theme,
    variant,
  ]);

  // animated text color
  const animatedTextStyle = useAnimatedStyle(() => {
    const color = animatedColors.text
      ? interpolateColor(
          animatedColors.text.value,
          [0, 1],
          [text.light, text.dark]
        )
      : theme === "light"
      ? text.light
      : text.dark;
    return { color };
  }, [animatedColors.text?.value, text.light, text.dark, theme]);

  const iconColor = useMemo(() => {
    return theme === "light" ? text.light : text.dark;
  }, [theme, text]);

  return (
    <AnimatedTouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      // ✅ IMPORTANT: put plain styles first, then animated style LAST
      style={[buttonBaseStyle, variantStyle, animatedBackgroundStyle, style]}
      disabled={disabled}
      accessibilityRole="button"
      {...props}
    >
      {leftIcon && (
        <Icon
          name={leftIcon}
          family={iconFamily}
          size={iconSize}
          color={iconColor}
        />
      )}

      {label && <Text style={[textStyle, animatedTextStyle]}>{label}</Text>}

      {rightIcon && (
        <Icon
          name={rightIcon}
          family={iconFamily}
          size={iconSize}
          color={iconColor}
        />
      )}

      {isChip && onClearPress && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClearPress}
          accessibilityRole="button"
          accessibilityLabel="Clear"
          style={{ marginLeft: 8 }}
        >
          <Icon
            name="close"
            family="material-icons"
            size={iconSize}
            color={iconColor}
          />
        </TouchableOpacity>
      )}
    </AnimatedTouchableOpacity>
  );
};
