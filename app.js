/**
 * Ddev Studio Headless Storefront — Pure Monochrome (Hitam Putih) Edition
 * - Auto-syncs products from https://asetkode.blogspot.com/ via JSONP (zero CORS issues)
 * - Built-in Interactive Live Demo Simulator (Desktop / Tablet / Mobile viewports)
 * - Multi-item Shopping Cart with automatic 20% Bundle Discount & VIP All-Access Pass
 * - Interactive ROI Calculator & Instant QRIS/VA Checkout Simulator
 */

// ================= 0. CENTRALIZED SITE & BRAND CONFIGURATION =================
// Ubah konfigurasi di bawah ini saat ganti nama brand, pasang domain baru, atau aktifkan payment gateway.
const SITE_CONFIG = {
  brandName: 'Ddev Studio',
  brandBadge: 'STORE',
  orderEmail: 'dekamayooo@gmail.com',
  paymentMode: 'mayar', // otomatis membuka link Mayar bila tersedia di data-payment-url, atau fallback email jika masih mailto:
  mayarBundleUrl: '',   // isi Payment Link Mayar untuk Paket Bundling All-In-One
  bloggerOrigin: 'https://asetkode.blogspot.com',
  onlyReadyProducts: true, // true = hanya tampilkan produk yang sudah punya paket .ZIP & demo siap kirim
  readyIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8', 'prod-9', 'prod-10', 'prod-11', 'prod-12', 'prod-13', 'prod-14', 'prod-15', 'prod-16', 'prod-17', 'prod-18', 'prod-19', 'prod-20', 'prod-21', 'prod-22', 'prod-23', 'prod-24'],
  bundlePrice: 'Rp 249.000',
  bundlePriceNum: 249000,
  bundlePriceUsd: '$49',
  bundlePriceUsdNum: 49,
  usdStoreUrl: '' // Opsional: Link toko Polar.sh / Payhip / Gumroad global Anda
};

const STORAGE_LOCALE_KEY = 'ddev_locale_v1';
function detectInitialLocale() {
  try {
    const qp = new URLSearchParams(window.location.search).get('lang');
    if (qp === 'en' || qp === 'id') {
      localStorage.setItem(STORAGE_LOCALE_KEY, qp);
      return qp;
    }
    const saved = localStorage.getItem(STORAGE_LOCALE_KEY);
    if (saved === 'en' || saved === 'id') return saved;
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
    const isIndoTz = /^(Asia\/(Jakarta|Pontianak|Makassar|Ujung_Pandang|Jayapura|Bali))$/i.test(tz);
    const navLang = (navigator.language || 'id').toLowerCase();
    if (!isIndoTz && !navLang.startsWith('id') && !navLang.startsWith('ms')) return 'en';
  } catch (e) {}
  return 'id';
}
let currentLocale = detectInitialLocale();

function parseUsdPriceNum(str) {
  const m = String(str || '').replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function formatUsd(num) {
  const v = Number(num) || 0;
  return Math.abs(v - Math.round(v)) < 0.005 ? ('$' + Math.round(v)) : ('$' + v.toFixed(2));
}

function idrToCleanUsdNum(idrNum) {
  const n = Number(idrNum) || 0;
  if (!n) return 0;
  if (n <= 45000) return 7;
  if (n <= 60000) return 9;
  if (n <= 80000) return 12;
  if (n <= 92000) return 14;
  if (n <= 105000) return 15;
  if (n <= 130000) return 19;
  if (n <= 180000) return 25;
  if (n <= 260000) return 49;
  return Math.max(5, Math.round(n / 16000));
}

function getProdDisplay(p) {
  const isEn = currentLocale === 'en';
  const idrNum = parsePriceNum(p.price);
  const usdNum = parseUsdPriceNum(p.priceUsd) || idrToCleanUsdNum(idrNum);
  const oldUsdNum = parseUsdPriceNum(p.oldPriceUsd) || (usdNum ? Math.round(usdNum * 2) + 1 : 0);
  return {
    isEn,
    title: (isEn && p.titleEn) ? p.titleEn : p.title,
    summary: (isEn && p.summaryEn) ? p.summaryEn : p.summary,
    price: isEn ? formatUsd(usdNum) : p.price,
    oldPrice: isEn ? (oldUsdNum > usdNum ? formatUsd(oldUsdNum) : '') : (p.oldPrice || ''),
    priceNum: isEn ? usdNum : idrNum,
    usdNum
  };
}

const BLOGGER_ORIGIN = SITE_CONFIG.bloggerOrigin;
const STORAGE_CART_KEY = 'asetkode_pro_cart_v1';
const STORAGE_THEME_KEY = 'asetkode_bw_theme_v2';

// Built-in fallback catalog (synced with asetkode.blogspot.com)
const FALLBACK_PRODUCTS = [
  {
    "id": "prod-1",
    "title": "Source Code Aplikasi Kasir (POS) & Inventaris Gudang Live Sync Excel (.xlsx)",
    "categories": [
      "Aplikasi",
      "Source Code",
      "Web App",
      "JavaScript"
    ],
    "price": "Rp 69.000",
    "oldPrice": "Rp 199.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/kasir/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-aplikasi-kasir-pos.html",
    "version": "v2.4 (Terbaru)",
    "stack": "HTML5 + JavaScript (Zero-Config) + Live Excel (.xlsx) Sync",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/kasir/screenshot.png",
    "summary": "Aplikasi Point of Sale (Kasir Toko) dan Manajemen Inventaris Gudang modern berbasis web yang berjalan langsung di browser tanpa instalasi server rumit (Zero-Config). Dilengkapi fitur sinkronisasi dua arah otomatis dengan Microsoft Excel (.xlsx), pencarian barcode scanner, cetak struk thermal 58mm & 80mm, multi pembayaran (Tunai, QRIS, Kasbon), serta kartu stok gudang.",
    "features": [
      "Zero-Config: Cukup klik 2x Buka_Aplikasi_Kasir.bat, langsung terbuka di browser tanpa install Apache/MySQL.",
      "Live Sync 2-Arah Microsoft Excel (.xlsx): Setiap penjualan & perubahan stok otomatis mengupdate file Excel di komputer.",
      "Mesin Kasir Cepat (POS) + Dukungan Barcode Scanner & Pintasan Tombol Keyboard (F1, F2, F4).",
      "Cetak Struk Thermal (58mm & 80mm) Otomatis (@media print) & Invoice Digital.",
      "Manajemen Stok Gudang, Peringatan Stok Menipis (Low Stock Alert), dan Kartu Mutasi Stok (IN/OUT/Opname).",
      "Multi Metode Pembayaran: Tunai, QRIS, Transfer Bank, dan Pencatatan Kasbon / Piutang Tempo."
    ],
    "priceUsd": "$12",
    "oldPriceUsd": "$29",
    "titleEn": "POS Cashier & Warehouse Inventory Web App (Live Excel .XLSX Sync)",
    "summaryEn": "Zero-Config web Point of Sale (POS) and warehouse inventory app with two-way Excel (.xlsx) sync, barcode scanner support, 58mm/80mm thermal receipts, multi-payment modes, and ",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-2",
    "title": "Template Landing Page UMKM & Cafe Modern Responsive (Order WhatsApp Langsung)",
    "categories": [
      "JavaScript",
      "Template",
      "Source Code"
    ],
    "price": "Rp 49.000",
    "oldPrice": "Rp 99.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/umkm/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/landing-page-saas-digital-agency-modern.html",
    "version": "v2.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS (Zero-Config)",
    "license": "Personal & Komersial (Unlimited Project)",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/umkm/screenshot.png",
    "summary": "Template Landing Page siap pakai untuk kedai kopi, resto, dan usaha UMKM lokal. Dilengkapi integrasi order langsung ke WhatsApp dengan rincian menu otomatis, filter katalog menu, integrasi Google Maps, mode gelap/terang, dan panduan kustomisasi tanpa coding.",
    "features": [
      "10+ Seksi siap pakai (Hero, Fitur, Harga/Pricing, Testimoni, FAQ, CTA, Footer).",
      "Desain Clean & Modern dengan animasi halus tanpa membebani kecepatan loading.",
      "100% Responsive di layar Desktop, Tablet, dan Smartphone.",
      "Struktur kode HTML5 semantik yang rapi dan mudah diintegrasikan ke framework apa pun.",
      "Sudah dilengkapi optimasi Meta SEO & Schema Markup."
    ],
    "priceUsd": "$9",
    "oldPriceUsd": "$19",
    "titleEn": "Modern SME & Cafe Responsive Landing Page Template (WhatsApp Order)",
    "summaryEn": "Ready-to-deploy responsive landing page for cafes, restaurants, and local businesses with interactive menu filtering, direct WhatsApp order formatting, dark/light mode, and ze",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-3",
    "title": "Script Python Otomatisasi Scraper & Export Data ke Excel / Google Sheets",
    "categories": [
      "Python",
      "Source Code"
    ],
    "price": "Rp 99.000",
    "oldPrice": "Rp 199.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/scraper/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/script-python-otomatisasi-scraper.html",
    "version": "v1.5 (Terbaru)",
    "stack": "Python 3.10+ (BeautifulSoup4 & Pandas)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/scraper/screenshot.png",
    "summary": "Kumpulan script otomatisasi Python siap pakai untuk mengambil, membersihkan, dan mengekspor data web secara terjadwal ke file Excel (.xlsx), CSV, maupun Google Sheets.",
    "features": [
      "Dilengkapi fitur retry otomatis, rotasi User-Agent, dan penanganan error jaringan.",
      "Ekspor hasil data langsung ke format Excel (.xlsx) rapi atau CSV.",
      "Kode modular dengan komentar penjelasan bahasa Indonesia di setiap fungsi.",
      "Dapat dijalankan otomatis secara terjadwal di Windows maupun Linux."
    ],
    "priceUsd": "$15",
    "oldPriceUsd": "$29",
    "titleEn": "Python Automated Web Scraper & Excel / Google Sheets Exporter",
    "summaryEn": "Modular Python 3.10+ automation script to scrape, clean, and export structured web data on schedule to Excel (.xlsx), CSV, or Google Sheets with auto-retry and User-Agent rota",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-4",
    "title": "Source Code Aplikasi E-Commerce & Katalog Toko Online Checkout QRIS",
    "categories": [
      "PHP",
      "Web App",
      "Source Code"
    ],
    "price": "Rp 169.000",
    "oldPrice": "Rp 349.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/ecommerce/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-aplikasi-e-commerce-katalog.html",
    "version": "v3.0 (Terbaru)",
    "stack": "PHP 8 Native (PDO MySQL) + Responsive CSS + QRIS Checkout",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/ecommerce/screenshot.png",
    "summary": "Source code platform toko online dan katalog produk lengkap dengan keranjang belanja interaktif, perhitungan ongkos kirim otomatis, manajemen pesanan, dan integrasi pembayaran QRIS & Virtual Account.",
    "features": [
      "Katalog produk multi-kategori dengan pencarian cepat & filter harga.",
      "Keranjang belanja (Cart) real-time tanpa reload halaman.",
      "Manajemen produk, varian ukuran/warna, diskon voucher, dan stok otomatis.",
      "Dashboard Admin lengkap untuk memantau pesanan masuk dan laporan penjualan.",
      "Desain Mobile-First yang sangat nyaman diakses dari smartphone pembeli."
    ],
    "priceUsd": "$25",
    "oldPriceUsd": "$49",
    "titleEn": "PHP 8 E-Commerce Store & Online Catalog Platform (MySQL PDO)",
    "summaryEn": "Full PHP 8 & MySQL PDO e-commerce platform with multi-category product catalog, live cart, product variants, discount vouchers, admin order dashboard, and QRIS/global payment ",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-5",
    "title": "Admin Dashboard & Analytics UI Kit Modern (Dark/Light Mode)",
    "categories": [
      "JavaScript",
      "Template",
      "Web App"
    ],
    "price": "Rp 89.000",
    "oldPrice": "Rp 179.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/dashboard-ui/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/admin-dashboard-analytics-ui-kit-modern.html",
    "version": "v2.1 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS + SVG Charts (Zero-Dependency)",
    "license": "Personal & Komersial (Unlimited)",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/dashboard-ui/screenshot.png",
    "summary": "Template Admin Dashboard profesional dengan 25+ komponen halaman siap pakai, grafik analitik interaktif, tabel data responsif, dan fitur Dark/Light Mode instan. Cocok untuk backend aplikasi Laravel, Node.js, maupun Python.",
    "features": [
      "5+ Template halaman siap pakai (Dashboard Analitik, Tabel CRUD, Formulir UI Kit, Faktur Cetak, Auth Login/Daftar).",
      "Grafik SVG interaktif bawaan (Line/Area, Bar, Donut) tanpa CDN eksternal — jalan 100% offline.",
      "Dark Mode & Light Mode otomatis tersimpan di localStorage.",
      "Sidebar navigasi lipat & responsif di layar Desktop, Tablet, maupun Smartphone.",
      "Tabel CRUD interaktif lengkap dengan pencarian, filter, pagination, tambah/edit, & ekspor CSV."
    ],
    "priceUsd": "$14",
    "oldPriceUsd": "$29",
    "titleEn": "Modern Admin Dashboard & Analytics UI Kit (Dark & Light Mode)",
    "summaryEn": "Multi-page SaaS & admin analytics dashboard template featuring interactive SVG charts, CRUD data tables, form components, printable invoices, auth screens, and Dark/Light them",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-6",
    "title": "Bot Auto-Responder & Notifikasi Laporan Otomatis Telegram / Webhook",
    "categories": [
      "Python",
      "Source Code",
      "Web App"
    ],
    "price": "Rp 119.000",
    "oldPrice": "Rp 249.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/bot-responder/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/bot-auto-responder-notifikasi-laporan.html",
    "version": "v1.8 (Terbaru)",
    "stack": "Python 3.10+ (Asyncio & REST API)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/bot-responder/screenshot.png",
    "summary": "Source code bot otomatisasi Python untuk mengirim notifikasi transaksi, laporan harian database/Excel, pemantauan server, serta balasan menu otomatis secara real-time.",
    "features": [
      "Arsitektur Asynchronous Python yang ringan dan merespons dalam hitungan milidetik.",
      "Mendukung pengiriman laporan otomatis (teks, tabel gambar, maupun file Excel/PDF).",
      "Menu tombol interaktif (Inline Keyboard) yang mudah dikustomisasi sesuai kebutuhan bisnis.",
      "Dilengkapi sistem pencatatan log aktivitas dan auto-reconnect saat koneksi terputus."
    ],
    "priceUsd": "$19",
    "oldPriceUsd": "$39",
    "titleEn": "Telegram Auto-Responder Bot & Webhook Reporting System (Python)",
    "summaryEn": "Python asyncio Telegram bot with custom regex auto-reply rules, inline keyboards, external webhook report receiver, and CSV activity export.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-7",
    "title": "Source Code Aplikasi Kalkulator Pengeluaran & Finansial (Windows .EXE + Android .APK)",
    "categories": [
      "JavaScript",
      "Template",
      "Web App"
    ],
    "price": "Rp 45.000",
    "oldPrice": "Rp 99.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/finansial/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-aplikasi-kalkulator.html",
    "version": "v2.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS + PWA Manifest (Desktop/Android WebView Ready)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/finansial/screenshot.png",
    "summary": "Template website Link-in-Bio modern dan super ringan dengan skor 100 PageSpeed. Bebas biaya langganan bulanan selamanya, bisa di-hosting 100% gratis di GitHub Pages, Vercel, atau Netlify. Lengkap dengan integrasi WhatsApp, medsos, katalog produk, dan mode gelap/terang.",
    "features": [
      "Buku kas pemasukan & pengeluaran harian dengan KPI Saldo Bersih dan Rasio Tabungan.",
      "Grafik Donut SVG interaktif & progress bar batas anggaran per kategori.",
      "Kalkulator target tabungan & simulasi imbal hasil bulanan otomatis.",
      "Dukungan Dark Mode & Light Mode, ekspor CSV Excel, serta tombol bagikan ringkasan ke WhatsApp.",
      "Dilengkapi manifest PWA, file launcher .bat Desktop, & panduan pembungkusan WebView APK."
    ],
    "priceUsd": "$7",
    "oldPriceUsd": "$15",
    "titleEn": "Personal Expense & Financial Budget Tracker Web App (Offline PWA)",
    "summaryEn": "Offline-ready financial tracker & budget planner with 4 KPI cards, category spending donut chart, budget limits, savings goal calculator, and CSV export.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-8",
    "title": "Script Python Auto-Converter PDF to Word / Excel & OCR Text Extractor",
    "categories": [
      "Python",
      "Source Code"
    ],
    "price": "Rp 39.000",
    "oldPrice": "Rp 89.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/pdf-converter/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/script-python-auto-converter-pdf-to.html",
    "version": "v1.3 (Terbaru)",
    "stack": "Python 3.10+ (pdfplumber, openpyxl, python-docx)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/pdf-converter/screenshot.png",
    "summary": "Script otomatisasi Python siap pakai untuk mengonversi dokumen PDF ke format Word (.docx) atau tabel Excel (.xlsx) tanpa watermark, tanpa batasan jumlah halaman, dan tanpa risiko kebocoran data karena semua proses berjalan 100% lokal di komputer Anda.",
    "features": [
      "Konversi tabel dari PDF langsung ke file Excel (.xlsx) rapi dengan pemisahan kolom otomatis.",
      "Ekstrak teks dan paragraf PDF ke dokumen Word (.docx) dengan format yang terjaga.",
      "Fitur Batch Processing: convert puluhan file PDF sekaligus dalam satu folder.",
      "100% Offline & Privat: data dokumen Anda tidak pernah dikirim ke server pihak ketiga.",
      "Dilengkapi antarmuka GUI sederhana (Tkinter) tinggal klik tombol pilih file."
    ],
    "priceUsd": "$7",
    "oldPriceUsd": "$15",
    "titleEn": "Python Batch PDF to Word / Excel Converter & OCR Extractor (CLI + GUI)",
    "summaryEn": "Python tool to extract tables and text from native and scanned PDFs into formatted Word (.docx) or Excel (.xlsx) files with both CLI and Tkinter GUI modes.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-9",
    "title": "Template Landing Page Undangan Digital Pernikahan & Event Responsive",
    "categories": [
      "JavaScript",
      "Template"
    ],
    "price": "Rp 45.000",
    "oldPrice": "Rp 99.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/undangan/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-landing-page-undangan-digital.html",
    "version": "v2.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + JavaScript (Audio Player & RSVP)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/undangan/screenshot.png",
    "summary": "Template website undangan digital pernikahan atau event modern dengan desain aesthetic dan fitur premium. Sangat cocok bagi Anda yang ingin membuka jasa pembuatan undangan online atau untuk acara pernikahan sendiri.",
    "features": [
      "Tombol Buka Undangan dengan efek animasi tirai halus (AOS Animation).",
      "Background Music Player dengan tombol kontrol putar/jeda melayang.",
      "Countdown Timer hitung mundur menuju hari-H acara secara real-time.",
      "Fitur Amplop Digital: Nomor rekening & scan QRIS dengan tombol 1-klik salin nomor.",
      "Form RSVP ucapan & konfirmasi kehadiran buku tamu.",
      "Integrasi Google Maps petunjuk arah lokasi acara."
    ],
    "priceUsd": "$7",
    "oldPriceUsd": "$15",
    "titleEn": "Responsive Digital Wedding & Event Invitation Landing Page",
    "summaryEn": "Elegant digital wedding invitation template with custom guest URL parameters, gallery, countdown timer, background audio player, and RSVP form.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-10",
    "title": "Bot Telegram Pengingat Tagihan & Jadwal Otomatis (Google Sheets API)",
    "categories": [
      "Python",
      "Source Code",
      "Web App"
    ],
    "price": "Rp 49.000",
    "oldPrice": "Rp 99.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/bot-tagihan/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/bot-telegram-pengingat-tagihan-jadwal.html",
    "version": "v1.4 (Terbaru)",
    "stack": "Python 3.10+ (Telegram Bot API & Google Sheets API)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/bot-tagihan/screenshot.png",
    "summary": "Bot otomatisasi yang terhubung langsung dengan Google Sheets. Bot akan membaca tanggal jatuh tempo tagihan, jadwal sewa, atau agenda penting, lalu secara otomatis mengirimkan pesan pengingat ke chat atau grup Telegram tanpa perlu repot cek spreadsheet manual setiap hari.",
    "features": [
      "Sinkronisasi real-time dengan Google Sheets pribadi Anda.",
      "Auto-cron check setiap pagi untuk mendeteksi tagihan/agenda yang jatuh tempo hari ini atau H-3.",
      "Kirim notifikasi otomatis langsung ke akun Telegram pribadi atau grup tim.",
      "Template pesan notifikasi profesional yang rapi dan bisa dikustomisasi sesuka hati.",
      "Bisa berjalan 24/7 di VPS murah atau bahkan gratisan (Google Cloud Run / Railway)."
    ],
    "priceUsd": "$9",
    "oldPriceUsd": "$19",
    "titleEn": "Telegram Billing Reminder & Due-Date Scheduler Bot (Python / CSV)",
    "summaryEn": "Automated Python billing reminder bot that tracks due dates (H-3, H-0, overdue) from CSV or Google Sheets and pushes formatted alerts to Telegram.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-11",
    "title": "Source Code Sistem Absensi Siswa & Karyawan QR Code Berbasis Web PHP",
    "categories": [
      "PHP",
      "Web App",
      "Source Code"
    ],
    "price": "Rp 59.000",
    "oldPrice": "Rp 129.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/absensi/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-sistem-absensi-siswa.html",
    "version": "v2.1 (Terbaru)",
    "stack": "PHP Native + MySQL + HTML5 QR Code Scanner",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/absensi/screenshot.png",
    "summary": "Aplikasi absensi praktis dan instan tanpa alat fingerprint mahal. Karyawan atau siswa cukup melakukan scan QR Code dinamis menggunakan kamera smartphone masing-masing untuk mencatat kehadiran secara akurat.",
    "features": [
      "Scan QR Code instan langsung lewat kamera browser smartphone tanpa instal aplikasi APK.",
      "Pencatatan waktu hadir, jam masuk, jam pulang, dan status terlambat otomatis.",
      "Dashboard admin untuk melihat kehadiran harian dan grafik statistik bulanan.",
      "Ekspor rekapitulasi kehadiran seluruh karyawan/siswa ke format Excel (.xlsx).",
      "Manajemen data karyawan/siswa, divisi, dan jadwal kerja."
    ],
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "titleEn": "QR Code Employee & Student Attendance System (PHP 8 + MySQL)",
    "summaryEn": "PHP 8 PDO + MySQL attendance web app with browser camera QR scanning (BarcodeDetector + USB scanner), late threshold calculation, printable QR ID cards, and Excel/CSV export.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-12",
    "title": "Starter Kit Payment Gateway Midtrans & Mayar QRIS Siap Pakai (PHP)",
    "categories": [
      "PHP",
      "Source Code"
    ],
    "price": "Rp 65.000",
    "oldPrice": "Rp 139.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/payment-kit/",
    "postUrl": "https://asetkode.blogspot.com/",
    "version": "v1.2 (Terbaru)",
    "stack": "PHP Native / Laravel (cURL, Webhook Handler, QRIS)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/payment-kit/screenshot.png",
    "summary": "Modul starter kit siap pakai untuk menerima pembayaran otomatis QRIS, GoPay, OVO, ShopeePay, dan Virtual Account bank (BCA, BNI, BRI, Mandiri) di website Anda. Dilengkapi endpoint webhook otomatis yang mengubah status order jadi LUNAS detik itu juga.",
    "features": [
      "Mendukung 2 gateway populer sekaligus: Midtrans Snap & Mayar Payment Link.",
      "Halaman checkout responsif dengan pop-up QRIS real-time.",
      "Webhook notification handler untuk verifikasi pembayaran otomatis dari server payment.",
      "Contoh kode bersih dan modular, mudah ditempel ke web toko online atau sistem Anda yang sudah ada.",
      "Termasuk mode Sandbox (testing) dan mode Production (live)."
    ],
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "titleEn": "Payment Gateway Starter Kit for Midtrans & Mayar (PHP 8 + Webhook)",
    "summaryEn": "Production-ready PHP integration starter kit for invoice creation, MySQL transaction logging, signature verification webhooks, and sandbox testing.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-13",
    "title": "Source Code Kasir Toko Sederhana & Cetak Struk Mini POS (Zero-Config XAMPP)",
    "categories": [
      "PHP",
      "Web App",
      "Source Code"
    ],
    "price": "Rp 75.000",
    "oldPrice": "Rp 150.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/kasir-php/",
    "postUrl": "https://asetkode.blogspot.com/",
    "version": "v1.5 (Terbaru)",
    "stack": "PHP Native + MySQL + Bootstrap (Mudah untuk Pemula)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/kasir-php/screenshot.png",
    "summary": "Aplikasi kasir penjualan dan manajemen stok barang versi ringan tanpa framework rumit. Sangat mudah dipahami bagi pemula yang baru belajar PHP atau UMKM yang membutuhkan sistem kasir simpel tanpa perlu instal Node.js atau Composer.",
    "features": [
      "Transaksi penjualan kasir cepat dengan hitung kembalian otomatis.",
      "Fitur cetak struk nota belanja langsung ke printer thermal (58mm) atau simpan PDF.",
      "Manajemen data barang, harga beli, harga jual, dan stok otomatis berkurang saat terjual.",
      "Laporan omzet penjualan harian dan bulanan sederhana.",
      "Desain antarmuka bersih menggunakan Bootstrap 5, nyaman di layar laptop maupun tablet kasir."
    ],
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "titleEn": "Mini POS Store Cashier & 58mm Thermal Receipt App (PHP 8 + MySQL)",
    "summaryEn": "Lightweight PHP & MySQL point-of-sale application for retail shops with barcode product lookup, automatic stock deduction, daily sales reports, and 58mm thermal printing.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-14",
    "title": "Template Desain Web Company Profile & Digital Agency Modern (HTML5 + Tailwind)",
    "categories": [
      "Desain Web",
      "Template",
      "Source Code",
      "JavaScript"
    ],
    "price": "Rp 59.000",
    "oldPrice": "Rp 149.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/agency/",
    "postUrl": "https://asetkode.blogspot.com/",
    "version": "v2.2 (Terbaru)",
    "stack": "HTML5 + Tailwind CSS + Vanilla JS",
    "license": "Personal & Komersial (Unlimited Project)",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/agency/screenshot.png",
    "summary": "Desain web Company Profile & Agensi Digital modern dengan tata letak bersih, dark/light mode, portofolio interaktif, tabel paket layanan, dan form kontak cepat. Cocok untuk bisnis jasa, studio kreatif, dan freelancer.",
    "features": [
      "8+ Halaman & Seksi Siap Pakai (Hero, Layanan, Portofolio, Tim, Harga, Testimoni, FAQ, Kontak).",
      "Desain Web Responsif 100% di Desktop, Tablet, dan Smartphone.",
      "Animasi Scroll Halus & Skor Performa Tinggi (Tanpa Framework Berat).",
      "Kode HTML5 & CSS Rapi Mudah Diganti Logo, Warna, dan Teks."
    ],
    "priceUsd": "$9",
    "oldPriceUsd": "$19",
    "titleEn": "Modern Digital Agency & Company Profile HTML5 Template",
    "summaryEn": "High-converting agency & company profile landing page with service tiers, portfolio showcase, testimonials, FAQ accordion, Dark/Light mode, and easy config.js setup.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-15",
    "title": "Desain Web Portfolio Pribadi & Link-in-Bio Kreator Minimalis (Dark/Light)",
    "categories": [
      "Desain Web",
      "Template",
      "JavaScript"
    ],
    "price": "Rp 39.000",
    "oldPrice": "Rp 89.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/biolink/",
    "postUrl": "https://asetkode.blogspot.com/",
    "version": "v1.4 (Terbaru)",
    "stack": "HTML5 + CSS3 + JavaScript",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/biolink/screenshot.png",
    "summary": "Template desain web portfolio pribadi sekaligus halaman Link-in-Bio profesional untuk developer, desainer, content creator, dan pekerja lepas. Tampil elegan dan cepat diakses dari bio Instagram/TikTok.",
    "features": [
      "Gabungan Halaman Link-in-Bio & Showcase Portofolio Karya.",
      "Tombol Salin Email & Tautan Sosial Media 1-Klik.",
      "Mode Gelap & Terang Otomatis.",
      "Sangat Ringan (<100 KB) & Ramah SEO."
    ],
    "priceUsd": "$7",
    "oldPriceUsd": "$15",
    "titleEn": "Creator Link-in-Bio & Mini Portfolio Web Template (Dark/Light)",
    "summaryEn": "Self-hosted link-in-bio & creator portfolio card with bento stats, project showcase modals, service rate cards, .vcf contact download, and zero monthly fees.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-16",
    "title": "Program Aplikasi Manajemen Antrian & Tiket Layanan Pelanggan Web + Suara Panggil",
    "categories": [
      "Program",
      "Web App",
      "Source Code",
      "JavaScript"
    ],
    "price": "Rp 89.000",
    "oldPrice": "Rp 199.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/antrian/",
    "postUrl": "https://asetkode.blogspot.com/",
    "version": "v1.8 (Terbaru)",
    "stack": "HTML5 + JavaScript + Web Speech API (Zero-Config)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/antrian/screenshot.png",
    "summary": "Program antrian digital berbasis web untuk klinik, apotek, bengkel, loket pelayanan, dan toko servis. Dilengkapi layar monitor antrian, tombol panggil suara otomatis bahasa Indonesia, dan cetak nomor antrian.",
    "features": [
      "Panggilan Suara Otomatis Bahasa Indonesia (Nomor Antrian & Loket).",
      "Layar Monitor Antrian Fullscreen untuk TV/Monitor Ruang Tunggu.",
      "Dukungan Multi-Loket / Multi-Layanan & Reset Antrian Harian.",
      "Zero-Config: Langsung jalan di browser tanpa install server rumit."
    ],
    "priceUsd": "$15",
    "oldPriceUsd": "$29",
    "titleEn": "Digital Queue & Counter Calling Web System with Voice Synth",
    "summaryEn": "Zero-Config queue management app with Operator console, synced TV waiting-room display, ticket kiosk thermal print, Web Speech voice calling, and CSV logs.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-17",
    "title": "Paket Desain Web UI Kit E-Commerce & SaaS Components (HTML/CSS/JS Siap Pakai)",
    "categories": [
      "Desain Web",
      "Template",
      "Web App",
      "Source Code"
    ],
    "price": "Rp 69.000",
    "oldPrice": "Rp 159.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/uikit/",
    "postUrl": "https://asetkode.blogspot.com/",
    "version": "v2.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Modular JS",
    "license": "Personal & Komersial (Unlimited Project)",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/uikit/screenshot.png",
    "summary": "Koleksi 42 komponen desain web interaktif siap copy-paste untuk Toko Online & SaaS lengkap dengan Dark/Light Mode & salin kode 1-klik.",
    "features": [
      "40+ Komponen UI Siap Pakai Tanpa Dependency Berat.",
      "Sudah Mendukung Dark Mode & Light Mode.",
      "Mudah Digabung ke Laravel, React, Vue, atau HTML Biasa.",
      "Struktur CSS Variabel Bersih untuk Ganti Warna Brand dalam Sekejap."
    ],
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "titleEn": "42 Interactive E-Commerce & SaaS Web UI Components Kit",
    "summaryEn": "42 responsive, copy-paste-ready UI components across 7 categories with CSS design tokens, 4 brand accent presets, Dark/Light mode, and 1-click HTML/CSS code copy.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-18",
    "title": "Program Pembuat Invoice, Penawaran Harga & Kwitansi Bisnis Pro (Cetak PDF & WhatsApp)",
    "categories": [
      "Aplikasi",
      "Web App",
      "Source Code",
      "JavaScript"
    ],
    "price": "Rp 59.000",
    "oldPrice": "Rp 139.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/invoice/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/program-pembuat-invoice-penawaran-harga.html",
    "version": "v1.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS (Zero-Config & Print A4 PDF Ready)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/invoice/screenshot.png",
    "summary": "Aplikasi pembuat Invoice tagihan, Penawaran Harga (Quotation), dan Kwitansi resmi siap cetak A4 PDF yang berjalan langsung di browser tanpa server/XAMPP (Zero-Config).",
    "features": [
      "3 Jenis Dokumen Sekaligus: Invoice, Penawaran Harga (Quotation), dan Kwitansi Resmi.",
      "Live Preview Kertas A4 Real-Time lengkap dengan stempel SVG LUNAS/BELUM LUNAS.",
      "Terbilang Bahasa Indonesia Otomatis & Hitung PPN 11% / PPh 23."
    ],
    "priceUsd": "$9",
    "oldPriceUsd": "$19",
    "titleEn": "Pro Invoice, Quotation & Business Receipt Generator (A4 PDF Ready)",
    "summaryEn": "Offline-first invoicing, quotation, and receipt generator with live A4 preview, automatic tax/discount math, SVG Paid stamps, 1-click quote-to-invoice conversion, and CSV expo",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-19",
    "title": "Aplikasi Booking Jadwal, Reservasi Jasa & Manajemen Janji Temu Pelanggan (Klinik / Salon / Bengkel)",
    "categories": [
      "Aplikasi",
      "Web App",
      "Source Code",
      "JavaScript"
    ],
    "price": "Rp 79.000",
    "oldPrice": "Rp 169.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/booking/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/aplikasi-booking-jadwal-reservasi-jasa.html",
    "version": "v1.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS (Anti Double-Booking & .ICS Calendar)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/booking/screenshot.png",
    "summary": "Sistem reservasi online dan manajemen jadwal janji temu pelanggan siap pakai untuk klinik, barbershop/salon, bengkel, maupun studio konsultasi dengan proteksi anti double-booking.",
    "features": [
      "4 Preset Bidang Usaha 1-Klik: Klinik, Barbershop & Salon, Bengkel Servis, Studio Konsultan.",
      "Slot Jam Dinamis Anti Double-Booking per staf & tanggal.",
      "Tiket Booking Otomatis + Unduh Kalender (.ics) & Konfirmasi WhatsApp."
    ],
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "titleEn": "Appointment Booking, Service Reservation & Schedule Manager App",
    "summaryEn": "Client booking and appointment dashboard with 4 business presets, anti-double-booking per staff slot, .ICS calendar download, and receptionist analytics.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-20",
    "title": "Source Code Aplikasi Kasir Laundry Kiloan/Satuan & Pelacakan Status Order + Nota Thermal",
    "categories": [
      "Aplikasi",
      "Program",
      "Web App",
      "Source Code"
    ],
    "price": "Rp 85.000",
    "oldPrice": "Rp 189.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/laundry/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-aplikasi-kasir-laundry.html",
    "version": "v1.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS (Nota Thermal 58/80mm & Order Tracking)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/laundry/screenshot.png",
    "summary": "Aplikasi kasir khusus usaha laundry kiloan dan satuan lengkap dengan board manajemen produksi 5 tahap, pelacakan status cucian real-time, notifikasi WA, dan cetak nota thermal.",
    "features": [
      "Kasir Order Kiloan desimal & Satuan dengan 8 paket layanan preset.",
      "Live Preview & Cetak Nota Thermal 58mm/80mm + Kode Pelacakan LDR-xxxx.",
      "Board Produksi 5 Tahap & Halaman Cek Status Pelanggan."
    ],
    "priceUsd": "$15",
    "oldPriceUsd": "$29",
    "titleEn": "Laundry POS Cashier & 5-Stage Order Tracking + Thermal Receipt",
    "summaryEn": "Dedicated laundry POS supporting weight (kg) & per-item orders, 5-stage production Kanban board, customer order tracker, 58/80mm thermal receipts, and CSV reports.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-21",
    "title": "Template Blogger Ddev NewsPro v2.0 — Portal Berita, Majalah & Media Digital Modern",
    "categories": [
      "Template",
      "Blogger",
      "Desain Web",
      "Source Code"
    ],
    "price": "Rp 69.000",
    "oldPrice": "Rp 149.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/blogger-news/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-blogger-ddev-newspro-v20.html",
    "version": "v2.0 (Blogger XML v3)",
    "stack": "Blogger XML v3 + Responsive CSS + JSON Feed & SEO Schema",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/blogger-news/screenshot.png",
    "summary": "Template Blogger XML Layouts v3 bergaya editorial untuk portal berita online, majalah digital, maupun blog media teknologi lengkap dengan Breaking News Ticker, Hero 3 Kolom, Daftar Isi otomatis, & Dark Mode.",
    "features": [
      "Blogger XML Layouts v3 Asli dengan dukungan Theme Designer (<Group>/<Variable>).",
      "Breaking News Ticker & Related Posts Otomatis via JSON Feed Blogger.",
      "Single Post Pro: Estimasi Waktu Baca, Daftar Isi (#toc), Share WA/X, & Schema NewsArticle."
    ],
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "titleEn": "Ddev NewsPro v2.0 — Editorial News & Magazine Blogger XML Theme",
    "summaryEn": "Valid Blogger Layouts v3 XML theme built for news portals and online magazines featuring a breaking news ticker, 3-column editorial hero, auto TOC, Reader Mode, Dark Mode, and",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-22",
    "title": "Template Blogger Ddev TokoKu v3 — Toko Online, Katalog Produk & Checkout WhatsApp / Mayar",
    "categories": [
      "Template",
      "Blogger",
      "Desain Web",
      "Source Code"
    ],
    "price": "Rp 79.000",
    "oldPrice": "Rp 179.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/blogger-toko/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-blogger-ddev-tokoku-v3-toko.html",
    "version": "v3.0 (Blogger XML v3)",
    "stack": "Blogger XML v3 + Cart Engine + Checkout WhatsApp & Mayar",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/blogger-toko/screenshot.png",
    "summary": "Ubah blog Blogger gratis menjadi website toko online profesional lengkap dengan keranjang belanja persisten, pilihan varian, kalkulasi diskon & ongkir, serta checkout WhatsApp / Mayar.",
    "features": [
      "Parser Postingan Produk Pintar (harga, harga coret, stok, varian, link Mayar).",
      "Keranjang Belanja Slide-over Drawer + Mobile Sticky Cart Bar.",
      "Checkout Otomatis ke WhatsApp Admin / Pembayaran Instan Mayar."
    ],
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "titleEn": "Ddev TokoKu v3 — E-Commerce Catalog & Checkout Blogger XML Theme",
    "summaryEn": "Turn Blogger into an online store with zero hosting cost: structured post price/variant parser, persistent cart drawer, automatic discount math, WhatsApp & global checkout sup",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-23",
    "title": "Template Blogger Ddev Folio — Portofolio, CV Kreatif & Personal Branding Minimalis",
    "categories": [
      "Template",
      "Blogger",
      "Desain Web",
      "Source Code"
    ],
    "price": "Rp 55.000",
    "oldPrice": "Rp 129.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/blogger-portfolio/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-blogger-ddev-folio-portofolio.html",
    "version": "v1.0 (Blogger XML v3)",
    "stack": "Blogger XML v3 + Swiss Minimalist Grid + Dark Mode",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/blogger-portfolio/screenshot.png",
    "summary": "Template Blogger Swiss Editorial Minimalis untuk UI/UX Designer, Web Developer, Freelancer, maupun Kreator. Menampilkan studi kasus proyek per Label Blogger, layanan, & preview cetak CV.",
    "features": [
      "Desain Swiss Editorial + Filter Karya Dinamis per Label Blogger.",
      "Layout Studi Kasus Lengkap, Widget Pengalaman Kerja, & Paket Layanan.",
      "Preview Cetak CV (@media print), Salin Email 1-Klik, & Dark Mode."
    ],
    "priceUsd": "$9",
    "oldPriceUsd": "$19",
    "titleEn": "Ddev Folio — Swiss Minimalist Portfolio & CV Blogger XML Theme",
    "summaryEn": "Editorial Swiss-grid Blogger XML theme for designers, developers, and freelancers with label-based case studies, services & rates, printable CV layout, and Dark Mode.",
    "usdPaymentUrl": "#checkout-usd"
  },
  {
    "id": "prod-24",
    "title": "Template Blogger Ddev DocsPro — Dokumentasi Teknis, Tutorial Kode & Blog Developer Pro",
    "categories": [
      "Template",
      "Blogger",
      "Desain Web",
      "Source Code"
    ],
    "price": "Rp 65.000",
    "oldPrice": "Rp 145.000",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/blogger-docs/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-blogger-ddev-docspro.html",
    "version": "v1.0 (Blogger XML v3)",
    "stack": "Blogger XML v3 + 3-Col Docs Layout + Ctrl+K Search",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/blogger-docs/screenshot.png",
    "summary": "Template Blogger kelas developer 3 kolom untuk situs dokumentasi API, knowledge base SaaS, maupun blog tutorial coding dengan Quick Search Ctrl+K, Copy Code, & Sticky TOC.",
    "features": [
      "Layout 3 Kolom: Collapsible Docs Sidebar, Konten Kode + Copy Button, Sticky TOC.",
      "Quick Search Modal (Ctrl+K) via JSON Feed Blogger dengan Navigasi Keyboard.",
      "Callout Info/Tip/Warn, Badge HTTP Method, Prev/Next Docs, & Dark Mode."
    ],
    "priceUsd": "$10",
    "oldPriceUsd": "$22",
    "titleEn": "Ddev DocsPro — 3-Column Tech Docs & Developer Blog Blogger XML Theme",
    "summaryEn": "Developer-grade 3-column Blogger XML theme featuring collapsible label sidebar, Ctrl+K JSON feed search, copy-code buttons, callout blocks, ScrollSpy TOC, and TechArticle Sche",
    "usdPaymentUrl": "#checkout-usd"
  }
];
let productsState = [...FALLBACK_PRODUCTS];
let activeCategory = 'all';
let searchQuery = '';
let sortMode = 'newest';
let cartState = [];
let currentDemoProduct = null;

function parsePriceNum(str) {
  if (!str) return 0;
  const digits = String(str).replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

function formatRupiah(num) {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}

function getDiscountPercent(priceStr, oldPriceStr) {
  const p = parsePriceNum(priceStr);
  const old = parsePriceNum(oldPriceStr);
  if (p > 0 && old > p) {
    return Math.round(((old - p) / old) * 100);
  }
  return 0;
}

function inferDemoType(title, categories) {
  const t = (title || '').toLowerCase();
  const c = (categories || []).join(' ').toLowerCase();
  if (t.includes('kasir') || t.includes('pos') || t.includes('inventori')) return 'pos';
  if (t.includes('e-commerce') || t.includes('toko online') || t.includes('katalog')) return 'ecom';
  if (t.includes('dashboard') || t.includes('analytics') || t.includes('admin')) return 'dashboard';
  if (t.includes('landing') || t.includes('saas') || t.includes('agency')) return 'saas';
  if (c.includes('python') || t.includes('bot') || t.includes('scraper')) return 'bot';
  return 'saas';
}

// ================= 1. BLOGGER CLOUD JSONP SYNC =================
window.__asetkodeBloggerCallback = function (data) {
  try {
    const entries = (data && data.feed && data.feed.entry) || [];
    if (!entries.length) return;

    const syncedProducts = entries.map((entry, idx) => {
      const title = entry.title && entry.title.$t ? entry.title.$t : 'Produk Digital #' + (idx + 1);
      const rawHtml = (entry.content && entry.content.$t) || (entry.summary && entry.summary.$t) || '';
      const categories = (entry.category || []).map((c) => c.term).filter(Boolean);
      const altLink = (entry.link || []).find((l) => l.rel === 'alternate');
      const postUrl = altLink ? altLink.href : BLOGGER_ORIGIN;

      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
      const metaEl = doc.querySelector('.product-meta-data');
      const firstImg = doc.querySelector('img');
      const descEl = doc.querySelector('.product-description p') || doc.querySelector('p');
      const featEls = doc.querySelectorAll('.product-features li');

      const price = (metaEl && metaEl.getAttribute('data-price')) || 'Rp 99.000';
      const oldPrice = (metaEl && metaEl.getAttribute('data-old-price')) || '';
      const priceUsd = (metaEl && metaEl.getAttribute('data-price-usd')) || '';
      const oldPriceUsd = (metaEl && metaEl.getAttribute('data-old-price-usd')) || '';
      const usdPaymentUrl = (metaEl && metaEl.getAttribute('data-usd-url')) || '#checkout-usd';
      const explicitTitleEn = (metaEl && metaEl.getAttribute('data-title-en')) || '';
      const fbMatch = FALLBACK_PRODUCTS.find((f) => f.title.toLowerCase() === title.toLowerCase() || (f.demoUrl && metaEl && (metaEl.getAttribute('data-demo-url') || '').includes(f.demoUrl)));
      const paymentUrl = (metaEl && metaEl.getAttribute('data-payment-url')) || postUrl;
      const demoUrl = (metaEl && metaEl.getAttribute('data-demo-url')) || postUrl;
      const version = (metaEl && metaEl.getAttribute('data-version')) || 'v1.0';
      const stack = (metaEl && metaEl.getAttribute('data-stack')) || (categories.join(' • ') || 'Full Source Code');
      const license = (metaEl && metaEl.getAttribute('data-license')) || 'Personal & Komersial';
      const openMode = (metaEl && metaEl.getAttribute('data-open-mode')) || 'modal';

      let features = Array.from(featEls).map((li) => li.textContent.trim()).filter(Boolean);
      if (!features.length) {
        features = [
          '100% Full Source Code Tanpa Enkripsi (Siap Kustomisasi)',
          'Database SQL Lengkap + Dokumentasi Panduan Instalasi',
          'Pengiriman Otomatis Detik Itu Juga via Email & Web',
          'Lisensi Penggunaan Personal & Proyek Komersial'
        ];
      }

      const summaryText = descEl
        ? descEl.textContent.trim().slice(0, 175)
        : 'Source code dan karya digital siap pakai lengkap dengan dokumentasi instalasi dan database.';

      return {
        id: 'blogger-prod-' + idx,
        title,
        titleEn: explicitTitleEn || (fbMatch && fbMatch.titleEn) || '',
        categories: categories.length ? categories : ['Source Code'],
        price,
        oldPrice,
        priceUsd: priceUsd || (fbMatch && fbMatch.priceUsd) || '',
        oldPriceUsd: oldPriceUsd || (fbMatch && fbMatch.oldPriceUsd) || '',
        usdPaymentUrl,
        paymentUrl,
        demoUrl,
        postUrl,
        version,
        stack,
        license,
        openMode,
        demoType: inferDemoType(title, categories),
        thumbnailUrl: firstImg ? firstImg.src : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
        summary: summaryText,
        summaryEn: (fbMatch && fbMatch.summaryEn) || '',
        features
      };
    });

    if (syncedProducts.length > 0) {
      productsState = syncedProducts;
      renderProductsGrid();
      const statusEl = document.getElementById('catalogStatusText');
      if (statusEl) {
        statusEl.textContent = `Terhubung Live dengan asetkode.blogspot.com (${syncedProducts.length} produk aktif)`;
      }
    }
  } catch (err) {
    console.warn('Blogger feed parse warning (using fallback catalog):', err);
  }
};

function syncFromBloggerCloud() {
  const script = document.createElement('script');
  script.src = `${BLOGGER_ORIGIN}/feeds/posts/default?alt=json-in-script&max-results=50&callback=__asetkodeBloggerCallback`;
  script.async = true;
  script.onerror = () => {
    const statusEl = document.getElementById('catalogStatusText');
    if (statusEl) {
      statusEl.textContent = `Katalog Siap (${productsState.length} produk unggulan siap diunduh)`;
    }
  };
  document.body.appendChild(script);
}

// ================= 2. RENDER PRODUCT CATALOG GRID =================
function renderProductsGrid() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  let list = productsState.filter((item) => {
    if (SITE_CONFIG.onlyReadyProducts) {
      const isReadyId = Array.isArray(SITE_CONFIG.readyIds) && SITE_CONFIG.readyIds.includes(item.id);
      const hasLocalDemo = Boolean(item.demoUrl && item.demoUrl.includes('demo/'));
      if (!isReadyId && !hasLocalDemo) return false;
    }

    const matchesCat =
      activeCategory === 'all' ||
      item.categories.some((c) => c.toLowerCase() === activeCategory.toLowerCase());

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.stack.toLowerCase().includes(q) ||
      item.categories.some((c) => c.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  list = [...list].sort((a, b) => {
    if (sortMode === 'price-asc') return parsePriceNum(a.price) - parsePriceNum(b.price);
    if (sortMode === 'price-desc') return parsePriceNum(b.price) - parsePriceNum(a.price);
    if (sortMode === 'disc-desc') {
      return getDiscountPercent(b.price, b.oldPrice) - getDiscountPercent(a.price, a.oldPrice);
    }
    return 0;
  });

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:56px 20px; background:var(--bg-surface); border:1px dashed var(--border-strong); border-radius:16px;">
        <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:6px;">Produk Tidak Ditemukan</h3>
        <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:16px;">Coba gunakan kata kunci lain atau tampilkan semua kategori.</p>
        <button type="button" class="btn btn-primary" onclick="resetCatalogFilter()">Tampilkan Semua Karya</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list
    .map((p) => {
      const disp = getProdDisplay(p);
      const disc = getDiscountPercent(p.price, p.oldPrice);
      const inCart = cartState.some((c) => c.id === p.id);
      const hasRealDemo = Boolean(p.demoUrl && !p.demoUrl.startsWith('http'));
      const stackChips = p.stack
        .split('+')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="card-window-top">
            <div class="window-dots">
              <span class="win-dot r"></span>
              <span class="win-dot y"></span>
              <span class="win-dot g"></span>
            </div>
            <span class="card-version-text">${p.version} • ZIP Ready</span>
          </div>

          <div class="card-thumb">
            <img src="${p.thumbnailUrl}" alt="${disp.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80';" />
            ${disc > 0 ? `<span class="discount-pill">${disp.isEn ? 'SAVE' : 'HEMAT'} ${disc}%</span>` : ''}
            ${hasRealDemo ? `<span class="live-app-pill">● Live App</span>` : ''}
            <div class="thumb-tags">
              ${p.categories
                .slice(0, 3)
                .map((cat) => `<span class="thumb-tag">${cat}</span>`)
                .join('')}
            </div>
            <div class="card-hover-overlay">
              <button type="button" class="overlay-btn primary" onclick="openLiveDemoById('${p.id}')">
                Live Demo
              </button>
              <button type="button" class="overlay-btn" onclick="openDetailById('${p.id}')">
                ${disp.isEn ? 'Details &amp; .ZIP' : 'Detail &amp; Isi .ZIP'}
              </button>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title" onclick="openDetailById('${p.id}')">${disp.title}</h3>
            <p class="card-desc">${disp.summary}</p>

            <div class="stack-row">
              ${stackChips.map((st) => `<span class="stack-chip">${st}</span>`).join('')}
              <span class="stack-chip">${disp.isEn ? 'Instant ZIP' : 'Auto-Download'}</span>
            </div>

            <div class="card-footer">
              <div class="price-row">
                <div class="price-group">
                  <span class="price-current">${disp.price}</span>
                  ${disp.oldPrice ? `<span class="price-old">${disp.oldPrice}</span>` : ''}
                </div>
                <span class="verified-pill">✓ Instant ZIP</span>
              </div>

              <div class="card-actions">
                <button type="button" class="btn-card" onclick="openLiveDemoById('${p.id}')" title="${disp.isEn ? 'Launch Interactive Demo' : 'Coba Simulasi Live Demo'}">
                  Demo
                </button>
                <button type="button" class="btn-card" onclick="toggleCartItemById('${p.id}')" title="${disp.isEn ? 'Add to Cart' : 'Masukkan ke Keranjang'}">
                  ${inCart ? (disp.isEn ? '✓ In Cart' : '✓ Keranjang') : (disp.isEn ? '+ Cart' : '+ Keranjang')}
                </button>
                <button type="button" class="btn-card buy" onclick="openInstantCheckoutById('${p.id}')">
                  ${disp.isEn ? 'Buy Now' : 'Beli Instan'}
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

window.resetCatalogFilter = function () {
  activeCategory = 'all';
  searchQuery = '';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('#filterBar .filter-chip').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === 'all');
  });
  renderProductsGrid();
};

// ================= 3. INTERACTIVE LIVE DEMO SIMULATOR (MONOCHROME) =================
window.openLiveDemoById = function (productId) {
  const prod = productsState.find((p) => p.id === productId);
  if (!prod) return;
  currentDemoProduct = prod;

  const modal = document.getElementById('demoSimModal');
  const titleEl = document.getElementById('demoSimTitle');
  const stageEl = document.getElementById('demoViewportStage');
  const buyBtn = document.getElementById('demoSimBuyBtn');

  if (titleEl) titleEl.textContent = `Interactive Preview: ${prod.title}`;
  if (buyBtn) {
    buyBtn.textContent = `Beli Source Code (${prod.price})`;
    buyBtn.onclick = () => {
      closeModal('demoSimModal');
      openInstantCheckoutById(prod.id);
    };
  }

  if (stageEl) {
    stageEl.style.width = '100%';
    stageEl.innerHTML = buildInteractiveDemoHTML(prod);
  }

  document.querySelectorAll('.vp-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-vp') === '100%');
  });

  if (modal) modal.classList.add('open');
  bindPosSimulatorEvents();
};

function buildInteractiveDemoHTML(prod) {
  const type = prod.demoType || inferDemoType(prod.title, prod.categories);

  if (type === 'live_frame' || (prod.demoUrl && prod.demoUrl.startsWith('demo/'))) {
    return `
      <div style="width:100%; height:620px; position:relative; background:#09090b;">
        <div style="background:#09090b; color:#fff; padding:10px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981;"></span>
            <span style="font-size:0.8rem; font-weight:700;">LIVE PREVIEW: ${prod.title}</span>
          </div>
          <a href="${prod.demoUrl}" target="_blank" rel="noopener" style="background:#fff; color:#09090b; padding:4px 12px; border-radius:6px; font-size:0.75rem; font-weight:700; text-decoration:none;">Buka Layar Penuh ↗</a>
        </div>
        <iframe src="${prod.demoUrl}" style="width:100%; height:calc(100% - 41px); border:0; background:#fff;" allow="autoplay; clipboard-write"></iframe>
      </div>
    `;
  }

  if (type === 'pos') {
    return `
      <div style="font-family:'Plus Jakarta Sans',sans-serif; background:#fafafa; min-height:540px; color:#09090b;">
        <div style="background:#09090b; color:#fff; padding:14px 22px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="background:#ffffff; color:#09090b; padding:4px 10px; border-radius:6px; font-weight:800; font-size:0.76rem; font-family:'JetBrains Mono',monospace;">POS KASIR PRO v2.4</span>
            <span style="font-size:0.82rem; color:#a1a1aa;">Cabang Utama • Kasir: Admin Demo</span>
          </div>
          <span style="font-size:0.74rem; background:#27272a; color:#fafafa; padding:4px 10px; border-radius:99px; font-weight:700;">● Printer Thermal Ready</span>
        </div>

        <div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:18px; padding:20px;">
          <div>
            <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
              <strong style="font-size:0.92rem;">Klik Menu untuk Tambah ke Struk Kasir:</strong>
              <span style="font-size:0.74rem; color:#71717a;">Simulasi Interaktif Real-Time</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:10px;">
              <button type="button" class="pos-sim-item" data-name="Kopi Susu Aren" data-price="18000" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">Kopi Susu Aren</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">Rp 18.000</div>
              </button>
              <button type="button" class="pos-sim-item" data-name="Croissant Butter" data-price="24000" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">Croissant Butter</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">Rp 24.000</div>
              </button>
              <button type="button" class="pos-sim-item" data-name="Matcha Latte Ice" data-price="22000" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">Matcha Latte Ice</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">Rp 22.000</div>
              </button>
              <button type="button" class="pos-sim-item" data-name="Beef Burger Deluxe" data-price="35000" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">Beef Burger Deluxe</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">Rp 35.000</div>
              </button>
              <button type="button" class="pos-sim-item" data-name="French Fries Crispy" data-price="16000" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">French Fries Crispy</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">Rp 16.000</div>
              </button>
              <button type="button" class="pos-sim-item" data-name="Mineral Water 600ml" data-price="8000" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">Mineral Water</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">Rp 8.000</div>
              </button>
            </div>
          </div>

          <div style="background:#fff; border:1px solid #e4e4e7; border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-weight:800; font-size:0.9rem; padding-bottom:10px; border-bottom:1px dashed #d4d4d8; display:flex; justify-content:space-between;">
                <span>Struk Transaksi #INV-8092</span>
                <button type="button" id="posResetBtn" style="font-size:0.72rem; color:#52525b; text-decoration:underline; background:none; border:none; cursor:pointer; font-weight:700;">Reset</button>
              </div>
              <div id="posReceiptList" style="margin:12px 0; max-height:210px; overflow-y:auto; font-size:0.82rem;">
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f4f4f5;">
                  <span>1x Kopi Susu Aren</span>
                  <strong>Rp 18.000</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f4f4f5;">
                  <span>1x Croissant Butter</span>
                  <strong>Rp 24.000</strong>
                </div>
              </div>
            </div>
            <div style="border-top:2px solid #09090b; padding-top:12px;">
              <div style="display:flex; justify-content:space-between; font-size:0.98rem; font-weight:800; margin-bottom:12px; font-family:'JetBrains Mono',monospace;">
                <span>Total Tagihan:</span>
                <span id="posTotalVal">Rp 42.000</span>
              </div>
              <button type="button" id="posPrintBtn" style="width:100%; background:#09090b; color:#fff; border:none; padding:11px; border-radius:8px; font-weight:800; cursor:pointer;">
                Bayar QRIS &amp; Cetak Struk Thermal
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'dashboard' || type === 'ecom') {
    return `
      <div style="font-family:'Plus Jakarta Sans',sans-serif; background:#09090b; min-height:540px; color:#fafafa; padding:22px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid #27272a;">
          <div>
            <span style="background:#27272a; color:#fafafa; padding:4px 10px; border-radius:6px; font-size:0.72rem; font-weight:800; font-family:'JetBrains Mono',monospace;">LIVE INTERACTIVE DASHBOARD</span>
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:6px;">${prod.title}</h3>
          </div>
          <div style="font-size:0.78rem; color:#a1a1aa; font-weight:700;">● Real-Time Analytics Active</div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-bottom:22px;">
          <div style="background:#18181b; border:1px solid #27272a; padding:16px; border-radius:12px;">
            <div style="font-size:0.74rem; color:#a1a1aa;">Total Pendapatan Bulan Ini</div>
            <div style="font-size:1.3rem; font-weight:800; color:#fafafa; margin-top:4px; font-family:'JetBrains Mono',monospace;">Rp 48.920.000</div>
            <div style="font-size:0.72rem; color:#a1a1aa; margin-top:4px;">▲ +28.4% vs bulan lalu</div>
          </div>
          <div style="background:#18181b; border:1px solid #27272a; padding:16px; border-radius:12px;">
            <div style="font-size:0.74rem; color:#a1a1aa;">Pesanan Lunas (QRIS/VA)</div>
            <div style="font-size:1.3rem; font-weight:800; color:#fafafa; margin-top:4px; font-family:'JetBrains Mono',monospace;">342 Order</div>
            <div style="font-size:0.72rem; color:#a1a1aa; margin-top:4px;">Konversi Checkout 94.2%</div>
          </div>
          <div style="background:#18181b; border:1px solid #27272a; padding:16px; border-radius:12px;">
            <div style="font-size:0.74rem; color:#a1a1aa;">Pelanggan Aktif</div>
            <div style="font-size:1.3rem; font-weight:800; color:#fafafa; margin-top:4px; font-family:'JetBrains Mono',monospace;">1,284 User</div>
            <div style="font-size:0.72rem; color:#a1a1aa; margin-top:4px;">Lisensi Termasuk Source Code</div>
          </div>
        </div>

        <div style="background:#18181b; border:1px solid #27272a; border-radius:12px; padding:18px;">
          <div style="font-weight:700; font-size:0.86rem; margin-bottom:12px;">Transaksi Otomatis Terbaru</div>
          <div style="display:grid; gap:8px; font-size:0.8rem; font-family:'JetBrains Mono',monospace;">
            <div style="display:flex; justify-content:space-between; padding:10px 12px; background:#09090b; border:1px solid #27272a; border-radius:8px;">
              <span>#ORD-9921 • Pembayaran QRIS Otomatis</span>
              <span style="color:#fafafa; font-weight:700;">LUNAS • Rp 169.000</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:10px 12px; background:#09090b; border:1px solid #27272a; border-radius:8px;">
              <span>#ORD-9920 • Virtual Account BCA</span>
              <span style="color:#fafafa; font-weight:700;">LUNAS • Rp 149.000</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:10px 12px; background:#09090b; border:1px solid #27272a; border-radius:8px;">
              <span>#ORD-9919 • E-Wallet GoPay</span>
              <span style="color:#fafafa; font-weight:700;">LUNAS • Rp 249.000</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'bot') {
    return `
      <div style="font-family:'JetBrains Mono',monospace; background:#09090b; min-height:540px; color:#e4e4e7; padding:24px;">
        <div style="background:#18181b; border:1px solid #27272a; border-radius:12px; padding:18px;">
          <div style="color:#ffffff; font-weight:700; margin-bottom:12px;">$ python main_automation_bot.py --mode=production</div>
          <div style="font-size:0.8rem; line-height:1.75; color:#a1a1aa;">
            <div>[09:00:01] Initializing <strong style="color:#fff;">${prod.title}</strong>...</div>
            <div>[09:00:02] ✓ Loaded config.json &amp; multi-thread worker pool (8 threads)</div>
            <div>[09:00:03] ✓ Fetching target data &amp; running automation pipeline...</div>
            <div style="color:#fafafa;">[09:00:04] → Processed 250 records → Exported to /output/laporan_otomatis.xlsx</div>
            <div style="color:#ffffff;">[09:00:05] ✓ Telegram Webhook Notification Sent: "Laporan Harian Selesai (250 Baris)"</div>
            <div style="margin-top:16px; padding:12px; background:#09090b; border:1px solid #3f3f46; border-radius:8px; color:#fafafa;">
              ✓ Full Source Code Python (.py) + Requirements.txt + Panduan Instalasi disertakan di dalam paket download.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div style="font-family:'Plus Jakarta Sans',sans-serif; background:#09090b; min-height:540px; color:#fff; padding:36px 24px; text-align:center;">
      <span style="background:#27272a; color:#fafafa; padding:6px 14px; border-radius:99px; font-size:0.74rem; font-weight:800; font-family:'JetBrains Mono',monospace;">LIGHTHOUSE SCORE 99/100 • SAAS UI TEMPLATE</span>
      <h2 style="font-size:1.95rem; font-weight:800; max-width:640px; margin:16px auto 12px; line-height:1.2;">${prod.title}</h2>
      <p style="color:#a1a1aa; max-width:540px; margin:0 auto 24px; font-size:0.92rem;">${prod.summary}</p>
      <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-bottom:32px;">
        <span style="background:#ffffff; color:#09090b; padding:10px 20px; border-radius:8px; font-weight:800; font-size:0.84rem;">Responsive Desktop, Tablet &amp; Mobile</span>
        <span style="background:#18181b; border:1px solid #27272a; padding:10px 20px; border-radius:8px; font-weight:700; font-size:0.84rem;">Clean HTML5 + Tailwind CSS</span>
      </div>
      <div style="max-width:760px; margin:0 auto; border-radius:14px; overflow:hidden; border:1px solid #27272a;">
        <img src="${prod.thumbnailUrl}" alt="${prod.title}" style="width:100%; max-height:320px; object-fit:cover; display:block; filter:grayscale(100%);" />
      </div>
    </div>
  `;
}

function bindPosSimulatorEvents() {
  let currentTotal = 42000;
  const listEl = document.getElementById('posReceiptList');
  const totalEl = document.getElementById('posTotalVal');
  const resetBtn = document.getElementById('posResetBtn');
  const printBtn = document.getElementById('posPrintBtn');

  document.querySelectorAll('.pos-sim-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price') || '0', 10);
      currentTotal += price;
      if (listEl) {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f4f4f5;';
        row.innerHTML = `<span>1x ${name}</span><strong>${formatRupiah(price)}</strong>`;
        listEl.appendChild(row);
        listEl.scrollTop = listEl.scrollHeight;
      }
      if (totalEl) totalEl.textContent = formatRupiah(currentTotal);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentTotal = 0;
      if (listEl) listEl.innerHTML = '<div style="color:#71717a; padding:12px 0; text-align:center;">Klik item di sebelah kiri untuk simulasi transaksi kasir.</div>';
      if (totalEl) totalEl.textContent = 'Rp 0';
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      printBtn.textContent = '✓ Struk Tercetak! Silakan Beli Source Code Ini';
    });
  }
}

// ================= 4. PRODUCT DETAIL & FILE INSPECTOR MODAL =================
window.openDetailById = function (productId) {
  const prod = productsState.find((p) => p.id === productId);
  if (!prod) return;

  const modal = document.getElementById('detailModal');
  const titleEl = document.getElementById('detailModalTitle');
  const bodyEl = document.getElementById('detailModalBody');

  if (titleEl) titleEl.textContent = prod.title;
  if (bodyEl) {
    const disc = getDiscountPercent(prod.price, prod.oldPrice);
    bodyEl.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:22px; align-items:start;">
        <div>
          <div style="border-radius:12px; overflow:hidden; border:1px solid var(--border-color); margin-bottom:16px;">
            <img src="${prod.thumbnailUrl}" alt="${prod.title}" style="width:100%; height:230px; object-fit:cover; display:block; filter:grayscale(100%);" />
          </div>
          <div style="background:#09090b; border:1px solid #27272a; border-radius:12px; padding:14px; color:#fafafa;">
            <div style="font-size:0.74rem; font-weight:800; color:#a1a1aa; margin-bottom:8px; font-family:var(--font-mono);">ISI PAKET UNDUHAN (.ZIP):</div>
            <ul class="zip-tree">
              <li class="zip-row"><span>/full-source-code/ (${prod.stack})</span><span class="zip-badge">Unlocked</span></li>
              <li class="zip-row"><span>/database/schema_sample.sql</span><span class="zip-badge">Ready</span></li>
              <li class="zip-row"><span>PANDUAN_INSTALASI.pdf</span><span class="zip-badge">Bahasa ID</span></li>
            </ul>
          </div>
        </div>

        <div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
            ${prod.categories.map((c) => `<span class="brand-badge">${c}</span>`).join('')}
            <span class="verified-pill">${prod.version}</span>
          </div>

          <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:16px; line-height:1.65;">
            ${prod.summary}
          </p>

          <div style="margin-bottom:18px;">
            <div style="font-size:0.82rem; font-weight:800; margin-bottom:8px;">Fitur Unggulan yang Anda Dapatkan:</div>
            <ul style="list-style:none; display:grid; gap:7px; font-size:0.84rem; color:var(--text-secondary);">
              ${prod.features.map((f) => `<li>✓ ${f}</li>`).join('')}
            </ul>
          </div>

          <div style="background:var(--bg-elevated); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
              <div>
                <div style="font-size:0.74rem; color:var(--text-muted);">Harga Lisensi &amp; Source Code:</div>
                <div style="display:flex; align-items:baseline; gap:8px;">
                  <span class="price-current" style="font-size:1.5rem;">${prod.price}</span>
                  ${prod.oldPrice ? `<span class="price-old">${prod.oldPrice}</span>` : ''}
                </div>
              </div>
              ${disc > 0 ? `<span class="discount-pill" style="position:static;">HEMAT ${disc}%</span>` : ''}
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <button type="button" class="btn btn-ghost" onclick="closeModal('detailModal'); openLiveDemoById('${prod.id}')">
                Live Demo
              </button>
              <button type="button" class="btn btn-primary" onclick="closeModal('detailModal'); openInstantCheckoutById('${prod.id}')">
                Beli &amp; Download
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (modal) modal.classList.add('open');
};

// ================= 5. SHOPPING CART & AUTOMATIC BUNDLE DISCOUNT =================
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_CART_KEY);
    if (raw) cartState = JSON.parse(raw) || [];
  } catch (e) {
    cartState = [];
  }
  updateCartUI();
}

function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartState));
  } catch (e) {}
  updateCartUI();
  renderProductsGrid();
}

window.toggleCartItemById = function (productId) {
  const prod = productsState.find((p) => p.id === productId);
  if (!prod) return;

  const existingIdx = cartState.findIndex((c) => c.id === productId);
  if (existingIdx >= 0) {
    cartState.splice(existingIdx, 1);
    showToast('Produk dihapus dari keranjang.');
  } else {
    cartState.push({
      id: prod.id,
      title: prod.title,
      titleEn: prod.titleEn || prod.title,
      price: prod.price,
      priceNum: parsePriceNum(prod.price),
      priceUsdNum: parseUsdPriceNum(prod.priceUsd) || idrToCleanUsdNum(parsePriceNum(prod.price)),
      stack: prod.stack,
      paymentUrl: prod.paymentUrl,
      usdPaymentUrl: prod.usdPaymentUrl || '#checkout-usd'
    });
    showToast(currentLocale === 'en' ? 'Added to cart!' : 'Ditambahkan ke keranjang!');
    openCartDrawer();
  }
  saveCartToStorage();
};

window.removeCartItemById = function (productId) {
  cartState = cartState.filter((c) => c.id !== productId);
  showToast('Item dihapus dari keranjang.');
  saveCartToStorage();
};

function addAllBundleToCart() {
  cartState = [
    {
      id: 'vip-bundle-all',
      title: 'VIP All-Access Developer Pass (Seluruh 24 Source Code & Template Lengkap)',
      titleEn: 'VIP All-Access Developer Bundle (All 24 Apps, Templates & Source Codes)',
      price: SITE_CONFIG.bundlePrice,
      priceNum: SITE_CONFIG.bundlePriceNum,
      priceUsdNum: SITE_CONFIG.bundlePriceUsdNum || 49,
      stack: 'All-In-One Pack (Hemat 80%)',
      paymentUrl: SITE_CONFIG.mayarBundleUrl || '#checkout-mayar',
      usdPaymentUrl: SITE_CONFIG.usdStoreUrl || '#checkout-usd'
    }
  ];
  saveCartToStorage();
  showToast(currentLocale === 'en' ? 'VIP All-Access Bundle added!' : 'Paket VIP All-Access masuk ke keranjang!');
  openCartDrawer();
}

function updateCartUI() {
  const badge = document.getElementById('cartCountBadge');
  const listEl = document.getElementById('cartItemsContainer');
  const hintEl = document.getElementById('cartBundleHint');
  const totalEl = document.getElementById('cartTotalPrice');

  if (badge) badge.textContent = String(cartState.length);
  if (!listEl) return;

  if (cartState.length === 0) {
    listEl.innerHTML = currentLocale === 'en'
      ? `
      <div style="text-align:center; padding:48px 16px; color:var(--text-secondary);">
        <div style="font-weight:800; font-size:0.95rem; margin-bottom:4px; color:var(--text-primary);">Your Cart is Empty</div>
        <p style="font-size:0.8rem;">Add at least 2 products to unlock an automatic <strong>20% Bundle Discount</strong>.</p>
      </div>
    `
      : `
      <div style="text-align:center; padding:48px 16px; color:var(--text-secondary);">
        <div style="font-weight:800; font-size:0.95rem; margin-bottom:4px; color:var(--text-primary);">Keranjang Anda Masih Kosong</div>
        <p style="font-size:0.8rem;">Pilih minimal 2 source code untuk mendapatkan <strong>Diskon Bundling 20% Otomatis</strong>.</p>
      </div>
    `;
    if (hintEl) hintEl.textContent = '';
    if (totalEl) totalEl.textContent = currentLocale === 'en' ? '$0' : 'Rp 0';
    return;
  }

  const isEn = currentLocale === 'en';
  listEl.innerHTML = cartState
    .map(
      (item) => {
        const unitUsd = item.priceUsdNum || idrToCleanUsdNum(item.priceNum);
        const dispTitle = (isEn && item.titleEn) ? item.titleEn : item.title;
        const dispPrice = isEn ? formatUsd(unitUsd) : item.price;
        return `
      <div class="cart-item">
        <div>
          <div class="cart-item-title">${dispTitle}</div>
          <div style="font-size:0.74rem; color:var(--text-muted); margin-bottom:4px;">${item.stack}</div>
          <div class="cart-item-price">${dispPrice}</div>
        </div>
        <button type="button" class="close-x" onclick="removeCartItemById('${item.id}')" title="${isEn ? 'Remove' : 'Hapus'}">×</button>
      </div>
    `;
      }
    )
    .join('');

  const rawTotal = cartState.reduce((acc, item) => acc + (isEn ? (item.priceUsdNum || idrToCleanUsdNum(item.priceNum)) : (item.priceNum || 0)), 0);
  const hasBundleDiscount = cartState.length >= 2 && !cartState.some((i) => i.id === 'vip-bundle-all');
  const finalTotal = hasBundleDiscount ? (isEn ? Math.round(rawTotal * 0.8 * 100) / 100 : Math.round(rawTotal * 0.8)) : rawTotal;
  const fmtTotal = isEn ? formatUsd : formatRupiah;

  if (hintEl) {
    if (hasBundleDiscount) {
      hintEl.textContent = isEn
        ? `✓ 20% Bundle Discount Active (Save ${fmtTotal(rawTotal - finalTotal)})`
        : `✓ Diskon Bundling 20% Aktif (Hemat ${fmtTotal(rawTotal - finalTotal)})`;
    } else if (cartState.some((i) => i.id === 'vip-bundle-all')) {
      hintEl.textContent = isEn
        ? '✓ VIP All-Access Bundle Active (Save $200+ off individual prices)'
        : '✓ Paket VIP All-Access Aktif (Hemat Rp 455.000 dari harga satuan)';
    } else {
      hintEl.textContent = isEn
        ? 'Tip: Add 1 more product to unlock an automatic 20% bundle discount.'
        : 'Tips: Tambah 1 produk lagi untuk ekstra diskon bundling 20% otomatis.';
    }
  }

  if (totalEl) totalEl.textContent = fmtTotal(finalTotal);
}

function openCartDrawer() {
  const backdrop = document.getElementById('cartBackdrop');
  if (backdrop) backdrop.classList.add('open');
}

// ================= 6. INSTANT CHECKOUT MODAL & MONOCHROME QRIS GATEWAY =================
window.openInstantCheckoutById = function (productId) {
  const prod = productsState.find((p) => p.id === productId);
  if (!prod) return;
  const disp = getProdDisplay(prod);
  launchCheckoutGateway({
    title: disp.title,
    price: disp.price,
    paymentUrl: disp.isEn ? (prod.usdPaymentUrl || SITE_CONFIG.usdStoreUrl || '#checkout-usd') : prod.paymentUrl,
    stack: prod.stack,
    isUsd: disp.isEn
  });
};

function buildOrderMailtoUrl(title, price, details) {
  const email = SITE_CONFIG.orderEmail;
  const subject = `Order ${title} (${price})`;
  const body =
    `Halo Admin ${SITE_CONFIG.brandName},\n\n` +
    `Saya ingin membeli:\n` +
    `- Produk: ${title}\n` +
    (details ? `- Rincian: ${details}\n` : '') +
    `- Total Harga: ${price}\n\n` +
    `Mohon info nomor rekening / QRIS untuk pembayaran. Terima kasih.`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildGmailComposeUrl(mailtoUrl) {
  const raw = String(mailtoUrl || '');
  const withoutScheme = raw.replace(/^mailto:/i, '');
  const qIdx = withoutScheme.indexOf('?');
  const email = qIdx >= 0 ? withoutScheme.slice(0, qIdx) : withoutScheme;
  const params = new URLSearchParams(qIdx >= 0 ? withoutScheme.slice(qIdx + 1) : '');
  const subject = params.get('subject') || `Order ${SITE_CONFIG.brandName}`;
  const body = params.get('body') || '';
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function launchCheckoutGateway(order) {
  const modal = document.getElementById('checkoutModal');
  const titleEl = document.getElementById('checkoutModalTitle');
  const priceEl = document.getElementById('checkoutModalPrice');
  const iframe = document.getElementById('checkoutIframe');
  const extLink = document.getElementById('checkoutExternalLink');

  const isUsdMode = Boolean(order.isUsd || currentLocale === 'en');
  if (titleEl) titleEl.textContent = (isUsdMode ? 'Order: ' : 'Pemesanan: ') + order.title;
  if (priceEl) priceEl.textContent = isUsdMode && !String(order.price).includes('USD') ? `${order.price} USD` : order.price;

  const isPlaceholder = !order.paymentUrl || order.paymentUrl.startsWith('#') || order.paymentUrl.includes('example.com');
  const isHttpPayLink = Boolean(order.paymentUrl && order.paymentUrl.startsWith('http') && !isPlaceholder);

  if (isUsdMode && !isHttpPayLink) {
    const subj = `International Order (${order.price} USD): ${order.title}`;
    const body = `Hello ${SITE_CONFIG.brandName},\n\nI would like to purchase:\n- Product: ${order.title}\n- Total: ${order.price} USD\n\nPlease send a Visa/Mastercard/PayPal payment link so I can receive the .ZIP download. Thank you.`;
    const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SITE_CONFIG.orderEmail)}&su=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    const mailHref = `mailto:${SITE_CONFIG.orderEmail}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    if (extLink) {
      extLink.href = gmailHref;
      extLink.textContent = 'Request USD Payment Link via Gmail ↗';
    }
    if (iframe) {
      iframe.removeAttribute('src');
      iframe.srcdoc = buildGlobalUsdCheckoutHTML({ ...order, gmailHref, mailHref });
    }
    if (modal) modal.classList.add('open');
    return;
  }

  const forceEmailMode = SITE_CONFIG.paymentMode === 'email' && !isHttpPayLink;
  const effectiveUrl =
    forceEmailMode
      ? (order.paymentUrl && order.paymentUrl.startsWith('mailto:')
          ? order.paymentUrl
          : buildOrderMailtoUrl(order.title, order.price, order.stack))
      : order.paymentUrl;

  const isMailto = effectiveUrl.startsWith('mailto:');
  if (extLink) {
    extLink.href = isMailto ? buildGmailComposeUrl(effectiveUrl) : (isHttpPayLink ? effectiveUrl : 'https://asetkode.blogspot.com/');
    extLink.textContent = isMailto ? 'Buka di Gmail Web ↗' : (isHttpPayLink ? 'Buka Halaman Pembayaran Penuh ↗' : 'Buka Checkout Mayar di Blogger ↗');
  }

  if (iframe) {
    if (isMailto) {
      iframe.removeAttribute('src');
      iframe.srcdoc = buildEmailOrderHTML({ ...order, paymentUrl: effectiveUrl });
    } else if (isPlaceholder) {
      iframe.removeAttribute('src');
      iframe.srcdoc = buildBuiltInPaymentGatewayHTML(order);
    } else {
      iframe.removeAttribute('srcdoc');
      iframe.src = effectiveUrl;
    }
  }

  if (modal) modal.classList.add('open');
}

function buildGlobalUsdCheckoutHTML(order) {
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <style>*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}body{margin:0;padding:24px;background:#f8fafc;color:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;}.card{width:100%;max-width:480px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;box-shadow:0 12px 30px rgba(15,23,42,.06);}.badge{display:inline-block;background:#eef2ff;color:#4338ca;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;margin-bottom:10px;}h2{margin:0 0 6px;font-size:19px;}.price{font-size:24px;font-weight:800;color:#059669;margin-bottom:12px;}.pills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}.pill{font-size:12px;font-weight:700;padding:4px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#f8fafc;color:#334155;}.btn{display:block;text-align:center;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700;font-size:14px;margin-bottom:10px;}.btn-primary{background:linear-gradient(135deg,#4f46e5,#2563eb);color:#fff;}.btn-sec{background:#fff;color:#0f172a;border:1px solid #cbd5e1;}.note{font-size:12px;color:#64748b;line-height:1.5;background:#f1f5f9;padding:12px;border-radius:10px;}</style></head>
  <body><div class="card"><span class="badge">GLOBAL USD CHECKOUT</span><h2>${esc(order.title)}</h2><div class="price">${esc(order.price)} USD</div><div class="pills"><span class="pill">Visa / Mastercard</span><span class="pill">Apple Pay</span><span class="pill">PayPal</span><span class="pill">Polar.sh</span></div><a class="btn btn-primary" href="${esc(order.gmailHref)}" target="_blank" rel="noopener">Request Instant USD Checkout Link (Gmail) ↗</a><a class="btn btn-sec" href="${esc(order.mailHref)}">Open Default Email Client</a><div class="note">Includes full open-source <code>.ZIP</code> bundle, documentation guide, and commercial project license delivered to your inbox.</div></div></body></html>`;
}

function buildEmailOrderHTML(order) {
  const raw = String(order.paymentUrl || '');
  const withoutScheme = raw.replace(/^mailto:/i, '');
  const qIdx = withoutScheme.indexOf('?');
  const email = qIdx >= 0 ? withoutScheme.slice(0, qIdx) : withoutScheme;
  const params = new URLSearchParams(qIdx >= 0 ? withoutScheme.slice(qIdx + 1) : '');
  const subject = params.get('subject') || `Order ${order.title}`;
  const body = params.get('body') || `Halo Admin, saya ingin membeli ${order.title} (${order.price}).`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}
  body{margin:0;padding:24px;background:#f8fafc;color:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;}
  .card{width:100%;max-width:480px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;box-shadow:0 12px 30px rgba(15,23,42,.06);}
  .badge{display:inline-block;background:#dbeafe;color:#1d4ed8;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;margin-bottom:10px;}
  h2{margin:0 0 6px;font-size:19px;}
  .price{font-size:22px;font-weight:800;color:#2563eb;margin-bottom:14px;}
  .box{background:#f1f5f9;border-radius:10px;padding:12px 14px;font-size:13px;line-height:1.5;margin-bottom:16px;}
  .email-row{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;border:1px solid #cbd5e1;border-radius:8px;padding:8px 10px;margin-top:8px;font-weight:700;}
  .copy-btn{border:none;background:#0f172a;color:#fff;border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;font-weight:600;}
  .actions{display:flex;flex-direction:column;gap:10px;}
  .btn{display:block;text-align:center;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700;font-size:14px;}
  .btn-gmail{background:#ea4335;color:#fff;}
  .btn-mail{background:#2563eb;color:#fff;}
  .note{margin-top:12px;font-size:12px;color:#64748b;text-align:center;}
</style></head>
<body>
  <div class="card">
    <span class="badge">Order Resmi via Email</span>
    <h2>${esc(order.title)}</h2>
    <div class="price">${esc(order.price)}</div>
    <div class="box">
      <div>Kirim email pemesanan ke admin untuk mendapatkan detail pembayaran (Transfer / QRIS) dan file produk ZIP dikirim langsung ke email Anda.</div>
      <div class="email-row">
        <span id="admEmail">${esc(email)}</span>
        <button class="copy-btn" type="button" onclick="navigator.clipboard&&navigator.clipboard.writeText('${esc(email)}');this.textContent='Tersalin!';setTimeout(()=>this.textContent='Salin',1800)">Salin</button>
      </div>
    </div>
    <div class="actions">
      <a class="btn btn-gmail" href="${esc(gmailUrl)}" target="_blank" rel="noopener">Kirim via Gmail Web</a>
      <a class="btn btn-mail" href="${esc(raw)}">Buka Aplikasi Email (Mailto)</a>
    </div>
    <div class="note">Format pesan &amp; subjek order sudah terisi otomatis.</div>
  </div>
</body></html>`;
}

function buildBuiltInPaymentGatewayHTML(order) {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: #fafafa; color: #09090b; padding: 22px; }
        .card { max-width: 540px; margin: 0 auto; background: #fff; border: 1px solid #e4e4e7; border-radius: 14px; padding: 22px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
        .badge { display: inline-block; background: #09090b; color: #ffffff; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 99px; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; }
        .title { font-size: 16px; font-weight: 800; margin-bottom: 4px; }
        .price { font-size: 22px; font-weight: 800; color: #09090b; margin-bottom: 16px; font-family: 'JetBrains Mono', monospace; }
        label { display: block; font-size: 12px; font-weight: 700; color: #52525b; margin-bottom: 6px; }
        input { width: 100%; padding: 11px 14px; border: 1px solid #d4d4d8; border-radius: 8px; font-size: 14px; margin-bottom: 14px; outline: none; }
        input:focus { border-color: #09090b; }
        .methods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
        .method { border: 1.5px solid #e4e4e7; border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; font-size: 12px; font-weight: 700; color: #52525b; }
        .method.active { border-color: #09090b; background: #09090b; color: #ffffff; }
        .btn { width: 100%; background: #09090b; color: #fff; border: none; padding: 13px; border-radius: 8px; font-size: 14px; font-weight: 800; cursor: pointer; }
        .btn:hover { opacity: 0.9; }
        .success-box { display: none; margin-top: 16px; background: #f4f4f5; border: 1px solid #09090b; border-radius: 10px; padding: 16px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">GATEWAY PEMBAYARAN OTOMATIS 24/7</span>
        <div class="title">${order.title}</div>
        <div class="price">${order.price}</div>

        <label>Email Penerima File Source Code (.ZIP):</label>
        <input type="email" id="buyerEmail" placeholder="nama@email.com (Link download dikirim otomatis ke sini)" required />

        <label>Pilih Metode Pembayaran Instan:</label>
        <div class="methods">
          <div class="method active" onclick="selectM(this)">QRIS Instan</div>
          <div class="method" onclick="selectM(this)">Virtual Account</div>
          <div class="method" onclick="selectM(this)">GoPay / DANA</div>
        </div>

        <button type="button" class="btn" onclick="simulatePay()">Buat Kode QRIS &amp; Unduh Source Code</button>

        <div class="success-box" id="simSuccess">
          <div style="font-size:14px; font-weight:800; color:#09090b; margin-bottom:6px;">✓ Kode Pembayaran Siap</div>
          <p style="font-size:12.5px; color:#52525b; line-height:1.5;">
            Begitu Anda menempel link produk <strong>Mayar.id</strong> pada atribut <code>data-payment-url</code> di Bot Auto-Post, jendela ini otomatis menampilkan QRIS / Virtual Account asli dan mengirimkan file <code>.ZIP</code> ke email pembeli detik itu juga.
          </p>
        </div>
      </div>
      <script>
        function selectM(el) {
          document.querySelectorAll('.method').forEach(m => m.classList.remove('active'));
          el.classList.add('active');
        }
        function simulatePay() {
          document.getElementById('simSuccess').style.display = 'block';
        }
      </script>
    </body>
    </html>
  `;
}

// ================= 7. HERO ROI CALCULATOR & STUDIO TABS =================
const ROI_DATA = {
  pos: {
    customCost: 'Rp 4.500.000',
    customTime: 'Waktu: 28 Hari Kerja',
    asetPrice: 'Rp 69.000',
    savingsText: 'Anda Hemat Rp 4.431.000 (98%) & 28 Hari Coding!'
  },
  ecom: {
    customCost: 'Rp 5.800.000',
    customTime: 'Waktu: 35 Hari Kerja',
    asetPrice: 'Rp 169.000',
    savingsText: 'Anda Hemat Rp 5.631.000 (97%) & 35 Hari Coding!'
  },
  saas: {
    customCost: 'Rp 2.200.000',
    customTime: 'Waktu: 14 Hari Kerja',
    asetPrice: 'Rp 79.000',
    savingsText: 'Anda Hemat Rp 2.121.000 (96%) & 14 Hari Coding!'
  },
  bot: {
    customCost: 'Rp 3.000.000',
    customTime: 'Waktu: 18 Hari Kerja',
    asetPrice: 'Rp 99.000',
    savingsText: 'Anda Hemat Rp 2.901.000 (96%) & 18 Hari Coding!'
  }
};

function initHeroStudioAndROI() {
  document.querySelectorAll('.studio-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      document.querySelectorAll('.studio-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.studio-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  const roiSelect = document.getElementById('roiProjectSelect');
  if (roiSelect) {
    roiSelect.addEventListener('change', () => {
      const info = ROI_DATA[roiSelect.value] || ROI_DATA.pos;
      document.getElementById('roiCustomCost').textContent = info.customCost;
      document.getElementById('roiCustomTime').textContent = info.customTime;
      document.getElementById('roiAsetPrice').textContent = info.asetPrice;
      document.getElementById('roiSavingsText').textContent = info.savingsText;
    });
  }
}

// ================= 8. MODAL, THEME & TOOLBAR EVENTS =================
window.closeModal = function (id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
  if (id === 'checkoutModal') {
    const iframe = document.getElementById('checkoutIframe');
    if (iframe) {
      iframe.src = 'about:blank';
      iframe.removeAttribute('srcdoc');
    }
  }
};

function initThemeToggle() {
  const saved = localStorage.getItem(STORAGE_THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.setAttribute('title', saved === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap');

  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_THEME_KEY, next);
      btn.setAttribute('title', next === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap');
    });
  }
}

function showToast(message) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = 'toast-item';
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.2s ease';
    setTimeout(() => el.remove(), 220);
  }, 2400);
}

function applySiteBranding() {
  document.querySelectorAll('[data-brand-name]').forEach((el) => {
    el.textContent = SITE_CONFIG.brandName;
  });
  document.querySelectorAll('[data-brand-badge]').forEach((el) => {
    el.textContent = SITE_CONFIG.brandBadge;
  });
  document.querySelectorAll('[data-order-email]').forEach((el) => {
    el.textContent = SITE_CONFIG.orderEmail;
  });
  document.querySelectorAll('[data-order-mailto]').forEach((el) => {
    el.setAttribute('href', `mailto:${SITE_CONFIG.orderEmail}`);
  });
  document.querySelectorAll('[data-blogger-link]').forEach((el) => {
    el.setAttribute('href', SITE_CONFIG.bloggerOrigin + '/');
  });
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function initFaqAccordion() {
  document.querySelectorAll('#faqList .faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('#faqList .faq-item').forEach((el) => el.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

window.openLegalModal = function (type) {
  const modal = document.getElementById('detailModal');
  const titleEl = document.getElementById('detailModalTitle');
  const bodyEl = document.getElementById('detailModalBody');
  if (!modal || !titleEl || !bodyEl) return;

  const docs = {
    about: {
      title: `Tentang ${SITE_CONFIG.brandName}`,
      html: `
        <h3 style="margin-bottom:10px;">Solusi Produk Digital &amp; Source Code Siap Pakai</h3>
        <p style="margin-bottom:12px;color:var(--text-secondary);"><strong>${SITE_CONFIG.brandName}</strong> menyediakan berbagai aplikasi web, program bisnis (Kasir POS &amp; Antrian), serta template desain web modern yang siap pakai untuk UMKM, freelancer, dan developer.</p>
        <p style="margin-bottom:12px;color:var(--text-secondary);">Setiap produk yang tampil di katalog kami telah melalui uji coba dan dilengkapi <strong>Interactive Live Demo</strong> sehingga Anda dapat melihat kualitasnya sebelum membeli.</p>
        <p style="color:var(--text-secondary);">Kontak resmi &amp; dukungan pelanggan: <strong>${SITE_CONFIG.orderEmail}</strong></p>
      `
    },
    terms: {
      title: 'Syarat, Ketentuan & Lisensi Produk',
      html: `
        <h3 style="margin-bottom:10px;">Ketentuan Lisensi Personal &amp; Komersial</h3>
        <ul style="padding-left:18px;display:flex;flex-direction:column;gap:8px;color:var(--text-secondary);">
          <li>Pembeli mendapatkan <strong>100% Full Source Code terbuka</strong> tanpa enkripsi beserta panduan penggunaan.</li>
          <li>Anda bebas menggunakan dan memodifikasi source code untuk kebutuhan pribadi, bisnis sendiri, maupun proyek klien komersial.</li>
          <li><strong>Dilarang</strong> menjual ulang, membagikan gratis secara publik, atau mendistribusikan file mentah produk ini sebagai produk template/source code saingan.</li>
          <li>Pembayaran bersifat 1 kali bayar (tanpa biaya langganan bulanan).</li>
        </ul>
      `
    },
    refund: {
      title: 'Kebijakan Pengembalian Dana (Refund) & Bantuan',
      html: `
        <h3 style="margin-bottom:10px;">Kebijakan Produk Digital</h3>
        <ul style="padding-left:18px;display:flex;flex-direction:column;gap:8px;color:var(--text-secondary);">
          <li>Karena produk berupa file digital (source code <code>.ZIP</code>) yang tidak dapat ditarik kembali setelah dikirim, pembelian yang sudah dikirim bersifat final (non-refundable).</li>
          <li>Silakan uji coba <strong>Live Demo</strong> terlebih dahulu sebelum melakukan pemesanan agar yakin sesuai kebutuhan Anda.</li>
          <li><strong>Garansi File &amp; Dukungan:</strong> Jika file <code>.ZIP</code> rusak/korup atau terdapat kendala saat instalasi awal mengikuti panduan, tim kami akan mengirimkan ulang file dan membantu via email <strong>${SITE_CONFIG.orderEmail}</strong>.</li>
        </ul>
      `
    }
  };

  const doc = docs[type] || docs.about;
  titleEl.textContent = doc.title;
  bodyEl.innerHTML = `<div style="font-size:0.92rem;line-height:1.7;">${doc.html}</div>`;
  modal.classList.add('open');
};

function applyStorefrontLocaleUI() {
  const isEn = currentLocale === 'en';
  document.documentElement.lang = isEn ? 'en' : 'id';
  const flagEl = document.getElementById('langCurrencyFlag');
  const lblEl = document.getElementById('langCurrencyLabel');
  if (flagEl) flagEl.textContent = isEn ? '🇺🇸' : '🇮🇩';
  if (lblEl) lblEl.textContent = isEn ? 'USD' : 'IDR';

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = isEn ? 'Search POS apps, Blogger XML themes, PHP, Python...' : 'Cari aplikasi kasir, laravel, python, landing page...';

  const navLinks = document.querySelectorAll('.nav-menu a');
  if (navLinks[0]) navLinks[0].textContent = isEn ? 'Catalog' : 'Katalog';
  if (navLinks[1]) navLinks[1].textContent = isEn ? 'Bundle' : 'Bundling';
  if (navLinks[2]) navLinks[2].textContent = isEn ? 'How to Buy' : 'Cara Order';

  const cartSpan = document.querySelector('#openCartBtn span:not(.cart-count-pill)');
  if (cartSpan) cartSpan.textContent = isEn ? 'Cart' : 'Keranjang';

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    if (!heroTitle.dataset.idHtml) heroTitle.dataset.idHtml = heroTitle.innerHTML;
    heroTitle.innerHTML = isEn
      ? 'Launch Projects &amp; Businesses 10x Faster with <span class="gradient-text">Production Code</span>'
      : heroTitle.dataset.idHtml;
  }
  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) {
    if (!heroDesc.dataset.idHtml) heroDesc.dataset.idHtml = heroDesc.innerHTML;
    heroDesc.innerHTML = isEn
      ? 'Explore ready-to-launch web apps, Python automation scripts, Blogger XML themes &amp; modern UI kits. Test the <strong>Interactive Live Demo</strong> right in your browser before purchasing, and get the complete open-source <code>.ZIP</code> package.'
      : heroDesc.dataset.idHtml;
  }
  const heroCtas = document.querySelectorAll('.hero-cta-row a');
  if (heroCtas[0]) heroCtas[0].textContent = isEn ? 'Explore Catalog & Live Demo →' : 'Eksplor Katalog & Live Demo →';
  if (heroCtas[1]) heroCtas[1].textContent = isEn ? 'All-In-One Pack ($49 USD • Save 80%)' : 'All-In-One Pack (Hemat 65%)';

  const bundlePriceEl = document.querySelector('#bundleDeal .bundle-price, [data-bundle-price]');
  if (bundlePriceEl) bundlePriceEl.textContent = isEn ? SITE_CONFIG.bundlePriceUsd : SITE_CONFIG.bundlePrice;

  const filterAll = document.querySelector('#filterBar .filter-chip[data-cat="all"]');
  if (filterAll) filterAll.textContent = isEn ? 'All Products' : 'Semua Karya';
  const filterTemplate = document.querySelector('#filterBar .filter-chip[data-cat="Template"]');
  if (filterTemplate) filterTemplate.textContent = isEn ? 'Templates / UI' : 'Template / UI';

  const checkoutCartBtn = document.getElementById('checkoutCartBtn');
  if (checkoutCartBtn) checkoutCartBtn.textContent = isEn ? '⚡ Global Checkout (USD / Card / PayPal)' : '⚡ Checkout Sekarang (Mayar / QRIS)';

  renderProductsGrid();
  updateCartUI();
}

document.addEventListener('DOMContentLoaded', () => {
  applySiteBranding();
  initThemeToggle();
  initHeroStudioAndROI();
  initFaqAccordion();
  loadCartFromStorage();
  applyStorefrontLocaleUI();
  syncFromBloggerCloud();

  const langBtn = document.getElementById('langCurrencyBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLocale = currentLocale === 'id' ? 'en' : 'id';
      try { localStorage.setItem(STORAGE_LOCALE_KEY, currentLocale); } catch (e) {}
      applyStorefrontLocaleUI();
    });
  }

  document.querySelectorAll('#filterBar .filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#filterBar .filter-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-cat') || 'all';
      renderProductsGrid();
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      renderProductsGrid();
    });
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortMode = e.target.value || 'newest';
      renderProductsGrid();
    });
  }

  document.querySelectorAll('.vp-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.vp-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const vp = btn.getAttribute('data-vp') || '100%';
      const stage = document.getElementById('demoViewportStage');
      if (stage) stage.style.width = vp;
    });
  });

  const addBundleBtn = document.getElementById('addBundleBtn');
  if (addBundleBtn) addBundleBtn.addEventListener('click', addAllBundleToCart);

  const openCartBtn = document.getElementById('openCartBtn');
  if (openCartBtn) openCartBtn.addEventListener('click', openCartDrawer);

  const closeCartBtn = document.getElementById('closeCartBtn');
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => closeModal('cartBackdrop'));

  const cartBackdrop = document.getElementById('cartBackdrop');
  if (cartBackdrop) cartBackdrop.addEventListener('click', () => closeModal('cartBackdrop'));

  const checkoutCartBtn = document.getElementById('checkoutCartBtn');
  if (checkoutCartBtn) {
    checkoutCartBtn.addEventListener('click', () => {
      if (!cartState.length) return;
      const isEn = currentLocale === 'en';
      const totalStr = document.getElementById('cartTotalPrice').textContent;
      const titles = cartState.map((c) => {
        const t = isEn ? (c.titleEn || c.title) : c.title;
        const p = isEn ? formatUsd(c.priceUsdNum || idrToCleanUsdNum(c.priceNum)) : c.price;
        return `${t} (${p})`;
      }).join(', ');
      const singleTitle = isEn ? (cartState[0].titleEn || cartState[0].title) : cartState[0].title;
      const orderTitle =
        cartState.length === 1
          ? singleTitle
          : (isEn ? `Bundle (${cartState.length} Products)` : `Paket Bundling (${cartState.length} Produk)`);
      closeModal('cartBackdrop');
      launchCheckoutGateway({
        title: orderTitle,
        price: totalStr,
        paymentUrl: isEn
          ? (cartState.length === 1 ? (cartState[0].usdPaymentUrl || SITE_CONFIG.usdStoreUrl || '#checkout-usd') : (SITE_CONFIG.usdStoreUrl || '#checkout-usd'))
          : (cartState.length === 1 ? cartState[0].paymentUrl : '#checkout-mayar'),
        stack: titles,
        isUsd: isEn
      });
    });
  }

  const closeDemoSimBtn = document.getElementById('closeDemoSimBtn');
  if (closeDemoSimBtn) closeDemoSimBtn.addEventListener('click', () => closeModal('demoSimModal'));

  const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
  if (closeDetailModalBtn) closeDetailModalBtn.addEventListener('click', () => closeModal('detailModal'));

  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => closeModal('checkoutModal'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['demoSimModal', 'detailModal', 'cartBackdrop', 'checkoutModal'].forEach(closeModal);
    }
  });
});

