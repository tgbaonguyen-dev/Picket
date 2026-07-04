import { Signal, Wifi, BatteryFull, ChevronLeft, Home, Wallet, PieChart, CalendarDays, Camera } from "lucide-react";
import { useRouter, useRouterState, useCanGoBack, Link } from "@tanstack/react-router";
import { vibrateLight, vibrateMedium } from "@/lib/haptic";
import { QuickAddSheet } from "@/components/quick-add-sheet";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { to: "/", label: "Trang chủ", icon: Home, match: (p: string) => p === "/" },
  { to: "/transactions", label: "Giao dịch", icon: Wallet, match: (p: string) => p.startsWith("/transactions") || p.startsWith("/expenses") },
  { to: "/budgets", label: "Ngân sách", icon: PieChart, match: (p: string) => p.startsWith("/budgets") },
  { to: "/bills", label: "Hoá đơn", icon: CalendarDays, match: (p: string) => p.startsWith("/bills") || p.startsWith("/inbox") || p.startsWith("/notifications") },
] as const;

/**
 * Shared bottom navigation. Rendered by PhoneFrame automatically,
 * and can also be used standalone on custom-chrome screens (e.g. Home)
 * to keep the nav 100% identical across the app.
 */
export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="absolute inset-x-3 bottom-[max(env(safe-area-inset-bottom),12px)] sm:bottom-3 z-20 rounded-[28px] border border-white/70 bg-white/85 px-2 py-2 shadow-[0_10px_30px_-12px_rgba(74,44,42,0.35)] backdrop-blur-xl">
      <ul className="grid grid-cols-5 items-end">
        {NAV_ITEMS.slice(0, 2).map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={to}>
              <Link
                to={to}
                onClick={() => {
                  if (!active) vibrateLight();
                }}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 transition ${
                  active ? "text-[#B5828C]" : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-2xl transition ${active ? "bg-[#FFE4D2]" : "bg-transparent"}`}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className="text-[9px] font-semibold tracking-tight">{label}</span>
              </Link>
            </li>
          );
        })}

        {/* Center camera FAB */}
        <li className="flex justify-center">
          <QuickAddSheet>
            <button
              onClick={vibrateMedium}
              aria-label="Thêm nhanh"
              className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#B5828C] to-[#FFB4A2] text-white shadow-[0_12px_24px_-6px_rgba(181,130,140,0.55)] ring-4 ring-white/90 transition active:scale-95"
            >
              <Camera className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </QuickAddSheet>
        </li>

        {NAV_ITEMS.slice(2).map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={to}>
              <Link
                to={to}
                onClick={() => {
                  if (!active) vibrateLight();
                }}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 transition ${
                  active ? "text-[#B5828C]" : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-2xl transition ${active ? "bg-[#FFE4D2]" : "bg-transparent"}`}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className="text-[9px] font-semibold tracking-tight">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function PhoneFrame({
  title,
  subtitle,
  back = true,
  right,
  children,
  scrollClassName = "",
  hideBottomNav = false,
  overlay,
}: {
  title?: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  children: ReactNode;
  scrollClassName?: string;
  hideBottomNav?: boolean;
  overlay?: ReactNode;
}) {
  const router = useRouter();

  const canGoBack = useCanGoBack();

  const goBack = () => {
    if (canGoBack) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-page sm:p-4">
      <div className="relative mx-auto flex h-[100dvh] w-full flex-col overflow-hidden bg-background sm:h-[844px] sm:max-h-[calc(100vh-32px)] sm:min-h-0 sm:max-w-[390px] sm:rounded-[44px] sm:shadow-2xl sm:ring-[6px] sm:ring-white/80">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-peach/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 top-32 h-32 w-32 rounded-full bg-coral/40 blur-3xl" />

        {/* Status bar */}
        <div className="relative z-10 hidden sm:flex shrink-0 items-center justify-between px-7 pt-3 pb-1 text-[12px] font-semibold text-foreground/80">
          <span className="tabular-nums">9:41</span>
          <div className="h-4 w-16 rounded-full bg-foreground/80" />
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Header */}
        {(title || back) && (
          <div className="relative z-10 flex shrink-0 items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),12px)] sm:pt-3 pb-4">
            {back && (
              <button
                type="button"
                onClick={() => {
                  vibrateLight();
                  goBack();
                }}
                aria-label="Quay lại"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-foreground shadow-sm backdrop-blur-md transition active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
              </button>
            )}
            <div className="min-w-0 flex-1">
              {subtitle && (
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-mauve">
                  {subtitle}
                </p>
              )}
              {title && (
                <h1 className="font-display truncate text-[26px] font-semibold leading-tight tracking-tight text-foreground">
                  {title}
                </h1>
              )}
            </div>
            {right}
          </div>
        )}

        <div className={`relative z-10 flex-1 overflow-y-auto ${hideBottomNav ? "" : "pb-24"} ${scrollClassName}`}>{children}</div>

        {!hideBottomNav && <BottomNav />}

        {overlay}
      </div>
    </main>
  );
}
