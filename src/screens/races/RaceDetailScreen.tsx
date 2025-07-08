import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  Button,
  List,
  RaceDetailHeader,
  SessionCountdown,
  SessionItem,
} from "../../components";
import { useRace } from "../../hooks";
import { RaceNavigationProp, RaceRouteProp } from "../../models";

export const RaceDetailScreen = () => {
  const { params } = useRoute<RaceRouteProp>();
  const { navigate } = useNavigation<RaceNavigationProp>();
  const { getRaceSessions } = useRace();

  const { colors } = useTheme();

  const [raceSessions, setRaceSessions] = useState<any[] | null>(null);
  const [next, setNext] = useState<any | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsFetching(true);
      try {
        const sessions = await getRaceSessions(params.season, params.round);
        setRaceSessions(sessions);
        setNext(sessions && sessions.find((s: any) => !s.finished));
      } catch (err: any) {
        console.error("Error fetching race sessions", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSessions();
  }, []);

  const goToResults = (name?: string) => {
    navigate("Results", {
      name: params.name,
      season: params.season,
      round: params.round,
      session: name ? name : "Race",
    });
  };

  if (isFetching) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!params.finished && params.session === next?.name && (
        <SessionCountdown nextSession={next} />
      )}
      <RaceDetailHeader
        showHeader={!params.finished}
        sessions={raceSessions ?? []}
        onTimeChange={() => {}}
      />
      <List
        title="Schedule"
        items={raceSessions ?? []}
        sortVisible={false}
        countVisible={false}
        keyExtractor={(item, index) => item?.name ?? index?.toString()}
        titleStyle={{
          marginVertical: 20,
          fontSize: 20,
          color: colors.text,
        }}
        renderItem={(item) => (
          <SessionItem
            session={item}
            next={next}
            onPress={(session) => goToResults(session.name)}
          />
        )}
      />
      {params.finished && (
        <Button
          label="Results"
          leftIcon="flag-checkered"
          rightIcon="chevron-right"
          iconFamily="material-community"
          style={{ padding: 16, margin: 8, borderRadius: 3 }}
          onPress={goToResults}
        />
      )}
    </View>
  );
};
