import {
  ParamListBase,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomTheme, useSeasonContext } from "../../hooks";
import { Button, Logo, Text } from "./atoms";
import { RaceNavigationProp } from "../../models";

interface HeaderProps {
  route: RouteProp<ParamListBase>;
}

export const Header: React.FC<HeaderProps> = ({ route }) => {
  const { colors } = useCustomTheme();
  const { season, openSeasonSelector } = useSeasonContext();
  const { navigate } = useNavigation<RaceNavigationProp>();

  const title =
    route.name === "Races" ? `${route.name} - ${season}` : route.name;

  const headerStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  };

  const goToNotifications = () => {
    navigate("Notifications");
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
        onPress={() => goToNotifications()}
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
