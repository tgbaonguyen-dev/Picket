import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, Share2, DownloadCloud, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/onboarding-privacy")({
  head: () => ({
    meta: [
      { title: "Quyền riêng tư · Picket" },
      { name: "description", content: "Nguyên tắc riêng tư: private by default, bạn kiểm soát chia sẻ, có thể xuất hoặc xoá dữ liệu." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrivacyPage,
});

const PRINCIPLES = [
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

function PrivacyPage() {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] sm:p-4">
      <div className="relative mx-auto flex h-[100dvh] w-full sm:max-w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-32px)] flex-col overflow-hidden sm:rounded-[44px] bg-[#f4f8fb] sm:shadow-2xl sm:ring-[6px] sm:ring-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#FFE9D9] to-transparent" />
        <div className="pointer-events-none absolute -right-16 top-24 h-56 w-56 rounded-full bg-[#FFB4A2]/40 blur-3xl" />

        <div className="relative flex min-h-[780px] w-full flex-col px-6 pb-6 pt-6">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/45">
              Bước 1 / 3
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/onboarding-permissions" })}
              className="rounded-full px-3 py-1.5 font-sans text-[12px] font-semibold text-foreground/55 hover:text-foreground/85"
            >
              Bỏ qua
            </button>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[32px] bg-[#FFB4A2]/50 blur-2xl" />
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/70 bg-white/85 text-[#B5828C] shadow-[0_20px_50px_-20px_rgba(15,42,66,0.35)] backdrop-blur-xl">
                <ShieldCheck className="h-11 w-11" strokeWidth={2.1} />
              </div>
            </div>
          </div>

          <h1 className="mt-6 text-center font-display text-[26px] font-bold leading-[1.15] tracking-tight text-foreground">
            Dữ liệu là của bạn,
            <br />
            trước hết.
          </h1>
          <p className="mx-auto mt-3 max-w-[300px] text-center font-sans text-[13px] font-medium leading-relaxed text-foreground/60">
            Ba nguyên tắc Picket cam kết trước khi xin bất kỳ quyền nào.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-3 rounded-[22px] border border-white/70 bg-white/75 p-4 backdrop-blur-md"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: p.bg, color: p.accent }}
                >
                  <p.icon className="h-[20px] w-[20px]" strokeWidth={2.3} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[15px] font-bold leading-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-1 font-sans text-[12.5px] font-medium leading-snug text-foreground/60">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={() => navigate({ to: "/onboarding-permissions" })}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#B5828C] font-sans text-[14px] font-bold tracking-wide text-white shadow-[0_18px_40px_-16px_rgba(46,107,138,0.7)] transition active:scale-[0.98]"
            >
              Tôi hiểu, tiếp tục
              <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
            </button>
            <p className="mt-3 text-center font-sans text-[11px] font-medium text-foreground/45">
              Bạn có thể xem lại chính sách bất cứ lúc nào trong Cài đặt.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
