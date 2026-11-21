# Panduan Penggunaan UI Kit E-Commerce & SaaS Pro (42 Komponen)

Selamat datang di **UI Kit Pro v3.0**! Paket ini berisi **42 komponen antarmuka web nyata & interaktif** yang terbagi dalam **7 kategori utama**, seluruhnya ditenagai oleh sistem Design Tokens (`tokens.css`) dengan dukungan **Light/Dark Mode** dan **4 Warna Aksen Brand**.

---

## 1. Isi Paket
- `index.html` — Halaman showcase interaktif seluruh 42 komponen.
- `tokens.css` — Variabel desain global (warna, brand accent, dark mode, radius, shadow, spacing, tipografi).
- `styles.css` — Styling showcase dan seluruh 42 komponen UI.
- `app.js` — Data komponen, interaksi live preview, filter kategori, pencarian, dan fitur salin kode.
- `Buka_UI_Kit.bat` — Pintasan cepat Windows untuk membuka showcase di browser.
- `LISENSI.txt` — Ketentuan lisensi komersial & personal.

---

## 2. Cara Membuka Showcase Lokal
1. Klik dua kali `Buka_UI_Kit.bat` (Windows) atau buka `index.html` langsung di browser modern (Chrome, Edge, Firefox, Safari).
2. Gunakan tombol **Mode Gelap / Terang** dan pemilih **Aksen** (Indigo, Emerald, Crimson, Amber) di header atas untuk melihat perubahan tampilan secara real-time di seluruh 42 komponen.
3. Gunakan **Pencarian** atau **Tab Kategori** untuk menyaring komponen yang dibutuhkan.
4. Klik **Lihat HTML/CSS** untuk memeriksa markup & class CSS, atau klik **Salin Kode HTML** untuk langsung menyalin komponen ke clipboard.

---

## 3. Cara Pakai di Proyek Anda

### A. Proyek HTML / CSS Statis atau PHP / Laravel Blade
1. Salin `tokens.css` dan `styles.css` (atau ambil class yang dibutuhkan saja) ke folder aset proyek Anda, lalu muat di `<head>`:
   ```html
   <link rel="stylesheet" href="/css/tokens.css" />
   <link rel="stylesheet" href="/css/styles.css" />
   ```
2. Pastikan tag `<html>` memiliki atribut default:
   ```html
   <html lang="id" data-theme="light" data-accent="indigo">
   ```
3. Klik **Salin Kode HTML** pada komponen yang Anda inginkan di `index.html`, lalu tempel ke file HTML atau `.blade.php` Anda.

### B. Integrasi ke React / Next.js
1. Impor `tokens.css` dan `styles.css` di `main.jsx` / `app/layout.tsx`.
2. Tempel HTML komponen ke JSX, lalu ubah atribut standar HTML menjadi format JSX:
   - `class=` menjadi `className=`
   - `for=` menjadi `htmlFor=`
   - `tabindex=` menjadi `tabIndex=`
   - Tutup tag self-closing seperti `<input ... />` dan `<img ... />`.

### C. Integrasi ke Vue / Nuxt
1. Impor `tokens.css` dan `styles.css` di `main.ts` / `nuxt.config.ts`.
2. Tempel langsung kode HTML komponen ke dalam blok `<template>...</template>` komponen Vue Anda.

---

## 4. Kustomisasi Brand, Font & Dark Mode

Buka `tokens.css` dan ubah variabel di `:root`:
- **Ubah Warna Brand Utama**:
  ```css
  :root {
    --brand: #0ea5e9;
    --brand-hover: #0284c7;
    --brand-soft: rgba(14, 165, 233, 0.12);
    --brand-gradient: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
  }
  ```
- **Ubah Font**:
  Muat Google Fonts (misalnya `Plus Jakarta Sans` atau `Outfit`) di `<head>`, lalu sesuaikan `--font-sans` di `tokens.css`.
- **Aktifkan Dark Mode**:
  Ubah atribut `data-theme="dark"` pada elemen `<html>`:
  ```js
  document.documentElement.setAttribute('data-theme', 'dark');
  ```

---

## 5. Daftar Lengkap 42 Komponen (7 Kategori × 6 Komponen)

1. **Navigation & Header (6)**:
   Sticky Store Navbar + Cart Badge, Mega Menu Dropdown, Breadcrumb Multi-level, Bottom Mobile App Bar, Announcement Promo Banner, Sidebar Collapse Nav.
2. **Hero & Conversion CTA (6)**:
   Split Hero E-Commerce, SaaS Centered Hero + Waitlist Form, Flash Sale Countdown Banner, Trust Logo Strip, Newsletter Capture Bar, Product Feature Bento Grid.
3. **E-Commerce Cards & Cart (6)**:
   Product Card Diskon + Artwork SVG + Quick Add, Horizontal Cart Item Row, Slide-out Mini Cart Summary, Filter & Sort Toolbar, Order Tracking Timeline 4-Tahap, Promo Coupon & Voucher Input.
4. **SaaS Pricing & Social Proof (6)**:
   Pricing Table Toggle Bulanan/Tahunan, Comparison Matrix Table, Enterprise Custom Quote Card, Testimonial Quote Cards, Metric Stat Bento Grid, Rating & Review Breakdown Bar.
5. **Forms, Auth & Checkout (6)**:
   Login/Register Split Card, Multi-step Checkout Stepper, Payment Method Selector QRIS/VA/Wallet, Floating Label Input Group + Validation, OTP 6-Digit Verification Input, File Dropzone Uploader.
6. **Dashboard & Data UI (6)**:
   KPI Metric Sparkline Card, Data Table + Search + Status Pill, Empty State Actionable, Activity Audit Feed, User Avatar Stack & Role Badge, Progress Goal Card.
7. **Overlays, Feedback & Footer (6)**:
   Interactive FAQ Accordion, Confirm/Delete Modal Dialog, Toast Notification Stack, Cookie/Privacy Consent Banner, Multi-column E-Commerce Footer, Skeleton Loading Card.
