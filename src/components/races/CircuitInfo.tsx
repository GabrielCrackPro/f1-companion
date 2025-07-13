import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { circuitData } from "../../../assets/circuits/data";
import { circuitImagesMap } from "../../constants";
import { useCustomTheme } from "../../hooks";
import { Circuit } from "../../models";
import { Button, Text } from "../shared";
import Animated from "react-native-reanimated";

interface CircuitInfoProps {
  circuit?: Circuit;
  onLocationPress?: (location: { lat: number; long: number }) => void;
  onWebPress?: (url: string) => void;
}

export const CircuitInfo: React.FC<CircuitInfoProps> = ({
  circuit,
  onLocationPress,
  onWebPress,
}) => {
  const { colors } = useCustomTheme();
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    if (circuit?.circuitId) {
      setInfo(circuitData.find((c) => c.id === circuit.circuitId));
    }
  }, [circuit]);

  if (!circuit) return null;

  return (
    <Animated.ScrollView
      contentContainerStyle={[styles.container, { alignItems: "center" }]}
      style={{ marginHorizontal: 16, marginVertical: 12 }}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{circuit.circuitName}</Text>
        <View style={styles.iconRow}>
          <Button
            variant="icon"
            iconFamily="material-icons"
            leftIcon="location-pin"
            onPress={() => onLocationPress?.(circuit.Location)}
          />
          <Button
            variant="icon"
            iconFamily="material-community"
            leftIcon="wikipedia"
            onPress={() => onWebPress?.(circuit.url)}
          />
        </View>
      </View>

      <Image
        source={circuitImagesMap[circuit.Location.country.toLowerCase()]}
        style={styles.image}
        contentFit="contain"
        cachePolicy="memory-disk"
      />

      <Text style={styles.location}>
        {circuit.Location.locality}, {circuit.Location.country}
      </Text>

      {info && (
        <View style={styles.grid}>
          <View style={styles.cell}>
            <Text style={styles.label}>Length</Text>
            <Text style={styles.value}>{info.length} km</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Laps</Text>
            <Text style={styles.value}>{info.laps}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.value}>{info.race_distance} km</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>First GP</Text>
            <Text style={styles.value}>{info.first_gp}</Text>
          </View>
          <View style={styles.cellFull}>
            <Text style={styles.label}>Fastest Lap</Text>
            <Text style={styles.value}>
              {info.fast_lap.time} – {info.fast_lap.driver} (
              {info.fast_lap.year})
            </Text>
          </View>
        </View>
      )}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    letterSpacing: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 6,
    marginBottom: 12,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  cell: {
    width: "48%",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  cellFull: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.7,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
  },
});
