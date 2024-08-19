import { Alert, Image, Platform, StyleSheet, Text, View } from "react-native";
import { config } from "../../config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect } from "react";

type HeaderProps = {
  amount: number;
};
export const Header: React.FC<HeaderProps> = ({ amount }) => {
  const insets = useSafeAreaInsets();
  const paddingTop = Math.max(20, insets.top);

  const { username, photo_url } = config().initDataUnsafe.user;

  useEffect(() => {
    if (Platform.OS === "web") {
      alert(JSON.stringify(config().initDataUnsafe));
    }
  }, []);
  return (
    <View style={[styles.header, { paddingTop }]}>
      <View style={styles.amountRow}>
        <Image
          source={require("../../assets/icons/coin.png")}
          style={{ height: 40, width: 40 }}
        />
        <Text style={styles.text}>{amount}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>@{username}</Text>
        {photo_url ? (
          <Image
            style={[styles.image, { backgroundColor: "transparent" }]}
            source={{
              uri: photo_url,
            }}></Image>
        ) : (
          <View style={styles.image}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/profile-placeholder.png")}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: config().themeParams?.header_bg_color,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: config().themeParams?.text_color,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  username: {
    color: config().themeParams.accent_text_color,
    fontSize: 18,
  },
  image: {
    backgroundColor: config().themeParams.button_color,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  icon: {
    height: 30,
    width: 30,
    tintColor: config().themeParams.text_color,
  },
});
