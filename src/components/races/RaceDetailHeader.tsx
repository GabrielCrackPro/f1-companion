import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Clock } from "../shared";

interface RaceDetailHeaderProps {
  showHeader: boolean;
  sessions?: { location?: { lat: number; long: number } }[];
  onTimeChange?: (lat: number, long: number) => void;
}

export const RaceDetailHeader: React.FC<RaceDetailHeaderProps> = ({
  showHeader,
  sessions = [],
  onTimeChange,
}) => {
  const [location, setLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  useEffect(() => {
    const sessionWithLocation = sessions.find((s) => s.location);
    if (sessionWithLocation?.location) {
      setLocation(sessionWithLocation.location);
    }
  }, [sessions]);

  if (!showHeader) return null;

  return (
    <View style={{ marginHorizontal: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginVertical: 8,
          }}
        ></View>
        <Button
          label="Add to calendar"
          leftIcon="calendar-plus"
          iconFamily="material-community"
        />
      </View>

      <Clock lat={location?.lat ?? 0} long={location?.long ?? 0} />
    </View>
  );
};
