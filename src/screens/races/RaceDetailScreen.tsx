import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  Button,
  CircuitInfo,
  List,
  SessionCountdown,
  SessionItem,
} from "../../components";
import { useRace } from "../../hooks";
import { RaceNavigationProp, RaceRouteProp, Session } from "../../models";
import { isSessionFinished } from "../../utils";
import * as Browser from "expo-web-browser";

export const RaceDetailScreen = () => {
  const { params } = useRoute<RaceRouteProp>();
  const { navigate } = useNavigation<RaceNavigationProp>();
  const { getRaceSessions } = useRace();

  const [raceSessions, setRaceSessions] = useState<Session[] | null>(null);
  const [next, setNext] = useState<Session | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsFetching(true);
      try {
        const sessions = await getRaceSessions(params.season, params.round);
        setRaceSessions(sessions);
        if (sessions) {
          const nextSession = sessions.find(
            (s: Session) => !isSessionFinished(s.date, s.time)
          );
          setNext(nextSession || null);
        }
      } catch (err: any) {
        console.error("Error fetching race sessions", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSessions();
  }, [params.season, params.round, getRaceSessions]);

  const goToResults = (name?: string) => {
    navigate("Results", {
      name: params.name,
      season: params.season,
      round: params.round,
      session: name ? name : "Race",
    });
  };

  const goToLocation = async (location: any) => {
    await Browser.openBrowserAsync(
      `https://www.google.com/maps?q=${location.lat},${location.long}`
    );
  };

  const goToWeb = async (url: string) => {
    await Browser.openBrowserAsync(url);
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
      {!params.finished && params.session === next?.name && next && (
        <SessionCountdown nextSession={next} />
      )}
      <List
        items={raceSessions ?? []}
        sortVisible={false}
        countVisible={false}
        keyExtractor={(item: Session) => item?.name ?? "unknown"}
        renderItem={(item: Session) => (
          <SessionItem
            session={item}
            next={next}
            onPress={(session) => goToResults(session.name)}
          />
        )}
      />
      <CircuitInfo
        circuit={params.circuit}
        onLocationPress={(location) => goToLocation(location)}
        onWebPress={(url) => goToWeb(url)}
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
