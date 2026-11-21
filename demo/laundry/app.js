/* ==========================================================================
   Ddev Laundry POS — Application Logic (Vanilla JS, localStorage, Zero-Config)
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_ORDERS = 'ddev_laundry_orders_v1';
  var STORAGE_OUTLET = 'ddev_laundry_outlet_v1';
  var STORAGE_THEME = 'ddev_laundry_theme_v1';

  var STAGES = ['Diterima', 'Dicuci', 'Disetrika', 'Siap Diambil', 'Selesai'];

  var STAGE_META = {
    'Diterima': { badge: 'badge-stage-diterima', dot: 'st-diterima', nextLabel: 'Mulai Cuci' },
    'Dicuci': { badge: 'badge-stage-dicuci', dot: 'st-dicuci', nextLabel: 'Mulai Setrika' },
    'Disetrika': { badge: 'badge-stage-disetrika', dot: 'st-disetrika', nextLabel: 'Siap Diambil' },
    'Siap Diambil': { badge: 'badge-stage-siap', dot: 'st-siap', nextLabel: 'Selesaikan Order' },
    'Selesai': { badge: 'badge-stage-selesai', dot: 'st-selesai', nextLabel: null }
  };

  var SERVICE_PRESETS = [
    { id: 'reguler', name: 'Cuci Komplit Reguler (2 Hari)', mode: 'kiloan', unit: 'kg', price: 7000, hours: 48 },
    { id: 'express', name: 'Cuci Komplit Express (1 Hari)', mode: 'kiloan', unit: 'kg', price: 12000, hours: 24 },
    { id: 'kilat6', name: 'Kilat 6 Jam', mode: 'kiloan', unit: 'kg', price: 18000, hours: 6 },
    { id: 'setrika', name: 'Setrika Saja', mode: 'kiloan', unit: 'kg', price: 5000, hours: 24 },
    { id: 'bedcover', name: 'Bedcover Besar', mode: 'satuan', unit: 'pcs', price: 30000, hours: 48 },
    { id: 'sepatu', name: 'Cuci Sepatu Deep Clean', mode: 'satuan', unit: 'psg', price: 35000, hours: 48 },
    { id: 'jas', name: 'Cuci Jas / Blazer', mode: 'satuan', unit: 'pcs', price: 25000, hours: 48 },
    { id: 'karpet', name: 'Cuci Karpet Tebal', mode: 'satuan', unit: 'pcs', price: 45000, hours: 72 }
  ];

  var DEFAULT_OUTLET = {
    name: 'Ddev Fresh Laundry',
    address: 'Jl. Melati Raya No. 28, Bandung',
    phone: '0812-3456-7890',
    footer: 'Cucian tidak diambil >30 hari di luar tanggung jawab kami. Terima kasih!'
  };

  /* -------------------- HELPERS -------------------- */
  function roundQty(val) {
    return Math.round((Number(val) || 0) * 100) / 100;
  }

  function formatRp(num) {
    var n = Math.round(Number(num) || 0);
    return 'Rp ' + n.toLocaleString('id-ID');
  }

  function formatQty(qty, unit) {
    var q = roundQty(qty);
    var text = unit === 'kg' ? q.toFixed(1).replace(/\.0$/, '') : String(q);
    return text + ' ' + unit;
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDateTime(iso) {
    if (!iso) return '-';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace('.', ':') + ' WIB';
  }

  function formatShortTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).replace('.', ':');
  }

  function toDateKey(iso) {
    var d = new Date(iso);
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function formatDateLabel(dateKey) {
    var parts = dateKey.split('-');
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  }

  function normalizeWaPhone(raw) {
    var digits = String(raw || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('0')) return '62' + digits.slice(1);
    if (digits.startsWith('8')) return '62' + digits;
    return digits;
  }

  function computeFinancials(items, discountRaw, paymentStatus, dpRaw) {
    var subtotal = items.reduce(function (sum, item) {
      return sum + Math.round(roundQty(item.qty) * (Number(item.price) || 0));
    }, 0);
    var discount = Math.max(0, Math.min(subtotal, Math.round(Number(discountRaw) || 0)));
    var finalTotal = Math.max(0, subtotal - discount);
    var paidAmount = 0;

    if (paymentStatus === 'Lunas') {
      paidAmount = finalTotal;
    } else if (paymentStatus === 'DP Sebagian') {
      paidAmount = Math.max(0, Math.min(finalTotal, Math.round(Number(dpRaw) || 0)));
    } else {
      paidAmount = 0;
    }

    var remaining = Math.max(0, finalTotal - paidAmount);
    return {
      subtotal: subtotal,
      discount: discount,
      finalTotal: finalTotal,
      paidAmount: paidAmount,
      remaining: remaining
    };
  }

  function computeEstimateIso(items, baseTimeMs) {
    var maxHours = items.reduce(function (max, item) {
      return Math.max(max, Number(item.hours) || 48);
    }, items.length ? 6 : 48);
    return new Date((baseTimeMs || Date.now()) + maxHours * 3600 * 1000).toISOString();
  }

  function generateUniqueCode(existingOrders) {
    var used = {};
    existingOrders.forEach(function (o) { used[o.code] = true; });
    for (var i = 0; i < 100; i++) {
      var num = 1000 + Math.floor(Math.random() * 9000);
      var code = 'LDR-' + num;
      if (!used[code]) return code;
    }
    return 'LDR-' + String(Date.now()).slice(-4);
  }

  /* -------------------- SEED DATA (6 REALISTIC ORDERS) -------------------- */
  function buildSeedOrders() {
    var now = Date.now();
    var hour = 3600 * 1000;
    var day = 24 * hour;

    function makeOrder(cfg) {
      var fin = computeFinancials(cfg.items, cfg.discount, cfg.paymentStatus, cfg.dpAmount);
      return {
        code: cfg.code,
        customerName: cfg.customerName,
        customerPhone: cfg.customerPhone,
        deliveryType: cfg.deliveryType,
        address: cfg.address || '',
        note: cfg.note || '',
        items: cfg.items,
        fragrance: cfg.fragrance,
        discount: fin.discount,
        subtotal: fin.subtotal,
        finalTotal: fin.finalTotal,
        paymentStatus: cfg.paymentStatus,
        paidAmount: fin.paidAmount,
        remaining: fin.remaining,
        stage: cfg.stage,
        createdAt: new Date(cfg.createdMs).toISOString(),
        estimatedReadyAt: computeEstimateIso(cfg.items, cfg.createdMs),
        stageHistory: cfg.stageHistory
      };
    }

    return [
      makeOrder({
        code: 'LDR-2401',
        customerName: 'Ibu Ratna Sari',
        customerPhone: '081288994411',
        deliveryType: 'antar-jemput',
        address: 'Jl. Cendana Blok B4 No. 12',
        note: 'Antar sore setelah jam 16.00',
        items: [
          { name: 'Cuci Komplit Express (1 Hari)', mode: 'kiloan', unit: 'kg', qty: 4.2, price: 12000, hours: 24 },
          { name: 'Bedcover Besar', mode: 'satuan', unit: 'pcs', qty: 1, price: 30000, hours: 48 }
        ],
        fragrance: 'Lavender',
        discount: 5400,
        paymentStatus: 'DP Sebagian',
        dpAmount: 40000,
        stage: 'Siap Diambil',
        createdMs: now - 30 * hour,
        stageHistory: {
          'Diterima': new Date(now - 30 * hour).toISOString(),
          'Dicuci': new Date(now - 24 * hour).toISOString(),
          'Disetrika': new Date(now - 10 * hour).toISOString(),
          'Siap Diambil': new Date(now - 2 * hour).toISOString()
        }
      }),
      makeOrder({
        code: 'LDR-2402',
        customerName: 'Bapak Hendra Wijaya',
        customerPhone: '085722331109',
        deliveryType: 'outlet',
        note: 'Kemeja kerja gantung pakai hanger',
        items: [
          { name: 'Cuci Komplit Reguler (2 Hari)', mode: 'kiloan', unit: 'kg', qty: 5.5, price: 7000, hours: 48 },
          { name: 'Setrika Saja', mode: 'kiloan', unit: 'kg', qty: 2.0, price: 5000, hours: 24 }
        ],
        fragrance: 'Ocean Fresh',
        discount: 0,
        paymentStatus: 'Bayar Saat Ambil',
        dpAmount: 0,
        stage: 'Disetrika',
        createdMs: now - 22 * hour,
        stageHistory: {
          'Diterima': new Date(now - 22 * hour).toISOString(),
          'Dicuci': new Date(now - 15 * hour).toISOString(),
          'Disetrika': new Date(now - 3 * hour).toISOString()
        }
      }),
      makeOrder({
        code: 'LDR-2403',
        customerName: 'Nadia Putri',
        customerPhone: '081390012233',
        deliveryType: 'outlet',
        note: 'Sepatu kanvas putih hati-hati',
        items: [
          { name: 'Cuci Sepatu Deep Clean', mode: 'satuan', unit: 'psg', qty: 2, price: 35000, hours: 48 },
          { name: 'Kilat 6 Jam', mode: 'kiloan', unit: 'kg', qty: 1.8, price: 18000, hours: 6 }
        ],
        fragrance: 'Sakura',
        discount: 2400,
        paymentStatus: 'Lunas',
        dpAmount: 100000,
        stage: 'Dicuci',
        createdMs: now - 5 * hour,
        stageHistory: {
          'Diterima': new Date(now - 5 * hour).toISOString(),
          'Dicuci': new Date(now - 2 * hour).toISOString()
        }
      }),
      makeOrder({
        code: 'LDR-2404',
        customerName: 'Raka Pratama',
        customerPhone: '087844556677',
        deliveryType: 'antar-jemput',
        address: 'Kost Harmoni Kamar 204, Sukajadi',
        note: '',
        items: [
          { name: 'Kilat 6 Jam', mode: 'kiloan', unit: 'kg', qty: 3.0, price: 18000, hours: 6 }
        ],
        fragrance: 'No Parfum',
        discount: 0,
        paymentStatus: 'Lunas',
        dpAmount: 54000,
        stage: 'Diterima',
        createdMs: now - 1 * hour,
        stageHistory: {
          'Diterima': new Date(now - 1 * hour).toISOString()
        }
      }),
      makeOrder({
        code: 'LDR-2405',
        customerName: 'Ibu Dewi Lestari',
        customerPhone: '082155667788',
        deliveryType: 'outlet',
        note: 'Plastik vakum tebal',
        items: [
          { name: 'Bedcover Besar', mode: 'satuan', unit: 'pcs', qty: 2, price: 30000, hours: 48 },
          { name: 'Cuci Karpet Tebal', mode: 'satuan', unit: 'pcs', qty: 1, price: 45000, hours: 72 }
        ],
        fragrance: 'Lavender',
        discount: 10000,
        paymentStatus: 'Lunas',
        dpAmount: 95000,
        stage: 'Selesai',
        createdMs: now - 3 * day,
        stageHistory: {
          'Diterima': new Date(now - 3 * day).toISOString(),
          'Dicuci': new Date(now - 2.6 * day).toISOString(),
          'Disetrika': new Date(now - 2.2 * day).toISOString(),
          'Siap Diambil': new Date(now - 1.5 * day).toISOString(),
          'Selesai': new Date(now - 1 * day).toISOString()
        }
      }),
      makeOrder({
        code: 'LDR-2406',
        customerName: 'Mas Dimas Aditya',
        customerPhone: '089611223344',
        deliveryType: 'antar-jemput',
        address: 'Perum Griya Asri No. 9',
        note: 'Jas jangan dilipat',
        items: [
          { name: 'Cuci Komplit Reguler (2 Hari)', mode: 'kiloan', unit: 'kg', qty: 6.8, price: 7000, hours: 48 },
          { name: 'Cuci Jas / Blazer', mode: 'satuan', unit: 'pcs', qty: 1, price: 25000, hours: 48 }
        ],
        fragrance: 'Ocean Fresh',
        discount: 0,
        paymentStatus: 'DP Sebagian',
        dpAmount: 30000,
        stage: 'Siap Diambil',
        createdMs: now - 2 * day,
        stageHistory: {
          'Diterima': new Date(now - 2 * day).toISOString(),
          'Dicuci': new Date(now - 1.6 * day).toISOString(),
          'Disetrika': new Date(now - 1.1 * day).toISOString(),
          'Siap Diambil': new Date(now - 4 * hour).toISOString()
        }
      })
    ];
  }

  /* -------------------- STATE -------------------- */
  var state = {
    orders: [],
    outlet: Object.assign({}, DEFAULT_OUTLET),
    theme: 'light',
    activeTab: 'kasir',
    paperWidth: '58',
    boardStageFilter: 'ALL',
    boardSearch: '',
    boardPayFilter: 'ALL',
    boardLayout: 'kanban',
    trackingQuery: 'LDR-2401',
    modalOrderCode: null,
    draft: {
      code: '',
      deliveryType: 'outlet',
      fragrance: 'Lavender',
      paymentStatus: 'Lunas',
      items: [
        { name: 'Cuci Komplit Reguler (2 Hari)', mode: 'kiloan', unit: 'kg', qty: 2.5, price: 7000, hours: 48 }
      ]
    }
  };

  /* -------------------- STORAGE -------------------- */
  function loadState() {
    try {
      var rawOrders = localStorage.getItem(STORAGE_ORDERS);
      if (rawOrders) {
        var parsed = JSON.parse(rawOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.orders = parsed;
        }
      }
    } catch (e) {}

    if (!state.orders.length) {
      state.orders = buildSeedOrders();
      saveOrders();
    }

    try {
      var rawOutlet = localStorage.getItem(STORAGE_OUTLET);
      if (rawOutlet) {
        state.outlet = Object.assign({}, DEFAULT_OUTLET, JSON.parse(rawOutlet));
      }
    } catch (e) {}

    try {
      var savedTheme = localStorage.getItem(STORAGE_THEME);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        state.theme = savedTheme;
      } else {
        state.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      }
    } catch (e) {}

    state.draft.code = generateUniqueCode(state.orders);
  }

  function saveOrders() {
    try {
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(state.orders));
    } catch (e) {}
  }

  function saveOutlet() {
    try {
      localStorage.setItem(STORAGE_OUTLET, JSON.stringify(state.outlet));
    } catch (e) {}
  }

  /* -------------------- TOAST -------------------- */
  function showToast(msg, type) {
    var box = document.getElementById('toastContainer');
    var el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 3000);
  }

  /* -------------------- THEME & OUTLET HEADER -------------------- */
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_THEME, theme); } catch (e) {}
    var btn = document.getElementById('themeToggleBtn');
    if (theme === 'dark') {
      btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
      btn.title = 'Aktifkan Mode Terang';
    } else {
      btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      btn.title = 'Aktifkan Mode Gelap';
    }
  }

  function renderOutletHeader() {
    document.getElementById('outletHeaderName').textContent = state.outlet.name;
    document.getElementById('outletHeaderSub').textContent = state.outlet.address + ' • WA ' + state.outlet.phone;
    var activeCount = state.orders.filter(function (o) { return o.stage !== 'Selesai'; }).length;
    document.getElementById('activeOrdersBadge').textContent = String(activeCount);
  }

  /* -------------------- THERMAL RECEIPT RENDERER -------------------- */
  function buildThermalHtml(order) {
    var fin = computeFinancials(order.items, order.discount, order.paymentStatus, order.paidAmount);
    var itemsHtml = order.items.map(function (item) {
      var lineTotal = Math.round(roundQty(item.qty) * (Number(item.price) || 0));
      return (
        '<div class="tp-item">' +
          '<div class="tp-item-name">' + escapeHtml(item.name) + '</div>' +
          '<div class="tp-item-calc">' +
            '<span>' + escapeHtml(formatQty(item.qty, item.unit)) + ' x ' + formatRp(item.price) + '</span>' +
            '<span>' + formatRp(lineTotal) + '</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    if (!order.items.length) {
      itemsHtml = '<div class="tp-center">(Belum ada item cucian)</div>';
    }

    var deliveryLine = order.deliveryType === 'antar-jemput'
      ? 'Antar-Jemput' + (order.address ? ' (' + escapeHtml(order.address) + ')' : '')
      : 'Ambil di Outlet';

    return (
      '<div class="tp-center">' +
        '<div class="tp-title">' + escapeHtml(state.outlet.name) + '</div>' +
        '<div>' + escapeHtml(state.outlet.address) + '</div>' +
        '<div>WA: ' + escapeHtml(state.outlet.phone) + '</div>' +
      '</div>' +
      '<hr class="tp-divider">' +
      '<div class="tp-code-box">' + escapeHtml(order.code) + '</div>' +
      '<div class="tp-row"><span>Masuk</span><span>' + escapeHtml(formatShortTime(order.createdAt)) + '</span></div>' +
      '<div class="tp-row"><span>Selesai</span><span>' + escapeHtml(formatShortTime(order.estimatedReadyAt)) + '</span></div>' +
      '<div class="tp-row"><span>Pelanggan</span><span>' + escapeHtml(order.customerName || 'Tamu') + '</span></div>' +
      '<div class="tp-row"><span>No. WA</span><span>' + escapeHtml(order.customerPhone || '-') + '</span></div>' +
      '<div class="tp-row"><span>Layanan</span><span>' + deliveryLine + '</span></div>' +
      '<div class="tp-row"><span>Parfum</span><span>' + escapeHtml(order.fragrance) + '</span></div>' +
      (order.note ? '<div class="tp-row"><span>Catatan</span><span>' + escapeHtml(order.note) + '</span></div>' : '') +
      '<hr class="tp-divider">' +
      itemsHtml +
      '<hr class="tp-divider">' +
      '<div class="tp-row"><span>Subtotal</span><span>' + formatRp(fin.subtotal) + '</span></div>' +
      (fin.discount > 0 ? '<div class="tp-row"><span>Diskon</span><span>-' + formatRp(fin.discount) + '</span></div>' : '') +
      '<div class="tp-row tp-bold"><span>TOTAL</span><span>' + formatRp(fin.finalTotal) + '</span></div>' +
      '<div class="tp-row"><span>Status</span><span class="tp-bold">' + escapeHtml(order.paymentStatus.toUpperCase()) + '</span></div>' +
      '<div class="tp-row"><span>Dibayar</span><span>' + formatRp(fin.paidAmount) + '</span></div>' +
      '<div class="tp-row tp-bold"><span>Sisa Tagihan</span><span>' + formatRp(fin.remaining) + '</span></div>' +
      '<hr class="tp-divider">' +
      '<div class="tp-foot">' +
        '<div>Cek status cucian dengan kode:</div>' +
        '<div class="tp-bold">' + escapeHtml(order.code) + '</div>' +
        '<div style="margin-top:4px">' + escapeHtml(state.outlet.footer) + '</div>' +
      '</div>'
    );
  }

  function syncPaperWidthButtons() {
    document.querySelectorAll('.paper-switch .paper-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-width') === state.paperWidth);
    });
    ['liveThermalPreview', 'modalThermalPaper'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('w-58', 'w-80');
      el.classList.add(state.paperWidth === '80' ? 'w-80' : 'w-58');
    });
  }

  function printOrderReceipt(order) {
    var printBox = document.getElementById('printContainer');
    printBox.innerHTML = '<div class="thermal-paper w-' + state.paperWidth + '">' + buildThermalHtml(order) + '</div>';
    window.print();
  }

  /* -------------------- WHATSAPP MESSAGE BUILDER -------------------- */
  function buildWaMessage(order, mode) {
    var fin = computeFinancials(order.items, order.discount, order.paymentStatus, order.paidAmount);
    var itemLines = order.items.map(function (it) {
      var lineTotal = Math.round(roundQty(it.qty) * it.price);
      return '• ' + formatQty(it.qty, it.unit) + ' ' + it.name + ' = ' + formatRp(lineTotal);
    }).join('\n');

    var headerGreeting = '';
    if (mode === 'ready' || order.stage === 'Siap Diambil') {
      headerGreeting = '*KABAR GEMBIRA! CUCIAN SIAP DIAMBIL*';
    } else {
      headerGreeting = '*NOTA & STATUS LAUNDRY (' + order.stage.toUpperCase() + ')*';
    }

    var deliveryInfo = order.deliveryType === 'antar-jemput'
      ? 'Layanan Antar-Jemput ke: ' + (order.address || 'alamat terdaftar')
      : 'Silakan diambil di outlet: ' + state.outlet.name + ' (' + state.outlet.address + ')';

    var payLine = fin.remaining > 0
      ? 'Status Bayar: *' + order.paymentStatus + '* (Sudah Bayar ' + formatRp(fin.paidAmount) + ' | *Sisa Tagihan: ' + formatRp(fin.remaining) + '*)'
      : 'Status Bayar: *LUNAS*';

    return (
      headerGreeting + '\n' +
      '-----------------------------\n' +
      'Outlet: *' + state.outlet.name + '*\n' +
      'Kode Order: *' + order.code + '*\n' +
      'Pelanggan: ' + order.customerName + '\n' +
      'Parfum: ' + order.fragrance + '\n\n' +
      '*Rincian Item:*\n' + itemLines + '\n\n' +
      (fin.discount > 0 ? 'Diskon: -' + formatRp(fin.discount) + '\n' : '') +
      'Total Tagihan: *' + formatRp(fin.finalTotal) + '*\n' +
      payLine + '\n' +
      'Estimasi Selesai: ' + formatDateTime(order.estimatedReadyAt) + '\n\n' +
      deliveryInfo + '\n' +
      'Terima kasih telah mempercayakan cucian Anda!'
    );
  }

  function openWaNotification(order, mode) {
    var phone = normalizeWaPhone(order.customerPhone);
    if (!phone) {
      showToast('Nomor WhatsApp pelanggan belum valid.', 'warn');
      return;
    }
    var text = buildWaMessage(order, mode);
    var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener');
  }

  /* -------------------- TAB 1: KASIR ORDER BARU -------------------- */
  function renderPresetGrid() {
    var grid = document.getElementById('presetGrid');
    grid.innerHTML = SERVICE_PRESETS.map(function (p) {
      return (
        '<button type="button" class="preset-btn" data-preset-id="' + p.id + '">' +
          '<div class="preset-top">' +
            '<span class="preset-name">' + escapeHtml(p.name) + '</span>' +
            '<span class="preset-mode ' + p.mode + '">' + escapeHtml(p.mode) + '</span>' +
          '</div>' +
          '<div class="preset-meta">' + formatRp(p.price) + '/' + escapeHtml(p.unit) + ' • Est. ' + p.hours + ' jam</div>' +
        '</button>'
      );
    }).join('');
  }

  function getDraftOrderObject() {
    var custName = document.getElementById('custName').value.trim();
    var custPhone = document.getElementById('custPhone').value.trim();
    var custAddress = document.getElementById('custAddress').value.trim();
    var orderNote = document.getElementById('orderNote').value.trim();
    var discount = document.getElementById('orderDiscount').value;
    var dpAmount = document.getElementById('orderDpAmount').value;
    var nowIso = new Date().toISOString();
    var fin = computeFinancials(state.draft.items, discount, state.draft.paymentStatus, dpAmount);

    return {
      code: state.draft.code,
      customerName: custName,
      customerPhone: custPhone,
      deliveryType: state.draft.deliveryType,
      address: state.draft.deliveryType === 'antar-jemput' ? custAddress : '',
      note: orderNote,
      items: state.draft.items.map(function (it) { return Object.assign({}, it); }),
      fragrance: state.draft.fragrance,
      discount: fin.discount,
      subtotal: fin.subtotal,
      finalTotal: fin.finalTotal,
      paymentStatus: state.draft.paymentStatus,
      paidAmount: fin.paidAmount,
      remaining: fin.remaining,
      stage: 'Diterima',
      createdAt: nowIso,
      estimatedReadyAt: computeEstimateIso(state.draft.items, Date.now()),
      stageHistory: { 'Diterima': nowIso }
    };
  }

  function renderCartAndPreview() {
    var cartEl = document.getElementById('cartList');
    document.getElementById('cartItemCount').textContent = String(state.draft.items.length);
    document.getElementById('previewOrderCode').textContent = state.draft.code;

    if (!state.draft.items.length) {
      cartEl.innerHTML = '<div class="cart-empty">Belum ada item cucian. Klik paket preset di atas untuk menambahkan layanan Kiloan atau Satuan.</div>';
    } else {
      cartEl.innerHTML = state.draft.items.map(function (item, idx) {
        var stepVal = item.unit === 'kg' ? '0.1' : '1';
        var minVal = item.unit === 'kg' ? '0.1' : '1';
        var lineTotal = Math.round(roundQty(item.qty) * item.price);
        return (
          '<div class="cart-item" data-index="' + idx + '">' +
            '<div>' +
              '<div class="cart-item-title">' + escapeHtml(item.name) + '</div>' +
              '<div class="cart-item-sub">' + formatRp(item.price) + ' / ' + escapeHtml(item.unit) + ' • Est. ' + item.hours + ' jam</div>' +
            '</div>' +
            '<div class="qty-control">' +
              '<input type="number" class="input qty-input" data-cart-qty="' + idx + '" value="' + item.qty + '" min="' + minVal + '" step="' + stepVal + '" aria-label="Berat atau jumlah">' +
              '<span class="qty-unit">' + escapeHtml(item.unit) + '</span>' +
            '</div>' +
            '<div class="cart-line-total">' + formatRp(lineTotal) + '</div>' +
            '<button type="button" class="btn btn-danger-soft btn-xs" data-cart-remove="' + idx + '" aria-label="Hapus item">&times;</button>' +
          '</div>'
        );
      }).join('');
    }

    var draftOrder = getDraftOrderObject();
    document.getElementById('estimateDisplay').textContent = state.draft.items.length
      ? formatDateTime(draftOrder.estimatedReadyAt)
      : 'Pilih layanan dulu';

    document.getElementById('sumSubtotal').textContent = formatRp(draftOrder.subtotal);
    document.getElementById('sumDiscount').textContent = '- ' + formatRp(draftOrder.discount);
    document.getElementById('sumTotal').textContent = formatRp(draftOrder.finalTotal);
    document.getElementById('sumPaid').textContent = formatRp(draftOrder.paidAmount);
    document.getElementById('sumRemaining').textContent = formatRp(draftOrder.remaining);
    document.getElementById('dpRemainingDisplay').textContent = formatRp(draftOrder.remaining);

    document.getElementById('liveThermalPreview').innerHTML = buildThermalHtml(draftOrder);
    syncPaperWidthButtons();
  }

  function resetKasirForm() {
    document.getElementById('custName').value = '';
    document.getElementById('custPhone').value = '';
    document.getElementById('custAddress').value = '';
    document.getElementById('orderNote').value = '';
    document.getElementById('orderDiscount').value = '0';
    document.getElementById('orderDpAmount').value = '20000';
    state.draft = {
      code: generateUniqueCode(state.orders),
      deliveryType: 'outlet',
      fragrance: 'Lavender',
      paymentStatus: 'Lunas',
      items: [
        { name: 'Cuci Komplit Reguler (2 Hari)', mode: 'kiloan', unit: 'kg', qty: 2.5, price: 7000, hours: 48 }
      ]
    };

    document.querySelectorAll('#deliveryToggleGroup .seg-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-delivery') === 'outlet');
    });
    document.getElementById('deliveryAddressGroup').classList.add('hidden');

    document.querySelectorAll('#fragranceGroup .choice-chip').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-fragrance') === 'Lavender');
    });

    document.querySelectorAll('#paymentStatusGroup .seg-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-pay') === 'Lunas');
    });
    document.getElementById('dpInputGroup').classList.add('hidden');
    renderCartAndPreview();
  }

  function submitNewOrder(shouldPrintImmediately) {
    var order = getDraftOrderObject();
    if (!order.customerName) {
      showToast('Masukkan nama pelanggan terlebih dahulu.', 'warn');
      document.getElementById('custName').focus();
      return;
    }
    if (!order.customerPhone || order.customerPhone.replace(/\D/g, '').length < 8) {
      showToast('Masukkan nomor WhatsApp yang valid.', 'warn');
      document.getElementById('custPhone').focus();
      return;
    }
    if (order.deliveryType === 'antar-jemput' && !order.address) {
      showToast('Alamat antar-jemput wajib diisi.', 'warn');
      document.getElementById('custAddress').focus();
      return;
    }
    if (!order.items.length || order.items.some(function (it) { return roundQty(it.qty) <= 0; })) {
      showToast('Tambahkan minimal 1 item cucian dengan berat/qty > 0.', 'warn');
      return;
    }

    state.orders.unshift(order);
    saveOrders();
    renderAllViews();
    showToast('Order ' + order.code + ' berhasil disimpan!', 'success');

    if (shouldPrintImmediately) {
      printOrderReceipt(order);
    } else {
      openReceiptModal(order.code);
    }
    resetKasirForm();
  }

  /* -------------------- TAB 2: BOARD PRODUKSI -------------------- */
  function getPaymentBadge(order) {
    if (order.paymentStatus === 'Lunas' || order.remaining <= 0) {
      return '<span class="badge badge-paid">Lunas</span>';
    }
    if (order.paymentStatus === 'DP Sebagian') {
      return '<span class="badge badge-dp">DP • Sisa ' + formatRp(order.remaining) + '</span>';
    }
    return '<span class="badge badge-unpaid">Belum Bayar • ' + formatRp(order.remaining) + '</span>';
  }

  function buildOrderCardHtml(order) {
    var meta = STAGE_META[order.stage] || STAGE_META['Diterima'];
    var itemsText = order.items.map(function (it) {
      return '<div>• <strong>' + escapeHtml(formatQty(it.qty, it.unit)) + '</strong> ' + escapeHtml(it.name) + '</div>';
    }).join('');

    var settleBtn = order.remaining > 0
      ? '<button type="button" class="btn btn-success btn-xs" data-action="settle" data-code="' + order.code + '">Tandai Lunas</button>'
      : '';

    var advanceBtn = meta.nextLabel
      ? '<button type="button" class="btn btn-primary btn-xs btn-advance" data-action="advance" data-code="' + order.code + '">' + escapeHtml(meta.nextLabel) + ' &rarr;</button>'
      : '';

    var waLabel = order.stage === 'Siap Diambil' ? 'Notif WA Siap Diambil' : 'Kirim WA';

    return (
      '<article class="order-card" data-code="' + order.code + '">' +
        '<div class="order-card-top">' +
          '<span class="order-code">' + escapeHtml(order.code) + '</span>' +
          '<button type="button" class="btn-link danger" data-action="delete" data-code="' + order.code + '" title="Hapus Order">&times;</button>' +
        '</div>' +
        '<div>' +
          '<div class="order-customer">' + escapeHtml(order.customerName) + '</div>' +
          '<div class="order-phone">' + escapeHtml(order.customerPhone) + ' • ' + (order.deliveryType === 'antar-jemput' ? 'Antar-Jemput' : 'Ambil Outlet') + '</div>' +
          (order.deliveryType === 'antar-jemput' && order.address ? '<div class="order-phone">' + escapeHtml(order.address) + '</div>' : '') +
        '</div>' +
        '<div class="badge-row">' +
          '<span class="badge ' + meta.badge + '">' + escapeHtml(order.stage) + '</span>' +
          getPaymentBadge(order) +
          '<span class="badge badge-neutral">' + escapeHtml(order.fragrance) + '</span>' +
        '</div>' +
        '<div class="order-items-mini">' + itemsText + '</div>' +
        '<div class="order-meta-line">' +
          '<span>Est: ' + escapeHtml(formatShortTime(order.estimatedReadyAt)) + '</span>' +
          '<span class="order-amount">' + formatRp(order.finalTotal) + '</span>' +
        '</div>' +
        '<div class="order-card-actions">' +
          advanceBtn +
          settleBtn +
          '<button type="button" class="btn btn-wa btn-xs" data-action="wa" data-code="' + order.code + '">' + waLabel + '</button>' +
          '<button type="button" class="btn btn-outline btn-xs" data-action="receipt" data-code="' + order.code + '">Nota</button>' +
        '</div>' +
      '</article>'
    );
  }

  function renderBoard() {
    var counts = { ALL: state.orders.length };
    STAGES.forEach(function (st) { counts[st] = 0; });
    state.orders.forEach(function (o) {
      if (counts[o.stage] != null) counts[o.stage]++;
    });

    var filterHtml = '<button type="button" class="filter-pill' + (state.boardStageFilter === 'ALL' ? ' active' : '') + '" data-stage-filter="ALL">Semua <span class="filter-count">' + counts.ALL + '</span></button>';
    STAGES.forEach(function (st) {
      filterHtml += '<button type="button" class="filter-pill' + (state.boardStageFilter === st ? ' active' : '') + '" data-stage-filter="' + st + '">' + st + ' <span class="filter-count">' + counts[st] + '</span></button>';
    });
    document.getElementById('stageFilterBar').innerHTML = filterHtml;

    var q = state.boardSearch.trim().toLowerCase();
    var filtered = state.orders.filter(function (o) {
      if (state.boardStageFilter !== 'ALL' && o.stage !== state.boardStageFilter) return false;
      if (state.boardPayFilter === 'UNPAID' && o.remaining <= 0) return false;
      if (state.boardPayFilter === 'PAID' && o.remaining > 0) return false;
      if (!q) return true;
      return (
        o.code.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
      );
    });

    var container = document.getElementById('boardContainer');
    if (state.boardLayout === 'kanban' && state.boardStageFilter === 'ALL') {
      container.innerHTML = '<div class="kanban-board">' + STAGES.map(function (st) {
        var colOrders = filtered.filter(function (o) { return o.stage === st; });
        var meta = STAGE_META[st];
        return (
          '<div class="kanban-col">' +
            '<div class="kanban-col-head">' +
              '<span class="kanban-col-title"><span class="stage-dot ' + meta.dot + '"></span>' + st + '</span>' +
              '<span class="tab-badge">' + colOrders.length + '</span>' +
            '</div>' +
            (colOrders.length ? colOrders.map(buildOrderCardHtml).join('') : '<div class="empty-col">Tidak ada order</div>') +
          '</div>'
        );
      }).join('') + '</div>';
    } else {
      if (!filtered.length) {
        container.innerHTML = '<div class="card"><div class="cart-empty">Tidak ditemukan order yang cocok dengan filter pencarian.</div></div>';
      } else {
        container.innerHTML = '<div class="cards-grid">' + filtered.map(buildOrderCardHtml).join('') + '</div>';
      }
    }
  }

  /* -------------------- TAB 3: CEK STATUS PELANGGAN -------------------- */
  function renderTracking() {
    var chipsBox = document.getElementById('trackingSampleChips');
    var sampleOrders = state.orders.slice(0, 6);
    chipsBox.innerHTML = sampleOrders.map(function (o) {
      return '<button type="button" class="sample-chip" data-sample-code="' + escapeHtml(o.code) + '">' + escapeHtml(o.code) + ' (' + escapeHtml(o.stage) + ')</button>';
    }).join('');

    var q = state.trackingQuery.trim().toLowerCase();
    var resultBox = document.getElementById('trackingResult');
    if (!q) {
      resultBox.innerHTML = '<div class="card tracking-result-card"><div class="cart-empty">Masukkan kode order atau pilih salah satu contoh chip di atas untuk melihat pelacakan status cucian.</div></div>';
      return;
    }

    var qDigits = q.replace(/\D/g, '');
    var matches = state.orders.filter(function (o) {
      if (o.code.toLowerCase() === q) return true;
      if (qDigits.length >= 6 && o.customerPhone.replace(/\D/g, '').includes(qDigits)) return true;
      return o.code.toLowerCase().includes(q);
    });

    if (!matches.length) {
      resultBox.innerHTML = '<div class="card tracking-result-card"><div class="cart-empty">Order dengan kata kunci <strong>' + escapeHtml(state.trackingQuery) + '</strong> tidak ditemukan. Periksa kembali kode nota Anda.</div></div>';
      return;
    }

    var order = matches[0];
    var currentIdx = STAGES.indexOf(order.stage);
    var history = order.stageHistory || {};

    var multiBanner = matches.length > 1
      ? '<div style="margin-bottom:14px;display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span class="sample-label">Ditemukan ' + matches.length + ' order terkait:</span>' +
        matches.map(function (m) {
          return '<button type="button" class="sample-chip" data-sample-code="' + escapeHtml(m.code) + '">' + escapeHtml(m.code) + ' • ' + escapeHtml(m.stage) + '</button>';
        }).join('') + '</div>'
      : '';

    var stepperHtml = '<div class="stepper">' + STAGES.map(function (st, idx) {
      var cls = idx < currentIdx ? 'done' : (idx === currentIdx ? 'current' : '');
      var icon = idx < currentIdx ? '&#10003;' : String(idx + 1);
      var timeStr = history[st] ? formatShortTime(history[st]) : (idx > currentIdx ? 'Menunggu' : '');
      return (
        '<div class="step-item ' + cls + '">' +
          '<div class="step-circle">' + icon + '</div>' +
          '<div>' +
            '<div class="step-label">' + st + '</div>' +
            '<div class="step-time">' + escapeHtml(timeStr) + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('') + '</div>';

    var itemsRows = order.items.map(function (it) {
      var lineTotal = Math.round(roundQty(it.qty) * it.price);
      return (
        '<tr>' +
          '<td>' + escapeHtml(it.name) + '</td>' +
          '<td>' + escapeHtml(formatQty(it.qty, it.unit)) + '</td>' +
          '<td>' + formatRp(it.price) + '</td>' +
          '<td><strong>' + formatRp(lineTotal) + '</strong></td>' +
        '</tr>'
      );
    }).join('');

    resultBox.innerHTML =
      '<div class="card tracking-result-card">' +
        multiBanner +
        '<div class="card-head">' +
          '<div>' +
            '<div class="badge-row" style="margin-bottom:6px">' +
              '<span class="code-chip">' + escapeHtml(order.code) + '</span>' +
              '<span class="badge ' + STAGE_META[order.stage].badge + '">' + escapeHtml(order.stage) + '</span>' +
              getPaymentBadge(order) +
            '</div>' +
            '<h2 class="card-title">' + escapeHtml(order.customerName) + ' (' + escapeHtml(order.customerPhone) + ')</h2>' +
            '<p class="card-sub">Masuk: ' + escapeHtml(formatDateTime(order.createdAt)) + ' • Estimasi Selesai: <strong>' + escapeHtml(formatDateTime(order.estimatedReadyAt)) + '</strong></p>' +
          '</div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
            '<button type="button" class="btn btn-outline btn-sm" data-track-receipt="' + escapeHtml(order.code) + '">Lihat Nota</button>' +
            '<button type="button" class="btn btn-wa btn-sm" data-track-wa="' + escapeHtml(order.code) + '">Kirim Update WA</button>' +
          '</div>' +
        '</div>' +
        stepperHtml +
        '<div class="tracking-details-grid">' +
          '<div class="info-panel">' +
            '<h3>Rincian Item Cucian</h3>' +
            '<div class="table-wrap">' +
              '<table class="data-table">' +
                '<thead><tr><th>Layanan</th><th>Jumlah</th><th>Harga</th><th>Subtotal</th></tr></thead>' +
                '<tbody>' + itemsRows + '</tbody>' +
              '</table>' +
            '</div>' +
          '</div>' +
          '<div class="info-panel">' +
            '<h3>Info Layanan &amp; Pembayaran</h3>' +
            '<div class="kv-list">' +
              '<div class="kv-row"><span>Pengambilan</span><strong>' + (order.deliveryType === 'antar-jemput' ? 'Antar-Jemput Kurir' : 'Ambil di Outlet') + '</strong></div>' +
              (order.address ? '<div class="kv-row"><span>Alamat</span><strong>' + escapeHtml(order.address) + '</strong></div>' : '') +
              '<div class="kv-row"><span>Parfum</span><strong>' + escapeHtml(order.fragrance) + '</strong></div>' +
              (order.note ? '<div class="kv-row"><span>Catatan</span><strong>' + escapeHtml(order.note) + '</strong></div>' : '') +
              '<hr class="divider" style="margin:6px 0">' +
              '<div class="kv-row"><span>Subtotal</span><strong>' + formatRp(order.subtotal) + '</strong></div>' +
              '<div class="kv-row"><span>Diskon</span><strong>- ' + formatRp(order.discount) + '</strong></div>' +
              '<div class="kv-row"><span>Total Tagihan</span><strong>' + formatRp(order.finalTotal) + '</strong></div>' +
              '<div class="kv-row"><span>Sudah Dibayar</span><strong class="text-success">' + formatRp(order.paidAmount) + '</strong></div>' +
              '<div class="kv-row"><span>Sisa Tagihan</span><strong class="' + (order.remaining > 0 ? 'text-warn' : 'text-success') + '">' + formatRp(order.remaining) + '</strong></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* -------------------- TAB 4: LAPORAN & EXPORT -------------------- */
  function renderLaporan() {
    var totalPaid = 0;
    var totalUnpaid = 0;
    var unpaidCount = 0;
    var paidFullCount = 0;
    var totalKg = 0;
    var totalSatuanCount = 0;
    var activeCount = 0;
    var readyCount = 0;
    var kiloanRev = 0;
    var satuanRev = 0;

    var dailyMap = {};
    var stageCounts = {};
    STAGES.forEach(function (st) { stageCounts[st] = 0; });

    state.orders.forEach(function (o) {
      totalPaid += Number(o.paidAmount) || 0;
      totalUnpaid += Number(o.remaining) || 0;
      if (o.remaining > 0) unpaidCount++;
      else paidFullCount++;

      if (o.stage !== 'Selesai') activeCount++;
      if (o.stage === 'Siap Diambil') readyCount++;
      if (stageCounts[o.stage] != null) stageCounts[o.stage]++;

      var orderKg = 0;
      o.items.forEach(function (it) {
        var lineVal = Math.round(roundQty(it.qty) * it.price);
        if (it.unit === 'kg') {
          orderKg += roundQty(it.qty);
          kiloanRev += lineVal;
        } else {
          totalSatuanCount += roundQty(it.qty);
          satuanRev += lineVal;
        }
      });
      totalKg += orderKg;

      var dKey = toDateKey(o.createdAt);
      if (!dailyMap[dKey]) {
        dailyMap[dKey] = { dateKey: dKey, orders: 0, kg: 0, total: 0, paid: 0, unpaid: 0 };
      }
      dailyMap[dKey].orders += 1;
      dailyMap[dKey].kg = roundQty(dailyMap[dKey].kg + orderKg);
      dailyMap[dKey].total += Number(o.finalTotal) || 0;
      dailyMap[dKey].paid += Number(o.paidAmount) || 0;
      dailyMap[dKey].unpaid += Number(o.remaining) || 0;
    });

    totalKg = roundQty(totalKg);

    document.getElementById('kpiPaidRevenue').textContent = formatRp(totalPaid);
    document.getElementById('kpiPaidNote').textContent = paidFullCount + ' order lunas penuh + DP masuk';
    document.getElementById('kpiUnpaidReceivable').textContent = formatRp(totalUnpaid);
    document.getElementById('kpiUnpaidNote').textContent = unpaidCount + ' order menunggu pelunasan';
    document.getElementById('kpiTotalKg').textContent = totalKg.toFixed(1).replace(/\.0$/, '') + ' kg';
    document.getElementById('kpiKgNote').textContent = 'Plus ' + totalSatuanCount + ' item layanan satuan';
    document.getElementById('kpiActiveOrders').textContent = String(activeCount);
    document.getElementById('kpiActiveNote').textContent = readyCount + ' order siap diambil pelanggan';

    var days = Object.keys(dailyMap).sort().map(function (k) { return dailyMap[k]; });
    var maxDayTotal = days.reduce(function (m, d) { return Math.max(m, d.total); }, 1);

    document.getElementById('dailyRevenueChart').innerHTML = days.length
      ? days.map(function (d) {
        var hTotal = Math.max(6, Math.round((d.total / maxDayTotal) * 100));
        var hPaid = Math.max(4, Math.round((d.paid / maxDayTotal) * 100));
        return (
          '<div class="chart-col" title="' + formatDateLabel(d.dateKey) + ': Tagihan ' + formatRp(d.total) + ' | Terbayar ' + formatRp(d.paid) + '">' +
            '<div class="chart-val">' + Math.round(d.total / 1000) + 'k</div>' +
            '<div class="chart-bar-wrap">' +
              '<div class="chart-bar total" style="height:' + hTotal + '%"></div>' +
              '<div class="chart-bar paid" style="height:' + hPaid + '%"></div>' +
            '</div>' +
            '<div class="chart-label">' + escapeHtml(formatDateLabel(d.dateKey)) + '</div>' +
          '</div>'
        );
      }).join('')
      : '<div class="cart-empty" style="width:100%">Belum ada data transaksi.</div>';

    document.getElementById('dailyRevenueTableBody').innerHTML = days.slice().reverse().map(function (d) {
      return (
        '<tr>' +
          '<td><strong>' + escapeHtml(formatDateLabel(d.dateKey)) + '</strong></td>' +
          '<td>' + d.orders + '</td>' +
          '<td>' + d.kg.toFixed(1).replace(/\.0$/, '') + ' kg</td>' +
          '<td>' + formatRp(d.total) + '</td>' +
          '<td class="text-success">' + formatRp(d.paid) + '</td>' +
          '<td class="' + (d.unpaid > 0 ? 'text-warn' : '') + '">' + formatRp(d.unpaid) + '</td>' +
        '</tr>'
      );
    }).join('');

    var totalOrdersCount = Math.max(1, state.orders.length);
    document.getElementById('stageBreakdownBox').innerHTML = STAGES.map(function (st) {
      var cnt = stageCounts[st] || 0;
      var pct = Math.round((cnt / totalOrdersCount) * 100);
      return (
        '<div class="breakdown-row">' +
          '<div class="breakdown-top"><span>' + st + '</span><span>' + cnt + ' order (' + pct + '%)</span></div>' +
          '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '</div>'
      );
    }).join('');

    var grossSvc = Math.max(1, kiloanRev + satuanRev);
    var kiloanPct = Math.round((kiloanRev / grossSvc) * 100);
    var satuanPct = 100 - kiloanPct;
    document.getElementById('serviceBreakdownBox').innerHTML =
      '<div class="breakdown-row">' +
        '<div class="breakdown-top"><span>Laundry Kiloan</span><span>' + formatRp(kiloanRev) + ' (' + kiloanPct + '%)</span></div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + kiloanPct + '%"></div></div>' +
      '</div>' +
      '<div class="breakdown-row">' +
        '<div class="breakdown-top"><span>Laundry Satuan</span><span>' + formatRp(satuanRev) + ' (' + satuanPct + '%)</span></div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + satuanPct + '%;background:var(--accent)"></div></div>' +
      '</div>';
  }

  function exportOrdersCsv() {
    if (!state.orders.length) {
      showToast('Tidak ada data order untuk diekspor.', 'warn');
      return;
    }

    var headers = [
      'Kode Order', 'Tanggal Masuk', 'Pelanggan', 'No WA', 'Layanan Pengambilan',
      'Alamat', 'Rincian Item', 'Total Kg', 'Parfum', 'Subtotal', 'Diskon',
      'Total Tagihan', 'Status Bayar', 'Sudah Dibayar', 'Sisa Tagihan',
      'Tahap Produksi', 'Estimasi Selesai'
    ];

    function csvCell(val) {
      var s = String(val == null ? '' : val).replace(/"/g, '""');
      return '"' + s + '"';
    }

    var rows = state.orders.map(function (o) {
      var kgSum = o.items.reduce(function (sum, it) {
        return sum + (it.unit === 'kg' ? roundQty(it.qty) : 0);
      }, 0);
      var itemSummary = o.items.map(function (it) {
        return formatQty(it.qty, it.unit) + ' ' + it.name;
      }).join(' | ');

      return [
        o.code,
        formatDateTime(o.createdAt),
        o.customerName,
        o.customerPhone,
        o.deliveryType,
        o.address || '-',
        itemSummary,
        roundQty(kgSum),
        o.fragrance,
        o.subtotal,
        o.discount,
        o.finalTotal,
        o.paymentStatus,
        o.paidAmount,
        o.remaining,
        o.stage,
        formatDateTime(o.estimatedReadyAt)
      ].map(csvCell).join(',');
    });

    var csvContent = '\uFEFF' + headers.map(csvCell).join(',') + '\r\n' + rows.join('\r\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'laporan-laundry-' + toDateKey(new Date().toISOString()) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('File CSV laporan laundry berhasil diunduh.', 'success');
  }

  /* -------------------- MODALS -------------------- */
  function openReceiptModal(code) {
    var order = state.orders.find(function (o) { return o.code === code; });
    if (!order) return;
    state.modalOrderCode = code;
    document.getElementById('receiptModalCode').textContent = order.code + ' • ' + order.customerName;
    document.getElementById('modalThermalPaper').innerHTML = buildThermalHtml(order);
    syncPaperWidthButtons();
    document.getElementById('receiptModal').classList.remove('hidden');
  }

  function closeReceiptModal() {
    document.getElementById('receiptModal').classList.add('hidden');
  }

  function openSettingsModal() {
    document.getElementById('setOutletName').value = state.outlet.name;
    document.getElementById('setOutletAddress').value = state.outlet.address;
    document.getElementById('setOutletPhone').value = state.outlet.phone;
    document.getElementById('setOutletFooter').value = state.outlet.footer;
    document.getElementById('settingsModal').classList.remove('hidden');
  }

  function closeSettingsModal() {
    document.getElementById('settingsModal').classList.add('hidden');
  }

  function handleResetDemo() {
    if (!window.confirm('Kembalikan data ke 6 order demo awal? Perubahan order Anda saat ini akan diganti.')) {
      return;
    }
    state.orders = buildSeedOrders();
    saveOrders();
    state.draft.code = generateUniqueCode(state.orders);
    state.trackingQuery = 'LDR-2401';
    document.getElementById('trackingInput').value = 'LDR-2401';
    renderAllViews();
    showToast('Data demo (6 order) berhasil dipulihkan.', 'success');
  }

  /* -------------------- RENDER ORCHESTRATOR -------------------- */
  function renderAllViews() {
    renderOutletHeader();
    renderCartAndPreview();
    renderBoard();
    renderTracking();
    renderLaporan();
  }

  function switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.view-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'view-' + tabName);
    });
  }

  /* -------------------- EVENT WIRING -------------------- */
  function bindEvents() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchTab(btn.getAttribute('data-tab'));
      });
    });

    // Theme toggles
    document.getElementById('themeToggleBtn').addEventListener('click', function () {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });
    document.getElementById('laporanThemeBtn').addEventListener('click', function () {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    // Reset Demo triggers
    document.getElementById('headerResetDemoBtn').addEventListener('click', handleResetDemo);
    document.getElementById('laporanResetDemoBtn').addEventListener('click', handleResetDemo);
    document.getElementById('settingsResetDemoBtn').addEventListener('click', function () {
      closeSettingsModal();
      handleResetDemo();
    });

    // Settings modal
    document.getElementById('openSettingsBtn').addEventListener('click', openSettingsModal);
    document.getElementById('closeSettingsModalBtn').addEventListener('click', closeSettingsModal);
    document.getElementById('settingsForm').addEventListener('submit', function (e) {
      e.preventDefault();
      state.outlet = {
        name: document.getElementById('setOutletName').value.trim() || DEFAULT_OUTLET.name,
        address: document.getElementById('setOutletAddress').value.trim() || DEFAULT_OUTLET.address,
        phone: document.getElementById('setOutletPhone').value.trim() || DEFAULT_OUTLET.phone,
        footer: document.getElementById('setOutletFooter').value.trim() || DEFAULT_OUTLET.footer
      };
      saveOutlet();
      closeSettingsModal();
      renderAllViews();
      showToast('Profil outlet disimpan.', 'success');
    });

    // Kasir inputs live preview
    ['custName', 'custPhone', 'custAddress', 'orderNote', 'orderDiscount', 'orderDpAmount'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', renderCartAndPreview);
    });

    // Delivery toggle
    document.getElementById('deliveryToggleGroup').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-delivery]');
      if (!btn) return;
      state.draft.deliveryType = btn.getAttribute('data-delivery');
      document.querySelectorAll('#deliveryToggleGroup .seg-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      document.getElementById('deliveryAddressGroup').classList.toggle('hidden', state.draft.deliveryType !== 'antar-jemput');
      renderCartAndPreview();
    });

    // Preset click
    document.getElementById('presetGrid').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-preset-id]');
      if (!btn) return;
      var preset = SERVICE_PRESETS.find(function (p) { return p.id === btn.getAttribute('data-preset-id'); });
      if (!preset) return;
      var existing = state.draft.items.find(function (it) { return it.name === preset.name && it.price === preset.price; });
      if (existing) {
        existing.qty = roundQty(existing.qty + 1);
      } else {
        state.draft.items.push({
          name: preset.name,
          mode: preset.mode,
          unit: preset.unit,
          qty: 1,
          price: preset.price,
          hours: preset.hours
        });
      }
      renderCartAndPreview();
    });

    // Custom item add
    document.getElementById('addCustomItemBtn').addEventListener('click', function () {
      var name = document.getElementById('customName').value.trim();
      var modeParts = document.getElementById('customMode').value.split('|');
      var qty = roundQty(document.getElementById('customQty').value);
      var price = Math.round(Number(document.getElementById('customPrice').value) || 0);
      var hours = Math.max(1, Math.round(Number(document.getElementById('customHours').value) || 24));

      if (!name || qty <= 0 || price <= 0) {
        showToast('Isi nama layanan, jumlah > 0, dan harga > 0.', 'warn');
        return;
      }
      state.draft.items.push({
        name: name,
        mode: modeParts[0],
        unit: modeParts[1],
        qty: qty,
        price: price,
        hours: hours
      });
      document.getElementById('customName').value = '';
      renderCartAndPreview();
      showToast('Layanan kustom ditambahkan ke keranjang.', 'success');
    });

    // Cart quantity change & remove
    document.getElementById('cartList').addEventListener('input', function (e) {
      var idx = e.target.getAttribute('data-cart-qty');
      if (idx == null) return;
      var item = state.draft.items[Number(idx)];
      if (!item) return;
      var parsed = parseFloat(e.target.value);
      if (!isNaN(parsed) && parsed >= 0) {
        item.qty = roundQty(parsed);
        var row = e.target.closest('.cart-item');
        if (row) {
          row.querySelector('.cart-line-total').textContent = formatRp(Math.round(item.qty * item.price));
        }
        var draftOrder = getDraftOrderObject();
        document.getElementById('estimateDisplay').textContent = formatDateTime(draftOrder.estimatedReadyAt);
        document.getElementById('sumSubtotal').textContent = formatRp(draftOrder.subtotal);
        document.getElementById('sumDiscount').textContent = '- ' + formatRp(draftOrder.discount);
        document.getElementById('sumTotal').textContent = formatRp(draftOrder.finalTotal);
        document.getElementById('sumPaid').textContent = formatRp(draftOrder.paidAmount);
        document.getElementById('sumRemaining').textContent = formatRp(draftOrder.remaining);
        document.getElementById('dpRemainingDisplay').textContent = formatRp(draftOrder.remaining);
        document.getElementById('liveThermalPreview').innerHTML = buildThermalHtml(draftOrder);
      }
    });

    document.getElementById('cartList').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cart-remove]');
      if (!btn) return;
      var idx = Number(btn.getAttribute('data-cart-remove'));
      state.draft.items.splice(idx, 1);
      renderCartAndPreview();
    });

    document.getElementById('clearCartBtn').addEventListener('click', function () {
      state.draft.items = [];
      renderCartAndPreview();
    });

    // Fragrance selector
    document.getElementById('fragranceGroup').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-fragrance]');
      if (!btn) return;
      state.draft.fragrance = btn.getAttribute('data-fragrance');
      document.querySelectorAll('#fragranceGroup .choice-chip').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      renderCartAndPreview();
    });

    // Payment status selector
    document.getElementById('paymentStatusGroup').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-pay]');
      if (!btn) return;
      state.draft.paymentStatus = btn.getAttribute('data-pay');
      document.querySelectorAll('#paymentStatusGroup .seg-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      document.getElementById('dpInputGroup').classList.toggle('hidden', state.draft.paymentStatus !== 'DP Sebagian');
      renderCartAndPreview();
    });

    // Save / Print buttons
    document.getElementById('saveOrderBtn').addEventListener('click', function () {
      submitNewOrder(false);
    });
    document.getElementById('printDraftBtn').addEventListener('click', function () {
      submitNewOrder(true);
    });
    document.getElementById('resetOrderFormBtn').addEventListener('click', resetKasirForm);

    // Paper width switches (both live preview and modal stay synced)
    document.querySelectorAll('.paper-switch').forEach(function (group) {
      group.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-width]');
        if (!btn) return;
        state.paperWidth = btn.getAttribute('data-width');
        syncPaperWidthButtons();
      });
    });

    // Board filters & layout
    document.getElementById('boardSearchInput').addEventListener('input', function (e) {
      state.boardSearch = e.target.value;
      renderBoard();
    });
    document.getElementById('boardPayFilter').addEventListener('change', function (e) {
      state.boardPayFilter = e.target.value;
      renderBoard();
    });
    document.getElementById('boardLayoutToggle').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-layout]');
      if (!btn) return;
      state.boardLayout = btn.getAttribute('data-layout');
      document.querySelectorAll('#boardLayoutToggle .seg-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      renderBoard();
    });
    document.getElementById('stageFilterBar').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-stage-filter]');
      if (!btn) return;
      state.boardStageFilter = btn.getAttribute('data-stage-filter');
      renderBoard();
    });

    // Board card actions
    document.getElementById('boardContainer').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      var code = btn.getAttribute('data-code');
      var order = state.orders.find(function (o) { return o.code === code; });
      if (!order) return;

      if (action === 'advance') {
        var idx = STAGES.indexOf(order.stage);
        if (idx >= 0 && idx < STAGES.length - 1) {
          var nextStage = STAGES[idx + 1];
          order.stage = nextStage;
          order.stageHistory = order.stageHistory || {};
          order.stageHistory[nextStage] = new Date().toISOString();
          saveOrders();
          renderAllViews();
          showToast(order.code + ' maju ke tahap ' + nextStage + '.', 'success');
        }
      } else if (action === 'settle') {
        order.paymentStatus = 'Lunas';
        order.paidAmount = order.finalTotal;
        order.remaining = 0;
        saveOrders();
        renderAllViews();
        showToast(order.code + ' ditandai LUNAS.', 'success');
      } else if (action === 'receipt') {
        openReceiptModal(order.code);
      } else if (action === 'wa') {
        openWaNotification(order, order.stage === 'Siap Diambil' ? 'ready' : 'status');
      } else if (action === 'delete') {
        if (window.confirm('Hapus order ' + order.code + ' (' + order.customerName + ')?')) {
          state.orders = state.orders.filter(function (o) { return o.code !== code; });
          saveOrders();
          renderAllViews();
          showToast('Order ' + code + ' dihapus.');
        }
      }
    });

    // Tracking form & chips
    document.getElementById('trackingForm').addEventListener('submit', function (e) {
      e.preventDefault();
      state.trackingQuery = document.getElementById('trackingInput').value;
      renderTracking();
    });

    document.getElementById('trackingSampleChips').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-sample-code]');
      if (!btn) return;
      var code = btn.getAttribute('data-sample-code');
      state.trackingQuery = code;
      document.getElementById('trackingInput').value = code;
      renderTracking();
    });

    document.getElementById('trackingResult').addEventListener('click', function (e) {
      var sampleBtn = e.target.closest('[data-sample-code]');
      if (sampleBtn) {
        var c = sampleBtn.getAttribute('data-sample-code');
        state.trackingQuery = c;
        document.getElementById('trackingInput').value = c;
        renderTracking();
        return;
      }
      var recBtn = e.target.closest('[data-track-receipt]');
      if (recBtn) {
        openReceiptModal(recBtn.getAttribute('data-track-receipt'));
        return;
      }
      var waBtn = e.target.closest('[data-track-wa]');
      if (waBtn) {
        var order = state.orders.find(function (o) { return o.code === waBtn.getAttribute('data-track-wa'); });
        if (order) openWaNotification(order, order.stage === 'Siap Diambil' ? 'ready' : 'status');
      }
    });

    // Export CSV
    document.getElementById('exportCsvBtn').addEventListener('click', exportOrdersCsv);

    // Receipt Modal controls
    document.getElementById('closeReceiptModalBtn').addEventListener('click', closeReceiptModal);
    document.getElementById('receiptModal').addEventListener('click', function (e) {
      if (e.target.id === 'receiptModal') closeReceiptModal();
    });
    document.getElementById('settingsModal').addEventListener('click', function (e) {
      if (e.target.id === 'settingsModal') closeSettingsModal();
    });

    document.getElementById('modalPrintBtn').addEventListener('click', function () {
      var order = state.orders.find(function (o) { return o.code === state.modalOrderCode; });
      if (order) printOrderReceipt(order);
    });

    document.getElementById('modalSendWaBtn').addEventListener('click', function () {
      var order = state.orders.find(function (o) { return o.code === state.modalOrderCode; });
      if (order) openWaNotification(order, order.stage === 'Siap Diambil' ? 'ready' : 'status');
    });

    document.getElementById('modalCopyWaBtn').addEventListener('click', function () {
      var order = state.orders.find(function (o) { return o.code === state.modalOrderCode; });
      if (!order) return;
      var text = buildWaMessage(order, order.stage === 'Siap Diambil' ? 'ready' : 'status');
      var fallbackCopy = function () {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          document.execCommand('copy');
          showToast('Teks nota & status disalin ke clipboard.', 'success');
        } catch (err) {
          showToast('Gagal menyalin otomatis.', 'warn');
        }
        document.body.removeChild(ta);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('Teks nota & status disalin ke clipboard.', 'success');
        }).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeReceiptModal();
        closeSettingsModal();
      }
    });
  }

  /* -------------------- INIT -------------------- */
  function init() {
    loadState();
    applyTheme(state.theme);
    renderPresetGrid();
    document.getElementById('trackingInput').value = state.trackingQuery;
    bindEvents();
    renderAllViews();
  }

  init();
})();
