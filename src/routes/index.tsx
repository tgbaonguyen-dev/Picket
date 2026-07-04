import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  User,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Camera,
  Signal,
  Wifi,
  BatteryFull,
  Search,
  Banknote,
  Landmark,
  CreditCard,
  Wallet as WalletIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  ScanLine
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BottomNav } from "@/components/phone-frame";
import { ACCOUNTS, formatVND } from "@/lib/mock-transactions";

export const Route = createFileRoute("/")({
  component: Index,
});

type DayEntry = {
  day: number;
  photos?: string[];
};

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// April 2026 — starts on Wednesday. 30 days.
const LEADING_BLANKS = 2;
const DAYS_IN_MONTH = 30;
const TODAY = 15;

const photo = (seed: string) => `https://picsum.photos/seed/${seed}/80/80`;

const ENTRIES: Record<number, DayEntry> = {
  1: { day: 1, photos: [photo("a1"), photo("a2")] },
  2: { day: 2, photos: [photo("b1")] },
  3: { day: 3, photos: [photo("c1"), photo("c2"), photo("c3")] },
  6: { day: 6, photos: [photo("d1")] },
  7: { day: 7, photos: [photo("e1"), photo("e2")] },
  8: { day: 8, photos: [photo("f1")] },
  9: { day: 9, photos: [photo("g1")] },
  10: { day: 10, photos: [photo("h1"), photo("h2")] },
  13: { day: 13, photos: [photo("i1")] },
  14: { day: 14, photos: [photo("j1"), photo("j2")] },
  15: { day: 15, photos: [photo("k1"), photo("k2"), photo("k3"), photo("k4")] },
  16: { day: 16, photos: [photo("l1")] },
  17: { day: 17, photos: [photo("m1"), photo("m2"), photo("m3")] },
  20: { day: 20, photos: [photo("n1")] },
  21: { day: 21, photos: [photo("o1"), photo("o2")] },
  22: { day: 22, photos: [photo("p1")] },
  23: { day: 23, photos: [photo("q1"), photo("q2")] },
  24: { day: 24, photos: [photo("r1")] },
};

function DayCell({ entry, day }: { entry?: DayEntry; day: number }) {
  const photos = entry?.photos ?? [];
  const shown = photos.slice(0, 2);
  const extra = photos.length - shown.length;
  const isToday = day === TODAY;
  const isBlank = day <= 0;

  const inner = (
    <>
      <span
        className={`z-10 font-sans text-[12px] font-semibold leading-none tabular-nums ${
          isBlank
            ? "text-transparent"
            : isToday
              ? "flex h-6 w-6 items-center justify-center rounded-full bg-[#B5828C] text-white shadow-md shadow-[#B5828C]/25"
              : "text-foreground/85"
        }`}
      >
        {isBlank ? "·" : day}
      </span>

      {shown.length > 0 && (
        <div className="relative mt-2 h-8 w-9">
          {shown.map((src, i) => {
            const rot = ["-rotate-[10deg]", "rotate-[8deg]"][i];
            const pos = i === 0 ? "left-0 top-0.5" : "right-0 top-0";
            return (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                className={`absolute h-7 w-7 rounded-[7px] border-2 border-white object-cover shadow-[0_2px_6px_-2px_rgba(46,107,138,0.45)] ${rot} ${pos}`}
                style={{ zIndex: i + 1 }}
              />
            );
          })}
          {extra > 0 && (
            <span className="absolute -right-1.5 -top-1.5 z-20 flex h-4 min-w-[18px] items-center justify-center rounded-full border-[1.5px] border-white bg-[#f9a8a8] px-1 font-sans text-[9px] font-bold leading-none text-white shadow-sm">
              +{extra}
            </span>
          )}
        </div>
      )}
    </>
  );

  if (isBlank) {
    return <div className="relative flex h-[62px] flex-col items-center pt-2">{inner}</div>;
  }

  return (
    <Link
      to="/monthly-wrap"
      aria-label={`Xem ngày ${day}`}
      className="relative flex h-[62px] flex-col items-center pt-2 rounded-xl transition active:scale-95 hover:bg-white/60"
    >
      {inner}
    </Link>
  );
}

function Index() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  const totalAssets = ACCOUNTS.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalDebts = ACCOUNTS.filter(a => a.balance < 0).reduce((s, a) => s + a.balance, 0);
  const netWorth = totalAssets + totalDebts;

  function getIconForType(type: string) {
    switch (type) {
      case "cash": return Banknote;
      case "bank": return Landmark;
      case "ewallet": return WalletIcon;
      case "credit": return CreditCard;
      default: return WalletIcon;
    }
  }

  function getColor(type: string) {
    switch (type) {
      case "cash": return "bg-emerald-100 text-emerald-700";
      case "bank": return "bg-red-100 text-red-700";
      case "ewallet": return "bg-pink-100 text-pink-700";
      case "credit": return "bg-blue-100 text-blue-700";
      default: return "bg-foreground/10 text-foreground";
    }
  }

  useEffect(() => {
    // First-visit onboarding
    try {
      if (typeof window !== "undefined" && !localStorage.getItem("canmoney.onboarded")) {
        navigate({ to: "/welcome", replace: true });
        return;
      }
    } catch {
      // ignore
    }
  }, [navigate]);

  useEffect(() => {
    let mounted = true;
    async function load(userId: string | undefined, meta: Record<string, unknown> | undefined, email: string | null | undefined) {
      if (!mounted) return;
      
      const isMock = localStorage.getItem("mock_user") === "true";
      
      if (userId || isMock) {
        setSignedIn(true);
        if (isMock) {
          setDisplayName("Bạn");
          return;
        }

        const { data } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", userId)
          .maybeSingle();
        const fallback =
          (meta?.display_name as string | undefined) ??
          (meta?.full_name as string | undefined) ??
          (meta?.name as string | undefined) ??
          (email ? email.split("@")[0] : "bạn");
        if (mounted) setDisplayName(data?.display_name ?? fallback);
      }
    }
    supabase.auth.getUser().then(({ data }) => {
      load(data.user?.id, data.user?.user_metadata, data.user?.email);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      load(session?.user?.id, session?.user?.user_metadata, session?.user?.email);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Đã đăng xuất");
  }

  const cells: (DayEntry | undefined)[] = [
    ...Array(LEADING_BLANKS).fill(undefined),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => ENTRIES[i + 1] ?? { day: i + 1 }),
  ];

  const daysLogged = Object.keys(ENTRIES).length;
  const totalPhotos = Object.values(ENTRIES).reduce(
    (s, e) => s + (e.photos?.length ?? 0),
    0,
  );
  const target = 30;
  const pct = Math.round((daysLogged / target) * 100);
  const dash = 2 * Math.PI * 26;


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] sm:p-4">
      {/* Phone frame */}
      <div className="relative mx-auto flex h-[100dvh] w-full sm:max-w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-32px)] flex-col overflow-hidden sm:rounded-[44px] bg-[#FFF8F0] sm:shadow-2xl sm:ring-[6px] sm:ring-white">
        {/* Status bar */}
        <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 text-[12px] font-semibold text-foreground/80">
          <span className="tabular-nums">9:41</span>
          <div className="h-4 w-16 rounded-full bg-foreground/80" />
          <div className="flex items-center gap-1 text-foreground/80">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Upper fluid sky layer — header only */}
          <div className="relative rounded-b-[40px] bg-[#FFE9D9] pb-5 pt-[max(env(safe-area-inset-top),40px)] sm:pt-8 shadow-[0_20px_40px_-30px_rgba(46,107,138,0.35)]">
            <div className="pointer-events-none absolute -right-8 -top-4 h-32 w-32 rounded-full bg-[#ffe4e6] opacity-70 blur-2xl" />
            <div className="pointer-events-none absolute -left-6 top-16 h-24 w-24 rounded-full bg-[#f9a8a8] opacity-30 blur-2xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between px-6">
              <div className="min-w-0">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
                  Thứ tư · 15 Tháng 4
                </p>
                <h1 className="font-display mt-1 text-[26px] font-bold leading-tight tracking-tight text-foreground">
                  Chào, {displayName ?? "bạn"} 👋
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Tìm kiếm"
                  onClick={() => navigate({ to: "/search" })}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-foreground/80 shadow-sm backdrop-blur-md transition active:scale-95"
                >
                  <Search className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  aria-label="Thông báo"
                  onClick={() => navigate({ to: "/notifications" })}
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-foreground/80 shadow-sm backdrop-blur-md transition active:scale-95"
                >
                  <Bell className="h-[18px] w-[18px]" strokeWidth={2.2} />
                  <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#f9a8a8] ring-2 ring-white" />
                </button>
                {signedIn ? (
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/profile" })}
                    aria-label="Hồ sơ & cài đặt"
                    title="Hồ sơ"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-white bg-[#ffe4e6] text-[#B5828C] shadow-sm transition active:scale-95"
                  >
                    <User className="h-5 w-5" strokeWidth={2.2} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/auth" })}
                    aria-label="Đăng nhập"
                    title="Đăng nhập"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-white bg-[#ffe4e6] text-[#B5828C] shadow-sm transition active:scale-95"
                  >
                    <User className="h-5 w-5" strokeWidth={2.2} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Financial Widget — visible right below header */}
          <div className="relative mx-5 mt-5 mb-3">
            <p className="text-[12px] font-medium uppercase tracking-widest text-foreground/50">Tổng tài sản ròng</p>
            <p className="font-display mt-1 text-[38px] font-bold leading-none tracking-tight text-foreground">
              {formatVND(netWorth)}
            </p>
          </div>

          {/* Wallets Scroller */}
          <div className="relative w-full overflow-x-auto pb-4 pl-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex gap-3 pr-5 w-max">
              {ACCOUNTS.map(account => {
                const Icon = getIconForType(account.type);
                const isDebt = account.balance < 0;
                return (
                  <Link key={account.id} to="/wallets" className="flex w-[140px] flex-col rounded-3xl bg-white/60 p-3.5 shadow-sm backdrop-blur-md active:scale-95 transition-transform border border-white/40">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${getColor(account.type)}`}>
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <p className="font-sans text-[12px] font-semibold text-foreground/70 line-clamp-1">{account.name}</p>
                    <p className={`mt-0.5 font-display text-[15px] font-bold tabular-nums ${isDebt ? "text-rose-600" : "text-foreground"}`}>
                      {isDebt ? "−" : ""}{formatVND(Math.abs(account.balance))}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mx-5 mt-1 mb-6 grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center justify-center gap-1.5 rounded-3xl bg-white/50 py-3 shadow-sm backdrop-blur-md active:scale-95 transition-transform border border-white/40">
              <ArrowUpCircle className="h-6 w-6 text-emerald-600" strokeWidth={2.2} />
              <span className="text-[11px] font-bold tracking-wide text-foreground/70">Thu nhập</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1.5 rounded-3xl bg-white/50 py-3 shadow-sm backdrop-blur-md active:scale-95 transition-transform border border-white/40">
              <ArrowDownCircle className="h-6 w-6 text-rose-600" strokeWidth={2.2} />
              <span className="text-[11px] font-bold tracking-wide text-foreground/70">Chi tiêu</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1.5 rounded-3xl bg-white/50 py-3 shadow-sm backdrop-blur-md active:scale-95 transition-transform border border-white/40">
              <ScanLine className="h-6 w-6 text-blue-600" strokeWidth={2.2} />
              <span className="text-[11px] font-bold tracking-wide text-foreground/70">Quét hóa đơn</span>
            </button>
          </div>

          {/* Photo Journal & Calendar Section */}
          <div className="px-5 pb-32">
            {/* Hero card */}
            <div className="relative mb-6 rounded-[32px] border border-white/60 bg-white/55 p-5 backdrop-blur-md shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/55">
                    Khoảnh khắc tháng này
                  </span>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="font-display text-[40px] font-bold leading-none text-foreground tabular-nums">
                      {daysLogged}
                    </span>
                    <span className="font-sans text-[13px] font-medium text-foreground/55">
                      / {target} ngày
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-[#B5828C]" strokeWidth={2.2} />
                    <span className="font-sans text-[12px] font-semibold text-foreground/75 tabular-nums">
                      {totalPhotos} tấm ảnh
                    </span>
                  </div>
                </div>

                {/* Progress ring */}
                <div className="relative h-[68px] w-[68px] shrink-0">
                  <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
                    <circle cx="30" cy="30" r="26" fill="none" stroke="#FFE9D9" strokeWidth="6" />
                    <circle
                      cx="30"
                      cy="30"
                      r="26"
                      fill="none"
                      stroke="#B5828C"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={dash}
                      strokeDashoffset={dash * (1 - pct / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-[15px] font-bold leading-none text-foreground tabular-nums">
                      {pct}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex h-1.5 gap-1 overflow-hidden rounded-full bg-[#FFF8F0]">
                <div className="h-full rounded-full bg-[#FFB4A2]" style={{ width: "58%" }} />
                <div className="h-full rounded-full bg-[#f9a8a8]" style={{ width: "22%" }} />
              </div>
              <p className="mt-3 font-sans text-[12px] font-medium text-foreground/65">
                🎉 Nhiều hơn <span className="font-bold text-foreground">12 khoảnh khắc</span> so với tháng trước.
              </p>
            </div>

            {/* Calendar */}
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <h2 className="font-display text-[20px] font-bold leading-none tracking-tight text-foreground">
                  Tháng 4, 2026
                </h2>
                <p className="mt-1 font-sans text-[11px] font-medium text-foreground/50">
                  Nhấn vào ngày để xem lại kỷ niệm
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Tháng trước"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-foreground/70 shadow-sm transition active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  aria-label="Tháng sau"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-foreground/70 shadow-sm transition active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="rounded-[24px] bg-white/60 p-3 backdrop-blur-sm">
              <div className="grid grid-cols-7 gap-y-0.5 text-center">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="pb-2 font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-foreground/40"
                  >
                    {d}
                  </div>
                ))}
                {cells.map((entry, i) => (
                  <DayCell
                    key={i}
                    entry={entry}
                    day={i >= LEADING_BLANKS ? i - LEADING_BLANKS + 1 : 0}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-4 font-sans text-[11px] font-medium text-foreground/55">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#B5828C]" /> Hôm nay
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#f9a8a8]" /> Có ảnh
              </span>
            </div>
          </div>
        </div>

        {/* Bottom nav — shared with PhoneFrame so every screen matches */}
        <BottomNav />
      </div>
    </main>
  );
}
