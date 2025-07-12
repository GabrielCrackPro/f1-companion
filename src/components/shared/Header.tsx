import { ParamListBase, RouteProp, useTheme } from "@react-navigation/native";
import { useState } from "react";
import { StyleProp, useWindowDimensions, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSeasonContext } from "../../hooks";
import { SeasonSelector } from "../races";
import { Button, Logo, Text } from "./atoms";

interface HeaderProps {
  route: RouteProp<ParamListBase>;
}

export const Header: React.FC<HeaderProps> = ({ route }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const { season, setSeason } = useSeasonContext();

  const [seasonSelectorOpen, setSeasonSelectorOpen] = useState(false);

  const title =
    route.name === "Races" ? `${route.name} - ${season}` : route.name;

  const headerStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  };

  const handleSeasonSelect = (season: number) => {
    setSeason(season);
    setSeasonSelectorOpen(false);
  };

  return (
    <>
      <SafeAreaView style={headerStyle}>
        <Logo />
        <Text bold center size={20} style={{ flex: 1 }}>
          {title}
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
            onPress={() => setSeasonSelectorOpen(true)}
          />
        )}
      </SafeAreaView>
      <SeasonSelector
        selectedSeason={season}
        seasonSelectorOpen={seasonSelectorOpen}
        onSeasonSelect={handleSeasonSelect}
        setSeasonSelectorOpen={setSeasonSelectorOpen}
      />
    </>
  );
};
