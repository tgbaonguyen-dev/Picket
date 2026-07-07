import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Camera,
  Images,
  Bell,
  MapPin,
  Check,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/onboarding-permissions")({
  head: () => ({
    meta: [
      { title: "Thiết lập quyền · Picket" },
      { name: "description", content: "Cấp quyền camera, thư viện, thông báo và vị trí để Picket hoạt động đầy đủ." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PermissionsPage,
});

type PermStatus = "idle" | "granted" | "skipped";

type Perm = {
  key: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
  fallback: string;
  required?: boolean;
  accent: string;
  bg: string;
};

const PERMS: Perm[] = [
  {
    key: "camera",
    icon: Camera,
    title: "Máy ảnh",
    desc: "Chụp ảnh khoảnh khắc và hoá đơn để ghi giao dịch nhanh.",
    fallback: "Có thể tải ảnh từ thư viện nếu bỏ qua.",
    required: true,
    accent: "#B5828C",
    bg: "#FFE9D9",
  },
  {
    key: "photos",
    icon: Images,
    title: "Thư viện ảnh",
    desc: "Chọn ảnh có sẵn để đính vào nhật ký hoặc hoá đơn.",
    fallback: "Không bắt buộc — có thể chỉ dùng máy ảnh.",
    accent: "#b03a4a",
    bg: "#ffe4e6",
  },
  {
    key: "notifications",
    icon: Bell,
    title: "Thông báo",
    desc: "Nhắc ghi nhật ký cuối ngày và cảnh báo vượt ngân sách.",
    fallback: "Có thể xem thủ công trong app.",
    accent: "#a16207",
    bg: "#fef3c7",
  },
  {
    key: "location",
    icon: MapPin,
    title: "Vị trí (tuỳ chọn)",
    desc: "Tự động gắn địa điểm cho khoảnh khắc và giao dịch.",
    fallback: "Có thể nhập tay địa điểm nếu muốn.",
    accent: "#15803d",
    bg: "#dcfce7",
  },
];

function PermissionsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Record<string, PermStatus>>({
    camera: "idle",
    photos: "idle",
    notifications: "idle",
    location: "idle",
  });

  const finishAll = () => {
    try {
      localStorage.setItem(
        "picket.permissions",
        JSON.stringify(status),
      );
    } catch {
      // ignore
    }
    navigate({ to: "/onboarding-ready" });
  };

  const allDecided = Object.values(status).every((s) => s !== "idle");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] sm:p-4">
      <div className="relative mx-auto flex h-[100dvh] w-full sm:max-w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-32px)] flex-col overflow-hidden sm:rounded-[44px] bg-[#f4f8fb] sm:shadow-2xl sm:ring-[6px] sm:ring-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#ffe4e6]/70 to-transparent" />

        <div className="relative flex flex-1 w-full flex-col px-6 pb-[max(env(safe-area-inset-bottom),32px)] pt-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/45">
              Bước 2 / 3
            </p>
            <button
              type="button"
              onClick={finishAll}
              className="rounded-full px-3 py-1.5 font-sans text-[12px] font-semibold text-foreground/55 hover:text-foreground/85"
            >
              Để sau
            </button>
          </div>

          <div className="mt-4">
            <h1 className="font-display text-[24px] font-bold leading-[1.15] tracking-tight text-foreground">
              Cấp quyền để Picket
              <br />
              phục vụ bạn tốt hơn
            </h1>
            <p className="mt-2 font-sans text-[12.5px] font-medium leading-relaxed text-foreground/60">
              Chỉ dùng khi bạn cho phép. Có thể thay đổi bất cứ lúc nào trong Cài đặt.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            {PERMS.map((p) => {
              const s = status[p.key];
              return (
                <div
                  key={p.key}
                  className="rounded-[22px] border border-white/70 bg-white/75 p-4 backdrop-blur-md"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: p.bg, color: p.accent }}
                    >
                      <p.icon className="h-[19px] w-[19px]" strokeWidth={2.3} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-[14.5px] font-bold leading-tight text-foreground">
                          {p.title}
                        </h3>
                        {p.required && (
                          <span className="rounded-full bg-[#FFE9D9] px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-[#B5828C]">
                            khuyên dùng
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-sans text-[12px] font-medium leading-snug text-foreground/60">
                        {p.desc}
                      </p>
                      <p className="mt-1.5 font-sans text-[10.5px] font-medium italic text-foreground/40">
                        {p.fallback}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {s === "idle" ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setStatus((prev) => ({ ...prev, [p.key]: "granted" }))
                          }
                          className="flex-1 rounded-xl bg-foreground py-2 font-sans text-[12px] font-bold text-white transition active:scale-[0.98]"
                        >
                          Cho phép
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setStatus((prev) => ({ ...prev, [p.key]: "skipped" }))
                          }
                          className="rounded-xl border border-foreground/10 px-3 py-2 font-sans text-[12px] font-semibold text-foreground/60 transition active:scale-[0.98]"
                        >
                          Không phải bây giờ
                        </button>
                      </>
                    ) : s === "granted" ? (
                      <div className="flex flex-1 items-center justify-between rounded-xl bg-[#dcfce7] px-3 py-2">
                        <span className="flex items-center gap-1.5 font-sans text-[12px] font-bold text-[#15803d]">
                          <Check className="h-4 w-4" strokeWidth={2.6} />
                          Đã cho phép
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setStatus((prev) => ({ ...prev, [p.key]: "idle" }))
                          }
                          className="font-sans text-[11px] font-semibold text-[#15803d]/70 underline"
                        >
                          Đổi
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-between rounded-xl bg-foreground/5 px-3 py-2">
                        <span className="flex items-center gap-1.5 font-sans text-[12px] font-bold text-foreground/55">
                          <X className="h-4 w-4" strokeWidth={2.6} />
                          Đã bỏ qua
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setStatus((prev) => ({ ...prev, [p.key]: "idle" }))
                          }
                          className="font-sans text-[11px] font-semibold text-foreground/55 underline"
                        >
                          Đổi
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={finishAll}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#B5828C] font-sans text-[14px] font-bold tracking-wide text-white shadow-[0_18px_40px_-16px_rgba(46,107,138,0.7)] transition active:scale-[0.98]"
            >
              {allDecided ? "Xong, tiếp tục" : "Tiếp tục"}
              {allDecided ? (
                <Sparkles className="h-4 w-4" strokeWidth={2.6} />
              ) : (
                <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
