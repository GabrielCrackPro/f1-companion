import {
  Text as NativeText,
  TextProps as NativeTextProps,
  StyleProp,
  TextStyle,
} from "react-native";

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
  const defaultStyle: StyleProp<TextStyle> = {
    fontSize: 16,
    color: "#fff",
  };

  const textStyle: StyleProp<TextStyle> = {
    ...defaultStyle,
    fontSize: size ? size : defaultStyle.fontSize,
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecorationLine: underline ? "underline" : "none",
    textAlign: center ? "center" : "left",
  };

  return <NativeText style={[textStyle, style]} {...props} />;
};
