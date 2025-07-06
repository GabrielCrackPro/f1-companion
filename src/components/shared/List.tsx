import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Button, Icon, Text } from "./atoms";
import { Dropdown } from "./Dropdown";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { IconFamily } from "./atoms/Icon";

interface ListProps<T> {
  title: string;
  items: T[];
  enableSort?: boolean;
  enableSecondaryAction?: boolean;
  secondaryActionLabel?: string;
  secondaryActionIcon?: string;
  secondaryAction?: string;
  secondaryActionIconFamily?: IconFamily;
  sortVisible?: boolean;
  loading?: boolean;
  error?: string;
  sortByItems?: string[];
  onSort?: (sortBy: keyof T, order: "asc" | "desc") => void;
  renderItem: (item: T) => React.ReactElement | null;
  keyExtractor: (item: T) => string;
  onSecondaryAction?: (action?: string) => void;
}

export const List = <T,>({
  title,
  items,
  loading,
  error,
  enableSort,
  enableSecondaryAction,
  secondaryActionLabel,
  secondaryActionIcon,
  secondaryActionIconFamily,
  secondaryAction,
  sortByItems,
  sortVisible,
  onSort,
  renderItem,
  keyExtractor,
  onSecondaryAction,
}: ListProps<T>) => {
  const { colors } = useTheme();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(sortVisible ?? false);
  const [sortValue, setSortValue] = useState("select an option");

  return (
    <View>
      {loading && (
        <View style={{ padding: 16 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      )}

      {error && (
        <View style={{ padding: 16 }}>
          <Icon name="error" family="material-icons" size={24} color="red" />
          <Text>Error: {error}</Text>
        </View>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text bold size={24}>
          {title}
        </Text>
        <Button
          variant="icon"
          iconFamily="material-icons"
          icon={filtersOpen ? "filter-list-off" : "filter-list"}
          iconSize={22}
          onPress={() => setFiltersOpen((prev) => !prev)}
        />
      </View>

      {filtersOpen && (
        <View style={{ marginVertical: 8, gap: 16 }}>
          {enableSecondaryAction && (
            <Dropdown
              options={[secondaryActionLabel ?? ""]}
              visible={false}
              value={secondaryActionLabel ?? ""}
              label={secondaryActionLabel ?? ""}
              iconFamily={secondaryActionIconFamily}
              icon={secondaryActionIcon ?? ""}
              onValueChange={() => onSecondaryAction?.(secondaryAction)}
            />
          )}
          {enableSort && (
            <View>
              <Dropdown
                options={sortByItems ?? []}
                visible={sortOpen}
                value={sortValue}
                label="Sort By"
                iconFamily="material-icons"
                icon="sort"
                onValueChange={(value) => setSortValue(value)}
                onVisibleChange={() => setSortOpen((prev) => !prev)}
              />
            </View>
          )}
        </View>
      )}
      <FlatList
        data={items}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => keyExtractor(item)}
        ListEmptyComponent={() => (
          <View style={{ padding: 16 }}>
            <Text>No data</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
