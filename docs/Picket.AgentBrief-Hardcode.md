# 🧹 PICKET — AGENT BRIEF: DỌN HARDCODE (VÒNG 6)

> **Ngày:** 07/07/2026
> **Mục tiêu:** Xoá bỏ giá trị hardcode (màu, helper trùng, data inline) → dùng token/nguồn tập trung, để đổi theme (dark mode) và nối API không bị vỡ.
> **Tham chiếu:** `AGENTS.md` · `Picket.AgentBrief-Animation.md` (magic number animation xử lý riêng ở đó)

---

## 1. TÓM TẮT KẾT QUẢ QUÉT

| # | Loại hardcode | Mức độ | Phạm vi |
|---|--------------|--------|---------|
| 1 | Màu hex viết cứng | 🔴 Cao | 42 file, 400+ lần — dù token đã có sẵn |
| 2 | Helper `fmt` trùng lặp | 🟡 TB | 11 file tự viết thay vì dùng `formatVND` |
| 3 | Data inline còn sót | 🟡 TB | ~7 route chưa gom vào `src/data/` |
| 4 | Ngày tháng cứng | 🟢 Thấp | Chấp nhận ở giai đoạn mock |
| 5 | `setTimeout` fake loading | 🟢 Thấp | Bỏ khi nối API |

> **Lưu ý:** `styles.css` ĐÃ có `.dark` theme block (dòng 89). Vì vậy 400+ hex hardcode sẽ **vỡ khi bật dark mode** — đây là lý do #1 cần ưu tiên.

---

## 2. 🔴 NHIỆM VỤ 1: MÀU HEX → CSS TOKEN

### 2.1. Token màu đã có sẵn (`src/styles.css`)

| Hex | Token CSS | Tailwind class |
|-----|-----------|----------------|
| `#B5828C` | `--mauve` / `--primary` / `--chip-foreground` | `text-mauve` `bg-mauve` / `text-primary` |
| `#FFB4A2` | `--coral` / `--accent` / `--brand` / `--ring` | `text-coral` `bg-coral` / `bg-accent` |
| `#FFD6BA` | `--peach` | `bg-peach` |
| `#FFF8F0` | `--cream` / `--background` | `bg-background` |
| `#F5E8DA` | `--page` | `bg-page` |
| `#4A2C2A` | `--foreground` | `text-foreground` |
| `#FFE4D2` | `--secondary` / `--chip` | `bg-secondary` `bg-chip` |
| `#FFF1E4` | `--surface-soft` / `--muted` | `bg-surface-soft` `bg-muted` |
| `#9B7278` | `--muted-foreground` | `text-muted-foreground` |
| `#dc2626` | `--expense` | `text-expense` |
| `#16a34a` | `--income` | `text-income` |
| `#E85D5D` | `--destructive` | `text-destructive` |

### 2.2. Token CẦN THÊM (màu đang dùng nhiều nhưng chưa có token)

Thêm vào `:root` và `.dark` trong `src/styles.css`, và khai báo trong `@theme inline`:

```css
/* Trong @theme inline { ... } — thêm mapping */
--color-mauve-deep: var(--mauve-deep);
--color-peach-soft: var(--peach-soft);
--color-peach-tint: var(--peach-tint);

/* Trong :root { ... } (light) */
--mauve-deep: #8F5F68;    /* nâu mauve đậm — 23 lần dùng */
--peach-soft: #FFE9D9;    /* peach nhạt nền — 30 lần */
--peach-tint: #FFE4D2;    /* peach tint (đã là --secondary, cân nhắc gộp) */

/* Trong .dark { ... } (dark) — chọn giá trị tương phản phù hợp */
--mauve-deep: #D5A3A0;
--peach-soft: #4A2C2A;
--peach-tint: #5A3A38;
```

### 2.3. Quy tắc thay thế

- Class Tailwind hex tuỳ ý: `text-[#B5828C]` → `text-mauve`, `bg-[#FFE9D9]` → `bg-peach-soft`, `bg-[#8F5F68]` → `bg-mauve-deep`
- Trong `style={{ color: "#B5828C" }}` → `style={{ color: "var(--mauve)" }}` (hoặc đổi sang className)
- Gradient `from-[#8F5F68] to-[#FFB4A2]` → `from-mauve-deep to-coral`
- **KHÔNG đổi** màu trong SVG data-uri, chart config nếu việc token hoá gây phức tạp — ghi chú lại.

### 2.4. Ưu tiên file (theo mật độ)

1. `src/components/phone-frame.tsx`, `quick-add-sheet.tsx` (nav/FAB — hiển thị mọi màn)
2. `notifications.tsx`, `inbox.tsx` (dùng `#B5828C`, `#FFE9D9` nhiều)
3. `bills.*`, `budgets.*`, `items.*`, `expenses.index.tsx`
4. Còn lại

---

## 3. 🟡 NHIỆM VỤ 2: BỎ HELPER `fmt` TRÙNG LẶP

11 file tự khai báo `const fmt = (n) => n.toLocaleString("vi-VN") + "₫"`. Thay bằng `formatVND` từ `@/data`.

**File cần sửa:**
```
bills.$id.tsx, bills.index.tsx, bills.subscriptions.$id.alert.tsx,
bills.subscriptions.index.tsx, bills.subscriptions.new.tsx,
budgets.$id.alert.tsx, budgets.$id.tsx, budgets.close.tsx,
budgets.transfer.tsx, items.$id.tsx, items.index.tsx, items.new.tsx, wallets.tsx
```

**Cách sửa mỗi file:**
1. Xoá dòng `const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";`
2. Thêm `formatVND` vào import từ `@/data` (nhiều file đã import `@/data` sẵn — chỉ thêm tên).
3. Thay mọi lời gọi `fmt(...)` → `formatVND(...)`.

> **Chú ý regression:** `bills.index.tsx` và `items.index.tsx` ĐÃ `import ... from "@/data"` nhưng vẫn giữ `fmt` cũ. Chỉ cần thêm `formatVND` vào import có sẵn và xoá `fmt`.

> **Kiểm tra format:** `formatVND` trả về `${n.toLocaleString("vi-VN")}₫`. Nếu nơi nào đang tự thêm `₫` bên ngoài `fmt(...)` thì bỏ đi để tránh double `₫₫`.

---

## 4. 🟡 NHIỆM VỤ 3: GOM DATA INLINE CÒN SÓT

| File | Data inline | Gom vào |
|------|-------------|---------|
| `items.index.tsx` | `ITEM_CATEGORIES` (đã có trong `@/data/items.ts`) | Xoá inline, import `ITEM_CATEGORIES` từ `@/data` |
| `items.new.tsx` | `ITEM_CATEGORIES` (bản khác, có "Khác") | Thống nhất 1 nguồn ở `@/data/items.ts` |
| `expenses.index.tsx` | `LOCAL_CATEGORIES` (màu+icon) + `CATEGORY_MAP` | Tạo `getExpenseCategories()` trong `@/data` (giữ icon ở route, chỉ đưa data ra) |
| `budgets.$id.tsx` | `txs` (mock transactions) | Dùng `getExpenses()` hoặc thêm getter vào `@/data/budgets.ts` |
| `budgets.close.tsx` | `tasks` | Thêm `getBudgetCloseTasks()` vào `@/data/budgets.ts` |
| `budgets.method.tsx` | `methods` | Thêm `BUDGET_METHODS` vào `@/data/budgets.ts` |
| `bills.subscriptions.new.tsx` | `SUGGESTIONS`, `CYCLES`, `SUB_CATEGORIES` | Đã có `SUB_SUGGESTIONS`, `RECURRENCE_CYCLES` trong `@/data/subscriptions.ts` — dùng lại, bỏ `SUB_CATEGORIES` (trùng `CATEGORIES`) |

**Lưu ý màu+icon:** icon (lucide component) phải để trong route (không serialize được). Chỉ đưa phần data thuần (label, key, màu dạng token) ra `@/data`; map sang icon ở route.

---

## 5. 🟢 NHIỆM VỤ 4-5: NGÀY THÁNG & SETTIMEOUT (ghi nhận, chưa sửa)

Các giá trị này **chấp nhận được ở giai đoạn mock**, chỉ cần xử lý khi nối API:

**Ngày tháng cứng** (`year = 2026`, `month = 6`, `"Tháng 7"`, `"2026-07-10"`):
- Khi có API: thay bằng `new Date()` hoặc ngày từ dữ liệu thật.
- Gợi ý: gom vào `src/data/calendar.ts` một hằng `CURRENT_PERIOD` để 1 chỗ điều khiển.

**`setTimeout` fake loading** (800/1000/1200/1600ms):
- Đây là giả lập loading cho mock. Khi nối API thật → thay bằng trạng thái `isLoading` từ React Query.
- KHÔNG cần sửa bây giờ.

→ Chỉ cần thêm comment `// TODO(api): thay bằng dữ liệu thật` tại các chỗ này để đánh dấu.

---

## 6. THỨ TỰ THỰC HIỆN

```
Phase 1 — Data + helper (~1h, an toàn, ít rủi ro):
  NV2  Bỏ 11 fmt cục bộ → formatVND
  NV3  Gom data inline còn sót

Phase 2 — Màu (~2-3h, cần cẩn thận):
  NV1.2  Thêm token mới (mauve-deep, peach-soft) vào styles.css + @theme
  NV1.3  Thay hex → token, ưu tiên nav/component dùng chung trước
  Kiểm tra dark mode sau khi thay

Phase 3 — Đánh dấu (~15 phút):
  NV4-5  Thêm comment TODO(api) cho ngày tháng + setTimeout
```

---

## 7. ACCEPTANCE CRITERIA

- [ ] `grep -rn "toLocaleString(\"vi-VN\")" src/routes/` → **0 kết quả** (tất cả dùng `formatVND`)
- [ ] `grep -rn "const fmt =" src/routes/` → **0 kết quả**
- [ ] `grep -rhoc "#[0-9a-fA-F]\{6\}" src/routes/ src/components/` giảm mạnh (chỉ còn trong SVG data-uri / chart nếu có ghi chú)
- [ ] Không còn `ITEM_CATEGORIES` / `LOCAL_CATEGORIES` khai báo trùng — 1 nguồn ở `@/data`
- [ ] Bật dark mode (thêm class `dark` vào `<html>`) → UI không vỡ màu ở nav, bills, budgets, items
- [ ] `pnpm build` ✓ và `pnpm lint` ✓
- [ ] Typecheck chỉ còn 5 lỗi supabase cũ

---

## 8. QUY TẮC VÀNG

1. **Màu**: KHÔNG viết `#hex` hay `text-[#...]` trong route/component. Luôn dùng token (`text-mauve`, `bg-coral`...). Màu mới → thêm token vào `styles.css` trước.
2. **Tiền tệ**: Luôn `formatVND` từ `@/data`. KHÔNG tự viết `toLocaleString`.
3. **Data**: Mọi mock data ở `src/data/`. Route chỉ import, không khai báo inline.
4. **Ngày tháng động**: tránh hardcode; khi có API dùng dữ liệu thật.

---

*Generated: 07/07/2026 · Brief dọn hardcode cho Agent · Dựa trên quét 57 route + 8 component*
