import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useRaces, useSeasonContext } from "../../hooks";
import { racesSortFields } from "../../mappers";
import { Race } from "../../models";
import { isSeasonFinished } from "../../utils";
import { List } from "../shared";
import { RaceItem } from "./RaceItem";
import { RaceListEmpty } from "./RaceListEmpty";

const Tabs = createMaterialTopTabNavigator();

export const RaceList: React.FC = () => {
  const { races, loading, error } = useRaces({ limit: 25 });
  const { season } = useSeasonContext();

  const [sortedRaces, setSortedRaces] = useState<Race[]>([]);
  const [nextRaceId, setNextRaceId] = useState<string | null>(null);
  const [seasomFinished] = useState(isSeasonFinished(season));

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
    setNextRaceId(
      next ? `${next.season}-${next.round}-${next.Circuit.circuitId}` : null
    );
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

  const handleSort = useCallback(
    (sortBy: keyof typeof racesSortFields, order: "asc" | "desc") => {
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
    },
    [sortedRaces]
  );

  const handleResetFilters = useCallback(() => {
    if (races?.data) {
      setSortedRaces(races.data);
    }
  }, [races]);

  const renderTab = (racesToShow: Race[]) => (
    <List
      disableAnimation
      items={racesToShow}
      loading={loading}
      error={error ?? undefined}
      countVisible={false}
      keyExtractor={(item) =>
        `${item.season}-${item.round}-${item.Circuit.circuitId}`
      }
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
        const itemId = `${item.season}-${item.round}-${item.Circuit.circuitId}`;
        const isNext = itemId === nextRaceId;
        return <RaceItem key={itemId} race={item} isNextRace={isNext} />;
      }}
    />
  );

  return (
    <Tabs.Navigator initialRouteName="Upcoming">
      <Tabs.Screen name="Upcoming">
        {() => renderTab(upcomingRaces)}
      </Tabs.Screen>
      <Tabs.Screen name="Past">{() => renderTab(pastRaces)}</Tabs.Screen>
    </Tabs.Navigator>
  );
};
