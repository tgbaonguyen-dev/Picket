// Điểm truy cập dữ liệu tập trung.
// Mọi mock data của app nằm ở thư mục này — muốn thêm/sửa data, vào đây.
// Mỗi module có hàm get*() là "điểm nối API": khi có backend, chỉ cần đổi
// thân hàm sang fetch() mà không phải sửa các màn hình.

// accounts trước transactions: ACCOUNTS có nguồn gốc ở accounts.ts.
export * from "./accounts";
export * from "./transactions";
export * from "./budgets";
export * from "./bills";
export * from "./items";
export * from "./inbox";
export * from "./notifications";
export * from "./calendar";
export * from "./monthly-wrap";
export * from "./search";
export * from "./settings";
export * from "./onboarding";
export * from "./subscriptions";
export * from "./ocr";
