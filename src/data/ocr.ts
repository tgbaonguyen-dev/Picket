import { CURRENT_DATE_ISO } from "./calendar";

type OCRField = { key: string; label: string; value: string; confidence: number; box: [number, number, number, number] };
type OCRItem = { id: string; name: string; price: number; category: string; confidence: number; box: [number, number, number, number] };

export const OCR_MOCK_RECEIPT: { fields: OCRField[], items: OCRItem[] } = {
  fields: [
    { key: "merchant", label: "Cửa hàng", value: "Lotte Mart", confidence: 0.96, box: [10, 5, 80, 10] },
    { key: "date", label: "Ngày", value: `${CURRENT_DATE_ISO} · 14:32`, confidence: 0.93, box: [10, 18, 50, 6] },
    { key: "total", label: "Tổng tiền", value: "160000", confidence: 0.99, box: [10, 80, 80, 10] },
  ],
  items: [
    { id: "1", name: "Cà chua sấy", price: 45000, category: "food", confidence: 0.95, box: [10, 30, 80, 8] },
    { id: "2", name: "Nước rửa chén", price: 110000, category: "shopping", confidence: 0.82, box: [10, 42, 80, 8] },
    { id: "3", name: "Vé gửi xe", price: 5000, category: "transport", confidence: 0.75, box: [10, 54, 80, 8] },
  ]
};

export const OCR_MOCK_ITEM: { fields: OCRField[], items: OCRItem[] } = {
  fields: [
    { key: "name", label: "Tên tài sản", value: "MacBook Pro M3", confidence: 0.96, box: [10, 5, 80, 10] },
    { key: "category", label: "Danh mục", value: "Công nghệ", confidence: 0.91, box: [10, 18, 50, 6] },
    { key: "warranty", label: "Hạn bảo hành (Tuỳ chọn)", value: "15/01/2027", confidence: 0.99, box: [10, 30, 80, 10] },
    { key: "returnBy", label: "Hạn đổi trả (Tuỳ chọn)", value: "15/02/2027", confidence: 0.85, box: [10, 42, 80, 10] },
  ],
  items: []
};

export const OCR_MOCK_TRIP: { fields: OCRField[], items: OCRItem[] } = {
  fields: [
    { key: "destination", label: "Địa điểm / Chuyến đi", value: "Đà Lạt", confidence: 0.98, box: [10, 5, 80, 10] },
    { key: "date", label: "Thời gian", value: CURRENT_DATE_ISO, confidence: 0.92, box: [10, 18, 50, 6] },
  ],
  items: []
};

export const OCR_CANDIDATE_TRANSACTIONS = [
  { id: 'tx-1', merchant: 'Circle K', amount: 156000, date: CURRENT_DATE_ISO, account: 'Visa Credit', score: 0.94 },
  { id: 'tx-2', merchant: 'Family Mart', amount: 150000, date: CURRENT_DATE_ISO, account: 'Cash', score: 0.72 },
];


export function getOcrMockReceipt() { return OCR_MOCK_RECEIPT; }
export function getOcrMockItem() { return OCR_MOCK_ITEM; }
export function getOcrMockTrip() { return OCR_MOCK_TRIP; }
export function getOcrCandidateTransactions() { return OCR_CANDIDATE_TRANSACTIONS; }
