import { ParamListBase, RouteProp, useTheme } from "@react-navigation/native";
import {
  StyleProp,
  TouchableOpacity,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "./Logo";
import { Text } from "./atoms/Text";
import { Button } from "./atoms";

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
        iconFamily="evilicons"
        icon="bell"
        iconColor={colors.primary}
        iconOnly
      />
    </SafeAreaView>
  );
};
