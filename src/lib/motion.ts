// src/lib/motion.ts
// Hệ thống chuyển động "Silk" — mọi animation dùng token từ đây.
import type { Transition, Variants } from "framer-motion";

// ---- Easing chuẩn (ease-out mượt, không nảy) ----
export const EASE_SILK = [0.22, 1, 0.36, 1] as const; // easeOutExpo-ish
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const; // material standard

// ---- Duration tokens (giây, cho framer-motion) ----
export const DUR = {
  fast: 0.18,    // tap feedback, micro
  base: 0.26,    // entrance, page transition (CHUẨN)
  slow: 0.4,     // card lớn, hero
  bar: 0.8,      // progress bar fill
} as const;

// ---- Transition presets ----
export const T_BASE: Transition = { duration: DUR.base, ease: EASE_SILK };
export const T_FAST: Transition = { duration: DUR.fast, ease: EASE_SILK };
export const T_SLOW: Transition = { duration: DUR.slow, ease: EASE_SILK };

// ---- Spring dùng cho cử chỉ (pull-to-refresh, swipe, drag) ----
export const SPRING_SETTLE: Transition = { type: "spring", stiffness: 500, damping: 32 };
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 400, damping: 30 };

// ---- Stagger chuẩn cho danh sách ----
export const STAGGER_STEP = 0.05;      // giây giữa các item
export const STAGGER_MAX_ITEMS = 12;   // sau item thứ 12 không delay thêm (tránh chờ lâu)
export const staggerDelay = (i: number) => Math.min(i, STAGGER_MAX_ITEMS) * STAGGER_STEP;

// ---- Variants dùng lại ----
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: T_BASE },
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_SILK } },
  exit: { opacity: 0, y: -6, transition: { duration: DUR.fast, ease: EASE_SILK } },
};

// ---- Tap scale CHUẨN (thống nhất toàn app) ----
export const TAP_SCALE = 0.97;        // dùng cho whileTap
export const TAP_SCALE_CLASS = "active:scale-[0.97]"; // dùng cho CSS
