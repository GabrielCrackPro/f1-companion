import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "../../components";
import { useRace } from "../../hooks";
import { RaceRouteProp } from "../../models";

export const RaceResultsScreen = () => {
  const {
    params: { season, round },
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

    return () => {
      setRaceData(null);
    };
  }, [season, round, getRaceResults]);

  const Tab = createMaterialTopTabNavigator();

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

  const ResultsTab = ({ data }: any) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Results</Text>
      </View>
    );
  };

  const QualifyingTab = ({ data }: any) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Qualifying</Text>
      </View>
    );
  };

  const SprintTab = ({ data }: any) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Sprint</Text>
      </View>
    );
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name="Race">
        {() => <ResultsTab data={raceData.results} />}
      </Tab.Screen>
      <Tab.Screen name="Qualifying">
        {() => <QualifyingTab data={raceData.qualifying} />}
      </Tab.Screen>
      {raceData.sprint.length > 0 && (
        <Tab.Screen name="Sprint">
          {() => <SprintTab data={raceData.sprint} />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
};
