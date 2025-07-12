import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Icon, Text } from "./atoms";
import { ListHeader } from "./ListHeader";

interface ListProps<T> {
  title?: string;
  items: T[];
  loading?: boolean;
  error?: string;
  enableSort?: boolean;
  sortByItems?: string[];
  sortVisible?: boolean;
  countVisible?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  onSort?: (key: keyof T, order: "asc" | "desc") => void;
  renderItem: (item: T) => React.ReactElement;
  renderEmpty?: () => React.ReactElement;
  keyExtractor: (item: T) => string;
  onResetFilters?: () => void;
}

export const List = <T,>({
  title,
  items,
  loading,
  error,
  enableSort,
  sortByItems,
  sortVisible,
  countVisible = true,
  titleStyle,
  containerStyle,
  style,
  onSort,
  renderItem,
  renderEmpty,
  keyExtractor,
  onResetFilters,
}: ListProps<T>) => {
  const { colors } = useTheme();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(sortVisible ?? false);
  const [sortValue, setSortValue] = useState("select an option");
  const [isFiltering, setIsFiltering] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any[]>([]);

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setIsFiltering(true);

    if (onSort && sortByItems?.includes(value)) {
      onSort(value as keyof T, "asc");
    }

    setAppliedFilters((prev) => {
      const otherFilters = prev.filter((f) => f.type !== "sort");
      return [
        ...otherFilters,
        {
          type: "sort",
          label: value,
          value,
        },
      ];
    });
  };

  const removeFilter = (filterType: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.type !== filterType));
    resetFilters();
  };

  const resetFilters = () => {
    setFiltersOpen(false);
    setIsFiltering(false);
    onResetFilters?.();
    setAppliedFilters([]);
  };

  return (
    <View style={containerStyle}>
      {/* Loading */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text>Loading...</Text>
        </View>
      )}

      {/* Error */}
      {!loading && error && (
        <View style={styles.errorContainer}>
          <Icon name="error" family="material-icons" size={24} color="red" />
          <Text>Error: {error}</Text>
        </View>
      )}

      {/* List */}
      {!loading && !error && (
        <FlatList
          data={items}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={keyExtractor}
          style={style}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={false}
          StickyHeaderComponent={() => (
            <ListHeader
              title={title}
              titleStyle={titleStyle}
              filtersOpen={filtersOpen}
              isFiltering={isFiltering}
              sortOpen={sortOpen}
              sortValue={sortValue}
              countVisible={items.length > 0 && countVisible}
              itemCount={items.length}
              sortByItems={sortByItems}
              enableSort={items.length > 0 && enableSort}
              appliedFilters={appliedFilters}
              onToggleFilters={() => setFiltersOpen((prev) => !prev)}
              onResetFilters={resetFilters}
              onSortChange={handleSortChange}
              onSortVisibleToggle={() => setSortOpen((prev) => !prev)}
              onRemoveFilter={removeFilter}
            />
          )}
          ListEmptyComponent={renderEmpty ?? DefaultEmptyComponent}
        />
      )}
    </View>
  );
};

const DefaultEmptyComponent: React.FC = () => (
  <View style={styles.empty}>
    <Text>No data</Text>
  </View>
);

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
