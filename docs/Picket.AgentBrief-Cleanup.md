# 🧹 PICKET — AGENT BRIEF: DỌN FILE KHÔNG DÙNG + GOM DATA PHỤ (VÒNG 4)

> **Ngày:** 07/07/2026
> **Mục tiêu:** Xóa file thừa, gom data phụ còn sót vào `src/data/`
> **Tài liệu tham chiếu:** `Picket.FeatureCatalogue .md` · `Picket.FigmaDesign.md`

---

## PHẦN 1: XÓA FILE KHÔNG DÙNG

### Quy tắc an toàn trước khi xóa

- Mỗi file phải có **0 importer** trong `src/routes/` và `src/components/*.tsx`
- Không xóa file nào mà một component khác đang import từ `@/components/ui/`
- Route file (`src/routes/*.tsx`) **KHÔNG XÓA** — TanStack Router tự động đăng ký, dù không ai link đến thì vẫn là route hợp lệ

### Danh sách file cần xóa

#### A. Component nghiệp vụ (`src/components/`)

| File | Lý do |
|------|-------|
| `animated-page.tsx` | 0 importer — component animation wrapper không dùng ở đâu |

#### B. shadcn/ui (`src/components/ui/`) — 29 file

**Lưu ý quan trọng:** Kiểm tra kỹ dependency chain trước khi xóa.

| File | Dependency chain | An toàn? |
|------|-----------------|----------|
| `accordion.tsx` | Không ai dùng | ✅ |
| `aspect-ratio.tsx` | Không ai dùng | ✅ |
| `avatar.tsx` | Không ai dùng | ✅ |
| `breadcrumb.tsx` | Không ai dùng | ✅ |
| `calendar.tsx` | Không ai dùng | ✅ |
| `carousel.tsx` | Không ai dùng | ✅ |
| `chart.tsx` | Không ai dùng | ✅ |
| `collapsible.tsx` | Không ai dùng | ✅ |
| `command.tsx` | Chỉ import `dialog` → delete cả 2 | ✅ |
| `context-menu.tsx` | Không ai dùng | ✅ |
| `dialog.tsx` | Chỉ dùng bởi `command.tsx` (sẽ xóa) | ✅ |
| `drawer.tsx` | Không ai dùng | ✅ |
| `dropdown-menu.tsx` | Không ai dùng | ✅ |
| `hover-card.tsx` | Không ai dùng | ✅ |
| `input-otp.tsx` | Không ai dùng | ✅ |
| `menubar.tsx` | Không ai dùng | ✅ |
| `navigation-menu.tsx` | Không ai dùng | ✅ |
| `pagination.tsx` | Không ai dùng | ✅ |
| `popover.tsx` | Không ai dùng | ✅ |
| `progress.tsx` | Không ai dùng | ✅ |
| `radio-group.tsx` | Không ai dùng | ✅ |
| `resizable.tsx` | Không ai dùng | ✅ |
| `scroll-area.tsx` | Không ai dùng | ✅ |
| `sidebar.tsx` | Không ai dùng | ✅ |
| `slider.tsx` | Không ai dùng | ✅ |
| `table.tsx` | Không ai dùng | ✅ |
| `tabs.tsx` | Không ai dùng | ✅ |
| `textarea.tsx` | Không ai dùng | ✅ |
| `toggle-group.tsx` | Không ai dùng | ✅ |

#### C. Lib error (`src/lib/error/`)

| File | Lý do |
|------|-------|
| `error-capture.ts` | 0 importer, không được vite/server load — Lovable infra thừa |
| `error-page.ts` | 0 importer, không route nào dùng — Lovable infra thừa |

**GIỮ LẠI:** `lovable-error-reporting.ts` — được `__root.tsx` import (dòng 11).

#### D. Docs & khác

| File | Lý do |
|------|-------|
| `docs/Picket.FeatureCatalogue.docx` | Trùng với `.md`, bỏ khỏi git để giảm noise |
| `docs/Picket.FigmaDesign.docx` | Trùng với `.md`, bỏ khỏi git để giảm noise |
| `src/routes/README.md` | Route-based routing tự động, README này không ai đọc, gây nhầm lẫn |

---

## PHẦN 2: GOM DATA PHỤ CÒN SÓT

Sau khi đã gom mock data chính vào `src/data/`, còn các hằng số phụ sau nằm rải rác trong route. Cần di chuyển hết vào `src/data/`.

### 2.1. Data cần gom + type tương ứng

#### A. `src/routes/index.tsx` (Home Dashboard)

```ts
// Hiện tại inline:
const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const LEADING_BLANKS = 2;
const DAYS_IN_MONTH = 30;
const TODAY = 15;
```

→ Tạo `src/data/calendar.ts`:
```ts
export const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;
export const LEADING_BLANKS = 2;
export const DAYS_IN_MONTH = 30;
export const TODAY = 15;
```

#### B. `src/routes/items.new.tsx`

```ts
const CATEGORIES = ["Công nghệ", "Gia dụng", "Nội thất", "Xe cộ", "Khác"];
```

→ Đã có trong `src/data/items.ts` dưới tên `ITEM_CATEGORIES`. Chỉ cần đổi import thành `ITEM_CATEGORIES`.

#### C. `src/routes/monthly-wrap.tsx`

```ts
const TOP_MERCHANTS = [
  { name: "Highlands Coffee", amount: 2450000 },
  { name: "Shopee", amount: 1890000 },
  { name: "CGV Vincom", amount: 920000 },
];
const PHOTOS = ["a1", "b1", "c1", "d1"].map((s) => `https://picsum.photos/seed/${s}/200/200`);
```

→ Tạo `src/data/monthly-wrap.ts`:
```ts
export interface MerchantStat { name: string; amount: number }
export const TOP_MERCHANTS: MerchantStat[] = [ ... ];
export const MONTHLY_PHOTOS = ["a1","b1","c1","d1"].map(s => `https://picsum.photos/seed/${s}/200/200`);
```

#### D. `src/routes/search.tsx`

```ts
const RECENT = ["Starbucks", "Grab tháng 3", "Hoá đơn > 500k", "An chia"];
const CHIPS = ["Giao dịch", "Merchant", "Hoá đơn", "Ví"];
const SUGGESTIONS = [ ... ]; // array of search suggestion objects
```

→ Tạo `src/data/search.ts`:
```ts
export const SEARCH_RECENT = [ ... ];
export const SEARCH_CHIPS = [ ... ];
export interface SearchSuggestion { label: string; icon: string }
export const SEARCH_SUGGESTIONS: SearchSuggestion[] = [ ... ];
```

#### E. `src/routes/transactions.category.tsx`

```ts
const RECENT_IDS = ["food", "transport", "shopping"];
const TAGS = ["#công-tác", "#gia-đình", "#du-lịch", "#khẩn-cấp", "#thưởng"];
```

→ Thêm vào `src/data/transactions.ts`:
```ts
export const CATEGORY_RECENT_IDS = ["food", "transport", "shopping"];
export const TAGS = ["#công-tác", "#gia-đình", "#du-lịch", "#khẩn-cấp", "#thưởng"];
```

#### F. `src/routes/profile.tsx`

```ts
const PREFS_KEY = "picket.prefs"; // string constant, giữ nguyên hoặc move sang lib/config
const CURRENCIES = [ ... ]; // array of currency config objects (~13 items)
const TIMEZONES = [ ... ]; // array of timezone strings (~15 items)
const LANGUAGES = [ ... ]; // array of language config objects (~6 items)
const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "D MMM YYYY"];
```

→ Tạo `src/data/settings.ts`:
```ts
export const PREFS_KEY = "picket.prefs";
export interface CurrencyConfig { code: string; symbol: string; name: string }
export const CURRENCIES: CurrencyConfig[] = [ ... ];
export const TIMEZONES: string[] = [ ... ];
export interface LanguageConfig { code: string; name: string }
export const LANGUAGES: LanguageConfig[] = [ ... ];
export const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "D MMM YYYY"] as const;
```

#### G. `src/routes/onboarding-goals.tsx`

```ts
const GOALS = [ ... ]; // array of goal option objects (~6 items)
```

→ Tạo `src/data/onboarding.ts`:
```ts
export interface GoalOption { id: string; label: string; description: string; icon: string }
export const GOAL_OPTIONS: GoalOption[] = [ ... ];
```

#### H. `src/routes/onboarding-persona.tsx`

```ts
const PERSONAS = [ ... ]; // array of persona option objects (~5 items)
```

→ Cùng file `src/data/onboarding.ts`:
```ts
export interface PersonaOption { id: string; label: string; description: string; icon: string }
export const PERSONA_OPTIONS: PersonaOption[] = [ ... ];
```

#### I. `src/routes/onboarding-privacy.tsx`

```ts
const PRINCIPLES = [ ... ]; // array of privacy principle objects (~3 items)
```

→ Cùng file `src/data/onboarding.ts`:
```ts
export interface PrivacyPrinciple { title: string; description: string; icon: string }
export const PRIVACY_PRINCIPLES: PrivacyPrinciple[] = [ ... ];
```

#### J. `src/routes/bills.subscriptions.new.tsx`

```ts
const SUGGESTIONS = [ ... ]; // subscription suggestions for new form
const CYCLES = [ ... ]; // recurrence cycle options
const CATEGORIES = ["Giải trí", "Công việc", "Học tập", "Sức khoẻ", "Khác"]; // duplicate! already in transactions.CATEGORIES
```

→ Tạo `src/data/subscriptions.ts`:
```ts
export interface SubSuggestion { label: string }
export const SUB_SUGGESTIONS: SubSuggestion[] = [ ... ];
export const RECURRENCE_CYCLES = ["Hàng tuần", "Hàng tháng", "Hàng quý", "Hàng năm"] as const;
// BỎ CATEGORIES vì đã trùng với @/data/CATEGORIES — chỉ import lại thôi
```

---

### 2.2. Cấu trúc src/data/ sau khi hoàn tất

```
src/data/
├── index.ts              # barrel export tất cả
├── transactions.ts        # Tx types + TRANSACTIONS + ACCOUNTS + CATEGORIES + helpers + TAGS + CATEGORY_RECENT_IDS
├── accounts.ts            # Account types + ACCOUNTS + ACCOUNT_TRANSACTIONS + findAccount/getAccountTransactions
├── budgets.ts             # Budget type + BUDGETS + getBudgets()
├── bills.ts               # Bill/Subscription types + BILLS + SUBSCRIPTIONS + getBills()/getSubscriptions()
├── items.ts               # Item type + ITEMS + ITEM_CATEGORIES + getItems()/findItem()
├── inbox.ts               # InboxTask type + INBOX_TASKS + getInboxTasks()
├── notifications.ts       # Notification type + NOTIFICATIONS + getNotifications()
├── calendar.ts            # 🆕 WEEKDAYS, LEADING_BLANKS, DAYS_IN_MONTH, TODAY
├── monthly-wrap.ts        # 🆕 TOP_MERCHANTS, MONTHLY_PHOTOS, MerchantStat type
├── search.ts              # 🆕 SEARCH_RECENT, SEARCH_CHIPS, SEARCH_SUGGESTIONS, SearchSuggestion type
├── settings.ts            # 🆕 PREFS_KEY, CURRENCIES, TIMEZONES, LANGUAGES, DATE_FORMATS + types
├── onboarding.ts          # 🆕 GOAL_OPTIONS, PERSONA_OPTIONS, PRIVACY_PRINCIPLES + types
└── subscriptions.ts       # 🆕 SUB_SUGGESTIONS, RECURRENCE_CYCLES + type (BỎ categories trùng)
```

---

## PHẦN 3: QUY TẮC KHI SỬA ROUTE

Khi sửa route file để dùng data mới từ `src/data/`:

1. **Import từ barrel**: `import { getItems, ITEM_CATEGORIES } from "@/data"` — gọn nhất. Hoặc import cụ thể từ module con.
2. **Type definition**: Nếu route định nghĩa type riêng cho mock data (vd `TaskKind`, `NotificationType`) → đã có trong `@/types`. Import từ đó. Nếu là type UI thuần (vd state shape) → giữ nguyên trong route.
3. **Không thay đổi UI/render logic**: Chỉ thay phần khai báo data constant bằng import + gọi hàm getter. JSX/render giữ nguyên y chang.
4. **Giữ nguyên useState pattern**: Các route dùng `useState(mockData)` để quản lý local state vẫn giữ pattern đó, chỉ thay giá trị khởi tạo ban đầu. Ví dụ: `useState(getBudgets())`.

---

## PHẦN 4: THỨ TỰ THỰC HIỆN KHUYẾN NGHỊ

```bash
Phase 1 — Xóa file thừa (~5 phút):
  rm src/components/animated-page.tsx                    # 1 file component thừa
  rm src/components/ui/{accordion,aspect-ratio,...}.tsx   # 29 file ui thừa (xem danh sách chi tiết)
  rm src/lib/error/error-capture.ts                      # 2 file infra thừa (giữ lovable-error-reporting)
  rm src/lib/error/error-page.ts                         #    ^^^^
  git rm docs/*.docx                                     # 2 file docx trùng với .md
  rm src/routes/README.md                                # README thừa trong routes folder

Phase 2 — Tạo data modules mới (~30 phút):
  tạo src/data/calendar.ts, monthly-wrap.ts, search.ts, settings.ts, onboarding.ts, subscriptions.ts
  
Phase 3 — Rewire routes (~30 phút):
  sửa ~12 route files để import từ @/data thay vì khai báo inline
  
Phase 4 — Update barrel & verify (~5 phút):
  cập nhật src/data/index.ts barrel export chạy tsc + build kiểm tra
```

---

## PHẦN 5: ACCEPTANCE CRITERIA

- [ ] Build thành công: `pnpm build` ✓ (không lỗi mới nào thêm vào)
- [ ] Typecheck sạch: chỉ còn 5 lỗi supabase cũ (`@tanstack/react-start`), không thêm lỗi mới từ route nào cả
- [ ] Không còn file nào trong danh sách Phase 1 tồn tại trên disk nữa (trừ `lovable-error-reporting.ts`)
- [ ] Tất cả route đã import data từ `@/data` thay vì khai báo inline constants (trừ state/local UI logic)
- [ ] Barrel export đầy đủ mọi symbol mới qua `src/data/index.ts`

---

*Generated: 07/07/2026 · Brief cho Agent dọn dẹp Vòng 4*
