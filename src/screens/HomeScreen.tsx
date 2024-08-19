import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Coin, Header, Progress, Screen } from "../components";
import { config } from "../../config";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_CLICK_AMOUNT = 3500;

export const HomeScreen = () => {
  const [amount, setAmount] = useState(0);
  const [clickedAmount, setClickedAmount] = useState(0);

  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(20, insets.bottom);

  const handleClick = () => {
    setAmount(prev => prev + 1);
    setClickedAmount(prev => prev + 1);
  };

  const { themeParams, initDataUnsafe } = config();
  return (
    <>
      <StatusBar backgroundColor={config().themeParams.header_bg_color} />
      <Screen style={{ paddingBottom }}>
        <Header amount={amount} />
        <View style={styles.screen}>
          <Text style={{ color: themeParams.text_color }}>
            {JSON.stringify(initDataUnsafe.user)}
          </Text>
          <View style={styles.coin}>
            <Coin
              disabled={clickedAmount >= MAX_CLICK_AMOUNT}
              onClick={handleClick}></Coin>
          </View>
          <View style={styles.footer}>
            <Progress amount={clickedAmount} />
          </View>
        </View>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 20,
  },
  coin: {
    flex: 1,
    backgroundColor: config().themeParams.bg_color,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: 20,
  },
});
