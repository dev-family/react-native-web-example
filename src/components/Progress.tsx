import { StyleSheet, Text, View } from "react-native";
import { config } from "../../config";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import React, { useState } from "react";

type ProgressProps = {
  max?: number;
  amount: number;
};
export const Progress: React.FC<ProgressProps> = ({ max = 3500, amount }) => {
  const [width, setWidth] = useState(0);
  return (
    <View
      style={styles.container}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      <Text style={[styles.text, { width }]}>
        {amount} / {max}
      </Text>
      <View style={[styles.progress, { width: (amount / max) * width }]}>
        <Text style={[styles.text, styles.progressText, { width }]}>
          {amount} / {max}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    borderColor: config().themeParams.accent_text_color,
    backgroundColor: config().themeParams.section_bg_color,
    borderWidth: 2,
    borderRadius: 70,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
  },
  progress: {
    height: "100%",
    backgroundColor: config().themeParams.accent_text_color,
    width: 200,
    borderRadius: 20,
    position: "absolute",
    justifyContent: "center",
    overflow: "hidden",
  },
  text: {
    fontWeight: "700",
    fontSize: 24,
    color: config().themeParams.accent_text_color,
    textAlign: "center",
  },
  progressText: {
    textAlign: "center",
    color: config().themeParams.text_color,
  },
});
