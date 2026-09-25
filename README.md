# Lem Coffee — Landing Page

Trang đích (Landing Page) tối ưu chuyển đổi cao cho **Lem Coffee** tại Hà Nội, phục vụ chiến dịch quảng cáo **Google Ads**.

## 🌟 Tính Năng Nổi Bật

- **Tối ưu chuyển đổi Google Ads**: Bố cục 50/50 trên desktop với form đặt bàn nằm ngay trong tầm mắt đầu trang (Above the Fold).
- **Hệ thống màu sắc tách biệt chuẩn thiết kế**: Kết hợp hài hòa giữa màu Hồng phấn (Pastel Pink) và Vàng phấn (Pastel Yellow) trên nền Kem (Cream), tuân thủ nguyên tắc không trộn lẫn gradient 2 màu trong cùng một thành phần.
- **Hình ảnh mèo thực tế**: Dàn "nhân viên bốn chân" của Lem Coffee với bé Lem Bụng Phệ, bé cam trắng bên hoa, mẹ mèo vàng cam...
- **Form đặt chỗ thông minh**: Tích hợp xác thực số điện thoại Việt Nam theo thời gian thực, lưu trữ thông tin và hiển thị màn hình xác nhận sau khi gửi.
- **Thanh CTA dính di động (Sticky Mobile Bar)**: Tự động hiện/ẩn thông minh khi lướt trang, tối ưu trải nghiệm trên điện thoại.
- **Tích hợp sẵn DataLayer Tracking**: Sẵn sàng gắn Google Tag Manager (GTM) và Google Ads Conversion Tracking (`form_start`, `form_submit`, `click_call`, `click_directions`, `click_booking_cta`).

## 📁 Cấu Trúc Dự Án

```
├── index.html              # Trang đích chính
├── css/
│   └── style.css           # Toàn bộ CSS Design System & Responsive layout
├── js/
│   └── main.js             # Logic form validation, tracking events, modal, accordion
├── assets/
│   └── images/             # Toàn bộ hình ảnh thực tế của quán và các bé mèo
└── server.ps1              # Local development server (PowerShell)
```

## 🚀 Cách Chạy Dự Án

Mở trực tiếp tệp `index.html` bằng trình duyệt web, hoặc khởi động server nội bộ:

```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```

Truy cập: `http://localhost:8080/`

---
© 2026 Lem Coffee. All rights reserved.
