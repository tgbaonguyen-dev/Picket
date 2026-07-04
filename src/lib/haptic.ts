/**
 * Haptic Feedback Utility
 * 
 * Sử dụng Navigator.vibrate API tích hợp sẵn của trình duyệt.
 * Trên Android, API này hoạt động trơn tru. Trên iOS Safari, nó bị chặn,
 * tuy nhiên sau này bọc bằng Capacitor, ta có thể dùng plugin @capacitor/haptics
 * để thay thế bên trong các hàm này mà không phải sửa lại toàn bộ UI.
 */

export const vibrateLight = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(10); // Rung rất nhẹ
  }
};

export const vibrateMedium = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(30); // Rung vừa (khi vuốt)
  }
};

export const vibrateHeavy = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(50); // Rung mạnh (khi xoá)
  }
};

export const vibrateSuccess = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([15, 50, 15]); // Rung kiểu thành công
  }
};

export const vibrateError = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([50, 100, 50]); // Rung kiểu cảnh báo lỗi
  }
};
