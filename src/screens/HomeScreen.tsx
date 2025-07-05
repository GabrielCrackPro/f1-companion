import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Text } from "../components";
import { useRaces } from "../hooks";
import { useState } from "react";

export const HomeScreen = () => {
  const [season, setSeason] = useState(2025);

  const { races, loading, error } = useRaces({ season });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading races...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>2025 Races</Text>
      {races?.data && races.data.length > 0 ? (
        <FlatList
          data={races.data}
          keyExtractor={(item) => `${item.season}-${item.round}`}
          renderItem={({ item }) => (
            <View style={styles.raceItem}>
              <Text style={styles.raceText}>
                Round {item.round}: {item.raceName}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text>No races found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
