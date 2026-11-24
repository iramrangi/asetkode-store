/**
 * Ddev Studio Headless Storefront — Pure Monochrome (Hitam Putih) Edition
 * - Auto-syncs products from https://asetkode.blogspot.com/ via JSONP (zero CORS issues)
 * - Built-in Interactive Live Demo Simulator (Desktop / Tablet / Mobile viewports)
 * - Multi-item Shopping Cart with transparent individual unit pricing
 * - Interactive ROI Calculator & Instant QRIS/VA Checkout Simulator
 */

// ================= 0. CENTRALIZED SITE & BRAND CONFIGURATION =================
// Ubah konfigurasi di bawah ini saat ganti nama brand, pasang domain baru, atau aktifkan payment gateway.
const SITE_CONFIG = {
  brandName: 'Ddev Studio',
  brandBadge: 'STORE',
  orderEmail: 'dekamayooo@gmail.com',
  paymentMode: 'mayar', // otomatis membuka link Mayar bila tersedia di data-payment-url, atau fallback email jika masih mailto:
  bloggerOrigin: 'https://asetkode.blogspot.com',
  onlyReadyProducts: true, // true = hanya tampilkan produk yang sudah punya paket .ZIP & demo siap kirim
  readyIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8', 'prod-9', 'prod-10', 'prod-11', 'prod-12', 'prod-13', 'prod-14', 'prod-15', 'prod-16', 'prod-17', 'prod-18', 'prod-19', 'prod-20', 'prod-21', 'prod-22', 'prod-23', 'prod-24', 'prod-25', 'prod-26'],
  usdStoreUrl: 'https://polar.sh/ddev-studio',
  gasWebAppUrl: 'https://script.google.com/macros/s/AKfycbyOP0ljBzNyNmHFR9V3S7nwusTeIHFvpH2iQ0VfZMT8yauk2wJ_vJY5ApIGYwF5Dp_5/exec'
};

const STORAGE_LOCALE_KEY = 'ddev_locale_v1';
const IS_EN_SUBPATH = /^\/en(\/|$)/i.test((typeof window !== 'undefined' && window.location && window.location.pathname) || '');
function normalizeLocalDemoUrl(url) {
  const raw = String(url || '').trim();
  const m = raw.match(/^https?:\/\/(?:[a-z0-9-]+\.)?asetkode-store\.pages\.dev\/(demo\/.*)$/i);
  return m ? m[1] : raw;
}
function resolveStoreAssetUrl(url) {
  const raw = normalizeLocalDemoUrl(url);
  if (!raw || raw.startsWith('#') || raw.startsWith('/') || /^(https?:|data:|mailto:)/i.test(raw)) return raw;
  return (IS_EN_SUBPATH ? '../' : '') + raw;
}
function detectInitialLocale() {
  try {
    const qp = new URLSearchParams(window.location.search).get('lang');
    if (qp === 'en' || qp === 'id') {
      localStorage.setItem(STORAGE_LOCALE_KEY, qp);
      return qp;
    }
    if (IS_EN_SUBPATH) return 'en';
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

const CATEGORY_EN_MAP = {
  'Aplikasi': 'Web App',
  'Aplikasi Web': 'Web App',
  'Source Code': 'Source Code',
  'Web App': 'Web App',
  'JavaScript': 'JavaScript',
  'Template': 'Template',
  'Python': 'Python',
  'PHP': 'PHP',
  'Desain Web': 'UI Design',
  'Program': 'Software',
  'Blogger': 'Blogger XML'
};

function localizeCategoryTag(cat, isEn) {
  if (!isEn) return cat;
  return CATEGORY_EN_MAP[cat] || cat;
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
    features: (isEn && Array.isArray(p.featuresEn) && p.featuresEn.length) ? p.featuresEn : (p.features || []),
    deliverables: (isEn && Array.isArray(p.deliverablesEn) && p.deliverablesEn.length) ? p.deliverablesEn : [],
    price: isEn ? formatUsd(usdNum) : p.price,
    oldPrice: isEn ? (oldUsdNum > usdNum ? formatUsd(oldUsdNum) : '') : (p.oldPrice || ''),
    priceNum: isEn ? usdNum : idrNum,
    usdNum
  };
}

function localizeDemoUrl(url) {
  const raw = resolveStoreAssetUrl(url);
  if (!raw || raw.startsWith('#') || currentLocale !== 'en') return raw;
  if (raw.includes('demo/')) {
    return raw + (raw.includes('?') ? '&' : '?') + 'lang=en';
  }
  return raw;
}

const BLOGGER_ORIGIN = SITE_CONFIG.bloggerOrigin;
const STORAGE_CART_KEY = 'asetkode_pro_cart_v1';
const STORAGE_WISHLIST_KEY = 'asetkode_wishlist_v1';
const STORAGE_THEME_KEY = 'asetkode_bw_theme_v2';

// Built-in fallback catalog (synced with asetkode.blogspot.com)
const FALLBACK_PRODUCTS = [
  {
    "id": "prod-1",
    "title": "Source Code Aplikasi Kasir (POS) & Inventaris Gudang Live Sync Excel (.xlsx)",
    "titleEn": "POS Cashier & Warehouse Inventory Web App (Live Excel .XLSX Sync)",
    "categories": [
      "Aplikasi",
      "Source Code",
      "Web App",
      "JavaScript"
    ],
    "price": "Rp 69.000",
    "oldPrice": "Rp 199.000",
    "priceUsd": "$12",
    "oldPriceUsd": "$29",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_2gqekO0vfdY3DlEeuYcxYmZxo1a52IVLGuZKU29x925",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/kasir/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-aplikasi-kasir-pos.html",
    "version": "v2.4 (Terbaru)",
    "stack": "HTML5 + JavaScript (Zero-Config) + Live Excel (.xlsx) Sync",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/kasir/screenshot.webp",
    "summary": "Aplikasi Point of Sale (Kasir Toko) dan Manajemen Inventaris Gudang modern berbasis web yang berjalan langsung di browser tanpa instalasi server rumit (Zero-Config). Dilengkapi fitur sinkronisasi dua arah otomatis dengan Microsoft Excel (.xlsx), pencarian barcode scanner, cetak struk thermal 58mm & 80mm, multi pembayaran (Tunai, QRIS, Kasbon), serta kartu stok gudang.",
    "summaryEn": "Zero-Config web Point of Sale (POS) and warehouse inventory app with two-way Excel (.xlsx) sync, barcode scanner support, 58mm/80mm thermal receipts, multi-payment modes, and stock ledger.",
    "features": [
      "Zero-Config: Cukup klik 2x Buka_Aplikasi_Kasir.bat, langsung terbuka di browser tanpa install Apache/MySQL.",
      "Live Sync 2-Arah Microsoft Excel (.xlsx): Setiap penjualan & perubahan stok otomatis mengupdate file Excel di komputer.",
      "Mesin Kasir Cepat (POS) + Dukungan Barcode Scanner & Pintasan Tombol Keyboard (F1, F2, F4).",
      "Cetak Struk Thermal (58mm & 80mm) Otomatis (@media print) & Invoice Digital.",
      "Manajemen Stok Gudang, Peringatan Stok Menipis (Low Stock Alert), dan Kartu Mutasi Stok (IN/OUT/Opname).",
      "Multi Metode Pembayaran: Tunai, QRIS, Transfer Bank, dan Pencatatan Kasbon / Piutang Tempo."
    ],
    "featuresEn": [
      "Zero-Config setup: Double-click Buka_Aplikasi_Kasir.bat to launch immediately without Apache or MySQL.",
      "2-Way Live Microsoft Excel (.xlsx) Sync: Every sale and inventory update syncs automatically with your workbook.",
      "Fast POS Cashier with Barcode Scanner support and keyboard shortcuts (F1, F2, F4).",
      "Automated 58mm & 80mm thermal receipt printing (@media print) & digital invoice view.",
      "Warehouse Stock Management, low-stock alerts, and Stock Card Ledger (IN / OUT / Opname).",
      "Multi-payment support: Cash, QRIS/Wallet, Bank Transfer, and customer credit ledger."
    ],
    "deliverablesEn": [
      "100% Unencrypted Full Source Code (HTML5, CSS3, JavaScript).",
      "One-click desktop launcher script + browser offline support.",
      "Ready-to-use Excel (.xlsx) database workbook template.",
      "Full documentation guide & Unlimited Commercial Project License."
    ]
  },
  {
    "id": "prod-2",
    "title": "Template Landing Page UMKM & Cafe Modern Responsive (Order WhatsApp Langsung)",
    "titleEn": "Modern SME & Cafe Responsive Landing Page Template (WhatsApp Order)",
    "categories": [
      "JavaScript",
      "Template",
      "Source Code"
    ],
    "price": "Rp 49.000",
    "oldPrice": "Rp 99.000",
    "priceUsd": "$9",
    "oldPriceUsd": "$19",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_FhJaDpUubFgRr7vCHTzEhCTpLRKrevdsplXUX1O2awR",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/umkm/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-landing-page-umkm-cafe-modern.html",
    "version": "v2.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS (Zero-Config)",
    "license": "Personal & Komersial (Unlimited Project)",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/umkm/screenshot.webp",
    "summary": "Template Landing Page siap pakai untuk kedai kopi, resto, dan usaha UMKM lokal. Dilengkapi integrasi order langsung ke WhatsApp dengan rincian menu otomatis, filter katalog menu, integrasi Google Maps, mode gelap/terang, dan panduan kustomisasi tanpa coding.",
    "summaryEn": "Ready-to-deploy responsive landing page for cafes, restaurants, and local businesses with interactive menu filtering, direct WhatsApp order formatting, dark/light mode, and zero coding customization.",
    "features": [
      "10+ Seksi siap pakai (Hero, Fitur, Harga/Pricing, Testimoni, FAQ, CTA, Footer).",
      "Desain Clean & Modern dengan animasi halus tanpa membebani kecepatan loading.",
      "100% Responsive di layar Desktop, Tablet, dan Smartphone.",
      "Struktur kode HTML5 semantik yang rapi dan mudah diintegrasikan ke framework apa pun.",
      "Sudah dilengkapi optimasi Meta SEO & Schema Markup."
    ],
    "featuresEn": [
      "10+ ready sections (Hero, Interactive Menu Filter, Pricing, Testimonials, Maps, FAQ, Footer).",
      "Clean responsive design with smooth micro-animations and fast loading speed.",
      "100% Mobile-First responsive across Desktop, Tablet, and Smartphone.",
      "Direct WhatsApp & online order formatting with dark/light theme support.",
      "Built-in SEO Meta tags & JSON-LD Schema markup."
    ],
    "deliverablesEn": [
      "Full HTML5, CSS3, and Vanilla JS Source Code.",
      "SVG icon assets and color/typography customization guide.",
      "Unlimited commercial license for agency & client websites."
    ]
  },
  {
    "id": "prod-3",
    "title": "Script Python Otomatisasi Scraper & Export Data ke Excel / Google Sheets",
    "titleEn": "Python Automated Web Scraper & Excel / Google Sheets Exporter",
    "categories": [
      "Python",
      "Source Code"
    ],
    "price": "Rp 99.000",
    "oldPrice": "Rp 199.000",
    "priceUsd": "$15",
    "oldPriceUsd": "$29",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_ujKMtXy5lLH0yavS8JKSE7BskRO6GGb18IQGd3Pxnjf",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/scraper/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/script-python-otomatisasi-scraper_01983744995.html",
    "version": "v1.5 (Terbaru)",
    "stack": "Python 3.10+ (BeautifulSoup4 & Pandas)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/scraper/screenshot.webp",
    "summary": "Kumpulan script otomatisasi Python siap pakai untuk mengambil, membersihkan, dan mengekspor data web secara terjadwal ke file Excel (.xlsx), CSV, maupun Google Sheets.",
    "summaryEn": "Modular Python 3.10+ automation script to scrape, clean, and export structured web data on schedule to Excel (.xlsx), CSV, or Google Sheets with auto-retry and User-Agent rotation.",
    "features": [
      "Dilengkapi fitur retry otomatis, rotasi User-Agent, dan penanganan error jaringan.",
      "Ekspor hasil data langsung ke format Excel (.xlsx) rapi atau CSV.",
      "Kode modular dengan komentar penjelasan bahasa Indonesia di setiap fungsi.",
      "Dapat dijalankan otomatis secara terjadwal di Windows maupun Linux."
    ],
    "featuresEn": [
      "Built-in automatic retries, User-Agent rotation, and network resilience handling.",
      "Export clean structured datasets directly to Excel (.xlsx), CSV, or Google Sheets.",
      "Modular, readable Python architecture easy to adapt for any target website.",
      "Supports scheduled automated cron execution on Windows, macOS, or Linux."
    ],
    "deliverablesEn": [
      "Full Python (.py) Source Code + requirements.txt.",
      "Step-by-step Python environment setup and configuration guide.",
      "Sample scraping presets & clean target selectors."
    ]
  },
  {
    "id": "prod-4",
    "title": "Source Code Aplikasi E-Commerce & Katalog Toko Online Checkout QRIS",
    "titleEn": "PHP 8 E-Commerce Store & Online Catalog Platform (MySQL PDO)",
    "categories": [
      "PHP",
      "Web App",
      "Source Code"
    ],
    "price": "Rp 169.000",
    "oldPrice": "Rp 349.000",
    "priceUsd": "$25",
    "oldPriceUsd": "$49",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_lufYFGaik2pMgJza2yeUFvLU0pxQrtP5P6nsy1pe95A",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/ecommerce/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-aplikasi-e-commerce-katalog_0585515657.html",
    "version": "v3.0 (Terbaru)",
    "stack": "PHP 8 Native (PDO MySQL) + Responsive CSS + QRIS Checkout",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/ecommerce/screenshot.webp",
    "summary": "Source code platform toko online dan katalog produk lengkap dengan keranjang belanja interaktif, perhitungan ongkos kirim otomatis, manajemen pesanan, dan integrasi pembayaran QRIS & Virtual Account.",
    "summaryEn": "Full PHP 8 & MySQL PDO e-commerce platform with multi-category product catalog, live cart, product variants, discount vouchers, admin order dashboard, and QRIS/global payment webhook support.",
    "features": [
      "Katalog produk multi-kategori dengan pencarian cepat & filter harga.",
      "Keranjang belanja (Cart) real-time tanpa reload halaman.",
      "Manajemen produk, varian ukuran/warna, diskon voucher, dan stok otomatis.",
      "Dashboard Admin lengkap untuk memantau pesanan masuk dan laporan penjualan.",
      "Desain Mobile-First yang sangat nyaman diakses dari smartphone pembeli."
    ],
    "featuresEn": [
      "Multi-category storefront catalog with instant search and price range filters.",
      "Real-time Shopping Cart without page reloads.",
      "Product variants, coupon voucher discounts, and automatic stock deduction.",
      "Complete Admin Panel for order tracking and sales revenue analytics.",
      "Mobile-First storefront UI optimized for conversion."
    ],
    "deliverablesEn": [
      "Full PHP 8 (PDO Prepared Statements) 100% Open Source Code.",
      "Pre-seeded MySQL database (database.sql) with categories, variants, and sample products.",
      "Deployment & setup guide for XAMPP, Laragon, or cPanel hosting."
    ]
  },
  {
    "id": "prod-5",
    "title": "Admin Dashboard & Analytics UI Kit Modern (Dark/Light Mode)",
    "titleEn": "Modern Admin Dashboard & Analytics UI Kit (Dark & Light Mode)",
    "categories": [
      "JavaScript",
      "Desain Web",
      "Template",
      "Web App",
      "Source Code"
    ],
    "price": "Rp 89.000",
    "oldPrice": "Rp 179.000",
    "priceUsd": "$14",
    "oldPriceUsd": "$29",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_7wOmgIXoXBcqzK4OH0ljaPUFObFFfSKGe96u50sBoRr",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/dashboard-ui/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/admin-dashboard-analytics-ui-kit-modern_01645151510.html",
    "version": "v2.1 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS + SVG Charts (Zero-Dependency)",
    "license": "Personal & Komersial (Unlimited)",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/dashboard-ui/screenshot.webp",
    "summary": "Template Admin Dashboard profesional dengan 25+ komponen halaman siap pakai, grafik analitik interaktif, tabel data responsif, dan fitur Dark/Light Mode instan. Cocok untuk backend aplikasi Laravel, Node.js, maupun Python.",
    "summaryEn": "Multi-page SaaS & admin analytics dashboard template featuring interactive SVG charts, CRUD data tables, form components, printable invoices, auth screens, and Dark/Light themes.",
    "features": [
      "5+ Template halaman siap pakai (Dashboard Analitik, Tabel CRUD, Formulir UI Kit, Faktur Cetak, Auth Login/Daftar).",
      "Grafik SVG interaktif bawaan (Line/Area, Bar, Donut) tanpa CDN eksternal — jalan 100% offline.",
      "Dark Mode & Light Mode otomatis tersimpan di localStorage.",
      "Sidebar navigasi lipat & responsif di layar Desktop, Tablet, maupun Smartphone.",
      "Tabel CRUD interaktif lengkap dengan pencarian, filter, pagination, tambah/edit, & ekspor CSV."
    ],
    "featuresEn": [
      "5+ complete admin templates: Analytics Dashboard, CRUD Data Table, Form Kit, Printable Invoice, and Auth pages.",
      "Interactive built-in SVG Charts (Line/Area, Bar, Donut) with zero external CDN dependencies.",
      "Persistent Dark Mode & Light Mode saved in localStorage.",
      "Collapsible responsive sidebar across Desktop, Tablet, and Mobile.",
      "Full CRUD table with search, filters, sorting, pagination, add/edit modal, and CSV export."
    ],
    "deliverablesEn": [
      "Modular HTML5, CSS3, and Vanilla JS Source Code (no heavy bundler required).",
      "SVG chart components, validation forms, printable invoices, and modals.",
      "Customization guide (PANDUAN.md) & Commercial License (LISENSI.txt)."
    ]
  },
  {
    "id": "prod-6",
    "title": "Bot Auto-Responder & Notifikasi Laporan Otomatis Telegram / Webhook",
    "titleEn": "Telegram Auto-Responder Bot & Webhook Reporting System (Python)",
    "categories": [
      "Python",
      "Source Code",
      "Web App"
    ],
    "price": "Rp 119.000",
    "oldPrice": "Rp 249.000",
    "priceUsd": "$19",
    "oldPriceUsd": "$39",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_YyNN2n3ceJNptzFy1SUkIKBAOxbb04BaUICEO3iIted",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/bot-responder/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/bot-auto-responder-notifikasi-laporan_01829563560.html",
    "version": "v1.8 (Terbaru)",
    "stack": "Python 3.10+ (Asyncio & REST API)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/bot-responder/screenshot.webp",
    "summary": "Source code bot otomatisasi Python untuk mengirim notifikasi transaksi, laporan harian database/Excel, pemantauan server, serta balasan menu otomatis secara real-time.",
    "summaryEn": "Python asyncio Telegram bot with custom regex auto-reply rules, inline keyboards, external webhook report receiver, and CSV activity export.",
    "features": [
      "Arsitektur Asynchronous Python yang ringan dan merespons dalam hitungan milidetik.",
      "Mendukung pengiriman laporan otomatis (teks, tabel gambar, maupun file Excel/PDF).",
      "Menu tombol interaktif (Inline Keyboard) yang mudah dikustomisasi sesuai kebutuhan bisnis.",
      "Dilengkapi sistem pencatatan log aktivitas dan auto-reconnect saat koneksi terputus."
    ],
    "featuresEn": [
      "Lightweight Asynchronous Python engine with millisecond response speed.",
      "Supports automated alerts & rich replies (text, inline keyboards, webhook payloads).",
      "Easy rule matching & custom command triggers without editing core boilerplate.",
      "Includes activity logging, auto-reconnect handling, and CSV log export."
    ],
    "deliverablesEn": [
      "Modular Python Source Code + environment template (.env.example).",
      "Step-by-step BotFather token setup & 24/7 VPS/Railway deployment guide.",
      "Commercial license for internal tools and client automation."
    ]
  },
  {
    "id": "prod-7",
    "title": "Source Code Aplikasi Kalkulator Pengeluaran & Finansial (Windows .EXE + Android .APK)",
    "titleEn": "Personal Expense & Financial Budget Tracker Web App (Offline PWA)",
    "categories": [
      "JavaScript",
      "Template",
      "Web App",
      "Source Code"
    ],
    "price": "Rp 45.000",
    "oldPrice": "Rp 99.000",
    "priceUsd": "$7",
    "oldPriceUsd": "$15",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_kKEkZ01SZ5LKJG6sHGHi9ExSQj6I95G2u5OKv0wnLDS",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/finansial/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-aplikasi-kalkulator.html",
    "version": "v2.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS + PWA Manifest (Desktop/Android WebView Ready)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/finansial/screenshot.webp",
    "summary": "Template website Link-in-Bio modern dan super ringan dengan skor 100 PageSpeed. Bebas biaya langganan bulanan selamanya, bisa di-hosting 100% gratis di GitHub Pages, Vercel, atau Netlify. Lengkap dengan integrasi WhatsApp, medsos, katalog produk, dan mode gelap/terang.",
    "summaryEn": "Offline-ready financial tracker & budget planner with 4 KPI cards, category spending donut chart, budget limits, savings goal calculator, and CSV export.",
    "features": [
      "Buku kas pemasukan & pengeluaran harian dengan KPI Saldo Bersih dan Rasio Tabungan.",
      "Grafik Donut SVG interaktif & progress bar batas anggaran per kategori.",
      "Kalkulator target tabungan & simulasi imbal hasil bulanan otomatis.",
      "Dukungan Dark Mode & Light Mode, ekspor CSV Excel, serta tombol bagikan ringkasan ke WhatsApp.",
      "Dilengkapi manifest PWA, file launcher .bat Desktop, & panduan pembungkusan WebView APK."
    ],
    "featuresEn": [
      "Daily income & expense ledger with Net Balance and Savings Ratio KPIs.",
      "Interactive Donut SVG expense breakdown & category budget progress bars.",
      "Built-in Savings Goal Calculator & compound yield estimator.",
      "Dark/Light mode, CSV Excel export, and PWA manifest ready for mobile install."
    ],
    "deliverablesEn": [
      "100% Offline HTML5, CSS3, JS Source Code + manifest.json.",
      "Desktop quick-launch script & packaging documentation.",
      "Personal & Commercial License (LISENSI.txt)."
    ]
  },
  {
    "id": "prod-8",
    "title": "Script Python Auto-Converter PDF to Word / Excel & OCR Text Extractor",
    "titleEn": "Python Batch PDF to Word / Excel Converter & OCR Extractor (CLI + GUI)",
    "categories": [
      "Python",
      "Source Code"
    ],
    "price": "Rp 39.000",
    "oldPrice": "Rp 89.000",
    "priceUsd": "$7",
    "oldPriceUsd": "$15",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_ar1xkNq0iMl025ZKO1E1KmFxArmimr8CsbfMU1MPj2C",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/pdf-converter/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/script-python-auto-converter-pdf-to.html",
    "version": "v1.3 (Terbaru)",
    "stack": "Python 3.10+ (pdfplumber, openpyxl, python-docx)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/pdf-converter/screenshot.webp",
    "summary": "Script otomatisasi Python siap pakai untuk mengonversi dokumen PDF ke format Word (.docx) atau tabel Excel (.xlsx) tanpa watermark, tanpa batasan jumlah halaman, dan tanpa risiko kebocoran data karena semua proses berjalan 100% lokal di komputer Anda.",
    "summaryEn": "Python tool to extract tables and text from native and scanned PDFs into formatted Word (.docx) or Excel (.xlsx) files with both CLI and Tkinter GUI modes.",
    "features": [
      "Konversi tabel dari PDF langsung ke file Excel (.xlsx) rapi dengan pemisahan kolom otomatis.",
      "Ekstrak teks dan paragraf PDF ke dokumen Word (.docx) dengan format yang terjaga.",
      "Fitur Batch Processing: convert puluhan file PDF sekaligus dalam satu folder.",
      "100% Offline & Privat: data dokumen Anda tidak pernah dikirim ke server pihak ketiga.",
      "Dilengkapi antarmuka GUI sederhana (Tkinter) tinggal klik tombol pilih file."
    ],
    "featuresEn": [
      "Extract PDF tables cleanly into Excel (.xlsx) spreadsheets with structured columns.",
      "Convert PDF text and paragraphs into editable Word (.docx) documents.",
      "Batch processing for multiple PDF files across an entire folder in seconds.",
      "100% Offline & Private: sensitive documents never leave your machine.",
      "Includes simple Tkinter Desktop GUI plus CLI automation mode."
    ],
    "deliverablesEn": [
      "Full Python (.py) Source Code for both CLI and GUI desktop versions.",
      "requirements.txt & dependency installation guide.",
      "Windows, macOS, and Linux quick-start manual."
    ]
  },
  {
    "id": "prod-9",
    "title": "Template Landing Page Undangan Digital Pernikahan & Event Responsive",
    "titleEn": "Responsive Digital Wedding & Event Invitation Landing Page",
    "categories": [
      "JavaScript",
      "Desain Web",
      "Template",
      "Source Code"
    ],
    "price": "Rp 45.000",
    "oldPrice": "Rp 99.000",
    "priceUsd": "$7",
    "oldPriceUsd": "$15",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_IqjHhZCSNsnCTEedwm7zAPS2SmhAy7M76ypVn1UYK7T",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/undangan/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-landing-page-undangan-digital.html",
    "version": "v2.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + JavaScript (Audio Player & RSVP)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/undangan/screenshot.webp",
    "summary": "Template website undangan digital pernikahan atau event modern dengan desain aesthetic dan fitur premium. Sangat cocok bagi Anda yang ingin membuka jasa pembuatan undangan online atau untuk acara pernikahan sendiri.",
    "summaryEn": "Elegant digital wedding invitation template with custom guest URL parameters, gallery, countdown timer, background audio player, and RSVP form.",
    "features": [
      "Tombol Buka Undangan dengan efek animasi tirai halus (AOS Animation).",
      "Background Music Player dengan tombol kontrol putar/jeda melayang.",
      "Countdown Timer hitung mundur menuju hari-H acara secara real-time.",
      "Fitur Amplop Digital: Nomor rekening & scan QRIS dengan tombol 1-klik salin nomor.",
      "Form RSVP ucapan & konfirmasi kehadiran buku tamu.",
      "Integrasi Google Maps petunjuk arah lokasi acara."
    ],
    "featuresEn": [
      "Smooth AOS animated invitation cover reveal button.",
      "Floating Background Music player with play/pause control.",
      "Real-time Event Countdown Timer to the wedding day.",
      "Digital Gift / Bank details copy & interactive RSVP guestbook with wishes.",
      "Integrated Google Maps venue directions & calendar save button."
    ],
    "deliverablesEn": [
      "Complete HTML5, CSS3, and JavaScript invitation source code.",
      "Customization guide to edit photos, couple names, dates, and payment info.",
      "Commercial license to resell custom event websites to clients."
    ]
  },
  {
    "id": "prod-10",
    "title": "Bot Telegram Pengingat Tagihan & Jadwal Otomatis (Google Sheets API)",
    "titleEn": "Telegram Billing Reminder & Due-Date Scheduler Bot (Python / CSV)",
    "categories": [
      "Python",
      "Source Code",
      "Web App"
    ],
    "price": "Rp 49.000",
    "oldPrice": "Rp 99.000",
    "priceUsd": "$9",
    "oldPriceUsd": "$19",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_7mc0ZY2T5D2KYPtLSRXIt20RELCMzy4K96ieU1RbEu0",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/bot-tagihan/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/bot-telegram-pengingat-tagihan-jadwal.html",
    "version": "v1.4 (Terbaru)",
    "stack": "Python 3.10+ (Telegram Bot API & Google Sheets API)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/bot-tagihan/screenshot.webp",
    "summary": "Bot otomatisasi yang terhubung langsung dengan Google Sheets. Bot akan membaca tanggal jatuh tempo tagihan, jadwal sewa, atau agenda penting, lalu secara otomatis mengirimkan pesan pengingat ke chat atau grup Telegram tanpa perlu repot cek spreadsheet manual setiap hari.",
    "summaryEn": "Automated Python billing reminder bot that tracks due dates (H-3, H-0, overdue) from CSV or Google Sheets and pushes formatted alerts to Telegram.",
    "features": [
      "Sinkronisasi real-time dengan Google Sheets pribadi Anda.",
      "Auto-cron check setiap pagi untuk mendeteksi tagihan/agenda yang jatuh tempo hari ini atau H-3.",
      "Kirim notifikasi otomatis langsung ke akun Telegram pribadi atau grup tim.",
      "Template pesan notifikasi profesional yang rapi dan bisa dikustomisasi sesuka hati.",
      "Bisa berjalan 24/7 di VPS murah atau bahkan gratisan (Google Cloud Run / Railway)."
    ],
    "featuresEn": [
      "Real-time sync with Google Sheets or CSV billing ledgers.",
      "Automated daily cron checks for invoices due today or H-3 advance reminders.",
      "Direct Telegram alerts to individual users or finance team groups.",
      "Customizable notification templates and 24/7 cloud-ready worker design."
    ],
    "deliverablesEn": [
      "Full Python Bot Source Code ready to run.",
      "Sample Google Sheets billing template with due-date columns.",
      "Setup guide for Telegram BotFather & Google Service Account credentials (.env.example)."
    ]
  },
  {
    "id": "prod-11",
    "title": "Source Code Sistem Absensi Siswa & Karyawan QR Code Berbasis Web PHP",
    "titleEn": "QR Code Employee & Student Attendance System (PHP 8 + MySQL)",
    "categories": [
      "PHP",
      "Web App",
      "Source Code"
    ],
    "price": "Rp 59.000",
    "oldPrice": "Rp 129.000",
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_yPImlJVfC7FVlXymcznKng6hvqlRh1dzgekeU0xBGpf",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/absensi/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-sistem-absensi-siswa.html",
    "version": "v2.1 (Terbaru)",
    "stack": "PHP Native + MySQL + HTML5 QR Code Scanner",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/absensi/screenshot.webp",
    "summary": "Aplikasi absensi praktis dan instan tanpa alat fingerprint mahal. Karyawan atau siswa cukup melakukan scan QR Code dinamis menggunakan kamera smartphone masing-masing untuk mencatat kehadiran secara akurat.",
    "summaryEn": "PHP 8 PDO + MySQL attendance web app with browser camera QR scanning (BarcodeDetector + USB scanner), late threshold calculation, printable QR ID cards, and Excel/CSV export.",
    "features": [
      "Scan QR Code instan langsung lewat kamera browser smartphone tanpa instal aplikasi APK.",
      "Pencatatan waktu hadir, jam masuk, jam pulang, dan status terlambat otomatis.",
      "Dashboard admin untuk melihat kehadiran harian dan grafik statistik bulanan.",
      "Ekspor rekapitulasi kehadiran seluruh karyawan/siswa ke format Excel (.xlsx).",
      "Manajemen data karyawan/siswa, divisi, dan jadwal kerja."
    ],
    "featuresEn": [
      "Instant browser camera QR Code scanning without installing native mobile apps.",
      "Automatic Check-In, Check-Out, and Late arrival status logging.",
      "Admin Dashboard with daily attendance KPIs and 7-day trend chart.",
      "Deterministic printable QR ID cards generator + Excel (.xlsx/.csv) attendance export."
    ],
    "deliverablesEn": [
      "Full PHP 8 Native Source Code + ready-to-import MySQL database (.sql).",
      "Bundled offline HTML5 QR scanner & SVG card generator.",
      "Step-by-step XAMPP/Laragon setup guide & commercial license."
    ]
  },
  {
    "id": "prod-12",
    "title": "Starter Kit Payment Gateway Midtrans & Mayar QRIS Siap Pakai (PHP)",
    "titleEn": "Payment Gateway Starter Kit for Midtrans & Mayar (PHP 8 + Webhook)",
    "categories": [
      "PHP",
      "Source Code"
    ],
    "price": "Rp 65.000",
    "oldPrice": "Rp 139.000",
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_LcoZCZq4QDRXMLiTadO1hESsRKQMrVfExP0XQ0QPB24",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/payment-kit/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/starter-kit-payment-gateway-midtrans.html",
    "version": "v1.2 (Terbaru)",
    "stack": "PHP 8 Native (cURL, Webhook Handler, QRIS)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/payment-kit/screenshot.webp",
    "summary": "Modul starter kit siap pakai untuk menerima pembayaran otomatis QRIS, GoPay, OVO, ShopeePay, dan Virtual Account bank (BCA, BNI, BRI, Mandiri) di website Anda. Dilengkapi endpoint webhook otomatis yang mengubah status order jadi LUNAS detik itu juga.",
    "summaryEn": "Production-ready PHP integration starter kit for invoice creation, MySQL transaction logging, signature verification webhooks, and sandbox testing.",
    "features": [
      "Mendukung 2 gateway populer sekaligus: Midtrans Snap & Mayar Payment Link.",
      "Halaman checkout responsif dengan pop-up QRIS real-time.",
      "Webhook notification handler untuk verifikasi pembayaran otomatis dari server payment.",
      "Contoh kode bersih dan modular, mudah ditempel ke web toko online atau sistem Anda yang sudah ada.",
      "Termasuk mode Sandbox (testing) dan mode Production (live)."
    ],
    "featuresEn": [
      "Dual gateway starter architecture supporting Snap / Payment Link & instant webhooks.",
      "Responsive checkout flow with instant status verification listener.",
      "Clean modular PHP webhook handler to mark orders paid automatically.",
      "Includes both Sandbox testing simulator and Production setup instructions."
    ],
    "deliverablesEn": [
      "Full PHP checkout, API request helper, and Webhook listener source code.",
      "Lightweight transaction schema SQL script for order logging.",
      "Integration guide & Plug-and-Play examples."
    ]
  },
  {
    "id": "prod-13",
    "title": "Source Code Kasir Toko Sederhana & Cetak Struk Mini POS (Zero-Config XAMPP)",
    "titleEn": "Mini POS Store Cashier & 58mm Thermal Receipt App (PHP 8 + MySQL)",
    "categories": [
      "PHP",
      "Web App",
      "Source Code"
    ],
    "price": "Rp 75.000",
    "oldPrice": "Rp 150.000",
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_YdQciZ7F6l7zBwpB2jDxK5QkqvcXlysmuWnLf0H3aS2",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/kasir-php/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-kasir-toko-sederhana-cetak.html",
    "version": "v1.5 (Terbaru)",
    "stack": "PHP Native + MySQL + Bootstrap (Mudah untuk Pemula)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/kasir-php/screenshot.webp",
    "summary": "Aplikasi kasir penjualan dan manajemen stok barang versi ringan tanpa framework rumit. Sangat mudah dipahami bagi pemula yang baru belajar PHP atau UMKM yang membutuhkan sistem kasir simpel tanpa perlu instal Node.js atau Composer.",
    "summaryEn": "Lightweight PHP & MySQL point-of-sale application for retail shops with barcode product lookup, automatic stock deduction, daily sales reports, and 58mm thermal printing.",
    "features": [
      "Transaksi penjualan kasir cepat dengan hitung kembalian otomatis.",
      "Fitur cetak struk nota belanja langsung ke printer thermal (58mm) atau simpan PDF.",
      "Manajemen data barang, harga beli, harga jual, dan stok otomatis berkurang saat terjual.",
      "Laporan omzet penjualan harian dan bulanan sederhana.",
      "Desain antarmuka bersih menggunakan Bootstrap 5, nyaman di layar laptop maupun tablet kasir."
    ],
    "featuresEn": [
      "Fast cashier checkout screen with instant change calculation and barcode search.",
      "Print clean 58mm thermal receipts or save transaction PDFs.",
      "Automatic inventory stock deduction and real-time profit estimation.",
      "Zero-dependency PHP + Bootstrap 5 UI ready for retail counters and tablets."
    ],
    "deliverablesEn": [
      "Zero-Config PHP Native Source Code (no Composer required).",
      "Pre-populated .sql database with sample retail SKUs.",
      "Setup guide & unlimited commercial usage rights."
    ]
  },
  {
    "id": "prod-14",
    "title": "Template Desain Web Company Profile & Digital Agency Modern (HTML5 + Tailwind)",
    "titleEn": "Modern Digital Agency & Company Profile HTML5 Template",
    "categories": [
      "Desain Web",
      "Template",
      "Source Code",
      "JavaScript"
    ],
    "price": "Rp 59.000",
    "oldPrice": "Rp 149.000",
    "priceUsd": "$9",
    "oldPriceUsd": "$19",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_tA48uVg3o8VgRgMlo5YIYId6XczToBhpjwfZv0uhqRB",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/agency/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-desain-web-company-profile.html",
    "version": "v2.2 (Terbaru)",
    "stack": "HTML5 + Tailwind CSS + Vanilla JS",
    "license": "Personal & Komersial (Unlimited Project)",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/agency/screenshot.webp",
    "summary": "Desain web Company Profile & Agensi Digital modern dengan tata letak bersih, dark/light mode, portofolio interaktif, tabel paket layanan, dan form kontak cepat. Cocok untuk bisnis jasa, studio kreatif, dan freelancer.",
    "summaryEn": "High-converting agency & company profile landing page with service tiers, portfolio showcase, testimonials, FAQ accordion, Dark/Light mode, and easy config.js setup.",
    "features": [
      "8+ Halaman & Seksi Siap Pakai (Hero, Layanan, Portofolio, Tim, Harga, Testimoni, FAQ, Kontak).",
      "Desain Web Responsif 100% di Desktop, Tablet, dan Smartphone.",
      "Animasi Scroll Halus & Skor Performa Tinggi (Tanpa Framework Berat).",
      "Kode HTML5 & CSS Rapi Mudah Diganti Logo, Warna, dan Teks."
    ],
    "featuresEn": [
      "8+ high-converting agency sections (Hero, Services, Case Studies, Pricing, FAQ, Contact).",
      "100% responsive grid across Desktop, Tablet, and Mobile devices.",
      "Smooth scroll animations and clean semantic HTML5 for top Lighthouse performance.",
      "Easy config.js brand customization for logos, colors, and contact links."
    ],
    "deliverablesEn": [
      "Full HTML5, CSS3, and JavaScript Source Code.",
      "SVG assets & quick customization guide.",
      "Commercial license for unlimited client websites."
    ]
  },
  {
    "id": "prod-15",
    "title": "Desain Web Portfolio Pribadi & Link-in-Bio Kreator Minimalis (Dark/Light)",
    "titleEn": "Creator Link-in-Bio & Mini Portfolio Web Template (Dark/Light)",
    "categories": [
      "Desain Web",
      "Template",
      "JavaScript",
      "Source Code"
    ],
    "price": "Rp 39.000",
    "oldPrice": "Rp 89.000",
    "priceUsd": "$7",
    "oldPriceUsd": "$15",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_whDfPJ5r7YHYdpWPxkb4ml3dHsxCCV8Mu4jo93s6NFy",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/biolink/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/desain-web-portfolio-pribadi-link-in.html",
    "version": "v1.4 (Terbaru)",
    "stack": "HTML5 + CSS3 + JavaScript",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/biolink/screenshot.webp",
    "summary": "Template desain web portfolio pribadi sekaligus halaman Link-in-Bio profesional untuk developer, desainer, content creator, dan pekerja lepas. Tampil elegan dan cepat diakses dari bio Instagram/TikTok.",
    "summaryEn": "Self-hosted link-in-bio & creator portfolio card with bento stats, project showcase modals, service rate cards, .vcf contact download, and zero monthly fees.",
    "features": [
      "Gabungan Halaman Link-in-Bio & Showcase Portofolio Karya.",
      "Tombol Salin Email & Tautan Sosial Media 1-Klik.",
      "Mode Gelap & Terang Otomatis.",
      "Sangat Ringan (<100 KB) & Ramah SEO."
    ],
    "featuresEn": [
      "Unified Link-in-Bio hub and featured project showcase gallery.",
      "One-click email copy, vCard contact save (.vcf), and social profile buttons.",
      "Smooth Dark & Light theme toggle saved automatically.",
      "Ultra-lightweight (<100 KB) with instant page loads."
    ],
    "deliverablesEn": [
      "Complete HTML5, CSS3, and JavaScript source files + config.js.",
      "Free static deployment guide & commercial license."
    ]
  },
  {
    "id": "prod-16",
    "title": "Program Aplikasi Manajemen Antrian & Tiket Layanan Pelanggan Web + Suara Panggil",
    "titleEn": "Digital Queue & Counter Calling Web System with Voice Synth",
    "categories": [
      "Program",
      "Web App",
      "Source Code",
      "JavaScript"
    ],
    "price": "Rp 89.000",
    "oldPrice": "Rp 199.000",
    "priceUsd": "$15",
    "oldPriceUsd": "$29",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_1rNakvqCFhuzeVjpqRHGVEg8MnqIJEt5uUNjp3wNP8J",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/antrian/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/program-aplikasi-manajemen-antrian_3.html",
    "version": "v1.8 (Terbaru)",
    "stack": "HTML5 + JavaScript + Web Speech API (Zero-Config)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/antrian/screenshot.webp",
    "summary": "Program antrian digital berbasis web untuk klinik, apotek, bengkel, loket pelayanan, dan toko servis. Dilengkapi layar monitor antrian, tombol panggil suara otomatis bahasa Indonesia, dan cetak nomor antrian.",
    "summaryEn": "Zero-Config queue management app with Operator console, synced TV waiting-room display, ticket kiosk thermal print, Web Speech voice calling, and CSV logs.",
    "features": [
      "Panggilan Suara Otomatis Bahasa Indonesia (Nomor Antrian & Loket).",
      "Layar Monitor Antrian Fullscreen untuk TV/Monitor Ruang Tunggu.",
      "Dukungan Multi-Loket / Multi-Layanan & Reset Antrian Harian.",
      "Zero-Config: Langsung jalan di browser tanpa install server rumit."
    ],
    "featuresEn": [
      "Automated Web Speech API voice announcer calling ticket & counter numbers.",
      "Dedicated Fullscreen Queue Monitor Display for waiting room TVs/screens.",
      "Multi-counter support (Recall, Next, Skip) + instant thermal queue ticket printing.",
      "Zero-Config real-time broadcast sync right inside your browser."
    ],
    "deliverablesEn": [
      "Complete Digital Queue Web App Source Code (HTML, CSS, JS).",
      "Quick-launch scripts & setup guide + commercial license."
    ]
  },
  {
    "id": "prod-17",
    "title": "Paket Desain Web UI Kit E-Commerce & SaaS Components (HTML/CSS/JS Siap Pakai)",
    "titleEn": "42 Interactive E-Commerce & SaaS Web UI Components Kit",
    "categories": [
      "Desain Web",
      "Template",
      "Web App",
      "JavaScript",
      "Source Code"
    ],
    "price": "Rp 69.000",
    "oldPrice": "Rp 159.000",
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_VRqwJZZAG3ZbNaW0rRTVaTJkf6Ek3BTgU4p4M0ixPgQ",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/uikit/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/paket-desain-web-ui-kit-e-commerce-saas_2.html",
    "version": "v2.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Modular JS",
    "license": "Personal & Komersial (Unlimited Project)",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/uikit/screenshot.webp",
    "summary": "Koleksi 42 komponen desain web interaktif siap copy-paste untuk proyek Toko Online & SaaS (Navigation, Hero CTA, Product Card & Cart, SaaS Pricing Table, Auth/Checkout Forms, Dashboard KPI & Table, hingga FAQ/Modal/Footer) lengkap dengan Token Warna & Dark Mode.",
    "summaryEn": "42 responsive, copy-paste-ready UI components across 7 categories with CSS design tokens, 4 brand accent presets, Dark/Light mode, and 1-click HTML/CSS code copy.",
    "features": [
      "40+ Komponen UI Siap Pakai Tanpa Dependency Berat.",
      "Sudah Mendukung Dark Mode & Light Mode.",
      "Mudah Digabung ke Laravel, React, Vue, atau HTML Biasa.",
      "Struktur CSS Variabel Bersih untuk Ganti Warna Brand dalam Sekejap."
    ],
    "featuresEn": [
      "42 interactive E-Commerce & SaaS components with zero external CSS frameworks.",
      "Full Dark Mode & Light Mode support powered by clean tokens.css variables.",
      "Copy-paste snippets ready for React, Vue, Laravel Blade, or plain HTML.",
      "Includes pricing sliders, multi-step checkouts, modals, toasts, and KPI widgets."
    ],
    "deliverablesEn": [
      "Full Source Code of all 42 Interactive Components (HTML, CSS, JS).",
      "CSS design tokens file (tokens.css), documentation & Commercial License."
    ]
  },
  {
    "id": "prod-18",
    "title": "Program Pembuat Invoice, Penawaran Harga & Kwitansi Bisnis Pro (Cetak PDF & WhatsApp)",
    "titleEn": "Pro Invoice, Quotation & Business Receipt Generator (A4 PDF Ready)",
    "categories": [
      "Aplikasi",
      "Web App",
      "Source Code",
      "JavaScript"
    ],
    "price": "Rp 59.000",
    "oldPrice": "Rp 139.000",
    "priceUsd": "$9",
    "oldPriceUsd": "$19",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_ZLlM0fHxXtygcFf7sKv8X3fnYFrRo6BcGwCnG3T9CZg",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/invoice/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/program-pembuat-invoice-penawaran-harga.html",
    "version": "v1.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS (Zero-Config & Print A4 PDF Ready)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/invoice/screenshot.webp",
    "summary": "Aplikasi pembuat Invoice tagihan, Penawaran Harga (Quotation), dan Kwitansi resmi siap cetak A4 PDF yang berjalan langsung di browser tanpa server/XAMPP (Zero-Config). Dilengkapi konverter nominal Terbilang bahasa Indonesia otomatis, hitung PPN 11% & PPh 23 opsional, stempel SVG LUNAS/BELUM LUNAS, konversi Penawaran ke Invoice 1-klik, dan kirim ringkasan tagihan ke WhatsApp.",
    "summaryEn": "Offline-first invoicing, quotation, and receipt generator with live A4 preview, automatic tax/discount math, SVG Paid stamps, 1-click quote-to-invoice conversion, and CSV export.",
    "features": [
      "3 Jenis Dokumen Sekaligus: Invoice, Penawaran Harga (Quotation), dan Kwitansi Resmi.",
      "Editor & Live Preview Kertas A4 Real-Time lengkap dengan stempel SVG (LUNAS / BELUM LUNAS / DRAFT).",
      "Terbilang Bahasa Indonesia Otomatis (mis. Sembilan Juta Empat Ratus Tiga Puluh Lima Ribu Rupiah).",
      "Hitung otomatis multi-baris item, Diskon (% atau Rp), PPN 11%, dan PPh 23 (2%).",
      "Konversi 1-Klik Penawaran -> Invoice dan Invoice -> Kwitansi Lunas, serta ekspor riwayat ke CSV & Cetak PDF bersih."
    ],
    "featuresEn": [
      "3-in-1 Document Studio: Official Invoices, Price Quotations, and Paid Receipts.",
      "Real-time A4 Paper Live Preview with SVG stamps (PAID / PENDING / DRAFT).",
      "Automatic calculation for line items, discounts (% or fixed), VAT/Tax & withholding tax.",
      "1-click convert Quotation -> Invoice -> Paid Receipt, CSV export & clean A4 PDF print."
    ],
    "deliverablesEn": [
      "100% Open Source HTML5, CSS3, and Vanilla JS code.",
      "Desktop quick-launcher script + 4 preloaded business sample documents.",
      "Documentation (PANDUAN.md) & Commercial License (LISENSI.txt)."
    ]
  },
  {
    "id": "prod-19",
    "title": "Aplikasi Booking Jadwal, Reservasi Jasa & Manajemen Janji Temu Pelanggan (Klinik / Salon / Bengkel)",
    "titleEn": "Appointment Booking, Service Reservation & Schedule Manager App",
    "categories": [
      "Aplikasi",
      "Web App",
      "Source Code",
      "JavaScript"
    ],
    "price": "Rp 79.000",
    "oldPrice": "Rp 169.000",
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_wKSKcXH0LRfWIacG82TsDM8wyXLGQ9kdxg0D50qKDAr",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/booking/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/aplikasi-booking-jadwal-reservasi-jasa.html",
    "version": "v1.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS (Anti Double-Booking & .ICS Calendar)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/booking/screenshot.webp",
    "summary": "Sistem reservasi online dan manajemen jadwal janji temu pelanggan siap pakai untuk klinik, dokter gigi, barbershop, salon kecantikan, bengkel servis, maupun studio konsultasi. Dilengkapi proteksi anti double-booking per staf/terapis, unduh tiket kalender (.ics), panel admin resepsionis, dan reminder WhatsApp 1-klik.",
    "summaryEn": "Client booking and appointment dashboard with 4 business presets, anti-double-booking per staff slot, .ICS calendar download, and receptionist analytics.",
    "features": [
      "4 Preset Bidang Usaha 1-Klik: Klinik & Dokter Gigi, Barbershop & Salon, Bengkel & Servis, dan Studio Foto/Konsultan.",
      "Slot Jam Dinamis (09:00–20:00) dengan Proteksi Anti Double-Booking per staf & tanggal.",
      "Tiket Booking Otomatis (BKG-xxxx) + Unduh File Kalender (.ics) & Konfirmasi WhatsApp.",
      "Panel Admin Resepsionis lengkap dengan 4 KPI harian, Timeline/Tabel Jadwal, Ubah Status, & Ekspor CSV.",
      "Dukungan Kelola Layanan & Staf Kustom serta Mode Gelap / Terang."
    ],
    "featuresEn": [
      "4 one-click industry presets (Clinic, Salon/Barbershop, Workshop, Studio/Consulting).",
      "Dynamic time slots with built-in anti-double-booking validation per specialist & date.",
      "Automated booking ticket IDs (BKG-xxxx), .ICS calendar download & WhatsApp confirmation.",
      "Receptionist Admin Panel with 4 daily KPIs, schedule management, and CSV export."
    ],
    "deliverablesEn": [
      "Complete HTML5, CSS3, and Vanilla JS source code with zero dependencies.",
      "Quick-launch desktop file & pre-seeded booking dataset.",
      "Documentation & Commercial License."
    ]
  },
  {
    "id": "prod-20",
    "title": "Source Code Aplikasi Kasir Laundry Kiloan/Satuan & Pelacakan Status Order + Nota Thermal",
    "titleEn": "Laundry POS Cashier & 5-Stage Order Tracking + Thermal Receipt",
    "categories": [
      "Aplikasi",
      "Program",
      "Web App",
      "JavaScript",
      "Source Code"
    ],
    "price": "Rp 85.000",
    "oldPrice": "Rp 189.000",
    "priceUsd": "$15",
    "oldPriceUsd": "$29",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_BdeXg3PE7hCWsPXe5dqW1xn0kF124WcMAFHP32U4CoS",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/laundry/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/source-code-aplikasi-kasir-laundry.html",
    "version": "v1.0 (Terbaru)",
    "stack": "HTML5 + CSS3 + Vanilla JS (Nota Thermal 58/80mm & Order Tracking)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/laundry/screenshot.webp",
    "summary": "Aplikasi kasir khusus usaha laundry kiloan dan satuan (bedcover, sepatu, jas, karpet) lengkap dengan board manajemen produksi 5 tahap, pelacakan status cucian pelanggan real-time, notifikasi WhatsApp 'Cucian Siap Diambil', dan cetak struk nota thermal 58mm/80mm tanpa perlu server.",
    "summaryEn": "Dedicated laundry POS supporting weight (kg) & per-item orders, 5-stage production Kanban board, customer order tracker, 58/80mm thermal receipts, and CSV reports.",
    "features": [
      "Kasir Order Laundry mendukung Kiloan desimal (mis. 2.5 kg) & Satuan dengan 8 paket layanan preset + kustom.",
      "Pemilih Parfum (Lavender, Ocean Fresh, Sakura), metode Ambil Outlet / Kurir, serta pembayaran Lunas, DP Sebagian, atau Bayar Nanti.",
      "Live Preview & Cetak Nota Thermal 58mm/80mm lengkap dengan kode pelacakan unik (LDR-xxxx).",
      "Board Produksi Kanban & Kartu 5 Tahap (Diterima -> Dicuci -> Disetrika -> Siap Diambil -> Selesai) + 1-Klik Notif WA Siap Diambil.",
      "Halaman Cek Status Pelanggan, KPI Laporan Omzet/Kg/Piutang, & Ekspor CSV."
    ],
    "featuresEn": [
      "Supports decimal weight (kg) and per-piece laundry pricing + custom items.",
      "Fragrance selector, pickup/delivery mode, and Paid / Partial Deposit / Pay Later states.",
      "Live 58mm/80mm thermal receipt preview with unique tracking codes (LDR-xxxx).",
      "5-Stage Kanban production tracker + customer self-lookup portal & CSV export."
    ],
    "deliverablesEn": [
      "100% Open Source HTML5, CSS3, and Vanilla JS Laundry POS code.",
      "Quick launcher + 6 sample orders preloaded.",
      "Documentation & Commercial License."
    ]
  },
  {
    "id": "prod-21",
    "title": "Template Blogger Ddev NewsPro v2.0 — Portal Berita, Majalah & Media Digital Modern",
    "titleEn": "Ddev NewsPro v2.0 — Editorial News & Magazine Blogger XML Theme",
    "categories": [
      "Template",
      "Blogger",
      "Desain Web",
      "Source Code"
    ],
    "price": "Rp 69.000",
    "oldPrice": "Rp 149.000",
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_44PHmlZPTtfThSutgMq4EtCHItKpWcGhcJLD81x5H89",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/blogger-news/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-blogger-ddev-newspro-v20.html",
    "version": "v2.0 (Blogger XML v3)",
    "stack": "Blogger XML v3 + Responsive CSS + JSON Feed & SEO Schema",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/blogger-news/screenshot.webp",
    "summary": "Template Blogger XML Layouts v3 bergaya editorial untuk portal berita online, majalah digital, maupun blog media teknologi. Dilengkapi Breaking News Ticker otomatis dari feed JSON, layout Hero Headline Majalah 3 kolom, widget Trending/Popular Posts, estimasi waktu baca, Daftar Isi otomatis, Mode Baca Nyaman & Dark Mode, serta Schema JSON-LD NewsArticle.",
    "summaryEn": "Valid Blogger Layouts v3 XML theme built for news portals and online magazines featuring a breaking news ticker, 3-column editorial hero, auto TOC, Reader Mode, Dark Mode, and NewsArticle Schema.",
    "features": [
      "Blogger XML Layouts v3 Asli: mendukung penuh Blogger Theme Designer (<Group>/<Variable>) untuk ubah warna aksen & font tanpa coding.",
      "Breaking News Ticker & Related Posts Otomatis via JSON Feed Blogger tanpa membebani loading.",
      "Single Post Editorial Pro: Breadcrumb, Estimasi Waktu Baca, Daftar Isi (#toc) otomatis, Reading Progress Bar, Dropcap, Author Bio, & Tombol Share WA/X/Telegram.",
      "Mendukung Dark Mode, Mode Baca Nyaman (atur ukuran teks), Sticky Sidebar, dan optimasi SEO NewsArticle + WebSite JSON-LD."
    ],
    "featuresEn": [
      "Native Blogger XML Layouts v3 with full Theme Designer variable support.",
      "Breaking News ticker & automatic JSON-Feed related posts with fast loading.",
      "Pro article reading experience: Breadcrumbs, auto Table of Contents, Reading Progress Bar, font resizer, and Dark Mode.",
      "SEO optimized with NewsArticle & WebSite JSON-LD structured data."
    ],
    "deliverablesEn": [
      "Ready-to-restore Blogger XML Theme (template-blogger-news-pro.xml).",
      "Offline interactive preview bundle (HTML, CSS, JS) + setup documentation.",
      "Commercial License (LISENSI.txt)."
    ]
  },
  {
    "id": "prod-22",
    "title": "Template Blogger Ddev TokoKu v3 — Toko Online, Katalog Produk & Checkout WhatsApp / Mayar",
    "titleEn": "Ddev TokoKu v3 — E-Commerce Catalog & Checkout Blogger XML Theme",
    "categories": [
      "Template",
      "Blogger",
      "Desain Web",
      "Source Code"
    ],
    "price": "Rp 79.000",
    "oldPrice": "Rp 179.000",
    "priceUsd": "$12",
    "oldPriceUsd": "$25",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_w4QUnOE6lNeEh4jBjETTeczHI49cVvYhOxHYT3BYtw0",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/blogger-toko/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-blogger-ddev-tokoku-v3-toko.html",
    "version": "v3.0 (Blogger XML v3)",
    "stack": "Blogger XML v3 + Cart Engine + Checkout WhatsApp & Mayar",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/blogger-toko/screenshot.webp",
    "summary": "Ubah blog Blogger gratis menjadi website toko online profesional tanpa biaya hosting bulanan. Dilengkapi parser postingan pintar (.toko-meta-data & tag singkat harga/coret/stok/varian), hitung diskon otomatis, keranjang belanja persisten (Slide-over Cart Drawer), pilihan kurir ongkir, checkout terformat ke WhatsApp Admin maupun link bayar Mayar/QRIS.",
    "summaryEn": "Turn Blogger into an online store with zero hosting cost: structured post price/variant parser, persistent cart drawer, automatic discount math, WhatsApp & global checkout support.",
    "features": [
      "Parser Postingan Produk Pintar: tulis harga, harga coret, stok, varian rasa/ukuran, & link Mayar langsung di postingan Blogger.",
      "Keranjang Belanja Real-Time (localStorage) + Slide-over Cart Drawer + Sticky Bottom Cart di HP.",
      "Checkout Otomatis ke WhatsApp Admin lengkap dengan daftar belanja, varian, alamat, dan opsi kurir (JNE/J&T/Instant/COD) atau tombol Bayar Instan Mayar.",
      "Hero Promo Flash Sale, Filter Kategori Label, Sortir Harga/Diskon, Dark/Light Mode, dan Schema JSON-LD Store & Product."
    ],
    "featuresEn": [
      "Smart post metadata parser for prices, variants, stock badges, and checkout links.",
      "Real-time localStorage Shopping Cart Drawer + mobile sticky checkout bar.",
      "Direct WhatsApp & online gateway checkout flow with shipping & total calculation.",
      "Flash Sale hero, category label filtering, price/discount sorting & Dark/Light Mode."
    ],
    "deliverablesEn": [
      "Ready-to-upload Blogger XML Store Theme (template-blogger-toko-whatsapp.xml).",
      "Interactive 10-product offline storefront preview + setup guide.",
      "Commercial License (LISENSI.txt)."
    ]
  },
  {
    "id": "prod-23",
    "title": "Template Blogger Ddev Folio — Portofolio, CV Kreatif & Personal Branding Minimalis",
    "titleEn": "Ddev Folio — Swiss Minimalist Portfolio & CV Blogger XML Theme",
    "categories": [
      "Template",
      "Blogger",
      "Desain Web",
      "Source Code"
    ],
    "price": "Rp 55.000",
    "oldPrice": "Rp 129.000",
    "priceUsd": "$9",
    "oldPriceUsd": "$19",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_15xI9cJ7vIVWY90rUlIhjQ4V9yqCRI0DCdDjp3I7vrN",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/blogger-portfolio/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-blogger-ddev-folio-portofolio.html",
    "version": "v1.0 (Blogger XML v3)",
    "stack": "Blogger XML v3 + Swiss Minimalist Grid + Dark Mode",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/blogger-portfolio/screenshot.webp",
    "summary": "Template Blogger bergaya Swiss Editorial Minimalis yang dirancang khusus untuk UI/UX Designer, Web Developer, Freelancer, Fotografer, maupun Konsultan kreatif. Ubah setiap postingan Blogger menjadi halaman Studi Kasus (Case Study) portofolio lengkap, dengan profil Hero, Pengalaman Kerja, Layanan & Tarif, serta formulir kirim brief WhatsApp tanpa perlu membayar hosting tahunan.",
    "summaryEn": "Editorial Swiss-grid Blogger XML theme for designers, developers, and freelancers with label-based case studies, services & rates, printable CV layout, and Dark Mode.",
    "features": [
      "Desain Swiss Editorial High-Craft: tipografi bersih (Space Grotesk + Plus Jakarta Sans + JetBrains Mono) dan dukungan Dark/Light Mode.",
      "Showcase Karya dengan Filter Label Dinamis (UI/UX Design, Web Development, Branding, Mobile App) & Layout Studi Kasus Detail.",
      "Widget Tata Letak Editable untuk Hero Status ('Open for Freelance'), Pengalaman & Tech Stack, Paket Layanan, Testimoni, & Kontak.",
      "Tombol Preview Cetak CV (@media print rapi), Salin Email 1-Klik, Modal Kirim Brief WA, dan JSON-LD Schema Person & CreativeWork."
    ],
    "featuresEn": [
      "Swiss minimalist editorial grid featuring Space Grotesk, Plus Jakarta Sans & Dark Mode.",
      "Filterable portfolio showcase with rich Case Study layout.",
      "Editable Blogger Layout widgets for availability status, experience, services & testimonials.",
      "Clean Printable Resume/CV (@media print), 1-click email copy & Person/CreativeWork SEO Schema."
    ],
    "deliverablesEn": [
      "Ready-to-use Blogger XML Portfolio Theme (template-blogger-portfolio-cv.xml).",
      "Interactive offline demo featuring 6 case studies + printable CV preview.",
      "Setup Guide & Commercial License."
    ]
  },
  {
    "id": "prod-24",
    "title": "Template Blogger Ddev DocsPro — Dokumentasi Teknis, Tutorial Kode & Blog Developer Pro",
    "titleEn": "Ddev DocsPro — 3-Column Tech Docs & Developer Blog Blogger XML Theme",
    "categories": [
      "Template",
      "Blogger",
      "Desain Web",
      "Source Code"
    ],
    "price": "Rp 65.000",
    "oldPrice": "Rp 145.000",
    "priceUsd": "$10",
    "oldPriceUsd": "$22",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_kkGrj135F5UQzt23gUsu1QJxqTqZNTpyEgA7X0iu1GH",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/blogger-docs/",
    "postUrl": "https://asetkode.blogspot.com/2026/11/template-blogger-ddev-docspro.html",
    "version": "v1.0 (Blogger XML v3)",
    "stack": "Blogger XML v3 + 3-Col Docs Layout + Ctrl+K Search",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/blogger-docs/screenshot.webp",
    "summary": "Template Blogger kelas developer yang terinspirasi Nextra, Mintlify, dan Tailwind Docs. Mengubah Blogger menjadi situs dokumentasi API, knowledge base SaaS, catatan engineering, atau blog tutorial pemrograman profesional dengan layout 3 kolom (Sidebar Grup Collapsible per Label, Konten Artikel + Tombol Salin Kode otomatis, dan Daftar Isi kanan dengan ScrollSpy).",
    "summaryEn": "Developer-grade 3-column Blogger XML theme featuring collapsible label sidebar, Ctrl+K JSON feed search, copy-code buttons, callout blocks, ScrollSpy TOC, and TechArticle Schema.",
    "features": [
      "Layout Dokumentasi 3 Kolom Responsif: Sidebar navigasi otomatis mengelompokkan postingan berdasarkan Label Blogger via JSON Feed.",
      "Quick Search Modal (Ctrl+K) berbasis feeds JSON Blogger lengkap dengan navigasi keyboard Arrow/Enter/Esc.",
      "Komponen Penulisan Teknis Siap Pakai: Blok kode dengan tombol Salin Kode otomatis, Callout Info/Tip/Warning, Badge HTTP (GET/POST/PUT/DELETE), & Tabel API.",
      "Sticky 'Di Halaman Ini' (TOC ScrollSpy) otomatis di kanan + Navigasi Previous/Next Article + Dark/Light Mode + Schema TechArticle JSON-LD."
    ],
    "featuresEn": [
      "Responsive 3-column docs layout auto-grouping Blogger posts by Label via JSON Feed.",
      "Fast Ctrl+K keyboard Search Modal across all articles and endpoints.",
      "Developer Markdown components: Copyable Code Blocks, Callouts, HTTP Method Badges & API Tables.",
      "Sticky right-hand On-This-Page TOC ScrollSpy + Prev/Next navigation + Dark Mode."
    ],
    "deliverablesEn": [
      "Ready-to-use Blogger XML Docs Theme (template-blogger-tech-docs.xml).",
      "Interactive offline preview with 7 API docs articles & Ctrl+K search.",
      "Setup Documentation & Commercial License."
    ]
  },
  {
    "id": "prod-25",
    "title": "Website Agen Travel & Booking Wisata (NusantaraVoyage Pro)",
    "titleEn": "Travel Agency & Tour Booking Platform (NusantaraVoyage Pro)",
    "categories": [
      "Web App",
      "Template",
      "Desain Web",
      "JavaScript",
      "Source Code"
    ],
    "price": "Rp 149.000",
    "oldPrice": "Rp 329.000",
    "priceUsd": "$22",
    "oldPriceUsd": "$45",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_HRtWl54mhw3A9C4spSr2P6NBLB9Pbc1XQ0C0C40Y4se",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/travel/",
    "postUrl": "https://asetkode.blogspot.com/",
    "version": "v1.0 (Offline Booking + E-Voucher)",
    "stack": "HTML5 + CSS3 + Vanilla JS (47 Vector SVG Icons)",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/travel/screenshot.webp",
    "summary": "Platform website agen travel & sistem reservasi paket wisata siap pakai dengan 8 paket destinasi unggulan, kalkulator biaya otomatis, E-Voucher verifikasi anti-palsu (kode tanda tangan VRF-), integrasi WhatsApp, serta Admin Panel pengelola paket & pesanan ber-PIN keamanan.",
    "summaryEn": "Production-ready tour & travel agency storefront featuring 8 illustrated tour packages, dynamic pax & date booking calculator, tamper-evident VRF E-Vouchers, WhatsApp checkout, and PIN-protected Admin Panel.",
    "features": [
      "Booking Engine Interaktif 8 Paket Wisata: Filter destinasi/kategori, validasi kuota tanggal tersedia, & hitung total biaya peserta otomatis.",
      "E-Voucher Anti-Pemalsuan (VRF Signature) & Cetak Struk Siap Print untuk verifikasi tamu di lokasi penjemputan.",
      "Admin Panel Terproteksi PIN Keamanan (123456) untuk kelola daftar paket wisata, harga, kuota tanggal, & status reservasi.",
      "100% Offline-First + 47 Ikon Vektor SVG Presisi & Dukungan Dwibahasa Otomatis (?lang=en) tanpa ketergantungan server."
    ],
    "featuresEn": [
      "Interactive Booking Engine with 8 curated tour packages, real-time pax pricing & sold-out date guards.",
      "Tamper-evident VRF E-Voucher generator with printable confirmation pass & WhatsApp booking relay.",
      "PIN-gated Admin Dashboard for managing tours, departures, pricing, and customer bookings.",
      "100% Offline-First architecture with crisp custom SVG illustrations, zero external CDN dependencies & ?lang=en support."
    ],
    "deliverablesEn": [
      "Complete Unlocked HTML/CSS/JS Travel Agency Source Code + Batch Launcher.",
      "Preloaded 8 Tour Packages & Tamper-Evident E-Voucher System.",
      "Bilingual Setup Guide (EN + ID) & Commercial License."
    ]
  },
  {
    "id": "prod-26",
    "title": "Sistem HRIS, Absensi, Cuti & Payroll Karyawan (KaryaHR Pro Laravel 12)",
    "titleEn": "Enterprise HRIS, Attendance, Leave & Payroll System (Laravel 12 MVC)",
    "categories": [
      "Web App",
      "PHP",
      "Laravel",
      "Source Code"
    ],
    "price": "Rp 189.000",
    "oldPrice": "Rp 449.000",
    "priceUsd": "$29",
    "oldPriceUsd": "$59",
    "usdPaymentUrl": "https://buy.polar.sh/polar_cl_yDiCmcxEiVb15GOLipwKRIMLHWZSuPjZihApg32DLlC",
    "paymentUrl": "#checkout-mayar",
    "demoUrl": "demo/laravel-hris/",
    "postUrl": "https://asetkode.blogspot.com/",
    "version": "v1.0 (Laravel 12 + SQLite & MySQL)",
    "stack": "Laravel 12 (PHP 8.2) + Eloquent ORM + Blade + SQLite/MySQL",
    "license": "Personal & Komersial",
    "openMode": "modal",
    "demoType": "live_frame",
    "thumbnailUrl": "demo/laravel-hris/screenshot.webp",
    "summary": "Aplikasi web HRIS & penggajian berbasis framework Laravel 12 MVC asli (bukan PHP biasa). Lengkap dengan Multi-Role Auth (Admin HR, Manager, Karyawan), Direktori Departemen & Karyawan, Check-In/Out Absensi + Ekspor CSV Excel, Workflow Persetujuan Cuti Anti-Double Approve, serta Mesin Hitung Payroll Server-Side & Cetak Slip Gaji A4 bertanda tangan HMAC VRF-.",
    "summaryEn": "Production-grade Laravel 12 MVC HRIS & Payroll application featuring Role-Based Access Control (Admin HR, Manager, Employee), Department & Staff CRUD, Daily Attendance Check-In/Out with UTF-8 BOM CSV export, Leave Balance Approval Workflow, and Server-Side Payroll Engine with printable VRF-verified Pay Slips.",
    "features": [
      "Framework Laravel 12 Asli (Migrations, Eloquent ORM, Middleware Role RBAC, & 5 PHPUnit Feature Tests LOLOS).",
      "Keamanan Anti-Fraud: Hitung gaji, lembur, denda telat, BPJS 2%, PPh21, & checksum VRF- dihitung penuh di Server Laravel.",
      "SQLite Pre-Seeded Siap Klik (Buka_Aplikasi_Laravel.bat + vendor/ lengkap) + database.sql siap impor ke MySQL XAMPP/cPanel.",
      "Absensi Harian Check-In/Out, Pengajuan & Approval Cuti (saldo otomatis berkurang), & Cetak Slip Gaji A4."
    ],
    "featuresEn": [
      "Authentic Laravel 12 MVC Architecture with Migrations, Eloquent ORM, Role Middleware & passing PHPUnit Feature Tests.",
      "Anti-Fraud Server-Side Payroll Engine calculating late penalties, 2% BPJS, income tax & HMAC VRF- slip codes.",
      "Zero-Friction Pre-Seeded SQLite + included vendor/ dependencies plus MySQL database.sql schema for cPanel/VPS.",
      "Daily Check-In/Out Attendance, Leave Balance Approval Workflow, Excel UTF-8 BOM CSV Export & Printable A4 Pay Slips."
    ],
    "deliverablesEn": [
      "Complete Laravel 12 Source Code + Vendor Dependencies + Pre-Seeded SQLite DB.",
      "MySQL database.sql Schema + PHPUnit Feature Tests + 1-Click Windows Launcher.",
      "Bilingual Setup Guide (EN + ID) & Commercial License."
    ]
  }
];

const CATALOG_PAGE_SIZE = 20;
let productsState = [...FALLBACK_PRODUCTS];
let activeCategory = 'all';
let searchQuery = '';
let sortMode = 'newest';
let currentCatalogPage = 1;
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

      const rawDemoAttr = (metaEl && metaEl.getAttribute('data-demo-url')) || postUrl;
      const fbMatch = FALLBACK_PRODUCTS.find((f) => f.title.toLowerCase() === title.toLowerCase() || (f.demoUrl && normalizeLocalDemoUrl(rawDemoAttr).includes(f.demoUrl)));
      const price = (fbMatch && fbMatch.price) || (metaEl && metaEl.getAttribute('data-price')) || 'Rp 99.000';
      const oldPrice = (fbMatch && fbMatch.oldPrice) || (metaEl && metaEl.getAttribute('data-old-price')) || '';
      const priceUsd = (fbMatch && fbMatch.priceUsd) || (metaEl && metaEl.getAttribute('data-price-usd')) || '';
      const oldPriceUsd = (fbMatch && fbMatch.oldPriceUsd) || (metaEl && metaEl.getAttribute('data-old-price-usd')) || '';
      const usdPaymentUrl = (fbMatch && fbMatch.usdPaymentUrl) || (metaEl && metaEl.getAttribute('data-usd-url')) || '#checkout-usd';
      const explicitTitleEn = (metaEl && metaEl.getAttribute('data-title-en')) || '';
      const paymentUrl = (fbMatch && fbMatch.paymentUrl) || (metaEl && metaEl.getAttribute('data-payment-url')) || postUrl;
      const demoUrl = normalizeLocalDemoUrl((fbMatch && fbMatch.demoUrl) || rawDemoAttr);
      const version = (fbMatch && fbMatch.version) || (metaEl && metaEl.getAttribute('data-version')) || 'v1.0';
      const stack = (fbMatch && fbMatch.stack) || (metaEl && metaEl.getAttribute('data-stack')) || (categories.join(' • ') || 'Full Source Code');
      const license = (fbMatch && fbMatch.license) || (metaEl && metaEl.getAttribute('data-license')) || 'Personal & Komersial';
      const openMode = (metaEl && metaEl.getAttribute('data-open-mode')) || 'modal';

      let features = Array.from(featEls).map((li) => li.textContent.trim()).filter(Boolean);
      if (!features.length) {
        features = (fbMatch && fbMatch.features) || [
          '100% Full Source Code Tanpa Enkripsi (Siap Kustomisasi)',
          'Database SQL Lengkap + Dokumentasi Panduan Instalasi',
          'Pengiriman Otomatis Detik Itu Juga via Email & Web',
          'Lisensi Penggunaan Personal & Proyek Komersial'
        ];
      }

      const summaryText = descEl
        ? descEl.textContent.trim().slice(0, 175)
        : 'Source code dan karya digital siap pakai lengkap dengan dokumentasi instalasi dan database.';

      const explicitDescEn = metaEl ? metaEl.getAttribute('data-desc-en') || '' : '';
      const featuresEn = Array.from(doc.querySelectorAll('.ddev-prose-en ul li')).map((li) => li.textContent.trim()).filter(Boolean);
      const deliverablesEn = Array.from(doc.querySelectorAll('.ddev-prose-en ol li')).map((li) => li.textContent.trim()).filter(Boolean);

      const mergedCats = Array.from(new Set([...(fbMatch && Array.isArray(fbMatch.categories) ? fbMatch.categories : []), ...categories]));
      return {
        id: (fbMatch && fbMatch.id) || ('blogger-prod-' + idx),
        title,
        titleEn: explicitTitleEn || (fbMatch && fbMatch.titleEn) || '',
        categories: mergedCats.length ? mergedCats : ['Source Code'],
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
        demoType: (fbMatch && fbMatch.demoType) || (demoUrl.includes('demo/') ? 'live_frame' : inferDemoType(title, categories)),
        thumbnailUrl: (fbMatch && fbMatch.thumbnailUrl) || (firstImg ? firstImg.src : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80'),
        summary: summaryText,
        summaryEn: explicitDescEn || (fbMatch && fbMatch.summaryEn) || '',
        features,
        featuresEn: featuresEn.length ? featuresEn : (fbMatch && fbMatch.featuresEn) || [],
        deliverablesEn: deliverablesEn.length ? deliverablesEn : (fbMatch && fbMatch.deliverablesEn) || []
      };
    });

    if (syncedProducts.length > 0) {
      const syncedIds = new Set(syncedProducts.map((p) => p.id));
      const missingFallbacks = FALLBACK_PRODUCTS.filter((fb) => !syncedIds.has(fb.id));
      productsState = [...missingFallbacks, ...syncedProducts];
      renderProductsGrid();
      const statusEl = document.getElementById('catalogStatusText');
      if (statusEl) {
        statusEl.textContent = currentLocale === 'en'
          ? `Live Synced (${productsState.length} active products)`
          : `Terhubung Live (${productsState.length} produk aktif)`;
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
      statusEl.textContent = currentLocale === 'en'
        ? `Catalog Ready (${productsState.length} curated apps ready to download)`
        : `Katalog Siap (${productsState.length} produk unggulan siap diunduh)`;
    }
  };
  document.body.appendChild(script);
}

function matchesProductCategory(item, cat) {
  if (!cat || cat === 'all') return true;
  if (cat === '__saved__') return wishlistState.includes(item.id);
  const cats = (item.categories || []).map((c) => String(c).toLowerCase());
  const stack = String(item.stack || '').toLowerCase();
  const key = String(cat).toLowerCase();
  if (cats.includes(key)) return true;
  if (key === 'web app') return cats.some((c) => c === 'aplikasi' || c === 'aplikasi web' || c === 'web app');
  if (key === 'php') return cats.some((c) => c.includes('php') || c.includes('laravel')) || stack.includes('php') || stack.includes('laravel');
  if (key === 'python') return stack.includes('python');
  if (key === 'javascript') return stack.includes('javascript') || stack.includes('vanilla js') || stack.includes('modular js');
  if (key === 'blogger') return stack.includes('blogger') || cats.some((c) => c.includes('blogger'));
  if (key === 'desain web') return cats.some((c) => c.includes('desain') || c.includes('ui'));
  return false;
}

function getReadyCatalogBase() {
  return productsState.filter((item) => {
    if (!SITE_CONFIG.onlyReadyProducts) return true;
    const isReadyId = Array.isArray(SITE_CONFIG.readyIds) && SITE_CONFIG.readyIds.includes(item.id);
    const hasLocalDemo = Boolean(item.demoUrl && item.demoUrl.includes('demo/'));
    return isReadyId || hasLocalDemo;
  });
}

function updateFilterChipCounts() {
  const ready = getReadyCatalogBase();
  const isEn = currentLocale === 'en';
  const labels = {
    all: isEn ? 'All Products' : 'Semua Karya',
    'Web App': 'Web App',
    'Source Code': 'Source Code',
    PHP: 'PHP & Laravel',
    Python: 'Python',
    JavaScript: 'JavaScript',
    'Desain Web': isEn ? 'Web Design' : 'Desain Web',
    Template: isEn ? 'Templates / UI' : 'Template / UI',
    Blogger: 'Blogger XML'
  };
  document.querySelectorAll('#filterBar .filter-chip').forEach((chip) => {
    const cat = chip.getAttribute('data-cat');
    if (!cat || cat === '__saved__') return;
    const cnt = cat === 'all' ? ready.length : ready.filter((item) => matchesProductCategory(item, cat)).length;
    const baseLbl = labels[cat] || cat;
    chip.textContent = `${baseLbl} (${cnt})`;
  });
}

// ================= 2. RENDER PRODUCT CATALOG GRID =================
function renderProductsGrid() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  updateFilterChipCounts();

  let list = getReadyCatalogBase().filter((item) => {
    const matchesCat = matchesProductCategory(item, activeCategory);

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
      item.summary.toLowerCase().includes(q) ||
      (item.summaryEn && item.summaryEn.toLowerCase().includes(q)) ||
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
    const isEnEmpty = currentLocale === 'en';
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:56px 20px; background:var(--bg-surface); border:1px dashed var(--border-strong); border-radius:16px;">
        <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:6px;">${isEnEmpty ? 'No Products Found' : 'Produk Tidak Ditemukan'}</h3>
        <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:16px;">${isEnEmpty ? 'Try another search keyword or show all categories.' : 'Coba gunakan kata kunci lain atau tampilkan semua kategori.'}</p>
        <button type="button" class="btn btn-primary" onclick="resetCatalogFilter()">${isEnEmpty ? 'Show All Products' : 'Tampilkan Semua Karya'}</button>
      </div>
    `;
    renderCatalogPagination(0, 1, 0, 0);
    return;
  }

  const totalItems = list.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / CATALOG_PAGE_SIZE));
  currentCatalogPage = Math.min(Math.max(1, currentCatalogPage), totalPages);
  const startIdx = (currentCatalogPage - 1) * CATALOG_PAGE_SIZE;
  const pagedList = list.slice(startIdx, startIdx + CATALOG_PAGE_SIZE);

  grid.innerHTML = pagedList
    .map((p, idx) => {
      const disp = getProdDisplay(p);
      const disc = getDiscountPercent(p.price, p.oldPrice);
      const inCart = cartState.some((c) => c.id === p.id);
      const isSaved = wishlistState.includes(p.id);
      const primaryCat = localizeCategoryTag((p.categories && p.categories[0]) || 'Web App', disp.isEn);
      const stackLine = p.stack
        .split('+')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 2)
        .join(' · ');
      const shortVer = String(p.version || 'v1.0').split(' ')[0];
      const cartTitle = inCart ? (disp.isEn ? 'Remove from Cart' : 'Hapus dari Keranjang') : (disp.isEn ? 'Add to Cart' : 'Tambah ke Keranjang');

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="card-thumb">
            <img src="${resolveStoreAssetUrl(p.thumbnailUrl)}" alt="${disp.title}" width="640" height="360" loading="${idx < 8 ? 'eager' : 'lazy'}" decoding="async" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80';" />
            <button type="button" class="save-heart-btn ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation(); toggleWishlistById('${p.id}')" title="${disp.isEn ? 'Save product' : 'Simpan produk'}" aria-label="${disp.isEn ? 'Save product' : 'Simpan produk'}">${isSaved ? '♥' : '♡'}</button>
            ${disc > 0 ? `<span class="discount-pill">${disp.isEn ? 'SAVE' : 'HEMAT'} ${disc}%</span>` : ''}
            <div class="card-hover-overlay">
              <button type="button" class="overlay-btn primary" onclick="openLiveDemoById('${p.id}')">
                Live Demo
              </button>
              <button type="button" class="overlay-btn" onclick="openDetailById('${p.id}')">
                ${disp.isEn ? 'Details' : 'Detail'}
              </button>
            </div>
          </div>

          <div class="card-body">
            <div class="card-eyebrow">
              <span>${primaryCat}</span>
              <span class="card-ver-tag">${shortVer}</span>
            </div>
            <h3 class="card-title"><button type="button" class="title-link-btn" onclick="openDetailById('${p.id}')">${disp.title}</button></h3>
            <p class="card-desc">${disp.summary}</p>
            <div class="card-stack-line" title="${p.stack}">${stackLine || 'HTML5 · JS'}</div>

            <div class="card-footer">
              <div class="price-row">
                <div class="price-group">
                  <span class="price-current">${disp.price}</span>
                  ${disp.oldPrice ? `<span class="price-old">${disp.oldPrice}</span>` : ''}
                </div>
              </div>

              <div class="card-actions">
                <button type="button" class="btn-card" onclick="openLiveDemoById('${p.id}')" title="${disp.isEn ? 'Launch Interactive Demo' : 'Coba Live Demo'}">
                  Demo
                </button>
                <button type="button" class="btn-card buy" onclick="openInstantCheckoutById('${p.id}')">
                  ${disp.isEn ? 'Buy' : 'Beli'}
                </button>
                <button type="button" class="btn-card btn-card-cart ${inCart ? 'in-cart' : ''}" onclick="toggleCartItemById('${p.id}')" title="${cartTitle}" aria-label="${cartTitle}">
                  ${inCart
                    ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'
                    : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'}
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
  renderCatalogPagination(totalItems, totalPages, startIdx, pagedList.length);
  renderFeaturedCarousel();
  if (typeof window.observeMotionTargets === 'function') {
    window.observeMotionTargets('#productGrid .product-card');
  }
}

function renderCatalogPagination(totalItems, totalPages, startIdx, pageCount) {
  let pagEl = document.getElementById('catalogPagination');
  if (!pagEl) {
    const grid = document.getElementById('productGrid');
    if (!grid || !grid.parentNode) return;
    pagEl = document.createElement('div');
    pagEl.id = 'catalogPagination';
    pagEl.className = 'catalog-pagination';
    grid.parentNode.insertBefore(pagEl, grid.nextSibling);
  }
  if (!totalItems || totalPages <= 1) {
    pagEl.style.display = 'none';
    pagEl.innerHTML = '';
    return;
  }
  pagEl.style.display = 'flex';
  const isEn = currentLocale === 'en';
  const fromNum = startIdx + 1;
  const toNum = startIdx + pageCount;
  const infoText = isEn
    ? `Showing ${fromNum}–${toNum} of ${totalItems} products (Page ${currentCatalogPage} of ${totalPages})`
    : `Menampilkan ${fromNum}–${toNum} dari ${totalItems} produk (Halaman ${currentCatalogPage} dari ${totalPages})`;
  const pageButtons = Array.from({ length: totalPages }, (_, idx) => {
    const pNum = idx + 1;
    return `<button type="button" class="page-btn ${pNum === currentCatalogPage ? 'active' : ''}" onclick="goToCatalogPage(${pNum})">${pNum}</button>`;
  }).join('');
  pagEl.innerHTML = `
    <div class="catalog-page-info">${infoText}</div>
    <div class="catalog-page-controls">
      <button type="button" class="page-btn" ${currentCatalogPage <= 1 ? 'disabled' : ''} onclick="goToCatalogPage(${currentCatalogPage - 1})">${isEn ? '← Previous' : '← Sebelumnya'}</button>
      ${pageButtons}
      <button type="button" class="page-btn next-cta" ${currentCatalogPage >= totalPages ? 'disabled' : ''} onclick="goToCatalogPage(${currentCatalogPage + 1})">${isEn ? 'View Next Page →' : 'Lihat Halaman Selanjutnya →'}</button>
    </div>
  `;
}

window.openCustomConsultModal = function () {
  const isEn = currentLocale === 'en';
  const modal = document.getElementById('detailModal');
  const titleEl = document.getElementById('detailModalTitle');
  const bodyEl = document.getElementById('detailModalBody');
  if (!modal || !bodyEl) return;

  const email = SITE_CONFIG.orderEmail || 'dekamayooo@gmail.com';
  if (titleEl) titleEl.textContent = isEn ? 'Custom Project Consultation' : 'Konsultasi Custom Project & Modifikasi';

  bodyEl.innerHTML = `
    <div style="display:grid; gap:14px; max-width:620px; margin:0 auto;">
      <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6;">
        ${isEn
          ? 'Describe your custom web app, feature modification, or branding needs below. Send directly via <strong>Gmail Web</strong> or copy the formatted brief.'
          : 'Tuliskan kebutuhan aplikasi khusus, modifikasi fitur, atau kustomisasi logo/domain Anda. Kirim langsung lewat <strong>Gmail Web</strong> atau salin format brief ke clipboard.'}
      </p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div>
          <label for="custConsultName" style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">${isEn ? 'Your Name' : 'Nama Anda'}</label>
          <input id="custConsultName" type="text" autocomplete="name" placeholder="${isEn ? 'e.g. Alex / Acme Studio' : 'Misal: Budi / Toko Maju'}" style="width:100%; padding:10px 12px; border-radius:10px; border:1px solid var(--border-strong); background:var(--bg-surface); color:var(--text-primary);" />
        </div>
        <div>
          <label for="custConsultContact" style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">${isEn ? 'Email / WhatsApp' : 'Email / No. WhatsApp'}</label>
          <input id="custConsultContact" type="text" autocomplete="email" placeholder="${isEn ? 'you@domain.com' : '0812xxx / email@domain.com'}" style="width:100%; padding:10px 12px; border-radius:10px; border:1px solid var(--border-strong); background:var(--bg-surface); color:var(--text-primary);" />
        </div>
      </div>
      <div>
        <label for="custConsultType" style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">${isEn ? 'Project Type' : 'Jenis Kebutuhan'}</label>
        <select id="custConsultType" style="width:100%; padding:10px 12px; border-radius:10px; border:1px solid var(--border-strong); background:var(--bg-surface); color:var(--text-primary);">
          <option value="${isEn ? 'Customize Existing Ddev Studio App' : 'Modifikasi Aplikasi Ddev Studio'}">${isEn ? 'Customize Existing Ddev Studio App' : 'Modifikasi Aplikasi Ddev Studio (Logo/Fitur)'}</option>
          <option value="${isEn ? 'Build Custom Web / POS / Booking App' : 'Pembuatan Sistem Web / POS / Travel Baru'}">${isEn ? 'Build Custom Web / POS / Booking App' : 'Pembuatan Sistem Web / POS / Travel Baru'}</option>
          <option value="${isEn ? 'Custom Blogger XML Theme / Integration' : 'Integrasi Payment Gateway / API / Blogger'}">${isEn ? 'Custom Blogger XML Theme / API Integration' : 'Integrasi Payment Gateway / API / Blogger'}</option>
        </select>
      </div>
      <div>
        <label for="custConsultNotes" style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">${isEn ? 'Feature & Requirement Details' : 'Detail Fitur / Deskripsi Singkat'}</label>
        <textarea id="custConsultNotes" rows="4" placeholder="${isEn ? 'Describe features, deadline, or target budget...' : 'Ceritakan fitur yang diinginkan, estimasi waktu, atau produk referensi...'}" style="width:100%; padding:10px 12px; border-radius:10px; border:1px solid var(--border-strong); background:var(--bg-surface); color:var(--text-primary); resize:vertical;"></textarea>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:10px; padding-top:4px;">
        <button type="button" class="btn btn-primary" id="custSendGmailBtn">${isEn ? 'Open Gmail Web & Send →' : 'Kirim via Gmail Web →'}</button>
        <button type="button" class="btn btn-ghost" id="custCopyBriefBtn">${isEn ? 'Copy Email & Brief' : 'Salin Brief & Email'}</button>
        <a id="custMailtoFallback" class="btn btn-ghost" href="mailto:${email}">${isEn ? 'Default Mail App' : 'Aplikasi Email'}</a>
      </div>
      <div style="font-size:0.78rem; color:var(--text-muted);">
        ${isEn ? 'Direct admin email:' : 'Email admin langsung:'} <strong>${email}</strong>
      </div>
    </div>
  `;

  const buildConsultText = () => {
    const nm = (document.getElementById('custConsultName')?.value || '').trim() || '-';
    const ct = (document.getElementById('custConsultContact')?.value || '').trim() || '-';
    const tp = document.getElementById('custConsultType')?.value || 'Custom Project';
    const nt = (document.getElementById('custConsultNotes')?.value || '').trim() || '-';
    const subj = `Custom Project Inquiry: ${tp} - Ddev Studio`;
    const body = isEn
      ? `Hi Ddev Studio Team,\n\nI would like to request a custom project:\n- Name: ${nm}\n- Contact: ${ct}\n- Type: ${tp}\n- Details:\n${nt}\n\nLooking forward to your quote and timeline.`
      : `Halo Tim Ddev Studio,\n\nSaya ingin konsultasi pembuatan/modifikasi custom project:\n- Nama: ${nm}\n- Kontak: ${ct}\n- Jenis Kebutuhan: ${tp}\n- Detail Kebutuhan:\n${nt}\n\nMohon info estimasi biaya dan waktu pengerjaannya. Terima kasih!`;
    return { subj, body };
  };

  const syncMailto = () => {
    const { subj, body } = buildConsultText();
    const link = document.getElementById('custMailtoFallback');
    if (link) link.href = `mailto:${email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  };
  ['custConsultName', 'custConsultContact', 'custConsultType', 'custConsultNotes'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', syncMailto);
  });
  syncMailto();

  document.getElementById('custSendGmailBtn')?.addEventListener('click', () => {
    const { subj, body } = buildConsultText();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank', 'noopener');
  });

  document.getElementById('custCopyBriefBtn')?.addEventListener('click', () => {
    const { subj, body } = buildConsultText();
    const full = `To: ${email}\nSubject: ${subj}\n\n${body}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(full).then(() => {
        showToast(isEn ? 'Brief & email copied!' : 'Brief & email admin tersalin!');
      });
    }
  });

  modal.classList.add('open');
};

window.goToCatalogPage = function (pageNum) {
  currentCatalogPage = Math.max(1, Number(pageNum) || 1);
  renderProductsGrid();
  const kat = document.getElementById('katalog');
  if (kat) kat.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const FEATURED_CAROUSEL_IDS = ['prod-26', 'prod-25', 'prod-1', 'prod-4', 'prod-19', 'prod-18', 'prod-20', 'prod-16', 'prod-24', 'prod-6'];
let spotlightPicks = [];
let spotlightActiveIdx = 0;

function getSpotlightPicks() {
  const picks = [];
  FEATURED_CAROUSEL_IDS.forEach((id) => {
    const found = productsState.find((p) => p.id === id);
    if (found) picks.push(found);
  });
  productsState.forEach((p) => {
    if (picks.length < 10 && !picks.some((x) => x.id === p.id)) picks.push(p);
  });
  return picks;
}

function renderSpotlightSlide(animate = false) {
  const slideEl = document.getElementById('spotlightSlide');
  const dotsEl = document.getElementById('spotlightDots');
  const counterEl = document.getElementById('carouselCounter');
  if (!slideEl || !spotlightPicks.length) return;

  const total = spotlightPicks.length;
  spotlightActiveIdx = ((spotlightActiveIdx % total) + total) % total;
  const p = spotlightPicks[spotlightActiveIdx];
  const curSpotKey = `${p.id}|${currentLocale}`;
  if (!animate && slideEl.dataset.spotKey === curSpotKey && slideEl.querySelector('.spotlight-media img')) {
    return;
  }
  slideEl.dataset.spotKey = curSpotKey;
  const disp = getProdDisplay(p);
  const cat = localizeCategoryTag((p.categories && p.categories[0]) || 'Web App', disp.isEn);
  const disc = getDiscountPercent(p.price, p.oldPrice);
  const stackText = String(p.stack || '')
    .split('+')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(' • ') || 'HTML5 • JS';

  const isNew = spotlightActiveIdx === 0;
  const tagLabel = isNew
    ? (disp.isEn ? 'NEW RELEASE' : 'RILIS TERBARU')
    : spotlightActiveIdx <= 2
      ? (disp.isEn ? 'BEST SELLER' : 'PRODUK UNGGULAN')
      : (disp.isEn ? `SPOTLIGHT #${spotlightActiveIdx + 1}` : `SOROTAN #${spotlightActiveIdx + 1}`);

  slideEl.classList.remove('is-animating');
  if (animate) void slideEl.offsetWidth;

  slideEl.innerHTML = `
    <button type="button" class="spotlight-media" onclick="openLiveDemoById('${p.id}')" aria-label="${cat}: Preview Live Demo ${disp.title}">
      <img src="${resolveStoreAssetUrl(p.thumbnailUrl)}" alt="${disp.title}" width="640" height="400" loading="eager" fetchpriority="high" decoding="sync" />
      <span class="spotlight-media-badge">${cat}</span>
    </button>
    <div class="spotlight-content">
      <div class="spotlight-eyebrow">
        <span class="spotlight-pill ${isNew ? 'is-new' : ''}">${tagLabel}</span>
        <span class="spotlight-stack">${stackText}</span>
      </div>
      <h2 class="spotlight-title"><button type="button" class="title-link-btn" onclick="openDetailById('${p.id}')">${disp.title}</button></h2>
      <p class="spotlight-desc">${disp.summary}</p>
      <div class="spotlight-metrics">
        <div>
          <div class="spotlight-metric-val is-price">
            <span>${disp.price}</span>
            ${disp.oldPrice ? `<span class="spotlight-old-price">${disp.oldPrice}</span>` : ''}
          </div>
          <div class="spotlight-metric-lbl">${disc > 0 ? (disp.isEn ? `One-Time License • Save ${disc}%` : `Sekali Bayar • Hemat ${disc}%`) : (disp.isEn ? 'One-Time Commercial License' : 'Lisensi Sekali Bayar Selamanya')}</div>
        </div>
        <div>
          <div class="spotlight-metric-val">100% Open Code</div>
          <div class="spotlight-metric-lbl">${disp.isEn ? 'Full .ZIP + Interactive Demo' : 'File .ZIP Lengkap & Live Demo'}</div>
        </div>
      </div>
      <div class="spotlight-actions">
        <button type="button" class="spotlight-btn-demo" onclick="openLiveDemoById('${p.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"/></svg>
          <span>${disp.isEn ? 'Preview Live Demo' : 'Preview Live Demo'}</span>
        </button>
        <button type="button" class="spotlight-btn-buy" onclick="openInstantCheckoutById('${p.id}')">
          ${disp.isEn ? `Buy Source Code` : `Beli Source Code`}
        </button>
      </div>
    </div>
  `;

  if (animate) slideEl.classList.add('is-animating');

  if (counterEl) {
    counterEl.textContent = `${String(spotlightActiveIdx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  }

  if (dotsEl) {
    dotsEl.innerHTML = spotlightPicks
      .map((item, idx) => {
        const itemDisp = getProdDisplay(item);
        return `<button type="button" role="tab" class="s-dot ${idx === spotlightActiveIdx ? 'active' : ''}" data-idx="${idx}" aria-label="${itemDisp.title}" aria-selected="${idx === spotlightActiveIdx ? 'true' : 'false'}"></button>`;
      })
      .join('');
    dotsEl.querySelectorAll('.s-dot').forEach((btn) => {
      btn.addEventListener('click', () => {
        spotlightActiveIdx = Number(btn.getAttribute('data-idx')) || 0;
        renderSpotlightSlide(true);
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const nextIdx = (spotlightActiveIdx + (e.key === 'ArrowRight' ? 1 : -1) + total) % total;
        spotlightActiveIdx = nextIdx;
        renderSpotlightSlide(true);
        const focusBtn = dotsEl.querySelector(`.s-dot[data-idx="${nextIdx}"]`);
        if (focusBtn) focusBtn.focus();
      });
    });
  }
}

function renderFeaturedCarousel() {
  spotlightPicks = getSpotlightPicks();
  renderSpotlightSlide(false);
}

function initFeaturedCarouselControls() {
  const section = document.getElementById('featuredCarouselSection');
  const prev = document.getElementById('carouselPrevBtn');
  const next = document.getElementById('carouselNextBtn');
  if (!section) return;

  if (prev) prev.addEventListener('click', () => {
    spotlightActiveIdx -= 1;
    renderSpotlightSlide(true);
  });
  if (next) next.addEventListener('click', () => {
    spotlightActiveIdx += 1;
    renderSpotlightSlide(true);
  });

  let paused = false;
  section.addEventListener('mouseenter', () => { paused = true; });
  section.addEventListener('mouseleave', () => { paused = false; });
  section.addEventListener('touchstart', () => { paused = true; }, { passive: true });
  section.addEventListener('touchend', () => { paused = false; }, { passive: true });
  setInterval(() => {
    if (paused || !spotlightPicks.length) return;
    spotlightActiveIdx += 1;
    renderSpotlightSlide(true);
  }, 5000);
}

window.resetCatalogFilter = function () {
  activeCategory = 'all';
  searchQuery = '';
  currentCatalogPage = 1;
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
  const disp = getProdDisplay(prod);

  const modal = document.getElementById('demoSimModal');
  const titleEl = document.getElementById('demoSimTitle');
  const stageEl = document.getElementById('demoViewportStage');
  const buyBtn = document.getElementById('demoSimBuyBtn');

  if (titleEl) titleEl.textContent = `Interactive Preview: ${disp.title}`;
  if (buyBtn) {
    buyBtn.textContent = disp.isEn ? `Buy Source Code (${disp.price})` : `Beli Source Code (${disp.price})`;
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
  const disp = getProdDisplay(prod);

  if (type === 'live_frame' || (prod.demoUrl && prod.demoUrl.includes('demo/'))) {
    const targetDemoUrl = localizeDemoUrl(prod.demoUrl);
    return `
      <div style="width:100%; height:620px; position:relative; background:#09090b;">
        <div style="background:#09090b; color:#fff; padding:10px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a;">
          <div style="display:flex; align-items:center; gap:8px; min-width:0;">
            <span style="display:inline-block; width:8px; height:8px; flex-shrink:0; border-radius:50%; background:#10b981;"></span>
            <span style="font-size:0.8rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">LIVE PREVIEW: ${disp.title}</span>
          </div>
          <a href="${targetDemoUrl}" target="_blank" rel="noopener" style="background:#fff; color:#09090b; padding:4px 12px; border-radius:6px; font-size:0.75rem; font-weight:700; text-decoration:none; white-space:nowrap; flex-shrink:0;">${disp.isEn ? 'Open Fullscreen ↗' : 'Buka Layar Penuh ↗'}</a>
        </div>
        <iframe src="${targetDemoUrl}" style="width:100%; height:calc(100% - 41px); border:0; background:#fff;" allow="autoplay; clipboard-write"></iframe>
      </div>
    `;
  }

  if (type === 'pos') {
    const isEnPos = disp.isEn;
    return `
      <div style="font-family:'Plus Jakarta Sans',sans-serif; background:#fafafa; min-height:540px; color:#09090b;">
        <div style="background:#09090b; color:#fff; padding:14px 22px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="background:#ffffff; color:#09090b; padding:4px 10px; border-radius:6px; font-weight:800; font-size:0.76rem; font-family:'JetBrains Mono',monospace;">POS CASHIER PRO v2.4</span>
            <span style="font-size:0.82rem; color:#a1a1aa;">${isEnPos ? 'Main Branch • Staff: Admin Demo' : 'Cabang Utama • Kasir: Admin Demo'}</span>
          </div>
          <span style="font-size:0.74rem; background:#27272a; color:#fafafa; padding:4px 10px; border-radius:99px; font-weight:700;">● Thermal Printer Ready</span>
        </div>

        <div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:18px; padding:20px;">
          <div>
            <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
              <strong style="font-size:0.92rem;">${isEnPos ? 'Click Menu Items to Add to Receipt:' : 'Klik Menu untuk Tambah ke Struk Kasir:'}</strong>
              <span style="font-size:0.74rem; color:#71717a;">${isEnPos ? 'Real-Time Interactive Preview' : 'Simulasi Interaktif Real-Time'}</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:10px;">
              <button type="button" class="pos-sim-item" data-name="Iced Palm Latte" data-price="18000" data-usd="3" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">${isEnPos ? 'Iced Palm Latte' : 'Kopi Susu Aren'}</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">${isEnPos ? '$3.00' : 'Rp 18.000'}</div>
              </button>
              <button type="button" class="pos-sim-item" data-name="Butter Croissant" data-price="24000" data-usd="4" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">${isEnPos ? 'Butter Croissant' : 'Croissant Butter'}</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">${isEnPos ? '$4.00' : 'Rp 24.000'}</div>
              </button>
              <button type="button" class="pos-sim-item" data-name="Matcha Latte Ice" data-price="22000" data-usd="4" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">Matcha Latte Ice</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">${isEnPos ? '$4.00' : 'Rp 22.000'}</div>
              </button>
              <button type="button" class="pos-sim-item" data-name="Beef Burger Deluxe" data-price="35000" data-usd="6" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">Beef Burger Deluxe</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">${isEnPos ? '$6.00' : 'Rp 35.000'}</div>
              </button>
              <button type="button" class="pos-sim-item" data-name="French Fries Crispy" data-price="16000" data-usd="3" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">French Fries Crispy</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">${isEnPos ? '$3.00' : 'Rp 16.000'}</div>
              </button>
              <button type="button" class="pos-sim-item" data-name="Mineral Water" data-price="8000" data-usd="1" style="background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px; text-align:left; cursor:pointer;">
                <div style="font-weight:700; font-size:0.84rem; color:#09090b;">Mineral Water</div>
                <div style="color:#52525b; font-weight:800; font-size:0.8rem; margin-top:4px; font-family:'JetBrains Mono',monospace;">${isEnPos ? '$1.00' : 'Rp 8.000'}</div>
              </button>
            </div>
          </div>

          <div style="background:#fff; border:1px solid #e4e4e7; border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-weight:800; font-size:0.9rem; padding-bottom:10px; border-bottom:1px dashed #d4d4d8; display:flex; justify-content:space-between;">
                <span>${isEnPos ? 'Receipt #INV-8092' : 'Struk Transaksi #INV-8092'}</span>
                <button type="button" id="posResetBtn" style="font-size:0.72rem; color:#52525b; text-decoration:underline; background:none; border:none; cursor:pointer; font-weight:700;">Reset</button>
              </div>
              <div id="posReceiptList" style="margin:12px 0; max-height:210px; overflow-y:auto; font-size:0.82rem;">
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f4f4f5;">
                  <span>1x ${isEnPos ? 'Iced Palm Latte' : 'Kopi Susu Aren'}</span>
                  <strong>${isEnPos ? '$3.00' : 'Rp 18.000'}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f4f4f5;">
                  <span>1x ${isEnPos ? 'Butter Croissant' : 'Croissant Butter'}</span>
                  <strong>${isEnPos ? '$4.00' : 'Rp 24.000'}</strong>
                </div>
              </div>
            </div>
            <div style="border-top:2px solid #09090b; padding-top:12px;">
              <div style="display:flex; justify-content:space-between; font-size:0.98rem; font-weight:800; margin-bottom:12px; font-family:'JetBrains Mono',monospace;">
                <span>${isEnPos ? 'Total Bill:' : 'Total Tagihan:'}</span>
                <span id="posTotalVal">${isEnPos ? '$7.00' : 'Rp 42.000'}</span>
              </div>
              <button type="button" id="posPrintBtn" style="width:100%; background:#09090b; color:#fff; border:none; padding:11px; border-radius:8px; font-weight:800; cursor:pointer;">
                ${isEnPos ? 'Checkout &amp; Print Thermal Receipt' : 'Bayar QRIS &amp; Cetak Struk Thermal'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'dashboard' || type === 'ecom') {
    const isEnDash = disp.isEn;
    return `
      <div style="font-family:'Plus Jakarta Sans',sans-serif; background:#09090b; min-height:540px; color:#fafafa; padding:22px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid #27272a;">
          <div>
            <span style="background:#27272a; color:#fafafa; padding:4px 10px; border-radius:6px; font-size:0.72rem; font-weight:800; font-family:'JetBrains Mono',monospace;">LIVE INTERACTIVE DASHBOARD</span>
            <h3 style="font-size:1.12rem; font-weight:800; margin-top:6px;">${disp.title}</h3>
          </div>
          <div style="font-size:0.78rem; color:#a1a1aa; font-weight:700;">● Real-Time Analytics Active</div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-bottom:22px;">
          <div style="background:#18181b; border:1px solid #27272a; padding:16px; border-radius:12px;">
            <div style="font-size:0.74rem; color:#a1a1aa;">${isEnDash ? 'Monthly Revenue' : 'Total Pendapatan Bulan Ini'}</div>
            <div style="font-size:1.3rem; font-weight:800; color:#fafafa; margin-top:4px; font-family:'JetBrains Mono',monospace;">${isEnDash ? '$4,890.00' : 'Rp 48.920.000'}</div>
            <div style="font-size:0.72rem; color:#a1a1aa; margin-top:4px;">${isEnDash ? '▲ +28.4% vs last month' : '▲ +28.4% vs bulan lalu'}</div>
          </div>
          <div style="background:#18181b; border:1px solid #27272a; padding:16px; border-radius:12px;">
            <div style="font-size:0.74rem; color:#a1a1aa;">${isEnDash ? 'Paid Orders' : 'Pesanan Lunas (QRIS/VA)'}</div>
            <div style="font-size:1.3rem; font-weight:800; color:#fafafa; margin-top:4px; font-family:'JetBrains Mono',monospace;">342 Orders</div>
            <div style="font-size:0.72rem; color:#a1a1aa; margin-top:4px;">${isEnDash ? 'Checkout Conversion 94.2%' : 'Konversi Checkout 94.2%'}</div>
          </div>
          <div style="background:#18181b; border:1px solid #27272a; padding:16px; border-radius:12px;">
            <div style="font-size:0.74rem; color:#a1a1aa;">${isEnDash ? 'Active Users' : 'Pelanggan Aktif'}</div>
            <div style="font-size:1.3rem; font-weight:800; color:#fafafa; margin-top:4px; font-family:'JetBrains Mono',monospace;">1,284 Users</div>
            <div style="font-size:0.72rem; color:#a1a1aa; margin-top:4px;">${isEnDash ? 'Commercial License Included' : 'Lisensi Termasuk Source Code'}</div>
          </div>
        </div>

        <div style="background:#18181b; border:1px solid #27272a; border-radius:12px; padding:18px;">
          <div style="font-weight:700; font-size:0.86rem; margin-bottom:12px;">${isEnDash ? 'Latest Automated Transactions' : 'Transaksi Otomatis Terbaru'}</div>
          <div style="display:grid; gap:8px; font-size:0.8rem; font-family:'JetBrains Mono',monospace;">
            <div style="display:flex; justify-content:space-between; padding:10px 12px; background:#09090b; border:1px solid #27272a; border-radius:8px;">
              <span>#ORD-9921 • ${isEnDash ? 'Polar / Card Checkout' : 'Pembayaran QRIS Otomatis'}</span>
              <span style="color:#fafafa; font-weight:700;">${isEnDash ? 'PAID • $25.00' : 'LUNAS • Rp 169.000'}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:10px 12px; background:#09090b; border:1px solid #27272a; border-radius:8px;">
              <span>#ORD-9920 • ${isEnDash ? 'Apple Pay / Stripe' : 'Virtual Account BCA'}</span>
              <span style="color:#fafafa; font-weight:700;">${isEnDash ? 'PAID • $14.00' : 'LUNAS • Rp 149.000'}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:10px 12px; background:#09090b; border:1px solid #27272a; border-radius:8px;">
              <span>#ORD-9919 • PayPal Express</span>
              <span style="color:#fafafa; font-weight:700;">${isEnDash ? 'PAID • $12.00' : 'LUNAS • Rp 89.000'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'bot') {
    const isEnBot = disp.isEn;
    return `
      <div style="font-family:'JetBrains Mono',monospace; background:#09090b; min-height:540px; color:#e4e4e7; padding:24px;">
        <div style="background:#18181b; border:1px solid #27272a; border-radius:12px; padding:18px;">
          <div style="color:#ffffff; font-weight:700; margin-bottom:12px;">$ python main_automation_bot.py --mode=production</div>
          <div style="font-size:0.8rem; line-height:1.75; color:#a1a1aa;">
            <div>[09:00:01] Initializing <strong style="color:#fff;">${disp.title}</strong>...</div>
            <div>[09:00:02] ✓ Loaded config.json &amp; multi-thread worker pool (8 threads)</div>
            <div>[09:00:03] ✓ Fetching target data &amp; running automation pipeline...</div>
            <div style="color:#fafafa;">[09:00:04] → Processed 250 records → Exported to /output/report_export.xlsx</div>
            <div style="color:#ffffff;">[09:00:05] ✓ Telegram Webhook Notification Sent: "Daily Job Completed (250 Rows)"</div>
            <div style="margin-top:16px; padding:12px; background:#09090b; border:1px solid #3f3f46; border-radius:8px; color:#fafafa;">
              ✓ ${isEnBot ? 'Full Python Source Code (.py) + requirements.txt + SETUP_GUIDE_EN_ID.md included in download.' : 'Full Source Code Python (.py) + Requirements.txt + Panduan Instalasi disertakan di dalam paket download.'}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div style="font-family:'Plus Jakarta Sans',sans-serif; background:#09090b; min-height:540px; color:#fff; padding:36px 24px; text-align:center;">
      <span style="background:#27272a; color:#fafafa; padding:6px 14px; border-radius:99px; font-size:0.74rem; font-weight:800; font-family:'JetBrains Mono',monospace;">LIGHTHOUSE SCORE 99/100 • UI TEMPLATE</span>
      <h2 style="font-size:1.95rem; font-weight:800; max-width:640px; margin:16px auto 12px; line-height:1.2;">${disp.title}</h2>
      <p style="color:#a1a1aa; max-width:540px; margin:0 auto 24px; font-size:0.92rem;">${disp.summary}</p>
      <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-bottom:32px;">
        <span style="background:#ffffff; color:#09090b; padding:10px 20px; border-radius:8px; font-weight:800; font-size:0.84rem;">Responsive Desktop, Tablet &amp; Mobile</span>
        <span style="background:#18181b; border:1px solid #27272a; padding:10px 20px; border-radius:8px; font-weight:700; font-size:0.84rem;">Clean Unencrypted Code</span>
      </div>
      <div style="max-width:760px; margin:0 auto; border-radius:14px; overflow:hidden; border:1px solid #27272a;">
        <img src="${resolveStoreAssetUrl(prod.thumbnailUrl)}" alt="${disp.title}" style="width:100%; max-height:320px; object-fit:cover; display:block; filter:grayscale(100%);" />
      </div>
    </div>
  `;
}

function bindPosSimulatorEvents() {
  const isEnPos = currentLocale === 'en';
  let currentTotal = isEnPos ? 7 : 42000;
  const listEl = document.getElementById('posReceiptList');
  const totalEl = document.getElementById('posTotalVal');
  const resetBtn = document.getElementById('posResetBtn');
  const printBtn = document.getElementById('posPrintBtn');

  document.querySelectorAll('.pos-sim-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const unitAmt = isEnPos ? parseFloat(btn.getAttribute('data-usd') || '3') : parseInt(btn.getAttribute('data-price') || '0', 10);
      currentTotal += unitAmt;
      if (listEl) {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f4f4f5;';
        row.innerHTML = `<span>1x ${name}</span><strong>${isEnPos ? ('$' + unitAmt.toFixed(2)) : formatRupiah(unitAmt)}</strong>`;
        listEl.appendChild(row);
        listEl.scrollTop = listEl.scrollHeight;
      }
      if (totalEl) totalEl.textContent = isEnPos ? ('$' + currentTotal.toFixed(2)) : formatRupiah(currentTotal);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentTotal = 0;
      if (listEl) {
        listEl.innerHTML = isEnPos
          ? '<div style="color:#71717a; padding:12px 0; text-align:center;">Click items on the left to test live POS checkout.</div>'
          : '<div style="color:#71717a; padding:12px 0; text-align:center;">Klik item di sebelah kiri untuk simulasi transaksi kasir.</div>';
      }
      if (totalEl) totalEl.textContent = isEnPos ? '$0.00' : 'Rp 0';
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      printBtn.textContent = isEnPos ? '✓ Receipt Printed! Ready to Purchase Full Source Code' : '✓ Struk Tercetak! Silakan Beli Source Code Ini';
    });
  }
}

// ================= 4. PRODUCT DETAIL & FILE INSPECTOR MODAL =================
window.openDetailById = function (productId) {
  const prod = productsState.find((p) => p.id === productId);
  if (!prod) return;
  const disp = getProdDisplay(prod);

  const modal = document.getElementById('detailModal');
  const titleEl = document.getElementById('detailModalTitle');
  const bodyEl = document.getElementById('detailModalBody');

  if (titleEl) titleEl.textContent = disp.title;
  if (bodyEl) {
    const disc = getDiscountPercent(prod.price, prod.oldPrice);
    bodyEl.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:22px; align-items:start;">
        <div>
          <div style="border-radius:12px; overflow:hidden; border:1px solid var(--border-color); background:var(--bg-elevated); aspect-ratio:16/10; margin-bottom:16px;">
            <img src="${resolveStoreAssetUrl(prod.thumbnailUrl)}" alt="${disp.title}" style="width:100%; height:100%; object-fit:cover; display:block;" />
          </div>
          <div style="background:#09090b; border:1px solid #27272a; border-radius:12px; padding:14px; color:#fafafa;">
            <div style="font-size:0.74rem; font-weight:800; color:#a1a1aa; margin-bottom:8px; font-family:var(--font-mono);">${disp.isEn ? 'WHAT\x27S INCLUDED (.ZIP BUNDLE):' : 'ISI PAKET UNDUHAN (.ZIP):'}</div>
            <ul class="zip-tree">
              <li class="zip-row"><span>/full-source-code/ (${prod.stack})</span><span class="zip-badge">Unlocked</span></li>
              ${Array.isArray(disp.deliverables) && disp.deliverables.length > 0
                ? disp.deliverables.map((dItem) => `<li class="zip-row"><span>${escAiHtml(dItem)}</span><span class="zip-badge">Included</span></li>`).join('')
                : `<li class="zip-row"><span>${/mysql|sql|php/i.test(prod.stack || '') ? '/database/database.sql' : (disp.isEn ? '/LICENSE_COMMERCIAL.txt' : '/LISENSI.txt')}</span><span class="zip-badge">Ready</span></li>
                   <li class="zip-row"><span>${disp.isEn ? 'SETUP_GUIDE_EN_ID.md' : 'PANDUAN.md'}</span><span class="zip-badge">${disp.isEn ? 'English + ID' : 'Bahasa ID'}</span></li>`
              }
            </ul>
          </div>
        </div>

        <div>
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
            <span class="spotlight-pill">${localizeCategoryTag(prod.categories[0] || 'Web App', disp.isEn)}</span>
            <span style="font-family:var(--font-mono); font-size:0.74rem; color:var(--text-muted);">${prod.version}${prod.categories.length > 1 ? ' · ' + prod.categories.slice(1, 3).map((c) => localizeCategoryTag(c, disp.isEn)).join(' · ') : ''}</span>
          </div>

          <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:16px; line-height:1.65;">
            ${disp.summary}
          </p>

          <div style="margin-bottom:18px;">
            <div style="font-size:0.82rem; font-weight:800; margin-bottom:8px;">${disp.isEn ? 'Key Features Included:' : 'Fitur Unggulan yang Anda Dapatkan:'}</div>
            <ul style="list-style:none; display:grid; gap:7px; font-size:0.84rem; color:var(--text-secondary);">
              ${disp.features.map((f) => `<li>✓ ${f}</li>`).join('')}
            </ul>
          </div>

          <div style="background:var(--bg-elevated); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
              <div>
                <div style="font-size:0.74rem; color:var(--text-muted);">${disp.isEn ? 'Full Source Code &amp; Commercial License:' : 'Harga Lisensi &amp; Source Code:'}</div>
                <div style="display:flex; align-items:baseline; gap:8px;">
                  <span class="price-current" style="font-size:1.5rem;">${disp.price}</span>
                  ${disp.oldPrice ? `<span class="price-old">${disp.oldPrice}</span>` : ''}
                </div>
              </div>
              ${disc > 0 ? `<span class="discount-pill" style="position:static;">${disp.isEn ? 'SAVE' : 'HEMAT'} ${disc}%</span>` : ''}
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
              <button type="button" class="btn btn-ghost" onclick="closeModal('detailModal'); openLiveDemoById('${prod.id}')">
                Live Demo
              </button>
              <button type="button" class="btn btn-primary" onclick="closeModal('detailModal'); openInstantCheckoutById('${prod.id}')">
                ${disp.isEn ? 'Buy &amp; Download' : 'Beli &amp; Download'}
              </button>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
              <button type="button" class="btn btn-ghost" style="padding:8px 10px; font-size:0.78rem;" onclick="toggleWishlistById('${prod.id}'); openDetailById('${prod.id}')">
                ${wishlistState.includes(prod.id) ? (disp.isEn ? '♥ Saved' : '♥ Disimpan') : (disp.isEn ? '♡ Save' : '♡ Simpan')}
              </button>
              <button type="button" class="btn btn-ghost" style="padding:8px 10px; font-size:0.78rem;" onclick="copyProductLinkById('${prod.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                <span>${disp.isEn ? 'Copy Link' : 'Salin Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      ${buildRelatedProductsHtml(prod, disp.isEn)}
    `;
  }

  if (modal) modal.classList.add('open');
};

// ================= 5. SHOPPING CART (TRANSPARENT INDIVIDUAL PRICING) =================
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_CART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) || [];
      cartState = Array.isArray(parsed) ? parsed.filter((c) => c && c.id !== 'vip-bundle-all') : [];
    }
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
    showToast(currentLocale === 'en' ? 'Removed from cart.' : 'Produk dihapus dari keranjang.');
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
  showToast(currentLocale === 'en' ? 'Item removed from cart.' : 'Item dihapus dari keranjang.');
  saveCartToStorage();
};

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
        <p style="font-size:0.8rem;">Pick any source code or web app you need with transparent individual pricing.</p>
      </div>
    `
      : `
      <div style="text-align:center; padding:48px 16px; color:var(--text-secondary);">
        <div style="font-weight:800; font-size:0.95rem; margin-bottom:4px; color:var(--text-primary);">Keranjang Anda Masih Kosong</div>
        <p style="font-size:0.8rem;">Pilih source code atau aplikasi yang Anda butuhkan dengan harga satuan transparan.</p>
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
        <button type="button" class="close-x" onclick="removeCartItemById('${item.id}')" title="${isEn ? 'Remove' : 'Hapus'}" aria-label="${isEn ? 'Remove' : 'Hapus'}">×</button>
      </div>
    `;
      }
    )
    .join('');

  const finalTotal = cartState.reduce((acc, item) => acc + (isEn ? (item.priceUsdNum || idrToCleanUsdNum(item.priceNum)) : (item.priceNum || 0)), 0);
  const fmtTotal = isEn ? formatUsd : formatRupiah;

  if (hintEl) {
    hintEl.textContent = isEn
      ? `✓ Transparent individual pricing (${cartState.length} ${cartState.length === 1 ? 'item' : 'items'})`
      : `✓ Harga satuan transparan (${cartState.length} produk)`;
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

  if (isUsdMode) {
    const subj = `International Order (${order.price} USD): ${order.title}`;
    const body = `Hello ${SITE_CONFIG.brandName},\n\nI would like to purchase:\n- Product: ${order.title}\n- Total: ${order.price} USD\n\nPlease assist with checkout / .ZIP delivery. Thank you.`;
    const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SITE_CONFIG.orderEmail)}&su=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    const mailHref = `mailto:${SITE_CONFIG.orderEmail}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    const hasMultiPolar = Array.isArray(order.polarItems) && order.polarItems.length > 1;
    const directPayHref = hasMultiPolar ? (order.polarItems[0].url || SITE_CONFIG.usdStoreUrl) : (isHttpPayLink ? order.paymentUrl : (SITE_CONFIG.usdStoreUrl || gmailHref));
    if (isHttpPayLink && !hasMultiPolar) {
      try { window.open(order.paymentUrl, '_blank', 'noopener'); } catch (e) {}
    }
    if (extLink) {
      extLink.href = directPayHref;
      extLink.textContent = (isHttpPayLink || hasMultiPolar) ? 'Open Polar.sh Checkout ↗' : 'Request USD Payment Link via Gmail ↗';
    }
    if (iframe) {
      iframe.removeAttribute('src');
      iframe.srcdoc = buildGlobalUsdCheckoutHTML({ ...order, gmailHref, mailHref, directPayUrl: isHttpPayLink ? order.paymentUrl : '' });
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
    extLink.textContent = isMailto ? 'Buka di Gmail Web ↗' : (isHttpPayLink ? 'Buka Halaman Pembayaran Penuh ↗' : 'Konfirmasi QRIS via Gmail / Blogger ↗');
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

function escAiHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildGlobalUsdCheckoutHTML(order) {
  const esc = escAiHtml;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <style>*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}body{margin:0;padding:24px;background:#f8fafc;color:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;}.card{width:100%;max-width:480px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;box-shadow:0 12px 30px rgba(15,23,42,.06);}.badge{display:inline-block;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;margin-bottom:10px;}h2{margin:0 0 6px;font-size:19px;}.price{font-size:24px;font-weight:800;color:#059669;margin-bottom:12px;}.pills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}.pill{font-size:12px;font-weight:700;padding:4px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#f8fafc;color:#334155;}.btn{display:block;text-align:center;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700;font-size:14px;margin-bottom:10px;}.btn-primary{background:#1d4ed8;color:#fff;}.btn-sec{background:#fff;color:#0f172a;border:1px solid #cbd5e1;}.note{font-size:12px;color:#64748b;line-height:1.5;background:#f1f5f9;padding:12px;border-radius:10px;}</style></head>
  <body><div class="card"><span class="badge">GLOBAL USD CHECKOUT</span><h2>${esc(order.title)}</h2><div class="price">${esc(order.price)} USD</div><div class="pills"><span class="pill">Polar.sh Ready</span><span class="pill">Visa / Mastercard</span><span class="pill">Apple Pay</span><span class="pill">PayPal</span></div>${Array.isArray(order.polarItems) && order.polarItems.length > 1
  ? `${order.polarItems.map((it, idx) => `<a class="btn btn-primary" href="${esc(it.url)}" target="_blank" rel="noopener" style="margin-bottom:8px;text-align:left;display:flex;justify-content:space-between;"><span>${idx + 1}. ${esc(it.title)}</span><strong>${esc(it.price)} ↗</strong></a>`).join('')}<a class="btn btn-sec" href="${esc(order.gmailHref)}" target="_blank" rel="noopener" style="margin-top:4px;">Need Combined Invoice / Help? Email Us</a>`
  : (order.directPayUrl
      ? `<a class="btn btn-primary" href="${esc(order.directPayUrl)}" target="_blank" rel="noopener">Proceed to Polar.sh Secure Checkout ↗</a><a class="btn btn-sec" href="${esc(order.gmailHref)}" target="_blank" rel="noopener">Need Invoice / Custom Help? Email Us</a>`
      : `<a class="btn btn-primary" href="${esc(order.gmailHref)}" target="_blank" rel="noopener">Request USD Checkout Link (Polar.sh / Card / PayPal) ↗</a><a class="btn btn-sec" href="${esc(order.mailHref)}">Open Default Email Client</a>`)}<div class="note">Includes full open-source <code>.ZIP</code> package, documentation guide, and commercial project license delivered to your inbox.</div></div></body></html>`;
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
  const esc = escAiHtml;

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
  const esc = escAiHtml;
  const subj = `Konfirmasi Bayar QRIS (${order.price}): ${order.title}`;
  const baseBody = `Halo Admin ${SITE_CONFIG.brandName},\n\nSaya sudah melakukan pembayaran QRIS untuk:\n- Produk: ${order.title}\n- Total: ${order.price}\n`;
  const mailHref = `mailto:${SITE_CONFIG.orderEmail}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(baseBody + 'Mohon kirimkan file .ZIP ke email ini. Terima kasih!')}`;
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SITE_CONFIG.orderEmail)}&su=${encodeURIComponent(subj)}&body=${encodeURIComponent(baseBody + 'Mohon kirimkan file .ZIP ke email ini. Terima kasih!')}`;
  const qrisAbsUrl = new URL(resolveStoreAssetUrl('qris-ddev-studio.jpg'), (typeof window !== 'undefined' && window.location ? window.location.href : 'https://asetkode-store.pages.dev/')).href;
  const gasUrl = String(SITE_CONFIG.gasWebAppUrl || '').trim();
  const basePriceNum = parsePriceNum(order.price);
  const orderItems = Array.isArray(order.items) && order.items.length
    ? order.items
    : [{ id: order.id || 'prod', name: order.title, price: basePriceNum, quantity: 1 }];

  return `<!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: #fafafa; color: #09090b; padding: 20px; }
        .card { max-width: 480px; margin: 0 auto; background: #fff; border: 1px solid #e4e4e7; border-radius: 16px; padding: 22px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); text-align: center; }
        .badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 99px; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace; }
        .title { font-size: 15.5px; font-weight: 800; margin-bottom: 4px; }
        .price { font-size: 22px; font-weight: 800; color: #059669; margin-bottom: 14px; font-family: 'JetBrains Mono', monospace; }
        .qris-box { display: inline-block; border: 1px solid #d4d4d8; border-radius: 12px; padding: 10px; background: #fff; margin-bottom: 12px; }
        .qris-box img { max-width: 220px; width: 100%; height: auto; display: block; border-radius: 6px; }
        input { width: 100%; padding: 10px 13px; border: 1px solid #d4d4d8; border-radius: 9px; font-size: 13.5px; margin-bottom: 10px; outline: none; }
        input:focus { border-color: #1d4ed8; }
        .btn { display: block; width: 100%; background: #1d4ed8; color: #fff; text-decoration: none; border: none; padding: 12px; border-radius: 9px; font-size: 13.5px; font-weight: 800; cursor: pointer; margin-bottom: 8px; }
        .btn-dark { background: #09090b; }
        .btn-sec { display: block; width: 100%; background: #fff; color: #09090b; text-decoration: none; border: 1px solid #cbd5e1; padding: 10px; border-radius: 9px; font-size: 13px; font-weight: 700; margin-bottom: 10px; cursor: pointer; }
        .note { font-size: 12px; color: #52525b; background: #f4f4f5; padding: 10px; border-radius: 9px; line-height: 1.5; }
        .alert { font-size: 12px; color: #92400e; background: #fef3c7; border: 1px solid #fde68a; padding: 9px 11px; border-radius: 9px; margin-bottom: 12px; display: none; text-align: left; }
        .dl-btn { display: block; width: 100%; background: #059669; color: #fff; padding: 11px; border-radius: 9px; text-decoration: none; font-weight: 800; font-size: 13.5px; margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div id="stepMayarForm">
          <span class="badge">CHECKOUT INDONESIA • MAYAR / QRIS</span>
          <div class="title">${esc(order.title)}</div>
          <div class="price">${esc(order.price)}</div>
          <form id="mayarInitForm">
            <input type="text" id="custName" aria-label="Nama Lengkap" autocomplete="name" placeholder="Nama Lengkap Anda" required />
            <input type="email" id="custEmail" aria-label="Email aktif penerima file ZIP" autocomplete="email" inputmode="email" placeholder="Email aktif penerima file (.ZIP)" required />
            <input type="tel" id="custPhone" aria-label="Nomor WhatsApp" autocomplete="tel" inputmode="tel" placeholder="No. WhatsApp (opsional)" />
            <button type="submit" class="btn" id="mayarCreateBtn">Lanjut Pembayaran Instan →</button>
          </form>
          <button type="button" class="btn-sec" id="showQrisDirectBtn">Atau Bayar Langsung via Scan QRIS</button>
          <div class="note">File <code>.ZIP</code> + panduan instalasi langsung dikirim ke email Anda setelah pembayaran berhasil.</div>
        </div>

        <div id="stepMayarWait" style="display:none;">
          <span class="badge">INVOICE MAYAR AKTIF</span>
          <div class="title" id="waitOrderLabel">Menunggu Pembayaran</div>
          <div class="price">${esc(order.price)}</div>
          <a href="#" id="mayarPayAnchor" class="btn" target="_blank" rel="noopener">Buka Halaman Bayar Mayar ↗</a>
          <div class="note" id="waitStatusNote">Sedang memantau status pembayaran otomatis setiap 5 detik... Begitu lunas, tombol unduh <code>.ZIP</code> langsung muncul di sini.</div>
        </div>

        <div id="stepQrisFallback" style="display:none;">
          <span class="badge">PEMBAYARAN QRIS • SEMUA BANK &amp; E-WALLET</span>
          <div class="title">${esc(order.title)}</div>
          <div class="price">${esc(order.price)}</div>
          <div id="qrisReasonAlert" class="alert"></div>
          <div class="qris-box">
            <img src="${esc(qrisAbsUrl)}" alt="QRIS Ddev Studio" width="240" height="240" />
          </div>
          <input type="email" id="buyerEmail" aria-label="Email penerima file ZIP" autocomplete="email" inputmode="email" placeholder="Masukkan Email penerima file (.ZIP) Anda" />
          <a id="qrisGmailBtn" class="btn btn-dark" href="${esc(gmailHref)}" target="_blank" rel="noopener">Sudah Scan Bayar? Konfirmasi via Gmail ↗</a>
          <a class="btn-sec" href="${esc(mailHref)}">Buka Aplikasi Email Lain</a>
          <div class="note">
            Scan QRIS di atas melalui DANA, GoPay, OVO, ShopeePay, atau m-Banking sebesar <strong>${esc(order.price)}</strong>, lalu klik konfirmasi di atas agar paket <code>.ZIP</code> dikirim ke email Anda.
          </div>
        </div>

        <div id="stepPaidSuccess" style="display:none;">
          <span class="badge">✓ PEMBAYARAN LUNAS</span>
          <div class="title">Terima Kasih! Paket .ZIP Anda Siap Diunduh</div>
          <div id="paidLinksWrap" style="margin:14px 0;"></div>
          <div class="note">Salinan link download juga otomatis dikirim ke email Anda.</div>
        </div>
      </div>
      <script>
        var gasUrl = ${JSON.stringify(gasUrl).replace(/<\/script/gi, '<\\/script')};
        var orderTitle = ${JSON.stringify(order.title).replace(/<\/script/gi, '<\\/script')};
        var orderItems = ${JSON.stringify(orderItems).replace(/<\/script/gi, '<\\/script')};
        var baseBody = ${JSON.stringify(baseBody).replace(/<\/script/gi, '<\\/script')};
        var orderEmailTo = ${JSON.stringify(SITE_CONFIG.orderEmail).replace(/<\/script/gi, '<\\/script')};
        var subj = ${JSON.stringify(subj).replace(/<\/script/gi, '<\\/script')};

        function syncGmailHref(val) {
          var v = String(val || '').trim();
          var btn = document.getElementById('qrisGmailBtn');
          if (!btn) return;
          var b = baseBody + (v ? '- Email Penerima .ZIP: ' + v + '\\n' : '') + '\\nTerlampir bukti bayar QRIS saya. Terima kasih!';
          btn.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(orderEmailTo) + '&su=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(b);
        }

        function switchToQris(prefillEmail, reasonText) {
          document.getElementById('stepMayarForm').style.display = 'none';
          document.getElementById('stepMayarWait').style.display = 'none';
          document.getElementById('stepQrisFallback').style.display = 'block';
          var emInput = document.getElementById('buyerEmail');
          if (emInput && prefillEmail) {
            emInput.value = prefillEmail;
            syncGmailHref(prefillEmail);
          }
          var al = document.getElementById('qrisReasonAlert');
          if (al && reasonText) {
            al.textContent = reasonText;
            al.style.display = 'block';
          }
        }

        document.getElementById('buyerEmail').addEventListener('input', function () {
          syncGmailHref(this.value);
        });
        document.getElementById('showQrisDirectBtn').addEventListener('click', function () {
          switchToQris(document.getElementById('custEmail').value, '');
        });

        var pollTimer = null;
        function startStatusPolling(oid, statusToken) {
          if (pollTimer) clearInterval(pollTimer);
          var sigQ = statusToken ? ('&sig=' + encodeURIComponent(statusToken)) : '';
          pollTimer = setInterval(function () {
            fetch(gasUrl + '?action=status&orderId=' + encodeURIComponent(oid) + sigQ)
              .then(function (r) { return r.json(); })
              .then(function (st) {
                if (st && st.status === 'PAID') {
                  clearInterval(pollTimer);
                  document.getElementById('stepMayarWait').style.display = 'none';
                  document.getElementById('stepPaidSuccess').style.display = 'block';
                  var wrap = document.getElementById('paidLinksWrap');
                  wrap.innerHTML = (st.downloadLinks || []).map(function (d) {
                    var safeUrl = /^https:\/\//i.test(String(d.url || '').trim()) ? String(d.url).trim() : '#';
                    var safeName = String(d.name || 'File .ZIP').replace(/[&<>"]/g, function(ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]; });
                    var safeHref = safeUrl.replace(/[&<>"]/g, function(ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]; });
                    return '<a class="dl-btn" href="' + safeHref + '" target="_blank" rel="noopener">⬇ Unduh: ' + safeName + '</a>';
                  }).join('');
                }
              })
              .catch(function () {});
          }, 5000);
        }

        document.getElementById('mayarInitForm').addEventListener('submit', function (e) {
          e.preventDefault();
          var name = document.getElementById('custName').value.trim();
          var email = document.getElementById('custEmail').value.trim();
          var phone = document.getElementById('custPhone').value.trim();
          var btn = document.getElementById('mayarCreateBtn');
          if (!gasUrl) {
            switchToQris(email, '');
            return;
          }
          btn.disabled = true;
          btn.textContent = 'Menyiapkan Invoice...';
          fetch(gasUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'create',
              customerName: name,
              customerEmail: email,
              customerPhone: phone,
              productTitle: orderTitle,
              items: orderItems
            })
          })
            .then(function (r) { return r.json(); })
            .then(function (res) {
              if (res && res.ok && res.paymentUrl) {
                document.getElementById('stepMayarForm').style.display = 'none';
                document.getElementById('stepMayarWait').style.display = 'block';
                document.getElementById('waitOrderLabel').textContent = 'Order ID: ' + res.orderId;
                document.getElementById('mayarPayAnchor').href = res.paymentUrl;
                try { window.open(res.paymentUrl, '_blank', 'noopener'); } catch (err) {}
                startStatusPolling(res.orderId, res.statusToken || '');
              } else {
                switchToQris(email, 'Gateway Mayar sedang menunggu aktivasi — silakan bayar cepat via QRIS resmi di bawah ini.');
              }
            })
            .catch(function () {
              switchToQris(email, 'Silakan selesaikan pembayaran cepat via QRIS Ddev Studio di bawah ini.');
            });
        });
      </script>
    </body>
    </html>`;
}

// ================= 8. MODAL, THEME & TOOLBAR EVENTS =================
let lastModalFocusEl = null;

function initModalFocusRestore() {
  document.querySelectorAll('.backdrop').forEach((bd) => {
    new MutationObserver(() => {
      if (bd.classList.contains('open')) {
        if (document.activeElement && !bd.contains(document.activeElement)) {
          lastModalFocusEl = document.activeElement;
        }
        const closeBtn = bd.querySelector('.close-x');
        if (closeBtn) setTimeout(() => closeBtn.focus(), 10);
      }
    }).observe(bd, { attributes: true, attributeFilter: ['class'] });
  });
}

window.closeModal = function (id) {
  const el = document.getElementById(id);
  const wasOpen = el && el.classList.contains('open');
  if (el) el.classList.remove('open');
  if (id === 'checkoutModal') {
    const iframe = document.getElementById('checkoutIframe');
    if (iframe) {
      iframe.src = 'about:blank';
      iframe.removeAttribute('srcdoc');
    }
  }
  if (wasOpen && lastModalFocusEl && typeof lastModalFocusEl.focus === 'function') {
    const target = lastModalFocusEl;
    lastModalFocusEl = null;
    setTimeout(() => target.focus(), 10);
  }
};

function syncThemeBtnTitle() {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const isEn = currentLocale === 'en';
  btn.setAttribute('title', isDark
    ? (isEn ? 'Switch to Light Mode' : 'Ganti ke Mode Terang')
    : (isEn ? 'Switch to Dark Mode' : 'Ganti ke Mode Gelap'));
}

function initThemeToggle() {
  const saved = localStorage.getItem(STORAGE_THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  syncThemeBtnTitle();

  const btn = document.getElementById('themeBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_THEME_KEY, next);
      syncThemeBtnTitle();
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
  initModalFocusRestore();
  document.querySelectorAll('#faqList .faq-q').forEach((btn) => {
    const item = btn.closest('.faq-item');
    btn.setAttribute('aria-expanded', item && item.classList.contains('open') ? 'true' : 'false');
    btn.addEventListener('click', () => {
      if (!item) return;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('#faqList .faq-item').forEach((el) => {
        el.classList.remove('open');
        const qBtn = el.querySelector('.faq-q');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

window.openLegalModal = function (type) {
  const modal = document.getElementById('detailModal');
  const titleEl = document.getElementById('detailModalTitle');
  const bodyEl = document.getElementById('detailModalBody');
  if (!modal || !titleEl || !bodyEl) return;

  const isEn = currentLocale === 'en';
  const docs = isEn ? {
    about: {
      title: `About ${SITE_CONFIG.brandName}`,
      html: `
        <h3 style="margin-bottom:10px;">Production-Ready Web Apps &amp; Source Code Templates</h3>
        <p style="margin-bottom:12px;color:var(--text-secondary);"><strong>${SITE_CONFIG.brandName}</strong> builds ready-to-launch web applications, POS &amp; business software, Python automation scripts, and modern UI templates for businesses, freelancers, and developers.</p>
        <p style="margin-bottom:12px;color:var(--text-secondary);">Every product in our catalog is pre-tested and paired with an <strong>Interactive Live Demo</strong> right in your browser before purchase.</p>
        <p style="color:var(--text-secondary);">Official contact &amp; customer support: <strong>${SITE_CONFIG.orderEmail}</strong></p>
      `
    },
    terms: {
      title: 'Terms, Conditions & Product License',
      html: `
        <h3 style="margin-bottom:10px;">Personal &amp; Commercial License Terms</h3>
        <ul style="padding-left:18px;display:flex;flex-direction:column;gap:8px;color:var(--text-secondary);">
          <li>You receive <strong>100% Open Unencrypted Source Code</strong> with documentation and setup guides.</li>
          <li>Free to modify and deploy for personal apps, internal business operations, and unlimited commercial client websites.</li>
          <li><strong>Not permitted:</strong> Reselling, redistributing, or publishing the raw source template as a competing starter kit or template marketplace product.</li>
          <li>One-time purchase with zero recurring subscription fees.</li>
        </ul>
      `
    },
    refund: {
      title: 'Refund Policy & File Guarantee',
      html: `
        <h3 style="margin-bottom:10px;">Digital Goods Policy</h3>
        <ul style="padding-left:18px;display:flex;flex-direction:column;gap:8px;color:var(--text-secondary);">
          <li>Because products are instant downloadable digital source code bundles (<code>.ZIP</code>), delivered orders are generally final (non-refundable).</li>
          <li>Please test the <strong>Interactive Live Demo</strong> prior to checkout to make sure the app meets your project requirements.</li>
          <li><strong>File &amp; Support Guarantee:</strong> If your <code>.ZIP</code> archive is corrupted or you experience initial setup issues, we will re-send your bundle and assist directly via <strong>${SITE_CONFIG.orderEmail}</strong>.</li>
        </ul>
      `
    }
  } : {
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

function setLocalizedInner(el, isEn, enHtml) {
  if (!el) return;
  if (!el.dataset.idHtml) el.dataset.idHtml = el.innerHTML;
  el.innerHTML = isEn ? enHtml : el.dataset.idHtml;
}

function applyStorefrontLocaleUI() {
  const isEn = currentLocale === 'en';
  document.documentElement.lang = isEn ? 'en' : 'id';
  const flagEl = document.getElementById('langCurrencyFlag');
  const lblEl = document.getElementById('langCurrencyLabel');
  if (flagEl) flagEl.textContent = isEn ? '🇺🇸' : '🇮🇩';
  if (lblEl) lblEl.textContent = isEn ? 'USD' : 'IDR';

  setLocalizedInner(
    document.querySelector('.promo-ribbon-inner'),
    isEn,
    '<span class="promo-pill">PROMO</span><span>Save up to <strong>50%</strong> per app • One-Time USD Payment via Polar.sh</span>'
  );

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = isEn ? 'Search POS, travel, PHP, Python...' : 'Cari kasir, travel, python...';

  const navLinks = document.querySelectorAll('.nav-menu a');
  if (navLinks[0]) navLinks[0].textContent = isEn ? 'Catalog' : 'Katalog';
  if (navLinks[1]) navLinks[1].textContent = isEn ? 'How to Buy' : 'Cara Order';
  if (navLinks[2]) {
    const freeLbl = navLinks[2].querySelector('.nav-free-text');
    if (freeLbl) freeLbl.textContent = isEn ? 'Free' : 'Gratis';
    else navLinks[2].textContent = isEn ? 'Free' : 'Gratis';
    navLinks[2].setAttribute('href', resolveStoreAssetUrl('free/') + (isEn ? '?lang=en' : ''));
  }

  const cartSpan = document.querySelector('#openCartBtn span:not(.cart-count-pill)');
  if (cartSpan) cartSpan.textContent = isEn ? 'Cart' : 'Keranjang';

  const heroStatusText = document.getElementById('heroStatusText');
  if (heroStatusText) heroStatusText.textContent = isEn ? 'Try Live Demo in Browser • Global USD Checkout Ready' : 'Coba Aplikasi di Browser • Order Cepat via Email';

  setLocalizedInner(
    document.querySelector('.hero-title'),
    isEn,
    'Production Web Apps &amp; Templates <span class="hero-accent">Ready to Ship</span>'
  );
  setLocalizedInner(
    document.querySelector('.hero-desc'),
    isEn,
    'Test every <strong>interactive Live Demo</strong> directly in your browser. 100% unencrypted source code, pay once with zero subscriptions, and download the complete <code>.ZIP</code> package.'
  );
  const heroCtas = document.querySelectorAll('.hero-cta-row a');
  if (heroCtas[0]) heroCtas[0].textContent = isEn ? 'Browse All Products →' : 'Lihat Semua Produk →';
  if (heroCtas[1]) {
    const heroFreeTxt = heroCtas[1].querySelector('.hero-free-text');
    if (heroFreeTxt) heroFreeTxt.textContent = isEn ? '12 Free Products (MIT)' : '12 Produk Gratis (MIT)';
    heroCtas[1].setAttribute('href', resolveStoreAssetUrl('free/') + (isEn ? '?lang=en' : ''));
  }
  if (heroCtas[2]) heroCtas[2].textContent = isEn ? 'How to Buy →' : 'Cara Order →';

  const openPill = document.getElementById('catalogOpenPill');
  const co1 = document.getElementById('coStat1');
  const coP = document.getElementById('coStatPriceNum');
  const co2 = document.getElementById('coStat2');
  const co3 = document.getElementById('coStat3');
  const coFreeLink = document.getElementById('coStatFreeLink');
  if (openPill) openPill.textContent = isEn ? 'OFFICIAL CATALOG • 26 PRO APPS' : 'KATALOG RESMI • 26 APLIKASI PRO';
  if (co1) co1.textContent = isEn ? 'Ready-to-Run Apps' : 'Aplikasi Siap Pakai';
  if (coP) coP.textContent = isEn ? '$7+ USD' : 'Rp 39rb+';
  if (co2) co2.textContent = isEn ? 'One-Time License' : 'Sekali Bayar Selamanya';
  if (co3) co3.textContent = isEn ? 'Try MIT Free Tools →' : 'Coba Versi MIT Gratis →';
  if (coFreeLink) coFreeLink.setAttribute('href', resolveStoreAssetUrl('free/') + (isEn ? '?lang=en' : ''));

  const filterAllChip = document.querySelector('#filterBar [data-cat="all"]');
  if (filterAllChip) filterAllChip.textContent = isEn ? 'All Products' : 'Semua Karya';
  const filterDesignChip = document.querySelector('#filterBar [data-cat="Desain Web"]');
  if (filterDesignChip) filterDesignChip.textContent = isEn ? 'Web Design' : 'Desain Web';
  const filterTplChip = document.querySelector('#filterBar [data-cat="Template"]');
  if (filterTplChip) filterTplChip.textContent = isEn ? 'Templates / UI' : 'Template / UI';

  const sortLbl = document.querySelector('label[for="sortSelect"]');
  if (sortLbl) sortLbl.textContent = isEn ? 'Sort:' : 'Urutkan:';
  const sortOpts = document.querySelectorAll('#sortSelect option');
  if (sortOpts[0]) sortOpts[0].textContent = isEn ? 'Newest' : 'Terbaru';
  if (sortOpts[1]) sortOpts[1].textContent = isEn ? 'Lowest Price' : 'Harga Terendah';
  if (sortOpts[2]) sortOpts[2].textContent = isEn ? 'Highest Price' : 'Harga Tertinggi';
  if (sortOpts[3]) sortOpts[3].textContent = isEn ? 'Biggest Discount' : 'Diskon Terbesar';

  setLocalizedInner(
    document.getElementById('keunggulan'),
    isEn,
    '<div class="section-header"><h2>Why Ddev Studio?</h2></div><div class="bento-grid">' +
    '<div class="bento-box"><div style="font-family:var(--font-mono); font-size:0.74rem; font-weight:800; margin-bottom:6px; color:var(--text-muted);">01 / LIVE DEMO</div><h3 style="font-size:0.96rem; font-weight:800; margin-bottom:4px;">Test Before Buying</h3><p style="font-size:0.83rem; color:var(--text-secondary);">Preview Desktop &amp; Mobile workflows live in browser.</p></div>' +
    '<div class="bento-box"><div style="font-family:var(--font-mono); font-size:0.74rem; font-weight:800; margin-bottom:6px; color:var(--text-muted);">02 / PAY PER APP</div><h3 style="font-size:0.96rem; font-weight:800; margin-bottom:4px;">Transparent Individual Pricing</h3><p style="font-size:0.83rem; color:var(--text-secondary);">Buy only the tools you need from $7 USD with lifetime access.</p></div>' +
    '<div class="bento-box"><div style="font-family:var(--font-mono); font-size:0.74rem; font-weight:800; margin-bottom:6px; color:var(--text-muted);">03 / UNLOCKED .ZIP</div><h3 style="font-size:0.96rem; font-weight:800; margin-bottom:4px;">100% Open &amp; Licensed</h3><p style="font-size:0.83rem; color:var(--text-secondary);">No obfuscation, includes sample data &amp; commercial rights.</p></div></div>'
  );

  setLocalizedInner(
    document.getElementById('cara-order'),
    isEn,
    '<div class="section-header"><h2>How to Buy in 3 Steps</h2></div><div class="steps-grid">' +
    '<div class="step-card"><span class="step-num">01</span><h3>Try Demo &amp; Pick</h3><p>Test any <strong>Live Demo</strong>, then click <strong>Buy Now</strong> or add to Cart.</p></div>' +
    '<div class="step-card"><span class="step-num">02</span><h3>Pay via Polar.sh</h3><p>Fast USD checkout with Visa, Mastercard, or Apple Pay.</p></div>' +
    '<div class="step-card"><span class="step-num">03</span><h3>Get .ZIP Package</h3><p>Full source code &amp; setup guide delivered to your email.</p></div></div>'
  );

  setLocalizedInner(
    document.querySelector('#faq .section-header'),
    isEn,
    '<span class="brand-badge" style="font-size:0.72rem; padding:4px 12px;">FAQ</span><h2>Frequently Asked Questions</h2>'
  );
  const faqQs = document.querySelectorAll('#faqList .faq-q span:first-child');
  const faqAs = document.querySelectorAll('#faqList .faq-a');
  if (faqQs[0]) setLocalizedInner(faqQs[0], isEn, 'Is the source code 100% open and editable?');
  if (faqAs[0]) setLocalizedInner(faqAs[0], isEn, 'Yes. Every package ships as unencrypted open source code without obfuscators or license keys, ready to customize for personal or client projects.');
  if (faqQs[1]) setLocalizedInner(faqQs[1], isEn, 'Can non-developers run these web apps easily?');
  if (faqAs[1]) setLocalizedInner(faqAs[1], isEn, 'Absolutely. Flagship tools like POS Cashier, Invoice Pro, Laundry POS, and Booking Manager are Zero-Config browser apps that run offline or host free on Cloudflare Pages.');
  if (faqQs[2]) setLocalizedInner(faqQs[2], isEn, 'How do I pay in USD and receive my .ZIP files?');
  if (faqAs[2]) setLocalizedInner(faqAs[2], isEn, 'Click <strong>Buy Now</strong> or checkout from your Cart. Pay securely via global checkout (Polar.sh / Card / PayPal) or email <strong data-order-email>dekamayooo@gmail.com</strong> — your <code>.ZIP</code> package is sent directly to your email.');
  if (faqQs[3]) setLocalizedInner(faqQs[3], isEn, 'Are there any monthly or annual fees?');
  if (faqAs[3]) setLocalizedInner(faqAs[3], isEn, 'Never. You pay <strong>once</strong> for lifetime source code access and commercial usage rights.');

  setLocalizedInner(
    document.querySelector('.site-footer .footer-grid > div:nth-child(1) p'),
    isEn,
    'Production-ready web apps, automation scripts, Blogger XML themes, and UI kits crafted to ship business &amp; developer projects faster.'
  );
  setLocalizedInner(document.querySelector('.site-footer .footer-grid > div:nth-child(2) h3, .site-footer .footer-grid > div:nth-child(2) h4'), isEn, 'Quick Links');
  const fLinks1 = document.querySelectorAll('.site-footer .footer-grid > div:nth-child(2) a');
  if (fLinks1[0]) fLinks1[0].textContent = isEn ? 'Product Catalog' : 'Katalog Produk';
  if (fLinks1[1]) fLinks1[1].textContent = isEn ? 'Why Ddev Studio' : 'Keunggulan Toko';
  if (fLinks1[2]) fLinks1[2].textContent = isEn ? 'How to Order' : 'Cara Pemesanan';
  if (fLinks1[3]) fLinks1[3].textContent = 'FAQ';
  if (fLinks1[4] && fLinks1[4].hasAttribute('data-blogger-link')) {
    fLinks1[4].textContent = isEn ? 'Blog & Articles ↗' : 'Blog & Artikel ↗';
  }
  setLocalizedInner(document.querySelector('.site-footer .footer-grid > div:nth-child(3) h3, .site-footer .footer-grid > div:nth-child(3) h4'), isEn, 'Contact & Legal');
  const fLinks2 = document.querySelectorAll('.site-footer .footer-grid > div:nth-child(3) a');
  if (fLinks2[1]) fLinks2[1].textContent = isEn ? 'About Us' : 'Tentang Kami';
  if (fLinks2[2]) fLinks2[2].textContent = isEn ? 'Terms & Commercial License' : 'Syarat, Ketentuan & Lisensi';
  if (fLinks2[3]) fLinks2[3].textContent = isEn ? 'Refund Policy & Support' : 'Kebijakan Refund & Bantuan';

  const cartDrawerTitle = document.querySelector('#cartBackdrop .modal-top-title');
  if (cartDrawerTitle) cartDrawerTitle.textContent = isEn ? 'Your Shopping Cart' : 'Keranjang Belanja Anda';
  const cartTotalLbl = document.querySelector('#cartBackdrop .cart-footer > div:nth-child(2) > span:first-child');
  if (cartTotalLbl) cartTotalLbl.textContent = isEn ? 'Total Payment:' : 'Total Pembayaran:';
  const checkoutCartBtn = document.getElementById('checkoutCartBtn');
  if (checkoutCartBtn) checkoutCartBtn.textContent = isEn ? '⚡ Global Checkout (USD / Card / PayPal)' : '⚡ Checkout Sekarang (Mayar / QRIS)';
  const checkoutNotice = document.getElementById('checkoutModalNotice');
  setLocalizedInner(checkoutNotice, isEn, 'Your <code>.ZIP</code> package &amp; setup guide will be sent via email after payment');
  const checkoutNewTabSpan = document.querySelector('#checkoutModal .modal-window > .modal-top:last-child span');
  setLocalizedInner(checkoutNewTabSpan, isEn, 'Need fullscreen or open in a new tab?');
  const footerRight = document.querySelector('.footer-bottom > div:last-child');
  setLocalizedInner(footerRight, isEn, '100% Open Source Code • One-Time Payment');

  const savedFilterBtn = document.getElementById('savedFilterBtn');
  if (savedFilterBtn) {
    const cnt = wishlistState.length;
    savedFilterBtn.innerHTML = isEn
      ? `♥ Saved (<span id="savedCountNum">${cnt}</span>)`
      : `♥ Disimpan (<span id="savedCountNum">${cnt}</span>)`;
  }
  const customBanner = document.getElementById('customOrderSection');
  if (customBanner) {
    const h3 = customBanner.querySelector('h3');
    const p = customBanner.querySelector('p');
    const a = document.getElementById('customOrderBtn');
    if (h3) h3.textContent = isEn ? 'Need Custom Software or Tailored Features?' : 'Butuh Custom Program atau Modifikasi Fitur Khusus?';
    if (p) p.textContent = isEn
      ? 'Our team can customize branding, integrate APIs, or build bespoke web systems for your business.'
      : 'Tim Ddev Studio siap bantu penyesuaian logo, domain, atau pembuatan sistem web khusus bisnis Anda.';
    if (a) {
      const txtEl = a.querySelector('.custom-order-text');
      if (txtEl) txtEl.textContent = isEn ? 'Request Custom Project' : 'Konsultasi Custom Project';
      else a.textContent = isEn ? 'Request Custom Project' : 'Konsultasi Custom Project';
    }
  }
  const bttBtn = document.getElementById('backToTopBtn');
  if (bttBtn) {
    bttBtn.title = isEn ? 'Back to Top' : 'Kembali ke Atas';
    bttBtn.setAttribute('aria-label', bttBtn.title);
  }

  const aiLauncherLbl = document.getElementById('aiLauncherLabel');
  if (aiLauncherLbl) aiLauncherLbl.textContent = isEn ? 'AI Assistant' : 'Asisten AI';
  const aiHeadTitle = document.getElementById('aiHeadTitle');
  if (aiHeadTitle) aiHeadTitle.textContent = isEn ? 'Ddev Studio AI Assistant' : 'Asisten AI Ddev Studio';
  const aiHeadSub = document.getElementById('aiHeadSub');
  if (aiHeadSub) aiHeadSub.textContent = isEn ? 'Product Finder, Live Demos & USD Checkout' : 'Bantu Pilih Produk, Demo & Cara Bayar';
  const aiIn = document.getElementById('aiChatInput');
  if (aiIn) aiIn.placeholder = isEn ? 'Ask about apps, live demos, USD checkout, or license...' : 'Tanya produk, live demo, Order ID (DDV-...), atau cara bayar...';
  const aiSendBtn = document.getElementById('aiChatSendBtn');
  if (aiSendBtn) aiSendBtn.textContent = isEn ? 'Send' : 'Kirim';
  const chipLabelsId = ['💳 Cara Bayar', '📦 Rekomendasi', '💰 Daftar Harga'];
  const chipLabelsEn = ['💳 How to Pay', '📦 Best Apps', '💰 Price Range'];
  document.querySelectorAll('.js-ai-chip').forEach((chip, idx) => {
    chip.textContent = isEn ? (chipLabelsEn[idx] || chip.textContent) : (chipLabelsId[idx] || chip.textContent);
  });

  const statusEl = document.getElementById('catalogStatusText');
  if (statusEl && statusEl.textContent) {
    if (isEn && statusEl.textContent.indexOf('asetkode.blogspot.com') !== -1) {
      statusEl.textContent = `Live Synced with asetkode.blogspot.com (${productsState.length} active products)`;
    } else if (!isEn && statusEl.textContent.indexOf('Live Synced') !== -1) {
      statusEl.textContent = `Terhubung Live dengan asetkode.blogspot.com (${productsState.length} produk aktif)`;
    }
  }

  renderProductsGrid();
  updateCartUI();
  syncThemeBtnTitle();
  if (typeof window.observeMotionTargets === 'function') {
    window.observeMotionTargets('.bento-box, .step-card, .custom-service-banner, .faq-item', Boolean(ddevMotionObserver));
  }
}

// ================= WISHLIST, DEEP LINK & RELATED PRODUCTS =================
let wishlistState = [];
function loadWishlistFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_WISHLIST_KEY);
    if (raw) wishlistState = JSON.parse(raw) || [];
  } catch (e) { wishlistState = []; }
  updateWishlistCounter();
}

function updateWishlistCounter() {
  const cnt = wishlistState.length;
  const hNum = document.getElementById('headerSavedNum');
  const fNum = document.getElementById('savedCountNum');
  if (hNum) hNum.textContent = cnt;
  if (fNum) fNum.textContent = cnt;
}

window.toggleWishlistById = function (productId) {
  const isEn = currentLocale === 'en';
  const idx = wishlistState.indexOf(productId);
  if (idx >= 0) {
    wishlistState.splice(idx, 1);
    showToast(isEn ? 'Removed from saved list.' : 'Dihapus dari daftar disimpan.');
  } else {
    wishlistState.push(productId);
    showToast(isEn ? 'Saved to wishlist!' : 'Produk disimpan ke wishlist!');
  }
  try { localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(wishlistState)); } catch (e) {}
  updateWishlistCounter();
  renderProductsGrid();
};

window.copyProductLinkById = function (productId) {
  const isEn = currentLocale === 'en';
  const base = window.location.origin + window.location.pathname;
  const shareUrl = `${base}?product=${encodeURIComponent(productId)}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast(isEn ? 'Product link copied to clipboard!' : 'Link produk berhasil disalin!');
    }).catch(() => {
      showToast(shareUrl);
    });
  } else {
    showToast(shareUrl);
  }
};

function buildRelatedProductsHtml(prod, isEn) {
  const cats = prod.categories || [];
  const related = productsState.filter((p) =>
    p.id !== prod.id && p.categories.some((c) => cats.includes(c))
  ).slice(0, 3);
  if (!related.length) return '';
  return `
    <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border-color);">
      <div style="font-size:0.84rem; font-weight:800;">${isEn ? 'Related Products You May Like:' : 'Produk Terkait Lainnya:'}</div>
      <div class="related-mini-grid">
        ${related.map((r) => {
          const d = getProdDisplay(r);
          return `
            <button type="button" class="related-mini-card" onclick="openDetailById('${r.id}')">
              <div style="font-size:0.78rem; font-weight:800; line-height:1.35; margin-bottom:4px;">${escAiHtml(d.title)}</div>
              <div style="font-size:0.76rem; font-weight:800; color:#059669; font-family:var(--font-mono);">${escAiHtml(d.price)}</div>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function initBackToTopAndSavedBtn() {
  const btt = document.getElementById('backToTopBtn');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 360);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  const hSaved = document.getElementById('headerSavedBtn');
  const sChip = document.getElementById('savedFilterBtn');
  if (hSaved && sChip) {
    hSaved.addEventListener('click', () => {
      sChip.click();
      sChip.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

// ================= FLOATING BILINGUAL AI ASSISTANT =================
let aiAssistantBooted = false;
let aiChatHistoryState = [];
let aiServerGeminiFlag = null;

// Deduplicated into top-level escAiHtml() above

function addAiChatMessage(role, htmlText, actionButtons) {
  const aiMessages = document.getElementById('aiChatMessages');
  if (!aiMessages) return null;
  const box = document.createElement('div');
  box.className = 'ai-msg ' + (role === 'user' ? 'ai-msg-user' : 'ai-msg-bot');
  box.innerHTML = '<div>' + htmlText + '</div>';

  if (Array.isArray(actionButtons) && actionButtons.length > 0) {
    const actWrap = document.createElement('div');
    actWrap.className = 'ai-msg-actions';
    actionButtons.forEach((btnCfg) => {
      if (btnCfg.href) {
        const a = document.createElement('a');
        a.className = 'ai-msg-btn' + (btnCfg.primary ? ' ai-msg-btn-primary' : '');
        a.href = btnCfg.href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = btnCfg.label;
        actWrap.appendChild(a);
      } else {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ai-msg-btn' + (btnCfg.primary ? ' ai-msg-btn-primary' : '');
        b.textContent = btnCfg.label;
        b.addEventListener('click', btnCfg.onClick);
        actWrap.appendChild(b);
      }
    });
    box.appendChild(actWrap);
  }

  aiMessages.appendChild(box);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return box;
}

function buildStorefrontAiFallback(userText) {
  const q = String(userText || '').toLowerCase().trim();
  const isEn = currentLocale === 'en';
  const supportEmail = SITE_CONFIG.orderEmail || 'dekamayooo@gmail.com';
  const emailMatch = userText.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);

  // 1. Keluhan / Refund
  if (/(refund|pengembalian|uang\s+kembali|corrupt|broken|rusak|kendala|\berror\b|gagal\s+jalan|not\s+working)/i.test(q)) {
    return {
      html: isEn
        ? `We're sorry for any issue! Digital <code>.ZIP</code> purchases include full setup assistance — if a package is corrupted or fails after troubleshooting, we'll process a refund.<br/><br/>Please email your Order ID + screenshot to <strong>${escAiHtml(supportEmail)}</strong>.`
        : `Mohon maaf atas kendalanya. Semua pembelian <code>.ZIP</code> disertai <strong>bantuan setup penuh</strong> — dan jika file terbukti rusak/gagal berjalan setelah dibantu tim kami, <strong>refund kami proses</strong>.<br/><br/>Kirim Order ID + tangkapan layar kendala ke <strong>${escAiHtml(supportEmail)}</strong>.`,
      actions: [
        {
          label: isEn ? '✉️ Contact Support / Refund' : '✉️ Ajukan Bantuan / Refund',
          href: `mailto:${encodeURIComponent(supportEmail)}?subject=${encodeURIComponent('Support / Refund Request - ' + SITE_CONFIG.brandName)}`,
          primary: true
        },
        {
          label: isEn ? 'Read Refund Policy' : 'Kebijakan Refund',
          primary: false,
          onClick: () => { if (window.openLegalModal) window.openLegalModal('refund'); }
        }
      ]
    };
  }

  // 2. Sapaan / Terima kasih
  if (/^((halo|hai|hi|hey|hello|good\s+(morning|afternoon|evening)|selamat\s+(pagi|siang|sore|malam)|permisi)(\s+(admin|min|there))?)[!.?\s]*$/i.test(q)) {
    return {
      html: isEn
        ? 'Hello! How can I help you today? Ask about any of our <strong>25 live-demo apps</strong>, individual USD pricing ($7–$25), or checkout via <strong>Polar.sh</strong>.'
        : 'Halo! Ada yang bisa saya bantu? Anda bisa tanya rekomendasi <strong>aplikasi/source code</strong>, daftar harga satuan, cara bayar <strong>QRIS / Polar.sh</strong>, atau cek status <strong>Order ID (<code>DDV-...</code>)</strong>.',
      actions: []
    };
  }
  if (/^(terima\s*kasih|makasih|thanks|thank\s+you|thx|ok|oke|siap|sip|got\s+it)[!.?\s]*$/i.test(q)) {
    return {
      html: isEn
        ? 'You\'re welcome! Feel free to ask anytime if you need help picking an app or checking out.'
        : 'Sama-sama! Kalau nanti butuh rekomendasi aplikasi atau bantuan setup, langsung chat di sini ya.',
      actions: []
    };
  }

  // 3. Klaim .ZIP / Status Order
  if (/(klaim|claim|kirim\s+ulang|belum\s+(masuk|terima|dapat)|download\s+link|cek\s+(status|order)|track\s+order|already\s+paid|sudah\s+(bayar|transfer)|USD-\d{4,8}-\d{2,4})/i.test(q) || emailMatch) {
    return {
      html: isEn
        ? `After payment via <strong>Polar.sh</strong> (USD) or QRIS, your Google Drive <code>.ZIP</code> link is emailed automatically. If you haven't received it, email <strong>${escAiHtml(supportEmail)}</strong> with your payment receipt or Order ID (e.g. <code>USD-...</code> / <code>DDV-...</code>).`
        : `Setelah pembayaran selesai, link <code>.ZIP</code> dikirim otomatis ke email Anda. Anda bisa mengetikkan <strong>Order ID (<code>DDV-...</code> / <code>USD-...</code>)</strong> di chat ini atau kirim bukti pembayaran ke <strong>${escAiHtml(supportEmail)}</strong>.`,
      actions: [{
        label: isEn ? '✉️ Send Proof to Support' : '✉️ Kirim Bukti ke Admin',
        href: `mailto:${encodeURIComponent(supportEmail)}?subject=${encodeURIComponent('Order / Download Support - ' + SITE_CONFIG.brandName)}`,
        primary: true
      }]
    };
  }

  // 4. Cara bayar (ID QRIS/Mayar & Global Polar.sh)
  if (/(cara\s+bayar|pembayaran|how\s+to\s+pay|payment|\bmayar\b|\bqris\b|\bpolar\b|visa|mastercard|apple\s+pay|\busd\b|dana|gopay|ovo)/i.test(q)) {
    return {
      html: isEn
        ? 'Global buyers pay securely in <strong>USD</strong> via <strong>Polar.sh</strong> (Visa, Mastercard, Apple Pay). Click <strong>Buy Now</strong> or checkout from your Cart, and your Google Drive <code>.ZIP</code> link is delivered automatically after payment.'
        : 'Pembayaran bisa lewat:<br/>&#8226; <strong>Indonesia (IDR):</strong> Scan <strong>QRIS Ddev Studio</strong> (DANA, GoPay, OVO, ShopeePay, m-Banking) lewat tombol <strong>Beli Instan</strong> + konfirmasi email (gateway otomatis Mayar juga disiapkan).<br/>&#8226; <strong>Global (USD):</strong> Kartu/Apple Pay otomatis via <strong>Polar.sh</strong>.',
      actions: []
    };
  }

  // 5. Pertanyaan Bundling / Diskon / Kisaran Harga (Semua produk harga satuan)
  if (/(bundle|bundling|vip|hemat|diskon|discount|promo|249|\$49|all\s+2[45]|2[45]\s+produk|berapa\s+harga|kisaran\s+harga|daftar\s+harga|paling\s+murah|termurah|cheapest|price\s+range|how\s+much)/i.test(q)) {
    return {
      html: isEn
        ? 'All 25 products at <strong>Ddev Studio</strong> are sold individually at transparent unit prices ranging from <strong>$7 to $25 USD</strong> (one-time payment, lifetime access, commercial license — no bundle packages). Pick any tool you need from the catalog!'
        : 'Seluruh 25 produk di <strong>Ddev Studio</strong> dijual dengan <strong>harga satuan transparan mulai Rp 39.000 hingga Rp 169.000</strong> (sekali bayar selamanya, tanpa paket bundling & tanpa biaya langganan). Silakan pilih langsung produk yang sesuai kebutuhan Anda!',
      actions: [{
        label: isEn ? '📋 Browse Catalog' : '📋 Lihat Katalog Produk',
        primary: true,
        onClick: () => {
          toggleAiChatWindow(false);
          const kat = document.getElementById('katalog');
          if (kat) kat.scrollIntoView({ behavior: 'smooth' });
        }
      }]
    };
  }

  // 6. Instalasi / Teknis
  if (/(how\s+to\s+(install|run|setup)|cara\s+(install|instal|pasang|pakai|jalankan|setup)|butuh\s+(xampp|server|hosting)|setup\s+guide|installation|\bxampp\b|\blaragon\b|\bcpanel\b|\.bat\b|panduan|beginner|pemula)/i.test(q)) {
    return {
      html: isEn
        ? 'Every download includes clean source code + <code>SETUP_GUIDE_EN_ID.md</code> / <code>PANDUAN.md</code>:<br/>&#8226; <strong>POS / Web Apps:</strong> Zero-Config launcher (<code>.bat</code> / browser-ready).<br/>&#8226; <strong>PHP 8 Apps:</strong> Includes <code>.sql</code> schema ready for XAMPP/Laragon/cPanel.<br/>&#8226; <strong>Python Tools:</strong> Step-by-step setup guide included.'
        : 'Setiap paket dilengkapi <code>PANDUAN.md</code>:<br/>&#8226; <strong>Kasir &amp; Web Zero-Config:</strong> Tinggal klik file pembuka (<code>.bat</code>) langsung jalan di browser.<br/>&#8226; <strong>PHP 8:</strong> Lengkap file database <code>.sql</code> untuk XAMPP/Laragon/cPanel.<br/>&#8226; <strong>Python Script:</strong> Tinggal ikuti panduan instalasi langkah demi langkah.',
      actions: []
    };
  }

  // 7. Lisensi Komersial
  if (/(lisensi|license|commercial|komersial|subscription|langganan|open\s+source|client|klien)/i.test(q)) {
    return {
      html: isEn
        ? 'All packages are <strong>one-time purchase</strong> (no recurring fees) with <strong>100% unencrypted source code</strong> and a personal + commercial client-project license.'
        : 'Semua produk sistemnya <strong>1x bayar selamanya</strong> (tanpa langganan) dengan <strong>100% source code terbuka tanpa enkripsi</strong> dan boleh dipakai untuk proyek bisnis sendiri maupun klien komersial.',
      actions: [{
        label: isEn ? 'Read Terms & License' : 'Syarat & Lisensi',
        primary: false,
        onClick: () => { if (window.openLegalModal) window.openLegalModal('terms'); }
      }]
    };
  }

  // 8. Rekomendasi umum
  if (/(rekomendasi|rekomen|recommend|best\s+app|popular|catalog|katalog|daftar\s+produk|list|what\s+do\s+you\s+sell|jual\s+apa)/i.test(q)) {
    const picks = productsState.slice(0, 4);
    const listHtml = picks.map((p) => {
      const disp = getProdDisplay(p);
      return `&#8226; <strong>${escAiHtml(disp.title)}</strong> (${escAiHtml(disp.price)})`;
    }).join('<br/>');
    const first = picks[0];
    const acts = first ? [
      {
        label: isEn ? '▶ Test Flagship Demo' : '▶ Coba Demo Terlaris',
        primary: false,
        onClick: () => { toggleAiChatWindow(false); window.openLiveDemoById(first.id); }
      },
      {
        label: isEn ? '⚡ Buy Now' : '⚡ Beli Sekarang',
        primary: true,
        onClick: () => { toggleAiChatWindow(false); window.openInstantCheckoutById(first.id); }
      }
    ] : [];
    return {
      html: (isEn
        ? `Here are our top-selling tools right now:<br/><br/>${listHtml}<br/><br/>Tell me what you want to build (e.g. <em>POS cashier, Python scraper, admin dashboard, or booking app</em>) for a tailored pick!`
        : `Berikut beberapa produk unggulan <strong>Ddev Studio</strong>:<br/><br/>${listHtml}<br/><br/>Sebutkan kebutuhan Anda (misalnya <em>kasir toko, web UMKM, absensi QR, antrian, atau bot Python</em>) agar saya pilihkan yang paling pas!`),
      actions: acts
    };
  }

  // 9. Smart Keyword + Synonym Search across all 24 products
  const syn = [
    [/toko|warung|kasir|pos|struk|stok|gudang|cashier|inventory|retail/i, 'kasir pos inventaris warehouse'],
    [/cafe|kafe|kuliner|restoran|umkm|company|bisnis|agency|sme/i, 'umkm cafe agency profile'],
    [/nikah|pernikahan|wedding|event|undangan|invitation/i, 'undangan wedding'],
    [/keuangan|pengeluaran|budget|finance|finansial|expense/i, 'finansial budget expense'],
    [/pdf|ocr|word|convert|dokumen/i, 'pdf converter ocr'],
    [/scraping|crawl|scraper|excel|sheets/i, 'scraper excel sheets'],
    [/absen|kehadiran|attendance|pegawai|karyawan|siswa/i, 'absensi attendance qr'],
    [/antri|antrian|queue|loket|klinik/i, 'antrian queue'],
    [/telegram|bot|notif|tagihan|billing|reminder/i, 'bot telegram tagihan responder'],
    [/payment|midtrans|checkout|qris|mayar/i, 'payment gateway ecommerce'],
    [/bio|biolink|linktree|portofolio|portfolio/i, 'biolink portfolio'],
    [/dashboard|admin|grafik|analytics|ui\s*kit|saas|component/i, 'dashboard ui kit components'],
    [/invoice|faktur|kwitansi|quotation|receipt/i, 'invoice quotation'],
    [/booking|reservasi|appointment|jadwal|salon|laundry/i, 'booking laundry']
  ];
  let expanded = q;
  syn.forEach(([re, words]) => { if (re.test(q)) expanded += ' ' + words; });
  const stop = { yang:1, dan:1, atau:1, ada:1, bisa:1, untuk:1, buat:1, mau:1, cari:1, butuh:1, dengan:1, dari:1, ini:1, itu:1, apa:1, the:1, and:1, for:1, with:1, best:1, app:1, apps:1, web:1, source:1, code:1 };
  const kw = expanded.split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !stop[w]);
  const scored = productsState.map((p) => {
    const disp = getProdDisplay(p);
    const titleLow = disp.title.toLowerCase();
    const hay = `${p.title} ${p.titleEn || ''} ${p.summary} ${p.summaryEn || ''} ${p.stack} ${(p.categories || []).join(' ')}`.toLowerCase();
    let score = 0;
    kw.forEach((k) => {
      if (titleLow.includes(k)) score += 3;
      else if (hay.includes(k)) score += 1;
    });
    return { p, disp, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    const picks = scored.slice(0, 2);
    const lines = picks.map((x) => `&#8226; <strong>${escAiHtml(x.disp.title)}</strong> (${escAiHtml(x.disp.price)})`).join('<br/>');
    const first = picks[0].p;
    return {
      html: (isEn ? 'Best matches for your request:<br/><br/>' : 'Produk yang paling cocok dengan kebutuhan Anda:<br/><br/>') + lines,
      actions: [
        {
          label: isEn ? '▶ Live Demo' : '▶ Coba Live Demo',
          primary: false,
          onClick: () => { toggleAiChatWindow(false); window.openLiveDemoById(first.id); }
        },
        {
          label: isEn ? '⚡ Buy Now' : '⚡ Beli Sekarang',
          primary: true,
          onClick: () => { toggleAiChatWindow(false); window.openInstantCheckoutById(first.id); }
        }
      ]
    };
  }

  return {
    html: isEn
      ? `I didn't find an exact match for that query. You can ask about specific tools (<em>POS cashier, Python scraper, admin dashboard, laundry, booking</em>), individual pricing (<strong>$7–$25 USD</strong>), or <strong>USD checkout via Polar.sh</strong>.<br/><br/>Need human help? Contact <strong>${escAiHtml(supportEmail)}</strong>.`
      : `Maaf, saya belum menemukan jawaban spesifik untuk pertanyaan tersebut. Coba tanya soal produk tertentu (<em>kasir POS, bot Python, web UMKM, absensi QR, UI kit</em>), harga satuan (<strong>Rp 39rb–169rb</strong>), <strong>cara bayar QRIS/Polar</strong>, atau cek Order ID <code>DDV-...</code>.<br/><br/>Atau hubungi admin di <strong>${escAiHtml(supportEmail)}</strong>.`,
    actions: [{
      label: isEn ? '✉️ Contact Admin' : '✉️ Hubungi Admin',
      href: `mailto:${encodeURIComponent(supportEmail)}?subject=${encodeURIComponent('Question - ' + SITE_CONFIG.brandName)}`,
      primary: false
    }]
  };
}

function sendToAiAssistant(rawText) {
  const text = String(rawText || '').trim();
  if (!text) return;
  const isEn = currentLocale === 'en';
  addAiChatMessage('user', escAiHtml(text), []);

  const gasUrl = String(SITE_CONFIG.gasWebAppUrl || '').trim();
  const orderIdMatch = text.match(/DDV-\d{4,8}-\d{2,4}/i);

  // 1. Live Order ID status check
  if (orderIdMatch && gasUrl) {
    const oid = orderIdMatch[0].toUpperCase();
    const emailMatch = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    const emailQ = emailMatch ? `&email=${encodeURIComponent(emailMatch[0].toLowerCase())}` : '';
    const typingEl = addAiChatMessage('bot', `<em>${isEn ? 'Checking order' : 'Mengecek status pesanan'} ${escAiHtml(oid)}...</em>`, []);
    fetch(`${gasUrl}?action=status&orderId=${encodeURIComponent(oid)}${emailQ}`)
      .then((r) => r.json())
      .then((st) => {
        if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
        if (!st || !st.ok) {
          addAiChatMessage('bot', isEn
            ? `Order <code>${escAiHtml(oid)}</code> was not found. Check the ID or contact <strong>${escAiHtml(SITE_CONFIG.orderEmail)}</strong>.`
            : `Pesanan <code>${escAiHtml(oid)}</code> tidak ditemukan. Pastikan format Order ID benar atau hubungi <strong>${escAiHtml(SITE_CONFIG.orderEmail)}</strong>.`, []);
          return;
        }
        if (st.status === 'PAID') {
          const btns = (st.downloadLinks || [])
            .filter((d) => /^https:\/\//i.test(String(d && d.url || '').trim()))
            .map((d) => ({
              label: (isEn ? '⬇ Download: ' : '⬇ Unduh: ') + String(d.name || 'File').slice(0, 32),
              href: String(d.url).trim(),
              primary: true
            }));
          const msgHtml = btns.length > 0
            ? (isEn
              ? `Order <code>${escAiHtml(oid)}</code> (<strong>${escAiHtml(st.productTitle)}</strong>) is <strong>PAID</strong>! Download your files below:`
              : `Pesanan <code>${escAiHtml(oid)}</code> untuk <strong>${escAiHtml(st.productTitle)}</strong> sudah <strong>LUNAS (PAID)</strong>! Silakan unduh lewat tombol di bawah:`)
            : (isEn
              ? `Order <code>${escAiHtml(oid)}</code> (<strong>${escAiHtml(st.productTitle)}</strong>) is <strong>PAID</strong>! Download links were emailed to you — include your checkout email with <code>${escAiHtml(oid)}</code> here to unlock links directly.`
              : `Pesanan <code>${escAiHtml(oid)}</code> untuk <strong>${escAiHtml(st.productTitle)}</strong> sudah <strong>LUNAS (PAID)</strong>! Link <code>.ZIP</code> dikirim ke email Anda — ketik <code>${escAiHtml(oid)} email@anda.com</code> jika ingin memunculkan link di sini.`);
          addAiChatMessage('bot', msgHtml, btns);
        } else {
          addAiChatMessage('bot', isEn
            ? `Order <code>${escAiHtml(oid)}</code> is currently <strong>PENDING PAYMENT</strong>.`
            : `Pesanan <code>${escAiHtml(oid)}</code> saat ini masih berstatus <strong>MENUNGGU PEMBAYARAN (PENDING)</strong>.`, []);
        }
      })
      .catch(() => {
        if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
        addAiChatMessage('bot', isEn
          ? `Could not verify order right now. Please contact <strong>${escAiHtml(SITE_CONFIG.orderEmail)}</strong>.`
          : `Gagal mengecek status sekarang. Hubungi <strong>${escAiHtml(SITE_CONFIG.orderEmail)}</strong>.`, []);
      });
    return;
  }

  // 1b. Route authoritative pricing/bundle/payment/refund/license intents locally so replies are 100% accurate with action buttons
  if (/(cara\s+bayar|pembayaran|how\s+to\s+pay|payment|\bmayar\b|\bqris\b|\bpolar\b|visa|mastercard|apple\s+pay|\busd\b|bundle|bundling|vip|hemat|diskon|discount|promo|249|\$49|berapa\s+harga|kisaran\s+harga|paling\s+murah|termurah|cheapest|price\s+range|how\s+much|refund|pengembalian|lisensi|license|how\s+to\s+(install|run|setup)|cara\s+(install|instal|pasang|pakai|setup)|USD-\d{4,8}-\d{2,4}|klaim|claim|kirim\s+ulang|belum\s+(masuk|terima|dapat))/i.test(text)) {
    const directRes = buildStorefrontAiFallback(text);
    const hasDemoAsk = /\b(demo|trial|preview|coba)\b/i.test(text);
    const demoLead = hasDemoAsk
      ? (isEn ? 'Yes! Every app includes an interactive <strong>Live Demo</strong> button you can test in your browser first.<br/><br/>' : 'Tentu! Hampir semua produk punya tombol <strong>Live Demo</strong> yang bisa dicoba langsung di browser.<br/><br/>')
      : '';
    aiChatHistoryState.push({ role: 'user', text });
    addAiChatMessage('bot', demoLead + directRes.html, directRes.actions);
    return;
  }

  // 2. Try live Gemini LLM on Apps Script (Indonesian or natural bilingual prompt), else local smart fallback
  if (gasUrl && aiServerGeminiFlag !== false) {
    const typingEl = addAiChatMessage('bot', `<em>${isEn ? 'AI Assistant is typing...' : 'Asisten sedang mengetik...'}</em>`, []);
    const enPricesHint = isEn
      ? '[IMPORTANT FOR EN/GLOBAL USER: Reply in English ONLY. All 25 apps are sold individually ONLY ($7-$25 USD one-time payment per app; NO bundle packages and NO multi-item cart discounts). Global payment is via Polar.sh (Visa, Mastercard, Apple Pay) — NEVER mention IDR/Rupiah/QRIS/Virtual Account/Mayar to USD buyers.] '
      : '[Catatan: Semua 25 produk dijual dengan harga satuan Rp 39.000–Rp 169.000. Tidak ada paket bundling atau diskon tambahan keranjang.] ';
    fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'chat',
        message: enPricesHint + text,
        history: aiChatHistoryState.slice(-6),
        pageTitle: document.title
      })
    })
      .then((r) => r.json())
      .then((data) => {
        if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
        if (data && data.mode === 'gemini' && data.reply) {
          const stalePattern = /vip(\s+all-access)?\s+bundle|paket\s+bundling|rp\s*249\.?000|\$49\b|diskon\s+(?:keranjang\s+)?(?:15|20)%|(?:15|20)%\s+(?:automatic\s+|bundle\s+)?discount/i;
          const wrongEnCurrency = isEn && /(\bRp\s*\d|Rupiah|\bQRIS\b|Virtual Account|Mayar)/i.test(data.reply);
          if (stalePattern.test(data.reply) || wrongEnCurrency) {
            const safeFb = buildStorefrontAiFallback(text);
            aiChatHistoryState.push({ role: 'user', text });
            addAiChatMessage('bot', safeFb.html, safeFb.actions);
            return;
          }
          const normalizedReply = data.reply;
          aiServerGeminiFlag = true;
          aiChatHistoryState.push({ role: 'user', text });
          aiChatHistoryState.push({ role: 'model', text: normalizedReply });
          const formatted = escAiHtml(normalizedReply)
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br/>');
          addAiChatMessage('bot', formatted, []);
          return;
        }
        if (data && data.mode === 'local_fallback') aiServerGeminiFlag = false;
        const fb = buildStorefrontAiFallback(text);
        aiChatHistoryState.push({ role: 'user', text });
        addAiChatMessage('bot', fb.html, fb.actions);
      })
      .catch(() => {
        if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
        const fb = buildStorefrontAiFallback(text);
        addAiChatMessage('bot', fb.html, fb.actions);
      });
    return;
  }

  // 3. Fast bilingual local fallback
  const fb = buildStorefrontAiFallback(text);
  aiChatHistoryState.push({ role: 'user', text });
  addAiChatMessage('bot', fb.html, fb.actions);
}

function toggleAiChatWindow(forceOpen) {
  const aiWindow = document.getElementById('aiChatWindow');
  const aiInput = document.getElementById('aiChatInput');
  if (!aiWindow) return;
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !aiWindow.classList.contains('open');
  aiWindow.classList.toggle('open', shouldOpen);
  aiWindow.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  if (shouldOpen && !aiAssistantBooted) {
    aiAssistantBooted = true;
    const isEn = currentLocale === 'en';
    addAiChatMessage(
      'bot',
      isEn
        ? 'Hi! I\'m the <strong>Ddev Studio AI Assistant</strong>. Ask me to recommend an app, check individual USD pricing ($7–$25), or explain <strong>USD checkout via Polar.sh</strong>.'
        : 'Halo! Saya <strong>Asisten AI Ddev Studio</strong>. Saya bisa bantu carikan source code yang pas, cek harga satuan, jelaskan cara bayar <strong>QRIS / Polar.sh</strong>, atau cek status <strong>Order ID (<code>DDV-...</code>)</strong>.',
      []
    );
  }
  if (shouldOpen && aiInput) aiInput.focus();
}

function initAiAssistantWidget() {
  const launcher = document.getElementById('aiChatLauncher');
  const closeBtn = document.getElementById('closeAiChatBtn');
  const form = document.getElementById('aiChatForm');
  const input = document.getElementById('aiChatInput');
  if (launcher) launcher.addEventListener('click', () => toggleAiChatWindow());
  if (closeBtn) closeBtn.addEventListener('click', () => toggleAiChatWindow(false));
  document.querySelectorAll('.js-ai-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = currentLocale === 'en'
        ? (chip.getAttribute('data-prompt-en') || chip.textContent)
        : (chip.getAttribute('data-prompt-id') || chip.textContent);
      sendToAiAssistant(prompt);
    });
  });
  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value;
      input.value = '';
      sendToAiAssistant(val);
    });
  }
}

let ddevMotionObserver = null;

function initMotionSystem() {
  const nav = document.querySelector('.navbar');
  if (nav) {
    const syncNavScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', syncNavScroll, { passive: true });
    syncNavScroll();
  }

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('has-motion');
  ddevMotionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        ddevMotionObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.01, rootMargin: '80px 0px 80px 0px' }
  );

  const checkVisibleReveals = () => {
    const vh = window.innerHeight || 900;
    document.querySelectorAll('.reveal-item:not(.is-visible)').forEach((el) => {
      if (el.getBoundingClientRect().top < vh + 60) {
        el.classList.add('is-visible');
        if (ddevMotionObserver) ddevMotionObserver.unobserve(el);
      }
    });
  };
  window.addEventListener('scroll', checkVisibleReveals, { passive: true });
  window.addEventListener('resize', checkVisibleReveals, { passive: true });

  window.observeMotionTargets('.bento-box, .step-card, .custom-service-banner, .faq-item, #productGrid .product-card');
}

window.observeMotionTargets = function (selector, immediate = false) {
  const nodes = document.querySelectorAll(selector);
  if (!nodes.length) return;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (immediate || reduced || !ddevMotionObserver) {
    nodes.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const vh = window.innerHeight || 900;
  nodes.forEach((el, idx) => {
    if (el.classList.contains('is-visible')) return;
    el.classList.add('reveal-item');
    el.style.setProperty('--reveal-delay', `${Math.min((idx % 4) * 30, 90)}ms`);
    const rect = el.getBoundingClientRect();
    if (rect.top < vh + 60) {
      requestAnimationFrame(() => el.classList.add('is-visible'));
    } else {
      ddevMotionObserver.observe(el);
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  applySiteBranding();
  initThemeToggle();
  initFeaturedCarouselControls();
  initFaqAccordion();
  loadCartFromStorage();
  loadWishlistFromStorage();
  initBackToTopAndSavedBtn();
  initAiAssistantWidget();
  applyStorefrontLocaleUI();
  initMotionSystem();
  syncFromBloggerCloud();
  try {
    const deepProd = new URLSearchParams(window.location.search).get('product');
    if (deepProd && productsState.some((p) => p.id === deepProd)) {
      window.openDetailById(deepProd);
    }
  } catch (e) {}

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
      currentCatalogPage = 1;
      renderProductsGrid();
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      currentCatalogPage = 1;
      renderProductsGrid();
    });
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortMode = e.target.value || 'newest';
      currentCatalogPage = 1;
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

  const openCartBtn = document.getElementById('openCartBtn');
  if (openCartBtn) openCartBtn.addEventListener('click', openCartDrawer);

  const closeCartBtn = document.getElementById('closeCartBtn');
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => closeModal('cartBackdrop'));

  const cartBackdrop = document.getElementById('cartBackdrop');
  if (cartBackdrop) cartBackdrop.addEventListener('click', () => closeModal('cartBackdrop'));

  const cartDrawer = document.getElementById('cartDrawer');
  if (cartDrawer) cartDrawer.addEventListener('click', (e) => e.stopPropagation());

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
          : (isEn ? `Cart Order (${cartState.length} Products)` : `Pesanan Keranjang (${cartState.length} Produk)`);
      closeModal('cartBackdrop');
      const polarItemsList = isEn ? cartState.map((c) => ({
        title: c.titleEn || c.title,
        price: formatUsd(c.priceUsdNum || idrToCleanUsdNum(c.priceNum)),
        url: c.usdPaymentUrl || SITE_CONFIG.usdStoreUrl
      })) : [];
      launchCheckoutGateway({
        title: orderTitle,
        price: totalStr,
        paymentUrl: isEn
          ? (cartState.length === 1 ? (cartState[0].usdPaymentUrl || SITE_CONFIG.usdStoreUrl) : (polarItemsList[0]?.url || SITE_CONFIG.usdStoreUrl))
          : (cartState.length === 1 ? cartState[0].paymentUrl : '#checkout-mayar'),
        polarItems: polarItemsList,
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

  const customOrderBtn = document.getElementById('customOrderBtn');
  if (customOrderBtn) {
    customOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openCustomConsultModal();
    });
  }

  document.querySelectorAll('[data-legal]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.openLegalModal === 'function') {
        window.openLegalModal(link.getAttribute('data-legal') || 'about');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['demoSimModal', 'detailModal', 'cartBackdrop', 'checkoutModal'].forEach(closeModal);
      toggleAiChatWindow(false);
    }
  });
});

