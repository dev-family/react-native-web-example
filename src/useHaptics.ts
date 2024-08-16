import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  impactAsync,
  notificationAsync,
  NotificationFeedbackType,
  ImpactFeedbackStyle,
} from "expo-haptics";

type Haptics = {
  impactOccurred: (style: ImpactFeedbackStyle) => Promise<void>;
  notificationOccurred: (type: NotificationFeedbackType) => Promise<void>;
};

export const useHaptics = () => {
  const [haptics, setHaptics] = useState<Haptics>({
    impactOccurred: async _ => {},
    notificationOccurred: async _ => {},
  });

  useEffect(() => {
    if (Platform.OS == "web") {
      if (window.Telegram?.WebApp.HapticFeedback) {
        setHaptics(window.Telegram.WebApp.HapticFeedback);
        return;
      }
    }

    const impact = async (style: ImpactFeedbackStyle) =>
      await impactAsync(style);
    const notification = async (type: NotificationFeedbackType) =>
      await notificationAsync(type);
    setHaptics({ impactOccurred: impact, notificationOccurred: notification });
  }, []);

  return haptics;
};
