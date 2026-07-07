# Picket

Ứng dụng quản lý tài chính cá nhân kết hợp nhật ký mua sắm. Picket gộp ba lớp giá trị vào một trải nghiệm mobile-first: **sổ tài chính** (giao dịch, ngân sách, mục tiêu), **máy ảnh mua sắm** (chụp hoá đơn → OCR → giao dịch) và **kỷ niệm riêng tư** (album món đồ, chia sẻ theo vòng tròn kiểu Locket).

> Trạng thái hiện tại: MVP dựng UI bằng **mock data**. Backend và tích hợp thật sẽ nối ở các phase sau.

## Tech stack

| Lớp | Công nghệ |
|-----|-----------|
| UI | React 19 + TypeScript |
| Routing | TanStack Router (file-based) |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Icons | lucide-react |
| Validation | Zod |
| Mobile | Capacitor (Android) |
| Backend (sau) | Supabase |

## Yêu cầu

- Node.js 20+
- [pnpm](https://pnpm.io) 11+ (trình quản lý gói chính thức của dự án)

## Bắt đầu

```bash
pnpm install      # cài dependencies
pnpm dev          # chạy dev server (Vite)
```

## Các script

| Lệnh | Mô tả |
|------|-------|
| `pnpm dev` | Chạy dev server |
| `pnpm build` | Build production |
| `pnpm build:dev` | Build ở chế độ development |
| `pnpm preview` | Xem thử bản build |
| `pnpm lint` | Chạy ESLint |
| `pnpm format` | Format code bằng Prettier |
| `pnpm build:android` | Build và đồng bộ sang Android (Capacitor) |

## Cấu trúc thư mục

```
src/
├── routes/          # Màn hình — file-based routing của TanStack Router
├── components/      # Component nghiệp vụ tái sử dụng
│   └── ui/          # Component nền (shadcn/ui)
├── data/            # Mock data + fixtures dùng cho UI
├── types/           # Kiểu dữ liệu (entity) dùng chung
├── lib/             # Tiện ích (utils, haptic, error handling)
├── hooks/           # React hooks tái sử dụng
├── integrations/    # Tích hợp bên ngoài (Supabase, Lovable)
├── main.tsx         # Điểm khởi động ứng dụng
├── router.tsx       # Cấu hình router
└── styles.css       # Global styles
```

### Quy ước routing

Dự án dùng file-based routing. Tên file phản ánh cấu trúc URL:

- `index.tsx` → `/`
- `transactions.index.tsx` → `/transactions`
- `transactions.$id.tsx` → `/transactions/:id`
- `transactions.$id.edit.tsx` → `/transactions/:id/edit`

`routeTree.gen.ts` được sinh tự động — không sửa tay.

## Tài liệu sản phẩm

Xem thư mục [`docs/`](./docs) cho Feature Catalogue, Figma Design blueprint và các brief phát triển.
