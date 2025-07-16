import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  LayoutRectangle,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCustomTheme } from "../../hooks";
import { IconFamily } from "../../types/icon.types";
import { Icon } from "./atoms/Icon";
import { Text } from "./atoms/Text";

interface DropdownProps {
  options: string[];
  visible?: boolean;
  value: string;
  label: string;
  icon: string;
  iconFamily?: IconFamily;
  onValueChange: (value: string) => void;
  onVisibleChange?: (visible: boolean) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  visible = false,
  value,
  label,
  icon,
  iconFamily = "ionicons",
  onValueChange,
  onVisibleChange,
}) => {
  const { colors } = useCustomTheme();
  const [isOpen, setIsOpen] = useState(visible);
  const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(
    null
  );
  const buttonRef = useRef<View>(null);
  const minWidth = 220;

  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
  }, [isOpen]);

  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onVisibleChange?.(newState);
  };

  const handleSelect = (selected: string) => {
    onValueChange(selected);
    setIsOpen(false);
    onVisibleChange?.(false);
  };

  const dropdownStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        {
          scaleY: interpolate(
            progress.value,
            [0, 1],
            [0.85, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        ref={buttonRef}
        activeOpacity={0.9}
        onLayout={(e) => setButtonLayout(e.nativeEvent.layout)}
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: "#000",
          },
        ]}
        onPress={toggleDropdown}
      >
        <View style={styles.headerIcon}>
          <Icon
            name={icon}
            family={iconFamily}
            size={20}
            color={colors.primary}
          />
        </View>
        <View style={styles.labelWrapper}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.value, { color: colors.primary }]}>
            {capitalize(value)}
          </Text>
        </View>
        <Animated.View style={chevronStyle}>
          <Icon
            name="chevron-down"
            family="ionicons"
            size={20}
            color={colors.primary}
          />
        </Animated.View>
      </TouchableOpacity>

      {buttonLayout && (
        <Animated.View
          style={[
            styles.dropdown,
            dropdownStyle,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              top: buttonLayout.y + buttonLayout.height + 8,
              left: buttonLayout.x,
              width: Math.max(buttonLayout.width, minWidth),
              display: isOpen ? "flex" : "none",
              shadowColor: "#000",
            },
          ]}
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  item === value && styles.selectedOption,
                  pressed && styles.pressedOption,
                ]}
                onPress={() => handleSelect(item)}
              >
                <Icon
                  name={item === value ? "radio-button-on" : "radio-button-off"}
                  family="ionicons"
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.optionText, { color: colors.text }]}>
                  {capitalize(item)}
                </Text>
              </Pressable>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  headerIcon: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    padding: 6,
    marginRight: 8,
  },
  labelWrapper: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 12,
    elevation: 4,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  selectedOption: {
    backgroundColor: "rgba(0, 122, 255, 0.08)",
  },
  pressedOption: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  optionText: {
    fontSize: 16,
  },
});
