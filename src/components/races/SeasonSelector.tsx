import { useTheme } from "@react-navigation/native";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { useSeasonContext } from "../../hooks";
import { Icon, List, Text } from "../shared";

interface SeasonSelectorProps {
  selectedSeason: number;
  seasonSelectorOpen: boolean;
  onSeasonSelect: (season: number) => void;
  setSeasonSelectorOpen: (open: boolean) => void;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  selectedSeason,
  seasonSelectorOpen,
  onSeasonSelect,
  setSeasonSelectorOpen,
}) => {
  const { colors } = useTheme();
  const { seasons } = useSeasonContext();
  const currentYear = new Date().getFullYear();

  const handleSelectCurrentYear = () => {
    onSeasonSelect(currentYear);
    setSeasonSelectorOpen(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={seasonSelectorOpen}
      onRequestClose={() => setSeasonSelectorOpen(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setSeasonSelectorOpen(false)}
      >
        <Pressable
          style={[styles.modalContent, { backgroundColor: colors.card }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text bold size={18}>
              Select a Season
            </Text>
            <TouchableOpacity onPress={() => setSeasonSelectorOpen(false)}>
              <Icon
                name="close"
                family="material-icons"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.currentYearButton,
              {
                backgroundColor:
                  selectedSeason === currentYear
                    ? colors.primary
                    : colors.border,
              },
            ]}
            onPress={handleSelectCurrentYear}
          >
            <View style={styles.seasonRow}>
              <Icon
                name="flag-checkered"
                family="font-awesome"
                size={18}
                color={
                  selectedSeason === currentYear
                    ? colors.background
                    : colors.text
                }
                style={{ marginRight: 8 }}
              />
              <Text
                bold
                size={16}
                style={{
                  color:
                    selectedSeason === currentYear
                      ? colors.background
                      : colors.text,
                }}
              >
                {`In Progress (${currentYear})`}
              </Text>
            </View>
          </TouchableOpacity>
          <Text size={16} italic>
            Past Seasons
          </Text>
          <List
            items={seasons}
            keyExtractor={(item) => item.toString()}
            countVisible={false}
            renderItem={(item) => {
              const isSelected = selectedSeason === item;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.seasonItem,
                    isSelected && {
                      backgroundColor: colors.primary,
                      borderRadius: 8,
                    },
                  ]}
                  onPress={() => onSeasonSelect(item)}
                >
                  <View style={styles.seasonRow}>
                    <Icon
                      name="calendar-today"
                      family="material-icons"
                      size={20}
                      color={isSelected ? colors.background : colors.text}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      size={16}
                      bold={isSelected}
                      style={{
                        color: isSelected ? colors.background : colors.text,
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "70%",
    borderRadius: 16,
    padding: 16,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  currentYearButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  seasonItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  seasonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
