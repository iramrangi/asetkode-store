/* ==========================================================================
   NusantaraVoyage Pro — Core Application Logic
   Zero-Config Offline Storage • Dynamic Seat Inventory • Price Calculator
   Printable A4 E-Voucher • ICS Calendar • Admin CRUD • CSV/JSON Portability
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'nv_travel_pro_state_v1';
  var THEME_KEY = 'nv_travel_theme_v1';
  var ADMIN_AUTH_KEY = 'nv_travel_admin_auth_v1';
  var SEED = window.TRAVEL_SEED_DATA;

  if (!SEED) {
    console.error('TRAVEL_SEED_DATA tidak ditemukan. Pastikan data.js dimuat sebelum app.js');
    return;
  }

  var state = {
    view: 'catalog',
    adminTab: 'bookings',
    lang: 'id',
    currency: 'IDR',
    theme: 'light',
    wishlistOnly: false,
    filters: {
      keyword: '',
      region: 'ALL',
      category: 'ALL',
      duration: 'ALL',
      budget: 'ALL',
      sort: 'popular'
    },
    activePackageId: null,
    activeDetailTab: 'overview',
    selectedDepartureByPkg: {},
    appliedPromoCode: '',
    currentVoucherCode: null,
    data: null
  };

  var ICONS = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
    voucher: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    xCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    utensils: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
    hotel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><path d="M8 7h.01"/><path d="M16 7h.01"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/></svg>'
  };

  var I18N = {
    id: {
      navCatalog: 'Katalog Paket',
      navLookup: 'Cek Booking & E-Tiket',
      navAdmin: 'Panel Admin Agen',
      heroEyebrow: 'Open Trip Pasti Berangkat & Private Custom Tour',
      heroTitle: 'Jelajahi Dunia & Nusantara dengan <span>Itinerary Matang</span> dan Harga Transparan',
      heroLead: 'Pesan paket wisata domestik maupun internasional langsung dengan kalkulator biaya real-time, skema DP 30%, e-voucher A4 otomatis, dan dukungan Tour Leader berpengalaman.',
      statTravelers: 'Peserta Puas Berangkat',
      statRating: 'Rating Ulasan Terverifikasi',
      statVoucher: 'E-Voucher & Harga Transparan',
      startFrom: 'Mulai dari',
      viewItinerary: 'Lihat Itinerary',
      bookNow: 'Pesan Sekarang',
      detailBtn: 'Detail',
      seatsLeft: 'kursi tersisa',
      soldOut: 'Penuh',
      perPax: '/ peserta',
      catalogHeading: 'Katalog Paket Wisata Pilihan',
      pillarsHeading: 'Keunggulan Layanan Biro Perjalanan',
      pillarsSub: 'Standar operasional profesional untuk liburan keluarga, bulan madu, hingga outing perusahaan.',
      reviewsHeading: 'Cerita & Ulasan Traveler Terverifikasi',
      lblKeyword: 'Cari Destinasi / Kata Kunci',
      lblRegion: 'Wilayah',
      lblDuration: 'Durasi',
      lblBudget: 'Maks. Budget / Org',
      lblSort: 'Urutkan'
    },
    en: {
      navCatalog: 'Tour Packages',
      navLookup: 'My Booking & E-Ticket',
      navAdmin: 'Agency Admin',
      heroEyebrow: 'Guaranteed Open Trips & Bespoke Private Tours',
      heroTitle: 'Explore Indonesia & the World with <span>Curated Itineraries</span> & Transparent Pricing',
      heroLead: 'Book domestic or international tour packages instantly with a live pricing calculator, 30% deposit option, instant printable A4 e-voucher, and dedicated Tour Coordinators.',
      statTravelers: 'Happy Travelers',
      statRating: 'Verified Guest Rating',
      statVoucher: 'Instant E-Voucher & Zero Hidden Fees',
      startFrom: 'Starting from',
      viewItinerary: 'View Itinerary',
      bookNow: 'Book Now',
      detailBtn: 'Details',
      seatsLeft: 'seats left',
      soldOut: 'Sold Out',
      perPax: '/ guest',
      catalogHeading: 'Curated Tour Package Catalog',
      pillarsHeading: 'Why Travel With Our Agency',
      pillarsSub: 'Reliable ground handling, Muslim-friendly dining options, and transparent instant pricing.',
      reviewsHeading: 'Verified Traveler Stories & Reviews',
      lblKeyword: 'Search Destination / Keyword',
      lblRegion: 'Region',
      lblDuration: 'Duration',
      lblBudget: 'Max Budget / Pax',
      lblSort: 'Sort By'
    }
  };

  /* ---------------- Utilities ---------------- */
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatMoney(idrAmount, usdAmount, forceCurrency) {
    var curr = forceCurrency || state.currency;
    if (curr === 'USD') {
      var valUsd = Number(usdAmount != null ? usdAmount : Math.round(Number(idrAmount || 0) / 15500));
      return '$' + valUsd.toLocaleString('en-US');
    }
    return 'Rp ' + Math.round(Number(idrAmount || 0)).toLocaleString('id-ID');
  }

  function formatDateIndo(dateStr) {
    if (!dateStr) return '-';
    var d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(state.lang === 'en' ? 'en-US' : 'id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function t(key) {
    var dict = I18N[state.lang] || I18N.id;
    return dict[key] || I18N.id[key] || key;
  }

  function showToast(msg) {
    var wrap = $('toastContainer');
    if (!wrap) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 3400);
  }

  function sanitizePhone(phone) {
    var digits = String(phone || '').replace(/\D+/g, '');
    if (digits.indexOf('0') === 0) digits = '62' + digits.slice(1);
    return digits;
  }

  function isAdminUnlocked() {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === '1';
    } catch (e) {
      return state.adminUnlocked === true;
    }
  }

  function setAdminUnlocked(unlocked) {
    state.adminUnlocked = Boolean(unlocked);
    try {
      if (unlocked) sessionStorage.setItem(ADMIN_AUTH_KEY, '1');
      else sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch (e) {}
  }

  function computeVoucherSignature(bk) {
    var raw = [bk.bookingCode, bk.packageId, bk.departureDate, bk.totalAmount, bk.paidAmount || 0, bk.status].join('|');
    var hash = 2166136261;
    for (var i = 0; i < raw.length; i++) {
      hash ^= raw.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return 'VRF-' + (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  }

  function clampInt(val, minVal, maxVal) {
    var n = parseInt(val, 10);
    if (isNaN(n)) n = minVal;
    return Math.min(maxVal, Math.max(minVal, n));
  }

  /* ---------------- Persistence ---------------- */
  function loadState() {
    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem(THEME_KEY);
    } catch (e) {}
    state.theme = savedTheme === 'dark' ? 'dark' : 'light';
    applyTheme(state.theme);

    var raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.packages) && parsed.settings) {
          state.data = {
            packages: parsed.packages,
            addons: parsed.addons || deepClone(SEED.addons),
            promos: parsed.promos || deepClone(SEED.promos),
            bookings: parsed.bookings || deepClone(SEED.bookings),
            reviews: parsed.reviews || deepClone(SEED.reviews),
            faqs: parsed.faqs || deepClone(SEED.faqs),
            wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
            settings: Object.assign(deepClone(SEED.settings), parsed.settings)
          };
          return;
        }
      } catch (err) {
        console.warn('Gagal mem-parse state tersimpan, kembali ke seed awal.', err);
      }
    }

    state.data = {
      packages: deepClone(SEED.packages),
      addons: deepClone(SEED.addons),
      promos: deepClone(SEED.promos),
      bookings: deepClone(SEED.bookings),
      reviews: deepClone(SEED.reviews),
      faqs: deepClone(SEED.faqs),
      wishlist: ['pkg-bali-01'],
      settings: deepClone(SEED.settings)
    };
    saveState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    } catch (e) {
      console.warn('localStorage penuh atau tidak tersedia:', e);
    }
  }

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
    var btn = $('themeToggleBtn');
    if (btn) btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
  }

  /* ---------------- Seat Inventory & Helpers ---------------- */
  function getSeatsBooked(packageId, departureId) {
    var total = 0;
    state.data.bookings.forEach(function (bk) {
      if (bk.packageId === packageId && bk.departureId === departureId && bk.status !== 'Dibatalkan') {
        total += Number(bk.adults || 0) + Number(bk.children || 0);
      }
    });
    return total;
  }

  function getDepartureRemaining(pkg, dep) {
    var booked = getSeatsBooked(pkg.id, dep.id);
    return Math.max(0, Number(dep.quota || 0) - booked);
  }

  function getPackageMinRemaining(pkg) {
    if (!pkg.departures || !pkg.departures.length) return 0;
    return pkg.departures.reduce(function (acc, dep) {
      return acc + getDepartureRemaining(pkg, dep);
    }, 0);
  }

  function getPkgById(pkgId) {
    return state.data.packages.find(function (p) { return p.id === pkgId; }) || null;
  }

  function getArtworkSvg(artKey) {
    return (SEED.artworks && SEED.artworks[artKey]) || SEED.artworks.bali;
  }

  /* ---------------- Agency Header & I18N Sync ---------------- */
  function syncAgencyBrandingAndI18n() {
    var s = state.data.settings;
    $('headerAgencyName').textContent = s.agencyName;
    $('headerAgencyTagline').textContent = s.agencyTagline;
    $('footerAgencyName').textContent = s.agencyName;
    $('footerAgencyAddress').textContent = s.address;
    $('footerBankInfo').textContent = s.bankName + ' • ' + s.bankAccount + ' a.n ' + s.bankHolder;
    $('footerIgInfo').textContent = 'Instagram: ' + (s.instagram || '-');
    $('bkBankInfo').textContent = s.bankName + ' • ' + s.bankAccount + ' (' + s.bankHolder + ')';

    var waNum = sanitizePhone(s.whatsapp);
    var waLink = $('topbarWaLink');
    waLink.href = 'https://wa.me/' + waNum;
    waLink.textContent = 'WA: +' + waNum;

    var mailLink = $('topbarEmailLink');
    mailLink.href = 'mailto:' + s.email;
    mailLink.textContent = s.email;

    $('heroEyebrow').textContent = t('heroEyebrow');
    $('heroTitle').innerHTML = t('heroTitle');
    $('heroLead').textContent = t('heroLead');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    $('currencyToggleBtn').textContent = state.currency;
    $('langToggleBtn').textContent = state.lang.toUpperCase();
    $('wishlistCount').textContent = String(state.data.wishlist.length);

    var pendingCount = state.data.bookings.filter(function (b) {
      return b.status === 'Menunggu Pembayaran';
    }).length;
    var badgeEl = $('adminPendingBadge');
    badgeEl.textContent = String(pendingCount);
    badgeEl.hidden = pendingCount === 0;
  }

  /* ---------------- View Navigation ---------------- */
  function switchView(viewName) {
    state.view = viewName;
    ['catalog', 'lookup', 'admin'].forEach(function (v) {
      var sec = $('view-' + v);
      if (sec) sec.hidden = v !== viewName;
    });
    document.querySelectorAll('.nav-tab[data-view]').forEach(function (btn) {
      var active = btn.getAttribute('data-view') === viewName;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (viewName === 'lookup') renderLookupQuickButtons();
    if (viewName === 'admin') {
      var unlocked = isAdminUnlocked();
      $('adminLockScreen').hidden = unlocked;
      $('adminContentWrap').hidden = !unlocked;
      if (unlocked) renderAdminDashboard();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- Catalog Render & Filtering ---------------- */
  function getFilteredPackages() {
    var f = state.filters;
    var kw = f.keyword.trim().toLowerCase();

    var list = state.data.packages.filter(function (pkg) {
      if (pkg.active === false) return false;
      if (state.wishlistOnly && state.data.wishlist.indexOf(pkg.id) === -1) return false;
      if (f.region !== 'ALL' && pkg.region !== f.region) return false;
      if (f.category !== 'ALL' && pkg.category !== f.category) return false;
      if (f.duration === 'short' && pkg.durationDays > 4) return false;
      if (f.duration === 'medium' && (pkg.durationDays < 5 || pkg.durationDays > 6)) return false;
      if (f.duration === 'long' && pkg.durationDays < 7) return false;
      if (f.budget !== 'ALL' && Number(pkg.priceIdr) > Number(f.budget)) return false;

      if (kw) {
        var hay = [
          pkg.code,
          pkg.title,
          pkg.titleEn,
          pkg.destination,
          pkg.category,
          pkg.region,
          pkg.summary
        ].join(' ').toLowerCase();
        if (hay.indexOf(kw) === -1) return false;
      }
      return true;
    });

    list.sort(function (a, b) {
      if (f.sort === 'price-asc') return a.priceIdr - b.priceIdr;
      if (f.sort === 'price-desc') return b.priceIdr - a.priceIdr;
      if (f.sort === 'duration-asc') return a.durationDays - b.durationDays;
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });

    return list;
  }

  function renderHeroFeatured() {
    var pkg = state.data.packages.find(function (p) { return p.active !== false; });
    if (!pkg) return;
    $('heroFeaturedArt').innerHTML = getArtworkSvg(pkg.artKey);
    $('heroFeaturedBadge').textContent = pkg.badge || pkg.category;
    $('heroFeaturedMeta').textContent = pkg.durationLabel + ' • ★ ' + pkg.rating;
    $('heroFeaturedTitle').textContent = state.lang === 'en' && pkg.titleEn ? pkg.titleEn : pkg.title;
    $('heroFeaturedPrice').textContent = formatMoney(pkg.priceIdr, pkg.priceUsd);
    $('heroFeaturedBtn').onclick = function () {
      openPackageDetail(pkg.id);
    };
  }

  function renderCatalog() {
    renderHeroFeatured();
    var pkgs = getFilteredPackages();
    var grid = $('packagesGrid');

    var infoParts = [];
    if (state.wishlistOnly) infoParts.push('Filter: Paket Favorit Tersimpan');
    infoParts.push(
      state.lang === 'en'
        ? 'Showing ' + pkgs.length + ' tour packages with live seat inventory.'
        : 'Menampilkan ' + pkgs.length + ' paket wisata dengan kuota kursi real-time.'
    );
    $('catalogResultInfo').textContent = infoParts.join(' • ');

    if (!pkgs.length) {
      grid.innerHTML = [
        '<div class="panel-card" style="grid-column:1/-1; text-align:center; padding:36px;">',
        '  <h3 style="margin:0 0 8px;">Tidak ada paket wisata yang cocok dengan filter Anda</h3>',
        '  <p style="margin:0 0 16px; color:var(--text-muted);">Coba ubah kata kunci pencarian atau reset filter untuk melihat semua paket tersedia.</p>',
        '  <button type="button" class="btn btn-primary btn-sm" id="emptyResetFiltersBtn">Reset Semua Filter</button>',
        '</div>'
      ].join('');
      var resetBtn = $('emptyResetFiltersBtn');
      if (resetBtn) resetBtn.onclick = resetAllFilters;
      return;
    }

    grid.innerHTML = pkgs.map(function (pkg) {
      var totalSeats = getPackageMinRemaining(pkg);
      var isSaved = state.data.wishlist.indexOf(pkg.id) !== -1;
      var title = state.lang === 'en' && pkg.titleEn ? pkg.titleEn : pkg.title;
      var summary = state.lang === 'en' && pkg.summaryEn ? pkg.summaryEn : pkg.summary;
      var seatBadgeClass = totalSeats <= 5 ? 'seat-pill low' : 'seat-pill';
      var seatLabel = totalSeats > 0 ? totalSeats + ' ' + t('seatsLeft') : t('soldOut');

      return [
        '<article class="tour-card" data-pkg-id="' + escapeHtml(pkg.id) + '">',
        '  <div class="tour-cover">',
        '    ' + getArtworkSvg(pkg.artKey),
        '    <div class="tour-cover-top">',
        '      <span class="cover-chip accent">' + escapeHtml(pkg.badge || pkg.category) + '</span>',
        '      <button type="button" class="wish-icon-btn ' + (isSaved ? 'active' : '') + '" data-action="wish" data-id="' + escapeHtml(pkg.id) + '" aria-label="Simpan Favorit">' + (isSaved ? ICONS.heartFill : ICONS.heart) + '</button>',
        '    </div>',
        '    <div class="tour-cover-bottom">',
        '      <span class="cover-chip">' + escapeHtml(pkg.region) + ' • ' + escapeHtml(pkg.durationLabel) + '</span>',
        '      <span class="' + seatBadgeClass + '">' + escapeHtml(seatLabel) + '</span>',
        '    </div>',
        '  </div>',
        '  <div class="tour-body">',
        '    <div class="tour-meta-row">',
        '      <span>' + ICONS.pin + ' ' + escapeHtml(pkg.destination) + '</span>',
        '      <span><span style="color:#f59e0b; display:inline-flex;">' + ICONS.star + '</span> ' + escapeHtml(pkg.rating) + ' (' + escapeHtml(pkg.reviewsCount) + ')</span>',
        '    </div>',
        '    <h3 class="tour-title">' + escapeHtml(title) + '</h3>',
        '    <p class="tour-desc">' + escapeHtml(summary) + '</p>',
        '    <div class="tour-highlights">',
        '      <span class="mini-tag">' + escapeHtml(pkg.category) + '</span>',
        '      <span class="mini-tag">' + escapeHtml(pkg.departures.length) + ' jadwal</span>',
        '      <span class="mini-tag">DP 30% OK</span>',
        '    </div>',
        '    <div class="tour-footer">',
        '      <div>',
        '        <span class="price-label">' + escapeHtml(t('startFrom')) + '</span>',
        '        <span class="price-value">' + escapeHtml(formatMoney(pkg.priceIdr, pkg.priceUsd)) + '</span>',
        '        <span style="font-size:0.74rem; color:var(--text-soft);">' + escapeHtml(t('perPax')) + '</span>',
        '      </div>',
        '      <div class="tour-actions">',
        '        <button type="button" class="btn btn-outline btn-sm" data-action="detail" data-id="' + escapeHtml(pkg.id) + '">' + escapeHtml(t('detailBtn')) + '</button>',
        '        <button type="button" class="btn btn-primary btn-sm" data-action="book" data-id="' + escapeHtml(pkg.id) + '">' + escapeHtml(t('bookNow')) + '</button>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderReviewsAndFaqs() {
    $('reviewsGrid').innerHTML = state.data.reviews.map(function (r) {
      return [
        '<article class="review-card">',
        '  <div class="review-stars">' + '★'.repeat(r.rating || 5) + '</div>',
        '  <p class="review-text">"' + escapeHtml(r.comment) + '"</p>',
        '  <div class="review-author">' + escapeHtml(r.name) + ' • ' + escapeHtml(r.city) + '</div>',
        '  <div class="review-trip">' + escapeHtml(r.pkgTitle) + ' (' + escapeHtml(r.date) + ')</div>',
        '</article>'
      ].join('');
    }).join('');

    $('faqList').innerHTML = state.data.faqs.map(function (item, idx) {
      return [
        '<div class="faq-item">',
        '  <button type="button" class="faq-q" data-faq-idx="' + idx + '">',
        '    <span>' + escapeHtml(item.q) + '</span>',
        '    <span>' + (idx === 0 ? '−' : '+') + '</span>',
        '  </button>',
        '  <div class="faq-a" ' + (idx === 0 ? '' : 'hidden') + '>' + escapeHtml(item.a) + '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function resetAllFilters() {
    state.wishlistOnly = false;
    state.filters = { keyword: '', region: 'ALL', category: 'ALL', duration: 'ALL', budget: 'ALL', sort: 'popular' };
    $('searchKeyword').value = '';
    $('searchRegion').value = 'ALL';
    $('searchDuration').value = 'ALL';
    $('searchBudget').value = 'ALL';
    $('searchSort').value = 'popular';
    document.querySelectorAll('#categoryPills .pill-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-cat') === 'ALL');
    });
    renderCatalog();
  }

  /* ---------------- Package Detail Modal ---------------- */
  function openPackageDetail(pkgId, initialTab) {
    var pkg = getPkgById(pkgId);
    if (!pkg) return;
    state.activePackageId = pkg.id;
    state.activeDetailTab = initialTab || 'overview';
    if (!state.selectedDepartureByPkg[pkg.id] && pkg.departures.length) {
      state.selectedDepartureByPkg[pkg.id] = pkg.departures[0].id;
    }

    $('detailCodeBadge').textContent = pkg.code + ' • ' + pkg.category;
    $('detailTitle').textContent = state.lang === 'en' && pkg.titleEn ? pkg.titleEn : pkg.title;
    $('detailFootPrice').textContent = formatMoney(pkg.priceIdr, pkg.priceUsd) + ' ' + t('perPax');

    document.querySelectorAll('#detailTabs .pill-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-dtab') === state.activeDetailTab);
    });

    renderPackageDetailBody();
    $('packageDetailModal').hidden = false;
  }

  function renderPackageDetailBody() {
    var pkg = getPkgById(state.activePackageId);
    if (!pkg) return;
    var tab = state.activeDetailTab;
    var body = $('detailBody');

    if (tab === 'overview') {
      var selectedDepId = state.selectedDepartureByPkg[pkg.id] || (pkg.departures[0] && pkg.departures[0].id);
      var depRows = pkg.departures.map(function (dep) {
        var rem = getDepartureRemaining(pkg, dep);
        var active = dep.id === selectedDepId;
        return [
          '<button type="button" class="pill-btn ' + (active ? 'active' : '') + '" data-select-dep="' + escapeHtml(dep.id) + '" style="text-align:left; border-radius:12px; padding:10px 14px;">',
          '  <strong style="display:block;">' + escapeHtml(formatDateIndo(dep.date)) + ' → ' + escapeHtml(formatDateIndo(dep.endDate)) + '</strong>',
          '  <span style="font-size:0.78rem; opacity:0.9;">' + escapeHtml(dep.status) + ' • Sisa ' + rem + ' / ' + dep.quota + ' kursi</span>',
          '</button>'
        ].join('');
      }).join('');

      var tiersHtml = (pkg.hotelTiers || []).map(function (tier) {
        var addonText = tier.deltaIdr > 0 ? '+' + formatMoney(tier.deltaIdr, tier.deltaUsd) : 'Termasuk Harga Dasar';
        return '<li style="display:flex; justify-content:space-between; gap:10px; padding:6px 0; border-bottom:1px dashed var(--border);"><span>🏨 ' + escapeHtml(tier.name) + '</span><strong>' + escapeHtml(addonText) + '</strong></li>';
      }).join('');

      body.innerHTML = [
        '<div class="detail-layout">',
        '  <div>',
        '    <div style="border-radius:16px; overflow:hidden; margin-bottom:14px; border:1px solid var(--border);">' + getArtworkSvg(pkg.artKey) + '</div>',
        '    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">',
        '      <span class="badge badge-primary">' + ICONS.pin + ' ' + escapeHtml(pkg.destination) + '</span>',
        '      <span class="badge badge-neutral">' + ICONS.clock + ' ' + escapeHtml(pkg.durationLabel) + '</span>',
        '      <span class="badge badge-accent">' + ICONS.star + ' ' + escapeHtml(pkg.rating) + ' (' + pkg.reviewsCount + ' ulasan)</span>',
        '    </div>',
        '    <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">' + escapeHtml(state.lang === 'en' && pkg.summaryEn ? pkg.summaryEn : pkg.summary) + '</p>',
        '  </div>',
        '  <div style="display:grid; gap:14px; align-content:start;">',
        '    <div>',
        '      <h4 style="margin:0 0 8px;">Highlight Pengalaman</h4>',
        '      <ul style="margin:0; padding-left:18px; display:grid; gap:5px; font-size:0.88rem;">' + (pkg.highlights || []).map(function (h) { return '<li>' + escapeHtml(h) + '</li>'; }).join('') + '</ul>',
        '    </div>',
        '    <div>',
        '      <h4 style="margin:0 0 8px;">Pilih Jadwal Keberangkatan Tersedia</h4>',
        '      <div style="display:grid; gap:8px;">' + depRows + '</div>',
        '    </div>',
        '    <div>',
        '      <h4 style="margin:0 0 6px;">Pilihan Kelas Hotel / Kabin</h4>',
        '      <ul style="margin:0; padding:0; list-style:none; font-size:0.86rem;">' + tiersHtml.replace(/🏨 /g, '<span style="display:inline-flex;vertical-align:-2px;margin-right:6px;color:var(--primary);">' + ICONS.hotel + '</span>') + '</ul>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    if (tab === 'itinerary') {
      body.innerHTML = '<div class="itinerary-timeline">' + (pkg.itinerary || []).map(function (d) {
        return [
          '<div class="itinerary-day">',
          '  <div class="itinerary-day-head">',
          '    <span>Hari ke-' + escapeHtml(d.day) + ': ' + escapeHtml(d.title) + '</span>',
          '    <span class="badge badge-neutral">' + ICONS.utensils + ' ' + escapeHtml(d.meals || '-') + ' • ' + ICONS.hotel + ' ' + escapeHtml(d.hotel || '-') + '</span>',
          '  </div>',
          '  <p>' + escapeHtml(d.desc) + '</p>',
          '</div>'
        ].join('');
      }).join('') + '</div>';
      return;
    }

    body.innerHTML = [
      '<div class="detail-layout">',
      '  <div class="summary-box">',
      '    <h4 style="margin:0 0 10px; color:var(--success); display:flex; align-items:center; gap:6px;">' + ICONS.checkCircle + ' Sudah Termasuk (Included)</h4>',
      '    <ul style="margin:0; padding-left:18px; display:grid; gap:7px; font-size:0.88rem;">' + (pkg.includes || []).map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>',
      '  </div>',
      '  <div class="summary-box">',
      '    <h4 style="margin:0 0 10px; color:var(--danger); display:flex; align-items:center; gap:6px;">' + ICONS.xCircle + ' Belum Termasuk (Excluded)</h4>',
      '    <ul style="margin:0; padding-left:18px; display:grid; gap:7px; font-size:0.88rem;">' + (pkg.excludes || []).map(function (e) { return '<li>' + escapeHtml(e) + '</li>'; }).join('') + '</ul>',
      '  </div>',
      '</div>'
    ].join('');
  }

  /* ---------------- Booking Modal & Live Pricing Calculator ---------------- */
  function openBookingModal(pkgId) {
    var activePkgs = state.data.packages.filter(function (p) { return p.active !== false; });
    if (!activePkgs.length) return;

    $('bkPackageId').innerHTML = activePkgs.map(function (p) {
      return '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.code + ' — ' + p.title) + '</option>';
    }).join('');

    var chosenId = pkgId || state.activePackageId || activePkgs[0].id;
    $('bkPackageId').value = chosenId;
    state.appliedPromoCode = '';
    $('bkPromoCode').value = '';
    $('bkPromoFeedback').textContent = '';

    populateBookingPackageOptions();
    recalculateBookingTotals();
    $('bookingModal').hidden = false;
  }

  function populateBookingPackageOptions() {
    var pkg = getPkgById($('bkPackageId').value);
    if (!pkg) return;

    var preferredDep = state.selectedDepartureByPkg[pkg.id];
    var depList = pkg.departures || [];
    $('bkDepartureId').innerHTML = depList.map(function (dep) {
      var rem = getDepartureRemaining(pkg, dep);
      var disabledAttr = rem <= 0 ? ' disabled' : '';
      var suffix = rem <= 0 ? 'PENUH' : ('Sisa ' + rem + ' kursi');
      return '<option value="' + escapeHtml(dep.id) + '"' + disabledAttr + '>' + escapeHtml(formatDateIndo(dep.date) + ' (' + dep.status + ' • ' + suffix + ')') + '</option>';
    }).join('');
    if (preferredDep) {
      var prefObj = depList.find(function (d) { return d.id === preferredDep; });
      if (prefObj && getDepartureRemaining(pkg, prefObj) > 0) $('bkDepartureId').value = preferredDep;
    }
    if (!$('bkDepartureId').value || ($('bkDepartureId').selectedOptions[0] && $('bkDepartureId').selectedOptions[0].disabled)) {
      var firstAvail = depList.find(function (d) { return getDepartureRemaining(pkg, d) > 0; });
      if (firstAvail) $('bkDepartureId').value = firstAvail.id;
    }

    $('bkHotelTier').innerHTML = (pkg.hotelTiers || []).map(function (tier) {
      var delta = tier.deltaIdr > 0 ? ' (+' + formatMoney(tier.deltaIdr, tier.deltaUsd) + '/org)' : ' (Harga Dasar)';
      return '<option value="' + escapeHtml(tier.id) + '">' + escapeHtml(tier.name + delta) + '</option>';
    }).join('');

    $('bkAddonsList').innerHTML = state.data.addons.map(function (ad) {
      var unitLabel = ad.perPax ? '/peserta' : '/booking';
      return [
        '<label style="display:flex; align-items:center; justify-content:space-between; gap:10px; border:1px solid var(--border); padding:9px 12px; border-radius:10px; cursor:pointer; background:var(--surface-alt);">',
        '  <span style="display:flex; align-items:center; gap:8px; font-size:0.86rem; font-weight:600;">',
        '    <input type="checkbox" class="bk-addon-cb" value="' + escapeHtml(ad.id) + '">',
        '    <span>' + escapeHtml(ad.name) + '</span>',
        '  </span>',
        '  <strong style="font-size:0.82rem; color:var(--primary);">' + escapeHtml(formatMoney(ad.priceIdr, ad.priceUsd) + ' ' + unitLabel) + '</strong>',
        '</label>'
      ].join('');
    }).join('');

    document.querySelectorAll('.bk-addon-cb').forEach(function (cb) {
      cb.addEventListener('change', recalculateBookingTotals);
    });
  }

  function calculatePricingSnapshot() {
    var pkg = getPkgById($('bkPackageId').value);
    if (!pkg) return null;

    var adults = clampInt($('bkAdults').value, 1, 100);
    var children = clampInt($('bkChildren').value, 0, 50);
    var singleRooms = clampInt($('bkSingleRooms').value, 0, 50);
    var totalPax = adults + children;

    var tierId = $('bkHotelTier').value;
    var tier = (pkg.hotelTiers || []).find(function (tr) { return tr.id === tierId; }) || (pkg.hotelTiers && pkg.hotelTiers[0]) || { name: 'Standard', deltaIdr: 0, deltaUsd: 0 };

    var adultTotalIdr = adults * (Number(pkg.priceIdr) + Number(tier.deltaIdr || 0));
    var adultTotalUsd = adults * (Number(pkg.priceUsd) + Number(tier.deltaUsd || 0));

    var childTotalIdr = children * (Number(pkg.childPriceIdr || pkg.priceIdr) + Number(tier.deltaIdr || 0));
    var childTotalUsd = children * (Number(pkg.childPriceUsd || pkg.priceUsd) + Number(tier.deltaUsd || 0));

    var singleIdr = singleRooms * Number(pkg.singleSuppIdr || 0);
    var singleUsd = singleRooms * Number(pkg.singleSuppUsd || 0);

    var addonsIdr = 0;
    var addonsUsd = 0;
    var selectedAddonIds = [];
    document.querySelectorAll('.bk-addon-cb:checked').forEach(function (cb) {
      var ad = state.data.addons.find(function (a) { return a.id === cb.value; });
      if (!ad) return;
      selectedAddonIds.push(ad.id);
      var mult = ad.perPax ? totalPax : 1;
      addonsIdr += Number(ad.priceIdr) * mult;
      addonsUsd += Number(ad.priceUsd) * mult;
    });

    var subtotalIdr = adultTotalIdr + childTotalIdr + singleIdr + addonsIdr;
    var subtotalUsd = adultTotalUsd + childTotalUsd + singleUsd + addonsUsd;

    var discountIdr = 0;
    var discountUsd = 0;
    var validPromo = null;
    if (state.appliedPromoCode) {
      validPromo = state.data.promos.find(function (pr) {
        return pr.active !== false && pr.code.toUpperCase() === state.appliedPromoCode.toUpperCase();
      });
      if (validPromo && totalPax >= Number(validPromo.minPax || 1)) {
        if (validPromo.type === 'percent') {
          var pctRate = Math.min(90, Math.max(0, Number(validPromo.value || 0)));
          discountIdr = Math.round(subtotalIdr * (pctRate / 100));
          discountUsd = Math.round(subtotalUsd * (pctRate / 100));
        } else {
          discountIdr = Math.max(0, Math.min(subtotalIdr, Number(validPromo.valueIdr || 0)));
          discountUsd = Math.max(0, Math.min(subtotalUsd, Number(validPromo.valueUsd || 0)));
        }
      }
    }

    var totalIdr = Math.max(0, subtotalIdr - discountIdr);
    var totalUsd = Math.max(0, subtotalUsd - discountUsd);
    var plan = $('bkPaymentPlan').value;
    var payNowIdr = plan === 'dp' ? Math.round(totalIdr * 0.3) : totalIdr;
    var payNowUsd = plan === 'dp' ? Math.round(totalUsd * 0.3) : totalUsd;

    return {
      pkg: pkg,
      dep: (pkg.departures || []).find(function (d) { return d.id === $('bkDepartureId').value; }) || pkg.departures[0],
      tier: tier,
      adults: adults,
      children: children,
      singleRooms: singleRooms,
      totalPax: totalPax,
      selectedAddonIds: selectedAddonIds,
      adultTotalIdr: adultTotalIdr,
      adultTotalUsd: adultTotalUsd,
      childTotalIdr: childTotalIdr,
      childTotalUsd: childTotalUsd,
      singleIdr: singleIdr,
      singleUsd: singleUsd,
      addonsIdr: addonsIdr,
      addonsUsd: addonsUsd,
      subtotalIdr: subtotalIdr,
      subtotalUsd: subtotalUsd,
      promo: validPromo,
      discountIdr: discountIdr,
      discountUsd: discountUsd,
      totalIdr: totalIdr,
      totalUsd: totalUsd,
      plan: plan,
      payNowIdr: payNowIdr,
      payNowUsd: payNowUsd,
      remainingIdr: Math.max(0, totalIdr - payNowIdr),
      remainingUsd: Math.max(0, totalUsd - payNowUsd)
    };
  }

  function recalculateBookingTotals() {
    var calc = calculatePricingSnapshot();
    if (!calc) return;

    var lines = [
      '<div class="summary-line"><span>Dewasa (' + calc.adults + ' pax)</span><strong>' + escapeHtml(formatMoney(calc.adultTotalIdr, calc.adultTotalUsd)) + '</strong></div>'
    ];
    if (calc.children > 0) {
      lines.push('<div class="summary-line"><span>Anak-anak (' + calc.children + ' pax)</span><strong>' + escapeHtml(formatMoney(calc.childTotalIdr, calc.childTotalUsd)) + '</strong></div>');
    }
    if (calc.singleRooms > 0) {
      lines.push('<div class="summary-line"><span>Single Supplement (' + calc.singleRooms + ' kmr)</span><strong>' + escapeHtml(formatMoney(calc.singleIdr, calc.singleUsd)) + '</strong></div>');
    }
    if (calc.addonsIdr > 0) {
      lines.push('<div class="summary-line"><span>Layanan Add-On (' + calc.selectedAddonIds.length + ' item)</span><strong>' + escapeHtml(formatMoney(calc.addonsIdr, calc.addonsUsd)) + '</strong></div>');
    }
    if (calc.discountIdr > 0) {
      lines.push('<div class="summary-line" style="color:var(--success);"><span>Promo (' + escapeHtml(calc.promo.code) + ')</span><strong>−' + escapeHtml(formatMoney(calc.discountIdr, calc.discountUsd)) + '</strong></div>');
    }

    $('bkPriceBreakdown').innerHTML = lines.join('');
    $('bkTotalDue').textContent = formatMoney(calc.totalIdr, calc.totalUsd);
    $('bkPayNowLabel').textContent = formatMoney(calc.payNowIdr, calc.payNowUsd);
    $('bkRemainingLabel').textContent = formatMoney(calc.remainingIdr, calc.remainingUsd);
  }

  function handleApplyPromo() {
    var code = $('bkPromoCode').value.trim().toUpperCase();
    var fb = $('bkPromoFeedback');
    if (!code) {
      state.appliedPromoCode = '';
      fb.textContent = '';
      recalculateBookingTotals();
      return;
    }

    var totalPax = Math.max(1, Number($('bkAdults').value || 1)) + Math.max(0, Number($('bkChildren').value || 0));
    var promo = state.data.promos.find(function (pr) {
      return pr.active !== false && pr.code.toUpperCase() === code;
    });

    if (!promo) {
      state.appliedPromoCode = '';
      fb.style.color = 'var(--danger)';
      fb.textContent = 'Kode promo tidak ditemukan atau sudah tidak aktif.';
    } else if (totalPax < Number(promo.minPax || 1)) {
      state.appliedPromoCode = '';
      fb.style.color = 'var(--warning)';
      fb.textContent = 'Promo ' + promo.code + ' membutuhkan minimal ' + promo.minPax + ' peserta.';
    } else {
      state.appliedPromoCode = promo.code;
      fb.style.color = 'var(--success)';
      fb.textContent = 'Kode ' + promo.code + ' diterapkan: ' + promo.desc;
    }
    recalculateBookingTotals();
  }

  function handleBookingSubmit(ev) {
    ev.preventDefault();
    var calc = calculatePricingSnapshot();
    if (!calc || !calc.dep) return;

    var remainingSeats = getDepartureRemaining(calc.pkg, calc.dep);
    if (calc.totalPax > remainingSeats) {
      showToast('Maaf, sisa kursi tanggal ' + formatDateIndo(calc.dep.date) + ' hanya ' + remainingSeats + ' kursi.');
      return;
    }

    var newCode = 'TRV-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
    var curr = state.currency;
    var isUsd = curr === 'USD';

    var bookingRecord = {
      bookingCode: newCode,
      createdAt: new Date().toISOString(),
      packageId: calc.pkg.id,
      packageTitle: calc.pkg.title,
      departureId: calc.dep.id,
      departureDate: calc.dep.date,
      endDate: calc.dep.endDate,
      hotelTierName: calc.tier.name,
      adults: calc.adults,
      children: calc.children,
      singleRooms: calc.singleRooms,
      addons: calc.selectedAddonIds,
      promoCode: calc.promo ? calc.promo.code : '',
      currency: curr,
      subtotal: isUsd ? calc.subtotalUsd : calc.subtotalIdr,
      discountAmount: isUsd ? calc.discountUsd : calc.discountIdr,
      totalAmount: isUsd ? calc.totalUsd : calc.totalIdr,
      paymentPlan: calc.plan,
      paidAmount: 0,
      status: 'Menunggu Pembayaran',
      customerName: $('bkCustName').value.trim(),
      customerEmail: $('bkCustEmail').value.trim(),
      customerPhone: sanitizePhone($('bkCustPhone').value.trim()),
      notes: $('bkNotes').value.trim()
    };

    state.data.bookings.unshift(bookingRecord);
    saveState();
    syncAgencyBrandingAndI18n();
    renderCatalog();

    $('bookingModal').hidden = true;
    $('packageDetailModal').hidden = true;
    $('bookingForm').reset();
    $('bkAdults').value = '2';
    $('bkChildren').value = '0';
    $('bkSingleRooms').value = '0';

    showToast('Booking ' + newCode + ' berhasil diterbitkan!');
    openVoucherModal(newCode);
  }

  /* ---------------- E-Voucher A4 Print & .ICS Calendar ---------------- */
  function openVoucherModal(bookingCode) {
    var bk = state.data.bookings.find(function (b) { return b.bookingCode === bookingCode; });
    if (!bk) return;
    state.currentVoucherCode = bk.bookingCode;
    var pkg = getPkgById(bk.packageId);
    var s = state.data.settings;
    var isUsd = bk.currency === 'USD';

    function fmtBk(val) {
      return isUsd ? formatMoney(0, val, 'USD') : formatMoney(val, 0, 'IDR');
    }

    var stampClass = 'voucher-stamp pending';
    if (bk.status === 'Lunas' || bk.status === 'Selesai') stampClass = 'voucher-stamp';
    else if (bk.status === 'DP Terkonfirmasi') stampClass = 'voucher-stamp dp';

    var payTargetNow = bk.paymentPlan === 'dp' ? Math.round(bk.totalAmount * 0.3) : bk.totalAmount;
    var remainingBalance = Math.max(0, Number(bk.totalAmount) - Number(bk.paidAmount || 0));

    var itinSummary = pkg && pkg.itinerary
      ? pkg.itinerary.slice(0, 5).map(function (d) {
        return '<tr><td><strong>Hari ' + escapeHtml(d.day) + '</strong></td><td>' + escapeHtml(d.title) + '</td><td>' + escapeHtml(d.meals || '-') + '</td></tr>';
      }).join('')
      : '<tr><td colspan="3">Sesuai jadwal resmi Tour Coordinator</td></tr>';

    $('voucherSheet').innerHTML = [
      '<div class="voucher-header">',
      '  <div>',
      '    <h2 style="margin:0 0 4px; color:#0f172a;">' + escapeHtml(s.agencyName) + '</h2>',
      '    <p style="margin:0; font-size:0.82rem; color:#475569;">' + escapeHtml(s.address) + '</p>',
      '    <p style="margin:2px 0 0; font-size:0.82rem; color:#475569;">WA: +' + escapeHtml(sanitizePhone(s.whatsapp)) + ' • ' + escapeHtml(s.email) + '</p>',
      '  </div>',
      '  <div style="text-align:right;">',
      '    <div style="font-size:0.75rem; text-transform:uppercase; color:#64748b; font-weight:700;">E-Voucher &amp; Invoice Resmi</div>',
      '    <div style="font-size:1.3rem; font-weight:900; color:#0d9488; margin:2px 0 4px;">' + escapeHtml(bk.bookingCode) + '</div>',
      '    <div style="font-size:0.74rem; font-family:monospace; color:#334155; margin-bottom:6px;">Kode Verifikasi: <strong>' + escapeHtml(computeVoucherSignature(bk)) + '</strong></div>',
      '    <span class="' + stampClass + '">' + escapeHtml(bk.status) + '</span>',
      '  </div>',
      '</div>',
      '<div class="voucher-grid">',
      '  <div class="voucher-box">',
      '    <h4>Data Pemesan / Lead Traveler</h4>',
      '    <div><strong>Nama:</strong> ' + escapeHtml(bk.customerName) + '</div>',
      '    <div><strong>WhatsApp:</strong> +' + escapeHtml(bk.customerPhone) + '</div>',
      '    <div><strong>Email:</strong> ' + escapeHtml(bk.customerEmail) + '</div>',
      '    <div><strong>Catatan:</strong> ' + escapeHtml(bk.notes || '-') + '</div>',
      '  </div>',
      '  <div class="voucher-box">',
      '    <h4>Detail Perjalanan &amp; Kuota</h4>',
      '    <div><strong>Paket:</strong> ' + escapeHtml(bk.packageTitle) + '</div>',
      '    <div><strong>Berangkat:</strong> ' + escapeHtml(formatDateIndo(bk.departureDate)) + ' → ' + escapeHtml(formatDateIndo(bk.endDate)) + '</div>',
      '    <div><strong>Akomodasi:</strong> ' + escapeHtml(bk.hotelTierName) + '</div>',
      '    <div><strong>Peserta:</strong> ' + bk.adults + ' Dewasa' + (bk.children ? ', ' + bk.children + ' Anak' : '') + (bk.singleRooms ? ', ' + bk.singleRooms + ' Single Room' : '') + '</div>',
      '  </div>',
      '</div>',
      '<div class="voucher-box" style="margin-bottom:16px;">',
      '  <h4>Rincian Tagihan &amp; Status Pembayaran</h4>',
      '  <div style="display:flex; justify-content:space-between; padding:4px 0;"><span>Subtotal Paket &amp; Layanan Tambahan</span><strong>' + escapeHtml(fmtBk(bk.subtotal)) + '</strong></div>',
      (bk.discountAmount > 0 ? '<div style="display:flex; justify-content:space-between; padding:4px 0; color:#16a34a;"><span>Diskon Promo (' + escapeHtml(bk.promoCode) + ')</span><strong>−' + escapeHtml(fmtBk(bk.discountAmount)) + '</strong></div>' : ''),
      '  <div style="display:flex; justify-content:space-between; padding:6px 0; border-top:1px dashed #cbd5e1; margin-top:4px; font-size:1rem;"><strong>Total Biaya Resmi</strong><strong style="color:#0d9488;">' + escapeHtml(fmtBk(bk.totalAmount)) + '</strong></div>',
      '  <div style="display:flex; justify-content:space-between; padding:3px 0;"><span>Skema Dipilih: ' + (bk.paymentPlan === 'dp' ? 'DP 30% (' + fmtBk(payTargetNow) + ')' : 'Lunas 100%') + ' • Sudah Masuk:</span><strong>' + escapeHtml(fmtBk(bk.paidAmount || 0)) + '</strong></div>',
      '  <div style="display:flex; justify-content:space-between; padding:3px 0; color:#dc2626;"><span>Sisa Pelunasan</span><strong>' + escapeHtml(fmtBk(remainingBalance)) + '</strong></div>',
      '</div>',
      '<div style="margin-bottom:16px;">',
      '  <h4 style="margin:0 0 8px; font-size:0.8rem; text-transform:uppercase; color:#475569;">Ringkasan Jadwal Perjalanan</h4>',
      '  <table><thead><tr><th>Hari</th><th>Agenda Utama</th><th>Makan</th></tr></thead><tbody>' + itinSummary + '</tbody></table>',
      '</div>',
      '<div class="voucher-box" style="background:#f0fdfa; border-color:#99f6e4;">',
      '  <h4>Instruksi Pembayaran &amp; Verifikasi</h4>',
      '  <div style="font-size:0.84rem;">Transfer ke <strong>' + escapeHtml(s.bankName) + '</strong> No. Rek <strong>' + escapeHtml(s.bankAccount) + '</strong> a.n <strong>' + escapeHtml(s.bankHolder) + '</strong>.</div>',
      '  <div style="font-size:0.82rem; color:#0f766e; margin-top:4px;">' + escapeHtml(s.qrisNote) + ' • Cantumkan kode <strong>' + escapeHtml(bk.bookingCode) + '</strong> pada berita transfer.</div>',
      '</div>'
    ].join('');

    $('voucherModal').hidden = false;
  }

  function downloadBookingIcs(bookingCode) {
    var bk = state.data.bookings.find(function (b) { return b.bookingCode === bookingCode; });
    if (!bk) return;
    var dtStart = (bk.departureDate || '').replace(/-/g, '') + 'T070000';
    var dtEnd = (bk.endDate || bk.departureDate || '').replace(/-/g, '') + 'T180000';
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NusantaraVoyage Pro//Travel Agency//ID',
      'BEGIN:VEVENT',
      'UID:' + bk.bookingCode + '@nusantaravoyage.id',
      'DTSTART:' + dtStart,
      'DTEND:' + dtEnd,
      'SUMMARY:Keberangkatan Wisata - ' + bk.packageTitle + ' (' + bk.bookingCode + ')',
      'DESCRIPTION:Booking Code: ' + bk.bookingCode + '\\nHotel: ' + bk.hotelTierName + '\\nPeserta: ' + bk.adults + ' Dewasa',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    var blob = new Blob([lines], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = bk.bookingCode + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('File kalender ' + bk.bookingCode + '.ics berhasil diunduh!');
  }

  function sendBookingWhatsApp(bookingCode) {
    var bk = state.data.bookings.find(function (b) { return b.bookingCode === bookingCode; });
    if (!bk) return;
    var s = state.data.settings;
    var curr = bk.currency || 'IDR';
    var totalStr = curr === 'USD' ? formatMoney(0, bk.totalAmount, 'USD') : formatMoney(bk.totalAmount, 0, 'IDR');
    var msg = [
      'Halo Admin *' + s.agencyName + '*,',
      'Saya ingin konfirmasi reservasi paket wisata berikut:',
      '',
      '• Kode Booking: *' + bk.bookingCode + '*',
      '• Nama Pemesan: ' + bk.customerName,
      '• Paket: ' + bk.packageTitle,
      '• Jadwal: ' + formatDateIndo(bk.departureDate) + ' s/d ' + formatDateIndo(bk.endDate),
      '• Akomodasi: ' + bk.hotelTierName,
      '• Peserta: ' + bk.adults + ' Dewasa' + (bk.children ? ', ' + bk.children + ' Anak' : ''),
      '• Total Tagihan: *' + totalStr + '* (' + (bk.paymentPlan === 'dp' ? 'Skema DP 30%' : 'Full Payment') + ')',
      '• Status Saat Ini: ' + bk.status,
      '',
      'Mohon informasi verifikasi & tahap selanjutnya. Terima kasih!'
    ].join('\n');

    window.open('https://wa.me/' + sanitizePhone(s.whatsapp) + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  }

  /* ---------------- My Booking Lookup View ---------------- */
  function renderLookupQuickButtons() {
    var box = $('lookupQuickBtns');
    var samples = state.data.bookings.slice(0, 4);
    box.innerHTML = '<span style="font-size:0.8rem; color:var(--text-soft);">Contoh cepat:</span>' + samples.map(function (b) {
      return '<button type="button" class="mini-tag" data-quick-code="' + escapeHtml(b.bookingCode) + '" style="cursor:pointer;">' + escapeHtml(b.bookingCode) + ' (' + escapeHtml(b.status) + ')</button>';
    }).join('');

    box.querySelectorAll('[data-quick-code]').forEach(function (btn) {
      btn.onclick = function () {
        $('lookupInput').value = btn.getAttribute('data-quick-code');
        runBookingLookup();
      };
    });
  }

  function runBookingLookup(ev) {
    if (ev) ev.preventDefault();
    var q = $('lookupInput').value.trim().toLowerCase();
    var box = $('lookupResultBox');
    if (!q) return;

    var matches = state.data.bookings.filter(function (b) {
      return b.bookingCode.toLowerCase() === q || (b.customerEmail || '').toLowerCase() === q || (b.customerPhone || '').indexOf(q.replace(/\D/g, '') || '---') !== -1;
    });

    if (!matches.length) {
      box.innerHTML = '<div class="panel-card" style="text-align:center;"><h3>Data booking tidak ditemukan</h3><p style="color:var(--text-muted);">Periksa kembali kode booking <code>TRV-XXXX</code> atau email yang Anda daftarkan.</p></div>';
      return;
    }

    box.innerHTML = matches.map(function (bk) {
      var badgeCls = bk.status === 'Lunas' || bk.status === 'Selesai' ? 'badge-success' : (bk.status === 'Dibatalkan' ? 'badge-danger' : 'badge-warning');
      var totalStr = bk.currency === 'USD' ? formatMoney(0, bk.totalAmount, 'USD') : formatMoney(bk.totalAmount, 0, 'IDR');
      var paidStr = bk.currency === 'USD' ? formatMoney(0, bk.paidAmount || 0, 'USD') : formatMoney(bk.paidAmount || 0, 0, 'IDR');
      return [
        '<div class="panel-card" style="margin-bottom:14px;">',
        '  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">',
        '    <div>',
        '      <span class="badge ' + badgeCls + '">' + escapeHtml(bk.status) + '</span>',
        '      <h3 style="margin:6px 0 4px;">' + escapeHtml(bk.bookingCode + ' — ' + bk.packageTitle) + '</h3>',
        '      <p style="margin:0; font-size:0.88rem; color:var(--text-muted);">Pemesan: <strong>' + escapeHtml(bk.customerName) + '</strong> • Keberangkatan: <strong>' + escapeHtml(formatDateIndo(bk.departureDate)) + '</strong> (' + bk.adults + ' Dewasa, ' + bk.children + ' Anak)</p>',
        '    </div>',
        '    <div style="text-align:right;">',
        '      <div style="font-size:0.78rem; color:var(--text-soft);">Total Tagihan / Terbayar</div>',
        '      <strong style="font-size:1.15rem; color:var(--primary);">' + escapeHtml(totalStr) + '</strong>',
        '      <div style="font-size:0.8rem; color:var(--success);">Masuk: ' + escapeHtml(paidStr) + '</div>',
        '    </div>',
        '  </div>',
        '  <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px; padding-top:12px; border-top:1px dashed var(--border);">',
        '    <button type="button" class="btn btn-primary btn-sm" onclick="window.__nvOpenVoucher(\'' + escapeHtml(bk.bookingCode) + '\')">' + ICONS.voucher + ' Buka &amp; Cetak E-Voucher A4</button>',
        '    <button type="button" class="btn btn-outline btn-sm" onclick="window.__nvDownloadIcs(\'' + escapeHtml(bk.bookingCode) + '\')">' + ICONS.calendar + ' Simpan ke Kalender (.ics)</button>',
        '    <button type="button" class="btn btn-success btn-sm" onclick="window.__nvSendWa(\'' + escapeHtml(bk.bookingCode) + '\')">' + ICONS.message + ' Konfirmasi WhatsApp Agen</button>',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');
  }

  /* ---------------- Admin Dashboard (KPI, Bookings, CRUD, Settings) ---------------- */
  function renderAdminDashboard() {
    var bks = state.data.bookings;
    var activeBks = bks.filter(function (b) { return b.status !== 'Dibatalkan'; });
    var totalRevIdr = activeBks.reduce(function (sum, b) {
      return sum + (b.currency === 'USD' ? Number(b.totalAmount) * 15500 : Number(b.totalAmount || 0));
    }, 0);
    var totalSeats = activeBks.reduce(function (sum, b) {
      return sum + Number(b.adults || 0) + Number(b.children || 0);
    }, 0);
    var waitingCount = bks.filter(function (b) { return b.status === 'Menunggu Pembayaran'; }).length;

    $('adminKpiGrid').innerHTML = [
      '<div class="kpi-card"><div class="kpi-label">Estimasi Omzet Aktif</div><div class="kpi-val">' + escapeHtml(formatMoney(totalRevIdr, Math.round(totalRevIdr / 15500))) + '</div><div class="kpi-sub">' + activeBks.length + ' transaksi valid</div></div>',
      '<div class="kpi-card"><div class="kpi-label">Menunggu Pembayaran</div><div class="kpi-val">' + waitingCount + '</div><div class="kpi-sub">Perlu follow-up / verifikasi</div></div>',
      '<div class="kpi-card"><div class="kpi-label">Total Kursi Terisi</div><div class="kpi-val">' + totalSeats + ' pax</div><div class="kpi-sub">Tersinkron ke kuota paket</div></div>',
      '<div class="kpi-card"><div class="kpi-label">Paket Wisata Aktif</div><div class="kpi-val">' + state.data.packages.filter(function (p) { return p.active !== false; }).length + '</div><div class="kpi-sub">' + state.data.promos.filter(function (p) { return p.active !== false; }).length + ' kode promo aktif</div></div>'
    ].join('');

    // Revenue by package chart
    var mapRev = {};
    activeBks.forEach(function (b) {
      var valIdr = b.currency === 'USD' ? Number(b.totalAmount) * 15500 : Number(b.totalAmount || 0);
      mapRev[b.packageTitle] = (mapRev[b.packageTitle] || 0) + valIdr;
    });
    var entries = Object.keys(mapRev).map(function (k) { return { title: k, val: mapRev[k] }; })
      .sort(function (a, b) { return b.val - a.val; }).slice(0, 5);
    var maxVal = entries.length ? entries[0].val : 1;

    $('adminRevenueChart').innerHTML = entries.length ? entries.map(function (e) {
      var pct = Math.max(8, Math.round((e.val / maxVal) * 100));
      return [
        '<div class="chart-row">',
        '  <div style="font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="' + escapeHtml(e.title) + '">' + escapeHtml(e.title) + '</div>',
        '  <div class="chart-track"><div class="chart-fill" style="width:' + pct + '%"></div></div>',
        '  <strong style="text-align:right;">' + escapeHtml(formatMoney(e.val, Math.round(e.val / 15500), 'IDR')) + '</strong>',
        '</div>'
      ].join('');
    }).join('') : '<p style="margin:0; color:var(--text-soft);">Belum ada transaksi aktif.</p>';

    renderAdminBookingsTable();
    renderAdminPackagesTable();
    renderAdminSettingsTab();
  }

  function renderAdminBookingsTable() {
    var statusFilter = $('adminBookingStatusFilter').value;
    var q = $('adminBookingSearch').value.trim().toLowerCase();

    var list = state.data.bookings.filter(function (b) {
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
      if (q) {
        var hay = [b.bookingCode, b.customerName, b.packageTitle, b.customerPhone, b.customerEmail].join(' ').toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    $('adminBookingsTbody').innerHTML = list.length ? list.map(function (b) {
      var cls = b.status === 'Lunas' || b.status === 'Selesai' ? 'badge-success' : (b.status === 'Dibatalkan' ? 'badge-danger' : 'badge-warning');
      var totalStr = b.currency === 'USD' ? formatMoney(0, b.totalAmount, 'USD') : formatMoney(b.totalAmount, 0, 'IDR');
      var paidStr = b.currency === 'USD' ? formatMoney(0, b.paidAmount || 0, 'USD') : formatMoney(b.paidAmount || 0, 0, 'IDR');
      return [
        '<tr>',
        '  <td><strong>' + escapeHtml(b.bookingCode) + '</strong><div style="font-size:0.75rem; color:var(--text-soft);">' + escapeHtml(formatDateIndo(b.departureDate)) + '</div></td>',
        '  <td><strong>' + escapeHtml(b.customerName) + '</strong><div style="font-size:0.75rem; color:var(--text-soft);">+' + escapeHtml(b.customerPhone) + '</div></td>',
        '  <td>' + escapeHtml(b.packageTitle) + '<div style="font-size:0.75rem; color:var(--text-soft);">' + escapeHtml(b.hotelTierName) + '</div></td>',
        '  <td>' + (Number(b.adults) + Number(b.children)) + ' pax</td>',
        '  <td><strong>' + escapeHtml(totalStr) + '</strong><div style="font-size:0.75rem; color:var(--success);">Masuk: ' + escapeHtml(paidStr) + '</div></td>',
        '  <td><span class="badge ' + cls + '">' + escapeHtml(b.status) + '</span></td>',
        '  <td>',
        '    <div style="display:flex; gap:6px; flex-wrap:wrap;">',
        '      <select class="input" style="padding:4px 8px; font-size:0.78rem; width:auto;" onchange="window.__nvSetBookingStatus(\'' + escapeHtml(b.bookingCode) + '\', this.value)">',
        '        ' + ['Menunggu Pembayaran', 'DP Terkonfirmasi', 'Lunas', 'Selesai', 'Dibatalkan'].map(function (st) {
          return '<option value="' + st + '"' + (b.status === st ? ' selected' : '') + '>' + st + '</option>';
        }).join(''),
        '      </select>',
        '      <button type="button" class="btn btn-outline btn-sm" onclick="window.__nvOpenVoucher(\'' + escapeHtml(b.bookingCode) + '\')">E-Voucher</button>',
        '    </div>',
        '  </td>',
        '</tr>'
      ].join('');
    }).join('') : '<tr><td colspan="7" style="text-align:center; padding:24px;">Tidak ada data booking yang cocok.</td></tr>';
  }

  function renderAdminPackagesTable() {
    $('adminPackagesTbody').innerHTML = state.data.packages.map(function (p) {
      var rem = getPackageMinRemaining(p);
      return [
        '<tr>',
        '  <td><code>' + escapeHtml(p.code) + '</code></td>',
        '  <td><strong>' + escapeHtml(p.title) + '</strong><div style="font-size:0.76rem; color:var(--text-soft);">' + escapeHtml(p.destination) + '</div></td>',
        '  <td>' + escapeHtml(p.region) + ' • <span class="badge badge-primary">' + escapeHtml(p.category) + '</span></td>',
        '  <td>' + escapeHtml(p.durationLabel) + '</td>',
        '  <td><strong>' + escapeHtml(formatMoney(p.priceIdr, p.priceUsd)) + '</strong></td>',
        '  <td>' + (p.departures ? p.departures.length : 0) + ' jadwal (' + rem + ' kursi) • ' + (p.active !== false ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-danger">Arsip</span>') + '</td>',
        '  <td>',
        '    <div style="display:flex; gap:6px;">',
        '      <button type="button" class="btn btn-outline btn-sm" onclick="window.__nvEditPackage(\'' + escapeHtml(p.id) + '\')">Edit</button>',
        '      <button type="button" class="btn btn-danger btn-sm" onclick="window.__nvDeletePackage(\'' + escapeHtml(p.id) + '\')">Hapus</button>',
        '    </div>',
        '  </td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderAdminSettingsTab() {
    var s = state.data.settings;
    $('setAgencyName').value = s.agencyName || '';
    $('setAgencyTagline').value = s.agencyTagline || '';
    $('setWhatsapp').value = s.whatsapp || '';
    $('setEmail').value = s.email || '';
    $('setInstagram').value = s.instagram || '';
    $('setAddress').value = s.address || '';
    $('setBankName').value = s.bankName || '';
    $('setBankAccount').value = s.bankAccount || '';
    $('setBankHolder').value = s.bankHolder || '';
    $('setQrisNote').value = s.qrisNote || '';
    if ($('setAdminPin')) $('setAdminPin').value = s.adminPin || '123456';

    $('adminPromosList').innerHTML = state.data.promos.map(function (pr, idx) {
      var valText = pr.type === 'percent' ? pr.value + '%' : formatMoney(pr.valueIdr, pr.valueUsd, 'IDR');
      return [
        '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px; border:1px solid var(--border); padding:9px 12px; border-radius:10px;">',
        '  <div>',
        '    <strong>' + escapeHtml(pr.code) + '</strong> <span class="badge badge-accent">' + escapeHtml(valText) + '</span>',
        '    <div style="font-size:0.78rem; color:var(--text-soft);">Min. ' + pr.minPax + ' pax • ' + escapeHtml(pr.desc) + '</div>',
        '  </div>',
        '  <button type="button" class="btn btn-outline btn-sm" onclick="window.__nvDeletePromo(' + idx + ')">Hapus</button>',
        '</div>'
      ].join('');
    }).join('');
  }

  /* ---------------- Package CRUD Editor Modal ---------------- */
  function openPackageEditor(pkgId) {
    var pkg = pkgId ? getPkgById(pkgId) : null;
    $('pkgEditorTitle').textContent = pkg ? 'Edit Paket Wisata: ' + pkg.code : 'Tambah Paket Wisata Baru';
    $('editPkgId').value = pkg ? pkg.id : '';
    $('editPkgCode').value = pkg ? pkg.code : 'PKG-NEW-' + String(state.data.packages.length + 1).padStart(2, '0');
    $('editPkgRegion').value = pkg ? pkg.region : 'Domestik';
    $('editPkgCategory').value = pkg ? pkg.category : 'Open Trip';
    $('editPkgTitle').value = pkg ? pkg.title : '';
    $('editPkgDest').value = pkg ? pkg.destination : '';
    $('editPkgDays').value = pkg ? pkg.durationDays : 3;
    $('editPkgPriceIdr').value = pkg ? pkg.priceIdr : 2950000;
    $('editPkgPriceUsd').value = pkg ? pkg.priceUsd : 195;
    $('editPkgBadge').value = pkg ? (pkg.badge || '') : 'Paket Baru';
    $('editPkgArt').value = pkg ? pkg.artKey : 'bali';
    $('editPkgQuota').value = pkg && pkg.departures[0] ? pkg.departures[0].quota : 20;
    $('editPkgDepartureDate').value = pkg && pkg.departures[0] ? pkg.departures[0].date : '2027-02-15';
    $('editPkgSummary').value = pkg ? pkg.summary : '';

    var itinText = pkg && pkg.itinerary
      ? pkg.itinerary.map(function (d) { return d.title + ' | ' + d.desc; }).join('\n')
      : 'Penjemputan & City Tour Pembuka | Tiba di bandara/stasiun, check-in hotel, makan malam penyambutan.\nWisata Ikonik Full Day | Mengunjungi destinasi unggulan seharian penuh bersama guide profesional.\nBelanja Oleh-Oleh & Kepulangan | Sarapan hotel, belanja cenderamata lokal dan antar ke bandara.';
    $('editPkgItineraryText').value = itinText;

    $('editPkgIncludesText').value = pkg && pkg.includes
      ? pkg.includes.join('\n')
      : 'Hotel bintang 3/4 pilihan\nTransportasi AC private selama tur\nMakan sesuai itinerary\nTiket masuk wisata & pemandu lokal';

    $('packageEditorModal').hidden = false;
  }

  function handlePackageEditorSubmit(ev) {
    ev.preventDefault();
    var id = $('editPkgId').value;
    var days = Math.max(1, Number($('editPkgDays').value || 3));
    var depDate = $('editPkgDepartureDate').value || '2027-02-15';
    var endObj = new Date(depDate + 'T00:00:00');
    endObj.setDate(endObj.getDate() + Math.max(0, days - 1));
    var endDate = endObj.toISOString().slice(0, 10);
    var priceIdr = Math.max(50000, Number($('editPkgPriceIdr').value || 0));
    var priceUsd = Math.max(5, Number($('editPkgPriceUsd').value || 0));
    var quota = clampInt($('editPkgQuota').value, 2, 500);

    var itinerary = $('editPkgItineraryText').value.split(/\r?\n/).filter(Boolean).map(function (line, i) {
      var parts = line.split('|');
      return {
        day: i + 1,
        title: (parts[0] || 'Hari ke-' + (i + 1)).trim(),
        meals: i === 0 ? 'L, D' : 'B, L',
        hotel: i === days - 1 ? 'Selesai' : 'Hotel Pilihan',
        desc: (parts[1] || parts[0] || '').trim()
      };
    });

    var includes = $('editPkgIncludesText').value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    var existing = id ? getPkgById(id) : null;

    var payload = {
      id: existing ? existing.id : 'pkg-' + Date.now(),
      code: $('editPkgCode').value.trim().toUpperCase(),
      title: $('editPkgTitle').value.trim(),
      titleEn: $('editPkgTitle').value.trim(),
      region: $('editPkgRegion').value,
      destination: $('editPkgDest').value.trim(),
      category: $('editPkgCategory').value,
      badge: $('editPkgBadge').value.trim() || 'Pilihan',
      durationDays: days,
      durationLabel: days + 'H ' + Math.max(0, days - 1) + 'M',
      departureCity: existing ? existing.departureCity : 'Jakarta / Meeting Point Lokasi',
      rating: existing ? existing.rating : 4.9,
      reviewsCount: existing ? existing.reviewsCount : 12,
      priceIdr: priceIdr,
      childPriceIdr: Math.round(priceIdr * 0.85),
      singleSuppIdr: Math.round(priceIdr * 0.3),
      priceUsd: priceUsd,
      childPriceUsd: Math.round(priceUsd * 0.85),
      singleSuppUsd: Math.round(priceUsd * 0.3),
      artKey: $('editPkgArt').value,
      active: true,
      summary: $('editPkgSummary').value.trim(),
      summaryEn: $('editPkgSummary').value.trim(),
      highlights: existing ? existing.highlights : ['Itinerary fleksibel & terukur', 'Hotel pilihan nyaman', 'Guide berpengalaman'],
      includes: includes,
      excludes: existing ? existing.excludes : ['Tiket pesawat kota asal (opsional)', 'Pengeluaran pribadi peserta'],
      hotelTiers: existing ? existing.hotelTiers : [
        { id: 'std', name: 'Standard 3★ Nyaman', deltaIdr: 0, deltaUsd: 0 },
        { id: 'sup', name: 'Superior 4★ Pilihan', deltaIdr: 750000, deltaUsd: 49 }
      ],
      departures: existing && existing.departures.length
        ? [Object.assign({}, existing.departures[0], { date: depDate, endDate: endDate, quota: quota })].concat(existing.departures.slice(1))
        : [{ id: 'dep-' + Date.now(), date: depDate, endDate: endDate, quota: quota, status: 'Tersedia' }],
      itinerary: itinerary
    };

    if (existing) {
      var idx = state.data.packages.findIndex(function (p) { return p.id === existing.id; });
      state.data.packages[idx] = payload;
      showToast('Paket ' + payload.code + ' berhasil diperbarui.');
    } else {
      state.data.packages.unshift(payload);
      showToast('Paket baru ' + payload.code + ' ditambahkan ke katalog!');
    }

    saveState();
    $('packageEditorModal').hidden = true;
    renderCatalog();
    renderAdminDashboard();
  }

  /* ---------------- Export CSV & JSON Backup ---------------- */
  function exportBookingsCsv() {
    var headers = ['Kode Booking', 'Tanggal Buat', 'Pemesan', 'WhatsApp', 'Email', 'Paket Wisata', 'Keberangkatan', 'Dewasa', 'Anak', 'Mata Uang', 'Total Tagihan', 'Terbayar', 'Status'];
    var rows = state.data.bookings.map(function (b) {
      return [
        b.bookingCode,
        b.createdAt,
        b.customerName,
        b.customerPhone,
        b.customerEmail,
        b.packageTitle,
        b.departureDate,
        b.adults,
        b.children,
        b.currency || 'IDR',
        b.totalAmount,
        b.paidAmount || 0,
        b.status
      ].map(function (cell) {
        return '"' + String(cell == null ? '' : cell).replace(/"/g, '""') + '"';
      }).join(',');
    });

    var csv = '\uFEFF' + [headers.join(',')].concat(rows).join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'laporan-booking-travel-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Laporan booking CSV siap dibuka di Excel!');
  }

  function exportJsonBackup() {
    var json = JSON.stringify(state.data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'backup-travel-agency-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup JSON berhasil diunduh!');
  }

  /* ---------------- Global Event Bindings ---------------- */
  function bindEvents() {
    // Navbar views
    document.querySelectorAll('.nav-tab[data-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchView(btn.getAttribute('data-view'));
      });
    });

    $('brandHomeLink').addEventListener('click', function (e) {
      e.preventDefault();
      switchView('catalog');
    });

    // Header tools
    $('themeToggleBtn').addEventListener('click', function () {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });
    $('currencyToggleBtn').addEventListener('click', function () {
      state.currency = state.currency === 'IDR' ? 'USD' : 'IDR';
      syncAgencyBrandingAndI18n();
      renderCatalog();
      if (state.view === 'admin') renderAdminDashboard();
    });
    $('langToggleBtn').addEventListener('click', function () {
      state.lang = state.lang === 'id' ? 'en' : 'id';
      syncAgencyBrandingAndI18n();
      renderCatalog();
    });
    $('wishlistFilterBtn').addEventListener('click', function () {
      if (state.view !== 'catalog') switchView('catalog');
      state.wishlistOnly = !state.wishlistOnly;
      renderCatalog();
      if (state.wishlistOnly) showToast('Menampilkan paket wisata favorit tersimpan.');
    });

    // Catalog filters
    $('searchKeyword').addEventListener('input', function (e) { state.filters.keyword = e.target.value; renderCatalog(); });
    $('searchRegion').addEventListener('change', function (e) { state.filters.region = e.target.value; renderCatalog(); });
    $('searchDuration').addEventListener('change', function (e) { state.filters.duration = e.target.value; renderCatalog(); });
    $('searchBudget').addEventListener('change', function (e) { state.filters.budget = e.target.value; renderCatalog(); });
    $('searchSort').addEventListener('change', function (e) { state.filters.sort = e.target.value; renderCatalog(); });
    $('searchResetBtn').addEventListener('click', resetAllFilters);

    $('categoryPills').addEventListener('click', function (e) {
      var btn = e.target.closest('.pill-btn[data-cat]');
      if (!btn) return;
      state.filters.category = btn.getAttribute('data-cat');
      document.querySelectorAll('#categoryPills .pill-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      renderCatalog();
    });

    // Package grid delegation (wish / detail / book)
    $('packagesGrid').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      var pkgId = btn.getAttribute('data-id');

      if (action === 'wish') {
        var idx = state.data.wishlist.indexOf(pkgId);
        if (idx === -1) {
          state.data.wishlist.push(pkgId);
          showToast('Paket disimpan ke daftar favorit.');
        } else {
          state.data.wishlist.splice(idx, 1);
          showToast('Paket dihapus dari favorit.');
        }
        saveState();
        syncAgencyBrandingAndI18n();
        renderCatalog();
      } else if (action === 'detail') {
        openPackageDetail(pkgId);
      } else if (action === 'book') {
        openBookingModal(pkgId);
      }
    });

    // FAQ accordion
    $('faqList').addEventListener('click', function (e) {
      var qBtn = e.target.closest('.faq-q');
      if (!qBtn) return;
      var ans = qBtn.parentElement.querySelector('.faq-a');
      var isHidden = ans.hidden;
      ans.hidden = !isHidden;
      qBtn.lastElementChild.textContent = isHidden ? '−' : '+';
    });

    // Custom quote WhatsApp generator
    $('customQuoteForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var s = state.data.settings;
      var msg = [
        'Halo Tim Custom Trip *' + s.agencyName + '*,',
        'Saya ingin meminta penawaran paket Custom / Rombongan:',
        '• Nama/Instansi: ' + $('cqName').value.trim(),
        '• WhatsApp: ' + $('cqWa').value.trim(),
        '• Destinasi: ' + $('cqDest').value.trim(),
        '• Bulan Berangkat: ' + $('cqDate').value,
        '• Perkiraan Peserta: ' + $('cqPax').value + ' orang',
        '• Catatan: ' + ($('cqNotes').value.trim() || '-')
      ].join('\n');
      showToast('Mengarahkan permintaan penawaran ke WhatsApp Agen...');
      window.open('https://wa.me/' + sanitizePhone(s.whatsapp) + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });

    // Detail modal tabs & actions
    $('detailTabs').addEventListener('click', function (e) {
      var b = e.target.closest('.pill-btn[data-dtab]');
      if (!b) return;
      state.activeDetailTab = b.getAttribute('data-dtab');
      document.querySelectorAll('#detailTabs .pill-btn').forEach(function (x) { x.classList.toggle('active', x === b); });
      renderPackageDetailBody();
    });
    $('detailBody').addEventListener('click', function (e) {
      var depBtn = e.target.closest('[data-select-dep]');
      if (!depBtn || !state.activePackageId) return;
      state.selectedDepartureByPkg[state.activePackageId] = depBtn.getAttribute('data-select-dep');
      renderPackageDetailBody();
    });
    $('detailBookBtn').addEventListener('click', function () {
      openBookingModal(state.activePackageId);
    });

    // Booking modal live updates
    $('bkPackageId').addEventListener('change', function () {
      populateBookingPackageOptions();
      recalculateBookingTotals();
    });
    ['bkDepartureId', 'bkHotelTier', 'bkAdults', 'bkChildren', 'bkSingleRooms', 'bkPaymentPlan'].forEach(function (id) {
      $(id).addEventListener('change', recalculateBookingTotals);
      $(id).addEventListener('input', recalculateBookingTotals);
    });
    $('bkApplyPromoBtn').addEventListener('click', handleApplyPromo);
    $('bookingForm').addEventListener('submit', handleBookingSubmit);

    // Voucher actions
    $('voucherDownloadIcsBtn').addEventListener('click', function () {
      if (state.currentVoucherCode) downloadBookingIcs(state.currentVoucherCode);
    });
    $('voucherSendWaBtn').addEventListener('click', function () {
      if (state.currentVoucherCode) sendBookingWhatsApp(state.currentVoucherCode);
    });
    $('voucherPrintBtn').addEventListener('click', function () {
      window.print();
    });

    // Lookup form
    $('lookupForm').addEventListener('submit', runBookingLookup);

    // Admin PIN Gate & Lock
    $('adminUnlockForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var entered = $('adminPinInput').value.trim();
      var expectedPin = String(state.data.settings.adminPin || '123456');
      var errEl = $('adminPinError');
      if (entered !== expectedPin) {
        errEl.textContent = 'PIN Admin salah. Periksa kembali PIN Anda (Default demo: 123456).';
        errEl.hidden = false;
        return;
      }
      errEl.hidden = true;
      $('adminPinInput').value = '';
      setAdminUnlocked(true);
      $('adminLockScreen').hidden = true;
      $('adminContentWrap').hidden = false;
      renderAdminDashboard();
      showToast('Panel Admin berhasil dibuka.');
    });

    $('adminLockBtn').addEventListener('click', function () {
      setAdminUnlocked(false);
      $('adminLockScreen').hidden = false;
      $('adminContentWrap').hidden = true;
      showToast('Panel Admin dikunci.');
    });

    // Admin subtabs & actions
    document.querySelectorAll('[data-admin-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.adminTab = btn.getAttribute('data-admin-tab');
        document.querySelectorAll('[data-admin-tab]').forEach(function (b) { b.classList.toggle('active', b === btn); });
        ['bookings', 'packages', 'settings'].forEach(function (tKey) {
          $('admin-tab-' + tKey).hidden = tKey !== state.adminTab;
        });
      });
    });

    $('adminBookingStatusFilter').addEventListener('change', renderAdminBookingsTable);
    $('adminBookingSearch').addEventListener('input', renderAdminBookingsTable);
    $('exportBookingsCsvBtn').addEventListener('click', exportBookingsCsv);
    $('newPackageBtn').addEventListener('click', function () { openPackageEditor(null); });
    $('pkgEditForm').addEventListener('submit', handlePackageEditorSubmit);

    $('agencySettingsForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var newPin = ($('setAdminPin') ? $('setAdminPin').value.trim() : '') || state.data.settings.adminPin || '123456';
      if (newPin.length < 4) {
        showToast('PIN Admin minimal 4 karakter.');
        return;
      }
      Object.assign(state.data.settings, {
        agencyName: $('setAgencyName').value.trim(),
        agencyTagline: $('setAgencyTagline').value.trim(),
        whatsapp: sanitizePhone($('setWhatsapp').value.trim()),
        email: $('setEmail').value.trim(),
        instagram: $('setInstagram').value.trim(),
        address: $('setAddress').value.trim(),
        bankName: $('setBankName').value.trim(),
        bankAccount: $('setBankAccount').value.trim(),
        bankHolder: $('setBankHolder').value.trim(),
        qrisNote: $('setQrisNote').value.trim(),
        adminPin: newPin
      });
      saveState();
      syncAgencyBrandingAndI18n();
      showToast('Profil, rekening & PIN admin berhasil disimpan!');
    });

    $('promoAddForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var code = $('promoCodeInput').value.trim().toUpperCase().replace(/\s+/g, '');
      var type = $('promoTypeInput').value;
      var valIdr = Math.max(1, Number($('promoValIdrInput').value || 0));
      if (type === 'percent') valIdr = Math.min(90, valIdr);
      var valUsd = Math.max(1, Number($('promoValUsdInput').value || 15));
      var minPax = Math.max(1, Number($('promoMinPaxInput').value || 1));
      var desc = $('promoDescInput').value.trim() || 'Promo spesial agen travel';
      if (!code) return;

      state.data.promos.unshift({
        code: code,
        type: type,
        value: type === 'percent' ? valIdr : 0,
        valueIdr: type === 'fixed' ? valIdr : 0,
        valueUsd: type === 'fixed' ? valUsd : 0,
        minPax: minPax,
        desc: desc,
        active: true
      });
      saveState();
      $('promoAddForm').reset();
      renderAdminDashboard();
      showToast('Kode promo ' + code + ' berhasil ditambahkan!');
    });

    $('exportBackupBtn').addEventListener('click', exportJsonBackup);
    $('importBackupInput').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var parsed = JSON.parse(reader.result);
          if (!parsed || !Array.isArray(parsed.packages) || !parsed.settings) throw new Error('Struktur JSON tidak valid');
          state.data = parsed;
          saveState();
          syncAgencyBrandingAndI18n();
          renderCatalog();
          renderAdminDashboard();
          showToast('Restore backup data agen berhasil!');
        } catch (err) {
          showToast('File JSON backup tidak valid: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    $('resetDemoDataBtn').addEventListener('click', function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      loadState();
      syncAgencyBrandingAndI18n();
      renderCatalog();
      renderReviewsAndFaqs();
      renderAdminDashboard();
      showToast('Database lokal dikembalikan ke data demo awal.');
    });

    // Global modal close handlers
    document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $(btn.getAttribute('data-close-modal')).hidden = true;
      });
    });
    document.querySelectorAll('.modal-backdrop').forEach(function (backdrop) {
      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) backdrop.hidden = true;
      });
    });

    // Window hooks for inline table buttons
    window.__nvOpenVoucher = openVoucherModal;
    window.__nvDownloadIcs = downloadBookingIcs;
    window.__nvSendWa = sendBookingWhatsApp;
    window.__nvEditPackage = openPackageEditor;
    window.__nvDeletePackage = function (pkgId) {
      state.data.packages = state.data.packages.filter(function (p) { return p.id !== pkgId; });
      saveState();
      renderCatalog();
      renderAdminDashboard();
      showToast('Paket wisata dihapus dari katalog.');
    };
    window.__nvDeletePromo = function (idx) {
      state.data.promos.splice(idx, 1);
      saveState();
      renderAdminDashboard();
      showToast('Kode promo dihapus.');
    };
    window.__nvSetBookingStatus = function (code, nextStatus) {
      var bk = state.data.bookings.find(function (b) { return b.bookingCode === code; });
      if (!bk) return;
      bk.status = nextStatus;
      bk.statusUpdatedAt = new Date().toISOString();
      if (nextStatus === 'DP Terkonfirmasi') {
        bk.paidAmount = Math.round(bk.totalAmount * 0.3);
      } else if (nextStatus === 'Lunas' || nextStatus === 'Selesai') {
        bk.paidAmount = bk.totalAmount;
      } else if (nextStatus === 'Dibatalkan' || nextStatus === 'Menunggu Pembayaran') {
        bk.paidAmount = 0;
      }
      saveState();
      syncAgencyBrandingAndI18n();
      renderCatalog();
      renderAdminDashboard();
      showToast('Status ' + code + ' diperbarui menjadi "' + nextStatus + '".');
    };
  }

  /* ---------------- Boot ---------------- */
  loadState();
  try {
    var qsLang = new URLSearchParams(window.location.search).get('lang');
    if (qsLang === 'en') {
      state.lang = 'en';
      state.currency = 'USD';
    } else if (qsLang === 'id') {
      state.lang = 'id';
      state.currency = 'IDR';
    }
  } catch (e) {}
  syncAgencyBrandingAndI18n();
  renderCatalog();
  renderReviewsAndFaqs();
  bindEvents();
})();
