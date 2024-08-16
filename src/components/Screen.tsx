import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { config } from "../../config";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: config().themeParams?.secondary_bg_color,
  },
});

export const Screen: React.FC<ViewProps> = ({ children, style }) => {
  return <View style={[styles.screen, style]}>{children}</View>;
};
