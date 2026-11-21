# Panduan Penggunaan — Template Company Profile & Digital Agency

Terima kasih telah menggunakan template **Company Profile & Digital Agency** dari **Ddev** (`https://asetkode.blogspot.com`).
Template ini dirancang khusus untuk agensi digital, studio kreatif, konsultan IT, maupun perusahaan jasa agar terlihat kredibel dengan performa cepat tanpa biaya bulanan.

---

## 📂 Struktur File

```text
company-profile-agency/
├── index.html                  ← Halaman utama website
├── config.js                   ← ✏️ EDIT FILE INI SAJA (data brand, layanan, portofolio, harga, kontak)
├── app.js                      ← Logika render halaman, filter portofolio, dark/light mode, WA & email
├── styles.css                  ← Desain modern responsif + mode terang/gelap
├── Buka_Company_Profile.bat    ← Klik 2x di Windows untuk langsung membuka preview di browser
├── PANDUAN.md                  ← Panduan penggunaan ini
└── LISENSI.txt                 ← Ketentuan lisensi komersial & personal
```

---

## ⚡ Cara Menjalankan di Komputer

1. Ekstrak seluruh isi file `.zip` ke dalam satu folder.
2. Klik 2x **`Buka_Company_Profile.bat`** (atau klik 2x **`index.html`**) untuk langsung melihat website di Chrome / Edge.
3. Tidak perlu XAMPP, PHP, Node.js, atau database apa pun.

---

## ✏️ Cara Ubah Teks & Identitas di `config.js`

Klik kanan file **`config.js`** → **Open with** → **Notepad** (atau VS Code), lalu ubah teks di dalam tanda kutip `'...'`:

```javascript
window.AGENCY_CONFIG = {
  brandName: 'Nusantara Studio',
  brandTagline: 'Digital Product & Web Engineering',
  heroBadge: 'TERSEDIA UNTUK PROYEK Q4 • RESPON < 2 JAM',
  heroTitle: 'Kami Merancang Website & Sistem Digital yang Meningkatkan Omzet Bisnis Anda',
  heroSubtitle: 'Solusi lengkap mulai dari Company Profile, Toko Online...',
  whatsappNumber: '6281234567890', // Gunakan awalan 62 tanpa + dan tanpa angka 0 di depan
  email: 'halo@nusantarastudio.id',
  address: 'Jl. Jenderal Sudirman No. 88, Jakarta Selatan',
```

Simpan file (`Ctrl + S`), lalu refresh browser (`F5`) untuk langsung melihat perubahannya.

> ⚠️ **Catatan Penting:** Jangan menghapus tanda kutip `'`, koma `,`, atau tanda kurung `{ }` / `[ ]`. Jika halaman mendadak kosong setelah diedit, periksa kembali tanda kutip atau koma yang terhapus.

---

## 🖼️ Cara Tambah Portofolio, Layanan, Paket Harga & FAQ

Masih di dalam `config.js`, Anda bebas menambah, mengedit, atau menghapus item pada bagian berikut:

1. **Tambah Portofolio Baru (`portfolio`)**:
   Salin salah satu blok objek `{ id: '...', ... }` dan tempel sebelum tanda `]`:
   ```javascript
   {
     id: 'p4',
     category: 'Company Profile', // Pilihan kategori filter: 'Web App', 'Company Profile', 'E-Commerce'
     title: 'Website Klinik Pratama Sehat',
     client: 'Klinik Sehat Sentosa',
     result: 'Booking pasien online naik 80%',
     image: 'https://images.unsplash.com/...', // Bisa diganti path gambar lokal, misal 'assets/karya-4.jpg'
     summary: 'Pembuatan profil klinik lengkap dengan jadwal dokter dan integrasi WhatsApp pendaftaran.'
   }
   ```
   *(Tips: Anda juga dapat memakai bagian `services`, `packages`, `stats`, maupun `faqs` untuk menampilkan paket harga, testimoni/hasil klien, serta pertanyaan umum.)*

2. **Atur Paket Unggulan (`packages`)**:
   Ubah `popular: true` pada paket yang ingin diberi badge **`PALING POPULER`** dan warna sorotan utama.

---

## 💬 Setup Form Order ke WhatsApp & Email

Formulir di bagian **Mulai Proyek (`#kontak`)** otomatis membaca dua pengaturan dari `config.js`:
- **`whatsappNumber`**: Isi dengan nomor WhatsApp admin berawalan kode negara `62` (contoh: `6281234567890`). Saat calon klien menekan **Kirim via WhatsApp**, nama, pilihan layanan, dan detail proyek langsung terisi rapi di chat WA Anda.
- **`email`**: Digunakan saat pengunjung menekan tombol **Kirim via Email** (`mailto:`).

---

## 🌐 Cara Deploy Gratis (Online 24 Jam — Rp 0/Bulan)

### Opsi 1: Netlify Drop (Paling Cepat, ±1 Menit)
1. Buka [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Seret (drag & drop) seluruh folder `company-profile-agency` ke browser.
3. Website langsung online dan dapat dihubungkan ke domain `.com` / `.id` Anda melalui menu **Domain management**.

### Opsi 2: GitHub Pages / Cloudflare Pages
1. Buat repository baru di GitHub dan unggah semua file di folder ini (`index.html` harus berada di root folder).
2. Untuk **GitHub Pages**: buka **Settings → Pages → Branch: `main` → Save**.
3. Untuk **Cloudflare Pages**: hubungkan repository GitHub di dashboard Cloudflare Pages (build command kosongkan, output directory `/`).
