import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRaces } from "../../hooks";
import { racesSortFields } from "../../mappers";
import { List, Text } from "../shared";
import { Race } from "../../models";

interface RaceListProps {
  season: number;
}

export const RaceList: React.FC<RaceListProps> = ({ season }) => {
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [visibleRaces, setVisibleRaces] = useState<Race[]>([]);

  const { races, loading, error } = useRaces({ season: selectedSeason });

  useEffect(() => {
    if (races) {
      setVisibleRaces(races.data);
    }
  }, [races]);

  const handleSort = (
    sortBy: keyof typeof racesSortFields,
    order: "asc" | "desc"
  ) => {
    const sortField = racesSortFields[sortBy];

    const sorted = [...visibleRaces].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setVisibleRaces(sorted);
  };

  const handleResetFilters = () => {
    setVisibleRaces(races?.data ?? []);
  };

  return (
    <View style={styles.container}>
      <List
        title={"Season " + selectedSeason}
        items={visibleRaces ?? []}
        loading={loading}
        error={error ?? undefined}
        keyExtractor={(item) => `${item.season}-${item.round}`}
        enableSort
        sortByItems={Object.keys(racesSortFields)}
        onSort={handleSort}
        onResetFilters={handleResetFilters}
        renderItem={(item) => (
          <View style={styles.raceItem}>
            <Text style={styles.raceText}>
              Round {item.round}: {item.raceName}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  raceItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  raceText: {
    fontSize: 16,
  },
});
