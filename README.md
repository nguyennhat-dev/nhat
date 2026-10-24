# Nguyễn Nhật - Trình phát nhạc PWA

## Cấu trúc
- `index.html` - toàn bộ giao diện + ứng dụng (HTML/CSS/JS nội tuyến)
- `manifest.json` - khai báo PWA
- `sw.js` - service worker (offline, cache)
- `icons/icon.svg` - biểu tượng gốc (vector)
- `make-icons.html` - mở trong trình duyệt để tạo và tải 5 file PNG
- `icons/` - chứa các PNG sau khi tạo bằng `make-icons.html`

## Triển khai
1. Tạo thư mục, đặt `index.html`, `manifest.json`, `sw.js` ở gốc cùng thư mục.
2. Mở `make-icons.html`, bấm "Tạo và tải tất cả", lưu 5 PNG vào `icons/`:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)
   - `icon-maskable-512.png` (512x512)
   - `apple-touch-icon.png` (180x180)
   - `favicon-32.png` (32x32)
3. Chạy thử local: `python3 -m http.server 8000` rồi mở `http://localhost:8000`.
   - Không double-click file `index.html` vì PWA yêu cầu `http://` hoặc `https://`.
4. Đưa lên mạng: GitHub Pages, Netlify (kéo thả thư mục), hoặc Cloudflare Pages. Bắt buộc HTTPS (trừ `localhost`).

## Kiểm tra PWA
- Chrome DevTools → Application → Manifest: không cảnh báo, icon đủ.
- Service Workers: trạng thái "activated and is running".
- Tích "Offline", tải lại: ứng dụng vẫn mở và phát nhạc đã lưu.
- Lighthouse → PWA/Installable phải đạt.

## Cài đặt
- Android Chrome: menu ⋮ → "Cài đặt ứng dụng" hoặc nút "Cài ứng dụng" trong trang.
- iPhone Safari: Chia sẻ → "Thêm vào Màn hình chính". Báo thức trên iOS không đảm bảo khi khóa máy.

## Cập nhật
- Sửa code, đổi `VERSION` trong `sw.js`, upload lại. Người dùng sẽ thấy toast "Có phiên bản mới".

## Hạn chế đã biết
- Báo thức khi khóa máy không đảm bảo trên iPhone/iPad và một số thiết bị Android tiết kiệm pin.
- Radio không có CORS chạy ở "chế độ trực tiếp" (không có sóng/cân bằng âm).
- HLS cần mạng lần đầu để tải `hls.js`; địa chỉ `http://` trong trang `https` bị chặn mixed content.
- Thiết bị cũ không có `webkitdirectory` chỉ hỗ trợ chọn file lẻ.
