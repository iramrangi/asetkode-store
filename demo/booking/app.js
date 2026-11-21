/* ==========================================================================
   Aplikasi Booking Jadwal, Reservasi Jasa & Manajemen Janji Temu Pelanggan
   Zero-Config Vanilla JS — Ddev (https://asetkode.blogspot.com)
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'ddev_booking_app_v1';
  var THEME_KEY = 'ddev_booking_theme_v1';
  var TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00'
  ];

  var AVATAR_COLORS = ['#4f46e5', '#0d9488', '#0284c7', '#d97706', '#db2777', '#7c3aed'];

  /* ==================== HELPER TANGGAL & FORMAT ==================== */
  function toLocalDateStr(dateObj) {
    var d = dateObj || new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function addDaysStr(offsetDays) {
    var d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return toLocalDateStr(d);
  }

  function formatDateID(dateStr) {
    if (!dateStr) return '-';
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '-';
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatIDR(amount) {
    return 'Rp ' + Math.round(Number(amount || 0)).toLocaleString('id-ID');
  }

  function timeToMinutes(hhmm) {
    var parts = String(hhmm || '00:00').split(':');
    return Number(parts[0]) * 60 + Number(parts[1]);
  }

  function minutesToTime(totalMin) {
    var wrapped = ((totalMin % 1440) + 1440) % 1440;
    var h = String(Math.floor(wrapped / 60)).padStart(2, '0');
    var m = String(wrapped % 60).padStart(2, '0');
    return h + ':' + m;
  }

  function computeEndTime(startHHMM, durationMin) {
    return minutesToTime(timeToMinutes(startHHMM) + Number(durationMin || 60));
  }

  function normalizeWhatsApp(raw) {
    var digits = String(raw || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.indexOf('0') === 0) return '62' + digits.slice(1);
    if (digits.indexOf('8') === 0) return '62' + digits;
    return digits;
  }

  function escapeHTML(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getInitials(name) {
    var words = String(name || '').replace(/drg\.|dr\.|Sp\.\w+/gi, '').trim().split(/\s+/);
    if (!words.length || !words[0]) return 'ST';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  /* ==================== SVG ICON LIBRARY ==================== */
  function presetIconSVG(presetId) {
    switch (presetId) {
      case 'klinik':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>';
      case 'salon':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>';
      case 'bengkel':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>';
      case 'studio':
      default:
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
    }
  }

  /* ==================== 4 INDUSTRY PRESETS & SEED DATA ==================== */
  function buildPresetData(presetId) {
    var today = addDaysStr(0);
    var tomorrow = addDaysStr(1);

    if (presetId === 'klinik') {
      return {
        id: 'klinik',
        label: 'Klinik & Dokter Gigi',
        shortDesc: 'Reservasi dokter gigi, konsultasi poli & perawatan estetik',
        business: {
          name: 'Klinik Gigi & Estetika Sehat',
          tagline: 'Reservasi Dokter, Perawatan Gigi & Konsultasi',
          whatsapp: '6281234567890'
        },
        services: [
          { id: 'kl-s1', name: 'Scaling & Pembersihan Karang Gigi', duration: 45, price: 250000, desc: 'Pembersihan karang gigi menyeluruh + poles enamel' },
          { id: 'kl-s2', name: 'Konsultasi & Pemeriksaan Umum', duration: 30, price: 100000, desc: 'Cek kondisi gigi, gusi, dan rencana perawatan' },
          { id: 'kl-s3', name: 'Tambal Gigi Estetik Komposit', duration: 60, price: 350000, desc: 'Tambalan sewarna gigi asli, kuat & natural' },
          { id: 'kl-s4', name: 'Bleaching / Pemutihan Gigi', duration: 90, price: 1250000, desc: 'Mencerahkan warna gigi hingga 3 tingkat lebih cerah' },
          { id: 'kl-s5', name: 'Pencabutan Gigi Sederhana', duration: 45, price: 300000, desc: 'Tindakan pencabutan aman dengan anestesi lokal' }
        ],
        staff: [
          { id: 'kl-st1', name: 'drg. Nadia Putri', role: 'Dokter Gigi Umum', color: AVATAR_COLORS[0] },
          { id: 'kl-st2', name: 'drg. Hendra Wijaya, Sp.KG', role: 'Konservasi & Estetik', color: AVATAR_COLORS[1] },
          { id: 'kl-st3', name: 'drg. Maya Santoso', role: 'Orthodonti & Scaling', color: AVATAR_COLORS[2] }
        ],
        bookings: [
          {
            id: 'b-kl-1', code: 'BKG-2041', date: today, time: '09:00',
            serviceId: 'kl-s2', serviceName: 'Konsultasi & Pemeriksaan Umum', duration: 30, price: 100000,
            staffId: 'kl-st1', staffName: 'drg. Nadia Putri',
            customerName: 'Siti Aminah', customerPhone: '081288991122',
            notes: 'Kontrol rutin 6 bulanan', status: 'Selesai', createdAt: today + 'T08:15:00'
          },
          {
            id: 'b-kl-2', code: 'BKG-2042', date: today, time: '10:00',
            serviceId: 'kl-s1', serviceName: 'Scaling & Pembersihan Karang Gigi', duration: 45, price: 250000,
            staffId: 'kl-st1', staffName: 'drg. Nadia Putri',
            customerName: 'Bagas Prakoso', customerPhone: '081344556677',
            notes: 'Gusi agak sensitif di bagian bawah', status: 'Dikonfirmasi', createdAt: today + 'T08:30:00'
          },
          {
            id: 'b-kl-3', code: 'BKG-2043', date: today, time: '13:00',
            serviceId: 'kl-s4', serviceName: 'Bleaching / Pemutihan Gigi', duration: 90, price: 1250000,
            staffId: 'kl-st2', staffName: 'drg. Hendra Wijaya, Sp.KG',
            customerName: 'Clara Oktaviani', customerPhone: '085711223344',
            notes: 'Persiapan acara wisuda minggu depan', status: 'Menunggu', createdAt: today + 'T09:10:00'
          },
          {
            id: 'b-kl-4', code: 'BKG-2044', date: today, time: '15:00',
            serviceId: 'kl-s3', serviceName: 'Tambal Gigi Estetik Komposit', duration: 60, price: 350000,
            staffId: 'kl-st1', staffName: 'drg. Nadia Putri',
            customerName: 'Rendi Kurniawan', customerPhone: '081922334455',
            notes: 'Geraham kiri berlubang kecil', status: 'Dikonfirmasi', createdAt: today + 'T09:40:00'
          },
          {
            id: 'b-kl-5', code: 'BKG-2045', date: tomorrow, time: '10:00',
            serviceId: 'kl-s1', serviceName: 'Scaling & Pembersihan Karang Gigi', duration: 45, price: 250000,
            staffId: 'kl-st3', staffName: 'drg. Maya Santoso',
            customerName: 'Dian Pertiwi', customerPhone: '082155667788',
            notes: 'Datang bersama anak', status: 'Menunggu', createdAt: today + 'T10:05:00'
          },
          {
            id: 'b-kl-6', code: 'BKG-2046', date: tomorrow, time: '14:00',
            serviceId: 'kl-s3', serviceName: 'Tambal Gigi Estetik Komposit', duration: 60, price: 350000,
            staffId: 'kl-st2', staffName: 'drg. Hendra Wijaya, Sp.KG',
            customerName: 'Arif Rahman', customerPhone: '081299008877',
            notes: 'Tambalan lama lepas', status: 'Dikonfirmasi', createdAt: today + 'T10:25:00'
          }
        ]
      };
    }

    if (presetId === 'salon') {
      return {
        id: 'salon',
        label: 'Barbershop & Salon',
        shortDesc: 'Potong rambut, styling, coloring & treatment salon',
        business: {
          name: 'Urban Cut Barbershop & Salon',
          tagline: 'Potong Rambut, Styling & Perawatan Pria/Wanita',
          whatsapp: '6285712345678'
        },
        services: [
          { id: 'sl-s1', name: 'Gentleman Haircut & Wash', duration: 45, price: 65000, desc: 'Potong rambut presisi + keramas + tonic & styling' },
          { id: 'sl-s2', name: 'Haircut + Creambath & Pijat', duration: 75, price: 120000, desc: 'Paket potong lengkap dengan pijat relaksasi bahu' },
          { id: 'sl-s3', name: 'Beard Trim & Hot Towel Shave', duration: 30, price: 45000, desc: 'Rapikan jenggot & kumis dengan handuk hangat' },
          { id: 'sl-s4', name: 'Hair Coloring / Highlight', duration: 120, price: 350000, desc: 'Pewarnaan rambut premium bebas amonia' },
          { id: 'sl-s5', name: 'Keratin Smoothing Treatment', duration: 90, price: 420000, desc: 'Rambut lembut berkilau dan mudah diatur' }
        ],
        staff: [
          { id: 'sl-st1', name: 'Raka Pratama', role: 'Master Barber', color: AVATAR_COLORS[0] },
          { id: 'sl-st2', name: 'Sinta Dewi', role: 'Senior Hair Stylist', color: AVATAR_COLORS[4] },
          { id: 'sl-st3', name: 'Dimas Ardi', role: 'Barber & Coloring', color: AVATAR_COLORS[2] }
        ],
        bookings: [
          {
            id: 'b-sl-1', code: 'BKG-3101', date: today, time: '10:00',
            serviceId: 'sl-s1', serviceName: 'Gentleman Haircut & Wash', duration: 45, price: 65000,
            staffId: 'sl-st1', staffName: 'Raka Pratama',
            customerName: 'Fauzan Hakim', customerPhone: '081244332211',
            notes: 'Model French Crop bagian atas agak tipis', status: 'Selesai', createdAt: today + 'T09:00:00'
          },
          {
            id: 'b-sl-2', code: 'BKG-3102', date: today, time: '11:00',
            serviceId: 'sl-s2', serviceName: 'Haircut + Creambath & Pijat', duration: 75, price: 120000,
            staffId: 'sl-st1', staffName: 'Raka Pratama',
            customerName: 'Taufik Hidayat', customerPhone: '081355661122',
            notes: 'Creambath aroma mint', status: 'Dikonfirmasi', createdAt: today + 'T09:20:00'
          },
          {
            id: 'b-sl-3', code: 'BKG-3103', date: today, time: '14:00',
            serviceId: 'sl-s4', serviceName: 'Hair Coloring / Highlight', duration: 120, price: 350000,
            staffId: 'sl-st2', staffName: 'Sinta Dewi',
            customerName: 'Nabila Azzahra', customerPhone: '085677889900',
            notes: 'Ash brown soft highlight', status: 'Menunggu', createdAt: today + 'T10:15:00'
          },
          {
            id: 'b-sl-4', code: 'BKG-3104', date: today, time: '17:00',
            serviceId: 'sl-s3', serviceName: 'Beard Trim & Hot Towel Shave', duration: 30, price: 45000,
            staffId: 'sl-st3', staffName: 'Dimas Ardi',
            customerName: 'Yogi Mahendra', customerPhone: '081899887766',
            notes: 'Rapikan sebelum meeting', status: 'Dikonfirmasi', createdAt: today + 'T11:00:00'
          },
          {
            id: 'b-sl-5', code: 'BKG-3105', date: tomorrow, time: '11:00',
            serviceId: 'sl-s5', serviceName: 'Keratin Smoothing Treatment', duration: 90, price: 420000,
            staffId: 'sl-st2', staffName: 'Sinta Dewi',
            customerName: 'Putri Melati', customerPhone: '082233445566',
            notes: 'Rambut sebahu', status: 'Menunggu', createdAt: today + 'T11:20:00'
          }
        ]
      };
    }

    if (presetId === 'bengkel') {
      return {
        id: 'bengkel',
        label: 'Bengkel & Servis',
        shortDesc: 'Booking servis berkala, tune-up, AC & spooring kendaraan',
        business: {
          name: 'Bengkel Mandiri Motor & Mobil',
          tagline: 'Booking Servis Berkala, Tune-Up & Ganti Oli Tanpa Antre',
          whatsapp: '6281398765432'
        },
        services: [
          { id: 'bg-s1', name: 'Ganti Oli Mesin & Filter', duration: 30, price: 185000, desc: 'Oli full synthetic + pengecekan cairan radiator & aki' },
          { id: 'bg-s2', name: 'Servis Ringan & Tune-Up Injeksi', duration: 60, price: 250000, desc: 'Bersihkan throttle body, busi, dan kalibrasi ECU' },
          { id: 'bg-s3', name: 'Servis Rem & Kaki-Kaki', duration: 60, price: 220000, desc: 'Cek kampas rem, minyak rem, shock & ball joint' },
          { id: 'bg-s4', name: 'Servis AC & Cuci Evaporator', duration: 90, price: 380000, desc: 'Flushing freon, cuci blower & ganti filter kabin' },
          { id: 'bg-s5', name: 'Spooring & Balancing 4 Roda', duration: 60, price: 300000, desc: 'Setel sudut roda 3D agar kemudi lurus & ban awet' }
        ],
        staff: [
          { id: 'bg-st1', name: 'Pak Agus Setiawan', role: 'Kepala Mekanik Mesin', color: AVATAR_COLORS[3] },
          { id: 'bg-st2', name: 'Budi Santoso', role: 'Spesialis AC & Kelistrikan', color: AVATAR_COLORS[1] },
          { id: 'bg-st3', name: 'Rizky Maulana', role: 'Teknisi Kaki-Kaki & Ban', color: AVATAR_COLORS[5] }
        ],
        bookings: [
          {
            id: 'b-bg-1', code: 'BKG-5510', date: today, time: '09:00',
            serviceId: 'bg-s1', serviceName: 'Ganti Oli Mesin & Filter', duration: 30, price: 185000,
            staffId: 'bg-st1', staffName: 'Pak Agus Setiawan',
            customerName: 'Hendra Gunawan', customerPhone: '081122334455',
            notes: 'Honda Brio 2022 - Plat B 1824 KLA', status: 'Selesai', createdAt: today + 'T08:00:00'
          },
          {
            id: 'b-bg-2', code: 'BKG-5511', date: today, time: '10:00',
            serviceId: 'bg-s2', serviceName: 'Servis Ringan & Tune-Up Injeksi', duration: 60, price: 250000,
            staffId: 'bg-st1', staffName: 'Pak Agus Setiawan',
            customerName: 'Rizal Ramadhan', customerPhone: '081266778899',
            notes: 'Toyota Avanza 2020 - tarikan agak berat', status: 'Dikonfirmasi', createdAt: today + 'T08:40:00'
          },
          {
            id: 'b-bg-3', code: 'BKG-5512', date: today, time: '13:00',
            serviceId: 'bg-s4', serviceName: 'Servis AC & Cuci Evaporator', duration: 90, price: 380000,
            staffId: 'bg-st2', staffName: 'Budi Santoso',
            customerName: 'Eko Prasetyo', customerPhone: '085233445566',
            notes: 'AC kurang dingin saat macet siang hari', status: 'Menunggu', createdAt: today + 'T09:15:00'
          },
          {
            id: 'b-bg-4', code: 'BKG-5513', date: tomorrow, time: '10:00',
            serviceId: 'bg-s5', serviceName: 'Spooring & Balancing 4 Roda', duration: 60, price: 300000,
            staffId: 'bg-st3', staffName: 'Rizky Maulana',
            customerName: 'Wahyu Nugraha', customerPhone: '081788990011',
            notes: 'Setir terasa narik ke kiri', status: 'Dikonfirmasi', createdAt: today + 'T10:30:00'
          }
        ]
      };
    }

    // default: studio
    return {
      id: 'studio',
      label: 'Studio Foto & Konsultasi',
      shortDesc: 'Sesi foto studio, foto produk UMKM & ruang konsultasi',
      business: {
        name: 'Lumina Studio & Ruang Konsultasi',
        tagline: 'Reservasi Sesi Foto, Sewa Studio & Konsultasi Privat',
        whatsapp: '6287811223344'
      },
      services: [
        { id: 'st-s1', name: 'Pas Foto & Headshot Profesional', duration: 30, price: 150000, desc: '3 file retouch resolusi tinggi + cetak kilat' },
        { id: 'st-s2', name: 'Sesi Foto Keluarga / Wisuda', duration: 60, price: 450000, desc: 'Maksimal 6 orang, termasuk 15 foto edit premium' },
        { id: 'st-s3', name: 'Foto Produk Katalog UMKM (10 Item)', duration: 90, price: 550000, desc: 'Styling properti & foto siap upload marketplace' },
        { id: 'st-s4', name: 'Sewa Studio + Lighting Full Set', duration: 120, price: 350000, desc: 'Background seamless 3 warna + 2 studio strobe' },
        { id: 'st-s5', name: 'Sesi Konsultasi Bisnis & Branding', duration: 60, price: 275000, desc: 'Audit visual brand & strategi konten media sosial' }
      ],
      staff: [
        { id: 'st-st1', name: 'Kevin Hartono', role: 'Lead Photographer', color: AVATAR_COLORS[0] },
        { id: 'st-st2', name: 'Alya Rahma', role: 'Lighting & Art Director', color: AVATAR_COLORS[4] },
        { id: 'st-st3', name: 'Fajar Nugroho', role: 'Brand Consultant', color: AVATAR_COLORS[1] }
      ],
      bookings: [
        {
          id: 'b-st-1', code: 'BKG-7801', date: today, time: '10:00',
          serviceId: 'st-s2', serviceName: 'Sesi Foto Keluarga / Wisuda', duration: 60, price: 450000,
          staffId: 'st-st1', staffName: 'Kevin Hartono',
          customerName: 'Keluarga Bpk. Darmawan', customerPhone: '081277665544',
          notes: 'Tema background cream minimalis, 4 orang', status: 'Dikonfirmasi', createdAt: today + 'T08:50:00'
        },
        {
          id: 'b-st-2', code: 'BKG-7802', date: today, time: '14:00',
          serviceId: 'st-s3', serviceName: 'Foto Produk Katalog UMKM (10 Item)', duration: 90, price: 550000,
          staffId: 'st-st2', staffName: 'Alya Rahma',
          customerName: 'Kopi Senja Nusantara', customerPhone: '085899001122',
          notes: 'Bawa 10 varian kemasan kopi & gelas saji', status: 'Menunggu', createdAt: today + 'T09:30:00'
        },
        {
          id: 'b-st-3', code: 'BKG-7803', date: tomorrow, time: '11:00',
          serviceId: 'st-s5', serviceName: 'Sesi Konsultasi Bisnis & Branding', duration: 60, price: 275000,
          staffId: 'st-st3', staffName: 'Fajar Nugroho',
          customerName: 'Mela Kusuma', customerPhone: '081900112233',
          notes: 'Rebranding produk skincare lokal', status: 'Dikonfirmasi', createdAt: today + 'T10:15:00'
        }
      ]
    };
  }

  var PRESET_ORDER = ['klinik', 'salon', 'bengkel', 'studio'];

  function createInitialStore() {
    var presets = {};
    PRESET_ORDER.forEach(function (pid) {
      presets[pid] = buildPresetData(pid);
    });
    return {
      version: 1,
      activePresetId: 'klinik',
      presets: presets
    };
  }

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createInitialStore();
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.presets || !parsed.activePresetId) {
        return createInitialStore();
      }
      PRESET_ORDER.forEach(function (pid) {
        if (!parsed.presets[pid]) {
          parsed.presets[pid] = buildPresetData(pid);
        }
      });
      if (!parsed.presets[parsed.activePresetId]) {
        parsed.activePresetId = 'klinik';
      }
      return parsed;
    } catch (e) {
      return createInitialStore();
    }
  }

  function saveStore() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      // Ignore storage quota issues safely
    }
  }

  /* ==================== APPLICATION STATE ==================== */
  var store = loadStore();

  var uiState = {
    activeTab: 'booking',
    selectedServiceId: null,
    selectedStaffId: null,
    selectedDate: addDaysStr(0),
    selectedTime: '',
    adminDateMode: 'all', // 'all' | 'today' | 'tomorrow' | 'custom'
    adminDateCustom: '',
    adminStatusFilter: 'ALL',
    adminSearch: '',
    adminView: 'table', // 'table' | 'timeline'
    modalBookingId: null
  };

  function getActivePreset() {
    return store.presets[store.activePresetId];
  }

  function ensureBookingSelection() {
    var preset = getActivePreset();
    if (!preset.services.some(function (s) { return s.id === uiState.selectedServiceId; })) {
      uiState.selectedServiceId = preset.services.length ? preset.services[0].id : null;
    }
    if (!preset.staff.some(function (st) { return st.id === uiState.selectedStaffId; })) {
      uiState.selectedStaffId = preset.staff.length ? preset.staff[0].id : null;
    }
    if (!uiState.selectedDate) {
      uiState.selectedDate = addDaysStr(0);
    }
  }

  /* ==================== TOAST & THEME ==================== */
  function showToast(message) {
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
    renderThemeToggleIcon();
  }

  function renderThemeToggleIcon() {
    var btn = document.getElementById('themeToggleBtn');
    var settingsBtn = document.getElementById('settingsThemeToggle');
    var isDark = getCurrentTheme() === 'dark';

    if (btn) {
      btn.innerHTML = isDark
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      btn.title = isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap';
    }
    if (settingsBtn) {
      settingsBtn.textContent = isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap';
    }
  }

  function toggleTheme() {
    applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
  }

  /* ==================== DOUBLE-BOOKING SLOT ENGINE ==================== */
  function getSlotAvailability(dateStr, staffId, slotTime, durationMin, bookings) {
    var slotStart = timeToMinutes(slotTime);
    var slotEnd = slotStart + Number(durationMin || 60);
    var activeBookings = bookings.filter(function (b) {
      return b.date === dateStr && b.staffId === staffId && b.status !== 'Batal';
    });

    // 1. Direct occupied slot check (existing booking covers slotStart)
    for (var i = 0; i < activeBookings.length; i++) {
      var b = activeBookings[i];
      var bStart = timeToMinutes(b.time);
      var bEnd = bStart + Number(b.duration || 60);
      if (slotStart >= bStart && slotStart < bEnd) {
        return {
          available: false,
          reason: 'occupied',
          label: 'Terisi',
          conflictBooking: b
        };
      }
    }

    // 2. Duration overlap check (service duration would spill into next booked slot)
    for (var j = 0; j < activeBookings.length; j++) {
      var b2 = activeBookings[j];
      var b2Start = timeToMinutes(b2.time);
      var b2End = b2Start + Number(b2.duration || 60);
      if (slotStart < b2End && slotEnd > b2Start) {
        return {
          available: false,
          reason: 'conflict',
          label: 'Bentrok',
          conflictBooking: b2
        };
      }
    }

    return {
      available: true,
      reason: 'free',
      label: 'Tersedia',
      conflictBooking: null
    };
  }

  function countAvailableSlotsForStaff(dateStr, staffId, durationMin, bookings) {
    var count = 0;
    TIME_SLOTS.forEach(function (slot) {
      if (getSlotAvailability(dateStr, staffId, slot, durationMin, bookings).available) {
        count++;
      }
    });
    return count;
  }

  /* ==================== RENDER HEADER & PRESETS ==================== */
  function renderHeader() {
    var preset = getActivePreset();
    document.getElementById('headerBizName').textContent = preset.business.name;
    document.getElementById('headerBizTagline').textContent = preset.business.tagline;
    document.getElementById('headerPresetBadge').textContent = preset.label;
    document.getElementById('summaryBizName').textContent = preset.business.name;
    document.getElementById('printBizName').textContent = preset.business.name;
    document.getElementById('printBizSub').textContent = preset.business.tagline + ' • Jadwal Reservasi';

    // Pending badge in Admin tab
    var pendingCount = preset.bookings.filter(function (b) { return b.status === 'Menunggu'; }).length;
    var badge = document.getElementById('navPendingBadge');
    if (pendingCount > 0) {
      badge.hidden = false;
      badge.textContent = String(pendingCount);
    } else {
      badge.hidden = true;
    }

    // Header 1-click preset pills
    var pillsWrap = document.getElementById('headerPresetPills');
    pillsWrap.innerHTML = PRESET_ORDER.map(function (pid) {
      var p = store.presets[pid];
      var activeCls = pid === store.activePresetId ? ' active' : '';
      return '<button type="button" class="preset-pill' + activeCls + '" data-preset-id="' + pid + '">' +
        presetIconSVG(pid) +
        '<span>' + escapeHTML(p.label) + '</span>' +
      '</button>';
    }).join('');
  }

  function switchPreset(presetId) {
    if (!store.presets[presetId] || store.activePresetId === presetId) return;
    store.activePresetId = presetId;
    uiState.selectedServiceId = null;
    uiState.selectedStaffId = null;
    uiState.selectedTime = '';
    saveStore();
    ensureBookingSelection();
    renderAll();
    showToast('Mode usaha diganti ke: ' + store.presets[presetId].label);
  }

  function resetCurrentPreset() {
    var pid = store.activePresetId;
    var label = store.presets[pid].label;
    store.presets[pid] = buildPresetData(pid);
    uiState.selectedServiceId = null;
    uiState.selectedStaffId = null;
    uiState.selectedTime = '';
    saveStore();
    ensureBookingSelection();
    renderAll();
    showToast('Data demo "' + label + '" berhasil dipulihkan.');
  }

  /* ==================== RENDER TAB 1: BOOKING FORM ==================== */
  function renderBookingTab() {
    ensureBookingSelection();
    var preset = getActivePreset();
    var selectedService = preset.services.find(function (s) { return s.id === uiState.selectedServiceId; });
    var duration = selectedService ? selectedService.duration : 60;

    // 1. Services
    document.getElementById('serviceCountChip').textContent = preset.services.length + ' Layanan';
    var serviceGrid = document.getElementById('serviceGrid');
    if (!preset.services.length) {
      serviceGrid.innerHTML = '<div class="empty-state">Belum ada layanan. Tambahkan melalui tab Kelola Layanan &amp; Staff.</div>';
    } else {
      serviceGrid.innerHTML = preset.services.map(function (svc) {
        var selected = svc.id === uiState.selectedServiceId ? ' selected' : '';
        return '<button type="button" class="service-card' + selected + '" data-service-id="' + escapeHTML(svc.id) + '">' +
          '<div>' +
            '<div class="service-card-top">' +
              '<div class="service-name">' + escapeHTML(svc.name) + '</div>' +
              '<span class="service-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>' +
            '</div>' +
            (svc.desc ? '<p class="service-desc">' + escapeHTML(svc.desc) + '</p>' : '') +
          '</div>' +
          '<div class="service-meta">' +
            '<span class="duration-badge">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
              svc.duration + ' menit' +
            '</span>' +
            '<span class="service-price">' + formatIDR(svc.price) + '</span>' +
          '</div>' +
        '</button>';
      }).join('');
    }

    // 2. Staff
    var staffGrid = document.getElementById('staffGrid');
    if (!preset.staff.length) {
      staffGrid.innerHTML = '<div class="empty-state">Belum ada staff. Tambahkan melalui tab Kelola Layanan &amp; Staff.</div>';
    } else {
      staffGrid.innerHTML = preset.staff.map(function (st) {
        var selected = st.id === uiState.selectedStaffId ? ' selected' : '';
        var availCount = countAvailableSlotsForStaff(uiState.selectedDate, st.id, duration, preset.bookings);
        return '<button type="button" class="staff-card' + selected + '" data-staff-id="' + escapeHTML(st.id) + '">' +
          '<span class="staff-avatar" style="background:' + escapeHTML(st.color || AVATAR_COLORS[0]) + '">' + escapeHTML(getInitials(st.name)) + '</span>' +
          '<div class="staff-info">' +
            '<div class="staff-name">' + escapeHTML(st.name) + '</div>' +
            '<div class="staff-role">' + escapeHTML(st.role) + '</div>' +
            '<div class="staff-avail">' + availCount + ' slot tersedia</div>' +
          '</div>' +
        '</button>';
      }).join('');
    }

    // Date controls sync
    var dateInput = document.getElementById('bookingDate');
    dateInput.value = uiState.selectedDate;
    dateInput.min = addDaysStr(0);

    var quickBtns = document.querySelectorAll('#quickBookingDates .pill-btn');
    quickBtns.forEach(function (btn) {
      var offset = Number(btn.getAttribute('data-offset'));
      btn.classList.toggle('active', addDaysStr(offset) === uiState.selectedDate);
    });

    // 3. Dynamic Time Slots
    var selectedStaff = preset.staff.find(function (st) { return st.id === uiState.selectedStaffId; });
    var slotContext = document.getElementById('slotContextLabel');
    slotContext.textContent = selectedStaff
      ? 'Jadwal ' + selectedStaff.name + ' • ' + formatDateID(uiState.selectedDate)
      : 'Pilih staff & tanggal terlebih dahulu';

    // Validate if previously selected time became unavailable
    if (uiState.selectedTime && selectedStaff) {
      var checkPrev = getSlotAvailability(uiState.selectedDate, selectedStaff.id, uiState.selectedTime, duration, preset.bookings);
      if (!checkPrev.available) {
        uiState.selectedTime = '';
      }
    }

    var freeCount = 0;
    var occupiedCount = 0;
    var slotHtml = TIME_SLOTS.map(function (slot) {
      if (!selectedStaff) {
        return '<button type="button" class="slot-btn" disabled><span class="slot-time">' + slot + '</span><span class="slot-tag">-</span></button>';
      }
      var status = getSlotAvailability(uiState.selectedDate, selectedStaff.id, slot, duration, preset.bookings);
      if (status.available) {
        freeCount++;
        var isSelected = uiState.selectedTime === slot ? ' selected' : '';
        return '<button type="button" class="slot-btn' + isSelected + '" data-slot-time="' + slot + '">' +
          '<span class="slot-time">' + slot + '</span>' +
          '<span class="slot-tag">' + (isSelected ? 'Dipilih' : 'Tersedia') + '</span>' +
        '</button>';
      }
      occupiedCount++;
      var cls = status.reason === 'conflict' ? ' conflict' : ' occupied';
      var titleHint = status.reason === 'conflict'
        ? 'Durasi layanan (' + duration + ' mnt) bertabrakan dengan jadwal jam ' + status.conflictBooking.time
        : 'Sudah dibooking pada jam ini (' + status.conflictBooking.time + ')';
      return '<button type="button" class="slot-btn' + cls + '" disabled title="' + escapeHTML(titleHint) + '">' +
        '<span class="slot-time">' + slot + '</span>' +
        '<span class="slot-tag">' + escapeHTML(status.label) + '</span>' +
      '</button>';
    }).join('');

    document.getElementById('timeSlotGrid').innerHTML = slotHtml;
    document.getElementById('slotAvailBadge').textContent = freeCount + ' dari ' + TIME_SLOTS.length + ' Tersedia';

    var helperNote = document.getElementById('slotHelperNote');
    if (occupiedCount > 0) {
      helperNote.textContent = occupiedCount + ' slot terkunci (Terisi / Bentrok durasi ' + duration + ' menit) untuk ' + (selectedStaff ? selectedStaff.name : 'staff') + ' pada ' + formatDateShort(uiState.selectedDate) + '.';
    } else {
      helperNote.textContent = 'Semua 12 slot (09:00 – 20:00) masih terbuka untuk ' + (selectedStaff ? selectedStaff.name : 'staff') + ' pada tanggal ini.';
    }

    // 4. Summary Sidebar
    renderBookingSummary(selectedService, selectedStaff);
  }

  function renderBookingSummary(selectedService, selectedStaff) {
    var timeLabel = uiState.selectedTime
      ? uiState.selectedTime + ' – ' + computeEndTime(uiState.selectedTime, selectedService ? selectedService.duration : 60) + ' WIB'
      : 'Belum dipilih';

    var rows = [
      { lbl: 'Layanan', val: selectedService ? selectedService.name : 'Belum dipilih', pending: !selectedService },
      { lbl: 'Durasi', val: selectedService ? selectedService.duration + ' menit' : '-', pending: !selectedService },
      { lbl: 'Staff / Spesialis', val: selectedStaff ? selectedStaff.name : 'Belum dipilih', pending: !selectedStaff },
      { lbl: 'Tanggal', val: formatDateID(uiState.selectedDate), pending: false },
      { lbl: 'Jam Kedatangan', val: timeLabel, pending: !uiState.selectedTime }
    ];

    document.getElementById('bookingSummaryList').innerHTML = rows.map(function (r) {
      return '<div class="summary-row">' +
        '<span class="summary-row-lbl">' + escapeHTML(r.lbl) + '</span>' +
        '<span class="summary-row-val' + (r.pending ? ' pending' : '') + '">' + escapeHTML(r.val) + '</span>' +
      '</div>';
    }).join('');

    document.getElementById('summaryPriceTotal').textContent = selectedService ? formatIDR(selectedService.price) : 'Rp 0';
  }

  function generateTicketCode(bookings) {
    var code;
    var exists = true;
    var guard = 0;
    while (exists && guard < 100) {
      var num = Math.floor(1000 + Math.random() * 9000);
      code = 'BKG-' + num;
      exists = bookings.some(function (b) { return b.code === code; });
      guard++;
    }
    return code;
  }

  function handleBookingSubmit(e) {
    e.preventDefault();
    var errEl = document.getElementById('bookingFormError');
    errEl.hidden = true;
    errEl.textContent = '';

    var preset = getActivePreset();
    var service = preset.services.find(function (s) { return s.id === uiState.selectedServiceId; });
    var staff = preset.staff.find(function (st) { return st.id === uiState.selectedStaffId; });
    var name = document.getElementById('custName').value.trim();
    var rawPhone = document.getElementById('custPhone').value.trim();
    var normPhone = normalizeWhatsApp(rawPhone);
    var notes = document.getElementById('custNotes').value.trim();

    if (!service) {
      errEl.textContent = 'Silakan pilih layanan terlebih dahulu.';
      errEl.hidden = false;
      return;
    }
    if (!staff) {
      errEl.textContent = 'Silakan pilih staff / spesialis terlebih dahulu.';
      errEl.hidden = false;
      return;
    }
    if (!uiState.selectedDate) {
      errEl.textContent = 'Silakan pilih tanggal kunjungan.';
      errEl.hidden = false;
      return;
    }
    if (!uiState.selectedTime) {
      errEl.textContent = 'Silakan pilih slot jam kedatangan yang tersedia (09:00 – 20:00).';
      errEl.hidden = false;
      return;
    }
    if (name.length < 2) {
      errEl.textContent = 'Nama lengkap pelanggan minimal 2 karakter.';
      errEl.hidden = false;
      document.getElementById('custName').focus();
      return;
    }
    if (normPhone.length < 9) {
      errEl.textContent = 'Masukkan nomor WhatsApp yang valid (minimal 9 digit, contoh: 081234567890).';
      errEl.hidden = false;
      document.getElementById('custPhone').focus();
      return;
    }

    // Final double-booking race-condition guard
    var check = getSlotAvailability(uiState.selectedDate, staff.id, uiState.selectedTime, service.duration, preset.bookings);
    if (!check.available) {
      errEl.textContent = 'Maaf, slot jam ' + uiState.selectedTime + ' baru saja terisi. Silakan pilih slot jam lainnya.';
      errEl.hidden = false;
      renderBookingTab();
      return;
    }

    var newBooking = {
      id: 'b-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      code: generateTicketCode(preset.bookings),
      date: uiState.selectedDate,
      time: uiState.selectedTime,
      serviceId: service.id,
      serviceName: service.name,
      duration: Number(service.duration),
      price: Number(service.price),
      staffId: staff.id,
      staffName: staff.name,
      customerName: name,
      customerPhone: rawPhone,
      notes: notes,
      status: 'Menunggu',
      createdAt: new Date().toISOString()
    };

    preset.bookings.unshift(newBooking);
    saveStore();

    // Reset form customer fields & selected time (slot is now locked!)
    document.getElementById('custName').value = '';
    document.getElementById('custPhone').value = '';
    document.getElementById('custNotes').value = '';
    uiState.selectedTime = '';

    renderAll();
    openTicketModal(newBooking.id);
    showToast('Reservasi ' + newBooking.code + ' berhasil dibuat!');
  }

  /* ==================== TICKET MODAL & .ICS GENERATOR ==================== */
  function buildCustomerConfirmationWA(booking, preset) {
    var adminWa = normalizeWhatsApp(preset.business.whatsapp) || '6281234567890';
    var endTime = computeEndTime(booking.time, booking.duration);
    var lines = [
      'Halo Admin *' + preset.business.name + '*, saya ingin konfirmasi booking:',
      '',
      'Kode Tiket: *' + booking.code + '*',
      'Nama: ' + booking.customerName,
      'No. WA: ' + booking.customerPhone,
      'Layanan: ' + booking.serviceName + ' (' + booking.duration + ' mnt)',
      'Estimasi Biaya: ' + formatIDR(booking.price),
      'Staff/Spesialis: ' + booking.staffName,
      'Jadwal: ' + formatDateID(booking.date) + ', ' + booking.time + ' - ' + endTime + ' WIB'
    ];
    if (booking.notes) {
      lines.push('Catatan: ' + booking.notes);
    }
    lines.push('');
    lines.push('Mohon konfirmasinya. Terima kasih!');
    return 'https://wa.me/' + adminWa + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  function openTicketModal(bookingId) {
    var preset = getActivePreset();
    var booking = preset.bookings.find(function (b) { return b.id === bookingId; });
    if (!booking) return;

    uiState.modalBookingId = booking.id;
    var endTime = computeEndTime(booking.time, booking.duration);

    document.getElementById('ticketBody').innerHTML =
      '<div class="ticket-top-row">' +
        '<div>' +
          '<div class="ticket-field-lbl">Kode Booking</div>' +
          '<div class="ticket-code-big">' + escapeHTML(booking.code) + '</div>' +
        '</div>' +
        '<span class="status-pill ' + escapeHTML(booking.status) + '">' + escapeHTML(booking.status) + '</span>' +
      '</div>' +
      '<div class="ticket-grid">' +
        '<div class="ticket-field-full">' +
          '<div class="ticket-field-lbl">Tempat Usaha</div>' +
          '<div class="ticket-field-val">' + escapeHTML(preset.business.name) + '</div>' +
        '</div>' +
        '<div>' +
          '<div class="ticket-field-lbl">Pelanggan</div>' +
          '<div class="ticket-field-val">' + escapeHTML(booking.customerName) + '</div>' +
        '</div>' +
        '<div>' +
          '<div class="ticket-field-lbl">WhatsApp</div>' +
          '<div class="ticket-field-val">' + escapeHTML(booking.customerPhone) + '</div>' +
        '</div>' +
        '<div class="ticket-field-full">' +
          '<div class="ticket-field-lbl">Layanan &amp; Tarif</div>' +
          '<div class="ticket-field-val">' + escapeHTML(booking.serviceName) + ' (' + booking.duration + ' mnt • ' + formatIDR(booking.price) + ')</div>' +
        '</div>' +
        '<div>' +
          '<div class="ticket-field-lbl">Staff / Spesialis</div>' +
          '<div class="ticket-field-val">' + escapeHTML(booking.staffName) + '</div>' +
        '</div>' +
        '<div>' +
          '<div class="ticket-field-lbl">Tanggal &amp; Jam</div>' +
          '<div class="ticket-field-val">' + escapeHTML(formatDateShort(booking.date)) + ' • ' + escapeHTML(booking.time) + ' – ' + escapeHTML(endTime) + '</div>' +
        '</div>' +
        (booking.notes
          ? '<div class="ticket-field-full"><div class="ticket-field-lbl">Catatan</div><div class="ticket-field-val">' + escapeHTML(booking.notes) + '</div></div>'
          : '') +
      '</div>';

    document.getElementById('sendTicketWaBtn').href = buildCustomerConfirmationWA(booking, preset);
    document.getElementById('ticketModal').hidden = false;
  }

  function closeTicketModal() {
    document.getElementById('ticketModal').hidden = true;
    uiState.modalBookingId = null;
  }

  function escapeICS(text) {
    return String(text || '')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  function formatICSLocal(dateObj) {
    return dateObj.getFullYear() +
      String(dateObj.getMonth() + 1).padStart(2, '0') +
      String(dateObj.getDate()).padStart(2, '0') + 'T' +
      String(dateObj.getHours()).padStart(2, '0') +
      String(dateObj.getMinutes()).padStart(2, '0') + '00';
  }

  function formatICSUTC(dateObj) {
    return dateObj.getUTCFullYear() +
      String(dateObj.getUTCMonth() + 1).padStart(2, '0') +
      String(dateObj.getUTCDate()).padStart(2, '0') + 'T' +
      String(dateObj.getUTCHours()).padStart(2, '0') +
      String(dateObj.getUTCMinutes()).padStart(2, '0') +
      String(dateObj.getUTCSeconds()).padStart(2, '0') + 'Z';
  }

  function downloadCurrentTicketICS() {
    if (!uiState.modalBookingId) return;
    var preset = getActivePreset();
    var booking = preset.bookings.find(function (b) { return b.id === uiState.modalBookingId; });
    if (!booking) return;

    var dParts = booking.date.split('-');
    var tParts = booking.time.split(':');
    var startDate = new Date(
      Number(dParts[0]),
      Number(dParts[1]) - 1,
      Number(dParts[2]),
      Number(tParts[0]),
      Number(tParts[1]),
      0
    );
    var endDate = new Date(startDate.getTime() + Number(booking.duration || 60) * 60000);

    var summary = '[' + booking.code + '] ' + booking.serviceName + ' - ' + preset.business.name;
    var descLines = [
      'Kode Booking: ' + booking.code,
      'Pelanggan: ' + booking.customerName + ' (' + booking.customerPhone + ')',
      'Layanan: ' + booking.serviceName + ' (' + booking.duration + ' menit)',
      'Staff: ' + booking.staffName,
      'Estimasi Biaya: ' + formatIDR(booking.price),
      booking.notes ? 'Catatan: ' + booking.notes : ''
    ].filter(Boolean).join('\n');

    var icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ddev Booking System//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + booking.code + '-' + booking.id + '@ddev-booking.local',
      'DTSTAMP:' + formatICSUTC(new Date()),
      'DTSTART:' + formatICSLocal(startDate),
      'DTEND:' + formatICSLocal(endDate),
      'SUMMARY:' + escapeICS(summary),
      'DESCRIPTION:' + escapeICS(descLines),
      'LOCATION:' + escapeICS(preset.business.name),
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    var blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'tiket-' + booking.code + '.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showToast('File kalender tiket-' + booking.code + '.ics diunduh.');
  }

  /* ==================== RENDER TAB 2: ADMIN & JADWAL ==================== */
  function getFilteredBookings() {
    var preset = getActivePreset();
    var today = addDaysStr(0);
    var tomorrow = addDaysStr(1);
    var q = uiState.adminSearch.trim().toLowerCase();

    return preset.bookings
      .filter(function (b) {
        if (uiState.adminDateMode === 'today' && b.date !== today) return false;
        if (uiState.adminDateMode === 'tomorrow' && b.date !== tomorrow) return false;
        if (uiState.adminDateMode === 'custom' && uiState.adminDateCustom && b.date !== uiState.adminDateCustom) return false;
        if (uiState.adminStatusFilter !== 'ALL' && b.status !== uiState.adminStatusFilter) return false;
        if (q) {
          var hay = [b.code, b.customerName, b.customerPhone, b.serviceName, b.staffName, b.notes].join(' ').toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      })
      .slice()
      .sort(function (a, b) {
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        return a.time < b.time ? -1 : (a.time > b.time ? 1 : 0);
      });
  }

  function buildAdminReminderWA(booking, preset) {
    var custWa = normalizeWhatsApp(booking.customerPhone);
    var endTime = computeEndTime(booking.time, booking.duration);
    var msg = [
      'Halo *' + booking.customerName + '*, kami dari *' + preset.business.name + '*.',
      '',
      'Pengingat janji temu Anda:',
      'Kode Booking: *' + booking.code + '*',
      'Layanan: ' + booking.serviceName + ' (' + booking.duration + ' mnt)',
      'Staff/Spesialis: ' + booking.staffName,
      'Jadwal: ' + formatDateID(booking.date) + ' pukul ' + booking.time + ' - ' + endTime + ' WIB',
      'Status: ' + booking.status,
      '',
      'Mohon hadir 10 menit sebelum jadwal ya. Terima kasih!'
    ].join('\n');
    return 'https://wa.me/' + custWa + '?text=' + encodeURIComponent(msg);
  }

  function renderAdminKPIs() {
    var preset = getActivePreset();
    var today = addDaysStr(0);

    var todayActive = preset.bookings.filter(function (b) {
      return b.date === today && b.status !== 'Batal';
    });
    var todayDone = todayActive.filter(function (b) { return b.status === 'Selesai'; }).length;

    var allActive = preset.bookings.filter(function (b) { return b.status !== 'Batal'; });
    var pendingList = allActive.filter(function (b) { return b.status === 'Menunggu'; });
    var confirmedList = allActive.filter(function (b) { return b.status === 'Dikonfirmasi' || b.status === 'Selesai'; });

    var filteredActive = getFilteredBookings().filter(function (b) { return b.status !== 'Batal'; });
    var revenueTotal = filteredActive.reduce(function (sum, b) { return sum + Number(b.price || 0); }, 0);

    document.getElementById('kpiTodayTotal').textContent = String(todayActive.length);
    document.getElementById('kpiTodaySub').textContent = todayDone + ' selesai • ' + (todayActive.length - todayDone) + ' berlangsung/jadwal';

    document.getElementById('kpiPendingTotal').textContent = String(pendingList.length);
    document.getElementById('kpiPendingSub').textContent = pendingList.length ? 'Perlu konfirmasi 1-klik' : 'Semua sudah ditindaklanjuti';

    document.getElementById('kpiConfirmedTotal').textContent = String(confirmedList.length);
    document.getElementById('kpiConfirmedSub').textContent = 'Terkonfirmasi & selesai';

    document.getElementById('kpiRevenueTotal').textContent = formatIDR(revenueTotal);
    document.getElementById('kpiRevenueSub').textContent = 'Dari ' + filteredActive.length + ' jadwal aktif di tampilan';
  }

  function renderRowActionButtons(booking, preset) {
    var btns = [];
    if (booking.status === 'Menunggu') {
      btns.push('<button type="button" class="btn btn-confirm-soft btn-xs" data-action="status" data-id="' + escapeHTML(booking.id) + '" data-next="Dikonfirmasi">Konfirmasi</button>');
      btns.push('<button type="button" class="btn btn-danger-soft btn-xs" data-action="status" data-id="' + escapeHTML(booking.id) + '" data-next="Batal">Batal</button>');
    } else if (booking.status === 'Dikonfirmasi') {
      btns.push('<button type="button" class="btn btn-done-soft btn-xs" data-action="status" data-id="' + escapeHTML(booking.id) + '" data-next="Selesai">Selesai</button>');
      btns.push('<button type="button" class="btn btn-danger-soft btn-xs" data-action="status" data-id="' + escapeHTML(booking.id) + '" data-next="Batal">Batal</button>');
    } else {
      btns.push('<button type="button" class="btn btn-outline btn-xs" data-action="status" data-id="' + escapeHTML(booking.id) + '" data-next="Menunggu">Buka Ulang</button>');
    }

    var waHref = buildAdminReminderWA(booking, preset);
    btns.push('<a href="' + escapeHTML(waHref) + '" target="_blank" rel="noopener noreferrer" class="btn btn-wa-soft btn-xs" title="Kirim pengingat WhatsApp ke pelanggan">WA Pengingat</a>');
    btns.push('<button type="button" class="btn btn-outline btn-xs" data-action="ticket" data-id="' + escapeHTML(booking.id) + '" title="Lihat Tiket & Download .ics">Tiket</button>');
    btns.push('<button type="button" class="btn btn-danger-soft btn-xs" data-action="delete" data-id="' + escapeHTML(booking.id) + '" title="Hapus permanen">Hapus</button>');
    return btns.join('');
  }

  function renderAdminTab() {
    renderAdminKPIs();
    var preset = getActivePreset();
    var list = getFilteredBookings();

    // Sync filter controls
    document.querySelectorAll('#adminDatePills .pill-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-date-mode') === uiState.adminDateMode);
    });
    document.getElementById('adminDateFilter').value = uiState.adminDateMode === 'custom' ? uiState.adminDateCustom : '';
    document.getElementById('adminStatusFilter').value = uiState.adminStatusFilter;
    document.querySelectorAll('.view-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-view') === uiState.adminView);
    });

    // Update print filter summary
    var filterDesc = 'Semua Tanggal';
    if (uiState.adminDateMode === 'today') filterDesc = 'Hari Ini (' + formatDateShort(addDaysStr(0)) + ')';
    else if (uiState.adminDateMode === 'tomorrow') filterDesc = 'Besok (' + formatDateShort(addDaysStr(1)) + ')';
    else if (uiState.adminDateMode === 'custom' && uiState.adminDateCustom) filterDesc = formatDateShort(uiState.adminDateCustom);
    if (uiState.adminStatusFilter !== 'ALL') filterDesc += ' • Status: ' + uiState.adminStatusFilter;
    document.getElementById('printFilterMeta').textContent = 'Filter: ' + filterDesc + ' (' + list.length + ' jadwal)';

    document.getElementById('scheduleCountLabel').textContent = 'Menampilkan ' + list.length + ' reservasi • ' + filterDesc;

    var container = document.getElementById('scheduleContainer');
    if (!list.length) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' +
          '<div><strong>Tidak ada jadwal yang cocok dengan filter saat ini.</strong></div>' +
          '<div style="font-size:12px;margin-top:4px;">Ubah filter tanggal/status atau buat reservasi baru dari Form Booking Pelanggan.</div>' +
        '</div>';
      return;
    }

    if (uiState.adminView === 'timeline') {
      var groups = {};
      list.forEach(function (b) {
        if (!groups[b.date]) groups[b.date] = [];
        groups[b.date].push(b);
      });
      var today = addDaysStr(0);
      var tomorrow = addDaysStr(1);

      container.innerHTML = '<div class="timeline-list">' +
        Object.keys(groups).map(function (dateKey) {
          var tag = dateKey === today ? ' (Hari Ini)' : (dateKey === tomorrow ? ' (Besok)' : '');
          var items = groups[dateKey].map(function (b) {
            var endTime = computeEndTime(b.time, b.duration);
            return '<div class="timeline-item status-' + escapeHTML(b.status) + '">' +
              '<div class="timeline-time">' +
                '<strong>' + escapeHTML(b.time) + ' – ' + escapeHTML(endTime) + '</strong>' +
                '<span>' + escapeHTML(b.code) + ' • ' + b.duration + ' mnt</span>' +
              '</div>' +
              '<div>' +
                '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
                  '<span class="cell-main">' + escapeHTML(b.customerName) + '</span>' +
                  '<span class="status-pill ' + escapeHTML(b.status) + '">' + escapeHTML(b.status) + '</span>' +
                '</div>' +
                '<div class="cell-sub">' + escapeHTML(b.serviceName) + ' (' + formatIDR(b.price) + ') • Staff: <strong>' + escapeHTML(b.staffName) + '</strong></div>' +
                '<div class="cell-sub">WA: ' + escapeHTML(b.customerPhone) + (b.notes ? ' • Catatan: ' + escapeHTML(b.notes) : '') + '</div>' +
              '</div>' +
              '<div class="row-actions no-print">' + renderRowActionButtons(b, preset) + '</div>' +
            '</div>';
          }).join('');

          return '<div class="timeline-day-group">' +
            '<div class="timeline-day-header">' +
              '<span>' + escapeHTML(formatDateID(dateKey) + tag) + '</span>' +
              '<span class="count-chip">' + groups[dateKey].length + ' Jadwal</span>' +
            '</div>' +
            items +
          '</div>';
        }).join('') +
      '</div>';
      return;
    }

    // Default Table View
    var todayStr = addDaysStr(0);
    var tomorrowStr = addDaysStr(1);
    var rowsHtml = list.map(function (b) {
      var endTime = computeEndTime(b.time, b.duration);
      var dayTag = b.date === todayStr ? 'Hari Ini' : (b.date === tomorrowStr ? 'Besok' : formatDateShort(b.date));
      return '<tr>' +
        '<td><button type="button" class="code-chip" data-action="ticket" data-id="' + escapeHTML(b.id) + '">' + escapeHTML(b.code) + '</button></td>' +
        '<td>' +
          '<div class="cell-main">' + escapeHTML(dayTag) + '</div>' +
          '<div class="cell-sub">' + escapeHTML(b.time) + ' – ' + escapeHTML(endTime) + ' WIB</div>' +
        '</td>' +
        '<td>' +
          '<div class="cell-main">' + escapeHTML(b.customerName) + '</div>' +
          '<div class="cell-sub">' + escapeHTML(b.customerPhone) + '</div>' +
          (b.notes ? '<div class="cell-sub" style="font-style:italic;">"' + escapeHTML(b.notes) + '"</div>' : '') +
        '</td>' +
        '<td>' +
          '<div class="cell-main">' + escapeHTML(b.serviceName) + '</div>' +
          '<div class="cell-sub">' + b.duration + ' mnt • ' + formatIDR(b.price) + '</div>' +
        '</td>' +
        '<td><div class="cell-main">' + escapeHTML(b.staffName) + '</div></td>' +
        '<td><span class="status-pill ' + escapeHTML(b.status) + '">' + escapeHTML(b.status) + '</span></td>' +
        '<td class="col-actions no-print"><div class="row-actions">' + renderRowActionButtons(b, preset) + '</div></td>' +
      '</tr>';
    }).join('');

    container.innerHTML =
      '<div class="table-wrap">' +
        '<table class="schedule-table">' +
          '<thead>' +
            '<tr>' +
              '<th>Kode</th>' +
              '<th>Tanggal &amp; Jam</th>' +
              '<th>Pelanggan</th>' +
              '<th>Layanan &amp; Tarif</th>' +
              '<th>Staff</th>' +
              '<th>Status</th>' +
              '<th class="col-actions no-print">Aksi Cepat</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + rowsHtml + '</tbody>' +
        '</table>' +
      '</div>';
  }

  function handleScheduleAction(e) {
    var target = e.target.closest('[data-action]');
    if (!target) return;

    var action = target.getAttribute('data-action');
    var bookingId = target.getAttribute('data-id');
    var preset = getActivePreset();
    var idx = preset.bookings.findIndex(function (b) { return b.id === bookingId; });
    if (idx === -1) return;

    if (action === 'status') {
      var nextStatus = target.getAttribute('data-next');
      var booking = preset.bookings[idx];
      // If reopening a cancelled booking, verify slot is still free
      if (booking.status === 'Batal' && nextStatus !== 'Batal') {
        var check = getSlotAvailability(booking.date, booking.staffId, booking.time, booking.duration, preset.bookings);
        if (!check.available) {
          showToast('Gagal memulihkan: slot jam ' + booking.time + ' sudah terisi booking lain.');
          return;
        }
      }
      booking.status = nextStatus;
      saveStore();
      renderAll();
      showToast('Status ' + booking.code + ' diubah menjadi ' + nextStatus + '.');
    } else if (action === 'ticket') {
      openTicketModal(bookingId);
    } else if (action === 'delete') {
      var code = preset.bookings[idx].code;
      if (window.confirm('Hapus permanen data reservasi ' + code + '?')) {
        preset.bookings.splice(idx, 1);
        saveStore();
        renderAll();
        showToast('Reservasi ' + code + ' telah dihapus.');
      }
    }
  }

  function exportScheduleCSV() {
    var list = getFilteredBookings();
    if (!list.length) {
      showToast('Tidak ada data booking pada filter saat ini untuk diekspor.');
      return;
    }

    var headers = ['Kode', 'Tanggal', 'Jam Mulai', 'Jam Selesai', 'Pelanggan', 'WhatsApp', 'Layanan', 'Durasi (Menit)', 'Harga (Rp)', 'Staff', 'Status', 'Catatan'];
    var csvRows = [headers.join(',')];

    function csvCell(val) {
      var s = String(val == null ? '' : val);
      return '"' + s.replace(/"/g, '""') + '"';
    }

    list.forEach(function (b) {
      var row = [
        b.code,
        b.date,
        b.time,
        computeEndTime(b.time, b.duration),
        b.customerName,
        b.customerPhone,
        b.serviceName,
        b.duration,
        b.price,
        b.staffName,
        b.status,
        b.notes || ''
      ].map(csvCell);
      csvRows.push(row.join(','));
    });

    var csvContent = '\uFEFF' + csvRows.join('\r\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'jadwal-booking-' + store.activePresetId + '-' + addDaysStr(0) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showToast('Berhasil mengekspor ' + list.length + ' baris jadwal ke CSV.');
  }

  function printDailySchedule() {
    document.body.classList.remove('printing-ticket');
    document.getElementById('printTimestamp').textContent = 'Dicetak: ' + new Date().toLocaleString('id-ID');
    window.print();
  }

  /* ==================== RENDER TAB 3: KELOLA LAYANAN & STAFF ==================== */
  function renderSettingsTab() {
    var preset = getActivePreset();

    // 1. Preset cards
    document.getElementById('presetCardsGrid').innerHTML = PRESET_ORDER.map(function (pid) {
      var p = store.presets[pid];
      var isActive = pid === store.activePresetId;
      return '<button type="button" class="preset-card' + (isActive ? ' active' : '') + '" data-preset-id="' + pid + '">' +
        '<div class="preset-card-head">' +
          '<span class="preset-icon">' + presetIconSVG(pid) + '</span>' +
          (isActive ? '<span class="preset-active-tag">Aktif</span>' : '') +
        '</div>' +
        '<h3>' + escapeHTML(p.label) + '</h3>' +
        '<p>' + escapeHTML(p.shortDesc) + '</p>' +
      '</button>';
    }).join('');

    // 2. Profile inputs
    document.getElementById('bizNameInput').value = preset.business.name;
    document.getElementById('bizTaglineInput').value = preset.business.tagline;
    document.getElementById('bizWaInput').value = preset.business.whatsapp;

    // 3. Staff CRUD list
    document.getElementById('manageStaffList').innerHTML = preset.staff.map(function (st) {
      return '<div class="crud-item">' +
        '<div style="display:flex;align-items:center;gap:10px;min-width:0;">' +
          '<span class="staff-avatar" style="width:32px;height:32px;font-size:11px;background:' + escapeHTML(st.color || AVATAR_COLORS[0]) + '">' + escapeHTML(getInitials(st.name)) + '</span>' +
          '<div style="min-width:0;">' +
            '<div class="crud-item-title">' + escapeHTML(st.name) + '</div>' +
            '<div class="crud-item-meta">' + escapeHTML(st.role) + '</div>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="btn btn-danger-soft btn-xs" data-del-staff="' + escapeHTML(st.id) + '">Hapus</button>' +
      '</div>';
    }).join('');

    // 4. Services CRUD list
    document.getElementById('manageServicesList').innerHTML = preset.services.map(function (svc) {
      return '<div class="crud-item">' +
        '<div style="min-width:0;">' +
          '<div class="crud-item-title">' + escapeHTML(svc.name) + '</div>' +
          '<div class="crud-item-meta">' + svc.duration + ' menit • <strong>' + formatIDR(svc.price) + '</strong>' + (svc.desc ? ' — ' + escapeHTML(svc.desc) : '') + '</div>' +
        '</div>' +
        '<button type="button" class="btn btn-danger-soft btn-xs" data-del-service="' + escapeHTML(svc.id) + '">Hapus</button>' +
      '</div>';
    }).join('');
  }

  /* ==================== TAB SWITCHING & RENDER ALL ==================== */
  function setActiveTab(tabName) {
    uiState.activeTab = tabName;
    document.querySelectorAll('.nav-tabs .tab-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-tab') === tabName;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'tab-' + tabName);
    });
  }

  function renderAll() {
    renderThemeToggleIcon();
    renderHeader();
    renderBookingTab();
    renderAdminTab();
    renderSettingsTab();
  }

  /* ==================== EVENT BINDINGS ==================== */
  function bindEvents() {
    // Tab navigation
    document.querySelector('.nav-tabs').addEventListener('click', function (e) {
      var btn = e.target.closest('.tab-btn');
      if (!btn) return;
      setActiveTab(btn.getAttribute('data-tab'));
    });

    // Header & Settings 1-click preset switchers
    document.getElementById('headerPresetPills').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-preset-id]');
      if (btn) switchPreset(btn.getAttribute('data-preset-id'));
    });
    document.getElementById('presetCardsGrid').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-preset-id]');
      if (btn) switchPreset(btn.getAttribute('data-preset-id'));
    });

    // Reset Demo buttons
    document.getElementById('headerResetDemoBtn').addEventListener('click', function () {
      if (window.confirm('Kembalikan data preset "' + getActivePreset().label + '" ke data contoh awal?')) {
        resetCurrentPreset();
      }
    });
    document.getElementById('settingsResetBtn').addEventListener('click', function () {
      if (window.confirm('Kembalikan data preset "' + getActivePreset().label + '" ke data contoh awal?')) {
        resetCurrentPreset();
      }
    });

    // Theme toggles
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
    document.getElementById('settingsThemeToggle').addEventListener('click', toggleTheme);

    // Tab 1: Service selection
    document.getElementById('serviceGrid').addEventListener('click', function (e) {
      var card = e.target.closest('[data-service-id]');
      if (!card) return;
      uiState.selectedServiceId = card.getAttribute('data-service-id');
      renderBookingTab();
    });

    // Tab 1: Staff selection
    document.getElementById('staffGrid').addEventListener('click', function (e) {
      var card = e.target.closest('[data-staff-id]');
      if (!card) return;
      uiState.selectedStaffId = card.getAttribute('data-staff-id');
      renderBookingTab();
    });

    // Tab 1: Date selection
    document.getElementById('quickBookingDates').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-offset]');
      if (!btn) return;
      uiState.selectedDate = addDaysStr(Number(btn.getAttribute('data-offset')));
      renderBookingTab();
    });
    document.getElementById('bookingDate').addEventListener('change', function (e) {
      if (e.target.value) {
        uiState.selectedDate = e.target.value;
        renderBookingTab();
      }
    });

    // Tab 1: Time slot selection
    document.getElementById('timeSlotGrid').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-slot-time]');
      if (!btn || btn.disabled) return;
      uiState.selectedTime = btn.getAttribute('data-slot-time');
      renderBookingTab();
    });

    // Tab 1: Booking form submit
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);

    // Tab 2: Admin filters & toolbar
    document.getElementById('adminDatePills').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-date-mode]');
      if (!btn) return;
      uiState.adminDateMode = btn.getAttribute('data-date-mode');
      uiState.adminDateCustom = '';
      renderAdminTab();
    });
    document.getElementById('adminDateFilter').addEventListener('change', function (e) {
      if (e.target.value) {
        uiState.adminDateMode = 'custom';
        uiState.adminDateCustom = e.target.value;
      } else {
        uiState.adminDateMode = 'all';
        uiState.adminDateCustom = '';
      }
      renderAdminTab();
    });
    document.getElementById('adminStatusFilter').addEventListener('change', function (e) {
      uiState.adminStatusFilter = e.target.value;
      renderAdminTab();
    });
    document.getElementById('adminSearchInput').addEventListener('input', function (e) {
      uiState.adminSearch = e.target.value;
      renderAdminTab();
    });
    document.querySelector('.view-switch').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-view]');
      if (!btn) return;
      uiState.adminView = btn.getAttribute('data-view');
      renderAdminTab();
    });
    document.getElementById('printScheduleBtn').addEventListener('click', printDailySchedule);
    document.getElementById('exportCsvBtn').addEventListener('click', exportScheduleCSV);
    document.getElementById('jumpToBookingBtn').addEventListener('click', function () {
      setActiveTab('booking');
    });
    document.getElementById('scheduleContainer').addEventListener('click', handleScheduleAction);

    // Tab 3: Profile form
    document.getElementById('bizProfileForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var preset = getActivePreset();
      var name = document.getElementById('bizNameInput').value.trim();
      var tagline = document.getElementById('bizTaglineInput').value.trim();
      var wa = normalizeWhatsApp(document.getElementById('bizWaInput').value.trim());
      if (!name || wa.length < 9) {
        showToast('Nama usaha & nomor WhatsApp valid wajib diisi.');
        return;
      }
      preset.business.name = name;
      preset.business.tagline = tagline || preset.business.tagline;
      preset.business.whatsapp = wa;
      saveStore();
      renderAll();
      showToast('Profil usaha berhasil disimpan.');
    });

    // Tab 3: Add Staff
    document.getElementById('addStaffForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('stfNameInput').value.trim();
      var role = document.getElementById('stfRoleInput').value.trim();
      if (!name || !role) return;
      var preset = getActivePreset();
      var color = AVATAR_COLORS[preset.staff.length % AVATAR_COLORS.length];
      var newStaff = {
        id: 'stf-' + Date.now(),
        name: name,
        role: role,
        color: color
      };
      preset.staff.push(newStaff);
      saveStore();
      document.getElementById('stfNameInput').value = '';
      document.getElementById('stfRoleInput').value = '';
      renderAll();
      showToast('Staff "' + name + '" ditambahkan.');
    });

    // Tab 3: Delete Staff
    document.getElementById('manageStaffList').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-del-staff]');
      if (!btn) return;
      var preset = getActivePreset();
      if (preset.staff.length <= 1) {
        showToast('Minimal harus ada 1 staff aktif.');
        return;
      }
      var id = btn.getAttribute('data-del-staff');
      preset.staff = preset.staff.filter(function (s) { return s.id !== id; });
      saveStore();
      renderAll();
      showToast('Staff dihapus dari daftar.');
    });

    // Tab 3: Add Service
    document.getElementById('addServiceForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('svcNameInput').value.trim();
      var duration = Number(document.getElementById('svcDurationInput').value);
      var price = Number(document.getElementById('svcPriceInput').value);
      var desc = document.getElementById('svcDescInput').value.trim();
      if (!name || duration < 15 || price < 0) {
        showToast('Isi nama layanan, durasi (>=15 menit), dan harga dengan benar.');
        return;
      }
      var preset = getActivePreset();
      preset.services.push({
        id: 'svc-' + Date.now(),
        name: name,
        duration: duration,
        price: price,
        desc: desc
      });
      saveStore();
      document.getElementById('svcNameInput').value = '';
      document.getElementById('svcDurationInput').value = '45';
      document.getElementById('svcPriceInput').value = '';
      document.getElementById('svcDescInput').value = '';
      renderAll();
      showToast('Layanan "' + name + '" ditambahkan.');
    });

    // Tab 3: Delete Service
    document.getElementById('manageServicesList').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-del-service]');
      if (!btn) return;
      var preset = getActivePreset();
      if (preset.services.length <= 1) {
        showToast('Minimal harus ada 1 layanan aktif.');
        return;
      }
      var id = btn.getAttribute('data-del-service');
      preset.services = preset.services.filter(function (s) { return s.id !== id; });
      saveStore();
      renderAll();
      showToast('Layanan dihapus dari daftar.');
    });

    // Ticket Modal Events
    document.getElementById('closeTicketModalBtn').addEventListener('click', closeTicketModal);
    document.getElementById('doneTicketBtn').addEventListener('click', closeTicketModal);
    document.getElementById('ticketModal').addEventListener('click', function (e) {
      if (e.target.id === 'ticketModal') closeTicketModal();
    });
    document.getElementById('downloadIcsBtn').addEventListener('click', downloadCurrentTicketICS);
    document.getElementById('printTicketBtn').addEventListener('click', function () {
      document.body.classList.add('printing-ticket');
      window.print();
    });
    window.addEventListener('afterprint', function () {
      document.body.classList.remove('printing-ticket');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !document.getElementById('ticketModal').hidden) {
        closeTicketModal();
      }
    });
  }

  /* ==================== INIT ==================== */
  ensureBookingSelection();
  bindEvents();
  renderAll();
})();
