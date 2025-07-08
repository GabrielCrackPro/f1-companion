import { ParamListBase, RouteProp, useTheme } from "@react-navigation/native";
import { StyleProp, useWindowDimensions, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Logo, Text } from "./atoms";

interface HeaderProps {
  route: RouteProp<ParamListBase>;
}

export const Header: React.FC<HeaderProps> = ({ route }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

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
          iconFamily="evilicons"
          leftIcon="calendar"
          iconSize={24}
        />
      )}
    </SafeAreaView>
  );
};
