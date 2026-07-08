import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  User,
  Plus,
  Camera,
  Banknote,
  Landmark,
  CreditCard,
  Building2,
  Wallet,
  Wallet as WalletIcon,
  ArrowRightLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightCircle,
  ScanLine,
  ChevronLeft,
  ChevronRight,
  Settings,
  Flame,
  Eye,
  EyeOff,
  TrendingUp,
  Sparkles,
  Lightbulb,
  Box,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BottomNav, PhoneFrame } from "@/components/phone-frame";
import { Skeleton } from "@/components/ui/skeleton";
import { getAccounts, getTransactions, formatVND , CURRENT_MONTH_STR, CURRENT_MONTH_SHORT, CURRENT_DATE_ISO, CURRENT_YEAR, getWeekdays} from "@/data";
import { PullToRefresh } from "@/components/pull-to-refresh";
import { TransactionRow } from "@/components/transaction-row";
import { Squish, FadeInUp } from "@/components/ui/animations";
import { staggerDelay } from "@/lib/motion";
import { vibrateLight, vibrateMedium } from "@/lib/haptic";

export const Route = createFileRoute("/")(  {
  component: Index,
});

type DayEntry = {
  day: number;
  photos?: string[];
};



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
                alt="Ảnh hoá đơn"
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
      className="relative flex h-[62px] flex-col items-center pt-2 rounded-xl transition active:scale-[0.97] hover:bg-white/60"
    >
      {inner}
    </Link>
  );
}

function Index() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("bạn");
  const [maskBalance, setMaskBalance] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
      vibrateLight();
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const totalAssets = getAccounts().filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalDebts = getAccounts().filter(a => a.balance < 0).reduce((s, a) => s + a.balance, 0);
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
      if (typeof window !== "undefined" && !localStorage.getItem("picket.onboarded")) {
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
          .eq("id", userId!)
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

  // Recent transactions (top 5)
  const recentTxs = getTransactions().slice(0, 5);


  return (
    <PhoneFrame
      hideBottomNav={false}
      back={false}
      containerClassName="bg-[#F5E8DA]"
      frameClassName="bg-[#FFF8F0]"
      scrollClassName="[&::-webkit-scrollbar]:hidden"
    >
      {/* Upper fluid sky layer — header only */}
          <div className="relative overflow-hidden rounded-b-[40px] bg-[#FFE9D9] pb-5 pt-[max(env(safe-area-inset-top),40px)] sm:pt-8 shadow-[0_20px_40px_-30px_rgba(46,107,138,0.35)]">
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
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-foreground/80 shadow-sm backdrop-blur-md transition active:scale-[0.97]"
                >
                  <Search className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  aria-label="Thông báo"
                  onClick={() => navigate({ to: "/notifications" })}
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-foreground/80 shadow-sm backdrop-blur-md transition active:scale-[0.97]"
                >
                  <Bell className="h-[18px] w-[18px]" strokeWidth={2.2} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#dc2626] font-sans text-[9px] font-bold text-white shadow-sm ring-2 ring-[#FFE9D9]">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {signedIn ? (
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/profile" })}
                    aria-label="Hồ sơ & cài đặt"
                    title="Hồ sơ"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-white bg-[#ffe4e6] text-[#B5828C] shadow-sm transition active:scale-[0.97]"
                  >
                    <User className="h-5 w-5" strokeWidth={2.2} />
                  </button>
                ) : (
                  <Squish
                    as="button"
                    type="button"
                    onClick={() => navigate({ to: "/auth" })}
                    aria-label="Đăng nhập"
                    title="Đăng nhập"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-white bg-[#ffe4e6] text-[#B5828C] shadow-sm transition-colors"
                  >
                    <User className="h-5 w-5" strokeWidth={2.2} />
                  </Squish>
                )}
              </div>
            </div>
          </div>

          {/* Financial Widget — visible right below header */}
          <div className="relative mx-5 mt-5 mb-3">
            <div className="flex items-center gap-2">
              <p className="text-[12px] font-medium uppercase tracking-widest text-foreground/50">Tổng tài sản ròng</p>
              <Squish as="button" onClick={() => setMaskBalance(!maskBalance)} className="text-foreground/40 transition-transform">
                {maskBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Squish>
            </div>
            {isLoading ? (
              <div className="mt-2 space-y-2">
                <Skeleton className="h-9 w-48 rounded-xl bg-black/5" />
                <Skeleton className="h-4 w-32 rounded-lg bg-black/5" />
              </div>
            ) : (
              <>
                <p className="font-display mt-1 text-[38px] font-bold leading-none tracking-tight text-foreground">
                  {maskBalance ? "•••••• ₫" : formatVND(netWorth)}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-income">
                  <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                  <span>+2.4% so với tháng trước</span>
                </div>
              </>
            )}
          </div>
          
          {/* Summary Card (Tháng này) */}
          <div className="mx-5 mb-5 flex items-center justify-between rounded-3xl border border-white/60 bg-white/50 p-4 shadow-sm backdrop-blur-md">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-foreground/50">Thu nhập</p>
              <p className="font-display text-[15px] font-bold text-income tabular-nums">{maskBalance ? "•••••• ₫" : "+24.500.000 ₫"}</p>
            </div>
            <div className="h-8 w-px bg-foreground/10" />
            <div className="text-right">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-foreground/50">Chi tiêu</p>
              <p className="font-display text-[15px] font-bold text-expense tabular-nums">{maskBalance ? "•••••• ₫" : "-12.450.000 ₫"}</p>
            </div>
          </div>

          {/* Wallets Scroller */}
          <div className="relative w-full overflow-x-auto pb-4 pl-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex gap-3 pr-5 w-max">
              {getAccounts().map(account => {
                const Icon = getIconForType(account.type);
                const isDebt = account.balance < 0;
                return (
                  <Squish key={account.id}>
                    <Link to="/wallets" className="flex w-[140px] flex-col rounded-3xl bg-white/60 p-3.5 shadow-sm backdrop-blur-md transition-colors border border-white/40">
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${getColor(account.type)}`}>
                        <Icon className="h-5 w-5" strokeWidth={2.2} />
                      </div>
                      <p className="font-sans text-[12px] font-semibold text-foreground/70 line-clamp-1">{account.name}</p>
                      <p className={`mt-0.5 font-display text-[15px] font-bold tabular-nums ${isDebt ? "text-expense" : "text-foreground"}`}>
                        {maskBalance ? "•••••• ₫" : <>{isDebt ? "−" : ""}{formatVND(Math.abs(account.balance))}</>}
                      </p>
                    </Link>
                  </Squish>
                )
              })}
            </div>
          </div>



          {/* Manage Items */}
          <div className="mx-5 mb-6">
            <Link to="/items" className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/50 p-4 shadow-sm backdrop-blur-md transition active:scale-[0.97]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#B5828C]/10 text-[#B5828C]">
                  <Box className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <div>
                  <p className="font-display text-[15px] font-bold text-foreground">Kho tài sản</p>
                  <p className="font-sans text-[12px] text-foreground/60">Quản lý đồ đạc, bảo hành</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-foreground/40" />
            </Link>
          </div>

          {/* Smart Insight (Demo) */}
          <div className="mx-5 mb-6 rounded-3xl border border-[#B5828C]/20 bg-gradient-to-br from-[#FFE9D9]/80 to-[#ffe4e6]/80 p-4 shadow-sm backdrop-blur-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Sparkles className="h-20 w-20 text-[#B5828C]" />
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#B5828C] shadow-sm">
                <Lightbulb className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#B5828C]">
                  Gợi ý cho bạn
                </p>
                <p className="mt-1 font-sans text-[13px] font-medium leading-relaxed text-foreground/80">
                  {(() => {
                    const foodSpent = getTransactions().filter(t => t.category === "Ăn uống" && t.type === "expense").reduce((s, t) => s + t.amount, 0);
                    return (
                      <>Bạn đã chi <strong className="text-foreground">{formatVND(foodSpent)}</strong> cho Ăn uống tháng này. Vượt 15% so với tháng trước. Hãy cân nhắc nấu ăn tại nhà vài ngày tới nhé!</>
                    );
                  })()}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mx-5 mb-6">
            <div className="mb-3 flex items-baseline justify-between px-1">
              <h2 className="font-display text-[16px] font-bold text-foreground">Giao dịch gần đây</h2>
              <Link to="/transactions" className="font-sans text-[11px] font-semibold text-[#B5828C]">
                Xem tất cả →
              </Link>
            </div>
            
            {isLoading ? (
              <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-sm p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-2xl bg-black/5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24 rounded-lg bg-black/5" />
                      <Skeleton className="h-3 w-16 rounded-lg bg-black/5" />
                    </div>
                    <Skeleton className="h-4 w-20 rounded-lg bg-black/5" />
                  </div>
                ))}
              </div>
            ) : recentTxs.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {recentTxs.map((t, i) => {
                  return (
                    <FadeInUp key={t.id} delay={staggerDelay(i)}>
                      <Link
                        to="/transactions/$id"
                        params={{ id: t.id }}
                        className="block"
                      >
                        <TransactionRow
                          transaction={t}
                          maskBalance={maskBalance}
                        />
                      </Link>
                    </FadeInUp>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/70 bg-white/80 p-8 text-center shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#B5828C]/10 text-[#B5828C]">
                  <ScanLine className="h-6 w-6" />
                </div>
                <h3 className="font-display text-[15px] font-bold text-foreground">Chưa có giao dịch</h3>
                <p className="mt-1 max-w-[200px] text-[12px] text-foreground/60">
                  Hãy quét hóa đơn đầu tiên của bạn để bắt đầu theo dõi chi tiêu nhé!
                </p>
                <button
                  onClick={() => navigate({ to: "/capture-receipt" })}
                  className="mt-4 rounded-xl bg-[#dc2626] px-4 py-2 text-[13px] font-bold text-white active:scale-[0.97] transition"
                >
                  Quét hóa đơn ngay
                </button>
              </div>
            )}
          </div>

          {/* Photo Journal & Calendar Section */}
          <div className="px-5 pb-32">
            {/* Hero card — Spending Diary */}
            <div className="relative mb-6 rounded-[32px] border border-white/60 bg-white/55 p-5 backdrop-blur-md shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/55">
                      Nhật ký chi tiêu
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-700">
                      <Flame className="h-3 w-3" strokeWidth={3} />
                      14 ngày
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="font-display text-[40px] font-bold leading-none text-foreground tabular-nums">
                      {daysLogged}
                    </span>
                    <span className="font-sans text-[13px] font-medium text-foreground/55">
                      / {target} ngày ghi chép
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-[#B5828C]" strokeWidth={2.2} />
                    <span className="font-sans text-[12px] font-semibold text-foreground/75 tabular-nums">
                      {totalPhotos} hoá đơn & ảnh
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
                🎉 Bạn ghi chép đều hơn <span className="font-bold text-foreground">12 ngày</span> so với tháng trước.
              </p>
            </div>

            {/* Calendar */}
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <h2 className="font-display text-[20px] font-bold leading-none tracking-tight text-foreground">
                  {CURRENT_MONTH_SHORT}
                </h2>
                <p className="mt-1 font-sans text-[11px] font-medium text-foreground/50">
                  Nhấn vào ngày để xem hoá đơn & ghi chép
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Tháng trước"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-foreground/70 shadow-sm transition active:scale-[0.97]"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  aria-label="Tháng sau"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-foreground/70 shadow-sm transition active:scale-[0.97]"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="rounded-[24px] bg-white/60 p-3 backdrop-blur-sm">
              <div className="grid grid-cols-7 gap-y-0.5 text-center">
                {getWeekdays().map((d) => (
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
                <span className="h-2 w-2 rounded-full bg-[#f9a8a8]" /> Có hoá đơn/ảnh
              </span>
            </div>
          </div>
    </PhoneFrame>
  );
}
