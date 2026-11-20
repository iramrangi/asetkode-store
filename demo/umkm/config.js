/* =========================================================
   KONFIGURASI TOKO — CUKUP EDIT FILE INI SAJA
   Ganti teks di dalam tanda kutip '...' sesuai usaha Anda.
   Simpan file, lalu refresh browser. Selesai!
   ========================================================= */
const CONFIG = {
  // ---------- IDENTITAS USAHA ----------
  namaUsaha: 'Kopi Senja',
  tagline: 'Kopi lokal, rasa juara',
  deskripsiHero: 'Racikan kopi nusantara dari biji pilihan petani lokal. Diseduh segar setiap hari, siap menemani kerja, kuliah, dan obrolan santai Anda.',
  tahunBerdiri: 2021,

  // ---------- PROMO / HIGHLIGHT BAR (opsional) ----------
  promo: {
    aktif: true,
    badge: 'Promo Hari Ini',
    teks: 'Diskon 10% semua menu untuk minimal pesan Rp 30.000',
    kode: 'SENJA10',
    diskonPersen: 10,
    minBelanja: 30000
  },

  // ---------- KONTAK & JAM BUKA ----------
  // Nomor WhatsApp: awali dengan 62 (tanpa 0 dan tanpa +)
  whatsapp: '6281234567890',
  pesanWhatsapp: 'Halo {nama}, saya mau tanya/pesan:',
  email: 'halo@kopisenja.id',
  instagram: 'kopisenja.id',      // tanpa @
  tiktok: 'kopisenja.id',         // tanpa @, kosongkan '' jika tidak ada
  alamat: 'Jl. Malioboro No. 17, Yogyakarta',
  jamBuka: 'Setiap hari, 08.00 – 22.00 WIB',
  jamOperasional: { buka: '08:00', tutup: '22:00' },
  mapsLink: 'https://maps.google.com/?q=Jl.+Malioboro+Yogyakarta',
  // Link embed Google Maps: buka Google Maps > Bagikan > Sematkan peta > salin URL di dalam src="..."
  mapsEmbed: 'https://www.google.com/maps?q=Malioboro+Yogyakarta&output=embed',

  // ---------- ANGKA STATISTIK ----------
  statistik: [
    { angka: 12000, akhiran: '+', label: 'Cangkir terjual' },
    { angka: 4.9,   akhiran: '/5', label: 'Rating pelanggan' },
    { angka: 15,    akhiran: '+', label: 'Varian menu' }
  ],

  // ---------- KEUNGGULAN ----------
  keunggulan: [
    { ikon: 'leaf',  judul: 'Biji Kopi Lokal', teks: 'Langsung dari petani Gayo, Toraja, dan Kintamani.' },
    { ikon: 'flame', judul: 'Diseduh Segar',   teks: 'Setiap pesanan dibuat saat itu juga, bukan stok lama.' },
    { ikon: 'truck', judul: 'Bisa Diantar',    teks: 'Pilih menu di web, kirim pesanan langsung ke WhatsApp.' },
    { ikon: 'tag',   judul: 'Harga Bersahabat',teks: 'Mulai Rp 12 ribuan, ramah di kantong setiap hari.' }
  ],

  // ---------- TENTANG USAHA ----------
  tentang: {
    judul: 'Dari biji pilihan petani lokal, langsung ke cangkir Anda',
    paragraf1: 'Berdiri sejak 2021, kami bermitra langsung dengan petani kopi Nusantara dan UMKM sekitar. Setiap batch disangrai mingguan dalam jumlah kecil agar karakter rasa dan aromanya tetap optimal.',
    paragraf2: 'Nikmati langsung di kedai dengan WiFi kencang dan colokan di tiap meja, atau pesan cepat lewat keranjang WhatsApp untuk menemani aktivitas Anda.',
    poin: [
      '100% Arabika & Robusta pilihan Grade 1',
      'Tanpa sirup sintetis, memakai gula aren asli',
      'Siap terima pesanan rapat & hampers acara'
    ]
  },

  // ---------- MENU / PRODUK ----------
  // kategori dipakai untuk tombol filter. label boleh: 'Terlaris', 'Favorit', 'Baru', atau '' (kosong)
  // varian bersifat opsional (hapus jika menu tidak punya pilihan)
  menu: [
    {
      nama: 'Es Kopi Susu Gula Aren',
      harga: 18000,
      kategori: 'Kopi',
      gambar: 'assets/img/menu-1.jpg',
      label: 'Terlaris',
      varian: ['Normal Sugar', 'Less Sugar'],
      deskripsi: 'Double ristretto, susu segar creamy, dan gula aren organik asli.'
    },
    {
      nama: 'Cappuccino Artisan',
      harga: 22000,
      kategori: 'Kopi',
      gambar: 'assets/img/menu-2.jpg',
      label: '',
      varian: ['Panas', 'Dingin'],
      deskripsi: 'Microfoam lembut dengan karakter espresso cokelat dan kacang panggang.'
    },
    {
      nama: 'Pisang Goreng Keju Coklat',
      harga: 15000,
      kategori: 'Camilan',
      gambar: 'assets/img/menu-3.jpg',
      label: 'Terlaris',
      varian: ['Original', 'Ekstra Keju'],
      deskripsi: 'Pisang kepok kuning renyah hangat dengan parutan keju & meses melimpah.'
    },
    {
      nama: 'Kopi Tubruk Gayo',
      harga: 12000,
      kategori: 'Kopi',
      gambar: 'assets/img/menu-2.jpg',
      label: '',
      varian: ['Pahit', 'Manis'],
      deskripsi: 'Seduhan klasik Arabika Gayo beraroma rempah, kuat, dan bersih di akhir.'
    },
    {
      nama: 'Caramel Oat Latte',
      harga: 25000,
      kategori: 'Kopi',
      gambar: 'assets/img/menu-1.jpg',
      label: 'Favorit',
      varian: ['Dingin', 'Panas'],
      deskripsi: 'Perpaduan susu oat nabati yang gurih dengan saus salted caramel homemade.'
    },
    {
      nama: 'Kyoto Matcha Latte',
      harga: 20000,
      kategori: 'Non-Kopi',
      gambar: 'assets/img/menu-1.jpg',
      label: '',
      varian: ['Dingin', 'Panas'],
      deskripsi: 'Ceremonial matcha bubuk halus berpadu susu segar yang lembut.'
    },
    {
      nama: 'Signature Dark Chocolate',
      harga: 19000,
      kategori: 'Non-Kopi',
      gambar: 'assets/img/menu-2.jpg',
      label: 'Baru',
      varian: ['Dingin', 'Panas'],
      deskripsi: 'Cokelat hitam single-origin pekat dengan sentuhan krim vanila.'
    },
    {
      nama: 'Roti Bakar Srikaya Pandan',
      harga: 14000,
      kategori: 'Camilan',
      gambar: 'assets/img/menu-3.jpg',
      label: '',
      varian: ['Porsi Reguler', 'Potong 4'],
      deskripsi: 'Roti susu tebal panggang mentega dengan selai srikaya pandan homemade.'
    }
  ],

  // ---------- TESTIMONI ----------
  testimoni: [
    { nama: 'Rina A.',  peran: 'Mahasiswi UGM · Google Review',    bintang: 5, teks: 'Es kopi susunya paling seimbang manis dan kopinya! Pesan lewat web ke WhatsApp juga praktis banget.' },
    { nama: 'Budi S.',  peran: 'Karyawan Swasta · Pelanggan Rutin', bintang: 5, teks: 'Langganan pesan antar tiap pagi buat tim kantor. Packaging rapi, esnya tidak cepat cair, selalu on-time.' },
    { nama: 'Dewi P.',  peran: 'Content Creator · Yogyakarta',      bintang: 5, teks: 'Tempatnya estetik dan tenang, WiFi kencang, camilan pisang goreng kejunya wajib pesan kalau ke sini.' }
  ],

  // ---------- FAQ ----------
  faq: [
    { tanya: 'Bagaimana cara memesan menu?', jawab: 'Pilih menu yang Anda suka lalu klik tombol "+ Pesan". Setelah selesai memilih, buka ringkasan pesanan di bawah layar untuk mengirim rincian otomatis ke WhatsApp kami.' },
    { tanya: 'Apakah pesanan bisa diantar?', jawab: 'Bisa! Kami melayani pengantaran langsung radius 5 km dari kedai (gratis ongkir min. 3 cup), atau dapat dipesan melalui GoFood & GrabFood.' },
    { tanya: 'Metode pembayaran apa saja yang tersedia?', jawab: 'Kami menerima pembayaran Tunai di tempat, QRIS (semua e-wallet & m-banking), Transfer Bank, DANA, OVO, dan GoPay.' },
    { tanya: 'Apakah menerima pesanan rapat atau hampers acara?', jawab: 'Ya, tersedia paket kopi botolan 1 liter & snack box untuk rapat, arisan, hingga acara kantor. Hubungi kami minimal H-1 untuk penawaran khusus.' }
  ],

  // ---------- TAMPILAN ----------
  // Warna utama (format HEX). Contoh lain: '#2563eb' biru, '#16a34a' hijau, '#db2777' pink
  warnaUtama: '#c2410c',
  mataUang: 'Rp'
};
