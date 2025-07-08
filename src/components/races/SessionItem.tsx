import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "../shared";
import { isSessionFinished } from "../../utils";

interface Session {
  name: string;
  date?: string;
  time?: string;
}

interface SessionItemProps {
  session: Session;
  onPress?: () => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  onPress,
}) => {
  const { colors } = useTheme();

  const [sessionFinished, setSessionFinished] = useState(
    isSessionFinished(session.date, session.time)
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {session.name}
        </Text>
        {session.date && !sessionFinished ? (
          <Text style={[styles.subtitle, { color: colors.text }]}>
            {session.date} {session.time && `• ${session.time}`}
          </Text>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon
              name="flag-checkered"
              family="font-awesome-5"
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Finished
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  content: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
});
