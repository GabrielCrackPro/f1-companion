import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { SafeAreaView, StyleProp, ViewStyle } from "react-native";
import { RaceNavigationProp, RaceRouteProp } from "../../models";
import { Button, Text } from "../shared";

interface RaceHeaderProps {
  isResults?: boolean;
}

export const RaceHeader: React.FC<RaceHeaderProps> = ({
  isResults = false,
}) => {
  const { colors } = useTheme();
  const { canGoBack, goBack } = useNavigation<RaceNavigationProp>();
  const { params } = useRoute<RaceRouteProp>();

  const headerStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.card,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  };

  const label = `${params.name} ${isResults ? " Results" : ""}`;

  return (
    <SafeAreaView style={headerStyle}>
      {canGoBack() && (
        <Button
          variant="icon"
          iconFamily="evilicons"
          leftIcon="chevron-left"
          iconSize={44}
          onPress={goBack}
        />
      )}
      <Text bold center size={20} style={{ marginHorizontal: 16 }}>
        {label}
      </Text>
    </SafeAreaView>
  );
};
