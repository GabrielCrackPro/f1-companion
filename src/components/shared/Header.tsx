import { ParamListBase, RouteProp, useTheme } from "@react-navigation/native";
import { useState } from "react";
import {
  Modal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Logo, Text } from "./atoms";
import { List } from "./List";
import { SeasonSelector } from "../races";

interface HeaderProps {
  route: RouteProp<ParamListBase>;
  onSeasonSelect?: (season: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ route, onSeasonSelect }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const [seasonSelectorOpen, setSeasonSelectorOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(2025);

  const seasons = Array.from({ length: 10 }, (_, i) => 2025 - i);

  const headerStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  };

  const openSeasonSelector = () => setSeasonSelectorOpen(true);

  const handleSeasonSelect = (season: number) => {
    setSelectedSeason(season);
    setSeasonSelectorOpen(false);
    if (onSeasonSelect) onSeasonSelect(season);
  };

  return (
    <>
      <SafeAreaView style={headerStyle}>
        <Logo />
        <Text bold center size={20} style={{ marginHorizontal: width / 5 }}>
          {route.name}
        </Text>
        <Button
          variant="icon"
          iconFamily="evilicons"
          leftIcon="bell"
          iconSize={24}
        />
        {route.name === "Races" && (
          <Button
            variant="icon"
            iconFamily="material-icons"
            leftIcon="format-list-bulleted"
            iconSize={24}
            onPress={openSeasonSelector}
          />
        )}
      </SafeAreaView>
      <SeasonSelector
        seasons={seasons}
        selectedSeason={selectedSeason}
        seasonSelectorOpen={seasonSelectorOpen}
        onSeasonSelect={handleSeasonSelect}
        setSeasonSelectorOpen={setSeasonSelectorOpen}
      />
    </>
  );
};
