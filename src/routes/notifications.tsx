import { FadeInUp } from "@/components/ui/animations";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/phone-frame";
import { Wallet, Users, Settings, CheckCheck, Bell } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

type NType = "finance" | "social" | "system";

type Notif = {
  id: string;
  type: NType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  action?: string;
};

const INITIAL: Notif[] = [
  { id: "n1", type: "finance", title: "Cảnh báo ngân sách", body: "Danh mục Ăn uống đã dùng 92% ngân sách tháng.", time: "5 phút", unread: true, action: "Xem chi tiết" },
  { id: "n2", type: "finance", title: "Giao dịch lớn", body: "-2.450.000₫ tại Shopee vừa được ghi nhận.", time: "1 giờ", unread: true, action: "Kiểm tra" },
  { id: "n3", type: "social", title: "Minh chia sẻ với bạn", body: "Nhóm ăn tối 08/04 đã cập nhật hoá đơn mới.", time: "3 giờ", unread: true, action: "Mở nhóm" },
  { id: "n4", type: "social", title: "Yêu cầu duyệt chia sẻ", body: "An muốn tham gia nhóm Du lịch Đà Lạt.", time: "Hôm qua", unread: false, action: "Xét duyệt" },
  { id: "n5", type: "system", title: "Sao lưu hoàn tất", body: "Dữ liệu tháng 3 đã được sao lưu an toàn.", time: "Hôm qua", unread: false },
  { id: "n6", type: "finance", title: "Mục tiêu tiết kiệm", body: "Bạn đã đạt 70% mục tiêu “iPhone mới” 🎉", time: "2 ngày", unread: false, action: "Xem mục tiêu" },
  { id: "n7", type: "system", title: "Bản cập nhật mới", body: "v2.4 mang đến OCR nhanh gấp đôi.", time: "3 ngày", unread: false },
];

const META: Record<NType, { label: string; icon: typeof Bell; color: string; bg: string }> = {
  finance: { label: "Tài chính", icon: Wallet, color: "text-[#B5828C]", bg: "bg-[#FFE9D9]" },
  social: { label: "Xã hội", icon: Users, color: "text-[#c026d3]", bg: "bg-[#fae8ff]" },
  system: { label: "Hệ thống", icon: Settings, color: "text-foreground/70", bg: "bg-foreground/5" },
};

const TABS: { key: "all" | NType; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "finance", label: "Tài chính" },
  { key: "social", label: "Xã hội" },
  { key: "system", label: "Hệ thống" },
];

function NotificationsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [items, setItems] = useState(INITIAL);

  const filtered = items.filter((n) => tab === "all" || n.type === tab);
  const unreadCount = items.filter((n) => n.unread).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("Đã đánh dấu tất cả là đã đọc");
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  return (
    <FadeInUp className="h-full flex flex-col w-full flex-1">
    <PhoneFrame
      title="Thông báo"
      subtitle={unreadCount ? `${unreadCount} chưa đọc` : "Đã đọc tất cả"}
      right={
        unreadCount ? (
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1 rounded-full bg-[#FFE9D9] px-3 py-1.5 font-sans text-[11px] font-semibold text-[#B5828C] transition active:scale-95"
          >
            <CheckCheck className="h-3.5 w-3.5" /> Đọc tất cả
          </button>
        ) : null
      }
    >
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full px-4 py-1.5 font-sans text-[12px] font-semibold transition ${
              tab === t.key ? "bg-[#B5828C] text-white shadow-sm" : "border border-white/80 bg-white/70 text-foreground/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 px-5 pb-10">
        {filtered.map((n) => {
          const m = META[n.type];
          const Icon = m.icon;
          return (
            <button
              type="button"
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full rounded-[20px] border p-4 text-left shadow-[0_4px_14px_-8px_rgba(46,107,138,0.2)] transition active:scale-[0.99] ${
                n.unread ? "border-[#B5828C]/20 bg-white" : "border-transparent bg-white/60"
              }`}
            >
              <div className="flex gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${m.bg} ${m.color}`}>
                  <Icon className="h-4 w-4" strokeWidth={2.4} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-display text-[14px] font-bold text-foreground">{n.title}</h3>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="font-sans text-[10px] font-medium text-foreground/45">{n.time}</span>
                      {n.unread && <span className="h-2 w-2 rounded-full bg-[#f87171]" />}
                    </div>
                  </div>
                  <p className="mt-1 font-sans text-[12px] leading-snug text-foreground/65">{n.body}</p>
                  {n.action && (
                    <span className="mt-2 inline-block rounded-full bg-[#FFE9D9] px-2.5 py-1 font-sans text-[11px] font-semibold text-[#B5828C]">
                      {n.action}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        {!filtered.length && (
          <p className="mt-10 text-center font-sans text-[13px] text-foreground/50">Chưa có thông báo nào.</p>
        )}
      </div>
    </PhoneFrame>
    </FadeInUp>
  );
}
