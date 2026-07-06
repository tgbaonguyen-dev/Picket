import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Wallet,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Chào mừng · Picket" },
      { name: "description", content: "Khám phá Picket — nhật ký & chi tiêu trong một app duy nhất." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WelcomePage,
});

type Slide = {
  key: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: string;
  bg: string;
  tint: string;
};

const SLIDES: Slide[] = [
  {
    key: "capture",
    title: "Ghi lại\nmỗi khoảnh khắc",
    desc: "Chụp ảnh, viết vài dòng — Picket lưu giữ ngày của bạn theo cách nhẹ nhàng nhất.",
    icon: Camera,
    accent: "#B5828C",
    bg: "#FFE9D9",
    tint: "#FFB4A2",
  },
  {
    key: "money",
    title: "Kiểm soát\nchi tiêu thông minh",
    desc: "Phân loại, theo dõi và hiểu rõ dòng tiền của bạn — không cần bảng tính.",
    icon: Wallet,
    accent: "#b03a4a",
    bg: "#ffe4e6",
    tint: "#fecaca",
  },
  {
    key: "safe",
    title: "Riêng tư\nvà bảo mật",
    desc: "Dữ liệu được mã hóa và xác thực bằng mã PIN gửi qua email — chỉ bạn mới xem được.",
    icon: ShieldCheck,
    accent: "#15803d",
    bg: "#dcfce7",
    tint: "#86efac",
  },
  {
    key: "ready",
    title: "Sẵn sàng\nbắt đầu?",
    desc: "Đăng nhập hoặc tạo tài khoản mới để lưu khoảnh khắc đầu tiên ngay hôm nay.",
    icon: Sparkles,
    accent: "#a16207",
    bg: "#fef3c7",
    tint: "#fde68a",
  },
];

function WelcomePage() {
  const navigate = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const i = Math.round(el.scrollLeft / w);
      setIndex(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const markOnboarded = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("picket.onboarded", "1");
      }
    } catch {
      // ignore
    }
  };
  const finish = () => {
    markOnboarded();
    navigate({ to: "/onboarding-privacy", replace: true });
  };
  const skipToHome = () => {
    markOnboarded();
    navigate({ to: "/", replace: true });
  };
  const goSignIn = () => {
    markOnboarded();
    navigate({ to: "/auth" });
  };

  const isLast = index === SLIDES.length - 1;
  const active = SLIDES[index];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] sm:p-4">
      <div className="relative mx-auto flex h-[100dvh] w-full sm:max-w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-32px)] flex-col overflow-hidden sm:rounded-[44px] bg-[#f4f8fb] sm:shadow-2xl sm:ring-[6px] sm:ring-white">
        {/* Ambient tint follows active slide */}
        <div
          className="pointer-events-none absolute inset-0 transition-colors duration-500"
          style={{
            background: `radial-gradient(120% 60% at 50% 0%, ${active.bg} 0%, transparent 60%)`,
          }}
        />
        <div
          className="pointer-events-none absolute -right-16 top-24 h-56 w-56 rounded-full opacity-50 blur-3xl transition-colors duration-500"
          style={{ backgroundColor: active.tint }}
        />

        <div className="relative flex min-h-[780px] w-full flex-col px-6 pb-6 pt-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/45">
              Picket
            </p>
            <button
              type="button"
              onClick={skipToHome}
              className="rounded-full px-3 py-1.5 font-sans text-[12px] font-semibold text-foreground/55 hover:text-foreground/85"
            >
              Bỏ qua
            </button>
          </div>

          {/* Slides */}
          <div
            ref={scrollerRef}
            className="mt-2 flex flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {SLIDES.map((s) => (
              <div
                key={s.key}
                className="flex min-w-full snap-start flex-col items-center justify-center px-2 text-center"
              >
                <div className="relative">
                  <div
                    className="absolute inset-0 -z-10 rounded-[36px] opacity-70 blur-2xl"
                    style={{ backgroundColor: s.tint }}
                  />
                  <div
                    className="flex h-28 w-28 items-center justify-center rounded-[32px] border border-white/70 bg-white/85 shadow-[0_20px_50px_-20px_rgba(15,42,66,0.35)] backdrop-blur-xl"
                    style={{ color: s.accent }}
                  >
                    <s.icon className="h-12 w-12" strokeWidth={2.1} />
                  </div>
                </div>
                <h1 className="mt-8 whitespace-pre-line font-display text-[28px] font-bold leading-[1.1] tracking-tight text-foreground">
                  {s.title}
                </h1>
                <p className="mt-4 max-w-[300px] font-sans text-[13.5px] font-medium leading-relaxed text-foreground/60">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Đến slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6" : "w-1.5"
                }`}
                style={{
                  backgroundColor:
                    i === index ? active.accent : "rgba(15,42,66,0.15)",
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => (isLast ? finish() : goTo(index + 1))}
              className="flex h-[52px] items-center justify-center gap-2 rounded-2xl font-sans text-[14px] font-bold tracking-wide text-white shadow-[0_18px_40px_-16px_rgba(46,107,138,0.7)] transition active:scale-[0.98]"
              style={{ backgroundColor: active.accent }}
            >
              {isLast ? "Bắt đầu ngay" : "Tiếp tục"}
              <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
            </button>
            <button
              type="button"
              onClick={goSignIn}
              className="font-sans text-[12px] font-semibold text-foreground/60 underline-offset-4 hover:underline"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
