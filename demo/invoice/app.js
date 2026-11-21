/* ==========================================================================
   Ddev Invoice, Penawaran Harga & Kwitansi Bisnis Pro
   Zero-Config Offline HTML5 + CSS3 + Vanilla JS
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEYS = {
    DOCS: 'ddev_inv_docs_v1',
    PROFILE: 'ddev_inv_profile_v1',
    THEME: 'ddev_inv_theme'
  };

  var DEFAULT_PROFILE = {
    name: 'PT Ddev Solusi Digital',
    tagline: 'Pengembangan Web, Aplikasi Bisnis & Konsultasi Teknologi',
    address: 'Jl. Sudirman Kav. 45, Gedung Graha Niaga Lt. 6, Jakarta Selatan 12190',
    phone: '0812-9000-8899',
    email: 'halo@ddevstudio.id',
    npwp: '09.254.294.3-042.000',
    accentColor: '#0d9488',
    bankName: 'Bank Central Asia (BCA)',
    bankAccount: '5420-8891-2233',
    bankHolder: 'PT Ddev Solusi Digital',
    qrisMerchant: 'Ddev Solusi Digital',
    paymentNote: 'Transfer ke rekening tercantum atau scan QRIS. Mohon cantumkan nomor dokumen pada berita transfer.',
    signName: 'Dimas Pratama, S.Kom',
    signTitle: 'Direktur Operasional'
  };

  var DOC_TYPE_PREFIX = {
    INVOICE: 'INV',
    PENAWARAN: 'QUO',
    KWITANSI: 'KWT'
  };

  var DOC_TYPE_TITLES = {
    INVOICE: 'INVOICE',
    PENAWARAN: 'PENAWARAN HARGA',
    KWITANSI: 'KWITANSI RESMI'
  };

  var SUN_ICON = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var MOON_ICON = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  var state = {
    docs: [],
    profile: cloneObj(DEFAULT_PROFILE),
    currentDoc: null,
    dirty: false,
    activeView: 'editor'
  };

  var els = {};

  function cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function makeId() {
    return 'doc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function todayIso() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function addDaysIso(isoDate, days) {
    var base = isoDate ? new Date(isoDate + 'T00:00:00') : new Date();
    if (isNaN(base.getTime())) base = new Date();
    base.setDate(base.getDate() + days);
    var m = String(base.getMonth() + 1).padStart(2, '0');
    var day = String(base.getDate()).padStart(2, '0');
    return base.getFullYear() + '-' + m + '-' + day;
  }

  function formatDateId(iso) {
    if (!iso) return '-';
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    var months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    var monthIdx = parseInt(parts[1], 10) - 1;
    var monthName = months[monthIdx] || parts[1];
    return parseInt(parts[2], 10) + ' ' + monthName + ' ' + parts[0];
  }

  function formatRupiah(amount) {
    var val = Math.round(Number(amount) || 0);
    var sign = val < 0 ? '-' : '';
    var abs = Math.abs(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return sign + 'Rp ' + abs;
  }

  function formatQty(q) {
    var num = Number(q) || 0;
    return Number.isInteger(num) ? String(num) : num.toLocaleString('id-ID', { maximumFractionDigits: 2 });
  }

  function statusClass(status) {
    if (status === 'Lunas') return 'lunas';
    if (status === 'Terkirim') return 'terkirim';
    if (status === 'Jatuh Tempo') return 'jatuhtempo';
    return 'draft';
  }

  /* ========================================================================
     INDONESIAN TERBILANG CONVERTER
     ======================================================================== */
  function terbilangWords(n) {
    var satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    n = Math.floor(n);
    if (n === 0) return '';
    if (n < 12) return satuan[n];
    if (n < 20) return terbilangWords(n - 10) + ' Belas';
    if (n < 100) return terbilangWords(Math.floor(n / 10)) + ' Puluh' + (n % 10 ? ' ' + terbilangWords(n % 10) : '');
    if (n < 200) return 'Seratus' + (n % 100 ? ' ' + terbilangWords(n % 100) : '');
    if (n < 1000) return terbilangWords(Math.floor(n / 100)) + ' Ratus' + (n % 100 ? ' ' + terbilangWords(n % 100) : '');
    if (n < 2000) return 'Seribu' + (n % 1000 ? ' ' + terbilangWords(n % 1000) : '');
    if (n < 1000000) return terbilangWords(Math.floor(n / 1000)) + ' Ribu' + (n % 1000 ? ' ' + terbilangWords(n % 1000) : '');
    if (n < 1000000000) return terbilangWords(Math.floor(n / 1000000)) + ' Juta' + (n % 1000000 ? ' ' + terbilangWords(n % 1000000) : '');
    if (n < 1000000000000) return terbilangWords(Math.floor(n / 1000000000)) + ' Miliar' + (n % 1000000000 ? ' ' + terbilangWords(n % 1000000000) : '');
    return terbilangWords(Math.floor(n / 1000000000000)) + ' Triliun' + (n % 1000000000000 ? ' ' + terbilangWords(n % 1000000000000) : '');
  }

  function terbilangRupiah(n) {
    var num = Math.round(Number(n) || 0);
    if (num === 0) return 'Nol Rupiah';
    var prefix = num < 0 ? 'Minus ' : '';
    var words = terbilangWords(Math.abs(num)).replace(/\s+/g, ' ').trim();
    return prefix + words + ' Rupiah';
  }

  /* ========================================================================
     SEED DATA & LOCALSTORAGE
     ======================================================================== */
  function createSeedDocs() {
    return [
      {
        id: 'seed_inv_001',
        type: 'INVOICE',
        number: 'INV/2026/11/001',
        status: 'Jatuh Tempo',
        date: '2026-11-03',
        dueDate: '2026-11-17',
        clientName: 'PT Nusantara Digital Kreatif',
        clientPic: 'Bapak Budi Santoso',
        clientWa: '081234567890',
        clientEmail: 'finance@nusantarakreatif.co.id',
        clientAddress: 'Jl. Kemang Raya No. 88, Mampang Prapatan, Jakarta Selatan',
        items: [
          { desc: 'Pengembangan Website Company Profile & CMS Admin', qty: 1, unit: 'Paket', price: 6500000 },
          { desc: 'Optimasi SEO Teknis & Kecepatan Core Web Vitals', qty: 1, unit: 'Paket', price: 2000000 }
        ],
        discountValue: 0,
        discountType: 'percent',
        ppn: true,
        pph23: false,
        notes: 'Mohon lakukan pelunasan sesuai tanggal jatuh tempo. Bukti transfer dapat dikirim melalui WhatsApp.',
        showPaymentInfo: true,
        updatedAt: '2026-11-03T09:00:00Z'
      },
      {
        id: 'seed_kwt_002',
        type: 'KWITANSI',
        number: 'KWT/2026/11/002',
        status: 'Lunas',
        date: '2026-11-10',
        dueDate: '2026-11-10',
        clientName: 'CV Berkah Niaga Mandiri',
        clientPic: 'Ibu Siti Rahayu',
        clientWa: '081398765432',
        clientEmail: 'admin@berkahniaga.id',
        clientAddress: 'Jl. Basuki Rahmat No. 142, Tegalsari, Surabaya',
        items: [
          { desc: 'Implementasi Sistem Kasir POS & Integrasi QRIS Dinamis', qty: 1, unit: 'Paket', price: 8500000 },
          { desc: 'Pelatihan Operasional Admin & Staf Kasir Outlet', qty: 2, unit: 'Sesi', price: 750000 }
        ],
        discountValue: 500000,
        discountType: 'amount',
        ppn: true,
        pph23: false,
        notes: 'Pembayaran telah diterima lunas via transfer BCA. Garansi pemeliharaan sistem berlaku 90 hari.',
        showPaymentInfo: true,
        updatedAt: '2026-11-10T14:30:00Z'
      },
      {
        id: 'seed_quo_003',
        type: 'PENAWARAN',
        number: 'QUO/2026/11/003',
        status: 'Terkirim',
        date: '2026-11-18',
        dueDate: '2026-12-02',
        clientName: 'Klinik Medika Utama',
        clientPic: 'dr. Hendra Wijaya',
        clientWa: '085611223344',
        clientEmail: 'pengadaan@klinikmedikautama.id',
        clientAddress: 'Jl. Ir. H. Juanda (Dago) No. 54, Coblong, Kota Bandung',
        items: [
          { desc: 'Sistem Antrian Pasien Multi-Poli & Layar Panggil', qty: 1, unit: 'Paket', price: 4800000 },
          { desc: 'Dashboard Rekap Kunjungan & Laporan Harian', qty: 1, unit: 'Paket', price: 3700000 },
          { desc: 'Dukungan Teknis & Pemeliharaan Berkala', qty: 3, unit: 'Bulan', price: 600000 }
        ],
        discountValue: 5,
        discountType: 'percent',
        ppn: true,
        pph23: true,
        notes: 'Penawaran harga berlaku 14 hari kalender. Termin pembayaran 50% DP saat persetujuan dan 50% setelah serah terima.',
        showPaymentInfo: true,
        updatedAt: '2026-11-18T11:15:00Z'
      },
      {
        id: 'seed_inv_004',
        type: 'INVOICE',
        number: 'INV/2026/11/004',
        status: 'Draft',
        date: '2026-11-21',
        dueDate: '2026-11-28',
        clientName: 'Toko Kopi Senja Sejahtera',
        clientPic: 'Andi Pratama',
        clientWa: '087788990011',
        clientEmail: 'kopisenja@gmail.com',
        clientAddress: 'Jl. Prawirotaman No. 19, Mergangsan, Yogyakarta',
        items: [
          { desc: 'Jasa Fotografi Produk Menu Signature & Editing', qty: 25, unit: 'Unit', price: 75000 },
          { desc: 'Desain Kemasan Pouch Kopi & Stiker Label', qty: 3, unit: 'Paket', price: 450000 }
        ],
        discountValue: 0,
        discountType: 'percent',
        ppn: false,
        pph23: false,
        notes: 'Draft tagihan menunggu konfirmasi revisi akhir file desain kemasan.',
        showPaymentInfo: true,
        updatedAt: '2026-11-21T08:00:00Z'
      }
    ];
  }

  function loadStorage() {
    try {
      var rawProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (rawProfile) {
        state.profile = Object.assign({}, DEFAULT_PROFILE, JSON.parse(rawProfile));
      } else {
        state.profile = cloneObj(DEFAULT_PROFILE);
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(state.profile));
      }
    } catch (e) {
      state.profile = cloneObj(DEFAULT_PROFILE);
    }

    try {
      var rawDocs = localStorage.getItem(STORAGE_KEYS.DOCS);
      if (rawDocs) {
        var parsed = JSON.parse(rawDocs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.docs = parsed;
          return;
        }
      }
      state.docs = createSeedDocs();
      localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(state.docs));
    } catch (e) {
      state.docs = createSeedDocs();
    }
  }

  function saveDocsStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(state.docs));
    } catch (e) {
      showToast('Gagal menyimpan ke penyimpanan browser.');
    }
  }

  function saveProfileStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(state.profile));
    } catch (e) {
      showToast('Gagal menyimpan profil usaha.');
    }
  }

  /* ========================================================================
     CALCULATIONS & NUMBERING
     ======================================================================== */
  function calculateTotals(doc) {
    var items = Array.isArray(doc.items) ? doc.items : [];
    var subtotal = items.reduce(function (sum, item) {
      var line = Math.round((Number(item.qty) || 0) * (Number(item.price) || 0));
      return sum + Math.max(0, line);
    }, 0);

    var rawDiscount = Math.max(0, Number(doc.discountValue) || 0);
    var discountAmount = 0;
    if (doc.discountType === 'percent') {
      discountAmount = Math.round(subtotal * Math.min(100, rawDiscount) / 100);
    } else {
      discountAmount = Math.min(subtotal, Math.round(rawDiscount));
    }

    var dpp = Math.max(0, subtotal - discountAmount);
    var ppnAmount = doc.ppn ? Math.round(dpp * 0.11) : 0;
    var pph23Amount = doc.pph23 ? Math.round(dpp * 0.02) : 0;
    var grandTotal = Math.max(0, dpp + ppnAmount - pph23Amount);

    return {
      subtotal: subtotal,
      discountAmount: discountAmount,
      dpp: dpp,
      ppnAmount: ppnAmount,
      pph23Amount: pph23Amount,
      grandTotal: grandTotal
    };
  }

  function generateDocNumber(type, dateStr) {
    var prefix = DOC_TYPE_PREFIX[type] || 'INV';
    var datePart = (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) ? dateStr : todayIso();
    var parts = datePart.split('-');
    var year = parts[0];
    var month = parts[1];
    var patternPrefix = prefix + '/' + year + '/' + month + '/';

    var maxSeq = 0;
    state.docs.forEach(function (d) {
      if (d.number && d.number.indexOf(patternPrefix) === 0) {
        var tail = parseInt(d.number.slice(patternPrefix.length), 10);
        if (!isNaN(tail) && tail > maxSeq) maxSeq = tail;
      } else if (d.number && d.number.indexOf('/' + year + '/' + month + '/') !== -1) {
        var segs = d.number.split('/');
        var num = parseInt(segs[segs.length - 1], 10);
        if (!isNaN(num) && num > maxSeq) maxSeq = num;
      }
    });

    return patternPrefix + String(maxSeq + 1).padStart(3, '0');
  }

  function createBlankDoc(type) {
    var docType = type || 'INVOICE';
    var date = todayIso();
    return {
      id: makeId(),
      type: docType,
      number: generateDocNumber(docType, date),
      status: 'Draft',
      date: date,
      dueDate: docType === 'KWITANSI' ? date : addDaysIso(date, 14),
      clientName: '',
      clientPic: '',
      clientWa: '',
      clientEmail: '',
      clientAddress: '',
      items: [
        { desc: '', qty: 1, unit: 'Paket', price: 0 }
      ],
      discountValue: 0,
      discountType: 'percent',
      ppn: false,
      pph23: false,
      notes: 'Terima kasih atas kepercayaan dan kerja sama Anda.',
      showPaymentInfo: true,
      updatedAt: new Date().toISOString()
    };
  }

  /* ========================================================================
     DOM BINDING & INITIALIZATION
     ======================================================================== */
  function cacheDom() {
    els.viewTabs = document.querySelectorAll('.tab-btn');
    els.views = {
      editor: document.getElementById('view-editor'),
      history: document.getElementById('view-history'),
      profile: document.getElementById('view-profile')
    };
    els.historyCountBadge = document.getElementById('historyCountBadge');
    els.themeToggleBtn = document.getElementById('themeToggleBtn');
    els.exportCsvBtn = document.getElementById('exportCsvBtn');
    els.newDocBtn = document.getElementById('newDocBtn');

    // Editor controls
    els.editorModeTitle = document.getElementById('editorModeTitle');
    els.editorModeHint = document.getElementById('editorModeHint');
    els.saveStateBadge = document.getElementById('saveStateBadge');
    els.docTypeBtns = document.querySelectorAll('.doc-type-btn');
    els.docNumber = document.getElementById('docNumber');
    els.regenNumberBtn = document.getElementById('regenNumberBtn');
    els.docStatus = document.getElementById('docStatus');
    els.docDate = document.getElementById('docDate');
    els.docDueDate = document.getElementById('docDueDate');
    els.docDueLabel = document.getElementById('docDueLabel');
    els.clientName = document.getElementById('clientName');
    els.clientPic = document.getElementById('clientPic');
    els.clientWa = document.getElementById('clientWa');
    els.clientEmail = document.getElementById('clientEmail');
    els.clientAddress = document.getElementById('clientAddress');
    els.itemsEditorList = document.getElementById('itemsEditorList');
    els.addItemBtn = document.getElementById('addItemBtn');
    els.discountValue = document.getElementById('discountValue');
    els.discountType = document.getElementById('discountType');
    els.ppnToggle = document.getElementById('ppnToggle');
    els.pph23Toggle = document.getElementById('pph23Toggle');
    els.docNotes = document.getElementById('docNotes');
    els.showPaymentInfo = document.getElementById('showPaymentInfo');
    els.saveDocBtn = document.getElementById('saveDocBtn');
    els.duplicateDocBtn = document.getElementById('duplicateDocBtn');

    // Preview & Quick Actions
    els.previewTotalMini = document.getElementById('previewTotalMini');
    els.convertToInvoiceBtn = document.getElementById('convertToInvoiceBtn');
    els.markPaidKwitansiBtn = document.getElementById('markPaidKwitansiBtn');
    els.sendWaBtn = document.getElementById('sendWaBtn');
    els.printPdfBtn = document.getElementById('printPdfBtn');
    els.docPaper = document.getElementById('docPaper');

    // History view
    els.kpiPaidTotal = document.getElementById('kpiPaidTotal');
    els.kpiPaidCount = document.getElementById('kpiPaidCount');
    els.kpiPendingTotal = document.getElementById('kpiPendingTotal');
    els.kpiPendingCount = document.getElementById('kpiPendingCount');
    els.kpiOverdueTotal = document.getElementById('kpiOverdueTotal');
    els.kpiOverdueCount = document.getElementById('kpiOverdueCount');
    els.kpiDocCount = document.getElementById('kpiDocCount');
    els.kpiDocBreakdown = document.getElementById('kpiDocBreakdown');
    els.historySearch = document.getElementById('historySearch');
    els.historyTypeFilter = document.getElementById('historyTypeFilter');
    els.historyStatusFilter = document.getElementById('historyStatusFilter');
    els.resetDemoBtn = document.getElementById('resetDemoBtn');
    els.historyTableBody = document.getElementById('historyTableBody');
    els.historyEmptyState = document.getElementById('historyEmptyState');

    // Profile view
    els.profileForm = document.getElementById('profileForm');
    els.resetProfileBtn = document.getElementById('resetProfileBtn');
    els.profName = document.getElementById('profName');
    els.profTagline = document.getElementById('profTagline');
    els.profAddress = document.getElementById('profAddress');
    els.profPhone = document.getElementById('profPhone');
    els.profEmail = document.getElementById('profEmail');
    els.profNpwp = document.getElementById('profNpwp');
    els.profAccentColor = document.getElementById('profAccentColor');
    els.accentSwatches = document.querySelectorAll('.swatch-btn');
    els.profBankName = document.getElementById('profBankName');
    els.profBankAccount = document.getElementById('profBankAccount');
    els.profBankHolder = document.getElementById('profBankHolder');
    els.profQrisId = document.getElementById('profQrisId');
    els.profPaymentNote = document.getElementById('profPaymentNote');
    els.profSignName = document.getElementById('profSignName');
    els.profSignTitle = document.getElementById('profSignTitle');

    els.toastContainer = document.getElementById('toastContainer');
  }

  function showToast(msg) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    els.toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.2s ease';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    }, 2800);
  }

  /* ========================================================================
     THEME & NAVIGATION
     ======================================================================== */
  function syncThemeUi() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    els.themeToggleBtn.innerHTML = current === 'dark' ? SUN_ICON : MOON_ICON;
    els.themeToggleBtn.setAttribute('title', current === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap');
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, next);
    } catch (e) {}
    syncThemeUi();
  }

  function switchView(viewName) {
    state.activeView = viewName;
    els.viewTabs.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });
    Object.keys(els.views).forEach(function (k) {
      els.views[k].classList.toggle('active', k === viewName);
    });
    if (viewName === 'history') {
      renderHistory();
    } else if (viewName === 'profile') {
      populateProfileForm();
    } else if (viewName === 'editor') {
      renderPreview();
    }
  }

  function applyAccentColor() {
    var color = state.profile.accentColor || '#0d9488';
    document.documentElement.style.setProperty('--doc-accent', color);
  }

  /* ========================================================================
     EDITOR FORM SYNC
     ======================================================================== */
  function setDirty(isDirty) {
    state.dirty = isDirty;
    if (isDirty) {
      els.saveStateBadge.textContent = 'Belum Disimpan';
      els.saveStateBadge.classList.add('dirty');
    } else {
      els.saveStateBadge.textContent = 'Tersimpan';
      els.saveStateBadge.classList.remove('dirty');
    }
  }

  function isDocSaved(id) {
    return state.docs.some(function (d) { return d.id === id; });
  }

  function updateContextualControls() {
    var type = state.currentDoc.type;
    els.docTypeBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-doc-type') === type);
    });

    if (type === 'PENAWARAN') {
      els.docDueLabel.textContent = 'Berlaku Hingga';
      els.convertToInvoiceBtn.classList.remove('hidden');
      els.markPaidKwitansiBtn.classList.add('hidden');
    } else if (type === 'INVOICE') {
      els.docDueLabel.textContent = 'Jatuh Tempo';
      els.convertToInvoiceBtn.classList.add('hidden');
      els.markPaidKwitansiBtn.classList.remove('hidden');
    } else {
      els.docDueLabel.textContent = 'Tanggal Pembayaran';
      els.convertToInvoiceBtn.classList.add('hidden');
      els.markPaidKwitansiBtn.classList.add('hidden');
    }

    var exists = isDocSaved(state.currentDoc.id);
    els.editorModeTitle.textContent = exists ? 'Edit Dokumen' : 'Dokumen Baru';
    els.editorModeHint.textContent = exists
      ? 'Mengedit ' + (state.currentDoc.number || 'dokumen') + ' — klik Simpan untuk memperbarui riwayat'
      : 'Dokumen baru belum masuk arsip — klik Simpan Dokumen setelah selesai';
  }

  function loadDocIntoEditor(doc, isUnsavedNew) {
    state.currentDoc = cloneObj(doc);
    if (!Array.isArray(state.currentDoc.items) || state.currentDoc.items.length === 0) {
      state.currentDoc.items = [{ desc: '', qty: 1, unit: 'Paket', price: 0 }];
    }

    els.docNumber.value = state.currentDoc.number || '';
    els.docStatus.value = state.currentDoc.status || 'Draft';
    els.docDate.value = state.currentDoc.date || todayIso();
    els.docDueDate.value = state.currentDoc.dueDate || '';
    els.clientName.value = state.currentDoc.clientName || '';
    els.clientPic.value = state.currentDoc.clientPic || '';
    els.clientWa.value = state.currentDoc.clientWa || '';
    els.clientEmail.value = state.currentDoc.clientEmail || '';
    els.clientAddress.value = state.currentDoc.clientAddress || '';
    els.discountValue.value = state.currentDoc.discountValue != null ? state.currentDoc.discountValue : 0;
    els.discountType.value = state.currentDoc.discountType || 'percent';
    els.ppnToggle.checked = Boolean(state.currentDoc.ppn);
    els.pph23Toggle.checked = Boolean(state.currentDoc.pph23);
    els.docNotes.value = state.currentDoc.notes || '';
    els.showPaymentInfo.checked = state.currentDoc.showPaymentInfo !== false;

    renderItemsEditor();
    updateContextualControls();
    setDirty(Boolean(isUnsavedNew));
    renderPreview();
  }

  function renderItemsEditor() {
    var items = state.currentDoc.items;
    els.itemsEditorList.innerHTML = items.map(function (item, idx) {
      var lineTotal = Math.round((Number(item.qty) || 0) * (Number(item.price) || 0));
      return (
        '<div class="item-editor-row" data-item-index="' + idx + '">' +
          '<div class="item-row-top">' +
            '<span class="item-index">' + (idx + 1) + '</span>' +
            '<input type="text" class="input item-desc-input" data-field="desc" value="' + escapeHtml(item.desc) + '" placeholder="Deskripsi jasa atau produk...">' +
            '<button type="button" class="item-remove-btn" data-remove-idx="' + idx + '" title="Hapus baris">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="item-row-metrics">' +
            '<div class="item-mini-field">' +
              '<span>Qty</span>' +
              '<input type="number" class="input" data-field="qty" min="0" step="any" value="' + escapeHtml(item.qty) + '">' +
            '</div>' +
            '<div class="item-mini-field">' +
              '<span>Satuan</span>' +
              '<input type="text" class="input" data-field="unit" list="unitSuggestions" value="' + escapeHtml(item.unit || 'Paket') + '" placeholder="Paket">' +
            '</div>' +
            '<div class="item-mini-field">' +
              '<span>Harga Satuan (Rp)</span>' +
              '<input type="number" class="input" data-field="price" min="0" step="500" value="' + escapeHtml(item.price) + '">' +
            '</div>' +
          '</div>' +
          '<div class="item-line-total" data-line-total="' + idx + '">Subtotal: ' + formatRupiah(lineTotal) + '</div>' +
        '</div>'
      );
    }).join('');
  }

  function handleItemInput(e) {
    var row = e.target.closest('.item-editor-row');
    if (!row) return;
    var idx = parseInt(row.getAttribute('data-item-index'), 10);
    var field = e.target.getAttribute('data-field');
    if (isNaN(idx) || !field || !state.currentDoc.items[idx]) return;

    var val = e.target.value;
    if (field === 'qty' || field === 'price') {
      state.currentDoc.items[idx][field] = val === '' ? 0 : Number(val);
    } else {
      state.currentDoc.items[idx][field] = val;
    }

    var item = state.currentDoc.items[idx];
    var lineTotal = Math.round((Number(item.qty) || 0) * (Number(item.price) || 0));
    var totalEl = row.querySelector('[data-line-total]');
    if (totalEl) totalEl.textContent = 'Subtotal: ' + formatRupiah(lineTotal);

    setDirty(true);
    renderPreview();
  }

  function handleItemRemove(e) {
    var btn = e.target.closest('[data-remove-idx]');
    if (!btn) return;
    var idx = parseInt(btn.getAttribute('data-remove-idx'), 10);
    if (isNaN(idx)) return;

    if (state.currentDoc.items.length <= 1) {
      state.currentDoc.items[0] = { desc: '', qty: 1, unit: 'Paket', price: 0 };
    } else {
      state.currentDoc.items.splice(idx, 1);
    }
    renderItemsEditor();
    setDirty(true);
    renderPreview();
  }

  function bindEditorInputs() {
    els.docTypeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var nextType = btn.getAttribute('data-doc-type');
        if (state.currentDoc.type === nextType) return;
        state.currentDoc.type = nextType;

        // Auto-adjust document number prefix if it follows standard auto format or doc is unsaved
        var curNum = (els.docNumber.value || '').trim();
        if (!isDocSaved(state.currentDoc.id) || /^(INV|QUO|KWT)\/\d{4}\/\d{2}\/\d+$/.test(curNum) || curNum === '') {
          state.currentDoc.number = generateDocNumber(nextType, state.currentDoc.date);
          els.docNumber.value = state.currentDoc.number;
        }
        updateContextualControls();
        setDirty(true);
        renderPreview();
      });
    });

    els.regenNumberBtn.addEventListener('click', function () {
      state.currentDoc.number = generateDocNumber(state.currentDoc.type, state.currentDoc.date);
      els.docNumber.value = state.currentDoc.number;
      setDirty(true);
      renderPreview();
    });

    var fieldMap = [
      { el: els.docNumber, key: 'number' },
      { el: els.docStatus, key: 'status' },
      { el: els.docDate, key: 'date' },
      { el: els.docDueDate, key: 'dueDate' },
      { el: els.clientName, key: 'clientName' },
      { el: els.clientPic, key: 'clientPic' },
      { el: els.clientWa, key: 'clientWa' },
      { el: els.clientEmail, key: 'clientEmail' },
      { el: els.clientAddress, key: 'clientAddress' },
      { el: els.discountType, key: 'discountType' },
      { el: els.docNotes, key: 'notes' }
    ];

    fieldMap.forEach(function (m) {
      m.el.addEventListener('input', function () {
        state.currentDoc[m.key] = m.el.value;
        setDirty(true);
        renderPreview();
      });
      m.el.addEventListener('change', function () {
        state.currentDoc[m.key] = m.el.value;
        setDirty(true);
        renderPreview();
      });
    });

    els.discountValue.addEventListener('input', function () {
      state.currentDoc.discountValue = Math.max(0, Number(els.discountValue.value) || 0);
      setDirty(true);
      renderPreview();
    });

    els.ppnToggle.addEventListener('change', function () {
      state.currentDoc.ppn = els.ppnToggle.checked;
      setDirty(true);
      renderPreview();
    });

    els.pph23Toggle.addEventListener('change', function () {
      state.currentDoc.pph23 = els.pph23Toggle.checked;
      setDirty(true);
      renderPreview();
    });

    els.showPaymentInfo.addEventListener('change', function () {
      state.currentDoc.showPaymentInfo = els.showPaymentInfo.checked;
      setDirty(true);
      renderPreview();
    });

    els.addItemBtn.addEventListener('click', function () {
      state.currentDoc.items.push({ desc: '', qty: 1, unit: 'Paket', price: 0 });
      renderItemsEditor();
      setDirty(true);
      renderPreview();
      var inputs = els.itemsEditorList.querySelectorAll('.item-desc-input');
      if (inputs.length) inputs[inputs.length - 1].focus();
    });

    els.itemsEditorList.addEventListener('input', handleItemInput);
    els.itemsEditorList.addEventListener('click', handleItemRemove);
  }

  /* ========================================================================
     LIVE A4 DOCUMENT PREVIEW RENDERER
     ======================================================================== */
  function getInitials(name) {
    var words = String(name || 'DD').replace(/^(PT|CV|UD|Firma)\s+/i, '').trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return String(words[0] || 'DD').slice(0, 2).toUpperCase();
  }

  function buildStampSvg(doc) {
    var label = 'DRAFT';
    var sub = 'BELUM FINAL';
    var color = '#64748b';

    if (doc.status === 'Lunas') {
      label = 'LUNAS';
      sub = 'TERVERIFIKASI';
      color = '#059669';
    } else if (doc.status === 'Jatuh Tempo') {
      label = 'BELUM LUNAS';
      sub = 'JATUH TEMPO';
      color = '#dc2626';
    } else if (doc.status === 'Terkirim') {
      label = 'BELUM LUNAS';
      sub = doc.type === 'PENAWARAN' ? 'PENAWARAN RESMI' : 'MENUNGGU BAYAR';
      color = '#d97706';
    }

    return (
      '<div class="doc-stamp-overlay" aria-hidden="true">' +
        '<svg width="176" height="82" viewBox="0 0 176 82">' +
          '<rect x="3" y="3" width="170" height="76" rx="10" fill="rgba(255,255,255,0.72)" stroke="' + color + '" stroke-width="3.2"/>' +
          '<rect x="9" y="9" width="158" height="64" rx="6" fill="none" stroke="' + color + '" stroke-width="1.2" stroke-dasharray="4 3"/>' +
          '<text x="88" y="42" text-anchor="middle" fill="' + color + '" font-size="18" font-weight="900" font-family="sans-serif" letter-spacing="1.5">' + label + '</text>' +
          '<text x="88" y="61" text-anchor="middle" fill="' + color + '" font-size="9.5" font-weight="700" font-family="sans-serif" letter-spacing="1.4">' + sub + '</text>' +
        '</svg>' +
      '</div>'
    );
  }

  function buildQrisMiniSvg() {
    return (
      '<svg width="54" height="54" viewBox="0 0 27 27" shape-rendering="crispEdges" aria-hidden="true">' +
        '<rect width="27" height="27" fill="#ffffff"/>' +
        '<path fill="#0f172a" d="M1 1h7v7H1zm1 1v5h5V2zm1 1h3v3H3zM19 1h7v7h-7zm1 1v5h5V2zm1 1h3v3h-3zM1 19h7v7H1zm1 1v5h5v-5zm1 1h3v3H3z"/>' +
        '<path fill="#0f172a" d="M10 1h2v2h-2zm4 0h3v2h-3zm-2 3h3v2h-3zm-2 3h2v3h-2zm4 1h3v2h-3zM1 10h2v3H1zm4 0h3v2H5zm5 2h2v3h-2zm3 0h3v2h-3zm5-2h3v3h-3zm4 1h4v2h-4zm-4 4h2v3h-2zm4 0h3v2h-3zm-9 1h4v2h-4zm-6 0h3v2H7zm13 4h2v2h-2zm3 0h3v3h-3zm-7 1h3v2h-3zm-5 1h4v4h-4zm7 2h2v2h-2zm4 1h5v1h-5z"/>' +
      '</svg>'
    );
  }

  function renderPreview() {
    var doc = state.currentDoc;
    var prof = state.profile;
    var totals = calculateTotals(doc);
    var terbilang = terbilangRupiah(totals.grandTotal);
    var typeTitle = DOC_TYPE_TITLES[doc.type] || 'INVOICE';

    els.previewTotalMini.textContent = 'Total: ' + formatRupiah(totals.grandTotal);

    var dueLabel = doc.type === 'PENAWARAN'
      ? 'Berlaku s/d'
      : (doc.type === 'KWITANSI' ? 'Tgl. Pembayaran' : 'Jatuh Tempo');

    var partyTitle = doc.type === 'PENAWARAN'
      ? 'Penawaran Kepada'
      : (doc.type === 'KWITANSI' ? 'Telah Terima Dari' : 'Tagihan Kepada');

    var itemsRows = doc.items.map(function (item, idx) {
      var lineTotal = Math.round((Number(item.qty) || 0) * (Number(item.price) || 0));
      var desc = item.desc ? escapeHtml(item.desc) : '<span style="color:#94a3b8;font-style:italic">Item belum diisi</span>';
      return (
        '<tr>' +
          '<td class="center">' + (idx + 1) + '</td>' +
          '<td>' + desc + '</td>' +
          '<td class="center">' + escapeHtml(formatQty(item.qty)) + '</td>' +
          '<td class="center">' + escapeHtml(item.unit || '-') + '</td>' +
          '<td class="num">' + escapeHtml(formatRupiah(item.price)) + '</td>' +
          '<td class="num">' + escapeHtml(formatRupiah(lineTotal)) + '</td>' +
        '</tr>'
      );
    }).join('');

    var kwitansiBlock = '';
    if (doc.type === 'KWITANSI') {
      kwitansiBlock =
        '<div class="kwitansi-strip">' +
          '<div class="kwitansi-row">' +
            '<span class="kwitansi-key">Sudah Terima Dari</span>' +
            '<span class="kwitansi-val">' + escapeHtml(doc.clientName || 'Nama Klien / Pembayar') + (doc.clientPic ? ' (' + escapeHtml(doc.clientPic) + ')' : '') + '</span>' +
          '</div>' +
          '<div class="kwitansi-row">' +
            '<span class="kwitansi-key">Banyaknya Uang</span>' +
            '<span class="kwitansi-terbilang-pill"># ' + escapeHtml(terbilang) + ' #</span>' +
          '</div>' +
          '<div class="kwitansi-row">' +
            '<span class="kwitansi-key">Untuk Pembayaran</span>' +
            '<span class="kwitansi-val">' + escapeHtml((doc.items[0] && doc.items[0].desc) || 'Pembayaran jasa/barang sesuai rincian di bawah') + (doc.items.length > 1 ? ' (+' + (doc.items.length - 1) + ' item lainnya)' : '') + '</span>' +
          '</div>' +
        '</div>';
    }

    var discountLabel = doc.discountType === 'percent' && Number(doc.discountValue) > 0
      ? 'Diskon (' + escapeHtml(String(doc.discountValue)) + '%)'
      : 'Diskon';

    var totalsRows = '<tr><td>Subtotal</td><td>' + escapeHtml(formatRupiah(totals.subtotal)) + '</td></tr>';
    if (totals.discountAmount > 0) {
      totalsRows += '<tr class="deduction"><td>' + discountLabel + '</td><td>- ' + escapeHtml(formatRupiah(totals.discountAmount)) + '</td></tr>';
    }
    if (doc.ppn || doc.pph23) {
      totalsRows += '<tr><td>Dasar Pengenaan (DPP)</td><td>' + escapeHtml(formatRupiah(totals.dpp)) + '</td></tr>';
    }
    if (doc.ppn) {
      totalsRows += '<tr><td>PPN (11%)</td><td>+ ' + escapeHtml(formatRupiah(totals.ppnAmount)) + '</td></tr>';
    }
    if (doc.pph23) {
      totalsRows += '<tr class="deduction"><td>Potongan PPh 23 (2%)</td><td>- ' + escapeHtml(formatRupiah(totals.pph23Amount)) + '</td></tr>';
    }
    totalsRows += '<tr class="grand-total"><td>' + (doc.type === 'KWITANSI' ? 'Jumlah Diterima' : 'Total Akhir') + '</td><td>' + escapeHtml(formatRupiah(totals.grandTotal)) + '</td></tr>';

    var paymentHtml = '';
    if (doc.showPaymentInfo !== false) {
      paymentHtml =
        '<div class="doc-payment-card">' +
          '<div class="doc-qris-badge">' +
            buildQrisMiniSvg() +
            '<span class="doc-qris-label">QRIS READY</span>' +
          '</div>' +
          '<div class="doc-bank-details">' +
            '<strong>Informasi Pembayaran</strong><br>' +
            escapeHtml(prof.bankName || '-') + ' &middot; No. Rek: <span class="mono"><strong>' + escapeHtml(prof.bankAccount || '-') + '</strong></span><br>' +
            'a.n. ' + escapeHtml(prof.bankHolder || prof.name) +
            (prof.qrisMerchant ? ' &middot; QRIS: ' + escapeHtml(prof.qrisMerchant) : '') + '<br>' +
            '<span style="color:#64748b">' + escapeHtml(prof.paymentNote || '') + '</span>' +
          '</div>' +
        '</div>';
    } else {
      paymentHtml = '<div></div>';
    }

    els.docPaper.innerHTML =
      '<div class="doc-accent-bar"></div>' +
      '<div>' +
        '<header class="doc-header">' +
          '<div class="doc-company">' +
            '<div class="doc-logo">' + escapeHtml(getInitials(prof.name)) + '</div>' +
            '<div>' +
              '<h2 class="doc-company-name">' + escapeHtml(prof.name) + '</h2>' +
              (prof.tagline ? '<div class="doc-company-tag">' + escapeHtml(prof.tagline) + '</div>' : '') +
              '<div class="doc-company-meta">' +
                escapeHtml(prof.address) + '<br>' +
                'Telp/WA: ' + escapeHtml(prof.phone) + ' &middot; Email: ' + escapeHtml(prof.email) +
                (prof.npwp ? '<br>NPWP: <span class="mono">' + escapeHtml(prof.npwp) + '</span>' : '') +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="doc-title-block">' +
            '<div class="doc-type-heading">' + escapeHtml(typeTitle) + '</div>' +
            '<table class="doc-meta-table">' +
              '<tr><td class="doc-meta-label">No. Dokumen</td><td class="doc-meta-val mono">' + escapeHtml(doc.number || '-') + '</td></tr>' +
              '<tr><td class="doc-meta-label">Tanggal Terbit</td><td class="doc-meta-val">' + escapeHtml(formatDateId(doc.date)) + '</td></tr>' +
              '<tr><td class="doc-meta-label">' + escapeHtml(dueLabel) + '</td><td class="doc-meta-val">' + escapeHtml(formatDateId(doc.dueDate)) + '</td></tr>' +
            '</table>' +
          '</div>' +
        '</header>' +

        '<section class="doc-party-grid">' +
          '<div>' +
            '<div class="doc-party-label">' + escapeHtml(partyTitle) + '</div>' +
            '<div class="doc-client-name">' + escapeHtml(doc.clientName || 'Nama Perusahaan / Klien') + '</div>' +
            '<div class="doc-client-sub">' +
              (doc.clientPic ? 'Up. ' + escapeHtml(doc.clientPic) + '<br>' : '') +
              (doc.clientAddress ? escapeHtml(doc.clientAddress) + '<br>' : '') +
              (doc.clientWa ? 'WA: ' + escapeHtml(doc.clientWa) : '') +
              (doc.clientWa && doc.clientEmail ? ' &middot; ' : '') +
              (doc.clientEmail ? 'Email: ' + escapeHtml(doc.clientEmail) : '') +
            '</div>' +
          '</div>' +
          '<div class="doc-status-box">' +
            '<span class="doc-party-label" style="margin-bottom:0">Status Dokumen</span>' +
            '<span class="paper-status-badge ' + statusClass(doc.status) + '">' + escapeHtml(doc.status || 'Draft') + '</span>' +
          '</div>' +
        '</section>' +

        kwitansiBlock +

        '<table class="doc-items-table">' +
          '<thead>' +
            '<tr>' +
              '<th class="center" style="width:42px">No</th>' +
              '<th>Deskripsi Item / Jasa</th>' +
              '<th class="center" style="width:58px">Qty</th>' +
              '<th class="center" style="width:76px">Satuan</th>' +
              '<th class="num" style="width:128px">Harga Satuan</th>' +
              '<th class="num" style="width:136px">Jumlah</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + itemsRows + '</tbody>' +
        '</table>' +

        '<section class="doc-summary-grid">' +
          '<div>' +
            '<div class="doc-terbilang-box">' +
              '<div class="doc-terbilang-title">Terbilang</div>' +
              '<div class="doc-terbilang-text"># ' + escapeHtml(terbilang) + ' #</div>' +
            '</div>' +
            (doc.notes ? '<div class="doc-notes-box"><strong>Catatan &amp; Ketentuan:</strong>' + escapeHtml(doc.notes) + '</div>' : '') +
          '</div>' +
          '<div>' +
            '<table class="doc-totals-table">' + totalsRows + '</table>' +
          '</div>' +
        '</section>' +
      '</div>' +

      '<div>' +
        buildStampSvg(doc) +
        '<footer class="doc-bottom-grid">' +
          paymentHtml +
          '<div class="doc-signature-box">' +
            '<div class="doc-sign-city">Diterbitkan pada ' + escapeHtml(formatDateId(doc.date)) + '</div>' +
            '<div class="doc-sign-line">' + escapeHtml(prof.signName || prof.name) + '</div>' +
            '<div class="doc-sign-role">' + escapeHtml(prof.signTitle || 'Penerbit') + '</div>' +
          '</div>' +
        '</footer>' +
        '<div class="doc-paper-footer-note">' +
          '<span>Dokumen resmi diterbitkan oleh ' + escapeHtml(prof.name) + '</span>' +
          '<span class="mono">' + escapeHtml(doc.number || '') + '</span>' +
        '</div>' +
      '</div>';
  }

  /* ========================================================================
     1-CLICK WORKFLOW ACTIONS
     ======================================================================== */
  function upsertDoc(docObj) {
    var record = cloneObj(docObj);
    record.updatedAt = new Date().toISOString();
    var idx = state.docs.findIndex(function (d) { return d.id === record.id; });
    if (idx >= 0) {
      state.docs[idx] = record;
    } else {
      state.docs.unshift(record);
    }
    saveDocsStorage();
    updateHistoryBadge();
    return record;
  }

  function saveCurrentDoc() {
    if (!state.currentDoc.number || !state.currentDoc.number.trim()) {
      state.currentDoc.number = generateDocNumber(state.currentDoc.type, state.currentDoc.date);
      els.docNumber.value = state.currentDoc.number;
    }
    upsertDoc(state.currentDoc);
    setDirty(false);
    updateContextualControls();
    showToast('Dokumen ' + state.currentDoc.number + ' berhasil disimpan.');
  }

  function duplicateCurrentDoc() {
    var copy = cloneObj(state.currentDoc);
    var today = todayIso();
    copy.id = makeId();
    copy.status = 'Draft';
    copy.date = today;
    copy.dueDate = copy.type === 'KWITANSI' ? today : addDaysIso(today, 14);
    copy.number = generateDocNumber(copy.type, today);
    upsertDoc(copy);
    loadDocIntoEditor(copy, false);
    showToast('Dokumen diduplikasi sebagai Draft (' + copy.number + ').');
  }

  function convertPenawaranToInvoice() {
    if (state.currentDoc.type !== 'PENAWARAN') return;
    // Save source quote first so history stays consistent
    upsertDoc(state.currentDoc);

    var today = todayIso();
    var inv = cloneObj(state.currentDoc);
    var sourceNum = state.currentDoc.number || 'Penawaran';
    inv.id = makeId();
    inv.type = 'INVOICE';
    inv.status = 'Terkirim';
    inv.date = today;
    inv.dueDate = addDaysIso(today, 14);
    inv.number = generateDocNumber('INVOICE', today);
    inv.notes = 'Mengacu pada Penawaran Harga ' + sourceNum + '. ' + (inv.notes || '');

    upsertDoc(inv);
    loadDocIntoEditor(inv, false);
    showToast('Penawaran dikonversi menjadi Invoice ' + inv.number + '.');
  }

  function markPaidAndCreateKwitansi() {
    if (state.currentDoc.type !== 'INVOICE') return;
    var sourceInv = cloneObj(state.currentDoc);
    sourceInv.status = 'Lunas';
    upsertDoc(sourceInv);

    var today = todayIso();
    var kwt = cloneObj(sourceInv);
    kwt.id = makeId();
    kwt.type = 'KWITANSI';
    kwt.status = 'Lunas';
    kwt.date = today;
    kwt.dueDate = today;
    kwt.number = generateDocNumber('KWITANSI', today);
    kwt.notes = 'Pembayaran lunas atas Invoice ' + (sourceInv.number || '-') + '. Terima kasih atas pelunasan tepat waktu.';

    upsertDoc(kwt);
    loadDocIntoEditor(kwt, false);
    showToast('Invoice ditandai Lunas & Kwitansi ' + kwt.number + ' dibuat.');
  }

  function normalizeWaPhone(phone) {
    var digits = String(phone || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.indexOf('0') === 0) return '62' + digits.slice(1);
    if (digits.indexOf('8') === 0) return '62' + digits;
    return digits;
  }

  function sendWhatsApp(docObj) {
    var doc = docObj || state.currentDoc;
    var prof = state.profile;
    var totals = calculateTotals(doc);
    var terbilang = terbilangRupiah(totals.grandTotal);
    var title = DOC_TYPE_TITLES[doc.type] || 'DOKUMEN';
    var dueLabel = doc.type === 'PENAWARAN' ? 'Berlaku Hingga' : (doc.type === 'KWITANSI' ? 'Tanggal Pembayaran' : 'Jatuh Tempo');

    var lines = [
      '*' + title + ' — ' + (doc.number || '-') + '*',
      'Dari: ' + prof.name,
      'Kepada: ' + (doc.clientName || 'Pelanggan') + (doc.clientPic ? ' (' + doc.clientPic + ')' : ''),
      'Status: *' + (doc.status || 'Draft') + '*',
      'Tanggal Terbit: ' + formatDateId(doc.date),
      dueLabel + ': ' + formatDateId(doc.dueDate),
      '',
      '*Rincian Item:*'
    ];

    doc.items.forEach(function (it, i) {
      var lineAmt = Math.round((Number(it.qty) || 0) * (Number(it.price) || 0));
      lines.push((i + 1) + '. ' + (it.desc || 'Item') + ' (' + formatQty(it.qty) + ' ' + (it.unit || 'Unit') + ') = ' + formatRupiah(lineAmt));
    });

    lines.push('');
    lines.push('Subtotal: ' + formatRupiah(totals.subtotal));
    if (totals.discountAmount > 0) lines.push('Diskon: -' + formatRupiah(totals.discountAmount));
    if (doc.ppn) lines.push('PPN 11%: +' + formatRupiah(totals.ppnAmount));
    if (doc.pph23) lines.push('PPh 23 (2%): -' + formatRupiah(totals.pph23Amount));
    lines.push('*Total Akhir: ' + formatRupiah(totals.grandTotal) + '*');
    lines.push('_Terbilang: ' + terbilang + '_');

    if (doc.showPaymentInfo !== false && doc.type !== 'KWITANSI') {
      lines.push('');
      lines.push('*Rekening Pembayaran:*');
      lines.push(prof.bankName + ' — ' + prof.bankAccount + ' (a.n. ' + prof.bankHolder + ')');
    }

    if (doc.notes) {
      lines.push('');
      lines.push('Catatan: ' + doc.notes);
    }

    var waPhone = normalizeWaPhone(doc.clientWa);
    var baseUrl = waPhone ? 'https://wa.me/' + waPhone : 'https://wa.me/';
    var url = baseUrl + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /* ========================================================================
     HISTORY VIEW, KPI & CSV EXPORT
     ======================================================================== */
  function updateHistoryBadge() {
    els.historyCountBadge.textContent = String(state.docs.length);
  }

  function renderHistory() {
    var paidTotal = 0;
    var paidCount = 0;
    var pendingTotal = 0;
    var pendingCount = 0;
    var overdueTotal = 0;
    var overdueCount = 0;
    var invCount = 0;
    var quoCount = 0;
    var kwtCount = 0;

    state.docs.forEach(function (d) {
      var gt = calculateTotals(d).grandTotal;
      if (d.status === 'Lunas') {
        paidTotal += gt;
        paidCount += 1;
      } else if (d.status === 'Terkirim') {
        pendingTotal += gt;
        pendingCount += 1;
      } else if (d.status === 'Jatuh Tempo') {
        overdueTotal += gt;
        overdueCount += 1;
      }
      if (d.type === 'INVOICE') invCount += 1;
      else if (d.type === 'PENAWARAN') quoCount += 1;
      else if (d.type === 'KWITANSI') kwtCount += 1;
    });

    els.kpiPaidTotal.textContent = formatRupiah(paidTotal);
    els.kpiPaidCount.textContent = paidCount + ' dokumen lunas';
    els.kpiPendingTotal.textContent = formatRupiah(pendingTotal);
    els.kpiPendingCount.textContent = pendingCount + ' dokumen terkirim';
    els.kpiOverdueTotal.textContent = formatRupiah(overdueTotal);
    els.kpiOverdueCount.textContent = overdueCount + ' dokumen jatuh tempo';
    els.kpiDocCount.textContent = String(state.docs.length);
    els.kpiDocBreakdown.textContent = invCount + ' Invoice \u00b7 ' + quoCount + ' Penawaran \u00b7 ' + kwtCount + ' Kwitansi';

    var query = (els.historySearch.value || '').trim().toLowerCase();
    var typeFilter = els.historyTypeFilter.value;
    var statusFilter = els.historyStatusFilter.value;

    var filtered = state.docs.filter(function (d) {
      if (typeFilter !== 'ALL' && d.type !== typeFilter) return false;
      if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
      if (!query) return true;
      var haystack = [
        d.number, d.clientName, d.clientPic, d.clientEmail, d.notes,
        (d.items || []).map(function (i) { return i.desc; }).join(' ')
      ].join(' ').toLowerCase();
      return haystack.indexOf(query) !== -1;
    });

    if (filtered.length === 0) {
      els.historyTableBody.innerHTML = '';
      els.historyEmptyState.classList.remove('hidden');
      return;
    }

    els.historyEmptyState.classList.add('hidden');
    els.historyTableBody.innerHTML = filtered.map(function (d) {
      var total = calculateTotals(d).grandTotal;
      var typeCls = d.type === 'PENAWARAN' ? 'penawaran' : (d.type === 'KWITANSI' ? 'kwitansi' : 'invoice');
      return (
        '<tr data-doc-id="' + escapeHtml(d.id) + '">' +
          '<td>' +
            '<div class="mono" style="font-weight:700">' + escapeHtml(d.number) + '</div>' +
            '<div style="font-size:11.5px;color:var(--text-muted)">' + (d.items ? d.items.length : 0) + ' item</div>' +
          '</td>' +
          '<td><span class="type-chip ' + typeCls + '">' + escapeHtml(d.type) + '</span></td>' +
          '<td>' +
            '<div style="font-weight:600">' + escapeHtml(d.clientName || 'Tanpa Nama') + '</div>' +
            (d.clientPic ? '<div style="font-size:11.5px;color:var(--text-muted)">' + escapeHtml(d.clientPic) + '</div>' : '') +
          '</td>' +
          '<td>' +
            '<div>' + escapeHtml(formatDateId(d.date)) + '</div>' +
            '<div style="font-size:11.5px;color:var(--text-muted)">s/d ' + escapeHtml(formatDateId(d.dueDate)) + '</div>' +
          '</td>' +
          '<td class="text-right mono" style="font-weight:700">' + escapeHtml(formatRupiah(total)) + '</td>' +
          '<td><span class="status-chip ' + statusClass(d.status) + '">' + escapeHtml(d.status) + '</span></td>' +
          '<td class="text-right">' +
            '<div class="row-actions">' +
              '<button type="button" class="action-mini" data-hist-action="edit">Edit</button>' +
              '<button type="button" class="action-mini" data-hist-action="print">Cetak</button>' +
              '<button type="button" class="action-mini" data-hist-action="wa">WA</button>' +
              '<button type="button" class="action-mini danger" data-hist-action="delete">Hapus</button>' +
            '</div>' +
          '</td>' +
        '</tr>'
      );
    }).join('');
  }

  function handleHistoryAction(e) {
    var btn = e.target.closest('[data-hist-action]');
    if (!btn) return;
    var row = btn.closest('tr[data-doc-id]');
    if (!row) return;
    var docId = row.getAttribute('data-doc-id');
    var doc = state.docs.find(function (d) { return d.id === docId; });
    if (!doc) return;

    var action = btn.getAttribute('data-hist-action');
    if (action === 'edit') {
      loadDocIntoEditor(doc, false);
      switchView('editor');
      showToast('Membuka ' + doc.number + ' di editor.');
    } else if (action === 'print') {
      loadDocIntoEditor(doc, false);
      switchView('editor');
      setTimeout(function () { window.print(); }, 120);
    } else if (action === 'wa') {
      sendWhatsApp(doc);
    } else if (action === 'delete') {
      if (!window.confirm('Hapus dokumen ' + doc.number + ' secara permanen?')) return;
      state.docs = state.docs.filter(function (d) { return d.id !== docId; });
      saveDocsStorage();
      updateHistoryBadge();
      if (state.currentDoc && state.currentDoc.id === docId) {
        loadDocIntoEditor(state.docs[0] || createBlankDoc('INVOICE'), !state.docs.length);
      }
      renderHistory();
      showToast('Dokumen ' + doc.number + ' telah dihapus.');
    }
  }

  function csvCell(val) {
    var s = String(val == null ? '' : val).replace(/"/g, '""');
    return '"' + s + '"';
  }

  function exportCsv() {
    if (!state.docs.length) {
      showToast('Belum ada dokumen tersimpan untuk diekspor.');
      return;
    }
    var headers = [
      'No Dokumen', 'Jenis', 'Status', 'Tanggal Terbit', 'Jatuh Tempo / Berlaku',
      'Nama Klien', 'PIC', 'WhatsApp', 'Email', 'Jumlah Item',
      'Subtotal', 'Diskon', 'PPN 11%', 'PPh 23 (2%)', 'Total Akhir', 'Terbilang', 'Catatan'
    ];
    var rows = [headers.map(csvCell).join(',')];

    state.docs.forEach(function (d) {
      var t = calculateTotals(d);
      rows.push([
        d.number, d.type, d.status, d.date, d.dueDate,
        d.clientName, d.clientPic, d.clientWa, d.clientEmail, (d.items || []).length,
        t.subtotal, t.discountAmount, t.ppnAmount, t.pph23Amount, t.grandTotal,
        terbilangRupiah(t.grandTotal), d.notes
      ].map(csvCell).join(','));
    });

    var blob = new Blob(['\uFEFF' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'riwayat-invoice-kwitansi-' + todayIso() + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('File CSV berhasil diunduh (' + state.docs.length + ' dokumen).');
  }

  /* ========================================================================
     BUSINESS PROFILE VIEW
     ======================================================================== */
  function populateProfileForm() {
    var p = state.profile;
    els.profName.value = p.name || '';
    els.profTagline.value = p.tagline || '';
    els.profAddress.value = p.address || '';
    els.profPhone.value = p.phone || '';
    els.profEmail.value = p.email || '';
    els.profNpwp.value = p.npwp || '';
    els.profAccentColor.value = p.accentColor || '#0d9488';
    els.profBankName.value = p.bankName || '';
    els.profBankAccount.value = p.bankAccount || '';
    els.profBankHolder.value = p.bankHolder || '';
    els.profQrisId.value = p.qrisMerchant || '';
    els.profPaymentNote.value = p.paymentNote || '';
    els.profSignName.value = p.signName || '';
    els.profSignTitle.value = p.signTitle || '';

    els.accentSwatches.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-color') === els.profAccentColor.value);
    });
  }

  function bindProfileForm() {
    els.accentSwatches.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var color = btn.getAttribute('data-color');
        els.profAccentColor.value = color;
        state.profile.accentColor = color;
        applyAccentColor();
        els.accentSwatches.forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
      });
    });

    els.profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      state.profile = {
        name: els.profName.value.trim() || DEFAULT_PROFILE.name,
        tagline: els.profTagline.value.trim(),
        address: els.profAddress.value.trim(),
        phone: els.profPhone.value.trim(),
        email: els.profEmail.value.trim(),
        npwp: els.profNpwp.value.trim(),
        accentColor: els.profAccentColor.value || '#0d9488',
        bankName: els.profBankName.value.trim(),
        bankAccount: els.profBankAccount.value.trim(),
        bankHolder: els.profBankHolder.value.trim(),
        qrisMerchant: els.profQrisId.value.trim(),
        paymentNote: els.profPaymentNote.value.trim(),
        signName: els.profSignName.value.trim(),
        signTitle: els.profSignTitle.value.trim()
      };
      saveProfileStorage();
      applyAccentColor();
      renderPreview();
      showToast('Profil usaha berhasil disimpan & diperbarui pada dokumen.');
    });

    els.resetProfileBtn.addEventListener('click', function () {
      if (!window.confirm('Kembalikan profil usaha ke pengaturan bawaan demo?')) return;
      state.profile = cloneObj(DEFAULT_PROFILE);
      saveProfileStorage();
      applyAccentColor();
      populateProfileForm();
      renderPreview();
      showToast('Profil usaha dikembalikan ke bawaan.');
    });
  }

  /* ========================================================================
     GLOBAL EVENTS & BOOTSTRAP
     ======================================================================== */
  function bindGlobalEvents() {
    els.viewTabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchView(btn.getAttribute('data-view'));
      });
    });

    els.themeToggleBtn.addEventListener('click', toggleTheme);
    els.exportCsvBtn.addEventListener('click', exportCsv);

    els.newDocBtn.addEventListener('click', function () {
      var blank = createBlankDoc('INVOICE');
      loadDocIntoEditor(blank, true);
      switchView('editor');
      showToast('Membuat dokumen baru (' + blank.number + ').');
    });

    els.saveDocBtn.addEventListener('click', saveCurrentDoc);
    els.duplicateDocBtn.addEventListener('click', duplicateCurrentDoc);
    els.convertToInvoiceBtn.addEventListener('click', convertPenawaranToInvoice);
    els.markPaidKwitansiBtn.addEventListener('click', markPaidAndCreateKwitansi);
    els.sendWaBtn.addEventListener('click', function () { sendWhatsApp(state.currentDoc); });
    els.printPdfBtn.addEventListener('click', function () { window.print(); });

    els.historySearch.addEventListener('input', renderHistory);
    els.historyTypeFilter.addEventListener('change', renderHistory);
    els.historyStatusFilter.addEventListener('change', renderHistory);
    els.historyTableBody.addEventListener('click', handleHistoryAction);

    els.resetDemoBtn.addEventListener('click', function () {
      if (!window.confirm('Reset riwayat ke 4 dokumen contoh awal? Perubahan dokumen tersimpan sebelumnya akan diganti.')) return;
      state.docs = createSeedDocs();
      saveDocsStorage();
      updateHistoryBadge();
      loadDocIntoEditor(state.docs[0], false);
      renderHistory();
      showToast('4 dokumen contoh bisnis berhasil dimuat ulang.');
    });
  }

  function init() {
    cacheDom();
    loadStorage();
    syncThemeUi();
    applyAccentColor();
    updateHistoryBadge();
    bindEditorInputs();
    bindProfileForm();
    bindGlobalEvents();
    loadDocIntoEditor(state.docs[0] || createBlankDoc('INVOICE'), false);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
