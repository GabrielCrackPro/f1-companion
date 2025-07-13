import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import { useCustomTheme } from "../../hooks";
import { Button, Text } from "./atoms";
import { ChipList } from "./ChipList";
import { Dropdown } from "./Dropdown";

interface ListHeaderProps {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  filtersOpen: boolean;
  isFiltering: boolean;
  sortOpen: boolean;
  sortValue: string;
  sortByItems?: string[];
  enableSort?: boolean;
  countVisible: boolean;
  itemCount: number;
  appliedFilters: any[];
  onToggleFilters: () => void;
  onResetFilters?: () => void;
  onSortChange: (value: string) => void;
  onSortVisibleToggle: () => void;
  onRemoveFilter: (filterType: string) => void;
}

export const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  titleStyle,
  filtersOpen,
  isFiltering,
  sortOpen,
  sortValue,
  sortByItems,
  enableSort,
  countVisible,
  itemCount,
  appliedFilters,
  onToggleFilters,
  onResetFilters,
  onSortChange,
  onSortVisibleToggle,
  onRemoveFilter,
}) => {
  const { colors } = useCustomTheme();

  return (
    <View>
      <View style={styles.header}>
        <Text bold style={titleStyle}>
          {title}
        </Text>
        <View style={styles.headerRight}>
          {enableSort && (
            <Button
              variant="icon"
              iconFamily="material-icons"
              leftIcon={filtersOpen ? "filter-list-off" : "filter-list"}
              iconSize={22}
              onPress={onToggleFilters}
            />
          )}
          {isFiltering && (
            <Button
              variant="icon"
              iconFamily="material-icons"
              leftIcon="filter-alt-off"
              iconSize={22}
              onPress={onResetFilters}
            />
          )}
        </View>
      </View>

      {countVisible && (
        <Text
          size={18}
          bold
          italic
          style={[styles.itemCount, { color: colors.primary }]}
        >
          {itemCount} {itemCount === 1 ? "race" : "races"}
        </Text>
      )}

      {filtersOpen && enableSort && sortByItems && sortByItems.length > 0 && (
        <View style={styles.filters}>
          <Dropdown
            options={sortByItems}
            visible={sortOpen}
            value={sortValue}
            label="Sort By"
            iconFamily="material-icons"
            icon="sort"
            onValueChange={onSortChange}
            onVisibleChange={onSortVisibleToggle}
          />
          <ChipList
            items={appliedFilters}
            onChipPress={(chip) => onRemoveFilter(chip)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  filters: {
    marginVertical: 8,
    gap: 16,
  },
  itemCount: {
    marginBottom: 8,
  },
  empty: {
    padding: 16,
    alignItems: "center",
  },
});
