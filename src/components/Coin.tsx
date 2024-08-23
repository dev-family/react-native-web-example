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
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { generateUuid } from "../utils";
import { config } from "../../config";
import { useHaptics } from "../useHaptics";
import { ImpactFeedbackStyle } from "expo-haptics";

//animated component to have ability use animated style from Reanimated package
const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const sensitivity = Platform.OS == "web" ? 0.1 : 0.2;

const animationConfig = {
  duration: 100,
};

/**
 * @prop onClick - what happened on click the coin
 * @prop disabled - when coin can be clicked or not
 */
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
  //setting coin size based on window and check web compatibility
  const size = width > 1000 ? 1000 : width;
  const center = size / 2;

  //shared values to use in coin animation
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const { impactOccurred } = useHaptics();

  const handlePressIn = async (e: GestureResponderEvent) => {
    await impactOccurred(ImpactFeedbackStyle.Light);

    const { locationX, locationY } = e.nativeEvent;

    //getting rotate amount by x axis
    const deltaX = locationX - center;
    //getting rotate amount by y axis
    const deltaY = locationY - center;

    if (Platform.OS === "web") {
      rotateY.value = deltaX * sensitivity;
      rotateX.value = -deltaY * sensitivity;
    } else {
      rotateY.value = withTiming(deltaX * sensitivity, animationConfig);
      rotateX.value = withTiming(-deltaY * sensitivity, animationConfig);
    }

    //set number position && unique id to have no problems with keys
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

    // use timeout to not remove element on render start
    setTimeout(() => {
      //set values undefined to launch exiting animation
      setNumber(undefined);
      setShowNumber(false);
    }, 10);
  };

  //style to define coin rotation
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
    //getting text color from Telegram client
    color: config().themeParams?.hint_color,
  },
});
