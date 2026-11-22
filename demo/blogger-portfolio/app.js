(function () {
  'use strict';

  var PROJECTS = [
    {
      id: 'koinku-fintech',
      title: 'KoinKu — Superapp Keuangan & Investasi Mikro',
      subtitle: 'Merancang ulang pengalaman menabung otomatis dan reksa dana harian untuk 420.000+ pengguna milenial.',
      category: 'Mobile App',
      year: '2026',
      client: 'PT KoinKu Finansial',
      role: 'Lead Product Designer',
      duration: '12 Minggu',
      snippet: 'Redesign alur onboarding KYC dan dashboard portofolio mobile yang menaikkan aktivasi investor pemula sebesar 46%.',
      problem: 'Pengguna baru sering berhenti di langkah verifikasi KYC (drop-off 54%) dan kesulitan memahami grafik imbal hasil reksa dana di layar kecil.',
      solution: 'Menyederhanakan KYC menjadi 3 langkah progresif dengan validasi OCR real-time, serta memperkenalkan kartu "Target Tabungan" berbasis visual yang ramah pemula.',
      metrics: [
        { value: '+46%', label: 'Konversi Aktivasi KYC' },
        { value: '1.8 mnt', label: 'Rata-rata Selesai Daftar' },
        { value: '4.8 ★', label: 'Rating App Store Baru' }
      ],
      deliverables: [
        'Riset & Usability Testing (18 responden)',
        'Design System Mobile (110+ komponen Figma)',
        'Interactive Prototype 48 layar utama',
        'Spesifikasi Motion & Micro-interactions'
      ],
      stack: ['Figma', 'Design Tokens', 'Prototyping', 'Maze Testing', 'Lottie'],
      svg: [
        '<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">',
        '<defs><linearGradient id="bgKoin" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>',
        '<rect width="640" height="400" fill="url(#bgKoin)"/>',
        '<circle cx="520" cy="80" r="110" fill="#2563eb" fill-opacity="0.08"/>',
        '<rect x="76" y="42" width="214" height="332" rx="26" fill="#18181b"/>',
        '<rect x="86" y="54" width="194" height="308" rx="20" fill="#ffffff"/>',
        '<rect x="148" y="62" width="70" height="10" rx="5" fill="#e4e4e7"/>',
        '<text x="104" y="96" font-family="monospace" font-size="10" fill="#71717a">SALDO INVESTASI</text>',
        '<text x="104" y="120" font-family="sans-serif" font-size="20" font-weight="700" fill="#18181b">Rp 28.450.000</text>',
        '<rect x="104" y="132" width="92" height="20" rx="10" fill="#dcfce7"/>',
        '<text x="114" y="146" font-family="monospace" font-size="10" font-weight="600" fill="#15803d">+12.4% YTD</text>',
        '<rect x="104" y="168" width="158" height="74" rx="12" fill="#2563eb"/>',
        '<polyline points="118,224 146,210 172,216 202,192 246,184" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>',
        '<rect x="104" y="256" width="74" height="84" rx="10" fill="#f4f4f5"/>',
        '<rect x="188" y="256" width="74" height="84" rx="10" fill="#f4f4f5"/>',
        '<circle cx="124" cy="278" r="10" fill="#2563eb" fill-opacity="0.18"/>',
        '<circle cx="208" cy="278" r="10" fill="#16a34a" fill-opacity="0.18"/>',
        '<rect x="114" y="300" width="52" height="8" rx="4" fill="#18181b"/>',
        '<rect x="114" y="314" width="38" height="6" rx="3" fill="#a1a1aa"/>',
        '<rect x="198" y="300" width="52" height="8" rx="4" fill="#18181b"/>',
        '<rect x="198" y="314" width="42" height="6" rx="3" fill="#a1a1aa"/>',
        '<rect x="330" y="76" width="234" height="122" rx="14" fill="#ffffff" stroke="#cbd5e1"/>',
        '<text x="350" y="104" font-family="monospace" font-size="11" fill="#2563eb">AUTO-INVEST AKTIF</text>',
        '<text x="350" y="130" font-family="sans-serif" font-size="16" font-weight="700" fill="#18181b">Reksa Dana Pasar Uang</text>',
        '<rect x="350" y="148" width="194" height="10" rx="5" fill="#e4e4e7"/>',
        '<rect x="350" y="148" width="142" height="10" rx="5" fill="#2563eb"/>',
        '<text x="350" y="178" font-family="monospace" font-size="11" fill="#52525b">Target Dana Darurat · 74%</text>',
        '<rect x="330" y="218" width="234" height="118" rx="14" fill="#18181b"/>',
        '<text x="350" y="248" font-family="monospace" font-size="11" fill="#93c5fd">METRIK DAMPAK</text>',
        '<text x="350" y="284" font-family="sans-serif" font-size="28" font-weight="700" fill="#ffffff">+46% KYC</text>',
        '<text x="350" y="312" font-family="sans-serif" font-size="12" fill="#a1a1aa">Drop-off turun dari 54% ke 19%</text>',
        '</svg>'
      ].join('')
    },
    {
      id: 'nalar-analytics',
      title: 'Nalar Analytics — Platform BI & Telemetry SaaS',
      subtitle: 'Antarmuka query builder tanpa kode dan visualisasi metrik real-time untuk tim produk B2B.',
      category: 'UI/UX Design',
      year: '2025',
      client: 'Nalar Data Indonesia',
      role: 'Principal UI/UX & Design System',
      duration: '10 Minggu',
      snippet: 'Membangun sistem komponen tabel data berdensitas tinggi dan dashboard kustomisasi drag-and-drop untuk tim analis.',
      problem: 'Analis non-teknis bergantung pada tim engineering untuk membuat laporan SQL, menyebabkan antrean permintaan laporan hingga 5 hari kerja.',
      solution: 'Merancang Visual Query Builder berbasis blok filter modular dengan live preview chart dan template KPI siap pakai.',
      metrics: [
        { value: '-72%', label: 'Waktu Buat Laporan' },
        { value: '-38%', label: 'Tiket Support Produk' },
        { value: '94%', label: 'Adopsi Tim Non-Teknis' }
      ],
      deliverables: [
        'Information Architecture & Taxonomy Metrik',
        'Enterprise Design System (Light & Dark Mode)',
        'Data Visualization Guidelines (14 tipe grafik)',
        'Figma Component Kit siap React'
      ],
      stack: ['Figma Variables', 'Design System', 'Data Viz', 'WCAG AA', 'Storybook'],
      svg: [
        '<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">',
        '<rect width="640" height="400" fill="#09090b"/>',
        '<rect x="36" y="34" width="568" height="332" rx="14" fill="#111113" stroke="#27272a"/>',
        '<rect x="36" y="34" width="128" height="332" rx="14" fill="#18181b"/>',
        '<circle cx="62" cy="60" r="7" fill="#3b82f6"/>',
        '<rect x="78" y="55" width="60" height="10" rx="4" fill="#fafafa"/>',
        '<rect x="54" y="92" width="90" height="26" rx="6" fill="#2563eb"/>',
        '<rect x="54" y="130" width="84" height="10" rx="4" fill="#3f3f46"/>',
        '<rect x="54" y="154" width="70" height="10" rx="4" fill="#3f3f46"/>',
        '<rect x="54" y="178" width="88" height="10" rx="4" fill="#3f3f46"/>',
        '<rect x="184" y="54" width="124" height="68" rx="10" fill="#18181b" stroke="#27272a"/>',
        '<text x="198" y="76" font-family="monospace" font-size="9" fill="#a1a1aa">ACTIVE USERS</text>',
        '<text x="198" y="104" font-family="sans-serif" font-size="20" font-weight="700" fill="#fafafa">184.2K</text>',
        '<rect x="322" y="54" width="124" height="68" rx="10" fill="#18181b" stroke="#27272a"/>',
        '<text x="336" y="76" font-family="monospace" font-size="9" fill="#a1a1aa">RETENSI D30</text>',
        '<text x="336" y="104" font-family="sans-serif" font-size="20" font-weight="700" fill="#60a5fa">68.4%</text>',
        '<rect x="460" y="54" width="124" height="68" rx="10" fill="#18181b" stroke="#27272a"/>',
        '<text x="474" y="76" font-family="monospace" font-size="9" fill="#a1a1aa">P95 LATENCY</text>',
        '<text x="474" y="104" font-family="sans-serif" font-size="20" font-weight="700" fill="#4ade80">42 ms</text>',
        '<rect x="184" y="138" width="400" height="206" rx="10" fill="#18181b" stroke="#27272a"/>',
        '<text x="204" y="164" font-family="monospace" font-size="10" fill="#a1a1aa">TELEMETRY FUNNEL · REALTIME</text>',
        '<rect x="208" y="268" width="28" height="54" rx="4" fill="#2563eb" fill-opacity="0.45"/>',
        '<rect x="252" y="242" width="28" height="80" rx="4" fill="#2563eb" fill-opacity="0.6"/>',
        '<rect x="296" y="216" width="28" height="106" rx="4" fill="#2563eb" fill-opacity="0.75"/>',
        '<rect x="340" y="198" width="28" height="124" rx="4" fill="#3b82f6"/>',
        '<rect x="384" y="226" width="28" height="96" rx="4" fill="#3b82f6" fill-opacity="0.8"/>',
        '<rect x="428" y="186" width="28" height="136" rx="4" fill="#60a5fa"/>',
        '<rect x="472" y="176" width="28" height="146" rx="4" fill="#93c5fd"/>',
        '<rect x="516" y="192" width="28" height="130" rx="4" fill="#3b82f6"/>',
        '</svg>'
      ].join('')
    },
    {
      id: 'ruangarsip-legal',
      title: 'RuangArsip — Workspace Manajemen Dokumen Hukum',
      subtitle: 'Aplikasi web kolaboratif dengan editor kontrak versi paralel, audit trail, dan pencarian instan.',
      category: 'Web Development',
      year: '2025',
      client: 'RuangArsip Legal Tech',
      role: 'Frontend Architect & UI Engineer',
      duration: '14 Minggu',
      snippet: 'Implementasi frontend TypeScript berkecepatan tinggi dengan virtualized document tree dan keyboard shortcut ala Linear.',
      problem: 'Tim legal korporat mengelola ribuan PDF kontrak di folder konvensional yang lambat dibuka dan rawan konflik revisi.',
      solution: 'Membangun aplikasi web SPA dengan sidebar virtualized tree, diff viewer klausul kontrak berdampingan, dan pencarian full-text di bawah 80ms.',
      metrics: [
        { value: '99/100', label: 'Skor Lighthouse' },
        { value: '<80 ms', label: 'Latensi Pencarian' },
        { value: '3.2x', label: 'Kecepatan Review Kontrak' }
      ],
      deliverables: [
        'Arsitektur Frontend React + TypeScript',
        'Komponen Split-Pane Diff Viewer Kontrak',
        'Keyboard Command Palette (Ctrl+K)',
        'Unit & E2E Testing Cakupan Alur Kritis'
      ],
      stack: ['TypeScript', 'React', 'Tailwind CSS', 'Web Workers', 'Playwright'],
      svg: [
        '<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">',
        '<rect width="640" height="400" fill="#f4f4f5"/>',
        '<rect x="44" y="38" width="552" height="324" rx="12" fill="#ffffff" stroke="#d4d4d8"/>',
        '<rect x="44" y="38" width="552" height="42" rx="12" fill="#fafaf9"/>',
        '<line x1="44" y1="80" x2="596" y2="80" stroke="#e4e4e7"/>',
        '<circle cx="68" cy="59" r="5" fill="#ef4444"/><circle cx="84" cy="59" r="5" fill="#f59e0b"/><circle cx="100" cy="59" r="5" fill="#22c55e"/>',
        '<rect x="200" y="48" width="240" height="22" rx="6" fill="#f4f4f5" stroke="#e4e4e7"/>',
        '<text x="218" y="63" font-family="monospace" font-size="10" fill="#71717a">⌘K  Cari klausul NDA-2025...</text>',
        '<rect x="64" y="98" width="244" height="244" rx="8" fill="#fafaf9" stroke="#e4e4e7"/>',
        '<rect x="328" y="98" width="248" height="244" rx="8" fill="#ffffff" stroke="#2563eb"/>',
        '<text x="82" y="124" font-family="monospace" font-size="10" fill="#71717a">VERSI 1.2 (LAMA)</text>',
        '<rect x="82" y="140" width="200" height="10" rx="4" fill="#d4d4d8"/>',
        '<rect x="82" y="160" width="180" height="10" rx="4" fill="#d4d4d8"/>',
        '<rect x="82" y="182" width="206" height="32" rx="6" fill="#fee2e2"/>',
        '<rect x="92" y="194" width="160" height="8" rx="4" fill="#dc2626" fill-opacity="0.55"/>',
        '<rect x="82" y="228" width="190" height="10" rx="4" fill="#d4d4d8"/>',
        '<text x="346" y="124" font-family="monospace" font-size="10" fill="#2563eb">VERSI 2.0 (DISETUJUI)</text>',
        '<rect x="346" y="140" width="208" height="10" rx="4" fill="#18181b" fill-opacity="0.75"/>',
        '<rect x="346" y="160" width="186" height="10" rx="4" fill="#18181b" fill-opacity="0.5"/>',
        '<rect x="346" y="182" width="210" height="32" rx="6" fill="#dcfce7"/>',
        '<rect x="356" y="194" width="174" height="8" rx="4" fill="#16a34a" fill-opacity="0.65"/>',
        '<rect x="346" y="294" width="96" height="30" rx="6" fill="#2563eb"/>',
        '<text x="366" y="313" font-family="sans-serif" font-size="11" font-weight="600" fill="#ffffff">Approve</text>',
        '</svg>'
      ].join('')
    },
    {
      id: 'svara-audio',
      title: 'Svara Audio — Identitas Visual & Web Storefront Hi-Fi',
      subtitle: 'Rebranding menyeluruh dan etalase web editorial untuk produsen earphone & DAC audiophile lokal.',
      category: 'Branding',
      year: '2025',
      client: 'Svara Acoustic Studio',
      role: 'Brand & Web Designer',
      duration: '6 Minggu',
      snippet: 'Menciptakan sistem identitas geometris terinspirasi gelombang akustik serta storefront dengan pembanding spesifikasi interaktif.',
      problem: 'Brand memiliki kualitas produk kelas studio namun tampilan visual lama terkesan generik sehingga sulit bersaing di segmen flagship.',
      solution: 'Membangun identitas Swiss minimalist dengan tipografi teknis, grid kemasan modular, dan halaman produk interaktif dengan grafik respons frekuensi.',
      metrics: [
        { value: '+41%', label: 'Konversi Checkout Mobile' },
        { value: '2.4x', label: 'Average Order Value' },
        { value: '0.9 dtk', label: 'First Contentful Paint' }
      ],
      deliverables: [
        'Brand Guidelines, Logo Mark & Sistem Kemasan',
        'Art Direction Fotografi Produk',
        'Desain & Kode Storefront Responsif',
        'Grafik Respons Frekuensi Interaktif'
      ],
      stack: ['Brand Strategy', 'Figma', 'SVG Motion', 'HTML/CSS Grid', 'Vanilla JS'],
      svg: [
        '<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">',
        '<rect width="640" height="400" fill="#fafaf9"/>',
        '<rect x="36" y="36" width="276" height="328" rx="14" fill="#18181b"/>',
        '<text x="64" y="78" font-family="monospace" font-size="11" fill="#93c5fd">SVARA / BRAND GRID</text>',
        '<circle cx="174" cy="186" r="68" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.25"/>',
        '<circle cx="174" cy="186" r="46" fill="none" stroke="#3b82f6" stroke-width="4"/>',
        '<path d="M132 186 Q152 146 174 186 T216 186" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>',
        '<text x="64" y="302" font-family="sans-serif" font-size="24" font-weight="700" fill="#ffffff">SVARA IEM-01</text>',
        '<text x="64" y="326" font-family="monospace" font-size="11" fill="#a1a1aa">REFERENCE STUDIO MONITOR</text>',
        '<rect x="332" y="36" width="272" height="154" rx="14" fill="#ffffff" stroke="#e4e4e7"/>',
        '<text x="354" y="66" font-family="monospace" font-size="10" fill="#71717a">FREQUENCY RESPONSE CURVE</text>',
        '<path d="M354 146 C392 146, 412 102, 456 118 C496 132, 524 94, 578 124" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round"/>',
        '<line x1="354" y1="156" x2="580" y2="156" stroke="#e4e4e7"/>',
        '<rect x="332" y="210" width="128" height="154" rx="14" fill="#2563eb"/>',
        '<text x="352" y="246" font-family="monospace" font-size="10" fill="#dbeafe">PRIMARY</text>',
        '<text x="352" y="340" font-family="monospace" font-size="12" fill="#ffffff">#2563EB</text>',
        '<rect x="476" y="210" width="128" height="154" rx="14" fill="#ffffff" stroke="#e4e4e7"/>',
        '<text x="496" y="246" font-family="monospace" font-size="10" fill="#71717a">TYPEFACE</text>',
        '<text x="496" y="304" font-family="sans-serif" font-size="34" font-weight="700" fill="#18181b">Aa</text>',
        '<text x="496" y="340" font-family="monospace" font-size="10" fill="#52525b">Space Grotesk</text>',
        '</svg>'
      ].join('')
    },
    {
      id: 'kirimkilat-logistics',
      title: 'KirimKilat — Dashboard Logistik & Pelacakan Armada',
      subtitle: 'Pusat kendali operasional pengiriman last-mile dengan deteksi keterlambatan otomatis.',
      category: 'UI/UX Design',
      year: '2024',
      client: 'KirimKilat Express',
      role: 'Senior Product Designer',
      duration: '8 Minggu',
      snippet: 'Mengurangi beban kognitif operator dispatch dari 6 tab terpisah menjadi 1 tampilan peta & antrean prioritas terpadu.',
      problem: 'Operator hub pengiriman harus berpindah-pindah antar spreadsheet dan sistem GPS terpisah saat menangani paket terlambat.',
      solution: 'Merancang Command Center satu layar dengan peta status kurir real-time, filter SLA kritis, dan aksi reassign paket dalam 2 klik.',
      metrics: [
        { value: '-35%', label: 'Waktu Penanganan SLA' },
        { value: '2 Klik', label: 'Aksi Reassign Kurir' },
        { value: '99.1%', label: 'Akurasi Pengiriman Harian' }
      ],
      deliverables: [
        'Field Observation di 3 Hub Jakarta',
        'Service Blueprint & Dispatch Flow',
        'High-Fidelity Web App Design',
        'Design QA hingga Rilis Produksi'
      ],
      stack: ['Figma', 'Service Design', 'Mapbox UI', 'Design QA'],
      svg: [
        '<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">',
        '<rect width="640" height="400" fill="#eff6ff"/>',
        '<rect x="40" y="36" width="560" height="328" rx="14" fill="#ffffff" stroke="#cbd5e1"/>',
        '<rect x="58" y="56" width="328" height="288" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>',
        '<path d="M90 280 Q180 120 260 210 T360 110" fill="none" stroke="#2563eb" stroke-width="3" stroke-dasharray="6 5"/>',
        '<circle cx="90" cy="280" r="8" fill="#18181b"/><circle cx="222" cy="182" r="9" fill="#2563eb"/><circle cx="360" cy="110" r="8" fill="#16a34a"/>',
        '<rect x="76" y="74" width="136" height="28" rx="6" fill="#ffffff" stroke="#cbd5e1"/>',
        '<text x="90" y="92" font-family="monospace" font-size="10" fill="#18181b">LIVE FLEET · 48 AKTIF</text>',
        '<rect x="404" y="56" width="178" height="86" rx="10" fill="#fef2f2" stroke="#fecaca"/>',
        '<text x="418" y="80" font-family="monospace" font-size="10" fill="#dc2626">PRIORITAS SLA</text>',
        '<text x="418" y="106" font-family="sans-serif" font-size="22" font-weight="700" fill="#991b1b">4 Paket</text>',
        '<text x="418" y="126" font-family="sans-serif" font-size="11" fill="#b91c1c">Butuh reassign segera</text>',
        '<rect x="404" y="156" width="178" height="88" rx="10" fill="#ffffff" stroke="#e4e4e7"/>',
        '<text x="418" y="182" font-family="sans-serif" font-size="13" font-weight="700" fill="#18181b">Kurir #JKT-14</text>',
        '<text x="418" y="202" font-family="monospace" font-size="10" fill="#52525b">ETA: 14 menit · 9/10</text>',
        '<rect x="418" y="216" width="148" height="8" rx="4" fill="#e4e4e7"/>',
        '<rect x="418" y="216" width="132" height="8" rx="4" fill="#16a34a"/>',
        '<rect x="404" y="258" width="178" height="86" rx="10" fill="#18181b"/>',
        '<text x="418" y="286" font-family="monospace" font-size="10" fill="#93c5fd">PERFORMA HUB</text>',
        '<text x="418" y="318" font-family="sans-serif" font-size="24" font-weight="700" fill="#ffffff">99.1% On-Time</text>',
        '</svg>'
      ].join('')
    },
    {
      id: 'binatani-agrotech',
      title: 'BinaTani — Portal Agrotech & Rantai Pasok Petani',
      subtitle: 'Web aplikasi ringan offline-first untuk pencatatan panen dan transaksi koperasi tani daerah.',
      category: 'Web Development',
      year: '2024',
      client: 'Koperasi BinaTani Nusantara',
      role: 'Fullstack Frontend Engineer',
      duration: '10 Minggu',
      snippet: 'Membangun aplikasi web progresif (PWA) berukuran ringan yang tetap lancar di jaringan 3G pedesaan.',
      problem: 'Petugas lapangan kesulitan mencatat hasil panen karena koneksi internet tidak stabil dan aplikasi lama berat dibuka di ponsel entry-level.',
      solution: 'Mengembangkan web app minimalis dengan ukuran bundle di bawah 45KB, cache lokal otomatis, dan sinkronisasi latar belakang saat sinyal kembali.',
      metrics: [
        { value: '<45 KB', label: 'Ukuran Bundle Awal' },
        { value: '100%', label: 'Dukungan Offline' },
        { value: '12.400+', label: 'Transaksi Panen / Bln' }
      ],
      deliverables: [
        'Arsitektur PWA Offline-First & IndexedDB',
        'Antarmuka Formulir Cepat Kontras Tinggi',
        'Sistem Cetak Struk Panen Termal',
        'Pelatihan Admin Koperasi Daerah'
      ],
      stack: ['HTML5', 'CSS Grid', 'JavaScript ES6', 'IndexedDB', 'Service Worker'],
      svg: [
        '<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">',
        '<rect width="640" height="400" fill="#f0fdf4"/>',
        '<rect x="48" y="42" width="544" height="316" rx="14" fill="#ffffff" stroke="#bbf7d0"/>',
        '<rect x="68" y="64" width="236" height="272" rx="10" fill="#fafaf9" stroke="#e4e4e7"/>',
        '<text x="86" y="92" font-family="monospace" font-size="10" fill="#15803d">OFFLINE SYNC READY ●</text>',
        '<text x="86" y="122" font-family="sans-serif" font-size="17" font-weight="700" fill="#18181b">Catat Panen Baru</text>',
        '<rect x="86" y="142" width="200" height="34" rx="6" fill="#ffffff" stroke="#d4d4d8"/>',
        '<text x="98" y="163" font-family="sans-serif" font-size="12" fill="#52525b">Komoditas: Gabah Kering</text>',
        '<rect x="86" y="188" width="200" height="34" rx="6" fill="#ffffff" stroke="#d4d4d8"/>',
        '<text x="98" y="209" font-family="sans-serif" font-size="12" fill="#52525b">Berat Bersih: 1.450 kg</text>',
        '<rect x="86" y="236" width="200" height="38" rx="8" fill="#16a34a"/>',
        '<text x="128" y="260" font-family="sans-serif" font-size="13" font-weight="700" fill="#ffffff">Simpan &amp; Sinkron</text>',
        '<text x="86" y="308" font-family="monospace" font-size="10" fill="#71717a">Bundle Size: 41.8 KB gzip</text>',
        '<rect x="326" y="64" width="246" height="126" rx="10" fill="#18181b"/>',
        '<text x="346" y="94" font-family="monospace" font-size="10" fill="#86efac">TOTAL SERAPAN BULAN INI</text>',
        '<text x="346" y="132" font-family="sans-serif" font-size="28" font-weight="700" fill="#ffffff">428.6 Ton</text>',
        '<text x="346" y="160" font-family="monospace" font-size="11" fill="#a1a1aa">142 Kelompok Tani Terhubung</text>',
        '<rect x="326" y="208" width="246" height="128" rx="10" fill="#ffffff" stroke="#e4e4e7"/>',
        '<text x="346" y="236" font-family="monospace" font-size="10" fill="#52525b">RIWAYAT TERBARU</text>',
        '<rect x="346" y="252" width="206" height="24" rx="4" fill="#f4f4f5"/>',
        '<text x="356" y="268" font-family="monospace" font-size="10" fill="#18181b">#BN-904 · 1.45T · Tersinkron</text>',
        '<rect x="346" y="286" width="206" height="24" rx="4" fill="#f4f4f5"/>',
        '<text x="356" y="302" font-family="monospace" font-size="10" fill="#18181b">#BN-903 · 0.92T · Tersinkron</text>',
        '</svg>'
      ].join('')
    }
  ];

  var WA_NUMBER = '6281234567890';
  var activeFilter = 'all';
  var activeProjectIndex = 0;
  var toastTimer = null;

  var root = document.documentElement;
  var themeToggleBtn = document.getElementById('themeToggleBtn');
  var themeIcon = document.getElementById('themeIcon');
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var navMenuWrap = document.getElementById('navMenuWrap');

  var portfolioGrid = document.getElementById('portfolioGrid');
  var portfolioFilterBar = document.getElementById('portfolioFilterBar');
  var portfolioCount = document.getElementById('portfolioCount');

  var caseStudyModal = document.getElementById('caseStudyModal');
  var closeCaseModalBtn = document.getElementById('closeCaseModalBtn');
  var prevCaseBtn = document.getElementById('prevCaseBtn');
  var nextCaseBtn = document.getElementById('nextCaseBtn');
  var caseModalCategory = document.getElementById('caseModalCategory');
  var caseModalTitle = document.getElementById('caseModalTitle');
  var caseModalSubtitle = document.getElementById('caseModalSubtitle');
  var caseMetaGrid = document.getElementById('caseMetaGrid');
  var caseModalVisual = document.getElementById('caseModalVisual');
  var caseMetricsGrid = document.getElementById('caseMetricsGrid');
  var caseModalProblem = document.getElementById('caseModalProblem');
  var caseModalSolution = document.getElementById('caseModalSolution');
  var caseModalDeliverables = document.getElementById('caseModalDeliverables');
  var caseModalStack = document.getElementById('caseModalStack');
  var discussSimilarBtn = document.getElementById('discussSimilarBtn');

  var contactModal = document.getElementById('contactModal');
  var closeContactModalBtn = document.getElementById('closeContactModalBtn');
  var openContactNavBtn = document.getElementById('openContactNavBtn');
  var openContactHeroBtn = document.getElementById('openContactHeroBtn');
  var openContactFooterBtn = document.getElementById('openContactFooterBtn');
  var briefForm = document.getElementById('briefForm');
  var briefName = document.getElementById('briefName');
  var briefEmail = document.getElementById('briefEmail');
  var briefPackage = document.getElementById('briefPackage');
  var briefMessage = document.getElementById('briefMessage');
  var copyBriefBtn = document.getElementById('copyBriefBtn');

  var copyEmailHeroBtn = document.getElementById('copyEmailHeroBtn');
  var copyEmailFooterBtn = document.getElementById('copyEmailFooterBtn');
  var printCvNavBtn = document.getElementById('printCvNavBtn');
  var printCvHeroBtn = document.getElementById('printCvHeroBtn');
  var printCvExpBtn = document.getElementById('printCvExpBtn');
  var toastBanner = document.getElementById('toastBanner');

  function showToast(msg) {
    if (!toastBanner) return;
    toastBanner.textContent = msg;
    toastBanner.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastBanner.hidden = true;
    }, 2600);
  }

  function syncThemeIcon() {
    if (!themeIcon) return;
    themeIcon.innerHTML = root.getAttribute('data-theme') === 'dark'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
  }

  if (themeToggleBtn) {
    syncThemeIcon();
    themeToggleBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('ddev_folio_demo_theme', next);
      } catch (e) {}
      syncThemeIcon();
      showToast(next === 'dark' ? 'Mode Gelap aktif' : 'Mode Terang aktif');
    });
  }

  if (mobileMenuBtn && navMenuWrap) {
    mobileMenuBtn.addEventListener('click', function () {
      var open = navMenuWrap.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navMenuWrap.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navMenuWrap.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function renderProjects(filterCategory) {
    if (!portfolioGrid) return;
    var filtered = PROJECTS.filter(function (p) {
      return filterCategory === 'all' || p.category === filterCategory;
    });

    if (portfolioCount) {
      portfolioCount.textContent = 'Menampilkan ' + filtered.length + ' dari ' + PROJECTS.length + ' proyek';
    }

    portfolioGrid.innerHTML = filtered.map(function (project, idx) {
      return [
        '<article class="project-card" tabindex="0" role="button" data-project-id="' + project.id + '" style="animation-delay:' + (idx * 45) + 'ms">',
        '  <div class="project-thumb">' + project.svg + '</div>',
        '  <div class="project-body">',
        '    <div class="project-meta">',
        '      <span class="tag-pill">' + project.category + '</span>',
        '      <span>' + project.year + '</span>',
        '    </div>',
        '    <h3 class="project-title">' + project.title + '</h3>',
        '    <p class="project-snippet">' + project.snippet + '</p>',
        '    <div class="project-footer">',
        '      <span class="project-role-tag">' + project.role + '</span>',
        '      <span class="project-cta-text">Studi Kasus →</span>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function openCaseStudy(index) {
    var project = PROJECTS[index];
    if (!project || !caseStudyModal) return;
    activeProjectIndex = index;

    caseModalCategory.textContent = project.category + ' · ' + project.year;
    caseModalTitle.textContent = project.title;
    caseModalSubtitle.textContent = project.subtitle;
    caseModalVisual.innerHTML = project.svg;
    caseModalProblem.textContent = project.problem;
    caseModalSolution.textContent = project.solution;

    caseMetaGrid.innerHTML = [
      { label: 'Klien', value: project.client },
      { label: 'Peran', value: project.role },
      { label: 'Tahun', value: project.year },
      { label: 'Durasi', value: project.duration }
    ].map(function (item) {
      return '<div><div class="case-meta-label">' + item.label + '</div><div class="case-meta-value">' + item.value + '</div></div>';
    }).join('');

    caseMetricsGrid.innerHTML = project.metrics.map(function (m) {
      return '<div class="case-metric-card"><div class="case-metric-val">' + m.value + '</div><div class="case-metric-lbl">' + m.label + '</div></div>';
    }).join('');

    caseModalDeliverables.innerHTML = project.deliverables.map(function (d) {
      return '<li>' + d + '</li>';
    }).join('');

    caseModalStack.innerHTML = project.stack.map(function (s) {
      return '<span class="stack-chip">' + s + '</span>';
    }).join('');

    caseStudyModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudy() {
    if (!caseStudyModal) return;
    caseStudyModal.hidden = true;
    document.body.style.overflow = '';
  }

  function openContactModal(presetPackage, presetNote) {
    if (!contactModal) return;
    if (presetPackage && briefPackage) {
      var found = Array.prototype.some.call(briefPackage.options, function (opt) {
        return opt.value === presetPackage;
      });
      if (found) briefPackage.value = presetPackage;
    }
    if (presetNote && briefMessage) {
      briefMessage.value = presetNote;
    }
    contactModal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (briefName) briefName.focus();
  }

  function closeContactModal() {
    if (!contactModal) return;
    contactModal.hidden = true;
    document.body.style.overflow = '';
  }

  if (portfolioFilterBar) {
    portfolioFilterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      activeFilter = btn.getAttribute('data-filter') || 'all';
      Array.prototype.forEach.call(portfolioFilterBar.querySelectorAll('.filter-btn'), function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderProjects(activeFilter);
    });
  }

  if (portfolioGrid) {
    portfolioGrid.addEventListener('click', function (e) {
      var card = e.target.closest('.project-card');
      if (!card) return;
      var id = card.getAttribute('data-project-id');
      var idx = PROJECTS.findIndex(function (p) { return p.id === id; });
      if (idx !== -1) openCaseStudy(idx);
    });

    portfolioGrid.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var card = e.target.closest('.project-card');
        if (!card) return;
        e.preventDefault();
        var id = card.getAttribute('data-project-id');
        var idx = PROJECTS.findIndex(function (p) { return p.id === id; });
        if (idx !== -1) openCaseStudy(idx);
      }
    });
  }

  if (closeCaseModalBtn) closeCaseModalBtn.addEventListener('click', closeCaseStudy);
  if (prevCaseBtn) {
    prevCaseBtn.addEventListener('click', function () {
      var prev = (activeProjectIndex - 1 + PROJECTS.length) % PROJECTS.length;
      openCaseStudy(prev);
    });
  }
  if (nextCaseBtn) {
    nextCaseBtn.addEventListener('click', function () {
      var next = (activeProjectIndex + 1) % PROJECTS.length;
      openCaseStudy(next);
    });
  }
  if (discussSimilarBtn) {
    discussSimilarBtn.addEventListener('click', function () {
      var current = PROJECTS[activeProjectIndex];
      closeCaseStudy();
      openContactModal(
        'Web App & Design System (Mulai Rp 12.000.000)',
        'Halo Raka, saya tertarik mendiskusikan proyek serupa dengan studi kasus "' + current.title + '".'
      );
    });
  }

  if (caseStudyModal) {
    caseStudyModal.addEventListener('click', function (e) {
      if (e.target === caseStudyModal) closeCaseStudy();
    });
  }

  [openContactNavBtn, openContactHeroBtn, openContactFooterBtn].forEach(function (btn) {
    if (btn) {
      btn.addEventListener('click', function () {
        openContactModal();
      });
    }
  });

  Array.prototype.forEach.call(document.querySelectorAll('.select-package-btn'), function (btn) {
    btn.addEventListener('click', function () {
      var pkg = btn.getAttribute('data-package');
      openContactModal(pkg, 'Halo Raka, saya ingin konsultasi mengenai paket ' + pkg + '.');
    });
  });

  if (closeContactModalBtn) closeContactModalBtn.addEventListener('click', closeContactModal);
  if (contactModal) {
    contactModal.addEventListener('click', function (e) {
      if (e.target === contactModal) closeContactModal();
    });
  }

  function buildBriefText() {
    var name = briefName ? briefName.value.trim() : '';
    var email = briefEmail ? briefEmail.value.trim() : '';
    var pkg = briefPackage ? briefPackage.value : '';
    var msg = briefMessage ? briefMessage.value.trim() : '';
    return [
      'Halo Raka Pratama, saya ingin mengirim brief proyek:',
      '- Nama: ' + (name || '-'),
      '- Email: ' + (email || '-'),
      '- Paket: ' + (pkg || '-'),
      '- Ringkasan: ' + (msg || '-')
    ].join('\n');
  }

  if (copyBriefBtn) {
    copyBriefBtn.addEventListener('click', function () {
      var text = buildBriefText();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('Teks brief disalin ke clipboard ✓');
        });
      }
    });
  }

  if (briefForm) {
    briefForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = buildBriefText();
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
      showToast('Membuka WhatsApp dengan brief Anda...');
      closeContactModal();
    });
  }

  function bindCopyEmail(btn) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      var email = btn.getAttribute('data-email') || 'raka@pratamastudio.id';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(function () {
          showToast('Email ' + email + ' berhasil disalin ✓');
        });
      } else {
        showToast('Email: ' + email);
      }
    });
  }
  bindCopyEmail(copyEmailHeroBtn);
  bindCopyEmail(copyEmailFooterBtn);

  [printCvNavBtn, printCvHeroBtn, printCvExpBtn].forEach(function (btn) {
    if (btn) {
      btn.addEventListener('click', function () {
        window.print();
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (caseStudyModal && !caseStudyModal.hidden) closeCaseStudy();
      if (contactModal && !contactModal.hidden) closeContactModal();
    }
  });

  renderProjects('all');
})();
