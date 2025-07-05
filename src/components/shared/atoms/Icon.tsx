import {
  Entypo,
  EvilIcons,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import React from "react";

export type IconFamily =
  | "font-awesome"
  | "font-awesome-5"
  | "material-community"
  | "material-icons"
  | "ionicons"
  | "entypo"
  | "evilicons";

interface IconProps {
  name: string;
  family: IconFamily;
  size?: number;
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
  size = 24,
  color = "black",
  family,
}) => {
  const IconComponent = iconMap[family];

  if (!IconComponent) {
    console.warn(`Icon family "${family}" is not supported.`);
    return null;
  }

  return <IconComponent name={name} size={size} color={color} />;
};
