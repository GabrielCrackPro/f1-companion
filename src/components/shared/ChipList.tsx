import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Button } from "./atoms";
import { Filter } from "./List";

export type ChipListProps = {
  items: Filter[];
  style?: StyleProp<ViewStyle>;
  onChipPress?: (chip: string) => void;
};

export const ChipList: React.FC<ChipListProps> = ({
  items,
  style,
  onChipPress,
}) => {
  const defaultStyle: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  };

  const formatChips = (items: Filter[]) => {
    return items.map((item) => ({
      type: item.type,
      value: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${
        item.value
      }`,
    }));
  };

  return (
    <View style={[defaultStyle, style]}>
      {formatChips(items).map((item) => (
        <Button
          key={item.type}
          label={item.value}
          variant="chip"
          style={{ margin: 4 }}
          onPress={() => onChipPress?.(item.type)}
        />
      ))}
    </View>
  );
};
