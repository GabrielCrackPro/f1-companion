import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useCustomTheme, useSeasonContext } from "../../hooks";
import { isSeasonFinished } from "../../utils";
import { Button, Icon, Text } from "../shared";

interface RaceListEmptyProps {
  title?: string;
  message?: string;
}

export const RaceListEmpty: React.FC<RaceListEmptyProps> = ({
  title = "No races to show",
  message = "Please check back later",
}) => {
  const { colors } = useCustomTheme();
  const { height } = useWindowDimensions();
  const { season, setSeason, goToSeasonResults } = useSeasonContext();

  const [seasonFinished] = useState(isSeasonFinished(season));

  return (
    <View style={[styles.container, { height: height / 3 }]}>
      <Icon
        name="flag-checkered"
        family="font-awesome-5"
        size={60}
        color={colors.primary}
      />
      <Text style={{ fontSize: 20, color: colors.text }}>{title}</Text>
      <Text style={{ fontSize: 16, color: colors.text }}>{message}</Text>
      {seasonFinished && (
        <View style={{ gap: 8 }}>
          <Button
            label="Go to next season"
            variant="primary"
            rightIcon="chevron-forward"
            iconFamily="ionicons"
            onPress={() => setSeason(season + 1)}
          />
          <Button
            label="See season history"
            variant="outline"
            leftIcon="timer-outline"
            iconFamily="ionicons"
            onPress={goToSeasonResults}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
