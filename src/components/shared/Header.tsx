import { ParamListBase, RouteProp, useTheme } from "@react-navigation/native";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSeasonContext } from "../../hooks";
import { Button, Logo, Text } from "./atoms";
import { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";

interface HeaderProps {
  route: RouteProp<ParamListBase>;
}

export const Header: React.FC<HeaderProps> = ({ route }) => {
  const { colors } = useTheme();
  const { season, openSeasonSelector } = useSeasonContext();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const title =
    route.name === "Races" ? `${route.name} - ${season}` : route.name;

  const headerStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  };

  return (
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
          onPress={openSeasonSelector}
        />
      )}
    </SafeAreaView>
  );
};
