import * as Calendar from "expo-calendar";
import { useEffect, useState, useCallback } from "react";
import { Alert, Platform } from "react-native";

export const useCalendar = () => {
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const setupCalendar = async () => {
      try {
        const { status } = await Calendar.getCalendarPermissionsAsync();
        if (status !== "granted") {
          const { status: newStatus } =
            await Calendar.requestCalendarPermissionsAsync();
          if (newStatus !== "granted") {
            if (isMounted) {
              Alert.alert(
                "Calendar Permission",
                "Calendar access is required to manage events in this app."
              );
            }
            return;
          }
        }

        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );

        const existingF1Calendar = calendars.find((cal) => cal.title === "F1");

        if (existingF1Calendar) {
          if (isMounted) {
            setCalendarId(existingF1Calendar.id);
            setIsInitialized(true);
          }
          return;
        }

        const defaultCalendarSource =
          Platform.OS === "ios"
            ? (await Calendar.getDefaultCalendarAsync()).source
            : calendars.find(
                (cal) => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
              )?.source || { isLocalAccount: true, name: "F1", type: "local" };

        const newCalendarId = await Calendar.createCalendarAsync({
          title: "F1",
          color: "#FF1801",
          entityType: Calendar.EntityTypes.EVENT,
          source: defaultCalendarSource,
          name: "F1",
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
          ownerAccount: "personal",
        });

        if (isMounted) {
          setCalendarId(newCalendarId);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error setting up calendar:", error);
        if (isMounted) {
          Alert.alert(
            "Calendar Setup Error",
            "Failed to set up calendar. Please check your calendar permissions."
          );
        }
      }
    };

    setupCalendar();

    return () => {
      isMounted = false;
    };
  }, []);

  const addEventToCalendar = useCallback(async ({
    title,
    startDate,
    endDate,
    location,
  }: {
    title: string;
    startDate: Date;
    endDate: Date;
    location?: string;
  }) => {
    try {
      if (!calendarId || !isInitialized) {
        throw new Error("Calendar not ready yet");
      }

      const existingEvents = await Calendar.getEventsAsync(
        [calendarId],
        startDate,
        new Date(startDate.getTime() + 60 * 60 * 1000)
      );

      const alreadyExists = existingEvents.some(
        (event) => event.title === title
      );
      if (alreadyExists) {
        console.log("Event already exists, skipping...");
        return null;
      }

      const eventId = await Calendar.createEventAsync(calendarId, {
        title,
        startDate,
        endDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        location,
      });

      return eventId;
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      Alert.alert(
        "Failed to add event",
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }, [calendarId, isInitialized]);

  const isEventAlreadyAdded = useCallback(async (title: string, startDate: Date) => {
    if (!calendarId || !isInitialized) return false;

    try {
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const events = await Calendar.getEventsAsync(
        [calendarId],
        startDate,
        endDate
      );

      return events.some((event) => event.title === title);
    } catch (error) {
      console.error("Error checking if event exists:", error);
      return false;
    }
  }, [calendarId, isInitialized]);

  const removeEventFromCalendar = useCallback(async (title: string, startDate: Date) => {
    if (!calendarId || !isInitialized) return false;

    try {
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const events = await Calendar.getEventsAsync(
        [calendarId],
        startDate,
        endDate
      );

      const eventToRemove = events.find((event) => event.title === title);

      if (eventToRemove) {
        await Calendar.deleteEventAsync(eventToRemove.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing event from calendar:", error);
      return false;
    }
  }, [calendarId, isInitialized]);

  const openCalendarEvent = useCallback(async (eventId: string) => {
    if (!eventId) return;

    try {
      await Calendar.openEventInCalendarAsync({
        id: eventId,
      });
    } catch (error) {
      console.error("Error opening calendar event:", error);
    }
  }, []);

  return {
    addEventToCalendar,
    isEventAlreadyAdded,
    removeEventFromCalendar,
    openCalendarEvent,
    isInitialized,
  };
};
