import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { RaceRouteProp } from "../../models";
import { useRace, useSeasonContext } from "../../hooks";
import { List, Text } from "../../components";
import { Dropdown } from "../../components/shared/Dropdown";

interface LapTiming {
  driverId: string;
  position: string;
  time: string;
}

interface LapData {
  Timings: LapTiming[];
  number: string;
}

export const LapsScreen: React.FC = () => {
  const { params } = useRoute<RaceRouteProp>();
  const { season } = useSeasonContext();
  const { getRaceLaps } = useRace();

  const [raceLaps, setRaceLaps] = useState<LapData[]>([]);
  const [selectedLap, setSelectedLap] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLaps = async () => {
      try {
        setLoading(true);
        const laps = await getRaceLaps(season, params.round, selectedLap);

        if (isMounted) {
          setRaceLaps(laps);
        }
      } catch (err) {
        console.error("Error fetching race laps", err);
        if (isMounted) setRaceLaps([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLaps();

    return () => {
      isMounted = false;
    };
  }, [season, params.round, getRaceLaps]);

  const lapOptions = useMemo(() => {
    console.log(raceLaps);
    return Array.from({ length: params.laps || 1 }, (_, i) => i + 1).map(
      (lap) => `Lap ${lap}`
    );
  }, [raceLaps]);

  const currentLapData = useMemo(() => {
    const lap = raceLaps.find((l) => Number(l.number) === selectedLap);
    return lap?.Timings ?? [];
  }, [raceLaps, selectedLap]);

  if (raceLaps.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No lap data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Dropdown
        options={lapOptions}
        value={`Lap ${selectedLap}`}
        label="Laps"
        icon="flag"
        iconFamily="ionicons"
        onValueChange={(val) => {
          const lapNumber = parseInt(val.replace(/\D/g, ""), 10);
          if (!isNaN(lapNumber)) {
            setSelectedLap(lapNumber);
          }
        }}
      />
      <List
        title={`Lap ${selectedLap}`}
        items={currentLapData}
        countVisible={false}
        keyExtractor={(item: LapTiming, index: number) =>
          `${item.driverId}-${index}`
        }
        renderItem={(item: LapTiming) => (
          <View style={styles.item}>
            <Text style={styles.driver}>{item.driverId}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  driver: {
    fontSize: 16,
    fontWeight: "500",
  },
  time: {
    fontSize: 16,
    fontVariant: ["tabular-nums"],
  },
});
