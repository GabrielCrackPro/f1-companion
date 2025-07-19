import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { DriverTimeCard } from "../../components/drivers/DriverTimeCard";
import { List } from "../../components/shared/List";
import { QuantitySelector } from "../../components/shared/QuantitySelector";
import { Text } from "../../components/shared/atoms/Text";
import { useDrivers, useRace, useSeasonContext } from "../../hooks";
import {
  LapData,
  LapTiming,
  RaceNavigationProp,
  RaceRouteProp,
} from "../../models";

export const LapsScreen: React.FC = () => {
  const { params } = useRoute<RaceRouteProp>();
  const { season } = useSeasonContext();
  const { getRaceLaps } = useRace();
  const { getDrivers } = useDrivers();
  const { navigate } = useNavigation<any>();

  const [raceLaps, setRaceLaps] = useState<LapData[]>([]);
  const [selectedLap, setSelectedLap] = useState<number>(1);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDrivers = async () => {
      try {
        const driversData = await getDrivers();
        if (isMounted) setDrivers(driversData);
      } catch (err) {
        console.error("Error fetching drivers", err);
      }
    };
    fetchDrivers();
    return () => {
      isMounted = false;
    };
  }, [getDrivers]);

  useEffect(() => {
    let isMounted = true;
    const fetchLaps = async () => {
      try {
        setLoading(true);
        const laps = await getRaceLaps(season, params.round, selectedLap);
        if (isMounted) setRaceLaps(laps);
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
  }, [season, params.round, selectedLap, getRaceLaps]);

  const currentLapData = useMemo(() => {
    const lap = raceLaps.find((l) => Number(l.number) === selectedLap);
    return lap?.Timings ?? [];
  }, [raceLaps, selectedLap]);

  const goToDriver = (driverId: string) => {
    navigate("Driver", { driverId, name: params.name });
  };

  if (raceLaps.length === 0 && !loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No lap data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QuantitySelector
        value={selectedLap}
        max={params.laps || 1}
        label={params.laps ? "Laps" : ""}
        onIncrement={() =>
          setSelectedLap((prev) => Math.min(prev + 1, params.laps || 1))
        }
        onDecrement={() => setSelectedLap((prev) => Math.max(prev - 1, 1))}
        onMax={() => setSelectedLap(params.laps || 1)}
        onMin={() => setSelectedLap(1)}
      />
      <List
        items={currentLapData}
        loading={loading}
        countVisible={false}
        keyExtractor={(item: LapTiming, index: number) =>
          `${item.driverId}-${index}`
        }
        renderItem={(item: LapTiming) => {
          const driver = drivers.find((d) => d.driverId === item.driverId);

          return (
            <DriverTimeCard
              driver={driver}
              timing={item}
              onPress={(driverId) => goToDriver(driverId)}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
});
