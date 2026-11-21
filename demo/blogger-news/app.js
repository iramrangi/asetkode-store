/* Ddev NewsPro v2.0 — Interactive Editorial Preview Script */
(function () {
  "use strict";

  const CATEGORIES = [
    "Semua",
    "Teknologi",
    "Bisnis & UMKM",
    "Ekonomi Digital",
    "AI & Otomasi",
    "Gadget"
  ];

  const ARTICLES = [
    {
      id: "pusat-data-ai-nusantara",
      title: "Gelombang Investasi Pusat Data AI di Batam dan Cikarang Tembus Rp 48 Triliun",
      subtitle: "Permintaan komputasi kecerdasan buatan memicu pembangunan fasilitas hyperscale berpendingin cair pertama di koridor industri Indonesia.",
      category: "Teknologi",
      author: "Raka Pratama",
      authorRole: "Editor Teknologi & Infrastruktur",
      authorInitials: "RP",
      authorBio: "Jurnalis teknologi yang meliput infrastruktur cloud, telekomunikasi, dan ekosistem semikonduktor Asia Tenggara selama 9 tahun.",
      date: "21 Nov 2026",
      readTime: "6 menit baca",
      views: 18420,
      artType: "datacenter",
      caption: "Ilustrasi arsitektur rak komputasi AI berpendingin cair dan konektivitas serat optik lintas pulau.",
      body: `
        <p>Koridor industri Cikarang dan kawasan ekonomi khusus Nongsa di Batam kembali menjadi magnet utama investasi infrastruktur digital Asia Tenggara. Sepanjang paruh kedua tahun ini, konsorsium operator pusat data regional dan perusahaan teknologi global mengumumkan komitmen pembangunan fasilitas berkapasitas total lebih dari 320 megawatt yang dirancang khusus untuk beban kerja kecerdasan buatan.</p>
        <p>Berbeda dengan generasi pusat data konvensional yang hanya melayani penyimpanan awan dan aplikasi web, fasilitas terbaru ini mengadopsi sistem pendingin cair langsung ke cip (<em>direct-to-chip liquid cooling</em>) untuk menjaga suhu klaster GPU berdensitas tinggi tetap stabil tanpa memboroskan konsumsi air.</p>
        <h2>Mengapa Indonesia Jadi Titik Strategis Baru?</h2>
        <p>Keterbatasan lahan dan kuota energi di negara tetangga membuat operator global mempercepat ekspansi ke kota penyangga Jakarta serta pulau Batam yang terhubung langsung dengan kabel laut internasional. Latensi jaringan di bawah 12 milidetik menuju Singapura menjadikan Batam ideal untuk pemrosesan inferensi waktu nyata.</p>
        <h3>Kesiapan Pasokan Listrik Hijau</h3>
        <p>Selain faktor geografis, investor mensyaratkan sertifikat energi terbarukan (REC) serta kontrak pasokan listrik stabil dari pembangkit surya terapung dan panas bumi. Pengelola kawasan kini berlomba menyediakan gardu induk berdedikasi agar proses konstruksi dapat rampung dalam waktu kurang dari 18 bulan.</p>
        <blockquote>"Kebutuhan daya per rak server kini melonjak dari 8 kilowatt menjadi lebih dari 60 kilowatt. Operator yang tidak siap dengan desain termal dan energi bersih akan tertinggal," ujar Direktur Infrastruktur Awan Nusantara dalam forum industri di Jakarta.</blockquote>
        <h2>Dampak Nyata bagi Startup dan Talenta Lokal</h2>
        <p>Hadirnya kapasitas komputasi di dalam negeri memangkas biaya sewa GPU bagi pengembang aplikasi lokal hingga 22 persen sekaligus memudahkan kepatuhan regulasi kedaulatan data sektor keuangan dan kesehatan.</p>
        <ul>
          <li>Permintaan teknisi kelistrikan, jaringan optik, dan manajemen termal meningkat 3 kali lipat.</li>
          <li>Perusahaan rintisan AI berbahasa daerah mulai melatih model ringkas secara lokal tanpa mengirim data ke luar negeri.</li>
          <li>Vendor manufaktur panel listrik dan sistem UPS domestik memperoleh kontrak pasokan komponen bernilai ratusan miliar rupiah.</li>
        </ul>
      `
    },
    {
      id: "umkm-kuliner-qris-otomatis",
      title: "Digitalisasi Kasir & QRIS Dongkrak Omzet UMKM Kuliner hingga 37 Persen",
      subtitle: "Integrasi pembukuan otomatis dan rekap transaksi nontunai membantu pelaku usaha kecil menekan kebocoran kas harian.",
      category: "Bisnis & UMKM",
      author: "Siti Rahma",
      authorRole: "Reporter Bisnis & Ritel",
      authorInitials: "SR",
      authorBio: "Fokus meliput transformasi UMKM, ritel modern, koperasi digital, dan strategi pembiayaan usaha mikro di berbagai daerah.",
      date: "20 Nov 2026",
      readTime: "5 menit baca",
      views: 15290,
      artType: "umkm",
      caption: "Ilustrasi integrasi pembayaran QRIS, kasir digital, dan laporan arus kas harian untuk gerai UMKM.",
      body: `
        <p>Di sudut kawasan Tebet, Jakarta Selatan, kedai kopi dan roti rumahan milik Hendra Gunawan tak lagi mengandalkan buku tulis untuk mencatat ratusan transaksi harian. Sejak beralih ke sistem kasir digital yang terhubung langsung dengan QRIS dinamis, selisih setoran harian hampir sepenuhnya hilang dan antrean jam makan siang terurai dua kali lebih cepat.</p>
        <p>Tren serupa terjadi di Bandung, Surabaya, dan Makassar. Survei asosiasi ritel mikro mencatat bahwa UMKM kuliner yang menggabungkan pencatatan stok otomatis dengan pembayaran nontunai mengalami kenaikan rata-rata nilai keranjang belanja hingga 37 persen dalam enam bulan pertama.</p>
        <h2>Dari Sekadar Pembayaran ke Riwayat Kredit</h2>
        <p>Keunggulan terbesar transaksi nontunai bukan hanya kepraktisan bagi pembeli, melainkan jejak arus kas digital yang rapi. Catatan penjualan terverifikasi ini mempermudah pelaku usaha mengakses kredit modal kerja berbunga rendah tanpa harus menyiapkan agunan aset fisik yang rumit.</p>
        <h3>Tiga Hambatan Utama di Lapangan</h3>
        <p>Meski adopsi meningkat pesat, pendampingan tetap dibutuhkan agar pemilik gerai benar-benar memanfaatkan fitur analisis produk terlaris dan manajemen bahan baku, bukan sekadar memajang stiker kode QR di meja kasir.</p>
        <blockquote>"Begitu data penjualan harian terbaca jelas per jam, kami tahu kapan harus menyiapkan adonan ekstra dan menu mana yang marginnya paling sehat," jelas Hendra.</blockquote>
        <ul>
          <li>Rekap otomatis mengurangi waktu tutup buku malam dari 45 menit menjadi 5 menit.</li>
          <li>Notifikasi stok minimum mencegah kehabisan bahan baku utama saat akhir pekan.</li>
        </ul>
      `
    },
    {
      id: "ai-agen-otonom-customer-service",
      title: "Era AI Agentic: Otomasi Layanan Pelanggan Kini Mampu Menyelesaikan Transaksi Sendiri",
      subtitle: "Perusahaan e-commerce dan perbankan mulai mengganti chatbot kaku dengan agen AI yang terhubung ke sistem inventori dan refund.",
      category: "AI & Otomasi",
      author: "Dimas Wijaya",
      authorRole: "Analis Kecerdasan Buatan",
      authorInitials: "DW",
      authorBio: "Menulis analisis mendalam seputar arsitektur LLM, otomasi alur kerja perusahaan, serta etika implementasi AI di Indonesia.",
      date: "19 Nov 2026",
      readTime: "7 menit baca",
      views: 14650,
      artType: "ai",
      caption: "Ilustrasi orkestrasi agen AI otonom yang terhubung dengan API stok, logistik, dan verifikasi pelanggan.",
      body: `
        <p>Generasi pertama chatbot layanan pelanggan sering kali memicu frustrasi karena hanya mampu mengulang jawaban template FAQ. Kini, pendekatan baru bernama <em>agentic AI</em> memungkinkan asisten virtual memahami konteks keluhan, memeriksa status resi logistik secara langsung, hingga memproses penjadwalan ulang pengiriman dengan persetujuan pengaman berlapis.</p>
        <p>Di beberapa lokapasar nasional, agen AI kini menangani lebih dari 64 persen tiket pertanyaan rutin dengan tingkat resolusi tuntas tanpa eskalasi ke agen manusia, sementara tim layanan pelanggan manusia difokuskan pada kasus sengketa bernilai tinggi dan empati krisis.</p>
        <h2>Arsitektur Pengaman Agar AI Tidak Berhalusinasi</h2>
        <p>Penerapan agen otonom di industri teregulasi seperti fintech menuntut pagar pengaman ketat. Setiap aksi pengubahan data atau pengembalian dana di atas nominal tertentu tetap melewati mesin aturan deterministik dan audit log real-time.</p>
        <h3>Peran Baru bagi Tim Operasional</h3>
        <p>Alih-alih hilang, peran staf layanan pelanggan bergeser menjadi supervisor kualitas percakapan dan pelatih basis pengetahuan produk agar nada komunikasi merek tetap hangat dan manusiawi.</p>
        <blockquote>"Kunci keberhasilan otomasi bukanlah menghapus manusia, melainkan membiarkan mesin mengerjakan hal berulang sementara manusia mengambil keputusan bernuansa," ungkap Kepala Produk Otomasi di salah satu platform niaga.</blockquote>
        <h2>Checklist Sebelum Perusahaan Mengadopsi AI Agentic</h2>
        <ul>
          <li>Pastikan API internal memiliki kontrol izin berbasis peran (RBAC) yang ketat.</li>
          <li>Siapkan jalur eskalasi instan ke operator manusia dalam satu klik bila sentimen pengguna menurun.</li>
          <li>Lakukan evaluasi akurasi mingguan terhadap sampel percakapan berbahasa daerah dan bahasa gaul.</li>
        </ul>
      `
    },
    {
      id: "ekonomi-kreator-micro-saas",
      title: "Ekonomi Kreator Bergeser ke Produk Digital & Micro-SaaS Berbasis Langganan",
      subtitle: "Kreator edukasi dan developer independen tak lagi bergantung penuh pada pendapatan iklan, melainkan beralih ke perangkat lunak ringkas.",
      category: "Ekonomi Digital",
      author: "Nadia Kusuma",
      authorRole: "Editor Ekonomi Digital",
      authorInitials: "NK",
      authorBio: "Mengulas model bisnis ekonomi digital, monetisasi kreator, SaaS lokal, dan arus pendanaan modal ventura Nusantara.",
      date: "18 Nov 2026",
      readTime: "5 menit baca",
      views: 12180,
      artType: "economy",
      caption: "Ilustrasi pergeseran model monetisasi kreator dari adsense ke produk digital, template, dan langganan micro-SaaS.",
      body: `
        <p>Volatilitas algoritma media sosial mendorong ribuan kreator konten teknologi, desain, dan keuangan di Indonesia membangun sumber pendapatan yang lebih tahan guncangan. Mereka kini mengemas keahlian spesifik menjadi template produktivitas, kit otomasi, hingga aplikasi <em>micro-SaaS</em> berbiaya langganan terjangkau.</p>
        <p>Dengan dukungan gerbang pembayaran lokal yang mendukung QRIS instan dan virtual account, proses distribusi produk digital tak lagi terhambat kepemilikan kartu kredit. Seorang pengembang tunggal di Yogyakarta bahkan mampu melayani lebih dari 1.800 pelanggan UMKM lewat aplikasi faktur ringan.</p>
        <h2>Mengapa Micro-SaaS Lebih Lincah dari Software Raksasa?</h2>
        <p>Aplikasi berskala besar sering kali penuh fitur yang tidak dibutuhkan pelaku usaha kecil. Sebaliknya, micro-SaaS menyelesaikan satu masalah spesifik dengan sangat baik—mulai dari pengingat tagihan WhatsApp hingga generator laporan pajak bulanan.</p>
        <blockquote>"Pelanggan tidak membeli software karena fiturnya ratusan, mereka membayar karena masalah hariannya selesai dalam tiga menit," kata pengamat ekosistem produk digital di Bandung.</blockquote>
        <ul>
          <li>Biaya operasional server modern sangat efisien berkat arsitektur serverless.</li>
          <li>Komunitas pengguna yang loyal menjadi kanal distribusi organik paling hemat biaya.</li>
        </ul>
      `
    },
    {
      id: "review-chipset-npu-laptop-tipis",
      title: "Uji Performa Laptop Tipis Ber-NPU 50 TOPS: Baterai Tembus 17 Jam Kerja Nyata",
      subtitle: "Generasi prosesor laptop terbaru menghadirkan efisiensi daya luar biasa untuk penyuntingan video, coding, dan AI lokal tanpa colokan.",
      category: "Gadget",
      author: "Bagas Mahendra",
      authorRole: "Reviewer Perangkat Keras",
      authorInitials: "BM",
      authorBio: "Penguji perangkat keras, laptop kerja, ponsel flagship, dan aksesori produktivitas dengan metodologi pengujian lab terukur.",
      date: "17 Nov 2026",
      readTime: "6 menit baca",
      views: 11340,
      artType: "gadget",
      caption: "Ilustrasi profil laptop ultrabook modern dengan modul NPU terintegrasi dan efisiensi termal senyap.",
      body: `
        <p>Selama bertahun-tahun, pengguna laptop tipis berbasis Windows maupun Linux harus memilih antara bobot ringan atau daya tahan baterai seharian. Pengujian kami selama dua pekan terhadap lini laptop generasi prosesor 3 nanometer terbaru menunjukkan lompatan efisiensi yang benar-benar terasa saat bekerja mobile.</p>
        <p>Dalam simulasi kerja redaksi—membuka 24 tab peramban, konferensi video, penyuntingan foto RAW ringan, dan menjalankan asisten transkripsi lokal pada unit NPU—perangkat mampu bertahan hingga 17 jam 15 menit pada kecerahan layar 200 nits.</p>
        <h2>Peran NPU Khusus pada Beban Kerja Sehari-hari</h2>
        <p>Ketika efek buram latar belakang rapat daring atau peredam bising mikrofon dipindahkan ke NPU, CPU utama tetap berada dalam kondisi hemat daya dan kipas nyaris tidak pernah berputar terdengar.</p>
        <h3>Kualitas Layar OLED dan Port Konektivitas</h3>
        <p>Panel OLED 120Hz beresolusi 2.8K kini semakin terjangkau di segmen harga Rp 14–17 jutaan, lengkap dengan dua port USB4 serta HDMI ukuran penuh tanpa perlu membawa dongle tambahan.</p>
        <blockquote>"Untuk pertama kalinya, membawa pengisi daya bukan lagi kewajiban saat liputan luar kota sehari penuh," catat tim lab pengujian kami.</blockquote>
      `
    },
    {
      id: "standar-keamanan-passkey-perbankan",
      title: "Perbankan Nasional Mulai Wajibkan Passkey Biometrik untuk Tekan Penipuan OTP",
      subtitle: "Langkah migrasi dari SMS OTP ke standar FIDO2 memangkas risiko rekayasa sosial dan pencurian kredensial aplikasi mobile.",
      category: "Teknologi",
      author: "Raka Pratama",
      authorRole: "Editor Teknologi & Infrastruktur",
      authorInitials: "RP",
      authorBio: "Jurnalis teknologi yang meliput infrastruktur cloud, telekomunikasi, dan ekosistem semikonduktor Asia Tenggara selama 9 tahun.",
      date: "16 Nov 2026",
      readTime: "4 menit baca",
      views: 9840,
      artType: "security",
      caption: "Ilustrasi otentikasi kriptografis passkey berbasis biometrik perangkat untuk menggantikan SMS OTP.",
      body: `
        <p>Modus penipuan berbasis pengelabuan kode OTP SMS terus berevolusi sepanjang tahun ini. Merespons celah tersebut, sejumlah bank digital dan bank komersial besar di Indonesia mulai mengaktifkan login dan otorisasi transfer berbasis <em>passkey</em> standar FIDO2.</p>
        <p>Berbeda dengan kata sandi atau kode angka 6 digit yang bisa diminta secara manipulatif oleh penipu lewat telepon, kunci kriptografis passkey terikat langsung pada perangkat fisik dan hanya terbuka melalui sidik jari atau pemindaian wajah pemilik asli.</p>
        <h2>Cara Kerja Passkey Secara Sederhana</h2>
        <p>Perangkat menyimpan kunci privat di chip keamanan internal, sementara server bank hanya memegang kunci publik. Akibatnya, pelaku kejahatan siber tidak bisa mencuri rahasia otentikasi meski berhasil membuat situs tiruan yang mirip.</p>
        <ul>
          <li>Tidak ada lagi biaya pengiriman SMS OTP yang membebani operasional.</li>
          <li>Proses login dan konfirmasi transaksi menjadi 60 persen lebih cepat bagi nasabah.</li>
        </ul>
      `
    },
    {
      id: "logistik-pintar-gudang-otomatis",
      title: "Gudang Pintar & Sortir Otomatis Pangkas Ongkos Kirim Lintas Pulau hingga 19 Persen",
      subtitle: "Penerapan pemindai dimensi 3D dan perutean berbasis AI mempercepat distribusi barang UMKM dari Jawa ke Indonesia Timur.",
      category: "Ekonomi Digital",
      author: "Nadia Kusuma",
      authorRole: "Editor Ekonomi Digital",
      authorInitials: "NK",
      authorBio: "Mengulas model bisnis ekonomi digital, monetisasi kreator, SaaS lokal, dan arus pendanaan modal ventura Nusantara.",
      date: "15 Nov 2026",
      readTime: "5 menit baca",
      views: 8730,
      artType: "logistics",
      caption: "Ilustrasi pusat sortir logistik modern dengan pemindai paket otomatis dan rute armada terintegrasi.",
      body: `
        <p>Salah satu tantangan terbesar perdagangan daring antar-pulau di negara kepulauan adalah tingginya biaya logistik akibat muatan kontainer yang tidak optimal dan keterlambatan sortir manual di hub transit. Kini, operator logistik terkemuka mengandalkan konveyor sortir berkecepatan tinggi yang memindai volume dan tujuan paket dalam hitungan milidetik.</p>
        <p>Hasilnya terasa langsung bagi penjual daring daerah: waktu tempuh pengiriman dari pusat produksi ke kota tujuan di Kalimantan dan Sulawesi berkurang rata-rata 1,5 hari dengan tarif yang jauh lebih kompetitif.</p>
        <h2>Optimalisasi Muatan Berbasis Prediksi Permintaan</h2>
        <p>Sistem perangkat lunak logistik memprediksi lonjakan volume belanja sebelum tanggal kembar bulanan sehingga stok produk populer sudah ditempatkan di gudang regional terdekat sebelum pesanan masuk.</p>
        <blockquote>"Efisiensi rantai pasok bukan hanya soal truk lebih cepat, tetapi memprediksi barang apa yang harus berada di kota mana sebelum tombol beli ditekan," jelas analis rantai pasok nasional.</blockquote>
      `
    },
    {
      id: "smartphone-kamera-periskop-menengah",
      title: "Kamera Periskop & Layar LTPO Turun Kelas ke Ponsel Harga Rp 4 Jutaan",
      subtitle: "Persaingan ketat produsen smartphone membuat fitur flagship dua tahun lalu kini menjadi standar baru di segmen menengah.",
      category: "Gadget",
      author: "Bagas Mahendra",
      authorRole: "Reviewer Perangkat Keras",
      authorInitials: "BM",
      authorBio: "Penguji perangkat keras, laptop kerja, ponsel flagship, dan aksesori produktivitas dengan metodologi pengujian lab terukur.",
      date: "14 Nov 2026",
      readTime: "4 menit baca",
      views: 8190,
      artType: "smartphone",
      caption: "Ilustrasi modul lensa telefoto periskop dan panel layar adaptif 1–120Hz pada smartphone kelas menengah.",
      body: `
        <p>Pembeli ponsel di rentang harga Rp 4 juta hingga Rp 5,5 juta tahun ini menjadi pihak yang paling diuntungkan oleh ketatnya persaingan antar-produsen. Fitur yang sebelumnya eksklusif di seri flagship seperti lensa telefoto periskop 3x zoom optik dan sertifikasi tahan air IP68 kini mulai hadir secara luas.</p>
        <p>Selain peningkatan sektor optik, penggunaan baterai silikon-karbon berkapasitas 6.000 mAh dalam bodi setipis 7,8 milimeter memberikan ketahanan daya dua hari penuh tanpa membuat ponsel terasa berat di saku.</p>
        <h2>Yang Perlu Diperhatikan Sebelum Membeli</h2>
        <p>Konsumen disarankan tetap memeriksa dukungan pembaruan sistem operasi minimal 4 tahun serta kestabilan pemrosesan gambar pada kondisi minim cahaya sebelum menjatuhkan pilihan.</p>
        <ul>
          <li>Lensa telefoto optik jauh lebih tajam dibanding crop digital untuk foto potret.</li>
          <li>Layar LTPO menghemat baterai saat membaca artikel panjang atau membuka dokumen.</li>
        </ul>
      `
    }
  ];

  const ART_PALETTES = {
    datacenter: ["#0f172a", "#dc2626", "#38bdf8"],
    umkm: ["#1e1b4b", "#f97316", "#22c55e"],
    ai: ["#090d16", "#dc2626", "#a855f7"],
    economy: ["#064e3b", "#10b981", "#f59e0b"],
    gadget: ["#111827", "#2563eb", "#f43f5e"],
    security: ["#0f172a", "#0ea5e9", "#ef4444"],
    logistics: ["#1e293b", "#ea580c", "#38bdf8"],
    smartphone: ["#18181b", "#e11d48", "#fbbf24"]
  };

  function renderEditorialArt(artType, label) {
    const [bg, c1, c2] = ART_PALETTES[artType] || ART_PALETTES.datacenter;
    const safeLabel = String(label || "EDITORIAL").toUpperCase();
    return `
      <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${safeLabel}">
        <defs>
          <linearGradient id="g-${artType}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg}"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
          <radialGradient id="r-${artType}" cx="75%" cy="25%" r="65%">
            <stop offset="0%" stop-color="${c1}" stop-opacity="0.42"/>
            <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="800" height="500" fill="url(#g-${artType})"/>
        <rect width="800" height="500" fill="url(#r-${artType})"/>
        <g stroke="rgba(255,255,255,0.08)" stroke-width="1">
          <line x1="0" y1="100" x2="800" y2="100"/>
          <line x1="0" y1="200" x2="800" y2="200"/>
          <line x1="0" y1="300" x2="800" y2="300"/>
          <line x1="0" y1="400" x2="800" y2="400"/>
          <line x1="160" y1="0" x2="160" y2="500"/>
          <line x1="320" y1="0" x2="320" y2="500"/>
          <line x1="480" y1="0" x2="480" y2="500"/>
          <line x1="640" y1="0" x2="640" y2="500"/>
        </g>
        <circle cx="620" cy="140" r="118" fill="${c2}" fill-opacity="0.14" stroke="${c2}" stroke-opacity="0.45" stroke-width="2"/>
        <circle cx="620" cy="140" r="68" fill="${c1}" fill-opacity="0.22"/>
        <rect x="76" y="138" width="380" height="214" rx="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
        <rect x="104" y="172" width="130" height="14" rx="7" fill="${c1}"/>
        <rect x="104" y="204" width="312" height="16" rx="8" fill="rgba(255,255,255,0.85)"/>
        <rect x="104" y="232" width="248" height="14" rx="7" fill="rgba(255,255,255,0.45)"/>
        <path d="M104 318 L184 276 L264 298 L348 242 L422 268" fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="348" cy="242" r="7" fill="#ffffff" stroke="${c2}" stroke-width="3"/>
        <text x="76" y="422" fill="rgba(255,255,255,0.52)" font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-size="18" font-weight="700" letter-spacing="4">DDEV NEWSPRO // ${safeLabel}</text>
      </svg>
    `;
  }

  const state = {
    category: "Semua",
    search: "",
    activeArticleId: null,
    theme: "light",
    readMode: "normal"
  };

  const dom = {
    readingProgressWrap: document.getElementById("readingProgressWrap"),
    readingProgressBar: document.getElementById("readingProgressBar"),
    currentDateText: document.getElementById("currentDateText"),
    tickerTrack: document.getElementById("tickerTrack"),
    brandHomeBtn: document.getElementById("brandHomeBtn"),
    searchInput: document.getElementById("searchInput"),
    searchClearBtn: document.getElementById("searchClearBtn"),
    readModeToggle: document.getElementById("readModeToggle"),
    readModeLabel: document.getElementById("readModeLabel"),
    themeToggle: document.getElementById("themeToggle"),
    themeIcon: document.getElementById("themeIcon"),
    themeLabel: document.getElementById("themeLabel"),
    categoryNav: document.getElementById("categoryNav"),
    homeView: document.getElementById("homeView"),
    heroSection: document.getElementById("heroSection"),
    heroGrid: document.getElementById("heroGrid"),
    gridSectionTitle: document.getElementById("gridSectionTitle"),
    gridResultMeta: document.getElementById("gridResultMeta"),
    resetFilterBtn: document.getElementById("resetFilterBtn"),
    newsGrid: document.getElementById("newsGrid"),
    popularPostsList: document.getElementById("popularPostsList"),
    labelCloudList: document.getElementById("labelCloudList"),
    newsletterForm: document.getElementById("newsletterForm"),
    newsletterEmail: document.getElementById("newsletterEmail"),
    newsletterFeedback: document.getElementById("newsletterFeedback"),
    articleView: document.getElementById("articleView"),
    backHomeBtn: document.getElementById("backHomeBtn"),
    breadcrumbHomeBtn: document.getElementById("breadcrumbHomeBtn"),
    breadcrumbCategoryBtn: document.getElementById("breadcrumbCategoryBtn"),
    breadcrumbTitle: document.getElementById("breadcrumbTitle"),
    articleCategoryBadge: document.getElementById("articleCategoryBadge"),
    articleTitle: document.getElementById("articleTitle"),
    articleSubtitle: document.getElementById("articleSubtitle"),
    articleAuthorAvatar: document.getElementById("articleAuthorAvatar"),
    articleAuthorName: document.getElementById("articleAuthorName"),
    articleAuthorRole: document.getElementById("articleAuthorRole"),
    articleMetaDate: document.getElementById("articleMetaDate"),
    articleReadTime: document.getElementById("articleReadTime"),
    articleViews: document.getElementById("articleViews"),
    articleHeroFigure: document.getElementById("articleHeroFigure"),
    articleHeroMedia: document.getElementById("articleHeroMedia"),
    articleHeroCaption: document.getElementById("articleHeroCaption"),
    tocBox: document.getElementById("tocBox"),
    articleToc: document.getElementById("articleToc"),
    articleBody: document.getElementById("articleBody"),
    shareWaBtn: document.getElementById("shareWaBtn"),
    shareXBtn: document.getElementById("shareXBtn"),
    shareTgBtn: document.getElementById("shareTgBtn"),
    copyLinkBtn: document.getElementById("copyLinkBtn"),
    bioAvatar: document.getElementById("bioAvatar"),
    bioName: document.getElementById("bioName"),
    bioRole: document.getElementById("bioRole"),
    bioText: document.getElementById("bioText"),
    relatedPostsGrid: document.getElementById("relatedPostsGrid"),
    sidebarBackBtn: document.getElementById("sidebarBackBtn"),
    footerCatLinks: document.getElementById("footerCatLinks"),
    footerTrendingLinks: document.getElementById("footerTrendingLinks"),
    footerYear: document.getElementById("footerYear"),
    toastMessage: document.getElementById("toastMessage")
  };

  let toastTimer = null;

  function showToast(msg) {
    dom.toastMessage.textContent = msg;
    dom.toastMessage.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      dom.toastMessage.classList.remove("is-visible");
    }, 2400);
  }

  function formatViews(num) {
    return (num / 1000).toFixed(1).replace(".", ",") + "rb dibaca";
  }

  function setDateHeader() {
    try {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(now);
      dom.currentDateText.textContent = formatted;
      dom.footerYear.textContent = String(now.getFullYear());
    } catch (_err) {
      dom.currentDateText.textContent = "Sabtu, 21 November 2026";
    }
  }

  function renderTicker() {
    const items = ARTICLES.slice(0, 6);
    const doubled = items.concat(items);
    dom.tickerTrack.innerHTML = doubled
      .map(function (art) {
        return `<button type="button" class="ticker-item" data-open-id="${art.id}"><span class="ticker-cat">[${art.category}]</span><span>${art.title}</span></button>`;
      })
      .join("");
  }

  function renderNav() {
    dom.categoryNav.innerHTML = CATEGORIES.map(function (cat) {
      const active = state.category === cat ? " is-active" : "";
      return `<button type="button" class="nav-pill${active}" data-cat="${cat}">${cat}</button>`;
    }).join("");
  }

  function renderHero() {
    const isDefaultHome = state.category === "Semua" && !state.search.trim();
    dom.heroSection.style.display = isDefaultHome ? "block" : "none";
    if (!isDefaultHome) return;

    const lead = ARTICLES[0];
    const sideItems = ARTICLES.slice(1, 4);
    const trending = ARTICLES.slice().sort(function (a, b) { return b.views - a.views; }).slice(0, 5);

    const leadHtml = `
      <article class="hero-lead-card" data-open-id="${lead.id}">
        <div class="hero-lead-media">
          <span class="badge-cat hero-lead-badge">${lead.category}</span>
          ${renderEditorialArt(lead.artType, lead.category)}
        </div>
        <div class="hero-lead-body">
          <h1 class="hero-lead-title">${lead.title}</h1>
          <p class="hero-lead-excerpt">${lead.subtitle}</p>
          <div class="meta-row">
            <span class="meta-author">${lead.author}</span>
            <span class="meta-dot"></span>
            <span>${lead.date}</span>
            <span class="meta-dot"></span>
            <span>${lead.readTime}</span>
          </div>
        </div>
      </article>
    `;

    const sideHtml = `
      <div class="hero-side-stack">
        ${sideItems.map(function (item) {
          return `
            <article class="side-headline-card" data-open-id="${item.id}">
              <div class="side-headline-thumb">${renderEditorialArt(item.artType, item.category)}</div>
              <div class="side-headline-content">
                <div><span class="badge-cat-soft">${item.category}</span></div>
                <h2 class="side-headline-title">${item.title}</h2>
                <div class="meta-row">
                  <span>${item.date}</span>
                  <span class="meta-dot"></span>
                  <span>${item.readTime}</span>
                </div>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;

    const trendingHtml = `
      <aside class="hero-trending-card" aria-label="Berita Trending">
        <div class="trending-header">
          <h3><span>&#9733;</span> Trending</h3>
          <span style="font-size:0.72rem;color:var(--muted);font-weight:700;">Real-time</span>
        </div>
        <div class="trending-list">
          ${trending.map(function (item, idx) {
            return `
              <button type="button" class="trending-item" data-open-id="${item.id}">
                <span class="trending-rank">0${idx + 1}</span>
                <div>
                  <div class="trending-item-title">${item.title}</div>
                  <div class="trending-item-meta">${item.category} &bull; ${formatViews(item.views)}</div>
                </div>
              </button>
            `;
          }).join("")}
        </div>
      </aside>
    `;

    dom.heroGrid.innerHTML = leadHtml + sideHtml + trendingHtml;
  }

  function getFilteredArticles() {
    const q = state.search.trim().toLowerCase();
    return ARTICLES.filter(function (art) {
      const matchCat = state.category === "Semua" || art.category === state.category;
      const matchSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.subtitle.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.author.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }

  function renderNewsGrid() {
    const filtered = getFilteredArticles();
    const isDefaultHome = state.category === "Semua" && !state.search.trim();
    const listToShow = isDefaultHome ? filtered.slice(4) : filtered;

    if (state.search.trim()) {
      dom.gridSectionTitle.textContent = `Hasil Pencarian: "${state.search.trim()}"`;
    } else if (state.category !== "Semua") {
      dom.gridSectionTitle.textContent = `Kanal ${state.category}`;
    } else {
      dom.gridSectionTitle.textContent = "Berita Terbaru";
    }

    dom.gridResultMeta.textContent = `${filtered.length} artikel`;
    dom.resetFilterBtn.style.display = isDefaultHome ? "none" : "inline-block";

    if (!listToShow.length) {
      dom.newsGrid.innerHTML = `
        <div class="empty-state">
          <h3>Tidak ada berita yang cocok</h3>
          <p>Coba gunakan kata kunci lain atau kembalikan ke semua kategori berita.</p>
          <button type="button" class="reset-filter-btn" id="emptyResetBtn">Reset Filter</button>
        </div>
      `;
      const emptyBtn = document.getElementById("emptyResetBtn");
      if (emptyBtn) {
        emptyBtn.addEventListener("click", resetFilters);
      }
      return;
    }

    dom.newsGrid.innerHTML = listToShow
      .map(function (art) {
        return `
          <article class="news-card" data-open-id="${art.id}">
            <div class="news-card-media">
              <span class="badge-cat news-card-badge">${art.category}</span>
              ${renderEditorialArt(art.artType, art.category)}
            </div>
            <div class="news-card-body">
              <h3 class="news-card-title">${art.title}</h3>
              <p class="news-card-excerpt">${art.subtitle}</p>
              <div class="meta-row">
                <span class="meta-author">${art.author}</span>
                <span class="meta-dot"></span>
                <span>${art.date}</span>
                <span class="meta-dot"></span>
                <span>${art.readTime}</span>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderSidebarWidgets() {
    const popular = ARTICLES.slice().sort(function (a, b) { return b.views - a.views; }).slice(0, 4);
    dom.popularPostsList.innerHTML = popular
      .map(function (art) {
        return `
          <button type="button" class="popular-item" data-open-id="${art.id}">
            <div class="popular-thumb">${renderEditorialArt(art.artType, art.category)}</div>
            <div>
              <div class="popular-title">${art.title}</div>
              <div class="popular-meta">${art.category} &bull; ${art.readTime}</div>
            </div>
          </button>
        `;
      })
      .join("");

    const counts = {};
    ARTICLES.forEach(function (a) {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });

    dom.labelCloudList.innerHTML = CATEGORIES.filter(function (c) { return c !== "Semua"; })
      .map(function (cat) {
        const active = state.category === cat ? " is-active" : "";
        return `<button type="button" class="label-pill${active}" data-cat="${cat}"><span>${cat}</span><span class="label-count">(${counts[cat] || 0})</span></button>`;
      })
      .join("");
  }

  function renderFooter() {
    dom.footerCatLinks.innerHTML = CATEGORIES.filter(function (c) { return c !== "Semua"; })
      .map(function (cat) {
        return `<li><button type="button" data-cat="${cat}">${cat}</button></li>`;
      })
      .join("");

    dom.footerTrendingLinks.innerHTML = ARTICLES.slice(0, 4)
      .map(function (art) {
        return `<li><button type="button" data-open-id="${art.id}">${art.title}</button></li>`;
      })
      .join("");
  }

  function openArticle(id) {
    const art = ARTICLES.find(function (a) { return a.id === id; });
    if (!art) return;

    state.activeArticleId = id;
    dom.homeView.classList.add("is-hidden");
    dom.articleView.classList.add("is-active");
    dom.readingProgressWrap.classList.add("is-visible");

    dom.breadcrumbCategoryBtn.textContent = art.category;
    dom.breadcrumbCategoryBtn.setAttribute("data-cat", art.category);
    dom.breadcrumbTitle.textContent = art.title.length > 48 ? art.title.slice(0, 48) + "..." : art.title;

    dom.articleCategoryBadge.textContent = art.category;
    dom.articleTitle.textContent = art.title;
    dom.articleSubtitle.textContent = art.subtitle;
    dom.articleAuthorAvatar.textContent = art.authorInitials;
    dom.articleAuthorName.textContent = art.author;
    dom.articleAuthorRole.textContent = art.authorRole;
    dom.articleMetaDate.textContent = art.date;
    dom.articleReadTime.textContent = art.readTime;
    dom.articleViews.textContent = formatViews(art.views);

    dom.articleHeroMedia.innerHTML = renderEditorialArt(art.artType, art.category);
    dom.articleHeroCaption.textContent = art.caption;
    dom.articleBody.innerHTML = art.body;

    // Auto-generate Table of Contents from H2/H3
    const headings = dom.articleBody.querySelectorAll("h2, h3");
    if (headings.length) {
      dom.tocBox.style.display = "block";
      dom.articleToc.innerHTML = Array.from(headings)
        .map(function (heading, index) {
          const slug = "sec-" + index + "-" + heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          heading.id = slug;
          const cls = heading.tagName === "H3" ? ' class="toc-h3"' : "";
          return `<li${cls}><a href="#${slug}">${heading.textContent}</a></li>`;
        })
        .join("");
    } else {
      dom.tocBox.style.display = "none";
      dom.articleToc.innerHTML = "";
    }

    dom.bioAvatar.textContent = art.authorInitials;
    dom.bioName.textContent = art.author;
    dom.bioRole.textContent = art.authorRole;
    dom.bioText.textContent = art.authorBio;

    const related = ARTICLES.filter(function (item) {
      return item.id !== art.id && item.category === art.category;
    })
      .concat(ARTICLES.filter(function (item) { return item.id !== art.id && item.category !== art.category; }))
      .slice(0, 3);

    dom.relatedPostsGrid.innerHTML = related
      .map(function (rel) {
        return `
          <article class="news-card" data-open-id="${rel.id}">
            <div class="news-card-media">
              <span class="badge-cat news-card-badge">${rel.category}</span>
              ${renderEditorialArt(rel.artType, rel.category)}
            </div>
            <div class="news-card-body">
              <h3 class="news-card-title" style="font-size:1rem;">${rel.title}</h3>
              <div class="meta-row">
                <span>${rel.date}</span>
                <span class="meta-dot"></span>
                <span>${rel.readTime}</span>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    window.scrollTo({ top: 0, behavior: "smooth" });
    updateReadingProgress();
  }

  function closeArticle() {
    state.activeArticleId = null;
    dom.articleView.classList.remove("is-active");
    dom.homeView.classList.remove("is-hidden");
    dom.readingProgressWrap.classList.remove("is-visible");
    dom.readingProgressBar.style.width = "0%";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectCategory(cat) {
    state.category = cat;
    if (state.activeArticleId) {
      closeArticle();
    }
    renderAllHome();
  }

  function resetFilters() {
    state.category = "Semua";
    state.search = "";
    dom.searchInput.value = "";
    dom.searchClearBtn.classList.remove("is-visible");
    renderAllHome();
  }

  function renderAllHome() {
    renderNav();
    renderHero();
    renderNewsGrid();
    renderSidebarWidgets();
  }

  function updateReadingProgress() {
    if (!state.activeArticleId) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      dom.readingProgressBar.style.width = "0%";
      return;
    }
    const pct = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
    dom.readingProgressBar.style.width = pct.toFixed(1) + "%";
  }

  function toggleTheme() {
    state.theme = state.theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", state.theme);
    dom.themeIcon.innerHTML = state.theme === "dark" ? "&#9728;" : "&#9790;";
    dom.themeLabel.textContent = state.theme === "dark" ? "Mode Terang" : "Mode Gelap";
    dom.themeToggle.classList.toggle("is-active", state.theme === "dark");
    showToast(state.theme === "dark" ? "Mode Gelap aktif" : "Mode Terang aktif");
  }

  function toggleReadMode() {
    state.readMode = state.readMode === "normal" ? "comfort" : "normal";
    document.documentElement.setAttribute("data-read-mode", state.readMode);
    dom.readModeToggle.classList.toggle("is-active", state.readMode === "comfort");
    dom.readModeLabel.textContent = state.readMode === "comfort" ? "Font Nyaman" : "Baca Nyaman";
    showToast(state.readMode === "comfort" ? "Mode Baca Nyaman (font lebih besar)" : "Ukuran font standar");
  }

  function bindEvents() {
    document.addEventListener("click", function (e) {
      const openTarget = e.target.closest("[data-open-id]");
      if (openTarget) {
        openArticle(openTarget.getAttribute("data-open-id"));
        return;
      }
      const catTarget = e.target.closest("[data-cat]");
      if (catTarget) {
        selectCategory(catTarget.getAttribute("data-cat"));
      }
    });

    dom.brandHomeBtn.addEventListener("click", function () {
      resetFilters();
      if (state.activeArticleId) closeArticle();
    });

    dom.backHomeBtn.addEventListener("click", closeArticle);
    dom.breadcrumbHomeBtn.addEventListener("click", closeArticle);
    dom.sidebarBackBtn.addEventListener("click", closeArticle);
    dom.resetFilterBtn.addEventListener("click", resetFilters);

    dom.searchInput.addEventListener("input", function (e) {
      state.search = e.target.value;
      dom.searchClearBtn.classList.toggle("is-visible", state.search.length > 0);
      if (state.activeArticleId) closeArticle();
      renderHero();
      renderNewsGrid();
    });

    dom.searchClearBtn.addEventListener("click", function () {
      state.search = "";
      dom.searchInput.value = "";
      dom.searchClearBtn.classList.remove("is-visible");
      renderHero();
      renderNewsGrid();
      dom.searchInput.focus();
    });

    dom.themeToggle.addEventListener("click", toggleTheme);
    dom.readModeToggle.addEventListener("click", toggleReadMode);

    dom.newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = dom.newsletterEmail.value.trim();
      if (!email) return;
      dom.newsletterFeedback.textContent = `Berhasil terdaftar! Ringkasan redaksi akan dikirim ke ${email}.`;
      dom.newsletterEmail.value = "";
      showToast("Langganan buletin redaksi aktif");
    });

    dom.shareWaBtn.addEventListener("click", function () {
      const art = ARTICLES.find(function (a) { return a.id === state.activeArticleId; });
      if (!art) return;
      const text = encodeURIComponent(art.title + " - " + window.location.href);
      window.open("https://wa.me/?text=" + text, "_blank", "noopener");
    });

    dom.shareXBtn.addEventListener("click", function () {
      const art = ARTICLES.find(function (a) { return a.id === state.activeArticleId; });
      if (!art) return;
      const text = encodeURIComponent(art.title);
      const url = encodeURIComponent(window.location.href);
      window.open("https://twitter.com/intent/tweet?text=" + text + "&url=" + url, "_blank", "noopener");
    });

    dom.shareTgBtn.addEventListener("click", function () {
      const art = ARTICLES.find(function (a) { return a.id === state.activeArticleId; });
      if (!art) return;
      const text = encodeURIComponent(art.title);
      const url = encodeURIComponent(window.location.href);
      window.open("https://t.me/share/url?url=" + url + "&text=" + text, "_blank", "noopener");
    });

    dom.copyLinkBtn.addEventListener("click", function () {
      const url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          showToast("Tautan artikel berhasil disalin");
        }).catch(function () {
          showToast("Tautan siap dibagikan: " + url);
        });
      } else {
        showToast("Tautan artikel disalin ke papan klip");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== dom.searchInput) {
        e.preventDefault();
        dom.searchInput.focus();
      } else if (e.key === "Escape" && document.activeElement === dom.searchInput) {
        dom.searchInput.blur();
      }
    });

    window.addEventListener("scroll", updateReadingProgress, { passive: true });
  }

  function init() {
    setDateHeader();
    renderTicker();
    renderAllHome();
    renderFooter();
    bindEvents();
  }

  init();
})();
