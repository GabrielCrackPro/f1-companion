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
