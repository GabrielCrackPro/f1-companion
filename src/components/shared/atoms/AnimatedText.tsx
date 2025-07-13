import React from "react";
import {
  Text as NativeText,
  TextProps as NativeTextProps,
  StyleProp,
  TextStyle,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useAnimatedColors } from "../../../hooks/useAnimatedColors";

interface AnimatedTextProps extends NativeTextProps {
  size?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  center?: boolean;
  style?: StyleProp<TextStyle>;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  size = 16,
  bold = false,
  italic = false,
  underline = false,
  center = false,
  style,
  children,
  ...props
}) => {
  const { styles } = useAnimatedColors();

  const textStyle: StyleProp<TextStyle> = [
    {
      fontSize: size,
      fontWeight: bold ? "bold" : "normal",
      fontStyle: italic ? "italic" : "normal",
      textDecorationLine: underline ? "underline" : "none",
      textAlign: center ? "center" : "auto",
    },
    styles.text,
    style,
  ];

  return (
    <Animated.Text
      style={textStyle}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      {...props}
    >
      {children}
    </Animated.Text>
  );
}; 