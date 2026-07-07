import type { InboxTask } from "@/types";

export const INBOX_TASKS: InboxTask[] = [
  { id: "t1", kind: "ocr", title: "Hoá đơn Circle K", reason: "OCR độ tin cậy 62% · Kiểm tra tổng tiền", meta: "128.000₫ · 14/04", cta: "Xem hoá đơn" },
  { id: "t2", kind: "ocr", title: "Hoá đơn Starbucks", reason: "Không đọc được thuế VAT", meta: "89.000₫ · 13/04", cta: "Chỉnh sửa" },
  { id: "t3", kind: "duplicate", title: "Grab · 45.000₫", reason: "Trùng với giao dịch lúc 08:14 hôm nay", meta: "2 giao dịch", cta: "So sánh" },
  { id: "t4", kind: "duplicate", title: "Shopee · 320.000₫", reason: "Có thể trùng đơn hàng #A912", meta: "3 giao dịch", cta: "Gộp" },
  { id: "t5", kind: "uncategorized", title: "Chuyển khoản 1.200.000₫", reason: "Chưa chọn danh mục", meta: "12/04", cta: "Phân loại" },
  { id: "t6", kind: "uncategorized", title: "MoMo · 55.000₫", reason: "Ghi chú trống · Gợi ý: Ăn uống", meta: "10/04", cta: "Chọn" },
  { id: "t7", kind: "sync", title: "Techcombank", reason: "Sync lỗi lúc 09:22 · Cần đăng nhập lại", meta: "Ngân hàng", cta: "Kết nối" },
];

// Điểm nối API: thay thân hàm bằng fetch() khi có backend.
export function getInboxTasks(): InboxTask[] {
  return INBOX_TASKS;
}
