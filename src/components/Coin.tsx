import React, { useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { generateUuid } from "../utils";
import { config } from "../../config";
import { useHaptics } from "../useHaptics";
import { ImpactFeedbackStyle } from "expo-haptics";

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const sensitivity = 0.15;

const animationConfig = { duration: 100 };

type CoinProps = {
  onClick: () => void;
  disabled?: boolean;
};

export const Coin: React.FC<CoinProps> = ({ disabled, onClick }) => {
  const [number, setNumber] = useState<
    { id: string; x: number; y: number } | undefined
  >(undefined);

  const width = Dimensions.get("window").width - 50;
  const size = width > 1000 ? 1000 : width;
  const center = size / 2;

  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const { impactOccurred } = useHaptics();

  const handlePressIn = async (e: GestureResponderEvent) => {
    await impactOccurred(ImpactFeedbackStyle.Light);

    const { locationX, locationY } = e.nativeEvent;

    const deltaX = locationX - center;
    const deltaY = locationY - center;

    rotateY.value = withTiming(deltaX * sensitivity, animationConfig);
    rotateX.value = withTiming(-deltaY * sensitivity, animationConfig);

    setNumber({ id: generateUuid(), x: locationX, y: locationY });
    onClick();
    setTimeout(() => {
      setNumber(undefined);
    }, 10);
  };

  const handlePressOut = () => {
    rotateX.value = withTiming(0, animationConfig);
    rotateY.value = withTiming(0, animationConfig);
  };

  const rotateStyle = useAnimatedStyle(() => ({
    position: "relative",
    transform: [
      {
        rotateY: `${rotateY.value}deg`,
      },
      {
        rotateX: `${rotateX.value}deg`,
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <AnimatedButton
        style={[rotateStyle]}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <Image
          source={require("../../assets/icons/coin.png")}
          style={{ height: size, width: size }}></Image>
      </AnimatedButton>
      {!!number && (
        <Animated.View
          exiting={SlideOutUp.duration(500)}
          key={number.id}
          style={{
            position: "absolute",
            top: number.y,
            left: number.x,
            zIndex: 1000,
          }}>
          <Text style={[styles.text]}>+1</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  text: {
    fontSize: 26,
    fontWeight: "600",
    color: config().themeParams?.hint_color,
  },
});
