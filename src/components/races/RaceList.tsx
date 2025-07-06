import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRaces } from "../../hooks";
import { racesSortFields } from "../../mappers";
import { List, Text } from "../shared";
import { Race } from "../../models";
import { RaceItem } from "./RaceItem";

interface RaceListProps {
  season: number;
}

export const RaceList: React.FC<RaceListProps> = ({ season }) => {
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [visibleRaces, setVisibleRaces] = useState<Race[]>([]);
  const [nextRaceRound, setNextRaceRound] = useState<number | null>(null);

  const { races, loading, error } = useRaces({ season: selectedSeason });

  useEffect(() => {
    if (races?.data) {
      setVisibleRaces(races.data);
      updateNextRace(races.data);
    }
  }, [races]);

  const updateNextRace = (racesList: Race[]) => {
    const now = new Date();
    const upcoming = racesList
      .filter((r) => new Date(r.date).getTime() > now.getTime())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setNextRaceRound(upcoming?.[0]?.round ?? null);
  };

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
    updateNextRace(races?.data ?? []);
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
          <RaceItem
            key={`${item.season}-${item.round}`}
            race={item}
            isNextRace={item.round === nextRaceRound}
          />
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
});
