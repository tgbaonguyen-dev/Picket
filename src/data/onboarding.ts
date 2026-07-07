import { Wallet, Archive, Map, Users, LayoutGrid, GraduationCap, Briefcase, Home, Coffee, Store, Lock, Share2, DownloadCloud, LucideIcon } from "lucide-react";

export interface GoalOption { id: string; label: string; icon: LucideIcon; color: string; bg: string; }
export const GOAL_OPTIONS: GoalOption[] = [
  { id: 'finance', label: 'Quản lý chi tiêu cá nhân', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'assets', label: 'Theo dõi tài sản, đồ đạc', icon: Archive, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'trips', label: 'Ghi chép chuyến đi', icon: Map, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'family', label: 'Dùng chung với gia đình', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'all', label: 'Tất cả nhu cầu trên', icon: LayoutGrid, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export interface PersonaOption { id: string; label: string; desc: string; icon: LucideIcon; color: string; bg: string; }
export const PERSONA_OPTIONS: PersonaOption[] = [
  { id: 'student', label: 'Sinh viên', desc: 'Sống xa nhà, cần tiết kiệm', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'fresh', label: 'Người mới đi làm', desc: 'Thu nhập đầu tiên, lập ngân sách', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'family', label: 'Đã có gia đình', desc: 'Quản lý thu chi chung, mua sắm', icon: Home, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'freelancer', label: 'Freelancer', desc: 'Thu nhập không cố định', icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'business', label: 'Kinh doanh tự do', desc: 'Theo dõi dòng tiền kinh doanh', icon: Store, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export interface PrivacyPrinciple { icon: LucideIcon; title: string; desc: string; accent: string; bg: string; }
export const PRIVACY_PRINCIPLES: PrivacyPrinciple[] = [
  {
    icon: Lock,
    title: "Riêng tư mặc định",
    desc: "Mọi khoảnh khắc và giao dịch chỉ hiện với bạn cho đến khi bạn chủ động chia sẻ.",
    accent: "#B5828C",
    bg: "#FFE9D9",
  },
  {
    icon: Share2,
    title: "Bạn kiểm soát chia sẻ",
    desc: "Chọn từng mục, từng người nhận. Không tự động đăng, không gợi ý cho người lạ.",
    accent: "#b03a4a",
    bg: "#ffe4e6",
  },
  {
    icon: DownloadCloud,
    title: "Xuất & xoá bất cứ lúc nào",
    desc: "Tải toàn bộ dữ liệu về máy hoặc xoá vĩnh viễn chỉ với một chạm.",
    accent: "#15803d",
    bg: "#dcfce7",
  },
];


export function getGoalOptions() { return GOAL_OPTIONS; }
export function getPersonaOptions() { return PERSONA_OPTIONS; }
export function getPrivacyPrinciples() { return PRIVACY_PRINCIPLES; }
