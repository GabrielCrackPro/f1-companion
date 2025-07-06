import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";
import { Icon, IconFamily } from "./Icon";
import { useTheme } from "@react-navigation/native";

type ButtonVariant = "primary" | "outline" | "icon" | "chip";

interface ButtonProps extends TouchableOpacityProps {
  icon?: string;
  iconPosition?: "left" | "right";
  iconFamily?: IconFamily;
  iconSize?: number;
  iconOnly?: boolean;
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
  icon,
  iconFamily = "material-icons",
  iconPosition = "left",
  iconSize = 24,
  iconOnly = false,
  variant = "primary",
  textStyle,
  style,
  disabled,
  activeOpacity = 0.8,
  onPress,
  onClearPress,
  ...props
}) => {
  const { colors } = useTheme();

  const isChip = variant === "chip";

  const buttonBaseStyle: StyleProp<ViewStyle> = {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    opacity: disabled ? 0.5 : 1,
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
      {icon && iconPosition === "left" && (
        <Icon
          name={icon}
          family={iconFamily}
          size={iconSize}
          color={iconColorMap[variant]}
        />
      )}

      {!iconOnly && label && <Text style={textStyle}>{label}</Text>}

      {icon && iconPosition === "right" && (
        <Icon
          name={icon}
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
