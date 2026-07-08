import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Haptic Feedback Utility
 * 
 * Sử dụng Capacitor Haptics API cho ứng dụng di động (iOS/Android).
 * Hỗ trợ fallback về Navigator.vibrate API trên web (Android Chrome).
 */

export const vibrateLight = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10); // Rung rất nhẹ
    }
  }
};

export const vibrateMedium = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (e) {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(30); // Rung vừa
    }
  }
};

export const vibrateHeavy = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch (e) {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); // Rung mạnh
    }
  }
};

export const vibrateSuccess = async () => {
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch (e) {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([15, 50, 15]);
    }
  }
};

export const vibrateError = async () => {
  try {
    await Haptics.notification({ type: NotificationType.Error });
  } catch (e) {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
  }
};
