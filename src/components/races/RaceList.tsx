import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useRaces, useSeasonContext } from "../../hooks";
import { racesSortFields } from "../../mappers";
import { Race } from "../../models";
import { List, Text } from "../shared";
import { RaceItem } from "./RaceItem";

const Tabs = createMaterialTopTabNavigator();

export const RaceList: React.FC = () => {
  const { races, loading, error } = useRaces({ limit: 25 });
  const { colors } = useTheme();
  const { season } = useSeasonContext();

  const [sortedRaces, setSortedRaces] = useState<Race[]>([]);
  const [nextRaceRound, setNextRaceRound] = useState<number | null>(null);

  useEffect(() => {
    if (races?.data) {
      setSortedRaces(races.data);
    }
  }, [races]);

  useEffect(() => {
    const now = new Date();
    const upcoming = sortedRaces
      .filter((r) => new Date(r.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setNextRaceRound(upcoming[0]?.round ?? null);
  }, [sortedRaces]);

  const pastRaces = useMemo(() => {
    const now = new Date();
    return sortedRaces
      .filter((r) => new Date(r.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sortedRaces]);

  const upcomingRaces = useMemo(() => {
    const now = new Date();
    return sortedRaces
      .filter((r) => new Date(r.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sortedRaces]);

  const handleSort = (
    sortBy: keyof typeof racesSortFields,
    order: "asc" | "desc"
  ) => {
    const sortField = racesSortFields[sortBy];

    const sorted = [...sortedRaces].sort((a, b) => {
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

    setSortedRaces(sorted);
  };

  const handleResetFilters = () => {
    setSortedRaces(races?.data ?? []);
  };

  const renderTab = (racesToShow: Race[]) => () =>
    (
      <List
        items={racesToShow}
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
    );

  return (
    <>
      <Tabs.Navigator initialRouteName="Upcoming">
        <Tabs.Screen name="Upcoming" component={renderTab(upcomingRaces)} />
        <Tabs.Screen name="Past" component={renderTab(pastRaces)} />
      </Tabs.Navigator>
    </>
  );
};
