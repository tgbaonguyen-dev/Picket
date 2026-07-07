# ✨ PICKET — AGENT BRIEF: HỆ THỐNG ANIMATION ĐỒNG BỘ (VÒNG 5)

> **Ngày:** 07/07/2026
> **Phong cách chốt:** **Silk** — ease-out mượt, không nảy, thanh lịch & sang trọng (giống iOS/Linear)
> **Page transition chốt:** Fade + rise nhẹ (mờ dần + trượt lên 8px)
> **Mục tiêu:** Đồng bộ toàn bộ chuyển động của 57 màn hình + nút + cử chỉ, mượt mà, tỉ mỉ

---

## 1. VẤN ĐỀ HIỆN TẠI (kết quả audit)

| # | Vấn đề | Chi tiết |
|---|--------|----------|
| 1 | **36/57 màn hình không có entrance animation** | Nội dung hiện tức thì (budgets.*, transactions.* trừ index, onboarding.*, auth, profile, categories, notifications, search...) |
| 2 | **5 giá trị tap-scale khác nhau** | `active:scale-95` (68), `[0.98]` (50), `[0.99]` (7), `[0.97]` (2), `scale-90` (1) |
| 3 | **Duration loạn** | Cùng "fade in" chạy 200/300/500ms tùy file |
| 4 | **`Squish` primitive gần như bị bỏ** | Chỉ dùng ở `index.tsx`; nơi khác tự viết CSS `active:scale-*` |
| 5 | **Không có page transition** | `<Outlet/>` cắt cụp giữa route |
| 6 | **Stagger không nhất quán** | Bước 0.05 vs 0.08; có/không base offset |
| 7 | **Không xử lý `prefers-reduced-motion`** | Thiếu — vấn đề accessibility |
| 8 | **5 file import `motion` thừa** | `index.tsx`, `transactions.index.tsx`, `bills.subscriptions.index.tsx`, `items.$id.tsx`, `items.new.tsx` |

---

## 2. MOTION DESIGN SYSTEM — "SILK"

Nguyên tắc: **nhanh, mượt, không nảy**. Ease-out chủ đạo. Chuyển động phục vụ ngữ cảnh, không phô trương.

### 2.1. Tạo file token trung tâm: `src/lib/motion.ts`

```ts
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
```

### 2.2. Bảng token chuẩn hoá

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| **Duration fast** | 180ms | tap feedback, micro-interaction |
| **Duration base** | 260ms | ⭐ entrance, page transition (mặc định) |
| **Duration slow** | 400ms | card lớn, hero card |
| **Duration bar** | 800ms | progress bar, budget bar fill |
| **Easing** | `[0.22, 1, 0.36, 1]` | tất cả (ease-out mượt) |
| **Tap scale** | `0.97` | ⭐ TẤT CẢ nút/card/row (thay hết 95/98/99/90) |
| **Stagger step** | 50ms/item, cap 12 items | danh sách |
| **Spring (cử chỉ)** | stiffness 500, damping 32 | pull-to-refresh, swipe |

---

## 3. NHIỆM VỤ CHI TIẾT

### 🔴 T1. Tạo `src/lib/motion.ts`
Copy nguyên nội dung mục 2.1.

### 🔴 T2. Page transition ở root (`src/routes/__root.tsx`)

Bọc `<Outlet/>` bằng `AnimatePresence` + `motion.div` dùng `pageVariants`, key theo pathname.

```tsx
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { pageVariants } from "@/lib/motion";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineBanner />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="min-h-screen"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
```

> **Lưu ý:** Test kỹ với `capture-receipt` (camera full-screen) và bottom-nav để tránh giật. Nếu `mode="wait"` gây chậm, thử bỏ `mode` hoặc dùng `mode="popLayout"`.

### 🔴 T3. Chuẩn hoá tap-scale toàn bộ → `0.97`

Thay TẤT CẢ biến thể về `active:scale-[0.97]`:

| Tìm | Thay |
|-----|------|
| `active:scale-95` | `active:scale-[0.97]` |
| `active:scale-[0.98]` | `active:scale-[0.97]` |
| `active:scale-[0.99]` | `active:scale-[0.97]` |
| `active:scale-90` | `active:scale-[0.97]` |

Đồng thời đảm bảo mọi phần tử bấm được có class `transition` (để scale mượt). Ví dụ chuẩn:
```tsx
className="... transition active:scale-[0.97]"
```

`Squish` primitive: đổi default `scale` từ `0.96` → `0.97` cho khớp (`src/components/ui/animations.tsx`).

### 🔴 T4. Chuẩn hoá `animations.tsx` dùng token

Sửa `src/components/ui/animations.tsx` để mọi primitive dùng token từ `@/lib/motion` (thay vì hard-code `duration = 0.3`):

```tsx
import { T_BASE, EASE_SILK, DUR } from "@/lib/motion";
// FadeInUp/FadeInLeft/FadeInRight: duration mặc định = DUR.base (0.26), ease = EASE_SILK, y/x = 8
// PopIn: scale 0.96 → 1, duration DUR.base, ease EASE_SILK
// Squish: whileTap scale = 0.97, transition T_FAST
```

### 🟡 T5. Thêm entrance cho 36 màn hình bucket D

Với mỗi màn hình chưa có entrance, bọc nội dung chính bằng `FadeInUp` (hoặc dùng `motion.div` với `fadeRise`). Ưu tiên theo nhóm:

**Nhóm form (budgets.new/edit/method/transfer/close, transactions.new/edit/refund/split/transfer/reconcile/bulk, bills form):**
```tsx
import { FadeInUp } from "@/components/ui/animations";
// Bọc từng section/field group với delay tăng dần:
<FadeInUp delay={0}>...header...</FadeInUp>
<FadeInUp delay={0.06}>...field group 1...</FadeInUp>
<FadeInUp delay={0.12}>...field group 2...</FadeInUp>
```

**Nhóm list (notifications, categories, search-results, transactions.category, budgets.index, wallets, inbox):**
Dùng stagger chuẩn:
```tsx
import { motion } from "framer-motion";
import { fadeRise, staggerDelay } from "@/lib/motion";

{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial="hidden"
    animate="show"
    variants={fadeRise}
    transition={{ ...fadeRise.show.transition, delay: staggerDelay(i) }}
  >
    {/* row content */}
  </motion.div>
))}
```

**Nhóm onboarding + auth (welcome, auth, onboarding-*, reset-password, verify-otp):**
Fade nhẹ toàn khối:
```tsx
<FadeInUp>...toàn bộ nội dung màn...</FadeInUp>
```

### 🟡 T6. Chuẩn hoá stagger về 0.05

Sửa `index.tsx` (đang dùng 0.08) → dùng `staggerDelay()` từ token (0.05). Các list khác dùng `staggerDelay(i)` để nhất quán và tự cap ở 12 item.

### 🟡 T7. Chuẩn hoá CSS entrance duration

Thay các `duration-500` / `duration-200` (dùng cho fade-in nội dung) → thống nhất `duration-300` (gần 260ms nhất trong thang Tailwind). Giữ nguyên `duration-1000`/`duration-700` cho progress bar (đó là chủ ý).

Đề xuất: thêm utility class chung trong `styles.css`:
```css
@utility animate-enter {
  animation: enter 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes enter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 🟢 T8. Reduced-motion (accessibility)

Thêm vào `src/styles.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Và trong page transition, dùng `useReducedMotion()` của framer-motion để tắt `y` offset khi user bật giảm chuyển động:
```tsx
import { useReducedMotion } from "framer-motion";
const reduce = useReducedMotion();
// nếu reduce: chỉ fade opacity, bỏ y
```

### 🟢 T9. Dọn import thừa
Bỏ `import { motion }` không dùng ở: `index.tsx`, `transactions.index.tsx`, `bills.subscriptions.index.tsx`, `items.$id.tsx`, `items.new.tsx`.

---

## 4. CỬ CHỈ (GESTURES) — ĐÃ TỐT, CHỈ ĐỒNG BỘ SPRING

Các component cử chỉ đã làm tốt, chỉ cần thay spring config bằng token chung:

| Component | Hiện tại | Sửa thành |
|-----------|----------|-----------|
| `pull-to-refresh.tsx` | `bounce: 0.2` / `bounce: 0.4` (2 spring khác nhau) | Dùng `SPRING_SETTLE` cho cả kéo về, `SPRING_SOFT` cho lúc thả |
| `swipeable-item.tsx` | `stiffness: 400, damping: 25` | Dùng `SPRING_SETTLE` (500/32) cho nhất quán |

**Pull-to-refresh** (kéo lên để reload): giữ nguyên logic, chỉ đổi transition config sang token. Spinner rotate theo pull distance — giữ nguyên, đã tinh tế.

**Swipe-to-delete**: giữ nguyên, chỉ đổi spring token.

**Bổ sung (nếu muốn tỉ mỉ hơn):** thêm haptic `vibrateLight()` khi pull vượt threshold (hiện chỉ có khi thả).

---

## 5. MICRO-INTERACTIONS (tùy chọn, tăng độ tinh tế)

| Chỗ | Hiệu ứng đề xut |
|-----|------------------|
| Bottom nav active | Icon active: scale 1→1.1 + màu, dùng `layoutId` cho pill nền trượt mượt giữa tab |
| Number/tiền tệ | Đếm tăng dần (count-up) khi vào Home/Budget — dùng `useSpring` + `useTransform` |
| Toast (sonner) | Đã có sẵn richColors, giữ nguyên |
| Skeleton → content | Fade chéo (crossfade) khi loading xong thay vì cắt cụp |
| Budget/progress bar | Fill từ 0 → giá trị với `duration-800 ease-out` khi vào màn (đã có ở vài chỗ, chuẩn hoá hết) |
| Modal/bottom sheet | Slide-up + backdrop fade, dùng spring `SPRING_SETTLE` |

---

## 6. THỨ TỰ THỰC HIỆN

```
Phase 1 — Nền tảng (~1h):
  T1  Tạo src/lib/motion.ts
  T4  Chuẩn hoá animations.tsx dùng token
  T2  Page transition ở __root.tsx
  T8  Reduced-motion trong styles.css

Phase 2 — Chuẩn hoá đồng bộ (~2h):
  T3  Thay toàn bộ tap-scale → 0.97 (find & replace toàn repo)
  T6  Stagger về 0.05 (dùng staggerDelay)
  T7  CSS duration về 300
  T9  Dọn import thừa

Phase 3 — Thêm entrance cho 36 màn (~3h):
  T5  Theo nhóm: form → list → onboarding/auth

Phase 4 — Cử chỉ + micro (~1.5h):
  Mục 4  Đồng bộ spring token
  Mục 5  Micro-interactions (chọn 2-3 cái đắt giá nhất)
```

---

## 7. ACCEPTANCE CRITERIA

- [ ] `src/lib/motion.ts` tồn tại, mọi animation import token từ đó (không còn magic number rải rác)
- [ ] Chuyển route có fade + rise mượt (test 5-6 luồng điều hướng)
- [ ] `grep -rho "active:scale-[^ \"]*"` chỉ còn DUY NHẤT `active:scale-[0.97]`
- [ ] Không còn màn hình nào nội dung "nhảy" ra tức thì — tất cả có entrance
- [ ] Stagger đồng nhất 0.05, tự cap ở 12 item
- [ ] `prefers-reduced-motion` hoạt động (test bằng DevTools > Rendering > Emulate)
- [ ] Không còn `import { motion }` thừa (eslint no-unused-vars sạch)
- [ ] `pnpm build` ✓ và `pnpm lint` ✓
- [ ] Cảm nhận tổng thể: mượt, nhất quán, không giật, không nảy lố

---

## 8. QUY TẮC VÀNG (để giữ đồng bộ về sau)

1. **KHÔNG hard-code duration/easing/scale** trong route. Luôn import từ `@/lib/motion`.
2. Tap feedback: dùng `active:scale-[0.97]` + `transition`, hoặc `<Squish>`.
3. Entrance: dùng `FadeInUp` / `fadeRise` variants.
4. List: dùng `staggerDelay(i)`.
5. Cử chỉ/drag: dùng `SPRING_SETTLE`.
6. Page transition: đã lo ở root, KHÔNG tự thêm transition toàn màn ở từng route (tránh double-animate).

---

*Generated: 07/07/2026 · Brief animation system "Silk" cho Agent · Dựa trên audit 57 màn hình*
