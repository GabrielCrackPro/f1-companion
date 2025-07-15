import {
  TextProps as NativeTextProps,
  StyleProp,
  TextStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { createAnimatedColorStyle, useAnimatedTheme } from "../../../contexts";

interface TextProps extends NativeTextProps {
  size?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  center?: boolean;
  style?: StyleProp<TextStyle>;
}

export const Text: React.FC<TextProps> = ({
  size,
  bold,
  italic,
  underline,
  center,
  style,
  ...props
}) => {
  const { animatedColors } = useAnimatedTheme();
  const animatedTextStyle = createAnimatedColorStyle(animatedColors.text);

  const staticTextStyle: StyleProp<TextStyle> = {
    fontSize: size ?? 16,
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecorationLine: underline ? "underline" : "none",
    textAlign: center ? "center" : "left",
  };

  return (
    <Animated.Text
      style={[staticTextStyle, animatedTextStyle, style]}
      {...props}
    />
  );
};
