import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { forwardRef, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useCustomTheme, useSeasonContext } from "../../hooks";
import { Button, Text } from "../shared";
import { SeasonItem } from "./SeasonItem";

interface SeasonSelectorProps {
  selectedSeason: number;
  onSeasonSelect: (season: number) => void;
}

export const SeasonSelector = forwardRef<BottomSheet, SeasonSelectorProps>(
  ({ selectedSeason, onSeasonSelect }, ref) => {
    const { colors } = useCustomTheme();
    const { seasons, closeSeasonSelector } = useSeasonContext();

    const currentYear = new Date().getFullYear();

    const snapPoints = useMemo(() => ["45%"], []);

    const previousSeasons = useMemo(
      () => seasons.filter((year) => year !== currentYear),
      [seasons, currentYear]
    );

    const handleSelect = (year: number) => {
      onSeasonSelect(year);
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.primary }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        enablePanDownToClose
      >
        <View style={styles.container}>
          <Button
            variant="icon"
            iconFamily="material-icons"
            leftIcon="close"
            onPress={closeSeasonSelector}
            style={styles.closeButton}
          />

          <SeasonItem
            season={currentYear}
            current
            selected={selectedSeason === currentYear}
            onSelect={handleSelect}
          />

          <Text size={16} italic style={styles.previousSeasonsLabel}>
            Previous Seasons
          </Text>

          <BottomSheetFlatList
            data={previousSeasons}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <SeasonItem
                season={item}
                selected={item === selectedSeason}
                onSelect={handleSelect}
              />
            )}
          />
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  previousSeasonsLabel: {
    marginTop: 16,
    marginBottom: 4,
  },
});
