import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Icon, List, ScreenWrapper, Text } from "../../components";
import { darkTheme, lightTheme } from "../../constants";
import { useAnimatedTheme } from "../../contexts";
import { useDrivers } from "../../hooks";
import { Driver, RaceNavigationProp } from "../../models";
import { useNavigation } from "@react-navigation/native";

export const DriversScreen: React.FC = () => {
  const { getDrivers } = useDrivers();
  const { animatedColors } = useAnimatedTheme();
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation<any>();

  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversData = await getDrivers();
        setDrivers(driversData);
      } catch (err) {
        console.error("Error fetching drivers", err);
      }
    };
    fetchDrivers();
  }, [getDrivers]);

  const animatedCardStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      animatedColors.card.value,
      [0, 1],
      [lightTheme.colors.card, darkTheme.colors.card]
    );
    return {
      backgroundColor: bg,
    };
  });

  const onDriverPress = (driver: Driver) => {
    navigate("Driver", { driver });
  };

  const renderDriver = ({ item }: { item: Driver }) => {
    return (
      <Animated.View
        style={[styles.card, animatedCardStyle, { width: width - 24 }]}
      >
        <TouchableOpacity
          style={styles.cardContent}
          activeOpacity={0.8}
          onPress={() => onDriverPress(item)}
        >
          <View style={styles.info}>
            <Text style={styles.firstName}>{item.givenName}</Text>
            <Text
              style={[
                styles.lastName,
                { color: item.constructor && item.constructor.color },
              ]}
            >
              {item.familyName}
            </Text>
            <Text style={styles.number}>{item.permanentNumber}</Text>
            {item.flag && (
              <View style={styles.row}>
                <Image source={item.flag} style={styles.flagImage} />
                <Text>{item.nationality}</Text>
              </View>
            )}

            {item.constructor && (
              <View style={styles.row}>
                <Image
                  source={item.constructor.image}
                  style={styles.constructorImage}
                />
                <Text style={{ color: item.constructor.color }}>
                  {item.constructor.name}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Icon name="calendar-month-outline" family="material-community" />
              <Text>{item.dateOfBirth}</Text>
            </View>
          </View>
          {item.image && (
            <View style={styles.imageWrapper}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScreenWrapper>
      <List
        items={drivers}
        keyExtractor={(item) => item.driverId.toString()}
        renderItem={(item) => renderDriver({ item })}
        contentContainerStyle={styles.list}
        countVisible={false}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 12,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    height: 190,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
  },
  info: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  firstName: {
    fontSize: 14,
    fontWeight: "400",
  },
  lastName: {
    fontSize: 24,
    fontWeight: "700",
  },
  team: {
    marginTop: 4,
    fontSize: 14,
  },
  number: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "600",
  },
  imageWrapper: {
    width: 150,
    height: "100%",
    overflow: "hidden",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "300%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  constructorImage: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  flagImage: {
    width: 24,
    height: 24,
    marginRight: 4,
    borderRadius: 50,
  },
});
