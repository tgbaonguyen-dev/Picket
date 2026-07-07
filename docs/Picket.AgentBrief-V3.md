# 🎯 PICKET — AGENT BRIEF: SỬA & HOÀN THIỆN MVP (VÒNG 3)

> **Ngày:** 07/07/2026
> **Vai trò người review:** BA + Product Owner
> **Phạm vi:** MVP Mock Data UI — Agent sửa code theo brief này
> **Tài liệu gốc:** `Picket.FeatureCatalogue .md` · `Picket.FigmaDesign.md` · `ux-ui-checklist.md`

---

# 1. TÓM TẮT ĐÁNH GIÁ

Sản phẩm Picket kết hợp 3 lớp: **sổ tài chính + máy ảnh mua sắm + kỷ niệm riêng tư**. Coverage MVP hiện tại ~55%.
Mock data approach là đúng đắn. Cần hoàn thiện các luồng còn thiếu và polish những gì đã có.

---

# 2. NHIỆM VỤ CẦN LÀM (THEO THỨ TỰ ƯU TIÊN)

## 🔴 TIER S — LÀM NGAY (ảnh hưởng trực tiếp đến demo)

### S1. CP-09 — Khớp với giao dịch đã có (Match Transaction)

**Tại sao:** Bước quan trọng nhất sau OCR. Tránh tạo transaction trùng khi receipt đã có tx ngân hàng.
**Spec tham khảo:** FigmaDesign.md section CP-09 (dòng 1117-1133)
**Cần làm:**

| # | Việc | Mô tả |
|---|------|-------|
| S1.1 | UI candidate cards | Hiển thị danh sách transaction có sẵn match với receipt (theo amount, date, merchant score) |
| S1.2 | Compare detail | Khi tap vào candidate → expand xem chi tiết so sánh receipt vs transaction |
| S1.3 | CTA đầy đủ | Nút "Liên kết với tx này", "Tạo mới (không liên kết)", "Bỏ qua" |
| S1.4 | Tích hợp vào flow hiện tại | Sau CP-06 Review OCR → nếu có candidate match → show CP-09 → CP-14 Success |

**File cần sửa:** `src/routes/capture-receipt.tsx` (thêm stage mới)
**Mock data mẫu:**
```ts
const candidateTransactions = [
  { id: 'tx-1', merchant: 'Circle K', amount: 156000, date: '2026-07-07', account: 'Visa Credit', score: 0.94 },
  { id: 'tx-2', merchant: 'Family Mart', amount: 150000, date: '2026-07-06', account: 'Cash', score: 0.72 },
]
```

---

### S2. HM-02 — Inbox cần kiểm tra (Polish)

**Tại sao:** Tạo habit loop "mở app mỗi ngày để xử lý inbox". Pattern giống Unroll.me.
**Spec tham khảo:** FigmaDesign.md section HM-02 (dòng 677-693)
**Cần làm:**

| # | Việc | Mô tả |
|---|------|-------|
| S2.1 | Empty state đẹp | Khi inbox = 0 → illustration "Tất cả đã được xử lý xong!" + streak counter |
| S2.2 | Badge count trong tab | Số lượng pending items hiển thị trên tab (đã có badge trên Bell icon ở Home) |
| S2.3 | Bulk actions | Action bar hiện ra khi select nhiều item → "Xác nhận tất cả", "Bỏ qua tất cả" |
| S2.4 | Card hiển thị lý do rõ hơn | Mỗi card có icon + lý do (OCR thấp / Trùng / Thiếu category / Sync lỗi) + CTA nhanh |

**File cần sửa:** `src/routes/inbox.tsx`
**Mock data mẫu:**
```ts
const inboxItems = [
  { id: 'in-1', type: 'ocr_low_confidence', title: 'Hoá đơn Circle K', reason: 'OCR độ tin cậy thấp (62%)', cta: 'Xác nhận', linkedScreen: 'CP-06' },
  { id: 'in-2', type: 'uncategorized', title: 'Giao dịch 156.000đ', reason: 'Chưa có danh mục', cta: 'Phân loại', linkedScreen: 'TX-05' },
  { id: 'in-3', type: 'duplicate', title: 'Giao dịch trùng lặp', reason: 'Trùng 94% với tx Circle K ngày 07/07', cta: 'Gộp', linkedScreen: 'CP-10' },
  { id: 'in-4', type: 'sync_error', title: 'Đồng bộ Vietcombank', reason: 'Kết nối hết hạn — cần đăng nhập lại', cta: 'Kết nối lại', linkedScreen: 'AC-06' },
]
```

---

### S3. IT-01 — Bộ sưu tập món đồ (Item Collection)

**Tại sao:** Là USP số 1 của Picket — "kho tài sản sau mua". Không có app tài chính nào làm cái này.
**Spec tham khảo:** FigmaDesign.md section IT-01 (dòng 1583-1599) và FeatureCatalogue section 3.9
**Cần làm:**

| # | Việc | Mô tả |
|---|------|-------|
| S3.1 | Tạo route mới | `/items` — tab trong bottom navigation hoặc accessible từ Home |
| S3.2 | Photo grid layout | Grid 3 cột ảnh món đồ, có filter chips (Tất cả / Quần áo / Điện tử / Gia dụng / Khác) |
| S3.3 | Item card | Mỗi card: ảnh bìa, tên món, ngày mua, giá (nếu có), trạng thái (đang dùng / đã bán / đã tặng) |
| S3.4 | Smart collections | Section "Sắp hết bảo hành", "Còn hạn đổi trả", "Mới thêm gần đây" |
| S3.5 | Empty state | Chưa có món đồ nào → CTA "Chụp món đồ đầu tiên" → mở CP-11 |
| S3.6 | Navigate to IT-02 | Tap vào item card → `IT-02` Item Detail (có thể là route `/items/$id`) |

**File cần tạo mới:** `src/routes/items.index.tsx` (hoặc `src/routes/items.tsx`)
**File cần kiểm tra:** `src/routes/items.$id.tsx` (có thể đã tồn tại — xem trong file tree)

**Mock data mẫu:**
```ts
const items = [
  { id: 'it-1', name: 'Áo sơ mi Uniqlo', brand: 'Uniqlo', price: 399000, date: '2026-07-01', album: 'Quần áo', status: 'active', warranty: '2027-07-01', returnBy: '2026-08-01', imageUrl: '/mock/item-1.jpg' },
  { id: 'it-2', name: 'Tai nghe Sony WF-1000XM5', brand: 'Sony', price: 6490000, date: '2026-06-15', album: 'Điện tử', status: 'active', warranty: '2028-06-15', imageUrl: '/mock/item-2.jpg' },
  { id: 'it-3', name: 'Nồi chiên không dầu Philips', brand: 'Philips', price: 2490000, date: '2026-05-20', album: 'Gia dụng', status: 'active', warranty: '2028-05-20', returnBy: '2026-06-20', imageUrl: '/mock/item-3.jpg' },
  { id: 'it-4', name: 'Giày Nike Air Max', brand: 'Nike', price: 3200000, date: '2026-03-10', album: 'Quần áo', status: 'sold', imageUrl: '/mock/item-4.jpg' },
]
```

---

## 🟡 TIER A — NÊN LÀM (tăng điểm UX đáng kể)

### A1. Skeleton Loading cho TX-01 và BD-01

**Cần làm:** Thêm skeleton loading state cho danh sách giao dịch và danh sách ngân sách.
**File:** `src/routes/transactions.index.tsx` (tab TX-01), `src/routes/budgets.index.tsx` (tab BD-01)

### A2. Empty State cho Bills / Subscriptions / Wallets

**Cần làm:**
- `src/routes/bills.index.tsx`: Empty state "Chưa có hoá đơn định kỳ nào" + CTA "Thêm hoá đơn"
- Tương tự cho subscriptions (BL-04) nếu có route

### A3. Crop Handles đơn giản trong CP-03 Preview

**Cần làm:** Thêm 4 corner handles có thể kéo để crop ảnh trước khi OCR.
**File:** `src/routes/capture-receipt.tsx` (PreviewStage)

---

## 🟢 TIER B — GÂY ẤN TƯỢNG (làm nếu còn thời gian)

### G1. Mode "Chụp Món đồ" thực sự hoạt động (CP-11 → CP-12)

**Hiện tại:** Mode carousel có UI nhưng chưa gắn logic riêng cho mode Món đồ
**Cần làm:** Khi chọn mode "Món đồ" → CP-11 (chụp object, link receipt), sau đó → CP-12 (metadata: tên, brand, album, caption)
**File:** `src/routes/capture-receipt.tsx` (thêm stage CP-11, CP-12)

### G2. Onboarding Goal & Persona (OB-01, OB-02)

**Hiện tại:** Chưa có màn hình chọn mục tiêu chính và persona
**Cần làm:** 
- OB-01: Chọn mục tiêu (kiểm soát chi / tiết kiệm / trả nợ / gia đình / lưu hoá đơn / nhớ món đồ) — max 3
- OB-02: Chọn persona (cá nhân / cặp đôi / gia đình / freelancer)
**File cần tạo:** `src/routes/onboarding.goals.tsx`, `src/routes/onboarding.persona.tsx`

### G3. Account Detail Screen (AC-02)

**Hiện tại:** Có `wallets.tsx` (AC-01) nhưng chưa có detail từng account
**Cần làm:** Route `/accounts/$id` — hiển thị balance, transaction history của account đó, sync status, reconcile CTA
**File cần tạo:** `src/routes/accounts.$id.tsx`

---

# 3. KIẾN TRÚC ROUTE HIỆN TẠI → ĐÍCH

## Tab Navigation (Bottom Bar)

| Tab | Hiện tại | Đích sau khi sửa |
|-----|----------|-----------------|
| 🏠 Home | `index.tsx` (HM-01) ✅ | Giữ nguyên |
| 📋 Tx | `transactions.index.tsx` (TX-01) ✅ | Thêm skeleton loading |
| 📷 Camera | Capture FAB | Giữ nguyên |
| 📊 Budget | `budgets.index.tsx` (BD-01) ✅ | Thêm skeleton loading |
| 🖼️ Items | ❌ Chưa có tab | **THÊM tab mới** → `items.index.tsx` (IT-01) |

Hoặc Items có thể là secondary nav từ Home thay vì bottom tab (quyết định bởi agent dựa trên context UI).

## Routes cần thêm mới

| Route | File cần tạo | Màn hình | Phase |
|-------|-------------|----------|-------|
| `/items` | `items.index.tsx` | IT-01 Bộ sưu tập | MVP |
| `/items/$id` | `items.$id.tsx` | IT-02 Chi tiết món đồ | MVP |
| `/accounts/$id` | `accounts.$id.tsx` | AC-02 Chi tiết tài khoản | MVP |
| `/onboarding/goals` | `onboarding.goals.tsx` | OB-01 Chọn mục tiêu | MVP |
| `/onboarding/persona` | `onboarding.persona.tsx` | OB-02 Kiểu sử dụng | MVP |

---

# 4. QUY TẮC CODE & UI

Agent cần tuân thủ khi implement:

1. **Mock data**: Tất cả data là mock, không gọi API thật. Đặt mock data ở đầu file trong object `const MOCK_XXX`.
2. **Empty/Loading/Error states**: Mỗi màn hình mới PHẢI có cả 3 state (dùng pattern từ `index.tsx` và `budgets.tsx` hiện tại).
3. **Component tái sử dụng**: Dùng `transaction-row.tsx`, `meta-row.tsx`, `quick-add-sheet.tsx`, `phone-frame.tsx`, `swipeable-item.tsx` và các component UI shadcn có sẵn.
4. **TypeScript types**: Định nghĩa interface cho mock data ở đầu file.
5. **Navigation**: Dùng TanStack Router (đã cấu hình sẵn), link đến các route khác bằng `<Link>` component.
6. **Theme**: Dùng CSS variables và Tailwind classes hiện có, không hardcode màu.
7. **Mobile first**: Frame 390×844, kiểm tra safe area.

---

# 5. THỨ TỰ IMPLEMENT KHUYẾN NGHỊ

```
Phase 1 (~3h):  S1 (CP-09 Match Tx → capture-receipt.tsx)
                S2 (HM-02 Inbox Polish → inbox.tsx)

Phase 2 (~4h):  S3 (IT-01 Item Collection → items.index.tsx + items.$id.tsx)
                A1 (Skeleton TX-01 + BD-01)

Phase 3 (~2h):  A2 (Empty states bills/wallets)
                A3 (Crop handles CP-03 nếu đủ thời gian)

Phase 4 (~5h):  G1 → G2 → G3 (làm tuần tự, mỗi cái 1.5-2h)
```

---

# 6. FILE REFERENCE MAP

| File hiện tại | Màn hình | Cần thay đổi gì |
|---------------|----------|-----------------|
| `src/routes/index.tsx` | HM-01 Home | ✅ Ổn — thêm link đến `/items` nếu có tab mới |
| `src/routes/transactions.index.tsx` | TX-01 Tx List | Thêm skeleton loading |
| `src/routes/transactions.$id.tsx` | TX-02 Tx Detail | ✅ Ổn — budget impact + share blur đã có |
| `src/routes/capture-receipt.tsx` | CP-01→CP-14 | **Thêm CP-09 stage** + CP-11/CP-12 cho mode Món đồ |
| `src/routes/inbox.tsx` | HM-02 Inbox | **Polish** empty state + bulk actions + card redesign |
| `src/routes/budgets.index.tsx` | BD-01 Budgets | Thêm skeleton loading |
| `src/routes/budgets.tsx` | BD Budget Layout | ✅ Ổn |
| `src/routes/bills.index.tsx` | BL-01 Bills | Thêm empty state |
| `src/routes/expenses.tsx` | IN-01 Insights | ✅ Ổn |
| `src/routes/wallets.tsx` | AC-01 Accounts | ✅ Ổn |
| `src/routes/profile.tsx` | ST-01 Settings | ✅ Ổn |
| `src/routes/search.tsx` | HM-05 Search | ✅ Ổn |
| `src/routes/search-results.tsx` | HM-06 Results | ✅ Ổn |
| `src/routes/notifications.tsx` | HM-03 Notifications | ✅ Ổn |
| `src/routes/auth.tsx` | AU-01→06 Auth | ✅ Ổn |
| `src/components/phone-frame.tsx` | Device frame | ✅ Ổn |
| `src/components/quick-add-sheet.tsx` | HM-04 Quick Add | ✅ Ổn |
| `src/components/transaction-row.tsx` | Tx Row | ✅ Ổn |

---

# 7. ACCEPTANCE CRITERIA

Mỗi task được coi là hoàn thành khi:

- [ ] Có ít nhất 3 states: **Default** (có data), **Empty** (không data + CTA), **Loading** (skeleton)
- [ ] Navigation hoạt động: back về đúng màn hình trước, không hard-link về Home
- [ ] Mock data realistic, không dùng lorem ipsum
- [ ] Dùng component shared từ `src/components/`
- [ ] Không hardcode màu, dùng Tailwind classes
- [ ] Mobile frame đúng 390x844
- [ ] TypeScript không lỗi

---

*Generated: 07/07/2026 · Brief cho Agent sửa code Vòng 3 · Dựa trên BA/PO review*
