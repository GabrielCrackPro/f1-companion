import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";
import { useTime } from "../../hooks";
import { Button } from "../shared";

interface RaceDetailHeaderProps {
  showHeader: boolean;
  sessions?: any[];
  onTimeChange: (lat: number, long: number) => void;
}

export const RaceDetailHeader: React.FC<RaceDetailHeaderProps> = ({
  showHeader,
  sessions,
  onTimeChange,
}) => {
  if (!showHeader) return null;

  const { isTrackTime, toggleTrackTime } = useTime();
  const { colors } = useTheme();

  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    const { lat, long } = sessions?.find((s: any) => s.location)?.location;
    setLocation({ lat, long });
  }, []);

  useEffect(() => {
    if (isTrackTime && location) {
      onTimeChange(location.lat, location.long);
    }
  }, [isTrackTime, location]);

  const handleTimeChange = (lat: number, long: number) => {
    onTimeChange(lat, long);
    toggleTrackTime();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 10,
        marginTop: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Switch
          value={isTrackTime}
          onChange={() => handleTimeChange(0, 0)}
          thumbColor={colors.border}
          trackColor={{ true: colors.primary, false: colors.notification }}
        />
        <Text style={{ color: colors.text }}>Track Time</Text>
      </View>
      <Button
        label="Add to calendar"
        leftIcon="calendar-plus"
        iconFamily="material-community"
      />
    </View>
  );
};
