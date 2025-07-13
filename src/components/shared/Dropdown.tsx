import { useRef, useState } from "react";
import {
  FlatList,
  LayoutRectangle,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useCustomTheme } from "../../hooks";
import { Icon, IconFamily } from "./atoms/Icon";
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

  const buttonRef = useRef<View>(null);
  const minWidth = 220;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        ref={buttonRef}
        activeOpacity={0.8}
        onLayout={(e) => setButtonLayout(e.nativeEvent.layout)}
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            minWidth,
          },
        ]}
        onPress={toggleDropdown}
      >
        <Icon
          name={icon}
          family={iconFamily}
          size={20}
          color={colors.primary}
        />
        <View style={styles.labelWrapper}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.value, { color: colors.primary }]}>
            {capitalize(value)}
          </Text>
        </View>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          family="ionicons"
          size={20}
          color={colors.primary}
        />
      </TouchableOpacity>

      {isOpen && buttonLayout && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              top: buttonLayout.y + buttonLayout.height + 4,
              left: buttonLayout.x,
              width: Math.max(buttonLayout.width, minWidth),
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
                <Text style={[styles.optionText, { color: colors.primary }]}>
                  {capitalize(item)}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
};

// Helper function
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  labelWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999999,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  selectedOption: {
    backgroundColor: "#e6f7ff",
  },
  pressedOption: {
    backgroundColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 16,
  },
});
