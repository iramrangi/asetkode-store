# Panduan NusantaraVoyage Pro — Website Agen Travel, Katalog Paket Wisata & Booking E-Voucher

Dikembangkan oleh **Ddev Studio** ([https://asetkode.blogspot.com](https://asetkode.blogspot.com))

Website agen perjalanan siap pakai & komersial untuk biro tour & travel (**Open Trip**, **Private Tour**, **Honeymoon**, **Halal Tour**, hingga **Corporate Gathering**). Berbasis **HTML5, CSS3, dan Vanilla JavaScript (100% Zero-Config & Offline-Ready)** — berjalan langsung di browser tanpa server PHP/Node.js, tanpa database eksternal, dan tanpa ketergantungan link gambar luar.

---

## 1. Isi Paket Produk

```text
web-travel-agen-wisata/
├── index.html                  ← Struktur lengkap Storefront, Cek Booking & Panel Admin Agen
├── styles.css                  ← Tampilan responsif Light/Dark Mode & cetak A4 E-Voucher
├── data.js                     ← 8 paket wisata domestik & internasional, ilustrasi SVG & data demo
├── app.js                      ← Kalkulator DP 30%, kuota kursi real-time, E-Voucher, ICS & CRUD
├── Buka_Aplikasi_Travel.bat    ← Launcher 1-klik untuk pengguna Windows
├── PANDUAN.md                  ← Panduan penggunaan Bahasa Indonesia
├── SETUP_GUIDE_EN_ID.md        ← Panduan instalasi & kustomisasi dwibahasa (EN/ID)
└── LISENSI.txt                 ← Lisensi komersial & personal
```

---

## 2. Cara Menjalankan (Tanpa Instalasi)

1. **Windows (Tercepat):** Klik dua kali file **`Buka_Aplikasi_Travel.bat`**.
2. **macOS / Linux / Android / Browser Lain:** Klik dua kali **`index.html`** lalu buka dengan Google Chrome, Microsoft Edge, Safari, atau Firefox.
3. Tidak memerlukan XAMPP, Laragon, Node.js, maupun koneksi internet untuk menjalankan dan mengedit data.

---

## 3. Fitur Utama Website Travel

### A. Storefront Pelanggan & Katalog 8 Paket Siap Jual
- Dilengkapi **8 paket wisata penuh** (Bali & Nusa Penida, Sailing Phinisi Labuan Bajo, Bromo–Tumpak Sewu–Ijen, Raja Ampat Piaynemo, Japan Golden Route, Korea Seoul–Nami, Turkiye Cappadocia, serta Singapore–Kuala Lumpur–Genting).
- **Smart Search & Filter Multi-Kriteria:** Pencarian kata kunci, wilayah (Domestik / Internasional), durasi, batas budget per peserta, kategori trip, serta tombol **Favorit (♥)**.
- **Dukungan Dwibahasa (`ID / EN`) & Dwi-Mata Uang (`IDR / USD`)** serta **Mode Terang / Gelap**.
- **Modal Detail Paket Lengkap:** Ringkasan pengalaman, pilihan kelas hotel (`3★ / 4★ / 5★`), pilih jadwal keberangkatan dengan **sisa kuota kursi live**, tab **Itinerary Hari-ke-Hari**, serta tab **Include & Exclude**.

### B. Kalkulator Biaya Real-Time & Skema DP 30%
- Menghitung otomatis biaya **Peserta Dewasa**, **Anak**, **Single Room Supplement**, **Add-On Opsional** (asuransi, foto drone, VIP airport transfer), serta **Kode Promo** (`LIBURSERU`, `EARLYBIRD10`, `FAMILYTRIP`, `HONEYMOON5`).
- Pelanggan dapat memilih **DP 30%** untuk mengamankan kursi atau **Bayar Penuh (100%)** lengkap dengan rincian sisa pelunasan H-7.

### C. E-Voucher A4 Siap Cetak PDF & Kalender `.ics`
- Setelah mengirim reservasi, kode booking **`TRV-YYYY-XXXX`** langsung terbit beserta **E-Voucher & Invoice Resmi ukuran kertas A4**.
- Mendukung tombol **Cetak / Simpan PDF (A4)**, **Download Kalender `.ics`** (Google/Apple/Outlook Calendar), serta tombol **Kirim Konfirmasi ke WhatsApp Agen**.
- Pelanggan dapat mengecek status pembayaran dan mengunduh ulang E-Voucher kapan saja melalui tab **Cek Booking & E-Tiket**.

### D. Panel Admin Agen (Dilindungi PIN + CRUD Lengkap)
- **Proteksi PIN Admin:** Panel Admin dikunci oleh PIN (`default: 123456`) agar pengunjung biasa tidak bisa memanipulasi harga, kode promo, atau status pembayaran `Lunas`. **Wajib segera ubah PIN default** melalui menu **Promo & Pengaturan Agen** atau langsung di `data.js` (`DEFAULT_SETTINGS.adminPin`) sebelum di-*upload* online.
- **KPI & Grafik Omzet per Destinasi** secara real-time.
- **Manajemen Pipeline Booking:** Ubah status transaksi (`Menunggu Pembayaran` → `DP Terkonfirmasi` → `Lunas` → `Selesai` / `Dibatalkan`). Jika dibatalkan, kuota kursi keberangkatan otomatis terbuka kembali.
- **CRUD Paket Wisata:** Tambah paket baru, ubah harga IDR/USD, jadwal keberangkatan, kuota, itinerary per hari, dan fasilitas termasuk.
- **Kelola Promo & Profil Agen:** Ubah nama biro travel, tagline, WhatsApp, email, rekening bank, serta catatan QRIS langsung dari UI.
- **Export CSV (Excel)**, **Export/Import Backup JSON**, dan **Reset Data Awal**.

---

## 4. Cara Meng-Online-kan Website (Hosting Gratis)

Karena website ini bersifat statis murni:
1. Sesuaikan nama biro travel, WhatsApp, rekening bank, dan daftar paket Anda lewat **Panel Admin Agen** (atau langsung di `data.js` agar permanen untuk semua pengunjung baru).
2. Unggah seluruh folder `web-travel-agen-wisata/` ke **Cloudflare Pages**, **Netlify Drop**, **Vercel**, atau **cPanel / shared hosting**.
3. Website biro perjalanan Anda siap menerima pemesanan dari seluruh Indonesia maupun mancanegara.
