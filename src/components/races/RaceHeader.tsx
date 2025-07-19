import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleProp, View, ViewStyle } from "react-native";
import { useCustomTheme, useSeasonContext } from "../../hooks";
import { useCalendar } from "../../hooks/useCalendar";
import { useRace } from "../../hooks/useRace";
import { RaceNavigationProp, RaceRouteProp } from "../../models";
import { Button } from "../shared/atoms/Button";
import { Text } from "../shared/atoms/Text";

interface RaceHeaderProps {
  isResults?: boolean;
  isLaps?: boolean;
}

export const RaceHeader: React.FC<RaceHeaderProps> = ({
  isResults = false,
  isLaps = false,
}) => {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<RaceNavigationProp>();
  const route = useRoute<RaceRouteProp>();
  const { round, name, finished } = route.params;
  const { season } = useSeasonContext();

  const { getRaceSessions, addRaceToCalendar, loading } = useRace();
  const { isEventAlreadyAdded, openCalendarEvent } = useCalendar();

  const [sessions, setSessions] = useState<
    {
      location?: {
        lat: number;
        long: number;
        locality: string;
        country: string;
      };
      name: string;
      date: string;
      time: string;
    }[]
  >([]);

  const [eventAdded, setEventAdded] = useState(false);
  const [eventIds, setEventIds] = useState<(string | null)[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const loadedSessions = await getRaceSessions(season, round);
      if (loadedSessions) setSessions(loadedSessions);
    };
    loadSessions();
  }, [getRaceSessions, season, round]);

  useEffect(() => {
    if (sessions.length === 0) return;

    const checkEvent = async () => {
      const firstSession = sessions[0];
      const [month, day] = firstSession.date.split("/").map(Number);
      const [hours, minutes] = firstSession.time.split(":").map(Number);
      const year = new Date().getFullYear();
      const sessionDate = new Date(year, month - 1, day, hours, minutes);

      const alreadyAdded = await isEventAlreadyAdded(
        firstSession.name,
        sessionDate
      );
      setEventAdded(alreadyAdded);
    };

    checkEvent();
  }, [sessions, isEventAlreadyAdded]);

  const headerStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.card,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  };

  const label = `${name} ${isResults ? " Results" : ""} ${
    isLaps ? "Laps" : ""
  }`;

  const handleAddToCalendar = async () => {
    if (sessions.length === 0) return;

    const addedEventIds = await addRaceToCalendar(sessions);
    setEventAdded(true);
    setEventIds(addedEventIds || null);
  };

  const handleOpenCalendarEvent = async () => {
    if (sessions.length === 0) return;

    await openCalendarEvent(eventIds[0] || "");
  };

  return (
    <SafeAreaView style={headerStyle}>
      {navigation.canGoBack() && (
        <Button
          variant="icon"
          iconFamily="evilicons"
          leftIcon="chevron-left"
          iconSize={44}
          onPress={navigation.goBack}
        />
      )}

      <View style={{ flex: 1, alignItems: "center" }}>
        <Text bold center size={20} style={{ marginHorizontal: 16 }}>
          {label}
        </Text>
      </View>
      {!finished && !isResults && !isLaps && (
        <Button
          variant="icon"
          leftIcon={eventAdded ? "calendar-arrow-right" : "calendar-plus-o"}
          iconFamily={eventAdded ? "material-community" : "font-awesome"}
          onPress={eventAdded ? handleOpenCalendarEvent : handleAddToCalendar}
          disabled={loading}
        />
      )}
    </SafeAreaView>
  );
};
