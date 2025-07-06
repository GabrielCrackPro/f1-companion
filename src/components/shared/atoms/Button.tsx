import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";
import { Icon, IconFamily } from "./Icon";
import { useTheme } from "@react-navigation/native";

type ButtonVariant = "primary" | "outline" | "icon";

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
}

export const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  iconFamily = "material-icons",
  iconPosition = "left",
  iconSize = 30,
  iconOnly = false,
  variant = "primary",
  textStyle,
  style,
  disabled,
  activeOpacity = 1,
  onPress,
  ...props
}) => {
  const { colors } = useTheme();

  const disabledStyles: StyleProp<ViewStyle> = {
    opacity: 0.5,
    backgroundColor: "#ccc",
  };

  const buttonStyles: StyleProp<ViewStyle> = {
    ...(disabled && disabledStyles),
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  };

  const getVariantStyles = (variant: ButtonVariant): StyleProp<ViewStyle> => {
    const variantsMap: Record<string, StyleProp<ViewStyle>> = {
      primary: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderWidth: 1,
        borderRadius: 18,
      },
      outline: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderRadius: 18,
        borderColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
      },
      icon: {
        padding: 8,
      },
    };

    return variantsMap[variant];
  };

  const getIconColor = (variant: ButtonVariant) => {
    const colorsMap: Record<string, string> = {
      primary: colors.text,
      outline: colors.primary,
      icon: colors.primary,
    };

    return colorsMap[variant];
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[buttonStyles, getVariantStyles(variant), style]}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <Icon
          name={icon}
          family={iconFamily}
          size={iconSize}
          color={getIconColor(variant)}
        />
      )}
      {!iconOnly && <Text style={textStyle}>{label}</Text>}
      {icon && iconPosition === "right" && (
        <Icon
          name={icon}
          family={iconFamily}
          size={iconSize}
          color={getIconColor(variant)}
        />
      )}
    </TouchableOpacity>
  );
};
