/* =========================================================
   PENGATURAN BIO LINK & MINI PORTFOLIO — DDEV
   Cukup edit tulisan di dalam tanda kutip '...' sesuai profil Anda.
   ========================================================= */
const CONFIG = {
  // ---------- PROFIL UTAMA ----------
  nama: 'Alex Pratama',
  handle: '@alexpratama.dev',
  profesi: 'Fullstack Developer & UI/UX Designer',
  bio: 'Membantu bisnis dan startup membangun produk digital yang cepat, estetik, dan siap menghasilkan konversi.',
  avatar: 'assets/img/avatar.jpg',
  lokasi: 'Jakarta, Indonesia',
  zonaWaktu: 'WIB',
  statusTersedia: true, // true: Tampilkan badge "Tersedia untuk Proyek", false: sembunyikan
  teksStatus: 'Open for Freelance & Kolaborasi',

  // ---------- STATISTIK RINGKAS (maks 3 item) ----------
  statistik: [
    { angka: '4+ Thn', label: 'Pengalaman' },
    { angka: '38+', label: 'Proyek Selesai' },
    { angka: '4.9 ★', label: 'Rating Klien' }
  ],

  // ---------- KEAHLIAN / TECH STACK ----------
  keahlian: ['React / Next.js', 'Vue.js', 'Tailwind CSS', 'Node.js', 'UI/UX Figma', 'Laravel / PHP'],

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
  // badge: 'Utama', 'Populer', 'Baru', atau '' (kosong)
  // highlight: true jika ingin diberi bingkai aksen menyala
  // aksi: 'inquiry' (buka form pesan cepat) atau 'resume' (buka ringkasan CV), opsional
  links: [
    {
      judul: 'Lihat Portofolio & Case Study',
      deskripsi: 'Kumpulan aplikasi web, dashboard, dan sistem bisnis terbaru',
      url: '#portfolioSection',
      ikon: 'briefcase',
      badge: 'Utama',
      highlight: true
    },
    {
      judul: 'Konsultasi Proyek / Order Jasa',
      deskripsi: 'Kirim detail kebutuhan website atau aplikasi langsung ke WhatsApp',
      url: '#inquiry',
      aksi: 'inquiry',
      ikon: 'chat',
      badge: 'Cepat',
      highlight: false
    },
    {
      judul: 'Ringkasan CV & Pengalaman Kerja',
      deskripsi: 'Lihat riwayat karier, stack teknologi, dan layanan yang tersedia',
      url: '#resume',
      aksi: 'resume',
      ikon: 'file',
      badge: 'CV',
      highlight: false
    },
    {
      judul: 'Dukung Karya di Saweria / Trakteer',
      deskripsi: 'Traktir kopi untuk artikel dan template open-source gratis',
      url: 'https://saweria.co',
      ikon: 'coffee',
      badge: 'Tip',
      highlight: false
    }
  ],

  // ---------- MINI PORTOFOLIO / SHOWCASE PROYEK ----------
  proyek: [
    {
      judul: 'Kopi Nusantara E-Commerce & POS',
      deskripsi: 'Aplikasi katalog toko online dan kasir responsif dengan checkout QRIS otomatis.',
      ringkasan: 'Membangun storefront lengkap dengan filter kategori, keranjang belanja pintar, dan pembayaran otomatis QRIS sehingga memproses transaksi lebih cepat.',
      gambar: 'assets/img/project-1.jpg',
      tags: ['HTML5/CSS3', 'JavaScript', 'QRIS Flow'],
      demoUrl: 'https://iramrangi.github.io/asetkode-store/demo/ecommerce/'
    },
    {
      judul: 'SaaS Analytics & Admin Dashboard',
      deskripsi: 'Dashboard pemantauan transaksi real-time, grafik penjualan, dan manajemen tim.',
      ringkasan: 'Merancang antarmuka dashboard modern dengan dukungan Dark/Light mode, komponen tabel interaktif, dan visualisasi metrik bisnis berkecepatan tinggi.',
      gambar: 'assets/img/project-2.jpg',
      tags: ['UI Kit', 'Chart.js', 'Responsive'],
      demoUrl: 'https://iramrangi.github.io/asetkode-store/demo/dashboard-ui/'
    }
  ],

  // ---------- TESTIMONI KLIEN (opsional) ----------
  testimoni: {
    kutipan: 'Komunikasi sangat responsif, hasil desain bersih, dan kode mudah dikembangkan tim internal kami.',
    nama: 'Nadia Kusuma',
    jabatan: 'Founder Kopi Nusantara'
  },

  // ---------- PENGALAMAN SINGKAT (untuk Modal CV) ----------
  pengalaman: [
    { peran: 'Lead Frontend & UI Engineer', tempat: 'Studio Digital Jakarta', tahun: '2023 – Sekarang' },
    { peran: 'Fullstack Web Developer (Freelance)', tempat: '30+ Klien UMKM & Startup', tahun: '2021 – 2023' }
  ],

  // ---------- KONTAK V-CARD (.vcf) ----------
  // Memungkinkan pengunjung menyimpan nomor kontak Anda langsung ke buku telepon HP
  vcard: {
    namaLengkap: 'Alex Pratama',
    organisasi: 'Alex Creative Studio',
    telepon: '+6281234567890',
    email: 'alexpratama.dev@gmail.com',
    website: 'https://iramrangi.github.io/asetkode-store/demo/biolink/'
  },

  // ---------- TEMA & TAMPILAN ----------
  // Pilihan tema bawaan: 'dark-neon' (gelap modern) atau 'light-minimal' (bersih terang)
  temaDefault: 'dark-neon',
  warnaAksen: '#10b981' // Bebas ganti ke warna favorit, mis. '#6366f1', '#f97316', '#0ea5e9'
};
