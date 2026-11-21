# Panduan Penggunaan — Program Antrian Digital & Suara Panggil Otomatis

Terima kasih telah memilih **Program Antrian Digital Pro** dari **Ddev** (`https://asetkode.blogspot.com`).
Aplikasi ini dirancang khusus untuk klinik, apotek, puskesmas, bengkel, loket pembayaran, bank mini, maupun toko layanan agar proses antrean tertib tanpa perlu instalasi server.

---

## 📂 Struktur File

```text
program-antrian-loket/
├── index.html                  ← Aplikasi utama (Panel Operator, Monitor TV, Kios Tiket)
├── app.js                      ← Logika antrean, sinkronisasi tab real-time, suara TTS, & export CSV
├── styles.css                  ← Tampilan responsif + layout khusus cetak struk thermal 58mm/80mm
├── Buka_Program_Antrian.bat    ← Klik 2x di Windows untuk langsung membuka aplikasi
├── PANDUAN.md                  ← Panduan lengkap penggunaan
└── LISENSI.txt                 ← Ketentuan lisensi komersial & personal
```

---

## ⚡ Cara Menjalankan (100% Zero-Config)

- Tidak butuh XAMPP, Apache, PHP, MySQL, atau koneksi internet.
- Cukup ekstrak folder `.zip`, lalu klik 2x **`Buka_Program_Antrian.bat`** (atau buka **`index.html`** menggunakan Google Chrome / Microsoft Edge).
- Semua data antrean tersimpan otomatis di browser (`localStorage`), sehingga aman meski halaman tidak sengaja ter-refresh.

---

## 🖥️ Cara Buka 2 Jendela (Monitor TV Ruang Tunggu + Panel Operator)

Aplikasi mendukung tampilan ganda secara real-time di komputer yang sama (misalnya laptop kasir/admin yang tersambung kabel HDMI ke TV ruang tunggu):

1. Buka aplikasi pertama kali (klik 2x `Buka_Program_Antrian.bat`) dan biarkan pada tab **Panel Operator**.
2. Buka tab/jendela browser **kedua** dengan alamat/file `index.html` yang sama (tekan `Ctrl + N` di browser lalu drag/buka `index.html`, atau klik 2x `Buka_Program_Antrian.bat` lagi).
3. Pada jendela kedua, klik tab **Monitor TV**, lalu geser (drag) jendela tersebut ke layar TV ruang tunggu dan tekan **`F11`** agar tampil layar penuh (*Fullscreen*).
4. **Sinkronisasi Otomatis**: Saat petugas di **Panel Operator** menekan **▶ Panggil Berikutnya**, **🔊 Panggil Ulang**, atau saat pelanggan mengambil nomor di **Kios Ambil Tiket**, layar **Monitor TV** otomatis ikut berubah seketika tanpa perlu refresh!

> 💡 **Tips Multi-Window:** Pastikan kedua jendela dibuka menggunakan browser yang sama (misalnya sama-sama Chrome atau sama-sama Edge) agar sinkronisasi `localStorage` berjalan instan.

---

## 🔊 Pengaturan Suara Panggil Bahasa Indonesia di Windows

Saat tombol **▶ Panggil Berikutnya** atau **🔊 Panggil Ulang** ditekan, sistem membunyikan bel chime 3 nada lalu membacakan nomor antrean & loket tujuan secara otomatis (*"Nomor antrian A 0 0 1, silakan menuju ke Loket 1"*).

Agar suara Bahasa Indonesia terdengar jelas di Windows 10 / Windows 11:
1. Pastikan centang **Suara Panggil** di kanan atas aplikasi dalam kondisi aktif.
2. Pastikan speaker komputer/TV menyala dan tidak dalam mode mute.
3. Jika suara terdengar beraksen Inggris atau belum keluar:
   - Buka **Windows Settings → Time & Language → Speech**.
   - Pada bagian **Manage voices**, klik **Add voices** lalu cari dan unduh **Indonesian (Indonesia)** (suara *Ardi* / *Gadis* / *Andika*).
   - **Rekomendasi Browser:** Gunakan **Microsoft Edge** atau **Google Chrome** versi terbaru karena memiliki dukungan suara Bahasa Indonesia (`id-ID`) paling jernih.
4. Klik tombol **▶ Panggil Berikutnya** satu kali di halaman Operator untuk memicu izin audio browser (*autoplay policy*).

---

## 🖨️ Cara Cetak Struk Tiket Thermal (58mm / 80mm)

1. Buka tab **Kios Ambil Tiket** (bisa dibuka di tablet/PC layar sentuh di pintu masuk, atau langsung via tombol **+ Ambil A/B/C** dari operator).
2. Klik salah satu layanan (**Layanan A / B / C**). Kotak **TIKET TERAKHIR ANDA** akan muncul beserta nomor urut baru.
3. Klik **🖨 Cetak Struk Tiket**.
4. Pada dialog print browser:
   - Pilih printer thermal Anda (ukuran kertas **58mm** atau **80mm**).
   - Hilangkan centang **Headers and footers** agar tidak ada tulisan URL/tanggal browser di pinggir struk.
   - Layout cetak sudah otomatis menyembunyikan tombol menu (`no-print`) sehingga hanya struk antrean bersih yang tercetak.

---

## 📊 Export Laporan CSV & Reset Harian

- **Export CSV**: Klik tombol **Export CSV** di pojok kanan atas kapan saja untuk mengunduh file `riwayat-antrian-YYYY-MM-DD.csv` berisi kolom `Kode, Layanan, Loket, Waktu, Status`. File dapat langsung dibuka dengan Microsoft Excel atau Google Sheets sebagai laporan harian.
- **Reset Harian**: Setiap pagi sebelum operasional dibuka (atau setelah selesai Export CSV di sore hari), klik tombol **Reset Harian** lalu konfirmasi untuk mengembalikan seluruh nomor antrean (`A-001`, `B-001`, `C-001`) ke nol dan mengosongkan daftar tunggu hari sebelumnya.
