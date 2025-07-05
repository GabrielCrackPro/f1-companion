import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";
import { Icon, IconFamily } from "./Icon";

interface ButtonProps extends TouchableOpacityProps {
  icon?: string;
  iconPosition?: "left" | "right";
  iconFamily?: IconFamily;
  iconSize?: number;
  iconColor?: string;
  iconOnly?: boolean;
  label?: string;
  disabled?: boolean;
  activeOpacity?: number;
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
  iconColor = "#000",
  iconOnly = false,
  textStyle,
  style,
  disabled,
  activeOpacity = 1,
  onPress,
  ...props
}) => {
  const disabledStyles: StyleProp<ViewStyle> = {
    opacity: 0.5,
    backgroundColor: "#ccc",
  };

  const buttonStyles: StyleProp<ViewStyle> = {
    ...(disabled && disabledStyles),
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[buttonStyles, style]}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <Icon
          name={icon}
          family={iconFamily}
          size={iconSize}
          color={iconColor}
        />
      )}
      {!iconOnly && <Text style={textStyle}>{label}</Text>}
      {icon && iconPosition === "right" && (
        <Icon
          name={icon}
          family={iconFamily}
          size={iconSize}
          color={iconColor}
        />
      )}
    </TouchableOpacity>
  );
};
