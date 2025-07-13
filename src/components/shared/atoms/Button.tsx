import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { useCustomTheme } from "../../../hooks";
import { Icon, IconFamily } from "./Icon";
import { Text } from "./Text";

type ButtonVariant = "primary" | "outline" | "icon" | "chip";

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
  onPress?: () => void;
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
  disabled,
  activeOpacity = 0.8,
  onPress,
  onClearPress,
  ...props
}) => {
  const { colors } = useCustomTheme();

  const isChip = variant === "chip";

  const buttonBaseStyle: StyleProp<ViewStyle> = {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    opacity: disabled ? 0.5 : 1,
    justifyContent: leftIcon && rightIcon ? "space-between" : "center",
  };

  const variantStyles: Record<ButtonVariant, StyleProp<ViewStyle>> = {
    primary: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 18,
      borderWidth: 1,
    },
    outline: {
      backgroundColor: colors.background,
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: 18,
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    icon: {
      padding: 8,
    },
    chip: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: 18,
      paddingVertical: 5,
      paddingHorizontal: 13,
    },
  };

  const iconColorMap: Record<ButtonVariant, string> = {
    primary: colors.text,
    outline: colors.primary,
    icon: colors.primary,
    chip: colors.text,
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[buttonBaseStyle, variantStyles[variant], style]}
      disabled={disabled}
      {...props}
    >
      {leftIcon && (
        <Icon
          name={leftIcon}
          family={iconFamily}
          size={iconSize}
          color={iconColorMap[variant]}
        />
      )}

      {label && <Text style={textStyle}>{label}</Text>}

      {rightIcon && (
        <Icon
          name={rightIcon}
          family={iconFamily}
          size={iconSize}
          color={iconColorMap[variant]}
        />
      )}

      {isChip && (
        <TouchableOpacity activeOpacity={1} onPress={onClearPress}>
          <Icon
            name="close"
            family="material-icons"
            size={iconSize}
            color={iconColorMap[variant]}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};
