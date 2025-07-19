import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useCustomTheme } from "../../hooks";
import { Icon } from "../shared/atoms/Icon";
import { Text } from "../shared/atoms/Text";

interface SeasonItemProps {
  season: number;
  selected: boolean;
  current?: boolean;
  onSelect: (season: number) => void;
}

export const SeasonItem: React.FC<SeasonItemProps> = ({
  season,
  selected,
  current = false,
  onSelect,
}) => {
  const { colors } = useCustomTheme();

  const handleSelect = () => onSelect(season);

  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: selected
            ? colors.primary
            : current
            ? colors.border
            : "transparent",
        },
      ]}
      onPress={handleSelect}
    >
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            name={current ? "flag-checkered" : "calendar"}
            family={current ? "font-awesome-5" : "material-community"}
            size={18}
            color={colors.text}
            style={{ marginRight: 8 }}
          />
          <Text
            size={16}
            style={{
              color: colors.text,
            }}
          >
            {current ? `In Progress (${season})` : season}
          </Text>
        </View>
        {!selected && !current && (
          <Icon
            name="chevron-right"
            family="material-community"
            size={24}
            color={colors.text}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
