import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useRaces, useSeasonContext } from "../../hooks";
import { racesSortFields } from "../../mappers";
import { Race } from "../../models";
import { List, Text } from "../shared";
import { RaceItem } from "./RaceItem";
import { RaceListEmpty } from "./RaceListEmpty";
import { isSeasonFinished } from "../../utils";

const Tabs = createMaterialTopTabNavigator();

export const RaceList: React.FC = () => {
  const { races, loading, error } = useRaces({ limit: 25 });
  const { season } = useSeasonContext();

  const [sortedRaces, setSortedRaces] = useState<Race[]>([]);
  const [nextRaceId, setNextRaceId] = useState<string | null>(null);
  const [seasomFinished, setSeasonFinished] = useState(
    isSeasonFinished(season)
  );

  useEffect(() => {
    if (!races?.data) return;

    const now = Date.now();
    const validRaces = races.data.filter(
      (r) => !isNaN(new Date(r.date).getTime())
    );

    const normalizedRaces = validRaces.map((r) => ({
      ...r,
      round: Number(r.round),
      season: String(r.season),
    }));

    const upcomingSorted = [...normalizedRaces]
      .filter((r) => new Date(r.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const next = upcomingSorted[0];
    setNextRaceId(next ? `${next.season}-${next.round}` : null);
    setSortedRaces(normalizedRaces);
  }, [races]);

  const { pastRaces, upcomingRaces } = useMemo(() => {
    const now = Date.now();

    const past = sortedRaces
      .filter((r) => new Date(r.date).getTime() <= now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const upcoming = sortedRaces
      .filter((r) => new Date(r.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { pastRaces: past, upcomingRaces: upcoming };
  }, [sortedRaces]);

  const handleSort = (
    sortBy: keyof typeof racesSortFields,
    order: "asc" | "desc"
  ) => {
    const sortField = racesSortFields[sortBy];

    const sorted = [...sortedRaces].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

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
    if (races?.data) {
      setSortedRaces(races.data);
    }
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
        renderEmpty={() => (
          <RaceListEmpty
            title={seasomFinished ? "Season finished" : "No races to show"}
            message={
              seasomFinished
                ? "This season has finished"
                : "Please check back later"
            }
          />
        )}
        renderItem={(item) => {
          const itemId = `${item.season}-${item.round}`;
          const isNext = itemId === nextRaceId;
          return <RaceItem key={itemId} race={item} isNextRace={isNext} />;
        }}
      />
    );

  return (
    <Tabs.Navigator initialRouteName="Upcoming">
      <Tabs.Screen name="Upcoming" component={renderTab(upcomingRaces)} />
      <Tabs.Screen name="Past" component={renderTab(pastRaces)} />
    </Tabs.Navigator>
  );
};
