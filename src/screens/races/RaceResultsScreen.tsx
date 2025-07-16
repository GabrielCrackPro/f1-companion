import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "../../components";
import { useRace } from "../../hooks";
import { RaceRouteProp } from "../../models";

const Tab = createMaterialTopTabNavigator();

export const RaceResultsScreen: React.FC = () => {
  const {
    params: { season, round, session },
  } = useRoute<RaceRouteProp>();

  const [raceData, setRaceData] = useState<{
    results: any;
    qualifying: any;
    sprint: any;
  } | null>(null);

  const [isFetching, setIsFetching] = useState(true);
  const { getRaceResults, error } = useRace();

  useEffect(() => {
    const fetchRaceData = async () => {
      setIsFetching(true);
      try {
        const r = await getRaceResults(season, round);
        setRaceData(r);
      } catch (err) {
        console.error("Error fetching race results", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchRaceData();
    return () => setRaceData(null);
  }, [season, round, getRaceResults]);

  if (isFetching || !raceData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const hasSprint = raceData.sprint && raceData.sprint.length > 0;

  const availableTabs = [
    "Race",
    "Qualifying",
    ...(hasSprint ? ["Sprint"] : []),
  ];

  const sessionMap: Record<string, string> = {
    race: "Race",
    qualifying: "Qualifying",
    sprint: "Sprint",
  };

  const normalizedSession =
    typeof session === "string" ? sessionMap[session.toLowerCase()] : undefined;

  const initialTab = availableTabs.includes(normalizedSession || "")
    ? normalizedSession
    : "Race";

  const ResultsTab = ({ data }: any) => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Results</Text>
    </View>
  );

  const QualifyingTab = ({ data }: any) => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Qualifying</Text>
    </View>
  );

  const SprintTab = ({ data }: any) => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sprint</Text>
    </View>
  );

  return (
    <Tab.Navigator initialRouteName={initialTab}>
      <Tab.Screen name="Race">
        {() => <ResultsTab data={raceData.results} />}
      </Tab.Screen>
      <Tab.Screen name="Qualifying">
        {() => <QualifyingTab data={raceData.qualifying} />}
      </Tab.Screen>
      {hasSprint && (
        <Tab.Screen name="Sprint">
          {() => <SprintTab data={raceData.sprint} />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
};
