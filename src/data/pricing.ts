import type { LucideIcon } from "lucide-react";
import { Sparkles, Zap, Crown, Check } from "lucide-react";

export type PlanTier = "free" | "plus" | "pro";

export interface PricingPlan {
  id: PlanTier;
  name: string;
  icon: LucideIcon;
  monthlyPrice: number;
  yearlyPrice: number | null;
  badge: string | null;
  accent: string;
  bg: string;
  features: string[];
  description: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    icon: Sparkles,
    monthlyPrice: 0,
    yearlyPrice: null,
    badge: null,
    accent: "#B5828C",
    bg: "#FFE9D9",
    description: "Ghi chép chi tiêu cơ bản, phù hợp cho người mới bắt đầu quản lý tài chính.",
    features: [
      "Ghi chép giao dịch không giới hạn",
      "1 ví (tài khoản)",
      "Báo cáo chi tiêu cơ bản",
      "Nhật ký mua sắm (5 ảnh/tháng)",
      "Quảng cáo hiển thị",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    icon: Zap,
    monthlyPrice: 19000,
    yearlyPrice: 199000,
    badge: "Phổ biến nhất",
    accent: "#15803d",
    bg: "#dcfce7",
    description: "Cảnh báo thông minh, dự báo dòng tiền và nhật ký mua sắm không giới hạn.",
    features: [
      "Mọi tính năng Free",
      "Không quảng cáo",
      "Ví không giới hạn",
      "Cảnh báo thông minh & ngân sách",
      "Dự báo runway tài chính",
      "Nhật ký mua sắm không giới hạn",
      "Chia sẻ vòng tròn (Locket-style)",
      "OCR hoá đơn (30 lần/tháng)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    monthlyPrice: 39000,
    yearlyPrice: 399000,
    badge: "Toàn diện",
    accent: "#6d28d9",
    bg: "#ede9fe",
    description: "Phân tích dự đoán nâng cao, đồng bộ đa thiết bị và hỗ trợ ưu tiên.",
    features: [
      "Mọi tính năng Plus",
      "OCR hoá đơn không giới hạn",
      "Phân tích dự đoán AI",
      "Đồng bộ đa thiết bị",
      "Xuất dữ liệu PDF / Excel",
      "Hỗ trợ ưu tiên 24/7",
      "Truy cập sớm tính năng mới",
    ],
  },
];

export const TRIAL_DAYS = 14;

// Điểm nối API: thay thân hàm bằng fetch() khi có backend.
export function getPricingPlans(): PricingPlan[] {
  return PRICING_PLANS;
}

export function findPricingPlan(id: string): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.id === id);
}

export function getTrialDays(): number {
  return TRIAL_DAYS;
}
