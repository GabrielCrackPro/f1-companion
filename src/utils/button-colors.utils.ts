import { ViewStyle } from "react-native";

export type ButtonVariant = "primary" | "outline" | "icon" | "chip";

interface ButtonVariantColors {
  background: { light: string; dark: string };
  border: { light: string; dark: string };
  text: { light: string; dark: string };
}

export const getButtonColors = (
  variant: ButtonVariant
): ButtonVariantColors => {
  switch (variant) {
    case "primary":
      return {
        background: { light: "#F00000", dark: "#A00000" },
        border: { light: "#F00000", dark: "#A00000" },
        text: { light: "#000000", dark: "#FFFFFF" },
      };

    case "outline":
      return {
        background: { light: "#FFFFFF", dark: "#000000" },
        border: { light: "#F00000", dark: "#A00000" },
        text: { light: "#F00000", dark: "#A00000" },
      };

    case "chip":
      return {
        background: { light: "#F00000", dark: "#A00000" },
        border: { light: "#F00000", dark: "#A00000" },
        text: { light: "#000000", dark: "#FFFFFF" },
      };

    case "icon":
    default:
      return {
        background: { light: "transparent", dark: "transparent" },
        border: { light: "transparent", dark: "transparent" },
        text: { light: "#F00000", dark: "#A00000" },
      };
  }
};

export function getVariantStyle(variant: ButtonVariant): ViewStyle {
  switch (variant) {
    case "primary":
      return {
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: "center",
      };
    case "outline":
      return {
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: "center",
      };
    case "chip":
      return {
        borderRadius: 18,
        paddingHorizontal: 13,
        paddingVertical: 5,
        justifyContent: "center",
      };
    case "icon":
      return {
        borderRadius: 28,
        paddingHorizontal: 8,
        paddingVertical: 8,
        justifyContent: "center",
      };
    default:
      return {
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: "center",
      };
  }
}
