import type { Notification } from "@/types";

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "finance", title: "Cảnh báo ngân sách", body: "Danh mục Ăn uống đã dùng 92% ngân sách tháng.", time: "5 phút", unread: true, action: "Xem chi tiết" },
  { id: "n2", type: "finance", title: "Giao dịch lớn", body: "-2.450.000₫ tại Shopee vừa được ghi nhận.", time: "1 giờ", unread: true, action: "Kiểm tra" },
  { id: "n3", type: "social", title: "Minh chia sẻ với bạn", body: "Nhóm ăn tối 08/04 đã cập nhật hoá đơn mới.", time: "3 giờ", unread: true, action: "Mở nhóm" },
  { id: "n4", type: "social", title: "Yêu cầu duyệt chia sẻ", body: "An muốn tham gia nhóm Du lịch Đà Lạt.", time: "Hôm qua", unread: false, action: "Xét duyệt" },
  { id: "n5", type: "system", title: "Sao lưu hoàn tất", body: "Dữ liệu tháng 3 đã được sao lưu an toàn.", time: "Hôm qua", unread: false },
  { id: "n6", type: "finance", title: "Mục tiêu tiết kiệm", body: "Bạn đã đạt 70% mục tiêu “iPhone mới” 🎉", time: "2 ngày", unread: false, action: "Xem mục tiêu" },
  { id: "n7", type: "system", title: "Bản cập nhật mới", body: "v2.4 mang đến OCR nhanh gấp đôi.", time: "3 ngày", unread: false },
];

// Điểm nối API: thay thân hàm bằng fetch() khi có backend.
export function getNotifications(): Notification[] {
  return NOTIFICATIONS;
}
