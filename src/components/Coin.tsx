import React, { useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  ReduceMotion,
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

const sensitivity = Platform.OS == "web" ? 0.1 : 0.2;

const animationConfig = {
  duration: 100,
};

type CoinProps = {
  onClick: () => void;
  disabled?: boolean;
};

export const Coin: React.FC<CoinProps> = ({ disabled, onClick }) => {
  const [number, setNumber] = useState<
    { id: string; x: number; y: number } | undefined
  >(undefined);
  const [showNumber, setShowNumber] = useState(false);

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

    if (Platform.OS === "web") {
      rotateY.value = deltaX * sensitivity;
      rotateX.value = -deltaY * sensitivity;
    } else {
      rotateY.value = withTiming(deltaX * sensitivity, animationConfig);
      rotateX.value = withTiming(-deltaY * sensitivity, animationConfig);
    }

    setNumber({ id: generateUuid(), x: locationX, y: locationY });
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    setShowNumber(true);
    if (Platform.OS === "web") {
      rotateX.value = 0;
      rotateY.value = 0;
    } else {
      rotateX.value = withTiming(0, animationConfig);
      rotateY.value = withTiming(0, animationConfig);
    }

    onClick();
    setTimeout(() => {
      setNumber(undefined);
      setShowNumber(false);
    }, 10);
  };

  const rotateStyle = useAnimatedStyle(
    () => ({
      position: "relative",
      transform: [
        {
          rotateY: `${rotateY.value}deg`,
        },
        {
          rotateX: `${rotateX.value}deg`,
        },
      ],
    }),
    [rotateX, rotateY],
  );

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
      {!!number && showNumber && (
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
