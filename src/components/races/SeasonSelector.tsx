import { useTheme } from "@react-navigation/native";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, List, Text } from "../shared";

interface SeasonSelectorProps {
  seasons: number[];
  selectedSeason: number;
  seasonSelectorOpen: boolean;
  onSeasonSelect: (season: number) => void;
  setSeasonSelectorOpen: (open: boolean) => void;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  seasons,
  selectedSeason,
  seasonSelectorOpen,
  onSeasonSelect,
  setSeasonSelectorOpen,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={seasonSelectorOpen}
      onRequestClose={() => setSeasonSelectorOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text bold center size={18} style={{ marginBottom: 12 }}>
            Select a Season
          </Text>
          <List
            items={seasons}
            keyExtractor={(item) => item.toString()}
            countVisible={false}
            renderItem={(item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.seasonItem,
                  selectedSeason === item && [
                    {
                      backgroundColor: colors.primary,
                      borderRadius: 6,
                    },
                  ],
                ]}
                onPress={() => onSeasonSelect(item)}
              >
                <Text center size={18}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <Button
            label="Close"
            onPress={() => setSeasonSelectorOpen(false)}
            style={{ marginTop: 12 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
    borderRadius: 12,
    padding: 16,
  },
  seasonItem: {
    padding: 10,
    alignItems: "center",
  },
  selectedSeason: {
    borderRadius: 6,
  },
});
