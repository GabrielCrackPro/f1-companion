import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useState } from "react";
import { Button, Icon, Text } from "./atoms";
import { Dropdown } from "./Dropdown";
import { useTheme } from "@react-navigation/native";
import { ChipList } from "./ChipList";

export type Filter = {
  type: string;
  label: string;
  value: string;
};

interface ListProps<T> {
  title?: string;
  items: T[];
  enableSort?: boolean;
  sortVisible?: boolean;
  loading?: boolean;
  error?: string;
  sortByItems?: string[];
  onSort?: (sortBy: keyof T, order: "asc" | "desc") => void;
  renderItem: (item: T) => React.ReactElement | null;
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
  onSort,
  renderItem,
  keyExtractor,
  onResetFilters,
}: ListProps<T>) => {
  const { colors } = useTheme();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(sortVisible ?? false);
  const [sortValue, setSortValue] = useState("select an option");
  const [isFiltering, setIsFiltering] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);

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
    <View style={styles.container}>
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

      {/* Header */}
      {!loading && !error && (
        <>
          <View style={styles.header}>
            <Text bold size={24}>
              {title}
            </Text>
            <View style={styles.headerRight}>
              <Button
                variant="icon"
                iconFamily="material-icons"
                icon={filtersOpen ? "filter-list-off" : "filter-list"}
                iconSize={22}
                onPress={() => setFiltersOpen((prev) => !prev)}
              />
              {isFiltering && (
                <Button
                  variant="icon"
                  iconFamily="material-icons"
                  icon="filter-alt-off"
                  iconSize={22}
                  onPress={resetFilters}
                />
              )}
            </View>
          </View>
          <Text
            size={18}
            bold
            italic
            style={[styles.itemCount, { color: colors.primary }]}
          >
            {items.length} {items.length === 1 ? "race" : "races"}
          </Text>

          {/* Filters */}
          {filtersOpen &&
            enableSort &&
            sortByItems &&
            sortByItems?.length > 0 && (
              <View style={styles.filters}>
                <Dropdown
                  options={sortByItems ?? []}
                  visible={sortOpen}
                  value={sortValue}
                  label="Sort By"
                  iconFamily="material-icons"
                  icon="sort"
                  onValueChange={handleSortChange}
                  onVisibleChange={() => setSortOpen((prev) => !prev)}
                />
                <ChipList
                  items={appliedFilters}
                  onChipPress={(chip) => removeFilter(chip)}
                />
              </View>
            )}

          {/* List */}
          <FlatList
            data={items}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={keyExtractor}
            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Text>No data</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
