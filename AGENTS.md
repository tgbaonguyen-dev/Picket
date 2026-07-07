<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# PICKET — TÀI LIỆU KỸ THUẬT DỰ ÁN

> Tài liệu này mô tả toàn bộ hệ thống Picket: kiến trúc, cấu trúc thư mục, luồng
> dữ liệu và **hướng dẫn chi tiết cách thay mock data bằng API thật** để chuyển
> sang giai đoạn backend. Dành cho cả AI agent lẫn lập trình viên.

---

## 1. TỔNG QUAN

**Picket** là ứng dụng quản lý tài chính cá nhân kết hợp nhật ký mua sắm, gồm 3 lớp giá trị:
1. **Sổ tài chính** — giao dịch, ngân sách, mục tiêu, hoá đơn định kỳ.
2. **Máy ảnh mua sắm** — chụp hoá đơn → OCR → tạo giao dịch.
3. **Kỷ niệm riêng tư** — album món đồ, chia sẻ theo vòng tròn kiểu Locket.

**Trạng thái hiện tại:** MVP dựng UI hoàn chỉnh bằng **mock data**. Toàn bộ dữ liệu hardcode đã được chuyển thành các getter function (`getTransactions()`, `getAccounts()`...) tại `src/data/` để sẵn sàng nối API (Phase 4 Refactor hoàn tất).

---

## 2. TECH STACK

| Lớp | Công nghệ | Ghi chú |
|-----|-----------|---------|
| UI | React 19 + TypeScript 5.8 | |
| Routing | TanStack Router 1.x (file-based) | `routeTree.gen.ts` sinh tự động |
| Build | Vite 8 | plugin: react, tailwind, router, tsconfig-paths |
| Styling | Tailwind CSS 4 + shadcn/ui | |
| Icons | lucide-react | |
| Animation | framer-motion | wrapper ở `components/ui/animations.tsx` |
| Validation | Zod 4 | `@tanstack/zod-adapter` cho search params |
| Toast | sonner | |
| Mobile | Capacitor 8 (Android) | `capacitor.config.ts` |
| Backend (đã cài, chưa dùng nhiều) | Supabase JS 2.x | `src/integrations/supabase/` |
| Package manager | **pnpm 11.5.3** | KHÔNG dùng npm/bun — chỉ 1 lockfile `pnpm-lock.yaml` |

**Alias:** `@/` → `src/` (cấu hình ở `tsconfig.json` + `vite-tsconfig-paths`).

### Scripts (pnpm)
| Lệnh | Việc |
|------|------|
| `pnpm dev` | Dev server |
| `pnpm build` | Build production |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm build:android` | tsc + build + `cap sync android` |

---

## 3. CẤU TRÚC THƯ MỤC

```
Picket/
├── src/
│   ├── routes/           # Màn hình — file-based routing (57 files)
│   ├── components/
│   │   ├── ui/           # shadcn/ui primitives (chỉ giữ 19 file đang dùng)
│   │   └── *.tsx         # Component nghiệp vụ (phone-frame, transaction-row...)
│   ├── data/             # ⭐ TOÀN BỘ MOCK DATA + getter — nơi nối API
│   ├── types/            # Entity types (data contract dùng chung)
│   ├── lib/              # utils, haptic, error/
│   ├── hooks/            # use-mobile
│   ├── integrations/
│   │   ├── supabase/     # Supabase client + auth (đã cấu hình)
│   │   └── lovable/      # Lovable infra
│   ├── main.tsx          # Entry point
│   ├── router.tsx        # Cấu hình router
│   ├── routeTree.gen.ts  # ⚠️ Sinh tự động — KHÔNG sửa tay
│   └── styles.css        # Global styles + Tailwind
├── docs/                 # Tài liệu sản phẩm (Feature Catalogue, Figma, briefs)
├── android/              # Capacitor Android project
├── supabase/             # Supabase config/migrations
├── .env                  # SUPABASE_URL, VITE_SUPABASE_* (KHÔNG commit giá trị thật)
├── package.json          # name: "picket", packageManager: pnpm
└── pnpm-lock.yaml        # Lockfile duy nhất
```

---

## 4. KIẾN TRÚC & LUỒNG DỮ LIỆU

### 4.1 Luồng dữ liệu hiện tại (Mock)

```
src/data/*.ts          ← Mock data + getter functions (getBudgets, getItems...)
       │
       ▼
src/routes/*.tsx       ← Import từ "@/data" → gọi get*() → render UI
       │
       ▼
src/components/        ← Presentational components nhận props từ route
```

Mỗi module trong `src/data/` export:
- **Hằng số** (ví dụ `BUDGETS`, `TRANSACTIONS`) — dữ liệu tĩnh.
- **Hàm getter** (ví dụ `getBudgets()`, `findAccount(id)`) — điểm nối API.
- **Type/interface** — định nghĩa kiểu dữ liệu.

### 4.2 Cách các route đọc/mutation data

```tsx
// Pattern A: Đọc một lần, không sửa (static list)
import { getBudgets } from "@/data";
const budgets = getBudgets(); // gọi 1 lần khi component mount

// Pattern B: Cần local state (user có thể thêm/xoá/sửa)
import { useState, useEffect } from "react";
import { getBudgets } from "@/data";
const [budgetsList, setBudgetsList] = useState(getBudgets());
// setBudgetsList(...) để update state cục bộ
```

### 4.3 Navigation giữa các màn hình

TanStack Router file-based routing:

| File | URL | Parent |
|------|-----|--------|
| `index.tsx` | `/` | root |
| `transactions.index.tsx` | `/transactions` | transactions |
| `transactions.$id.tsx` | `/transactions/:id` | transactions |
| `transactions.$id.edit.tsx` | `/transactions/:id/edit` | transactions/$id |
| `budgets/index.tsx` | `/budgets` | budgets |
| `items/index.tsx` | `/items` | items |
| `bills/index.tsx` | `/bills` | bills |
| `bills/subscriptions/index.tsx` | `/bills/subscriptions` | bills |

**Link:** `<Link to="/transactions/$id" params={{ id: "tx-001" }} />`
**Navigate:** `navigate({ to: "/wallets" })` hoặc `navigate({ to: "/transactions/$id", params: { id }, search: { tab: "detail" } })`

---

## 5. ENTITY MODEL & DATA CONTRACT

### 5.1 Entity types (`src/types/index.ts`)

```ts
// Giao dịch
export type TxType = "expense" | "income" | "transfer" | "refund";
export type TxStatus = "pending" | "posted" | "refunded";
export interface Tx {
  id: string; type: TxType; status: TxStatus; amount: number; currency: string;
  merchant: string; category: string; categoryEmoji: string; account: string;
  date: string; note?: string; shared?: boolean; receipts?: string[];
}

// Tài khoản / ví
export interface Account { id: string; name: string; balance: number; type: string; currency?: string; number?: string; }

// Ngân sách
export type BudgetStatus = "ok" | "warn" | "over";
export interface Budget { id: string; name: string; spent: number; limit: number; status: BudgetStatus; icon: string; }

// Hoá đơn định kỳ
export type BillStatus = "paid" | "due" | "upcoming";
export interface Bill { id: string; day: number; name: string; amount: number; status: BillStatus; icon: string; }

// Thuê bao (subscription)
export type SubscriptionFlag = "trial" | "increase" | "duplicate" | null;
export interface Subscription { id: string; name: string; icon: string; monthly: number; flag: SubscriptionFlag; note: string; }

// Món đồ / tài sản
export interface Item { id: string; name: string; category: string; price: number; date: string; img: string; warranty: string; returnBy?: string; }

// Inbox task (việc cần kiểm tra)
export type TaskKind = "ocr" | "duplicate" | "uncategorized" | "sync";
export interface InboxTask { id: string; kind: TaskKind; title: string; reason: string; meta: string; cta: string; }

// Thông báo
export type NotificationType = "finance" | "social" | "system";
export interface Notification { id: string; type: NotificationType; title: string; body: string; time: string; unread: boolean; action?: string; }
```

### 5.2 Entity → Data Module → Detail Route mapping

| Entity | Data module | Getter | Detail route ($id) | Edit routes | Trạng thái |
|--------|------------|--------|-------------------|-------------|-----------|
| **Transaction** | `src/data/transactions.ts` | `getExpenses()`, `findTx(id)` | `transactions.$id.tsx` | `.edit`, `.refund`, `.split` | ✅ Đầy đủ |
| **Account** | `src/data/accounts.ts` | `getAccounts()`, `findAccount(id)` | `accounts.$id.tsx` | — | ✅ Đầy đủ |
| **Budget** | `src/data/budgets.ts` | `getBudgets()` | `budgets.$id.tsx` | `.edit`, `.alert` | ✅ Đầy đủ |
| **Bill** | `src/data/bills.ts` | `getBills()` | `bills.$id.tsx` | `.edit` | ✅ Đầy đủ |
| **Subscription** | `src/data/bills.ts` | `getSubscriptions()`, `findSubscription(id)` | `bills.subscriptions.$id.tsx` | `.new`, `.alert` | ✅ Đầy đủ |
| **Item** | `src/data/items.ts` | `getItems()`, `findItem(id)` | `items.$id.tsx` | `.new` (tạo mới) | ✅ Đầy đủ |
| **InboxTask** | `src/data/inbox.ts` | `getInboxTasks()` | Không cần (list-only) | — | ✅ OK |
| **Notification** | `src/data/notifications.ts` | `getNotifications()` | Không cần (list-only) | — | ✅ OK |

### 5.3 Entity nào CẦN thêm $id route?

✅ **Đã hoàn thành**: Giao diện chi tiết cho Thuê bao (`bills.subscriptions.$id.tsx`) đã được tạo cùng với hàm `findSubscription(id)` tại `src/data/bills.ts`. Toàn bộ các entities đã có màn hình chi tiết đầy đủ.

---

## 6. DANH SÁCH ĐẦY ĐỦ CÁC DATA MODULE

Tất cả ở `src/data/`, export qua barrel `src/data/index.ts` (import: `from "@/data"`).

| Module | Exports chính | Getter / helper |
|--------|--------------|-----------------|
| `transactions.ts` | `TRANSACTIONS`, `CATEGORIES`, `TAGS`, `CATEGORY_RECENT_IDS`, `formatVND`, `groupByDay`, `dayLabel`, `daySum` | `getExpenses()`, `findTx(id)` |
| `accounts.ts` | `ACCOUNTS`, `ACCOUNT_TRANSACTIONS`, `AccountTx` | `getAccounts()`, `findAccount(id)`, `getAccountTransactions(id)` |
| `budgets.ts` | `BUDGETS` | `getBudgets()` |
| `bills.ts` | `BILLS`, `SUBSCRIPTIONS` | `getBills()`, `getSubscriptions()` |
| `items.ts` | `ITEMS`, `ITEM_CATEGORIES` | `getItems()`, `findItem(id)` |
| `inbox.ts` | `INBOX_TASKS` | `getInboxTasks()` |
| `notifications.ts` | `NOTIFICATIONS` | `getNotifications()` |
| `calendar.ts` | `WEEKDAYS`, `LEADING_BLANKS`, `DAYS_IN_MONTH`, `TODAY` | — (hằng số UI lịch) |
| `monthly-wrap.ts` | `TOP_MERCHANTS`, `MONTHLY_PHOTOS`, `MerchantStat` | — |
| `search.ts` | `SEARCH_RECENT`, `SEARCH_CHIPS`, `SEARCH_SUGGESTIONS` | — |
| `settings.ts` | `PREFS_KEY`, `CURRENCIES`, `TIMEZONES`, `LANGUAGES`, `DATE_FORMATS` | — |
| `onboarding.ts` | `GOAL_OPTIONS`, `PERSONA_OPTIONS`, `PRIVACY_PRINCIPLES` | — |
| `subscriptions.ts` | `SUB_SUGGESTIONS`, `RECURRENCE_CYCLES` | — (dùng cho form tạo mới) |

**Lưu ý nguồn dữ liệu chung:** `ACCOUNTS` có nguồn gốc duy nhất ở `accounts.ts`, được re-export qua `transactions.ts` để tương thích ngược. Không định nghĩa lại `ACCOUNTS` ở nơi khác.

---

## 7. HƯỚNG DẪN NỐI BACKEND (THAY MOCK DATA BẰNG API)

### 7.1 Nguyên tắc chung

Mỗi module trong `src/data/` có **getter function** — đây là điểm nối API duy nhất cần sửa. Khi backend sẵn sàng:

1. Đổi hàm `get*()` từ sync → async (`Promise<T>`).
2. Thay `return LOCAL_DATA` bằng `fetch()` hoặc gọi Supabase client.
3. Giữ nguyên tên hàm và signature — các route KHÔNG cần sửa nhiều vì chỉ gọi `get*()`.

### 7.2 Pattern: Chuyển từ Mock sang API

**Bước 1 — Đổi getter thành async fetch:**
```ts
// TRƯỚC (mock):
export function getBudgets(): Budget[] {
  return BUDGETS;
}

// SAU (API thật):
export async function getBudgets(): Promise<Budget[]> {
  const res = await fetch("/api/budgets");
  if (!res.ok) throw new Error("Failed to fetch budgets");
  return res.json();
}
```

**Bước 2 — Cập nhật route để handle async:**
```tsx
// TRƯỚC (mock, đồng bộ):
import { getBudgets } from "@/data";
const budgets = getBudgets();

// SAU (async):
const [budgets, setBudgets] = useState<Budget[]>([]);
const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  getBudgets().then((data) => { setBudgets(data); setIsLoading(false); });
}, []);
if (isLoading) return <Skeleton />;
```

### 7.3 Danh sách endpoint cần tạo (backend)

| Entity | GET list | GET detail | POST | PUT | DELETE |
|--------|---------|-----------|------|-----|--------|
| Transaction | `/api/transactions` | `/:id` | ✓ | `/:id` | `/:id` |
| Account | `/api/accounts` | `/:id` | ✓ | `/:id` | `/:id` |
| Budget | `/api/budgets` | `/:id` | ✓ | `/:id` | `/:id` |
| Bill | `/api/bills` | `/:id` | ✓ | `/:id` | `/:id` |
| Subscription | `/api/subscriptions` | `/:id` | ✓ | `/:id` | `/:id` |
| Item | `/api/items` | `/:id` | ✓ | `/:id` | `/:id` |
| InboxTask | `/api/inbox/tasks` | — | — | `/:id/action` | — |
| Notification | `/api/notifications` | — | — | `/:id/read` | — |

### 7.4 Pattern mutation (tạo/sửa/xoá) trong route

```tsx
const handleSubmit = async () => {
  try {
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    navigate({ to: "/transactions" });
  } catch (e) {
    toast.error("Không thể tạo giao dịch");
  }
};
```

### 7.5 Dùng Supabase (đã cài sẵn)

Client đã cấu hình ở `src/integrations/supabase/client.ts`, import:
```ts
import { supabase } from "@/integrations/supabase/client";
```

Ví dụ thay getter bằng Supabase query:
```ts
export async function getBudgets(): Promise<Budget[]> {
  const { data, error } = await supabase.from("budgets").select("*");
  if (error) throw error;
  return data;
}
```

**Env vars cần thiết** (đặt trong `.env`, KHÔNG commit giá trị thật):
- `VITE_SUPABASE_URL` — URL project (client-side)
- `VITE_SUPABASE_PUBLISHABLE_KEY` — publishable/anon key (client-side)
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` — cho SSR
- `SUPABASE_SERVICE_ROLE_KEY` — chỉ dùng server-side (`client.server.ts`), KHÔNG expose ra client

**Auth:** `src/integrations/supabase/auth-attacher.ts` + `auth-middleware.ts` đã có sẵn (hiện có 5 lỗi typecheck do thiếu package `@tanstack/react-start` — cần cài khi làm SSR auth thật).

### 7.6 Khuyến nghị data-fetching layer

Dự án đã cài `@tanstack/react-query` (thấy trong `__root.tsx` có `QueryClientProvider`). Nên dùng React Query cho data fetching thật:

```tsx
import { useQuery } from "@tanstack/react-query";
import { getBudgets } from "@/data";

function BudgetDashboard() {
  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgets, // getter async đã đổi ở src/data
  });
  if (isLoading) return <Skeleton />;
  // ...
}
```

React Query lo caching, refetch, loading/error state — chỉ cần getter trả `Promise`.

---

## 8. CHECKLIST CHUYỂN SANG BACKEND

- [ ] Thiết kế DB schema khớp với entity types ở `src/types/index.ts` (đây là data contract).
- [ ] Tạo REST/Supabase endpoints theo bảng ở mục 7.3.
- [ ] Đổi từng hàm `get*()` trong `src/data/*.ts` sang async fetch/Supabase.
- [x] Thêm hàm `find*(id)` cho các entity có detail route (Subscription còn thiếu).
- [ ] Bọc data fetching bằng React Query (đã cài sẵn `QueryClientProvider`).
- [ ] Chuyển route dùng data sang pattern async (useQuery hoặc useEffect + loading state).
- [x] Tạo `bills.subscriptions.$id.tsx` nếu cần màn hình chi tiết thuê bao.
- [ ] Cài `@tanstack/react-start` nếu dùng SSR auth (fix 5 lỗi typecheck hiện tại).
- [ ] Chuyển mutation (tạo/sửa/xoá) sang gọi API + invalidate React Query cache.
- [ ] Xử lý auth token/session qua Supabase auth.
- [ ] Chạy `pnpm build` + `pnpm lint` để verify không lỗi.

---

## 9. QUY ƯỚC CODE

1. **Data**: Mọi mock data ở `src/data/`. Thêm data mới → sửa file tương ứng + export qua `src/data/index.ts`.
2. **Types**: Entity types ở `src/types/index.ts`. Type UI cục bộ (state shape) để trong route.
3. **Import data**: Ưu tiên từ barrel `@/data`. Type từ `@/types`.
4. **Format tiền**: Dùng `formatVND` từ `@/data`, KHÔNG tự viết `n.toLocaleString`.
5. **Routing**: File-based. KHÔNG sửa `routeTree.gen.ts` (tự sinh). Thêm route = thêm file trong `src/routes/`.
6. **shadcn/ui**: Chỉ giữ component đang dùng. Thêm mới qua CLI shadcn khi cần.
7. **Package manager**: Chỉ dùng `pnpm`. KHÔNG tạo `package-lock.json` / `bun.lock`.
8. **Mọi màn hình** nên có Default / Loading (skeleton) / Empty state.
9. **Verify**: Luôn chạy `pnpm build` sau thay đổi lớn. Typecheck chỉ được phép còn 5 lỗi supabase cũ (`@tanstack/react-start`).

---

## 10. LỖI TYPECHECK ĐÃ BIẾT (chấp nhận được)

5 lỗi ở `src/integrations/supabase/auth-attacher.ts` và `auth-middleware.ts`:
- `Cannot find module '@tanstack/react-start'` — package chưa cài (chỉ cần khi làm SSR auth).
- `Binding element 'next' implicitly has an 'any' type` — hệ quả của lỗi trên.

Đây là code Lovable sinh sẵn cho SSR, chưa dùng ở giai đoạn mock. Cài `@tanstack/react-start` khi triển khai auth thật.

---

*Tài liệu cập nhật: 07/07/2026 · Hoàn thành Phase 4 (Refactor Getters) & Chuẩn bị cho giai đoạn backend.*

