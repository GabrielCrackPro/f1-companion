import {
  Entypo,
  EvilIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedProps,
} from "react-native-reanimated";
import { darkTheme, lightTheme } from "../../../constants";
import { useAnimatedTheme } from "../../../contexts";
import { IconFamily } from "../../../types/icon.types";

interface IconProps {
  name: string;
  family: IconFamily;
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

const iconMap: Record<IconFamily, any> = {
  "font-awesome": FontAwesome,
  "font-awesome-5": FontAwesome5,
  "material-community": MaterialCommunityIcons,
  "material-icons": MaterialIcons,
  ionicons: Ionicons,
  entypo: Entypo,
  evilicons: EvilIcons,
};

export const Icon: React.FC<IconProps> = ({
  name,
  family,
  size = 24,
  color,
  style,
}) => {
  const IconComponent = iconMap[family];
  if (!IconComponent) {
    console.warn(`Icon family "${family}" is not supported.`);
    return null;
  }

  const { animatedColors } = useAnimatedTheme();

  const lightColor = color ?? lightTheme.colors.text;
  const darkColor = color ?? darkTheme.colors.text;

  const animatedProps = useAnimatedProps<any>(() => {
    const color = interpolateColor(
      animatedColors.text.value,
      [0, 1],
      [lightColor, darkColor]
    );
    return { color };
  });

  const AnimatedIcon = Animated.createAnimatedComponent(IconComponent as any);

  return (
    <AnimatedIcon
      // @ts-ignore
      name={name}
      size={size}
      style={style}
      color={color}
      animatedProps={animatedProps}
    />
  );
};
