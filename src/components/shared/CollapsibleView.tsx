import { Animated, StyleSheet, View } from "react-native";
import { Icon, Text } from "./atoms";
import { useState } from "react";
import { TouchableWithoutFeedback } from "@gorhom/bottom-sheet";
import { useCustomTheme } from "../../hooks";

interface CollapsibleViewProps {
  title: string;
  maxHeight?: number;
  expanded?: boolean;
  children: React.ReactNode;
}

export const CollapsibleView: React.FC<CollapsibleViewProps> = ({
  title,
  children,
  maxHeight = 370,
  expanded = false,
}) => {
  const { colors } = useCustomTheme();

  const [collapsed, setCollapsed] = useState(!expanded);
  const [animation] = useState(new Animated.Value(collapsed ? 0 : 1));

  const toggleCollapse = () => {
    Animated.timing(animation, {
      toValue: collapsed ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setCollapsed((prev) => !prev);
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxHeight],
  });

  const rotateInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={toggleCollapse}>
        <View style={styles.header}>
          <Text bold style={[styles.title, { color: colors.primary }]}>
            {title}
          </Text>
          <Animated.View
            style={{ transform: [{ rotate: rotateInterpolation }] }}
          >
            <Icon
              name="chevron-right"
              family="material-community"
              size={24}
              color={colors.primary}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.content, { height: heightInterpolation }]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    overflow: "hidden",
  },
});
