PRODUCT DESIGN • FIGMA BLUEPRINT

DANH SÁCH MÀN HÌNH
ỨNG DỤNG TÀI CHÍNH

Đặc tả màn hình, dữ liệu, thành phần, state và liên kết để dựng Figma

*…*

125 design units • mobile + admin web • MVP đến P2

# 1. Cách dùng tài liệu

Tài liệu này là inventory để dựng Figma và prototype, không phải yêu cầu phải vẽ tất cả cùng lúc. Mỗi design unit được gắn phase, loại frame, nội dung cần thiết, dữ liệu phụ thuộc, interaction, đường vào/ra và state bắt buộc.

Quy mô: 117 design units cho mobile và 8 màn hình admin web. Phân kỳ: 69 MVP, 49 P1 và 7 P2. Với các state chính, bộ Figma thực tế sẽ khoảng 190–230 frames.

* Vẽ MVP trước, nhưng tạo component và naming đủ để P1/P2 không phá cấu trúc.
* Một design unit có thể là full screen, tab root, bottom sheet, modal hoặc system state; cột Loại màn hình quyết định cách đặt frame.
* Các liên kết dùng ID ổn định. Khi đổi tên màn hình, giữ ID để prototype và ticket không mất tham chiếu.
* Mỗi màn hình chính phải có ít nhất Default, Loading, Empty, Error và Offline nếu có dữ liệu mạng; state riêng được ghi trong từng đặc tả.
* Không duplicate component trong flow page; dùng instance từ component page và variant properties.

# 2. Cấu trúc file Figma

| Page | Nội dung |
| --- | --- |
| 00\_Cover | Cover, changelog, owner, trạng thái review. |
| 01\_Foundations | Color, type, spacing, grid, elevation, radius, icon, motion, accessibility. |
| 02\_Components\_Core | Buttons, fields, nav, sheets, dialogs, toasts, states, skeletons. |
| 03\_Components\_Finance | Money, account, transaction, category, budget, charts, merchant. |
| 04\_Components\_Camera | Viewfinder, shutter, quality hint, crop, OCR fields, line items, queues. |
| 05\_Components\_Social | Moment card, audience, reaction, comment, member, split rows. |
| 10\_Auth\_Onboarding | AU và OB frames theo happy path và error states. |
| 20\_Home\_Transactions | HM và TX frames. |
| 30\_Capture\_OCR | CP frames, ưu tiên prototype tương tác. |
| 40\_Planning | BD, BL, GL, DB frames. |
| 50\_Items\_Social | IT và SO frames. |
| 60\_Insights\_Accounts | IN và AC frames. |
| 70\_Settings | ST và SG states. |
| 80\_Admin\_Web | AD desktop frames. |
| 90\_Prototype\_Flows | 12 flow pages; chỉ đặt instance, không copy detached component. |
| 99\_Archive | Explorations cũ, ghi ngày và lý do loại. |

Quy ước frame: [Screen ID]\_[Tên ngắn]/[State]. Ví dụ CP-06\_OCRReview/NeedsReview. Prototype flow dùng cùng ID và đặt tên starting point theo journey.

# 3. Component set cần dựng trước

| Nhóm | Component / variant tối thiểu |
| --- | --- |
| Điều hướng | Top bar, bottom tab, capture FAB, segmented tabs, breadcrumb admin, back/close, sticky CTA. |
| Inputs | Text, amount keypad, currency, date/time, search, selector, chips, checkbox, radio, switch, OTP. |
| Finance | Money amount, account card, transaction row, merchant, category, budget progress, goal, bill, debt. |
| Camera/OCR | Viewfinder, shutter, mode carousel, quality hint, crop handles, confidence field, line-item row, job status. |
| Media/Social | Photo card, moment card, audience badge, redaction chip, reaction, comment, member avatar, split row. |
| Charts | Cash flow, category donut, line/bar, forecast area, tooltip, legend, text alternative. |
| Feedback | Skeleton, empty, error, offline, banner, toast, progress, success, destructive confirmation. |
| Security/Privacy | Privacy shield, masked value, consent card, permission row, session row, audit event. |

Thiết bị chuẩn: Mobile frame 390 × 844; kiểm tra thêm 360 × 800 và cỡ chữ lớn. Admin web dùng desktop 1440 px với content max-width và responsive xuống tablet.

Accessibility: Mọi component có focus, disabled, pressed, error, high contrast, screen-reader label và vùng chạm tối thiểu; biểu đồ luôn có text alternative.

# 4. Bản đồ điều hướng cấp cao

| Tab / khu vực | Điểm vào | Đích chính |
| --- | --- | --- |
| Home | HM-01 | HM-02, HM-03, HM-04, HM-07 và shortcut tới mọi trụ cột |
| Hoạt động | TX-01 | TX-02 đến TX-10; search HM-05/HM-06 |
| Camera trung tâm | CP-01 | CP-02–CP-14; receipt và item flow |
| Kế hoạch | BD-01 | Budget BD, bills BL, goals GL và debt DB |
| Bộ sưu tập | IT-01 | Item IT, return, warranty, maintenance |
| Xã hội riêng tư | SO-01 / SO-02 | Circle, moment, shared expense, settle up |
| Insights | IN-01 | Reports, AI, forecast và export |
| Profile | ST-01 | Accounts AC, privacy, security, billing, support |

# 5. Mười hai flow prototype bắt buộc

| Flow | Chuỗi frame |
| --- | --- |
| Lần đầu sử dụng | SG-01 → AU-01 → AU-02 → AU-03 → AU-04 → AU-05 → OB-01 → OB-02 → OB-03 → OB-04 → OB-05 → OB-06 → OB-07 → OB-08 → HM-01 |
| Đăng nhập có MFA | AU-01 → AU-06 → AU-07 → SG-02 → HM-01 |
| Chụp hoá đơn và khớp giao dịch | HM-01 → CP-01 → CP-02 → CP-03 → CP-05 → CP-06 → CP-09 → TX-02 → CP-14 |
| Chụp món đồ và chia sẻ riêng tư | HM-04 → CP-11 → CP-12 → CP-13 → SO-02 → SO-06 |
| Thêm chi thủ công | HM-04 → TX-03 → TX-05 → TX-02 → BD-02 |
| Cảnh báo vượt ngân sách | HM-03 → BD-06 → TX-01 → BD-05 → BD-02 |
| Chia hoá đơn và settle up | CP-06 → SO-07 → SO-08 → SO-09 → TX-08 |
| Đóng tháng | BD-01 → BD-07 → HM-02 → TX-10 → HM-07 → BD-04 |
| Return và refund | HM-03 → IT-05 → IT-02 → TX-08 → TX-02 |
| Kết nối tài khoản | AC-01 → AC-04 → AC-05 → AC-06 → TX-01 |
| Hỏi AI và kiểm chứng nguồn | IN-01 → IN-04 → IN-03 → TX-02 |
| Xuất hoặc xoá dữ liệu | ST-04 → ST-08 → AU-07 → IN-06 |

# 6. Screen register

| ID | Màn hình | Phase | Loại | Module |
| --- | --- | --- | --- | --- |
| SG-01 | Splash / Resume | MVP | Full screen | System và trạng thái toàn cục |
| SG-02 | Khoá ứng dụng | MVP | Full screen | System và trạng thái toàn cục |
| SG-03 | Trung tâm ngoại tuyến | MVP | Full screen / Overlay | System và trạng thái toàn cục |
| SG-04 | Bảo trì / Bắt buộc cập nhật | MVP | Full screen | System và trạng thái toàn cục |
| SG-05 | Quyền hệ thống bị chặn | MVP | Modal / Full screen | System và trạng thái toàn cục |
| SG-06 | Lỗi toàn trang / Thử lại | MVP | Template | System và trạng thái toàn cục |
| SG-07 | Deep-link Resolver | P1 | System state | System và trạng thái toàn cục |
| AU-01 | Welcome | MVP | Full screen | Xác thực tài khoản |
| AU-02 | Chọn phương thức đăng ký | MVP | Full screen | Xác thực tài khoản |
| AU-03 | Nhập email / số điện thoại | MVP | Full screen | Xác thực tài khoản |
| AU-04 | Xác minh OTP | MVP | Full screen | Xác thực tài khoản |
| AU-05 | Tạo mật khẩu / Passkey | MVP | Full screen | Xác thực tài khoản |
| AU-06 | Đăng nhập | MVP | Full screen | Xác thực tài khoản |
| AU-07 | Xác thực đa yếu tố | MVP | Full screen | Xác thực tài khoản |
| AU-08 | Khôi phục tài khoản | MVP | Multi-step full screen | Xác thực tài khoản |
| OB-01 | Chọn mục tiêu chính | MVP | Full screen | Onboarding và cá nhân hoá ban đầu |
| OB-02 | Kiểu sử dụng | MVP | Full screen | Onboarding và cá nhân hoá ban đầu |
| OB-03 | Ngôn ngữ, tiền tệ và múi giờ | MVP | Full screen | Onboarding và cá nhân hoá ban đầu |
| OB-04 | Thu nhập và chu kỳ lương | MVP | Full screen | Onboarding và cá nhân hoá ban đầu |
| OB-05 | Bắt đầu với tài khoản tiền | MVP | Full screen | Onboarding và cá nhân hoá ban đầu |
| OB-06 | Giới thiệu quyền riêng tư | MVP | Full screen | Onboarding và cá nhân hoá ban đầu |
| OB-07 | Thiết lập quyền | MVP | Full screen | Onboarding và cá nhân hoá ban đầu |
| OB-08 | Hoàn tất onboarding | MVP | Full screen | Onboarding và cá nhân hoá ban đầu |
| HM-01 | Home Dashboard | MVP | Tab root | App shell, Home và điều hướng toàn cục |
| HM-02 | Inbox cần kiểm tra | MVP | Full screen | App shell, Home và điều hướng toàn cục |
| HM-03 | Trung tâm thông báo | MVP | Full screen | App shell, Home và điều hướng toàn cục |
| HM-04 | Quick Add | MVP | Bottom sheet | App shell, Home và điều hướng toàn cục |
| HM-05 | Tìm kiếm toàn cục | MVP | Full screen | App shell, Home và điều hướng toàn cục |
| HM-06 | Kết quả tìm kiếm | MVP | Full screen | App shell, Home và điều hướng toàn cục |
| HM-07 | Monthly Wrap | P1 | Full screen / Story | App shell, Home và điều hướng toàn cục |
| TX-01 | Danh sách giao dịch | MVP | Tab / Full screen | Giao dịch và sổ tiền |
| TX-02 | Chi tiết giao dịch | MVP | Full screen | Giao dịch và sổ tiền |
| TX-03 | Thêm giao dịch thủ công | MVP | Full screen | Giao dịch và sổ tiền |
| TX-04 | Chỉnh sửa giao dịch | MVP | Full screen | Giao dịch và sổ tiền |
| TX-05 | Chọn danh mục và nhãn | MVP | Bottom sheet / Full screen | Giao dịch và sổ tiền |
| TX-06 | Split giao dịch | MVP | Full screen | Giao dịch và sổ tiền |
| TX-07 | Chuyển tiền giữa tài khoản | MVP | Full screen | Giao dịch và sổ tiền |
| TX-08 | Hoàn tiền / Hoàn ứng | MVP | Full screen | Giao dịch và sổ tiền |
| TX-09 | Quản lý giao dịch hàng loạt | P1 | Selection mode | Giao dịch và sổ tiền |
| TX-10 | Đối soát tài khoản | P1 | Full screen | Giao dịch và sổ tiền |
| CP-01 | Camera Hub | MVP | Full screen | Camera, OCR và nhật ký mua sắm |
| CP-02 | Chụp hoá đơn trực tiếp | MVP | Camera mode | Camera, OCR và nhật ký mua sắm |
| CP-03 | Preview, crop và tăng chất lượng | MVP | Full screen | Camera, OCR và nhật ký mua sắm |
| CP-04 | Hoá đơn nhiều trang / Batch | P1 | Full screen | Camera, OCR và nhật ký mua sắm |
| CP-05 | Hàng đợi xử lý | MVP | Full screen / Background status | Camera, OCR và nhật ký mua sắm |
| CP-06 | Review OCR tổng quan | MVP | Full screen | Camera, OCR và nhật ký mua sắm |
| CP-07 | Review dòng hàng | P1 | Full screen | Camera, OCR và nhật ký mua sắm |
| CP-08 | Gán dòng hàng cho người / danh mục | P1 | Bottom sheet / Full screen | Camera, OCR và nhật ký mua sắm |
| CP-09 | Khớp với giao dịch đã có | MVP | Full screen / Bottom sheet | Camera, OCR và nhật ký mua sắm |
| CP-10 | Phát hiện trùng | MVP | Modal / Full screen | Camera, OCR và nhật ký mua sắm |
| CP-11 | Chụp món đồ | MVP | Camera mode | Camera, OCR và nhật ký mua sắm |
| CP-12 | Metadata món đồ | MVP | Full screen | Camera, OCR và nhật ký mua sắm |
| CP-13 | Composer khoảnh khắc | P1 | Full screen | Camera, OCR và nhật ký mua sắm |
| CP-14 | Capture thành công | MVP | Success state | Camera, OCR và nhật ký mua sắm |
| BD-01 | Budget Dashboard | MVP | Tab root | Ngân sách |
| BD-02 | Chi tiết ngân sách | MVP | Full screen | Ngân sách |
| BD-03 | Chọn phương pháp ngân sách | MVP | Full screen | Ngân sách |
| BD-04 | Tạo / Chỉnh ngân sách | MVP | Full screen | Ngân sách |
| BD-05 | Chuyển ngân sách | MVP | Bottom sheet / Full screen | Ngân sách |
| BD-06 | Chi tiết cảnh báo ngân sách | MVP | Full screen | Ngân sách |
| BD-07 | Đóng kỳ ngân sách | P1 | Multi-step full screen | Ngân sách |
| BL-01 | Lịch hoá đơn | P1 | Full screen | Hoá đơn định kỳ và subscription |
| BL-02 | Chi tiết khoản định kỳ | P1 | Full screen | Hoá đơn định kỳ và subscription |
| BL-03 | Tạo / Chỉnh khoản định kỳ | P1 | Full screen | Hoá đơn định kỳ và subscription |
| BL-04 | Subscription Dashboard | P1 | Full screen | Hoá đơn định kỳ và subscription |
| BL-05 | Cảnh báo trial / tăng giá | P1 | Full screen / Modal | Hoá đơn định kỳ và subscription |
| GL-01 | Danh sách mục tiêu | P1 | Full screen | Mục tiêu tiết kiệm và nợ |
| GL-02 | Chi tiết mục tiêu | P1 | Full screen | Mục tiêu tiết kiệm và nợ |
| GL-03 | Tạo / Chỉnh mục tiêu | P1 | Full screen | Mục tiêu tiết kiệm và nợ |
| GL-04 | Đóng góp / Rút khỏi mục tiêu | P1 | Bottom sheet | Mục tiêu tiết kiệm và nợ |
| DB-01 | Danh sách khoản nợ | P2 | Full screen | Mục tiêu tiết kiệm và nợ |
| DB-02 | Chi tiết và kế hoạch nợ | P2 | Full screen | Mục tiêu tiết kiệm và nợ |
| DB-03 | Scenario Planner | P2 | Full screen | Mục tiêu tiết kiệm và nợ |
| IT-01 | Bộ sưu tập / Album | MVP | Tab / Full screen | Bộ sưu tập món đồ và vòng đời sau mua |
| IT-02 | Chi tiết món đồ | MVP | Full screen | Bộ sưu tập món đồ và vòng đời sau mua |
| IT-03 | Thêm / Chỉnh món đồ | MVP | Full screen | Bộ sưu tập món đồ và vòng đời sau mua |
| IT-04 | Kho chứng từ món đồ | P1 | Full screen | Bộ sưu tập món đồ và vòng đời sau mua |
| IT-05 | Return Center | P1 | Full screen | Bộ sưu tập món đồ và vòng đời sau mua |
| IT-06 | Bảo hành | P1 | Full screen | Bộ sưu tập món đồ và vòng đời sau mua |
| IT-07 | Bảo trì và chi phí vòng đời | P2 | Full screen | Bộ sưu tập món đồ và vòng đời sau mua |
| IT-08 | Bán / Tặng / Archive | P2 | Full screen | Bộ sưu tập món đồ và vòng đời sau mua |
| SO-01 | Danh sách vòng tròn | P1 | Full screen | Vòng tròn riêng tư và chi phí chung |
| SO-02 | Feed vòng tròn | P1 | Full screen | Vòng tròn riêng tư và chi phí chung |
| SO-03 | Chi tiết vòng tròn | P1 | Full screen | Vòng tròn riêng tư và chi phí chung |
| SO-04 | Tạo vòng tròn / Mời thành viên | P1 | Multi-step full screen | Vòng tròn riêng tư và chi phí chung |
| SO-05 | Thành viên và quyền | P1 | Full screen | Vòng tròn riêng tư và chi phí chung |
| SO-06 | Chi tiết bài đăng / Khoảnh khắc | P1 | Full screen | Vòng tròn riêng tư và chi phí chung |
| SO-07 | Tạo chi phí chung | P1 | Full screen | Vòng tròn riêng tư và chi phí chung |
| SO-08 | Phân bổ và xác nhận phần chi | P1 | Full screen | Vòng tròn riêng tư và chi phí chung |
| SO-09 | Settle Up | P1 | Full screen | Vòng tròn riêng tư và chi phí chung |
| SO-10 | Báo cáo / Chặn / An toàn | P1 | Bottom sheet + Full screen | Vòng tròn riêng tư và chi phí chung |
| IN-01 | Insights Dashboard | P1 | Tab / Full screen | Insights, báo cáo và AI coach |
| IN-02 | Report Explorer | P1 | Full screen | Insights, báo cáo và AI coach |
| IN-03 | Chi tiết báo cáo / Drill-down | P1 | Full screen | Insights, báo cáo và AI coach |
| IN-04 | AI Coach | P2 | Full screen | Insights, báo cáo và AI coach |
| IN-05 | Forecast và What-if | P2 | Full screen | Insights, báo cáo và AI coach |
| IN-06 | Export Center | MVP | Full screen | Insights, báo cáo và AI coach |
| AC-01 | Danh sách tài khoản | MVP | Full screen | Tài khoản tiền, kết nối và quy tắc dữ liệu |
| AC-02 | Chi tiết tài khoản | MVP | Full screen | Tài khoản tiền, kết nối và quy tắc dữ liệu |
| AC-03 | Thêm / Chỉnh tài khoản thủ công | MVP | Full screen | Tài khoản tiền, kết nối và quy tắc dữ liệu |
| AC-04 | Chọn nhà cung cấp kết nối | P1 | Full screen | Tài khoản tiền, kết nối và quy tắc dữ liệu |
| AC-05 | Consent và chọn tài khoản kết nối | P1 | External webview + Return screen | Tài khoản tiền, kết nối và quy tắc dữ liệu |
| AC-06 | Trạng thái đồng bộ | P1 | Full screen | Tài khoản tiền, kết nối và quy tắc dữ liệu |
| AC-07 | Import file và ánh xạ cột | P1 | Multi-step full screen | Tài khoản tiền, kết nối và quy tắc dữ liệu |
| AC-08 | Danh mục, nhãn và quy tắc | MVP | Full screen | Tài khoản tiền, kết nối và quy tắc dữ liệu |
| ST-01 | Hồ sơ và Settings Hub | MVP | Tab root | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-02 | Hộ gia đình và quyền chung | P1 | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-03 | Tuỳ chọn thông báo | MVP | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-04 | Privacy Dashboard | MVP | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-05 | Mặc định chia sẻ và redaction | P1 | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-06 | Security Center | MVP | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-07 | Thiết bị và phiên đăng nhập | MVP | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-08 | Quyền dữ liệu: xuất, xoá, tạm khoá | MVP | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-09 | Giao diện và trợ năng | MVP | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-10 | Ngôn ngữ, tiền tệ và định dạng | MVP | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-11 | Gói và Billing | P1 | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| ST-12 | Help Center, Support và pháp lý | MVP | Full screen | Hồ sơ, cài đặt, bảo mật và hỗ trợ |
| AD-01 | Operations Dashboard | P1 | Web admin | Admin web và vận hành |
| AD-02 | User Lookup an toàn | P1 | Web admin | Admin web và vận hành |
| AD-03 | Support Tickets | P1 | Web admin | Admin web và vận hành |
| AD-04 | OCR Quality Console | P1 | Web admin | Admin web và vận hành |
| AD-05 | Merchant và Taxonomy | P1 | Web admin | Admin web và vận hành |
| AD-06 | Moderation Queue | P1 | Web admin | Admin web và vận hành |
| AD-07 | Billing và Entitlements | P1 | Web admin | Admin web và vận hành |
| AD-08 | Feature Flags, RBAC và Audit | P1 | Web admin | Admin web và vận hành |

# 7. Đặc tả chi tiết từng màn hình

Mỗi mục dưới đây có thể chuyển trực tiếp thành frame checklist trong Figma. Các state toàn cục SG-03, SG-05 và SG-06 được áp dụng bổ sung khi phù hợp.

# 01. System và trạng thái toàn cục

Các frame nền tảng đảm bảo mọi luồng có điểm vào, lỗi, offline và bảo vệ dữ liệu nhất quán.

## SG-01 · Splash / Resume

MVP • Full screen • Frame: SG-01\_Splash\_\_Resume/Default

Mục tiêu: Khởi động ứng dụng, kiểm tra phiên, migration và định tuyến người dùng đến đúng trạng thái.

Cần thiết kế: Logo, nền thương hiệu, loading indicator tối giản, thông báo migration khi thật sự cần.

Dữ liệu / phụ thuộc: Trạng thái phiên, onboarding, app version, deep link đang chờ.

Tương tác chính: Tự định tuyến; không đặt CTA trừ khi khởi động lỗi.

Đi vào từ: Điểm vào hệ thống hoặc không áp dụng.

Đi tới: SG-02 — Khoá ứng dụng; SG-04 — Bảo trì / Bắt buộc cập nhật; AU-01 — Welcome; OB-01 — Chọn mục tiêu chính; HM-01 — Home Dashboard.

State và variant Figma: Cold start, warm resume, migration, timeout, lỗi khởi động.

## SG-02 · Khoá ứng dụng

MVP • Full screen • Frame: SG-02\_Khoá\_ứng\_dụng/Default

Mục tiêu: Che dữ liệu tài chính khi ứng dụng mở lại sau thời gian không hoạt động.

Cần thiết kế: Logo nhỏ, lời chào, nút sinh trắc học, nhập PIN dự phòng, quên PIN.

Dữ liệu / phụ thuộc: Chính sách tự khoá, biometric availability, số lần thử.

Tương tác chính: Xác thực, đổi phương thức, đăng xuất an toàn.

Đi vào từ: SG-01 — Splash / Resume; ST-06 — Security Center.

Đi tới: HM-01 — Home Dashboard; AU-06 — Đăng nhập; AU-08 — Khôi phục tài khoản.

State và variant Figma: Face/Touch ID sẵn sàng, thất bại, PIN sai, khoá tạm thời, biometric bị hệ điều hành vô hiệu.

## SG-03 · Trung tâm ngoại tuyến

MVP • Full screen / Overlay • Frame: SG-03\_Trung\_tâm\_ngoại\_tuyến/Default

Mục tiêu: Giải thích dữ liệu nào vẫn dùng được và hiển thị hàng đợi chưa đồng bộ.

Cần thiết kế: Banner offline, số giao dịch/ảnh đang chờ, tiến độ retry, tuỳ chọn chỉ Wi-Fi.

Dữ liệu / phụ thuộc: Network state, upload queue, local changes, last successful sync.

Tương tác chính: Thử lại, mở hàng đợi, huỷ upload, giữ bản nháp.

Đi vào từ: HM-01 — Home Dashboard; CP-05 — Hàng đợi xử lý; AC-06 — Trạng thái đồng bộ.

Đi tới: HM-01 — Home Dashboard; CP-05 — Hàng đợi xử lý; AC-06 — Trạng thái đồng bộ.

State và variant Figma: Offline hoàn toàn, mạng yếu, đang retry, xung đột, đã đồng bộ.

## SG-04 · Bảo trì / Bắt buộc cập nhật

MVP • Full screen • Frame: SG-04\_Bảo\_trì\_\_Bắt\_buộc\_cập\_nhật/Default

Mục tiêu: Chặn an toàn khi phiên bản không còn tương thích hoặc dịch vụ đang bảo trì.

Cần thiết kế: Minh hoạ nhẹ, lý do, thời gian dự kiến nếu có, CTA cập nhật hoặc thử lại.

Dữ liệu / phụ thuộc: Minimum app version, maintenance window, status page URL.

Tương tác chính: Mở store, thử lại, xem trạng thái dịch vụ.

Đi vào từ: SG-01 — Splash / Resume.

Đi tới: SG-01 — Splash / Resume.

State và variant Figma: Cập nhật bắt buộc, cập nhật khuyến nghị, bảo trì có lịch, sự cố không xác định.

## SG-05 · Quyền hệ thống bị chặn

MVP • Modal / Full screen • Frame: SG-05\_Quyền\_hệ\_thống\_bị\_chặn/Default

Mục tiêu: Giúp người dùng phục hồi quyền camera, ảnh, thông báo hoặc vị trí sau khi từ chối.

Cần thiết kế: Tên quyền, lợi ích cụ thể, dữ liệu được dùng, CTA mở Settings, lựa chọn tiếp tục thủ công.

Dữ liệu / phụ thuộc: Permission status và feature đang yêu cầu quyền.

Tương tác chính: Mở cài đặt hệ điều hành, bỏ qua, dùng phương án thay thế.

Đi vào từ: OB-07 — Thiết lập quyền; CP-01 — Camera Hub; CP-02 — Chụp hoá đơn trực tiếp; ST-03 — Tuỳ chọn thông báo.

Đi tới: OB-07 — Thiết lập quyền; CP-01 — Camera Hub; TX-03 — Thêm giao dịch thủ công; ST-03 — Tuỳ chọn thông báo.

State và variant Figma: Camera, thư viện, thông báo, vị trí; từ chối tạm thời và từ chối vĩnh viễn.

## SG-06 · Lỗi toàn trang / Thử lại

MVP • Template • Frame: SG-06\_Lỗi\_toàn\_trang\_\_Thử\_lại/Default

Mục tiêu: Cung cấp mẫu lỗi nhất quán cho API, dữ liệu hỏng hoặc thao tác không hoàn tất.

Cần thiết kế: Tiêu đề dễ hiểu, mô tả, mã hỗ trợ tuỳ chọn, CTA thử lại, quay lại và liên hệ hỗ trợ.

Dữ liệu / phụ thuộc: Error category, retryability, correlation ID đã che.

Tương tác chính: Thử lại, quay lại, sao chép mã hỗ trợ.

Đi vào từ: Mọi màn hình.

Đi tới: ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Mất mạng, timeout, quyền, dữ liệu không tồn tại, dịch vụ tạm gián đoạn.

## SG-07 · Deep-link Resolver

P1 • System state • Frame: SG-07\_Deep-link\_Resolver/Default

Mục tiêu: Xử lý link mời vòng tròn, hoá đơn, giao dịch, thanh toán hoặc thông báo khi người dùng chưa đăng nhập.

Cần thiết kế: Loading, preview đích đến, cảnh báo link hết hạn hoặc không có quyền.

Dữ liệu / phụ thuộc: Deep-link payload, auth state, permission, resource existence.

Tương tác chính: Đăng nhập rồi tiếp tục, chấp nhận lời mời, mở tài nguyên, về Home.

Đi vào từ: SG-01 — Splash / Resume; AU-06 — Đăng nhập.

Đi tới: SO-03 — Chi tiết vòng tròn; SO-04 — Tạo vòng tròn / Mời thành viên; TX-02 — Chi tiết giao dịch; IT-02 — Chi tiết món đồ; HM-01 — Home Dashboard.

State và variant Figma: Đang xác thực, link hợp lệ, hết hạn, đã dùng, thiếu quyền, tài nguyên đã xoá.

# 02. Xác thực tài khoản

Luồng vào ứng dụng cần ngắn, có khả năng phục hồi và đủ mạnh cho dữ liệu tài chính.

## AU-01 · Welcome

MVP • Full screen • Frame: AU-01\_Welcome/Default

Mục tiêu: Giới thiệu ngắn giá trị cốt lõi và cho người dùng chọn đăng ký hoặc đăng nhập.

Cần thiết kế: Thông điệp camera–chi tiêu–kỷ niệm, minh hoạ thật, CTA Tạo tài khoản, Đăng nhập, link điều khoản.

Dữ liệu / phụ thuộc: Không yêu cầu dữ liệu riêng tư ở bước này.

Tương tác chính: Tạo tài khoản, đăng nhập, xem điều khoản/quyền riêng tư.

Đi vào từ: SG-01 — Splash / Resume.

Đi tới: AU-02 — Chọn phương thức đăng ký; AU-06 — Đăng nhập; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Default, thiết bị nhỏ, cỡ chữ lớn, dark mode.

## AU-02 · Chọn phương thức đăng ký

MVP • Full screen • Frame: AU-02\_Chọn\_phương\_thức\_đăng\_ký/Default

Mục tiêu: Chọn email, số điện thoại hoặc nhà cung cấp đăng nhập được hỗ trợ.

Cần thiết kế: Các nút phương thức, giải thích dùng một tài khoản duy nhất, link đăng nhập nếu đã có tài khoản.

Dữ liệu / phụ thuộc: Provider availability theo nền tảng/thị trường.

Tương tác chính: Chọn phương thức và tiếp tục.

Đi vào từ: AU-01 — Welcome.

Đi tới: AU-03 — Nhập email / số điện thoại; AU-06 — Đăng nhập.

State và variant Figma: Email, điện thoại, provider lỗi, provider bị huỷ.

## AU-03 · Nhập email / số điện thoại

MVP • Full screen • Frame: AU-03\_Nhập\_email\_\_số\_điện\_thoại/Default

Mục tiêu: Thu thập định danh và đồng ý điều khoản trước khi gửi mã xác minh.

Cần thiết kế: Input có prefix quốc gia, validation, checkbox điều khoản, CTA tiếp tục.

Dữ liệu / phụ thuộc: Email/phone uniqueness, rate limit, consent version.

Tương tác chính: Gửi OTP, đổi phương thức, mở điều khoản.

Đi vào từ: AU-02 — Chọn phương thức đăng ký.

Đi tới: AU-04 — Xác minh OTP; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Empty, typing, hợp lệ, sai định dạng, đã tồn tại, rate limited.

## AU-04 · Xác minh OTP

MVP • Full screen • Frame: AU-04\_Xác\_minh\_OTP/Default

Mục tiêu: Xác nhận quyền sở hữu email/số điện thoại.

Cần thiết kế: 6 ô mã hoặc một field hỗ trợ paste, countdown, resend, đổi định danh.

Dữ liệu / phụ thuộc: OTP transaction, expiration, attempt count.

Tương tác chính: Xác minh, gửi lại, sửa email/số điện thoại.

Đi vào từ: AU-03 — Nhập email / số điện thoại; AU-08 — Khôi phục tài khoản.

Đi tới: AU-05 — Tạo mật khẩu / Passkey; AU-03 — Nhập email / số điện thoại.

State và variant Figma: Auto-fill, sai mã, hết hạn, gửi lại thành công, khoá tạm.

## AU-05 · Tạo mật khẩu / Passkey

MVP • Full screen • Frame: AU-05\_Tạo\_mật\_khẩu\_\_Passkey/Default

Mục tiêu: Thiết lập phương thức đăng nhập an toàn và mã khôi phục.

Cần thiết kế: Password rules, strength meter, CTA tạo passkey, lưu recovery codes.

Dữ liệu / phụ thuộc: Device passkey support, password policy.

Tương tác chính: Tạo passkey, tạo mật khẩu, tải/sao chép mã khôi phục.

Đi vào từ: AU-04 — Xác minh OTP.

Đi tới: OB-01 — Chọn mục tiêu chính.

State và variant Figma: Passkey supported/unsupported, password yếu/mạnh, tạo passkey thất bại.

## AU-06 · Đăng nhập

MVP • Full screen • Frame: AU-06\_Đăng\_nhập/Default

Mục tiêu: Đăng nhập bằng phương thức đã đăng ký và xử lý tài khoản có nhiều phương thức.

Cần thiết kế: Email/phone, password, provider buttons, passkey, quên mật khẩu.

Dữ liệu / phụ thuộc: Account methods, device trust, risk signal.

Tương tác chính: Đăng nhập, dùng passkey, mở khôi phục.

Đi vào từ: AU-01 — Welcome; SG-02 — Khoá ứng dụng; SG-07 — Deep-link Resolver.

Đi tới: AU-07 — Xác thực đa yếu tố; SG-02 — Khoá ứng dụng; HM-01 — Home Dashboard; AU-08 — Khôi phục tài khoản.

State và variant Figma: Sai thông tin, tài khoản bị khoá, provider lỗi, cần MFA, deep link chờ.

## AU-07 · Xác thực đa yếu tố

MVP • Full screen • Frame: AU-07\_Xác\_thực\_đa\_yếu\_tố/Default

Mục tiêu: Xác nhận bước hai bằng app authenticator, SMS/email dự phòng hoặc recovery code.

Cần thiết kế: Code input, phương thức hiện tại, đổi phương thức, tin cậy thiết bị.

Dữ liệu / phụ thuộc: MFA methods, risk level, attempt count.

Tương tác chính: Xác minh, chọn phương thức khác, dùng recovery code.

Đi vào từ: AU-06 — Đăng nhập; ST-06 — Security Center.

Đi tới: HM-01 — Home Dashboard; AU-08 — Khôi phục tài khoản.

State và variant Figma: Code sai/hết hạn, thiết bị tin cậy, mất phương thức, khoá tạm.

## AU-08 · Khôi phục tài khoản

MVP • Multi-step full screen • Frame: AU-08\_Khôi\_phục\_tài\_khoản/Default

Mục tiêu: Khôi phục truy cập mà không làm lộ dữ liệu hoặc hạ thấp bảo mật quá mức.

Cần thiết kế: Chọn vấn đề, xác minh định danh, recovery code, đặt lại mật khẩu, trạng thái yêu cầu hỗ trợ.

Dữ liệu / phụ thuộc: Recovery eligibility, devices, risk checks, support case.

Tương tác chính: Gửi mã, xác minh, đặt lại, liên hệ hỗ trợ.

Đi vào từ: AU-06 — Đăng nhập; AU-07 — Xác thực đa yếu tố; SG-02 — Khoá ứng dụng; ST-08 — Quyền dữ liệu: xuất, xoá, tạm khoá.

Đi tới: AU-04 — Xác minh OTP; AU-05 — Tạo mật khẩu / Passkey; AU-06 — Đăng nhập; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Quên mật khẩu, mất MFA, mất email/phone, chờ hỗ trợ, khôi phục hoàn tất.

# 03. Onboarding và cá nhân hoá ban đầu

Thiết lập đủ để Home hữu ích ngay, nhưng cho phép bỏ qua và hoàn thiện sau.

## OB-01 · Chọn mục tiêu chính

MVP • Full screen • Frame: OB-01\_Chọn\_mục\_tiêu\_chính/Default

Mục tiêu: Xác định lý do dùng app để cá nhân hoá thứ tự onboarding và Home.

Cần thiết kế: Thẻ mục tiêu: kiểm soát chi, tiết kiệm, trả nợ, gia đình, lưu hoá đơn, nhớ món đồ.

Dữ liệu / phụ thuộc: Danh sách mục tiêu và lựa chọn đa mục tiêu có ưu tiên.

Tương tác chính: Chọn tối đa ba mục tiêu, tiếp tục.

Đi vào từ: AU-05 — Tạo mật khẩu / Passkey; SG-01 — Splash / Resume.

Đi tới: OB-02 — Kiểu sử dụng.

State và variant Figma: Chưa chọn, đã chọn, giới hạn số lựa chọn, cỡ chữ lớn.

## OB-02 · Kiểu sử dụng

MVP • Full screen • Frame: OB-02\_Kiểu\_sử\_dụng/Default

Mục tiêu: Chọn cá nhân, cặp đôi, gia đình hoặc freelancer để gợi ý quyền và tính năng.

Cần thiết kế: Thẻ persona, mô tả dữ liệu riêng/chung, lựa chọn thiết lập nhóm sau.

Dữ liệu / phụ thuộc: Persona selection; không suy diễn tình trạng cá nhân.

Tương tác chính: Chọn persona, bỏ qua thiết lập nhóm.

Đi vào từ: OB-01 — Chọn mục tiêu chính.

Đi tới: OB-03 — Ngôn ngữ, tiền tệ và múi giờ; SO-04 — Tạo vòng tròn / Mời thành viên.

State và variant Figma: Cá nhân, cặp đôi, gia đình, freelancer, chưa quyết định.

## OB-03 · Ngôn ngữ, tiền tệ và múi giờ

MVP • Full screen • Frame: OB-03\_Ngôn\_ngữ\_tiền\_tệ\_và\_múi\_giờ/Default

Mục tiêu: Thiết lập định dạng số liệu và kỳ báo cáo đúng địa phương.

Cần thiết kế: Language picker, base currency, timezone, first day of week, date preview.

Dữ liệu / phụ thuộc: Locale defaults từ thiết bị nhưng cần xác nhận.

Tương tác chính: Lưu locale, tìm currency, bật tự động timezone.

Đi vào từ: OB-02 — Kiểu sử dụng.

Đi tới: OB-04 — Thu nhập và chu kỳ lương.

State và variant Figma: Tự nhận diện, tìm kiếm, currency không phổ biến, thay đổi có cảnh báo.

## OB-04 · Thu nhập và chu kỳ lương

MVP • Full screen • Frame: OB-04\_Thu\_nhập\_và\_chu\_kỳ\_lương/Default

Mục tiêu: Tạo khung kế hoạch ban đầu mà không bắt buộc nhập con số nhạy cảm.

Cần thiết kế: Thu nhập ước tính tuỳ chọn, tần suất, ngày nhận lương, chi phí cố định ước tính, nút bỏ qua.

Dữ liệu / phụ thuộc: Income cadence và privacy preference.

Tương tác chính: Nhập khoảng, chọn không muốn trả lời, tiếp tục.

Đi vào từ: OB-03 — Ngôn ngữ, tiền tệ và múi giờ.

Đi tới: OB-05 — Bắt đầu với tài khoản tiền.

State và variant Figma: Có thu nhập cố định, không đều, nhiều nguồn, bỏ qua.

## OB-05 · Bắt đầu với tài khoản tiền

MVP • Full screen • Frame: OB-05\_Bắt\_đầu\_với\_tài\_khoản\_tiền/Default

Mục tiêu: Cho người dùng chọn kết nối tài khoản, tạo ví thủ công hoặc bắt đầu bằng tiền mặt.

Cần thiết kế: Ba lựa chọn lớn, lợi ích và rủi ro quyền dữ liệu, nhãn Có thể làm sau.

Dữ liệu / phụ thuộc: Provider availability, feature flags.

Tương tác chính: Kết nối, tạo thủ công, bỏ qua.

Đi vào từ: OB-04 — Thu nhập và chu kỳ lương.

Đi tới: AC-03 — Thêm / Chỉnh tài khoản thủ công; AC-04 — Chọn nhà cung cấp kết nối; OB-06 — Giới thiệu quyền riêng tư.

State và variant Figma: Provider available/unavailable, không hỗ trợ thị trường, skip.

## OB-06 · Giới thiệu quyền riêng tư

MVP • Full screen • Frame: OB-06\_Giới\_thiệu\_quyền\_riêng\_tư/Default

Mục tiêu: Thiết lập niềm tin trước khi xin camera, ảnh hoặc thông báo.

Cần thiết kế: Ba nguyên tắc: private by default, bạn kiểm soát chia sẻ, có thể xuất/xoá dữ liệu.

Dữ liệu / phụ thuộc: Consent version và policy links.

Tương tác chính: Xem chi tiết, tiếp tục.

Đi vào từ: OB-05 — Bắt đầu với tài khoản tiền; AC-03 — Thêm / Chỉnh tài khoản thủ công; AC-04 — Chọn nhà cung cấp kết nối.

Đi tới: OB-07 — Thiết lập quyền; ST-04 — Privacy Dashboard; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Default, policy link, accessibility mode.

## OB-07 · Thiết lập quyền

MVP • Full screen • Frame: OB-07\_Thiết\_lập\_quyền/Default

Mục tiêu: Xin từng quyền đúng lúc với giải thích và phương án thay thế.

Cần thiết kế: Danh sách camera, thư viện, thông báo, vị trí tuỳ chọn; trạng thái từng quyền.

Dữ liệu / phụ thuộc: OS permission status.

Tương tác chính: Cho phép, để sau, mở Settings.

Đi vào từ: OB-06 — Giới thiệu quyền riêng tư.

Đi tới: OB-08 — Hoàn tất onboarding; SG-05 — Quyền hệ thống bị chặn.

State và variant Figma: Chưa hỏi, đã cấp, từ chối, bị chặn, chỉ ảnh được chọn.

## OB-08 · Hoàn tất onboarding

MVP • Full screen • Frame: OB-08\_Hoàn\_tất\_onboarding/Default

Mục tiêu: Xác nhận app đã sẵn sàng và đề xuất hành động kích hoạt đầu tiên.

Cần thiết kế: Tóm tắt thiết lập, CTA Chụp hoá đơn đầu tiên, Thêm giao dịch hoặc Vào Home.

Dữ liệu / phụ thuộc: Checklist hoàn tất và deep link intent.

Tương tác chính: Bắt đầu capture, thêm giao dịch, mở Home.

Đi vào từ: OB-07 — Thiết lập quyền.

Đi tới: CP-01 — Camera Hub; TX-03 — Thêm giao dịch thủ công; HM-01 — Home Dashboard.

State và variant Figma: Cá nhân hoá theo mục tiêu, chưa có account, chưa cấp camera.

# 04. App shell, Home và điều hướng toàn cục

Khu vực người dùng nhìn thấy mỗi ngày, kết nối tài chính, camera và khoảnh khắc mua sắm.

## HM-01 · Home Dashboard

MVP • Tab root • Frame: HM-01\_Home\_Dashboard/Default

Mục tiêu: Cho biết tình hình hôm nay và một hành động tiếp theo mà không gây quá tải.

Cần thiết kế: Header chào, số dư khả dụng, chi hôm nay/tháng, budget progress, bills, goals, inbox review, feed riêng tư, FAB camera.

Dữ liệu / phụ thuộc: Accounts, transactions, budgets, recurring items, goals, moments, permissions.

Tương tác chính: Mở chi tiết, đổi phạm vi cá nhân/hộ gia đình, chụp, quick add, tùy biến widget.

Đi vào từ: SG-01 — Splash / Resume; SG-02 — Khoá ứng dụng; OB-08 — Hoàn tất onboarding; AU-07 — Xác thực đa yếu tố.

Đi tới: HM-02 — Inbox cần kiểm tra; HM-03 — Trung tâm thông báo; HM-04 — Quick Add; CP-01 — Camera Hub; TX-01 — Danh sách giao dịch; BD-01 — Budget Dashboard; BL-01 — Lịch hoá đơn; GL-01 — Danh sách mục tiêu; SO-02 — Feed vòng tròn; IN-01 — Insights Dashboard; ST-01 — Hồ sơ và Settings Hub.

State và variant Figma: First-use empty, healthy, budget risk, offline, loading skeleton, privacy mode che số tiền.

## HM-02 · Inbox cần kiểm tra

MVP • Full screen • Frame: HM-02\_Inbox\_cần\_kiểm\_tra/Default

Mục tiêu: Gom các việc cần xác nhận: OCR thấp, giao dịch trùng, chưa phân loại, sync lỗi.

Cần thiết kế: Tabs theo loại, count, card có lý do và CTA nhanh, bulk actions an toàn.

Dữ liệu / phụ thuộc: Review tasks từ OCR, transaction quality, sync và shared approvals.

Tương tác chính: Xác nhận, sửa, bỏ qua, xử lý hàng loạt.

Đi vào từ: HM-01 — Home Dashboard; HM-03 — Trung tâm thông báo; SG-03 — Trung tâm ngoại tuyến.

Đi tới: CP-06 — Review OCR tổng quan; CP-10 — Phát hiện trùng; TX-02 — Chi tiết giao dịch; TX-05 — Chọn danh mục và nhãn; AC-06 — Trạng thái đồng bộ; SO-08 — Phân bổ và xác nhận phần chi.

State và variant Figma: Empty success, nhiều ưu tiên, task hết hạn, bulk partial failure.

## HM-03 · Trung tâm thông báo

MVP • Full screen • Frame: HM-03\_Trung\_tâm\_thông\_báo/Default

Mục tiêu: Hiển thị lịch sử cảnh báo và tương tác theo nhóm có thể hành động.

Cần thiết kế: Tabs Tất cả/Tài chính/Xã hội/Hệ thống, unread marker, action buttons, mark all read.

Dữ liệu / phụ thuộc: Notification feed, deep links, read status.

Tương tác chính: Mở đích, đánh dấu đọc, xoá, mở preferences.

Đi vào từ: HM-01 — Home Dashboard; ST-03 — Tuỳ chọn thông báo.

Đi tới: HM-02 — Inbox cần kiểm tra; BD-06 — Chi tiết cảnh báo ngân sách; BL-05 — Cảnh báo trial / tăng giá; SO-06 — Chi tiết bài đăng / Khoảnh khắc; AC-06 — Trạng thái đồng bộ; ST-03 — Tuỳ chọn thông báo.

State và variant Figma: Empty, unread, grouped digest, expired target, offline cache.

## HM-04 · Quick Add

MVP • Bottom sheet • Frame: HM-04\_Quick\_Add/Default

Mục tiêu: Đưa các hành động thường dùng trong một chạm mà không rời ngữ cảnh.

Cần thiết kế: Chụp hoá đơn, chụp món đồ, thêm chi, thêm thu, chuyển tiền, tạo shared expense.

Dữ liệu / phụ thuộc: Recent action và feature availability.

Tương tác chính: Chọn action; đóng sheet.

Đi vào từ: HM-01 — Home Dashboard; TX-01 — Danh sách giao dịch; BD-01 — Budget Dashboard.

Đi tới: CP-01 — Camera Hub; CP-11 — Chụp món đồ; TX-03 — Thêm giao dịch thủ công; TX-07 — Chuyển tiền giữa tài khoản; SO-07 — Tạo chi phí chung.

State và variant Figma: Expanded/collapsed, action bị khoá bởi quyền hoặc gói.

## HM-05 · Tìm kiếm toàn cục

MVP • Full screen • Frame: HM-05\_Tìm\_kiếm\_toàn\_cục/Default

Mục tiêu: Tìm giao dịch, merchant, dòng hàng OCR, món đồ, tài khoản và bài đăng từ một nơi.

Cần thiết kế: Search field sticky, recent searches, filter chips, gợi ý truy vấn, privacy-safe keyboard.

Dữ liệu / phụ thuộc: Search index và scope quyền hiện tại.

Tương tác chính: Nhập từ khoá, dùng voice nếu được phép, mở bộ lọc.

Đi vào từ: HM-01 — Home Dashboard; TX-01 — Danh sách giao dịch; IT-01 — Bộ sưu tập / Album.

Đi tới: HM-06 — Kết quả tìm kiếm.

State và variant Figma: Empty query, recent, suggestions, indexing, offline partial.

## HM-06 · Kết quả tìm kiếm

MVP • Full screen • Frame: HM-06\_Kết\_quả\_tìm\_kiếm/Default

Mục tiêu: Hiển thị kết quả theo loại và giữ bộ lọc nhất quán.

Cần thiết kế: Tabs All/Transactions/Receipts/Items/People, result rows, filter summary, saved search.

Dữ liệu / phụ thuộc: Search results, permission filter, OCR text snippets.

Tương tác chính: Mở kết quả, chỉnh filter, lưu smart folder.

Đi vào từ: HM-05 — Tìm kiếm toàn cục.

Đi tới: TX-02 — Chi tiết giao dịch; IT-02 — Chi tiết món đồ; SO-06 — Chi tiết bài đăng / Khoảnh khắc; AC-02 — Chi tiết tài khoản.

State và variant Figma: No result, partial result, loading more, item đã xoá, không có quyền.

## HM-07 · Monthly Wrap

P1 • Full screen / Story • Frame: HM-07\_Monthly\_Wrap/Default

Mục tiêu: Tóm tắt tháng theo cách dễ hiểu, có số liệu nguồn và hành động cho kỳ tới.

Cần thiết kế: Cards thu/chi, budget, mục tiêu, merchant tăng mạnh, ảnh nổi bật, bài học và next step.

Dữ liệu / phụ thuộc: Closed-period metrics, selected photos, user notes.

Tương tác chính: Drill down, ghi chú, chia sẻ bản che dữ liệu, điều chỉnh kỳ tới.

Đi vào từ: HM-01 — Home Dashboard; BD-07 — Đóng kỳ ngân sách; IN-01 — Insights Dashboard.

Đi tới: IN-03 — Chi tiết báo cáo / Drill-down; BD-04 — Tạo / Chỉnh ngân sách; GL-03 — Tạo / Chỉnh mục tiêu; CP-13 — Composer khoảnh khắc.

State và variant Figma: Tháng đầu, dữ liệu thiếu, achievement, overspend, share preview.

# 05. Giao dịch và sổ tiền

Các màn hình sổ cái đảm bảo người dùng tạo, sửa, split, transfer và đối soát không làm sai số liệu.

## TX-01 · Danh sách giao dịch

MVP • Tab / Full screen • Frame: TX-01\_Danh\_sách\_giao\_dịch/Default

Mục tiêu: Duyệt toàn bộ thu, chi, chuyển tiền và refund theo thời gian.

Cần thiết kế: Date groups, total theo ngày, filter chips, search, account switcher, FAB, pending marker.

Dữ liệu / phụ thuộc: Transactions theo permission, account, currency và sync state.

Tương tác chính: Mở chi tiết, filter, search, bulk select, thêm mới.

Đi vào từ: HM-01 — Home Dashboard; HM-06 — Kết quả tìm kiếm; AC-02 — Chi tiết tài khoản; IN-03 — Chi tiết báo cáo / Drill-down.

Đi tới: TX-02 — Chi tiết giao dịch; TX-03 — Thêm giao dịch thủ công; TX-09 — Quản lý giao dịch hàng loạt; HM-05 — Tìm kiếm toàn cục; TX-10 — Đối soát tài khoản.

State và variant Figma: Empty, loading, pending/posted, offline, sync gap, privacy mode.

## TX-02 · Chi tiết giao dịch

MVP • Full screen • Frame: TX-02\_Chi\_tiết\_giao\_dịch/Default

Mục tiêu: Là nguồn sự thật của một giao dịch và mọi liên kết tới hoá đơn, budget, item, người tham gia.

Cần thiết kế: Amount hero, merchant, date/account/category, split, receipt thumbnails, notes, audit history, shared status.

Dữ liệu / phụ thuộc: Transaction, splits, receipt, account, budget impact, permissions.

Tương tác chính: Sửa, split, refund, attach receipt, chia sẻ, xoá/restore.

Đi vào từ: TX-01 — Danh sách giao dịch; HM-06 — Kết quả tìm kiếm; CP-09 — Khớp với giao dịch đã có; SO-08 — Phân bổ và xác nhận phần chi; AC-02 — Chi tiết tài khoản.

Đi tới: TX-04 — Chỉnh sửa giao dịch; TX-06 — Split giao dịch; TX-08 — Hoàn tiền / Hoàn ứng; CP-01 — Camera Hub; CP-09 — Khớp với giao dịch đã có; IT-02 — Chi tiết món đồ; SO-07 — Tạo chi phí chung.

State và variant Figma: Pending, posted, refunded, transfer pair, shared, deleted, read-only.

## TX-03 · Thêm giao dịch thủ công

MVP • Full screen • Frame: TX-03\_Thêm\_giao\_dịch\_thủ\_công/Default

Mục tiêu: Tạo khoản thu/chi nhanh khi không có hoá đơn hoặc kết nối tài khoản.

Cần thiết kế: Type toggle, amount keypad, date, account, merchant, category, note, attachment, recurrence.

Dữ liệu / phụ thuộc: Accounts, categories, recent merchants, currency.

Tương tác chính: Lưu, lưu và thêm tiếp, scan receipt, tạo recurring.

Đi vào từ: HM-04 — Quick Add; TX-01 — Danh sách giao dịch; OB-08 — Hoàn tất onboarding; GL-04 — Đóng góp / Rút khỏi mục tiêu.

Đi tới: TX-02 — Chi tiết giao dịch; TX-05 — Chọn danh mục và nhãn; BL-03 — Tạo / Chỉnh khoản định kỳ; CP-01 — Camera Hub.

State và variant Figma: Expense/income, cash, multi-currency, validation, save offline.

## TX-04 · Chỉnh sửa giao dịch

MVP • Full screen • Frame: TX-04\_Chỉnh\_sửa\_giao\_dịch/Default

Mục tiêu: Sửa dữ liệu nhưng hiển thị tác động đến ngân sách, shared expense và báo cáo.

Cần thiết kế: Form prefilled, change summary, budget impact, audit note khi dữ liệu chung.

Dữ liệu / phụ thuộc: Current transaction, permissions, downstream links.

Tương tác chính: Lưu, hoàn tác, xem lịch sử, huỷ.

Đi vào từ: TX-02 — Chi tiết giao dịch.

Đi tới: TX-02 — Chi tiết giao dịch; TX-05 — Chọn danh mục và nhãn.

State và variant Figma: No change, amount changed, posted-bank field locked, conflict, read-only.

## TX-05 · Chọn danh mục và nhãn

MVP • Bottom sheet / Full screen • Frame: TX-05\_Chọn\_danh\_mục\_và\_nhãn/Default

Mục tiêu: Gán category/tag nhanh, đồng thời đề xuất rule nếu chỉnh lặp lại.

Cần thiết kế: Search, recent, category tree, tags, create new, rule suggestion.

Dữ liệu / phụ thuộc: Categories, tags, merchant history, permissions.

Tương tác chính: Chọn, tạo category/tag, áp dụng cho dòng hàng, tạo rule.

Đi vào từ: TX-03 — Thêm giao dịch thủ công; TX-04 — Chỉnh sửa giao dịch; CP-06 — Review OCR tổng quan; CP-07 — Review dòng hàng.

Đi tới: TX-03 — Thêm giao dịch thủ công; TX-04 — Chỉnh sửa giao dịch; CP-06 — Review OCR tổng quan; AC-08 — Danh mục, nhãn và quy tắc.

State và variant Figma: Recent, search, archived category, create, permission restricted.

## TX-06 · Split giao dịch

MVP • Full screen • Frame: TX-06\_Split\_giao\_dịch/Default

Mục tiêu: Chia một giao dịch theo danh mục, người, dự án hoặc mục đích mà tổng vẫn cân bằng.

Cần thiết kế: Total header, split rows, remaining amount, equal/percentage/custom modes, validation.

Dữ liệu / phụ thuộc: Transaction amount, categories, circle members, currency precision.

Tương tác chính: Thêm phần, chia đều, phân bổ phần còn lại, lưu.

Đi vào từ: TX-02 — Chi tiết giao dịch; CP-06 — Review OCR tổng quan.

Đi tới: TX-02 — Chi tiết giao dịch; TX-05 — Chọn danh mục và nhãn; SO-08 — Phân bổ và xác nhận phần chi.

State và variant Figma: Balanced/unbalanced, rounding, multi-person, discount/tax allocation, conflict.

## TX-07 · Chuyển tiền giữa tài khoản

MVP • Full screen • Frame: TX-07\_Chuyển\_tiền\_giữa\_tài\_khoản/Default

Mục tiêu: Tạo transfer pair đúng sổ cái thay vì hai giao dịch thu/chi rời.

Cần thiết kế: From/to account, amount, exchange rate, date, fee, note.

Dữ liệu / phụ thuộc: Accounts, balances, currency rates.

Tương tác chính: Xác nhận transfer, đảo chiều, lưu fee riêng.

Đi vào từ: HM-04 — Quick Add; AC-02 — Chi tiết tài khoản; TX-03 — Thêm giao dịch thủ công.

Đi tới: TX-02 — Chi tiết giao dịch; AC-02 — Chi tiết tài khoản.

State và variant Figma: Same currency, FX, fee, insufficient info, duplicate suggestion.

## TX-08 · Hoàn tiền / Hoàn ứng

MVP • Full screen • Frame: TX-08\_Hoàn\_tiền\_\_Hoàn\_ứng/Default

Mục tiêu: Liên kết refund hoặc reimbursement với khoản gốc và cập nhật budget đúng cách.

Cần thiết kế: Original transaction, refunded amount, destination account, participant, evidence, status timeline.

Dữ liệu / phụ thuộc: Original transaction, shared balance, receipt, payment link state.

Tương tác chính: Ghi nhận refund, yêu cầu hoàn ứng, đánh dấu đã nhận, huỷ yêu cầu.

Đi vào từ: TX-02 — Chi tiết giao dịch; IT-05 — Return Center; SO-09 — Settle Up.

Đi tới: TX-02 — Chi tiết giao dịch; SO-09 — Settle Up; IT-02 — Chi tiết món đồ.

State và variant Figma: Full/partial refund, requested, overdue, paid, disputed.

## TX-09 · Quản lý giao dịch hàng loạt

P1 • Selection mode • Frame: TX-09\_Quản\_lý\_giao\_dịch\_hàng\_loạt/Default

Mục tiêu: Thay category/tag/status cho nhiều giao dịch với preview và khả năng hoàn tác.

Cần thiết kế: Selection toolbar, count/sum, action sheet, preview affected budgets, undo toast.

Dữ liệu / phụ thuộc: Selected transactions, permissions, rules.

Tương tác chính: Categorize, tag, mark reviewed, delete, export.

Đi vào từ: TX-01 — Danh sách giao dịch.

Đi tới: TX-01 — Danh sách giao dịch; TX-05 — Chọn danh mục và nhãn; IN-06 — Export Center.

State và variant Figma: Mixed permissions, partial failure, undo available, selection across pages.

## TX-10 · Đối soát tài khoản

P1 • Full screen • Frame: TX-10\_Đối\_soát\_tài\_khoản/Default

Mục tiêu: So khớp số dư app với sao kê và giải quyết chênh lệch có dấu vết.

Cần thiết kế: Statement date/balance, calculated balance, difference, unchecked transactions, adjustment option.

Dữ liệu / phụ thuộc: Account ledger, statement data, pending transactions.

Tương tác chính: Đánh dấu cleared, tìm thiếu/trùng, tạo adjustment, hoàn tất đối soát.

Đi vào từ: AC-02 — Chi tiết tài khoản; TX-01 — Danh sách giao dịch; HM-02 — Inbox cần kiểm tra.

Đi tới: TX-01 — Danh sách giao dịch; TX-02 — Chi tiết giao dịch; AC-02 — Chi tiết tài khoản.

State và variant Figma: Balanced, difference, pending excluded, historical lock, adjustment confirmation.

# 06. Camera, OCR và nhật ký mua sắm

Chuỗi màn hình trọng tâm của sản phẩm, tối ưu để chụp nhanh nhưng không hy sinh khả năng kiểm tra dữ liệu.

## CP-01 · Camera Hub

MVP • Full screen • Frame: CP-01\_Camera\_Hub/Default

Mục tiêu: Mở camera trung tâm và chọn Hoá đơn, Món đồ, Chuyến mua sắm hoặc Khoảnh khắc.

Cần thiết kế: Viewfinder, mode carousel, shutter, gallery, flash, recent capture thumbnail, privacy indicator.

Dữ liệu / phụ thuộc: Camera permission, last mode, upload queue.

Tương tác chính: Chọn mode, chụp, import, mở queue.

Đi vào từ: HM-01 — Home Dashboard; HM-04 — Quick Add; OB-08 — Hoàn tất onboarding; TX-02 — Chi tiết giao dịch.

Đi tới: CP-02 — Chụp hoá đơn trực tiếp; CP-11 — Chụp món đồ; CP-05 — Hàng đợi xử lý; SG-05 — Quyền hệ thống bị chặn.

State và variant Figma: Permission missing, camera unavailable, offline, storage low, dark mode.

## CP-02 · Chụp hoá đơn trực tiếp

MVP • Camera mode • Frame: CP-02\_Chụp\_hoá\_đơn\_trực\_tiếp/Default

Mục tiêu: Giúp căn hoá đơn rõ, đủ góc và giảm blur/chói trước khi bấm chụp.

Cần thiết kế: Edge detection, quality hints, auto-capture toggle, flash, multi-page indicator, shutter.

Dữ liệu / phụ thuộc: Live camera frames và on-device quality score.

Tương tác chính: Chụp, auto-capture, bật flash, thoát.

Đi vào từ: CP-01 — Camera Hub.

Đi tới: CP-03 — Preview, crop và tăng chất lượng; SG-05 — Quyền hệ thống bị chặn.

State và variant Figma: Đủ sáng, mờ, chói, thiếu góc, nhiều hoá đơn, landscape.

## CP-03 · Preview, crop và tăng chất lượng

MVP • Full screen • Frame: CP-03\_Preview\_crop\_và\_tăng\_chất\_lượng/Default

Mục tiêu: Cho người dùng xác nhận ảnh trước upload và sửa crop/perspective.

Cần thiết kế: Image preview, crop handles, rotate, enhance, retake, add page, continue.

Dữ liệu / phụ thuộc: Local image, detected edges, quality warnings.

Tương tác chính: Crop, rotate, retake, thêm trang, dùng ảnh.

Đi vào từ: CP-02 — Chụp hoá đơn trực tiếp.

Đi tới: CP-04 — Hoá đơn nhiều trang / Batch; CP-05 — Hàng đợi xử lý; CP-02 — Chụp hoá đơn trực tiếp.

State và variant Figma: Auto-crop tốt/xấu, ảnh dài, low resolution, edit history.

## CP-04 · Hoá đơn nhiều trang / Batch

P1 • Full screen • Frame: CP-04\_Hoá\_đơn\_nhiều\_trang\_\_Batch/Default

Mục tiêu: Sắp xếp nhiều trang hoặc nhiều hoá đơn trước khi xử lý.

Cần thiết kế: Page thumbnails, drag reorder, page grouping, delete, add more, batch counter.

Dữ liệu / phụ thuộc: Local media queue và grouping metadata.

Tương tác chính: Sắp xếp, tách/gộp, xoá, bắt đầu xử lý.

Đi vào từ: CP-03 — Preview, crop và tăng chất lượng; CP-01 — Camera Hub.

Đi tới: CP-05 — Hàng đợi xử lý; CP-03 — Preview, crop và tăng chất lượng.

State và variant Figma: Một receipt nhiều trang, batch receipts, duplicate page, upload size warning.

## CP-05 · Hàng đợi xử lý

MVP • Full screen / Background status • Frame: CP-05\_Hàng\_đợi\_xử\_lý/Default

Mục tiêu: Hiển thị upload, enhancement và OCR mà không bắt người dùng chờ tại chỗ.

Cần thiết kế: Job cards, stepper, progress, retry, continue in background, offline banner.

Dữ liệu / phụ thuộc: Upload/OCR jobs, network, retry count.

Tương tác chính: Mở kết quả, retry, huỷ job, chụp thêm.

Đi vào từ: CP-03 — Preview, crop và tăng chất lượng; CP-04 — Hoá đơn nhiều trang / Batch; CP-01 — Camera Hub; SG-03 — Trung tâm ngoại tuyến.

Đi tới: CP-06 — Review OCR tổng quan; CP-01 — Camera Hub; SG-03 — Trung tâm ngoại tuyến.

State và variant Figma: Queued, uploading, OCR, completed, failed retryable, failed terminal, offline.

## CP-06 · Review OCR tổng quan

MVP • Full screen • Frame: CP-06\_Review\_OCR\_tổng\_quan/Default

Mục tiêu: Xác nhận merchant, ngày, tổng, currency, account và category với focus vào trường không chắc chắn.

Cần thiết kế: Ảnh/fields split view, confidence badges, source highlight, math status, save draft.

Dữ liệu / phụ thuộc: OCR result, image regions, candidate transaction matches, categories/accounts.

Tương tác chính: Sửa field, mở line items, match transaction, lưu giao dịch, lưu receipt-only.

Đi vào từ: CP-05 — Hàng đợi xử lý; HM-02 — Inbox cần kiểm tra.

Đi tới: CP-07 — Review dòng hàng; CP-09 — Khớp với giao dịch đã có; CP-10 — Phát hiện trùng; TX-05 — Chọn danh mục và nhãn; CP-14 — Capture thành công.

State và variant Figma: High confidence, needs review, math mismatch, unknown currency, handwritten, read-only recheck.

## CP-07 · Review dòng hàng

P1 • Full screen • Frame: CP-07\_Review\_dòng\_hàng/Default

Mục tiêu: Kiểm tra từng item, số lượng, giá, giảm giá, thuế và category.

Cần thiết kế: Line-item list, sum reconciliation, source highlight, bulk category, add/delete row.

Dữ liệu / phụ thuộc: OCR line items, receipt totals, category suggestions.

Tương tác chính: Sửa item, category, split/assign, thêm dòng, xác nhận.

Đi vào từ: CP-06 — Review OCR tổng quan.

Đi tới: CP-08 — Gán dòng hàng cho người / danh mục; TX-05 — Chọn danh mục và nhãn; CP-06 — Review OCR tổng quan.

State và variant Figma: All matched, subtotal mismatch, unreadable row, combo/discount, long receipt.

## CP-08 · Gán dòng hàng cho người / danh mục

P1 • Bottom sheet / Full screen • Frame: CP-08\_Gán\_dòng\_hàng\_cho\_người\_\_danh\_mục/Default

Mục tiêu: Phân bổ món hàng theo thành viên, category, dự án hoặc mục đích.

Cần thiết kế: Item header, assignee chips, split method, tax/tip allocation, remaining amount.

Dữ liệu / phụ thuộc: Circle members, categories, shared expense rules.

Tương tác chính: Gán, chia đều, lưu và áp dụng cho các dòng tương tự.

Đi vào từ: CP-07 — Review dòng hàng.

Đi tới: CP-07 — Review dòng hàng; SO-08 — Phân bổ và xác nhận phần chi; TX-06 — Split giao dịch.

State và variant Figma: Single owner, shared item, unassigned, rounding, participant not in circle.

## CP-09 · Khớp với giao dịch đã có

MVP • Full screen / Bottom sheet • Frame: CP-09\_Khớp\_với\_giao\_dịch\_đã\_có/Default

Mục tiêu: Liên kết receipt với giao dịch bank/import thay vì tạo bản ghi trùng.

Cần thiết kế: Candidate cards với amount/date/merchant score, compare detail, create-new option.

Dữ liệu / phụ thuộc: OCR result và candidate transactions.

Tương tác chính: Chọn match, xem chi tiết, tạo mới, bỏ match.

Đi vào từ: CP-06 — Review OCR tổng quan; TX-02 — Chi tiết giao dịch.

Đi tới: TX-02 — Chi tiết giao dịch; CP-14 — Capture thành công; CP-06 — Review OCR tổng quan.

State và variant Figma: One strong match, multiple matches, no match, amount differs, already linked.

## CP-10 · Phát hiện trùng

MVP • Modal / Full screen • Frame: CP-10\_Phát\_hiện\_trùng/Default

Mục tiêu: Ngăn lưu cùng một hoá đơn hoặc giao dịch hai lần.

Cần thiết kế: Side-by-side evidence, duplicate reasons, timestamps, CTA merge/keep/replace.

Dữ liệu / phụ thuộc: Image fingerprint, invoice ID, merchant/date/amount match.

Tương tác chính: Gộp, giữ cả hai, thay ảnh, huỷ.

Đi vào từ: CP-06 — Review OCR tổng quan; HM-02 — Inbox cần kiểm tra.

Đi tới: TX-02 — Chi tiết giao dịch; CP-06 — Review OCR tổng quan.

State và variant Figma: Exact duplicate, probable duplicate, same amount legitimate, permission restricted.

## CP-11 · Chụp món đồ

MVP • Camera mode • Frame: CP-11\_Chụp\_món\_đồ/Default

Mục tiêu: Chụp sản phẩm như một khoảnh khắc riêng, có thể liên kết với hoá đơn.

Cần thiết kế: Viewfinder, object framing hints, background toggle, gallery, shutter, link receipt chip.

Dữ liệu / phụ thuộc: Camera permission, recent receipts, capture mode.

Tương tác chính: Chụp, import, chọn receipt, đổi mode.

Đi vào từ: CP-01 — Camera Hub; HM-04 — Quick Add; TX-02 — Chi tiết giao dịch.

Đi tới: CP-12 — Metadata món đồ; SG-05 — Quyền hệ thống bị chặn.

State và variant Figma: Object detected, multiple objects, low light, no receipt, offline.

## CP-12 · Metadata món đồ

MVP • Full screen • Frame: CP-12\_Metadata\_món\_đồ/Default

Mục tiêu: Đặt tên, album và dữ liệu sau mua trước khi lưu vào bộ sưu tập.

Cần thiết kế: Photo carousel, name, brand, color/size, price link, album, warranty/return toggles, caption.

Dữ liệu / phụ thuộc: Image suggestions, linked line item/receipt, albums.

Tương tác chính: Sửa metadata, lưu riêng tư, tiếp tục chia sẻ.

Đi vào từ: CP-11 — Chụp món đồ; IT-03 — Thêm / Chỉnh món đồ.

Đi tới: CP-13 — Composer khoảnh khắc; CP-14 — Capture thành công; IT-02 — Chi tiết món đồ.

State và variant Figma: Suggestion accepted/rejected, gift/no price, multiple photos, duplicate item.

## CP-13 · Composer khoảnh khắc

P1 • Full screen • Frame: CP-13\_Composer\_khoảnh\_khắc/Default

Mục tiêu: Tạo bài chia sẻ kiểu Locket với quyền riêng tư theo trường dữ liệu.

Cần thiết kế: Preview, caption, audience, hide amount/merchant/location/time toggles, expiry, comment setting.

Dữ liệu / phụ thuộc: Media, item/transaction links, circles, privacy defaults.

Tương tác chính: Đăng, lưu nháp, preview as viewer, chỉnh redaction.

Đi vào từ: CP-12 — Metadata món đồ; HM-07 — Monthly Wrap; SO-02 — Feed vòng tròn.

Đi tới: SO-02 — Feed vòng tròn; SO-06 — Chi tiết bài đăng / Khoảnh khắc; CP-14 — Capture thành công; ST-05 — Mặc định chia sẻ và redaction.

State và variant Figma: Private, one person, circle, redaction warning, upload progress, post failed.

## CP-14 · Capture thành công

MVP • Success state • Frame: CP-14\_Capture\_thành\_công/Default

Mục tiêu: Xác nhận dữ liệu đã lưu và đưa ra đúng next step thay vì kết thúc cụt.

Cần thiết kế: Success icon, transaction/item summary, budget impact, CTAs view detail, capture another, share.

Dữ liệu / phụ thuộc: Saved transaction, item, budget delta, sharing eligibility.

Tương tác chính: Mở transaction/item, chụp tiếp, chia sẻ, về Home.

Đi vào từ: CP-06 — Review OCR tổng quan; CP-09 — Khớp với giao dịch đã có; CP-12 — Metadata món đồ; CP-13 — Composer khoảnh khắc.

Đi tới: TX-02 — Chi tiết giao dịch; IT-02 — Chi tiết món đồ; CP-01 — Camera Hub; SO-02 — Feed vòng tròn; HM-01 — Home Dashboard.

State và variant Figma: Transaction only, item only, linked pair, saved offline, warning budget threshold.

# 07. Ngân sách

Bộ màn hình lập kế hoạch chi tiêu, theo dõi tốc độ và đóng kỳ.

## BD-01 · Budget Dashboard

MVP • Tab root • Frame: BD-01\_Budget\_Dashboard/Default

Mục tiêu: Hiển thị tổng kế hoạch, đã chi, còn lại và các category rủi ro trong kỳ.

Cần thiết kế: Period switcher, budget summary, category cards, forecast, unbudgeted amount, add button.

Dữ liệu / phụ thuộc: Budgets, transactions, pending policy, household scope.

Tương tác chính: Mở budget, tạo mới, đổi kỳ/phạm vi, đóng kỳ.

Đi vào từ: HM-01 — Home Dashboard; HM-04 — Quick Add.

Đi tới: BD-02 — Chi tiết ngân sách; BD-03 — Chọn phương pháp ngân sách; BD-07 — Đóng kỳ ngân sách; IN-05 — Forecast và What-if.

State và variant Figma: No budget, on track, at risk, over, rollover, shared read-only.

## BD-02 · Chi tiết ngân sách

MVP • Full screen • Frame: BD-02\_Chi\_tiết\_ngân\_sách/Default

Mục tiêu: Giải thích tiến độ một budget và những giao dịch tạo ra thay đổi.

Cần thiết kế: Progress hero, spent/remaining, pace forecast, transaction list, rules, members, notes.

Dữ liệu / phụ thuộc: Budget config, included transactions, forecast.

Tương tác chính: Sửa, chuyển tiền, mở alert, xem giao dịch.

Đi vào từ: BD-01 — Budget Dashboard; HM-01 — Home Dashboard; BD-06 — Chi tiết cảnh báo ngân sách.

Đi tới: BD-04 — Tạo / Chỉnh ngân sách; BD-05 — Chuyển ngân sách; BD-06 — Chi tiết cảnh báo ngân sách; TX-01 — Danh sách giao dịch.

State và variant Figma: Healthy, warning, exceeded, paused, historical locked, no transactions.

## BD-03 · Chọn phương pháp ngân sách

MVP • Full screen • Frame: BD-03\_Chọn\_phương\_pháp\_ngân\_sách/Default

Mục tiêu: Giúp chọn simple limit, envelope, zero-based, 50/30/20 hoặc event budget.

Cần thiết kế: Method cards, short examples, recommended badge, compare link.

Dữ liệu / phụ thuộc: Persona, income cadence, existing budgets.

Tương tác chính: Chọn phương pháp, dùng mẫu, tạo từ đầu.

Đi vào từ: BD-01 — Budget Dashboard; OB-01 — Chọn mục tiêu chính.

Đi tới: BD-04 — Tạo / Chỉnh ngân sách.

State và variant Figma: Recommended, all methods, method unavailable, migrate existing warning.

## BD-04 · Tạo / Chỉnh ngân sách

MVP • Full screen • Frame: BD-04\_Tạo\_\_Chỉnh\_ngân\_sách/Default

Mục tiêu: Đặt kỳ, phạm vi, hạn mức, rollover và quyền chia sẻ.

Cần thiết kế: Name, period, category/merchant/tag scope, amount, rollover, alerts, owner/member permissions.

Dữ liệu / phụ thuộc: Categories, household, historical spend, goals.

Tương tác chính: Lưu, xem preview, áp dụng kỳ sau, xoá/archive.

Đi vào từ: BD-02 — Chi tiết ngân sách; BD-03 — Chọn phương pháp ngân sách; IN-04 — AI Coach; HM-07 — Monthly Wrap.

Đi tới: BD-02 — Chi tiết ngân sách; BD-01 — Budget Dashboard; ST-02 — Hộ gia đình và quyền chung.

State và variant Figma: Create/edit, suggested amount, conflicting scope, shared approval, historical period.

## BD-05 · Chuyển ngân sách

MVP • Bottom sheet / Full screen • Frame: BD-05\_Chuyển\_ngân\_sách/Default

Mục tiêu: Chuyển phần còn lại giữa các category hoặc từ quỹ dự phòng.

Cần thiết kế: From/to picker, available amount, impact preview, reason note.

Dữ liệu / phụ thuộc: Budget balances và transfer rules.

Tương tác chính: Xác nhận chuyển, dùng quỹ dự phòng, hoàn tác.

Đi vào từ: BD-02 — Chi tiết ngân sách; BD-06 — Chi tiết cảnh báo ngân sách.

Đi tới: BD-02 — Chi tiết ngân sách.

State và variant Figma: Enough funds, partial, negative budget, locked period, approval required.

## BD-06 · Chi tiết cảnh báo ngân sách

MVP • Full screen • Frame: BD-06\_Chi\_tiết\_cảnh\_báo\_ngân\_sách/Default

Mục tiêu: Giải thích cảnh báo và đưa ra lựa chọn hành động không phán xét.

Cần thiết kế: Reason, trend chart, top contributing transactions, projected end, action cards.

Dữ liệu / phụ thuộc: Alert, forecast, contributing transactions.

Tương tác chính: Giảm pace, chuyển budget, đánh dấu ngoại lệ, tắt ngưỡng.

Đi vào từ: HM-03 — Trung tâm thông báo; BD-02 — Chi tiết ngân sách.

Đi tới: BD-02 — Chi tiết ngân sách; BD-05 — Chuyển ngân sách; TX-01 — Danh sách giao dịch; BD-04 — Tạo / Chỉnh ngân sách.

State và variant Figma: Threshold reached, forecast over, single large expense, resolved, stale alert.

## BD-07 · Đóng kỳ ngân sách

P1 • Multi-step full screen • Frame: BD-07\_Đóng\_kỳ\_ngân\_sách/Default

Mục tiêu: Hoàn tất review cuối tháng và tạo baseline cho kỳ tiếp theo.

Cần thiết kế: Checklist uncategorized/reconcile, plan-vs-actual, rollover decisions, notes, next-period preview.

Dữ liệu / phụ thuộc: Transactions, reconciliation, budgets, notes.

Tương tác chính: Xử lý task, chốt kỳ, mở wrap, tạo kỳ mới.

Đi vào từ: BD-01 — Budget Dashboard; HM-07 — Monthly Wrap.

Đi tới: HM-02 — Inbox cần kiểm tra; TX-10 — Đối soát tài khoản; HM-07 — Monthly Wrap; BD-01 — Budget Dashboard.

State và variant Figma: Not ready, ready, locked, reopen with warning, household approval.

# 08. Hoá đơn định kỳ và subscription

Lịch nghĩa vụ giúp người dùng thấy trước tiền ra thay vì chỉ phản ứng sau giao dịch.

## BL-01 · Lịch hoá đơn

P1 • Full screen • Frame: BL-01\_Lịch\_hoá\_đơn/Default

Mục tiêu: Hiển thị nghĩa vụ theo calendar/list và tổng cần trả trước kỳ lương.

Cần thiết kế: Calendar, upcoming list, due/paid badges, projected balance, add button.

Dữ liệu / phụ thuộc: Recurring items, accounts, income dates, payment status.

Tương tác chính: Mở detail, thêm recurring, đổi tháng, đánh dấu đã trả.

Đi vào từ: HM-01 — Home Dashboard; BD-01 — Budget Dashboard.

Đi tới: BL-02 — Chi tiết khoản định kỳ; BL-03 — Tạo / Chỉnh khoản định kỳ; BL-04 — Subscription Dashboard.

State và variant Figma: Empty, upcoming, overdue, paid, irregular amount, offline.

## BL-02 · Chi tiết khoản định kỳ

P1 • Full screen • Frame: BL-02\_Chi\_tiết\_khoản\_định\_kỳ/Default

Mục tiêu: Theo dõi lịch, amount range, linked transactions và trạng thái thanh toán.

Cần thiết kế: Merchant, cadence, next due, amount, autopay flag, history, reminders, participants.

Dữ liệu / phụ thuộc: Recurring rule, transactions, account, subscription metadata.

Tương tác chính: Sửa, mark paid/skip, pause/end, mở transaction.

Đi vào từ: BL-01 — Lịch hoá đơn; BL-04 — Subscription Dashboard; BL-05 — Cảnh báo trial / tăng giá.

Đi tới: BL-03 — Tạo / Chỉnh khoản định kỳ; TX-02 — Chi tiết giao dịch; ST-03 — Tuỳ chọn thông báo.

State và variant Figma: Upcoming, due, overdue, skipped, paused, ended, amount changed.

## BL-03 · Tạo / Chỉnh khoản định kỳ

P1 • Full screen • Frame: BL-03\_Tạo\_\_Chỉnh\_khoản\_định\_kỳ/Default

Mục tiêu: Tạo bill, income hoặc recurring transfer với lịch linh hoạt.

Cần thiết kế: Type, amount/range, cadence, dates, account, category, reminder, autopay status.

Dữ liệu / phụ thuộc: Accounts, categories, calendar locale.

Tương tác chính: Lưu, preview occurrences, xoá/end.

Đi vào từ: BL-01 — Lịch hoá đơn; BL-02 — Chi tiết khoản định kỳ; TX-03 — Thêm giao dịch thủ công.

Đi tới: BL-02 — Chi tiết khoản định kỳ; BL-01 — Lịch hoá đơn.

State và variant Figma: Fixed/variable, monthly/custom, first/last occurrence, invalid date.

## BL-04 · Subscription Dashboard

P1 • Full screen • Frame: BL-04\_Subscription\_Dashboard/Default

Mục tiêu: Tổng hợp gói thuê bao, annualized cost và items cần review.

Cần thiết kế: Monthly/yearly total, subscription cards, trial/price flags, usage self-rating, filters.

Dữ liệu / phụ thuộc: Detected and manual subscriptions, FX rate.

Tương tác chính: Mở detail, review alert, add subscription, mark not subscription.

Đi vào từ: BL-01 — Lịch hoá đơn; IN-01 — Insights Dashboard.

Đi tới: BL-02 — Chi tiết khoản định kỳ; BL-05 — Cảnh báo trial / tăng giá; BL-03 — Tạo / Chỉnh khoản định kỳ.

State và variant Figma: No subscriptions, trials active, price increases, duplicate services.

## BL-05 · Cảnh báo trial / tăng giá

P1 • Full screen / Modal • Frame: BL-05\_Cảnh\_báo\_trial\_\_tăng\_giá/Default

Mục tiêu: Cho người dùng quyết định trước gia hạn hoặc sau khi phát hiện tăng giá.

Cần thiết kế: Old/new price, renewal date, annual impact, usage note, cancellation instructions link.

Dữ liệu / phụ thuộc: Subscription history, reminder timing, user-provided cancellation info.

Tương tác chính: Giữ, nhắc sau, đánh dấu huỷ, mở detail.

Đi vào từ: HM-03 — Trung tâm thông báo; BL-04 — Subscription Dashboard.

Đi tới: BL-02 — Chi tiết khoản định kỳ; BL-04 — Subscription Dashboard.

State và variant Figma: Trial ending, price increase, renewal tomorrow, cancelled pending, false positive.

# 09. Mục tiêu tiết kiệm và nợ

Mục tiêu và kế hoạch nợ dùng chung logic dự báo nhưng khác ngôn ngữ và ràng buộc.

## GL-01 · Danh sách mục tiêu

P1 • Full screen • Frame: GL-01\_Danh\_sách\_mục\_tiêu/Default

Mục tiêu: Cho thấy tiến độ các quỹ/mục tiêu và ưu tiên đóng góp.

Cần thiết kế: Goal cards, total saved, next contribution, on-track badge, add button.

Dữ liệu / phụ thuộc: Goals, linked accounts, contributions, household scope.

Tương tác chính: Mở goal, tạo mới, sắp xếp ưu tiên.

Đi vào từ: HM-01 — Home Dashboard; IN-05 — Forecast và What-if.

Đi tới: GL-02 — Chi tiết mục tiêu; GL-03 — Tạo / Chỉnh mục tiêu.

State và variant Figma: Empty, on track, behind, achieved, paused, shared.

## GL-02 · Chi tiết mục tiêu

P1 • Full screen • Frame: GL-02\_Chi\_tiết\_mục\_tiêu/Default

Mục tiêu: Giải thích đã tiết kiệm bao nhiêu, cần đóng góp thế nào và ngày dự kiến đạt.

Cần thiết kế: Progress hero, target/date, schedule, contribution history, linked account, milestones.

Dữ liệu / phụ thuộc: Goal, contributions, forecast assumptions.

Tương tác chính: Đóng góp/rút, chỉnh, chia sẻ milestone, pause/complete.

Đi vào từ: GL-01 — Danh sách mục tiêu; HM-01 — Home Dashboard.

Đi tới: GL-03 — Tạo / Chỉnh mục tiêu; GL-04 — Đóng góp / Rút khỏi mục tiêu; CP-13 — Composer khoảnh khắc.

State và variant Figma: On track, behind, achieved, withdrawal, no linked account.

## GL-03 · Tạo / Chỉnh mục tiêu

P1 • Full screen • Frame: GL-03\_Tạo\_\_Chỉnh\_mục\_tiêu/Default

Mục tiêu: Đặt target, deadline, contribution cadence và quyền chung.

Cần thiết kế: Name/icon, amount, date, starting balance, schedule, linked account, owner/members.

Dữ liệu / phụ thuộc: Accounts, affordability estimate, household.

Tương tác chính: Lưu, preview schedule, use suggested plan.

Đi vào từ: GL-01 — Danh sách mục tiêu; GL-02 — Chi tiết mục tiêu; IN-04 — AI Coach; DB-03 — Scenario Planner.

Đi tới: GL-02 — Chi tiết mục tiêu; ST-02 — Hộ gia đình và quyền chung.

State và variant Figma: No deadline, fixed deadline, shared approval, unrealistic plan warning.

## GL-04 · Đóng góp / Rút khỏi mục tiêu

P1 • Bottom sheet • Frame: GL-04\_Đóng\_góp\_\_Rút\_khỏi\_mục\_tiêu/Default

Mục tiêu: Ghi nhận chuyển động của quỹ mà không nhầm với transfer thực nếu chỉ theo dõi ảo.

Cần thiết kế: Amount, date, source account, virtual/actual label, note, new forecast.

Dữ liệu / phụ thuộc: Goal balance, accounts, contribution plan.

Tương tác chính: Add contribution, withdraw, create linked transaction.

Đi vào từ: GL-02 — Chi tiết mục tiêu.

Đi tới: GL-02 — Chi tiết mục tiêu; TX-03 — Thêm giao dịch thủ công; TX-07 — Chuyển tiền giữa tài khoản.

State và variant Figma: Contribution, withdrawal, insufficient tracked balance, offline save.

## DB-01 · Danh sách khoản nợ

P2 • Full screen • Frame: DB-01\_Danh\_sách\_khoản\_nợ/Default

Mục tiêu: Tổng hợp dư nợ, minimum payments và thứ tự ưu tiên.

Cần thiết kế: Debt cards, total balance, interest estimate, next due, strategy switcher.

Dữ liệu / phụ thuộc: Debt accounts, interest, payment history.

Tương tác chính: Mở debt, thêm khoản nợ, chọn strategy.

Đi vào từ: HM-01 — Home Dashboard; IN-05 — Forecast và What-if.

Đi tới: DB-02 — Chi tiết và kế hoạch nợ; DB-03 — Scenario Planner; AC-03 — Thêm / Chỉnh tài khoản thủ công.

State và variant Figma: Empty, snowball, avalanche, overdue, paid off.

## DB-02 · Chi tiết và kế hoạch nợ

P2 • Full screen • Frame: DB-02\_Chi\_tiết\_và\_kế\_hoạch\_nợ/Default

Mục tiêu: Hiển thị gốc/lãi/phí, schedule và tác động của trả thêm.

Cần thiết kế: Balance, APR, minimum, amortization chart, next payment, extra-payment CTA.

Dữ liệu / phụ thuộc: Debt terms, payment transactions, forecast.

Tương tác chính: Ghi payment, chỉnh terms, mở scenario, mark paid.

Đi vào từ: DB-01 — Danh sách khoản nợ; HM-01 — Home Dashboard.

Đi tới: DB-03 — Scenario Planner; TX-03 — Thêm giao dịch thủ công; BL-02 — Chi tiết khoản định kỳ.

State và variant Figma: Current, overdue, variable rate, paid off, data incomplete.

## DB-03 · Scenario Planner

P2 • Full screen • Frame: DB-03\_Scenario\_Planner/Default

Mục tiêu: So sánh trả thêm, snowball/avalanche hoặc đổi deadline với giả định rõ ràng.

Cần thiết kế: Scenario controls, compare cards, interest/time saved, assumptions, save-plan CTA.

Dữ liệu / phụ thuộc: Debt and cash-flow forecast; không tự giao dịch.

Tương tác chính: Chỉnh input, lưu plan, tạo goal, áp dụng payment target.

Đi vào từ: DB-01 — Danh sách khoản nợ; DB-02 — Chi tiết và kế hoạch nợ; IN-04 — AI Coach; IN-05 — Forecast và What-if.

Đi tới: DB-02 — Chi tiết và kế hoạch nợ; GL-03 — Tạo / Chỉnh mục tiêu; BD-04 — Tạo / Chỉnh ngân sách.

State và variant Figma: Base vs scenario, invalid assumption, negative cash flow, shared plan approval.

# 10. Bộ sưu tập món đồ và vòng đời sau mua

Từ ảnh món đồ đến return, warranty, maintenance và archive.

## IT-01 · Bộ sưu tập / Album

MVP • Tab / Full screen • Frame: IT-01\_Bộ\_sưu\_tập\_\_Album/Default

Mục tiêu: Duyệt món đồ theo album, phòng, người sở hữu hoặc trạng thái.

Cần thiết kế: Photo grid/list toggle, album chips, search, filters, add button, smart collections.

Dữ liệu / phụ thuộc: Items, media, albums, permissions.

Tương tác chính: Mở item, tạo item, tạo album, filter/search.

Đi vào từ: HM-01 — Home Dashboard; HM-06 — Kết quả tìm kiếm; CP-14 — Capture thành công.

Đi tới: IT-02 — Chi tiết món đồ; IT-03 — Thêm / Chỉnh món đồ; HM-05 — Tìm kiếm toàn cục.

State và variant Figma: Empty, photo-heavy, no-photo, shared album, offline cached.

## IT-02 · Chi tiết món đồ

MVP • Full screen • Frame: IT-02\_Chi\_tiết\_món\_đồ/Default

Mục tiêu: Tập hợp ảnh, purchase info, receipt, return, warranty, maintenance và câu chuyện.

Cần thiết kế: Hero gallery, metadata, linked transaction/receipt, timeline, status cards, share action.

Dữ liệu / phụ thuộc: Item, media, receipt, line item, reminders, ownership.

Tương tác chính: Sửa, mở receipt, return, warranty, maintenance, share, archive.

Đi vào từ: IT-01 — Bộ sưu tập / Album; CP-14 — Capture thành công; HM-06 — Kết quả tìm kiếm; SO-06 — Chi tiết bài đăng / Khoảnh khắc.

Đi tới: IT-03 — Thêm / Chỉnh món đồ; IT-04 — Kho chứng từ món đồ; IT-05 — Return Center; IT-06 — Bảo hành; IT-07 — Bảo trì và chi phí vòng đời; IT-08 — Bán / Tặng / Archive; CP-13 — Composer khoảnh khắc.

State và variant Figma: Private/shared, gift, no receipt, sold/archive, read-only member.

## IT-03 · Thêm / Chỉnh món đồ

MVP • Full screen • Frame: IT-03\_Thêm\_\_Chỉnh\_món\_đồ/Default

Mục tiêu: Quản lý metadata chi tiết khi OCR/image suggestion chưa đủ.

Cần thiết kế: Photos, name, brand/model, serial, size/color, price, owner, location, album, tags.

Dữ liệu / phụ thuộc: Item suggestions, receipts, household members.

Tương tác chính: Lưu, scan serial, link receipt, change owner.

Đi vào từ: IT-01 — Bộ sưu tập / Album; IT-02 — Chi tiết món đồ; CP-12 — Metadata món đồ.

Đi tới: IT-02 — Chi tiết món đồ; IT-04 — Kho chứng từ món đồ; CP-01 — Camera Hub.

State và variant Figma: Create/edit, duplicate suggestion, serial hidden, shared approval.

## IT-04 · Kho chứng từ món đồ

P1 • Full screen • Frame: IT-04\_Kho\_chứng\_từ\_món\_đồ/Default

Mục tiêu: Xem hoá đơn, manual, certificate và tài liệu theo item.

Cần thiết kế: Document list, thumbnail/viewer, type, date, source, download/share controls.

Dữ liệu / phụ thuộc: Receipts, PDFs, images, retention and permissions.

Tương tác chính: Mở, thêm scan/file, đổi loại, xuất package, xoá.

Đi vào từ: IT-02 — Chi tiết món đồ; TX-02 — Chi tiết giao dịch.

Đi tới: CP-01 — Camera Hub; CP-06 — Review OCR tổng quan; TX-02 — Chi tiết giao dịch; IN-06 — Export Center.

State và variant Figma: Empty, image/PDF, upload processing, corrupted file, redacted share.

## IT-05 · Return Center

P1 • Full screen • Frame: IT-05\_Return\_Center/Default

Mục tiêu: Theo dõi món sắp hết hạn đổi trả và tiến trình hoàn tiền/đổi hàng.

Cần thiết kế: Deadline cards, merchant policy summary, checklist, status timeline, refund link.

Dữ liệu / phụ thuộc: Item, purchase date, return policy, transaction/refund.

Tương tác chính: Bắt đầu return, mark shipped/returned, record refund, snooze.

Đi vào từ: IT-02 — Chi tiết món đồ; HM-03 — Trung tâm thông báo.

Đi tới: TX-08 — Hoàn tiền / Hoàn ứng; IT-02 — Chi tiết món đồ; BL-01 — Lịch hoá đơn.

State và variant Figma: Eligible, deadline soon, expired, return in progress, refunded, exchanged.

## IT-06 · Bảo hành

P1 • Full screen • Frame: IT-06\_Bảo\_hành/Default

Mục tiêu: Lưu coverage, serial, provider và claim history.

Cần thiết kế: Warranty status, dates, provider contact, covered items, documents, claim timeline.

Dữ liệu / phụ thuộc: Item, warranty terms, reminders, attachments.

Tương tác chính: Tạo claim record, thêm tài liệu, nhắc hết hạn, mark resolved.

Đi vào từ: IT-02 — Chi tiết món đồ; HM-03 — Trung tâm thông báo.

Đi tới: IT-04 — Kho chứng từ món đồ; IT-02 — Chi tiết món đồ; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Active, expiring, expired, claim open, repaired/replaced.

## IT-07 · Bảo trì và chi phí vòng đời

P2 • Full screen • Frame: IT-07\_Bảo\_trì\_và\_chi\_phí\_vòng\_đời/Default

Mục tiêu: Lên lịch bảo trì và ghi tổng chi phí sở hữu.

Cần thiết kế: Upcoming tasks, maintenance history, recurring schedule, cost total, notes/photos.

Dữ liệu / phụ thuộc: Item, maintenance events, transactions.

Tương tác chính: Thêm task, mark done, link expense, repeat schedule.

Đi vào từ: IT-02 — Chi tiết món đồ; HM-03 — Trung tâm thông báo.

Đi tới: TX-03 — Thêm giao dịch thủ công; BL-03 — Tạo / Chỉnh khoản định kỳ; IT-02 — Chi tiết món đồ.

State và variant Figma: No schedule, due soon, overdue, completed, cost anomaly.

## IT-08 · Bán / Tặng / Archive

P2 • Full screen • Frame: IT-08\_Bán\_\_Tặng\_\_Archive/Default

Mục tiêu: Kết thúc vòng đời món đồ và ghi số tiền thu hồi hoặc người nhận.

Cần thiết kế: Status choice, date, resale amount, linked income, export photos/description, privacy note.

Dữ liệu / phụ thuộc: Item, photos, ownership, transaction.

Tương tác chính: Archive, mark sold/donated/lost, create income, restore.

Đi vào từ: IT-02 — Chi tiết món đồ.

Đi tới: IT-01 — Bộ sưu tập / Album; TX-03 — Thêm giao dịch thủ công; IN-06 — Export Center.

State và variant Figma: Sold, donated, lost, broken, recycled, draft resale package.

# 11. Vòng tròn riêng tư và chi phí chung

Lớp xã hội gần gũi như Locket, nhưng audience và dữ liệu tài chính phải nhìn thấy trước khi đăng.

## SO-01 · Danh sách vòng tròn

P1 • Full screen • Frame: SO-01\_Danh\_sách\_vòng\_tròn/Default

Mục tiêu: Quản lý các nhóm cặp đôi, gia đình, bạn thân hoặc chuyến đi.

Cần thiết kế: Circle cards, unread count, member avatars, shared balance, create button.

Dữ liệu / phụ thuộc: Circles, membership, permissions, unread posts.

Tương tác chính: Mở feed/detail, tạo circle, accept invite.

Đi vào từ: HM-01 — Home Dashboard; ST-01 — Hồ sơ và Settings Hub.

Đi tới: SO-02 — Feed vòng tròn; SO-03 — Chi tiết vòng tròn; SO-04 — Tạo vòng tròn / Mời thành viên.

State và variant Figma: Empty, invited, active, muted, archived, membership pending.

## SO-02 · Feed vòng tròn

P1 • Full screen • Frame: SO-02\_Feed\_vòng\_tròn/Default

Mục tiêu: Hiển thị moments riêng tư, milestone và shared expenses trong một nhóm.

Cần thiết kế: Circle header, moment cards, reactions, comment preview, compose/camera CTA, filters.

Dữ liệu / phụ thuộc: Posts, audiences, media, linked item/transaction, permissions.

Tương tác chính: Mở post, react, comment, chụp, tạo shared expense.

Đi vào từ: HM-01 — Home Dashboard; SO-01 — Danh sách vòng tròn; CP-13 — Composer khoảnh khắc.

Đi tới: SO-03 — Chi tiết vòng tròn; SO-06 — Chi tiết bài đăng / Khoảnh khắc; CP-01 — Camera Hub; SO-07 — Tạo chi phí chung.

State và variant Figma: Empty new circle, content, muted, offline cache, deleted post placeholder.

## SO-03 · Chi tiết vòng tròn

P1 • Full screen • Frame: SO-03\_Chi\_tiết\_vòng\_tròn/Default

Mục tiêu: Tổng quan members, shared budget/balance, albums và cài đặt nhóm.

Cần thiết kế: Cover, members, balance summary, albums, pinned goals, settings entry.

Dữ liệu / phụ thuộc: Circle, roles, shared objects, permissions.

Tương tác chính: Mở members, invite, settle up, archive/leave.

Đi vào từ: SO-01 — Danh sách vòng tròn; SO-02 — Feed vòng tròn; SG-07 — Deep-link Resolver.

Đi tới: SO-04 — Tạo vòng tròn / Mời thành viên; SO-05 — Thành viên và quyền; SO-09 — Settle Up; ST-02 — Hộ gia đình và quyền chung.

State và variant Figma: Owner/member/guest, pending invite, archived, leaving warning.

## SO-04 · Tạo vòng tròn / Mời thành viên

P1 • Multi-step full screen • Frame: SO-04\_Tạo\_vòng\_tròn\_\_Mời\_thành\_viên/Default

Mục tiêu: Tạo nhóm, đặt mục đích, quyền mặc định và gửi lời mời an toàn.

Cần thiết kế: Name/type, privacy defaults, invite contacts/link/code, expiry, preview permissions.

Dữ liệu / phụ thuộc: User contacts only if permission; invite service.

Tương tác chính: Tạo, chia sẻ link, copy code, revoke invite.

Đi vào từ: SO-01 — Danh sách vòng tròn; SO-03 — Chi tiết vòng tròn; OB-02 — Kiểu sử dụng.

Đi tới: SO-03 — Chi tiết vòng tròn; SO-05 — Thành viên và quyền; SG-07 — Deep-link Resolver.

State và variant Figma: No contacts permission, invite sent, existing member, link expired, rate limited.

## SO-05 · Thành viên và quyền

P1 • Full screen • Frame: SO-05\_Thành\_viên\_và\_quyền/Default

Mục tiêu: Cấu hình ai xem số dư, giao dịch, ảnh và ai được sửa kế hoạch.

Cần thiết kế: Member list, role, permission matrix, pending invites, ownership transfer.

Dữ liệu / phụ thuộc: Roles, object permissions, audit history.

Tương tác chính: Đổi role, customise permission, remove, transfer owner.

Đi vào từ: SO-03 — Chi tiết vòng tròn; ST-02 — Hộ gia đình và quyền chung.

Đi tới: SO-03 — Chi tiết vòng tròn; ST-02 — Hộ gia đình và quyền chung.

State và variant Figma: Owner, manager, member, child, guest, pending, last-owner protection.

## SO-06 · Chi tiết bài đăng / Khoảnh khắc

P1 • Full screen • Frame: SO-06\_Chi\_tiết\_bài\_đăng\_\_Khoảnh\_khắc/Default

Mục tiêu: Xem ảnh, caption, quyền đã chia sẻ, reaction, comment và liên kết item/transaction.

Cần thiết kế: Media viewer, metadata chips, reactions, comments, privacy badge, overflow menu.

Dữ liệu / phụ thuộc: Post, audience, media, linked objects, moderation status.

Tương tác chính: React, comment, open item/transaction, edit audience, report/delete.

Đi vào từ: SO-02 — Feed vòng tròn; HM-03 — Trung tâm thông báo; HM-06 — Kết quả tìm kiếm.

Đi tới: IT-02 — Chi tiết món đồ; TX-02 — Chi tiết giao dịch; CP-13 — Composer khoảnh khắc; SO-10 — Báo cáo / Chặn / An toàn.

State và variant Figma: Own/other post, amount hidden, expired, reported, deleted, comments off.

## SO-07 · Tạo chi phí chung

P1 • Full screen • Frame: SO-07\_Tạo\_chi\_phí\_chung/Default

Mục tiêu: Biến giao dịch/hoá đơn thành khoản cần chia cho nhóm.

Cần thiết kế: Source transaction/receipt, circle, participants, split method, note, due date.

Dữ liệu / phụ thuộc: Transaction, receipt lines, circle members.

Tương tác chính: Chọn source, split, gửi yêu cầu xác nhận.

Đi vào từ: HM-04 — Quick Add; SO-02 — Feed vòng tròn; TX-02 — Chi tiết giao dịch; CP-06 — Review OCR tổng quan.

Đi tới: SO-08 — Phân bổ và xác nhận phần chi; CP-01 — Camera Hub.

State và variant Figma: With/without receipt, equal/item/custom, participant outside circle.

## SO-08 · Phân bổ và xác nhận phần chi

P1 • Full screen • Frame: SO-08\_Phân\_bổ\_và\_xác\_nhận\_phần\_chi/Default

Mục tiêu: Cho người trả phân bổ và thành viên xác nhận phần của mình.

Cần thiết kế: Line items, assignee rows, tax/tip allocation, totals, comments, approval status.

Dữ liệu / phụ thuộc: Shared expense, receipt lines, members, permissions.

Tương tác chính: Chỉnh phần, accept, request change, finalise.

Đi vào từ: SO-07 — Tạo chi phí chung; CP-08 — Gán dòng hàng cho người / danh mục; HM-02 — Inbox cần kiểm tra.

Đi tới: SO-09 — Settle Up; TX-02 — Chi tiết giao dịch; TX-06 — Split giao dịch.

State và variant Figma: Draft, awaiting, partially accepted, disputed, finalised, rounding issue.

## SO-09 · Settle Up

P1 • Full screen • Frame: SO-09\_Settle\_Up/Default

Mục tiêu: Tổng hợp ai nợ ai và ghi nhận hoàn tiền không phụ thuộc một cổng thanh toán.

Cần thiết kế: Net balances, suggested transfers, payment method/deeplink, mark paid, history.

Dữ liệu / phụ thuộc: Shared balances, reimbursement transactions, payment links.

Tương tác chính: Nhắc, mở payment app, mark paid, confirm received, dispute.

Đi vào từ: SO-03 — Chi tiết vòng tròn; SO-08 — Phân bổ và xác nhận phần chi; TX-08 — Hoàn tiền / Hoàn ứng.

Đi tới: TX-08 — Hoàn tiền / Hoàn ứng; SO-03 — Chi tiết vòng tròn; HM-03 — Trung tâm thông báo.

State và variant Figma: Nothing owed, pending, partially paid, paid awaiting confirmation, disputed.

## SO-10 · Báo cáo / Chặn / An toàn

P1 • Bottom sheet + Full screen • Frame: SO-10\_Báo\_cáo\_\_Chặn\_\_An\_toàn/Default

Mục tiêu: Cho phép xử lý nội dung hoặc thành viên gây hại và giải thích hậu quả.

Cần thiết kế: Reason list, optional details, block toggle, affected content preview, confirmation.

Dữ liệu / phụ thuộc: Post/member, circle relation, moderation policy.

Tương tác chính: Report, block, mute, leave circle, cancel.

Đi vào từ: SO-06 — Chi tiết bài đăng / Khoảnh khắc; SO-03 — Chi tiết vòng tròn; SO-05 — Thành viên và quyền.

Đi tới: SO-02 — Feed vòng tròn; SO-03 — Chi tiết vòng tròn; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Report post/comment/member, block confirmation, already reported, emergency guidance.

# 12. Insights, báo cáo và AI coach

Mọi insight phải drill-down được và nêu rõ nguồn, phạm vi thời gian, giả định.

## IN-01 · Insights Dashboard

P1 • Tab / Full screen • Frame: IN-01\_Insights\_Dashboard/Default

Mục tiêu: Tổng hợp cash flow, category, merchant, savings rate và bất thường.

Cần thiết kế: Period/account filters, KPI cards, charts, anomalies, report shortcuts, AI prompt entry.

Dữ liệu / phụ thuộc: Verified transactions, budgets, goals, accounts, permissions.

Tương tác chính: Đổi filter, mở report, mở coach, forecast, export.

Đi vào từ: HM-01 — Home Dashboard; HM-07 — Monthly Wrap.

Đi tới: IN-02 — Report Explorer; IN-04 — AI Coach; IN-05 — Forecast và What-if; IN-06 — Export Center.

State và variant Figma: No data, partial accounts, normal, anomaly, privacy mode, household scope.

## IN-02 · Report Explorer

P1 • Full screen • Frame: IN-02\_Report\_Explorer/Default

Mục tiêu: Chọn báo cáo chuẩn hoặc cấu hình dimension, metric và filter.

Cần thiết kế: Template cards, metric/dimension picker, date range, account/category filters, preview.

Dữ liệu / phụ thuộc: Reporting dimensions và permission scope.

Tương tác chính: Chọn template, chạy report, lưu view.

Đi vào từ: IN-01 — Insights Dashboard; ST-01 — Hồ sơ và Settings Hub.

Đi tới: IN-03 — Chi tiết báo cáo / Drill-down.

State và variant Figma: Templates, custom, invalid combination, large query warning.

## IN-03 · Chi tiết báo cáo / Drill-down

P1 • Full screen • Frame: IN-03\_Chi\_tiết\_báo\_cáo\_\_Drill-down/Default

Mục tiêu: Giải thích biểu đồ bằng số và danh sách giao dịch nguồn.

Cần thiết kế: Chart, KPI summary, compare period, top contributors, transaction list, methodology.

Dữ liệu / phụ thuộc: Aggregates và source transactions.

Tương tác chính: Drill down, exclude item, open transaction, export/share.

Đi vào từ: IN-02 — Report Explorer; HM-07 — Monthly Wrap; IN-04 — AI Coach.

Đi tới: TX-01 — Danh sách giao dịch; TX-02 — Chi tiết giao dịch; IN-06 — Export Center.

State và variant Figma: Loading, no data, compare, excluded outlier, mixed currency warning.

## IN-04 · AI Coach

P2 • Full screen • Frame: IN-04\_AI\_Coach/Default

Mục tiêu: Trả lời câu hỏi tài chính bằng dữ liệu đã xác nhận, kèm nguồn và action có kiểm soát.

Cần thiết kế: Conversation, suggested prompts, scope chip, source cards, assumptions, feedback, privacy control.

Dữ liệu / phụ thuộc: User-approved financial context, model policy, report engine.

Tương tác chính: Hỏi, đổi scope, mở nguồn, tạo draft budget/goal/scenario, xoá chat.

Đi vào từ: HM-01 — Home Dashboard; IN-01 — Insights Dashboard; BD-06 — Chi tiết cảnh báo ngân sách.

Đi tới: IN-03 — Chi tiết báo cáo / Drill-down; BD-04 — Tạo / Chỉnh ngân sách; GL-03 — Tạo / Chỉnh mục tiêu; DB-03 — Scenario Planner; ST-04 — Privacy Dashboard.

State và variant Figma: First use consent, streaming, source missing, unsafe advice boundary, error, delete history.

## IN-05 · Forecast và What-if

P2 • Full screen • Frame: IN-05\_Forecast\_và\_What-if/Default

Mục tiêu: Dự báo số dư, budget và mục tiêu theo kịch bản có giả định rõ.

Cần thiết kế: Timeline chart, assumptions panel, bills/income events, scenario controls, compare baseline.

Dữ liệu / phụ thuộc: Accounts, recurring items, budgets, goals, exchange rates.

Tương tác chính: Thay input, lưu scenario, tạo budget/goal, mở contributing event.

Đi vào từ: HM-01 — Home Dashboard; BD-01 — Budget Dashboard; IN-01 — Insights Dashboard; DB-03 — Scenario Planner.

Đi tới: BD-04 — Tạo / Chỉnh ngân sách; GL-03 — Tạo / Chỉnh mục tiêu; DB-03 — Scenario Planner; BL-02 — Chi tiết khoản định kỳ.

State và variant Figma: Baseline, optimistic, conservative, missing recurring data, negative balance.

## IN-06 · Export Center

MVP • Full screen • Frame: IN-06\_Export\_Center/Default

Mục tiêu: Xuất dữ liệu có phạm vi, định dạng và che thông tin nhạy cảm rõ ràng.

Cần thiết kế: Export type, date/accounts, CSV/PDF/ZIP, include receipts/media, redaction, destination, history.

Dữ liệu / phụ thuộc: Transactions, reports, media, data-rights policy.

Tương tác chính: Tạo export, tải/chia sẻ, huỷ job, xoá file.

Đi vào từ: IN-01 — Insights Dashboard; IN-03 — Chi tiết báo cáo / Drill-down; IT-04 — Kho chứng từ món đồ; ST-08 — Quyền dữ liệu: xuất, xoá, tạm khoá; TX-09 — Quản lý giao dịch hàng loạt.

Đi tới: ST-08 — Quyền dữ liệu: xuất, xoá, tạm khoá; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Estimating size, processing, ready, expired, failed, encrypted package.

# 13. Tài khoản tiền, kết nối và quy tắc dữ liệu

Nơi quản lý nguồn tiền, đồng bộ, import và chuẩn hoá phân loại.

## AC-01 · Danh sách tài khoản

MVP • Full screen • Frame: AC-01\_Danh\_sách\_tài\_khoản/Default

Mục tiêu: Hiển thị các tài khoản tiền, số dư, loại và trạng thái đồng bộ.

Cần thiết kế: Net balance, account groups, sync badges, hidden accounts, add button.

Dữ liệu / phụ thuộc: Financial accounts, balances, connection health.

Tương tác chính: Mở account, add manual, connect provider, reorder/hide.

Đi vào từ: HM-01 — Home Dashboard; ST-01 — Hồ sơ và Settings Hub; OB-05 — Bắt đầu với tài khoản tiền.

Đi tới: AC-02 — Chi tiết tài khoản; AC-03 — Thêm / Chỉnh tài khoản thủ công; AC-04 — Chọn nhà cung cấp kết nối.

State và variant Figma: Empty, connected/manual, stale, auth expired, hidden, multi-currency.

## AC-02 · Chi tiết tài khoản

MVP • Full screen • Frame: AC-02\_Chi\_tiết\_tài\_khoản/Default

Mục tiêu: Xem balance, activity, settings, reconciliation và sync source của một account.

Cần thiết kế: Balance, available/credit, transaction preview, sync status, account settings.

Dữ liệu / phụ thuộc: Account, connection, transactions, reconciliation state.

Tương tác chính: Mở transactions, reconcile, refresh, edit/archive.

Đi vào từ: AC-01 — Danh sách tài khoản; TX-07 — Chuyển tiền giữa tài khoản; HM-06 — Kết quả tìm kiếm.

Đi tới: TX-01 — Danh sách giao dịch; TX-10 — Đối soát tài khoản; AC-06 — Trạng thái đồng bộ; AC-03 — Thêm / Chỉnh tài khoản thủ công.

State và variant Figma: Manual/connected, credit, closed, stale, read-only, FX.

## AC-03 · Thêm / Chỉnh tài khoản thủ công

MVP • Full screen • Frame: AC-03\_Thêm\_\_Chỉnh\_tài\_khoản\_thủ\_công/Default

Mục tiêu: Tạo cash, bank, card, loan, investment hoặc custom account không qua provider.

Cần thiết kế: Type, name, currency, opening balance/date, include net worth, owner, color/icon.

Dữ liệu / phụ thuộc: Account types, currencies, household members.

Tương tác chính: Lưu, archive, convert type with warning.

Đi vào từ: AC-01 — Danh sách tài khoản; OB-05 — Bắt đầu với tài khoản tiền; DB-01 — Danh sách khoản nợ.

Đi tới: AC-02 — Chi tiết tài khoản; OB-06 — Giới thiệu quyền riêng tư.

State và variant Figma: Create/edit, card fields, loan fields, multi-currency, duplicate name.

## AC-04 · Chọn nhà cung cấp kết nối

P1 • Full screen • Frame: AC-04\_Chọn\_nhà\_cung\_cấp\_kết\_nối/Default

Mục tiêu: Tìm ngân hàng/ví được hỗ trợ và giải thích dữ liệu sẽ được đọc.

Cần thiết kế: Search, popular providers, country filter, security explanation, manual fallback.

Dữ liệu / phụ thuộc: Provider directory, market availability.

Tương tác chính: Chọn provider, tìm kiếm, dùng manual/import.

Đi vào từ: AC-01 — Danh sách tài khoản; OB-05 — Bắt đầu với tài khoản tiền.

Đi tới: AC-05 — Consent và chọn tài khoản kết nối; AC-03 — Thêm / Chỉnh tài khoản thủ công; AC-07 — Import file và ánh xạ cột.

State và variant Figma: Available, provider down, unsupported, no results.

## AC-05 · Consent và chọn tài khoản kết nối

P1 • External webview + Return screen • Frame: AC-05\_Consent\_và\_chọn\_tài\_khoản\_kết\_nối/Default

Mục tiêu: Hoàn tất provider auth và chọn account nào được import.

Cần thiết kế: Pre-consent summary, provider handoff, return status, account selector, data range.

Dữ liệu / phụ thuộc: Provider OAuth/open-banking result, accounts, consent expiry.

Tương tác chính: Tiếp tục provider, chọn accounts, xác nhận import, huỷ.

Đi vào từ: AC-04 — Chọn nhà cung cấp kết nối; OB-05 — Bắt đầu với tài khoản tiền.

Đi tới: AC-01 — Danh sách tài khoản; AC-06 — Trạng thái đồng bộ; SG-06 — Lỗi toàn trang / Thử lại.

State và variant Figma: In provider, cancelled, success, partial, consent denied, MFA provider.

## AC-06 · Trạng thái đồng bộ

P1 • Full screen • Frame: AC-06\_Trạng\_thái\_đồng\_bộ/Default

Mục tiêu: Giải thích last sync, lỗi, items imported và các bước phục hồi.

Cần thiết kế: Connection timeline, last success, error reason, re-auth CTA, imported/skipped counts.

Dữ liệu / phụ thuộc: Connection jobs, auth status, duplicate detection.

Tương tác chính: Refresh, re-auth, disconnect, inspect imported items.

Đi vào từ: AC-01 — Danh sách tài khoản; AC-02 — Chi tiết tài khoản; HM-02 — Inbox cần kiểm tra; SG-03 — Trung tâm ngoại tuyến.

Đi tới: AC-05 — Consent và chọn tài khoản kết nối; TX-01 — Danh sách giao dịch; SG-03 — Trung tâm ngoại tuyến.

State và variant Figma: Healthy, syncing, auth expired, provider outage, partial import, disconnected.

## AC-07 · Import file và ánh xạ cột

P1 • Multi-step full screen • Frame: AC-07\_Import\_file\_và\_ánh\_xạ\_cột/Default

Mục tiêu: Nhập CSV/OFX/QIF với preview, mapping và rollback.

Cần thiết kế: File picker, encoding/delimiter, column mapping, sample rows, duplicate policy, import summary.

Dữ liệu / phụ thuộc: File contents, account/category options, import job.

Tương tác chính: Chọn file, map, validate, import, undo batch.

Đi vào từ: AC-04 — Chọn nhà cung cấp kết nối; ST-01 — Hồ sơ và Settings Hub.

Đi tới: TX-01 — Danh sách giao dịch; AC-06 — Trạng thái đồng bộ; TX-05 — Chọn danh mục và nhãn.

State và variant Figma: Unsupported file, mapping incomplete, validation errors, duplicates, imported, rollback.

## AC-08 · Danh mục, nhãn và quy tắc

MVP • Full screen • Frame: AC-08\_Danh\_mục\_nhãn\_và\_quy\_tắc/Default

Mục tiêu: Quản lý taxonomy và automation từ một hub có preview tác động.

Cần thiết kế: Tabs Categories/Tags/Rules/Merchants, search, reorder, create, rule status, conflict inbox.

Dữ liệu / phụ thuộc: Categories, tags, merchants, rules, usage counts.

Tương tác chính: Create/edit/archive, merge, run rule preview, rollback.

Đi vào từ: ST-01 — Hồ sơ và Settings Hub; TX-05 — Chọn danh mục và nhãn; HM-02 — Inbox cần kiểm tra.

Đi tới: TX-05 — Chọn danh mục và nhãn; TX-01 — Danh sách giao dịch; SG-06 — Lỗi toàn trang / Thử lại.

State và variant Figma: Empty custom, rule conflict, archived category, merge preview, permission read-only.

# 14. Hồ sơ, cài đặt, bảo mật và hỗ trợ

Tập trung các quyền kiểm soát dữ liệu, trải nghiệm, billing và hỗ trợ.

## ST-01 · Hồ sơ và Settings Hub

MVP • Tab root • Frame: ST-01\_Hồ\_sơ\_và\_Settings\_Hub/Default

Mục tiêu: Điểm vào cho profile, accounts, circles, preferences, security, billing và support.

Cần thiết kế: Avatar/name, plan, household switcher, grouped settings rows, warning badges.

Dữ liệu / phụ thuộc: Profile, plan, connections, security status.

Tương tác chính: Mở từng khu vực, sign out.

Đi vào từ: HM-01 — Home Dashboard; SO-01 — Danh sách vòng tròn.

Đi tới: AC-01 — Danh sách tài khoản; ST-02 — Hộ gia đình và quyền chung; ST-03 — Tuỳ chọn thông báo; ST-04 — Privacy Dashboard; ST-06 — Security Center; ST-09 — Giao diện và trợ năng; ST-10 — Ngôn ngữ, tiền tệ và định dạng; ST-11 — Gói và Billing; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Personal/family, security warning, billing warning, offline.

## ST-02 · Hộ gia đình và quyền chung

P1 • Full screen • Frame: ST-02\_Hộ\_gia\_đình\_và\_quyền\_chung/Default

Mục tiêu: Quản lý household profile, shared scope, members và quyền cấp cao.

Cần thiết kế: Household name, members, roles, shared accounts/budgets, approval rules, ownership.

Dữ liệu / phụ thuộc: Household, roles, shared objects, subscription seats.

Tương tác chính: Mời, đổi quyền, chọn objects shared, transfer owner, leave.

Đi vào từ: ST-01 — Hồ sơ và Settings Hub; SO-03 — Chi tiết vòng tròn; SO-05 — Thành viên và quyền.

Đi tới: SO-04 — Tạo vòng tròn / Mời thành viên; SO-05 — Thành viên và quyền; BD-04 — Tạo / Chỉnh ngân sách; ST-11 — Gói và Billing.

State và variant Figma: Owner/member/child, seat full, pending invite, last-owner, leave flow.

## ST-03 · Tuỳ chọn thông báo

MVP • Full screen • Frame: ST-03\_Tuỳ\_chọn\_thông\_báo/Default

Mục tiêu: Điều chỉnh kênh, loại, quiet hours và digest mà không bắt tắt toàn bộ.

Cần thiết kế: Channel toggles, category groups, thresholds, quiet hours, timezone, preview.

Dữ liệu / phụ thuộc: OS permission, notification preferences, household scope.

Tương tác chính: Bật/tắt, đặt quiet hours, test notification, mở OS settings.

Đi vào từ: ST-01 — Hồ sơ và Settings Hub; HM-03 — Trung tâm thông báo; BL-02 — Chi tiết khoản định kỳ.

Đi tới: HM-03 — Trung tâm thông báo; SG-05 — Quyền hệ thống bị chặn.

State và variant Figma: Permission granted/blocked, all off, digest, critical-only.

## ST-04 · Privacy Dashboard

MVP • Full screen • Frame: ST-04\_Privacy\_Dashboard/Default

Mục tiêu: Cho thấy app đang lưu gì, kết nối nào hoạt động và dữ liệu chia sẻ với ai.

Cần thiết kế: Data categories, active connections, audience summary, AI usage, retention, shortcuts.

Dữ liệu / phụ thuộc: Consent, connections, shared objects, retention policies.

Tương tác chính: Thu hồi consent, mở sharing defaults, export/delete, disconnect.

Đi vào từ: ST-01 — Hồ sơ và Settings Hub; OB-06 — Giới thiệu quyền riêng tư; IN-04 — AI Coach.

Đi tới: ST-05 — Mặc định chia sẻ và redaction; ST-08 — Quyền dữ liệu: xuất, xoá, tạm khoá; AC-06 — Trạng thái đồng bộ; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: All private, shared data present, stale consent, AI off, child account.

## ST-05 · Mặc định chia sẻ và redaction

P1 • Full screen • Frame: ST-05\_Mặc\_định\_chia\_sẻ\_và\_redaction/Default

Mục tiêu: Đặt audience mặc định và trường luôn ẩn trước khi đăng moment.

Cần thiết kế: Default audience, hide amount/merchant/location/time, face/text redaction, expiry, comments.

Dữ liệu / phụ thuộc: Circles, privacy defaults, redaction capability.

Tương tác chính: Lưu defaults, preview, reset.

Đi vào từ: ST-04 — Privacy Dashboard; CP-13 — Composer khoảnh khắc; SO-06 — Chi tiết bài đăng / Khoảnh khắc.

Đi tới: CP-13 — Composer khoảnh khắc; SO-02 — Feed vòng tròn.

State và variant Figma: Private-only, selected circle, child restrictions, redaction unavailable.

## ST-06 · Security Center

MVP • Full screen • Frame: ST-06\_Security\_Center/Default

Mục tiêu: Tổng hợp passkey, MFA, app lock, recovery và security alerts.

Cần thiết kế: Security score/checklist, auth methods, app lock, recovery codes, recent alerts.

Dữ liệu / phụ thuộc: Auth methods, device policy, risk events.

Tương tác chính: Enable passkey/MFA, change password, configure lock, regenerate codes.

Đi vào từ: ST-01 — Hồ sơ và Settings Hub; SG-02 — Khoá ứng dụng.

Đi tới: AU-05 — Tạo mật khẩu / Passkey; AU-07 — Xác thực đa yếu tố; SG-02 — Khoá ứng dụng; ST-07 — Thiết bị và phiên đăng nhập.

State và variant Figma: Strong, missing MFA, compromised session alert, recovery codes viewed.

## ST-07 · Thiết bị và phiên đăng nhập

MVP • Full screen • Frame: ST-07\_Thiết\_bị\_và\_phiên\_đăng\_nhập/Default

Mục tiêu: Cho người dùng xem và thu hồi session từ xa.

Cần thiết kế: Current device, session list, location/time approximate, trusted status, revoke all.

Dữ liệu / phụ thuộc: Sessions, device fingerprints, risk events.

Tương tác chính: Revoke, rename device, trust/untrust, sign out all.

Đi vào từ: ST-06 — Security Center; HM-03 — Trung tâm thông báo.

Đi tới: AU-06 — Đăng nhập; ST-06 — Security Center.

State và variant Figma: Current, inactive, suspicious, revoke confirmation, last session protection.

## ST-08 · Quyền dữ liệu: xuất, xoá, tạm khoá

MVP • Full screen • Frame: ST-08\_Quyền\_dữ\_liệu\_xuất\_xoá\_tạm\_khoá/Default

Mục tiêu: Thực hiện data rights với phạm vi, xác thực và cảnh báo tác động rõ.

Cần thiết kế: Export shortcut, delete categories, delete account, deactivate, retention summary, verification.

Dữ liệu / phụ thuộc: Data inventory, legal retention, auth state, export jobs.

Tương tác chính: Tạo export, xoá chọn lọc, deactivate, request account deletion.

Đi vào từ: ST-04 — Privacy Dashboard; ST-01 — Hồ sơ và Settings Hub; AU-08 — Khôi phục tài khoản.

Đi tới: IN-06 — Export Center; AU-07 — Xác thực đa yếu tố; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Export ready, deletion scheduled, cooling period, blocked by ownership, child account.

## ST-09 · Giao diện và trợ năng

MVP • Full screen • Frame: ST-09\_Giao\_diện\_và\_trợ\_năng/Default

Mục tiêu: Cấu hình theme, text, contrast, motion, haptic và privacy display.

Cần thiết kế: Theme, dynamic type preview, high contrast, reduce motion, haptic, hide balances by default.

Dữ liệu / phụ thuộc: OS accessibility settings và app preferences.

Tương tác chính: Preview, save, reset to system.

Đi vào từ: ST-01 — Hồ sơ và Settings Hub.

Đi tới: HM-01 — Home Dashboard; CP-01 — Camera Hub.

State và variant Figma: Light/dark/system, large text, high contrast, reduced motion.

## ST-10 · Ngôn ngữ, tiền tệ và định dạng

MVP • Full screen • Frame: ST-10\_Ngôn\_ngữ\_tiền\_tệ\_và\_định\_dạng/Default

Mục tiêu: Thay locale sau onboarding và giải thích tác động của đổi base currency.

Cần thiết kế: Language, currency, timezone, date/number preview, week/month start.

Dữ liệu / phụ thuộc: Locale, account currencies, report history.

Tương tác chính: Lưu, recalculate preview, confirm currency change.

Đi vào từ: ST-01 — Hồ sơ và Settings Hub; OB-03 — Ngôn ngữ, tiền tệ và múi giờ.

Đi tới: HM-01 — Home Dashboard; IN-01 — Insights Dashboard.

State và variant Figma: Simple locale change, base currency change warning, timezone auto/manual.

## ST-11 · Gói và Billing

P1 • Full screen • Frame: ST-11\_Gói\_và\_Billing/Default

Mục tiêu: Quản lý Free/Premium/Family, trial, payment status và seats.

Cần thiết kế: Current plan, benefits, usage quota, renewal, payment issue, upgrade/downgrade/cancel, restore purchase.

Dữ liệu / phụ thuộc: Subscription, store billing, household seats.

Tương tác chính: Upgrade, manage payment, cancel, restore, invite seat.

Đi vào từ: ST-01 — Hồ sơ và Settings Hub; ST-02 — Hộ gia đình và quyền chung.

Đi tới: SO-04 — Tạo vòng tròn / Mời thành viên; ST-12 — Help Center, Support và pháp lý.

State và variant Figma: Free, trial, paid, grace period, payment failed, cancelled, family seat full.

## ST-12 · Help Center, Support và pháp lý

MVP • Full screen • Frame: ST-12\_Help\_Center\_Support\_và\_pháp\_lý/Default

Mục tiêu: Cung cấp self-service, ticket và các tài liệu bắt buộc.

Cần thiết kế: Search help, topic cards, contact/ticket, status page, diagnostics consent, terms/privacy/licenses.

Dữ liệu / phụ thuộc: Knowledge base, support cases, app diagnostics, policy versions.

Tương tác chính: Tìm bài, tạo ticket, xem ticket, chia sẻ diagnostics, mở legal doc.

Đi vào từ: ST-01 — Hồ sơ và Settings Hub; SG-06 — Lỗi toàn trang / Thử lại; AU-01 — Welcome; SO-10 — Báo cáo / Chặn / An toàn; IT-06 — Bảo hành.

Đi tới: SG-06 — Lỗi toàn trang / Thử lại; AU-08 — Khôi phục tài khoản.

State và variant Figma: Help search, article, ticket compose, ticket status, outage banner, legal version update.

# 15. Admin web và vận hành

Không nằm trong mobile app nhưng cần wireframe riêng để vận hành chất lượng, hỗ trợ và an toàn.

## AD-01 · Operations Dashboard

P1 • Web admin • Frame: AD-01\_Operations\_Dashboard/Default

Mục tiêu: Theo dõi sức khoẻ đăng nhập, sync, OCR, upload, support và billing.

Cần thiết kế: SLO cards, incidents, job queues, cost metrics, alerts, environment badge.

Dữ liệu / phụ thuộc: Aggregated telemetry đã loại dữ liệu nhạy cảm.

Tương tác chính: Drill down, acknowledge alert, mở incident.

Đi vào từ: Điểm vào hệ thống hoặc không áp dụng.

Đi tới: AD-03 — Support Tickets; AD-04 — OCR Quality Console; AD-07 — Billing và Entitlements; AD-08 — Feature Flags, RBAC và Audit.

State và variant Figma: Healthy, degraded, incident, maintenance, restricted role.

## AD-02 · User Lookup an toàn

P1 • Web admin • Frame: AD-02\_User\_Lookup\_an\_toàn/Default

Mục tiêu: Tìm tài khoản hỗ trợ với dữ liệu nhạy cảm được che và quyền tối thiểu.

Cần thiết kế: Verified lookup, masked profile, plan/status, devices/connections summary, audit panel.

Dữ liệu / phụ thuộc: Support-safe account metadata và RBAC.

Tương tác chính: Khoá/mở, gửi recovery, mở ticket; mọi action yêu cầu reason.

Đi vào từ: AD-03 — Support Tickets.

Đi tới: AD-03 — Support Tickets; AD-08 — Feature Flags, RBAC và Audit.

State và variant Figma: No result, multiple matches, restricted, break-glass approval, suspended.

## AD-03 · Support Tickets

P1 • Web admin • Frame: AD-03\_Support\_Tickets/Default

Mục tiêu: Xử lý ticket, status, SLA và diagnostics đã được người dùng đồng ý.

Cần thiết kế: Queue, filters, conversation, account context, diagnostics, macros, escalation.

Dữ liệu / phụ thuộc: Tickets, consented diagnostics, agent permissions.

Tương tác chính: Reply, assign, escalate, refund request, close/reopen.

Đi vào từ: AD-01 — Operations Dashboard; AD-02 — User Lookup an toàn.

Đi tới: AD-02 — User Lookup an toàn; AD-07 — Billing và Entitlements; AD-08 — Feature Flags, RBAC và Audit.

State và variant Figma: New, waiting user, escalated, resolved, privacy restricted.

## AD-04 · OCR Quality Console

P1 • Web admin • Frame: AD-04\_OCR\_Quality\_Console/Default

Mục tiêu: Theo dõi accuracy theo trường/ngôn ngữ/merchant mà không mặc định xem ảnh riêng tư.

Cần thiết kế: Accuracy charts, correction rates, failure clusters, consented sample queue, model version.

Dữ liệu / phụ thuộc: Aggregated OCR metrics và opt-in samples.

Tương tác chính: Inspect redacted sample, label issue, rollback model, adjust threshold.

Đi vào từ: AD-01 — Operations Dashboard.

Đi tới: AD-05 — Merchant và Taxonomy; AD-08 — Feature Flags, RBAC và Audit.

State và variant Figma: Normal, regression, no consented samples, model experiment, rollback.

## AD-05 · Merchant và Taxonomy

P1 • Web admin • Frame: AD-05\_Merchant\_và\_Taxonomy/Default

Mục tiêu: Chuẩn hoá merchant, aliases, categories và logo có versioning.

Cần thiết kế: Search, canonical profile, aliases, merge preview, category mapping, change history.

Dữ liệu / phụ thuộc: Merchant directory, transaction aggregates, taxonomy versions.

Tương tác chính: Create/edit/merge, publish, rollback.

Đi vào từ: AD-04 — OCR Quality Console; AD-01 — Operations Dashboard.

Đi tới: AD-08 — Feature Flags, RBAC và Audit.

State và variant Figma: Draft, published, merge conflict, rollback, restricted market.

## AD-06 · Moderation Queue

P1 • Web admin • Frame: AD-06\_Moderation\_Queue/Default

Mục tiêu: Xử lý report theo policy, mức độ và quyền riêng tư.

Cần thiết kế: Case queue, evidence preview tối thiểu, reporter/subject protection, action history, appeal.

Dữ liệu / phụ thuộc: Reports, moderation policy, role permissions.

Tương tác chính: Dismiss, remove, warn, restrict, escalate, preserve evidence.

Đi vào từ: AD-01 — Operations Dashboard; AD-03 — Support Tickets.

Đi tới: AD-08 — Feature Flags, RBAC và Audit.

State và variant Figma: New, urgent, actioned, appealed, insufficient evidence, legal hold.

## AD-07 · Billing và Entitlements

P1 • Web admin • Frame: AD-07\_Billing\_và\_Entitlements/Default

Mục tiêu: Kiểm tra gói, store receipts, quota và refund với audit.

Cần thiết kế: Subscription timeline, entitlements, payment failures, family seats, refund controls.

Dữ liệu / phụ thuộc: Store billing records, plan config, support case.

Tương tác chính: Refresh receipt, grant temporary access, refund, revoke fraud entitlement.

Đi vào từ: AD-01 — Operations Dashboard; AD-03 — Support Tickets.

Đi tới: AD-08 — Feature Flags, RBAC và Audit.

State và variant Figma: Active, grace, cancelled, disputed, refund pending, store mismatch.

## AD-08 · Feature Flags, RBAC và Audit

P1 • Web admin • Frame: AD-08\_Feature\_Flags\_RBAC\_và\_Audit/Default

Mục tiêu: Quản lý rollout, quyền admin và lịch sử thao tác nhạy cảm.

Cần thiết kế: Flags/cohorts, kill switches, roles, approval queue, immutable audit search.

Dữ liệu / phụ thuộc: Feature config, staff identities, audit events.

Tương tác chính: Create rollout, pause, approve, review access, export audit.

Đi vào từ: AD-01 — Operations Dashboard; AD-02 — User Lookup an toàn; AD-03 — Support Tickets; AD-04 — OCR Quality Console; AD-05 — Merchant và Taxonomy; AD-06 — Moderation Queue; AD-07 — Billing và Entitlements.

Đi tới: AD-01 — Operations Dashboard.

State và variant Figma: Draft/live/paused flag, approval pending, break-glass, access review due.

# 16. Checklist state và prototype

* Default có dữ liệu thực tế, không dùng lorem ipsum hoặc số tiền vô nghĩa.
* Loading dùng skeleton theo cấu trúc thật; không thay bằng spinner toàn màn hình nếu nội dung có thể progressive-load.
* Empty phân biệt first-use, no-result và filtered-empty; mỗi loại có CTA đúng nguyên nhân.
* Error phân biệt validation, network, permission, conflict và destructive failure; giữ dữ liệu người dùng đã nhập.
* Offline cho biết dữ liệu đang xem là bản cache và action nào sẽ được xếp hàng.
* Privacy mode che số dư/amount nhưng giữ layout ổn định; screenshot/app-switcher state cần frame riêng.
* Role state gồm owner, member, child, guest và read-only cho các màn hình household/circle.
* Mọi destructive action có confirmation, tác động, thời gian khôi phục và lựa chọn huỷ.
* Prototype hotspot dùng ID đích trong tên interaction; back action phải quay đúng nguồn, không hard-link về Home.
* Kiểm tra keyboard, safe area, dynamic type, dark mode, focus order và reduced motion cho luồng camera, form và modal.

# 17. Handoff checklist cho Figma

* Mỗi frame có Screen ID, phase, owner, status và link ticket/requirement.
* Component instances không bị detach; local variable dùng semantic token thay vì màu/khoảng cách raw.
* Prototype cover ghi rõ 12 starting points và tài khoản demo dùng cho từng flow.
* Copy tài chính đã được review về tính trung tính, không phán xét và không hứa hẹn kết quả.
* Dữ liệu demo nhất quán giữa Home, transaction, budget, receipt, item và report.
* Ảnh hoá đơn demo đã xoá thông tin thật; không dùng PII hoặc dữ liệu khách hàng trong Figma.
* Dev mode có specs cho spacing, typography, touch target, truncation, overflow và responsive behaviour.
* Screen reader labels, chart text alternative, error copy và keyboard/focus behaviour được ghi annotation.
* Trạng thái loading/empty/error/offline/permission/role đã đủ cho mọi flow MVP.
* Changelog ghi frame đổi tên, ID giữ nguyên, breaking changes và ngày bàn giao.

Thứ tự dựng khuyến nghị: Foundations → Components Core/Finance/Camera → AU/OB → HM/TX → CP → BD → IT → SO → IN/AC/ST. Chỉ bắt đầu prototype sau khi component và dữ liệu demo được khoá.

HẾT TÀI LIỆU • FIGMA SCREEN INVENTORY