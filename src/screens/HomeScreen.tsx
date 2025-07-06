import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { List, Text } from "../components";
import { useRaces } from "../hooks";
import { racesSortFields } from "../mappers";

export const HomeScreen = () => {
  const [season, setSeason] = useState(2025);

  const { races, loading, error } = useRaces({ season });

  return (
    <View style={styles.container}>
      <List
        title={"Season " + season}
        items={races?.data ?? []}
        loading={loading}
        error={error ?? undefined}
        keyExtractor={(item) => `${item.season}-${item.round}`}
        enableSort
        enableSecondaryAction
        secondaryActionLabel="Switch Season"
        secondaryActionIcon="swap-vertical"
        secondaryActionIconFamily="ionicons"
        sortByItems={Object.keys(racesSortFields)}
        renderItem={(item) => (
          <View style={styles.raceItem}>
            <Text style={styles.raceText}>
              Round {item.round}: {item.raceName}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  raceItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  raceText: {
    fontSize: 16,
  },
});
