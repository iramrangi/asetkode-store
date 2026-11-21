/* =========================================================
   PENGATURAN BIO LINK & MINI PORTFOLIO — DDEV
   Cukup edit tulisan di dalam tanda kutip '...' sesuai profil Anda.
   ========================================================= */
var CONFIG = window.CONFIG = {
  // ---------- PROFIL UTAMA ----------
  nama: 'Alex Pratama',
  handle: '@alexpratama.dev',
  profesi: 'Fullstack Developer & UI/UX Designer',
  bio: 'Membantu UMKM, kreator, dan startup membangun website cepat, sistem kasir QRIS otomatis, serta dashboard bisnis siap pakai.',
  avatar: 'assets/img/avatar.jpg',
  lokasi: 'Jakarta, Indonesia',
  zonaWaktu: 'WIB',
  slotTersedia: '2 Slot Proyek Tersedia',
  statusTersedia: true, // true: Tampilkan badge "Open for Freelance", false: sembunyikan
  teksStatus: 'Open for Freelance & Kolaborasi',

  // ---------- STATISTIK RINGKAS (3 item) ----------
  statistik: [
    { angka: '5+ Thn', label: 'Pengalaman' },
    { angka: '42+', label: 'Proyek Live' },
    { angka: '4.9 ★', label: 'Rating Klien' }
  ],

  // ---------- KEAHLIAN / TECH STACK ----------
  keahlian: [
    'React / Next.js',
    'Vue / Nuxt',
    'Tailwind CSS',
    'Node.js & Express',
    'Laravel / PHP',
    'UI/UX Figma',
    'Integrasi QRIS / Payment',
    'SEO & Web Performance'
  ],

  // ---------- SOSIAL MEDIA UTAMA (Ikon di bawah profil) ----------
  sosial: {
    github: 'https://github.com/alexpratama',
    linkedin: 'https://linkedin.com/in/alexpratama',
    instagram: 'https://instagram.com/alexpratama.dev',
    tiktok: 'https://tiktok.com/@alexpratama.tech',
    youtube: 'https://youtube.com/@alexpratama',
    twitter: 'https://x.com/alexpratama',
    whatsapp: 'https://wa.me/6281234567890?text=Halo%20Alex,%20saya%20tertarik%20bekerja%20sama',
    email: 'alexpratama.dev@gmail.com'
  },

  // ---------- LINK UTAMA / TAUTAN CEPAT ----------
  links: [
    {
      judul: 'Lihat 4 Showcase Proyek & Live Demo',
      deskripsi: 'Coba langsung demo e-commerce QRIS, dashboard SaaS, landing page UMKM, & undangan digital',
      url: '#portfolioSection',
      ikon: 'briefcase',
      badge: 'Utama',
      highlight: true
    },
    {
      judul: 'Cek Paket Jasa Website & Rate Card 2026',
      deskripsi: 'Estimasi biaya transparan mulai Rp 450rb + bonus optimasi kecepatan & SEO',
      url: '#servicesSection',
      ikon: 'star',
      badge: 'Promo',
      highlight: false
    },
    {
      judul: 'Konsultasi Proyek / Order Jasa Cepat',
      deskripsi: 'Kirim brief singkat kebutuhan Anda — langsung terhubung ke WhatsApp',
      url: '#inquiry',
      aksi: 'inquiry',
      ikon: 'chat',
      badge: 'Fast',
      highlight: false
    },
    {
      judul: 'Ringkasan CV, Pengalaman & Sertifikasi',
      deskripsi: 'Riwayat kerja Lead Frontend Engineer, proyek klien UMKM, & stack utama',
      url: '#resume',
      aksi: 'resume',
      ikon: 'file',
      badge: 'CV',
      highlight: false
    },
    {
      judul: 'Katalog Source Code & Template Siap Pakai',
      deskripsi: 'Download 17+ source code kasir, toko online, absensi, dan bio link di Ddev Store',
      url: 'https://asetkode.blogspot.com/',
      ikon: 'globe',
      badge: 'Store',
      highlight: false
    },
    {
      judul: 'Dukung Karya Open-Source di Saweria',
      deskripsi: 'Traktir kopi untuk resource gratis, template starter kit, dan tutorial mingguan',
      url: 'https://saweria.co',
      ikon: 'coffee',
      badge: 'Tip',
      highlight: false
    }
  ],

  // ---------- PAKET LAYANAN & RATE CARD ----------
  layanan: [
    {
      nama: 'Landing Page Bisnis & UMKM',
      harga: 'Mulai Rp 450rb',
      durasi: '2–3 Hari',
      populer: false,
      deskripsi: 'Cocok untuk katalog jasa, kedai kopi, klinik, dan kampanye iklan Meta/Google Ads.',
      fitur: ['Desain modern mobile-first', 'Tombol order langsung ke WhatsApp', 'Gratis setup deploy Pages/Vercel']
    },
    {
      nama: 'Toko Online & Checkout QRIS Otomatis',
      harga: 'Mulai Rp 1,5jt',
      durasi: '5–7 Hari',
      populer: true,
      deskripsi: 'Katalog produk lengkap, keranjang pintar, ongkir otomatis, dan verifikasi QRIS.',
      fitur: ['Filter kategori & pencarian instan', 'Integrasi Mayar / Midtrans / Sheets', 'Notifikasi order otomatis email/WA']
    },
    {
      nama: 'Dashboard Admin & Aplikasi Web Custom',
      harga: 'Mulai Rp 2,8jt',
      durasi: '10–14 Hari',
      populer: false,
      deskripsi: 'Sistem manajemen stok, laporan keuangan PDF/Excel, multi-role karyawan.',
      fitur: ['Grafik omzet & KPI real-time', 'Export Excel & cetak struk/invoice', 'Garansi maintenance 30 hari']
    }
  ],

  // ---------- MINI PORTOFOLIO / SHOWCASE PROYEK ----------
  proyek: [
    {
      judul: 'Kopi Nusantara E-Commerce & POS',
      deskripsi: 'Aplikasi katalog toko online dan kasir responsif dengan checkout QRIS otomatis.',
      ringkasan: 'Membangun storefront lengkap dengan filter kategori, keranjang belanja pintar, dan pembayaran otomatis QRIS sehingga memproses transaksi lebih cepat tanpa input manual.',
      gambar: 'assets/img/project-1.jpg',
      tags: ['E-Commerce', 'JavaScript', 'QRIS Flow'],
      demoUrl: 'https://asetkode-store.pages.dev/demo/ecommerce/'
    },
    {
      judul: 'SaaS Analytics & Admin Dashboard',
      deskripsi: 'Dashboard pemantauan transaksi real-time, grafik penjualan, dan manajemen tim.',
      ringkasan: 'Merancang antarmuka dashboard modern dengan dukungan Dark/Light mode, komponen tabel interaktif, filter periode, dan visualisasi metrik bisnis berkecepatan tinggi.',
      gambar: 'assets/img/project-2.jpg',
      tags: ['Dashboard UI', 'Chart.js', 'Responsive'],
      demoUrl: 'https://asetkode-store.pages.dev/demo/dashboard-ui/'
    },
    {
      judul: 'Landing Page Kedai & UMKM Modern',
      deskripsi: 'Website company profile kuliner dengan menu interaktif, galeri foto, dan peta cabang.',
      ringkasan: 'Membantu UMKM kuliner tampil profesional di Google dan Instagram Bio dengan daftar menu berharga dinamis, modal pesan cepat WhatsApp, dan jadwal operasional real-time.',
      gambar: 'assets/img/project-3.jpg',
      tags: ['UMKM Web', 'Menu Digital', 'Fast Load'],
      demoUrl: 'https://asetkode-store.pages.dev/demo/umkm/'
    },
    {
      judul: 'Undangan Digital & RSVP Interaktif',
      deskripsi: 'Tema undangan pernikahan elegan lengkap dengan hitung mundur, amplop digital, & buku tamu.',
      ringkasan: 'Menghadirkan pengalaman undangan digital personal dengan parameter nama tamu otomatis (?to=...), musik latar opsional, galeri prewedding, dan konfirmasi kehadiran instan.',
      gambar: 'assets/img/project-4.jpg',
      tags: ['Interactive', 'RSVP', 'Mobile First'],
      demoUrl: 'https://asetkode-store.pages.dev/demo/undangan/'
    }
  ],

  // ---------- TESTIMONI KLIEN ----------
  testimoniList: [
    {
      kutipan: 'Komunikasi sangat responsif, hasil desain bersih, dan kecepatan website langsung tembus 98 di PageSpeed.',
      nama: 'Nadia Kusuma',
      jabatan: 'Founder Kopi Nusantara'
    },
    {
      kutipan: 'Order lewat website sekarang langsung masuk rapi ke WhatsApp dan spreadsheet. Tim kami sangat terbantu!',
      nama: 'Rizky Hidayat',
      jabatan: 'Owner Toko Bahan Kue Bandung'
    },
    {
      kutipan: 'UI dashboard-nya rapi banget dan gampang dimengerti staf kasir yang baru belajar komputer sekalipun.',
      nama: 'Sinta Wijaya',
      jabatan: 'Manajer Klinik Pratama Sehat'
    }
  ],

  // ---------- PENGALAMAN SINGKAT (untuk Modal CV) ----------
  pengalaman: [
    { peran: 'Lead Frontend & UI Engineer', tempat: 'Studio Digital Jakarta', tahun: '2024 – Sekarang' },
    { peran: 'Fullstack Web Developer (Freelance)', tempat: '40+ Klien UMKM & Startup', tahun: '2021 – 2024' },
    { peran: 'UI/UX Specialist & Design System', tempat: 'Fintech Nusantara Partner', tahun: '2020 – 2021' },
    { peran: 'Sertifikasi Cloud & Web Performance', tempat: 'Dicoding & Google Developers', tahun: '2023' }
  ],

  // ---------- PERTANYAAN UMUM (FAQ) ----------
  faq: [
    {
      tanya: 'Berapa lama estimasi pengerjaan website atau landing page?',
      jawab: 'Landing page standar selesai 2–3 hari kerja setelah materi teks & foto terkumpul. Untuk toko online atau sistem custom berkisar 5–14 hari.'
    },
    {
      tanya: 'Apakah sudah termasuk hosting, domain, atau gratis bulanan?',
      jawab: 'Untuk website statis/landing page dapat dideploy gratis selamanya via Cloudflare Pages / Netlify / GitHub Pages ($0/bulan). Domain .com/.id opsional mulai Rp 150rb/tahun.'
    },
    {
      tanya: 'Bagaimana sistem pembayaran & revisinya?',
      jawab: 'DP 50% di awal proyek dan pelunasan 50% setelah demo final disetujui. Sudah termasuk hingga 3x revisi minor & pendampingan upload.'
    }
  ],

  // ---------- KONTAK V-CARD (.vcf) ----------
  vcard: {
    namaLengkap: 'Alex Pratama',
    organisasi: 'Alex Creative Studio',
    telepon: '+6281234567890',
    email: 'alexpratama.dev@gmail.com',
    website: 'https://asetkode-store.pages.dev/demo/biolink/'
  },

  // ---------- TEMA & TAMPILAN ----------
  temaDefault: 'dark-neon',
  warnaAksen: '#10b981'
};
