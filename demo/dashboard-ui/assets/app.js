/* ==========================================================================
   Ddev Admin Dashboard & Analytics UI Kit - Main Script
   Brand: Ddev (https://asetkode.blogspot.com)
   ========================================================================== */

(function () {
  'use strict';

  var THEME_KEY = 'ddev_admin_theme';
  var SIDEBAR_KEY = 'ddev_admin_sidebar';
  var RECORDS_KEY = 'ddev_admin_records_v1';

  var DEFAULT_RECORDS = [
    { id: 'TRX-2601', name: 'Raka Pratama', email: 'raka@nusantara.id', plan: 'Enterprise', amount: 2450000, status: 'Lunas', date: '2026-11-14' },
    { id: 'TRX-2602', name: 'Sinta Wijaya', email: 'sinta@kreasikita.co.id', plan: 'Pro SaaS', amount: 890000, status: 'Lunas', date: '2026-11-13' },
    { id: 'TRX-2603', name: 'Budi Santoso', email: 'budi@mitradigital.id', plan: 'Starter', amount: 350000, status: 'Menunggu', date: '2026-11-13' },
    { id: 'TRX-2604', name: 'Dewi Anggraini', email: 'dewi@lokalbrand.com', plan: 'Pro SaaS', amount: 890000, status: 'Lunas', date: '2026-11-12' },
    { id: 'TRX-2605', name: 'Fajar Nugroho', email: 'fajar@warungpintar.id', plan: 'Starter', amount: 350000, status: 'Dibatalkan', date: '2026-11-11' },
    { id: 'TRX-2606', name: 'Nadia Kusuma', email: 'nadia@studiokarya.id', plan: 'Enterprise', amount: 2450000, status: 'Lunas', date: '2026-11-10' },
    { id: 'TRX-2607', name: 'Andi Kurniawan', email: 'andi@kopisenja.id', plan: 'Pro SaaS', amount: 890000, status: 'Menunggu', date: '2026-11-09' },
    { id: 'TRX-2608', name: 'Putri Maharani', email: 'putri@sinergiweb.id', plan: 'Enterprise', amount: 2450000, status: 'Lunas', date: '2026-11-08' },
    { id: 'TRX-2609', name: 'Dimas Saputra', email: 'dimas@tokomaju.id', plan: 'Starter', amount: 350000, status: 'Lunas', date: '2026-11-07' },
    { id: 'TRX-2610', name: 'Lestari Putri', email: 'lestari@cendekia.org', plan: 'Pro SaaS', amount: 890000, status: 'Lunas', date: '2026-11-06' }
  ];

  function formatIDR(num) {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getRecords() {
    try {
      var raw = localStorage.getItem(RECORDS_KEY);
      if (!raw) {
        localStorage.setItem(RECORDS_KEY, JSON.stringify(DEFAULT_RECORDS));
        return DEFAULT_RECORDS.slice();
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : DEFAULT_RECORDS.slice();
    } catch (e) {
      return DEFAULT_RECORDS.slice();
    }
  }

  function saveRecords(list) {
    try {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(list));
    } catch (e) {
      // Ignore storage quota issues in restricted environments
    }
  }

  function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'info');
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.2s ease';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    }, 2800);
  }

  /* ------------------------------------------------------------------------
     Theme & Sidebar Shell
     ------------------------------------------------------------------------ */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}

    var themeBtns = document.querySelectorAll('[data-theme-toggle]');
    themeBtns.forEach(function (btn) {
      var isDark = theme === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap');
      btn.title = isDark ? 'Mode Terang' : 'Mode Gelap';
      btn.innerHTML = isDark
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
  }

  function initShell() {
    var savedTheme = 'light';
    try {
      savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    } catch (e) {}
    applyTheme(savedTheme);

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        var next = cur === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast('Tema diubah ke Mode ' + (next === 'dark' ? 'Gelap' : 'Terang'), 'success');
      });
    });

    try {
      if (localStorage.getItem(SIDEBAR_KEY) === 'collapsed' && window.innerWidth > 960) {
        document.body.classList.add('sidebar-collapsed');
      }
    } catch (e) {}

    var sidebarToggle = document.getElementById('sidebarToggle');
    var sidebarBackdrop = document.getElementById('sidebarBackdrop');

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', function () {
        if (window.innerWidth <= 960) {
          document.body.classList.toggle('sidebar-open');
        } else {
          document.body.classList.toggle('sidebar-collapsed');
          try {
            localStorage.setItem(
              SIDEBAR_KEY,
              document.body.classList.contains('sidebar-collapsed') ? 'collapsed' : 'expanded'
            );
          } catch (e) {}
        }
      });
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', function () {
        document.body.classList.remove('sidebar-open');
      });
    }

    // Notification popover
    var notifBtn = document.getElementById('notifBtn');
    var notifPopover = document.getElementById('notifPopover');
    var markReadBtn = document.getElementById('markReadBtn');
    var notifDot = document.getElementById('notifDot');

    if (notifBtn && notifPopover) {
      notifBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        notifPopover.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (!notifPopover.contains(e.target) && e.target !== notifBtn) {
          notifPopover.classList.remove('open');
        }
      });
    }
    if (markReadBtn) {
      markReadBtn.addEventListener('click', function () {
        if (notifDot) notifDot.style.display = 'none';
        if (notifPopover) notifPopover.classList.remove('open');
        showToast('Semua notifikasi ditandai sudah dibaca', 'success');
      });
    }
  }

  /* ------------------------------------------------------------------------
     Dashboard Analytics Charts (Pure SVG, Offline-Ready)
     ------------------------------------------------------------------------ */
  function initDashboard() {
    var lineContainer = document.getElementById('lineChartBox');
    if (!lineContainer) return;

    var periodSelect = document.getElementById('chartPeriod');
    var series6 = {
      labels: ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
      income: [38.5, 44.2, 41.8, 52.4, 58.9, 68.4],
      expense: [21.0, 23.5, 22.1, 26.8, 28.4, 31.2]
    };
    var series12 = {
      labels: ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
      income: [29.0, 31.5, 34.0, 33.2, 36.8, 40.2, 38.5, 44.2, 41.8, 52.4, 58.9, 68.4],
      expense: [18.5, 19.2, 20.4, 19.8, 21.0, 22.3, 21.0, 23.5, 22.1, 26.8, 28.4, 31.2]
    };

    function renderLineChart(data) {
      var W = 680;
      var H = 260;
      var pad = { top: 20, right: 20, bottom: 34, left: 48 };
      var plotW = W - pad.left - pad.right;
      var plotH = H - pad.top - pad.bottom;
      var maxVal = 80;
      var n = data.labels.length;

      function xAt(i) {
        return pad.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
      }
      function yAt(val) {
        return pad.top + plotH - (val / maxVal) * plotH;
      }

      var gridHtml = '';
      [0, 20, 40, 60, 80].forEach(function (tick) {
        var y = yAt(tick);
        gridHtml += '<line x1="' + pad.left + '" y1="' + y + '" x2="' + (W - pad.right) + '" y2="' + y + '" stroke="var(--border)" stroke-dasharray="4 4"/>';
        gridHtml += '<text x="' + (pad.left - 8) + '" y="' + (y + 4) + '" text-anchor="end" fill="var(--text-muted)" font-size="11">' + tick + 'jt</text>';
      });

      var incPts = data.income.map(function (v, i) { return xAt(i) + ',' + yAt(v); }).join(' ');
      var expPts = data.expense.map(function (v, i) { return xAt(i) + ',' + yAt(v); }).join(' ');
      var areaPts = incPts + ' ' + xAt(n - 1) + ',' + yAt(0) + ' ' + xAt(0) + ',' + yAt(0);

      var labelsHtml = '';
      var dotsHtml = '';
      data.labels.forEach(function (lbl, i) {
        var cx = xAt(i);
        var cyInc = yAt(data.income[i]);
        var cyExp = yAt(data.expense[i]);
        labelsHtml += '<text x="' + cx + '" y="' + (H - 10) + '" text-anchor="middle" fill="var(--text-muted)" font-size="11">' + lbl + '</text>';
        dotsHtml += '<circle class="line-pt" data-idx="' + i + '" cx="' + cx + '" cy="' + cyInc + '" r="5" fill="var(--primary)" stroke="var(--surface)" stroke-width="2" style="cursor:pointer"/>';
        dotsHtml += '<circle class="line-pt" data-idx="' + i + '" cx="' + cx + '" cy="' + cyExp + '" r="4.5" fill="#10b981" stroke="var(--surface)" stroke-width="2" style="cursor:pointer"/>';
      });

      lineContainer.innerHTML =
        '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '">' +
          '<defs><linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#4f46e5" stop-opacity="0.28"/>' +
            '<stop offset="100%" stop-color="#4f46e5" stop-opacity="0.0"/>' +
          '</linearGradient></defs>' +
          gridHtml +
          '<polygon points="' + areaPts + '" fill="url(#incGrad)"/>' +
          '<polyline fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="' + incPts + '"/>' +
          '<polyline fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6 4" stroke-linecap="round" points="' + expPts + '"/>' +
          labelsHtml +
          dotsHtml +
        '</svg>' +
        '<div class="chart-tooltip" id="lineTooltip"></div>';

      var tooltip = document.getElementById('lineTooltip');
      lineContainer.querySelectorAll('.line-pt').forEach(function (pt) {
        pt.addEventListener('mouseenter', function () {
          var i = Number(pt.getAttribute('data-idx'));
          var rect = lineContainer.getBoundingClientRect();
          var ptRect = pt.getBoundingClientRect();
          tooltip.innerHTML =
            '<strong>' + data.labels[i] + ' 2026</strong><br>' +
            'Pendapatan: Rp ' + data.income[i].toFixed(1).replace('.', ',') + ' jt<br>' +
            'Operasional: Rp ' + data.expense[i].toFixed(1).replace('.', ',') + ' jt';
          tooltip.style.left = (ptRect.left - rect.left + ptRect.width / 2) + 'px';
          tooltip.style.top = (ptRect.top - rect.top) + 'px';
          tooltip.classList.add('visible');
        });
        pt.addEventListener('mouseleave', function () {
          tooltip.classList.remove('visible');
        });
      });
    }

    renderLineChart(series6);
    if (periodSelect) {
      periodSelect.addEventListener('change', function () {
        renderLineChart(periodSelect.value === '12' ? series12 : series6);
      });
    }

    // Bar Chart (Pesanan Mingguan)
    var barContainer = document.getElementById('barChartBox');
    if (barContainer) {
      var days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      var orders = [42, 58, 51, 74, 89, 63, 47];
      var maxBar = 100;
      var bw = 420;
      var bh = 210;
      var padB = { top: 16, right: 12, bottom: 28, left: 32 };
      var innerW = bw - padB.left - padB.right;
      var innerH = bh - padB.top - padB.bottom;
      var slot = innerW / days.length;
      var barW = Math.min(28, slot * 0.56);

      var bHtml = '';
      [0, 50, 100].forEach(function (t) {
        var y = padB.top + innerH - (t / maxBar) * innerH;
        bHtml += '<line x1="' + padB.left + '" y1="' + y + '" x2="' + (bw - padB.right) + '" y2="' + y + '" stroke="var(--border)" stroke-dasharray="3 3"/>';
        bHtml += '<text x="' + (padB.left - 6) + '" y="' + (y + 4) + '" text-anchor="end" fill="var(--text-muted)" font-size="10">' + t + '</text>';
      });

      days.forEach(function (d, i) {
        var val = orders[i];
        var h = (val / maxBar) * innerH;
        var x = padB.left + i * slot + (slot - barW) / 2;
        var y = padB.top + innerH - h;
        bHtml += '<rect class="bar-rect" data-idx="' + i + '" x="' + x + '" y="' + y + '" width="' + barW + '" height="' + h + '" rx="6" fill="var(--primary)" opacity="0.88" style="cursor:pointer"/>';
        bHtml += '<text x="' + (x + barW / 2) + '" y="' + (bh - 8) + '" text-anchor="middle" fill="var(--text-muted)" font-size="11">' + d + '</text>';
      });

      barContainer.innerHTML =
        '<svg class="chart-svg" viewBox="0 0 ' + bw + ' ' + bh + '">' + bHtml + '</svg>' +
        '<div class="chart-tooltip" id="barTooltip"></div>';

      var bTip = document.getElementById('barTooltip');
      barContainer.querySelectorAll('.bar-rect').forEach(function (rectEl) {
        rectEl.addEventListener('mouseenter', function () {
          var i = Number(rectEl.getAttribute('data-idx'));
          rectEl.setAttribute('opacity', '1');
          var cRect = barContainer.getBoundingClientRect();
          var rRect = rectEl.getBoundingClientRect();
          bTip.innerHTML = '<strong>' + days[i] + '</strong>: ' + orders[i] + ' transaksi';
          bTip.style.left = (rRect.left - cRect.left + rRect.width / 2) + 'px';
          bTip.style.top = (rRect.top - cRect.top) + 'px';
          bTip.classList.add('visible');
        });
        rectEl.addEventListener('mouseleave', function () {
          rectEl.setAttribute('opacity', '0.88');
          bTip.classList.remove('visible');
        });
      });
    }

    // Donut Chart (Komposisi Paket)
    var donutBox = document.getElementById('donutChartBox');
    var donutLegend = document.getElementById('donutLegend');
    if (donutBox && donutLegend) {
      var segments = [
        { label: 'Paket Enterprise', value: 48, color: '#4f46e5' },
        { label: 'Paket Pro SaaS', value: 34, color: '#10b981' },
        { label: 'Paket Starter', value: 18, color: '#0ea5e9' }
      ];
      var r = 56;
      var c = 2 * Math.PI * r;
      var offset = 0;
      var segSvg = '';

      segments.forEach(function (seg, idx) {
        var len = (seg.value / 100) * c;
        segSvg += '<circle class="donut-seg" data-idx="' + idx + '" cx="80" cy="80" r="' + r + '" fill="none" stroke="' + seg.color + '" stroke-width="20" stroke-dasharray="' + len + ' ' + (c - len) + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 80 80)" style="cursor:pointer;transition:stroke-width 0.15s ease"/>';
        offset += len;
      });

      donutBox.innerHTML =
        '<svg width="160" height="160" viewBox="0 0 160 160">' +
          '<circle cx="80" cy="80" r="' + r + '" fill="none" stroke="var(--surface-alt)" stroke-width="20"/>' +
          segSvg +
          '<text x="80" y="76" text-anchor="middle" fill="var(--text)" font-size="20" font-weight="700" id="donutCenterVal">100%</text>' +
          '<text x="80" y="96" text-anchor="middle" fill="var(--text-muted)" font-size="11" id="donutCenterLbl">Total Paket</text>' +
        '</svg>';

      donutLegend.innerHTML = segments.map(function (seg, idx) {
        return '<div class="legend-item" data-idx="' + idx + '">' +
          '<span class="legend-left"><span class="legend-dot" style="background:' + seg.color + '"></span>' + seg.label + '</span>' +
          '<strong>' + seg.value + '%</strong>' +
        '</div>';
      }).join('');

      var centerVal = document.getElementById('donutCenterVal');
      var centerLbl = document.getElementById('donutCenterLbl');
      function highlightSeg(idx) {
        var seg = segments[idx];
        centerVal.textContent = seg.value + '%';
        centerLbl.textContent = seg.label.replace('Paket ', '');
        donutBox.querySelectorAll('.donut-seg').forEach(function (el, i) {
          el.setAttribute('stroke-width', i === idx ? '24' : '20');
        });
      }
      function resetSeg() {
        centerVal.textContent = '100%';
        centerLbl.textContent = 'Total Paket';
        donutBox.querySelectorAll('.donut-seg').forEach(function (el) {
          el.setAttribute('stroke-width', '20');
        });
      }
      donutBox.querySelectorAll('.donut-seg').forEach(function (el) {
        el.addEventListener('mouseenter', function () { highlightSeg(Number(el.getAttribute('data-idx'))); });
        el.addEventListener('mouseleave', resetSeg);
      });
      donutLegend.querySelectorAll('.legend-item').forEach(function (el) {
        el.addEventListener('mouseenter', function () { highlightSeg(Number(el.getAttribute('data-idx'))); });
        el.addEventListener('mouseleave', resetSeg);
      });
    }

    // Recent Transactions Table + Dynamic KPI
    var recentBody = document.getElementById('recentTransactionsBody');
    var records = getRecords();
    var paidSum = records.filter(function (r) { return r.status === 'Lunas'; }).reduce(function (a, b) { return a + Number(b.amount); }, 0);
    var kpiRevenue = document.getElementById('kpiRevenue');
    var kpiOrders = document.getElementById('kpiOrders');
    if (kpiRevenue) kpiRevenue.textContent = formatIDR(68400000 + paidSum);
    if (kpiOrders) kpiOrders.textContent = String(1284 + records.length);

    if (recentBody) {
      recentBody.innerHTML = records.slice(0, 5).map(function (r) {
        var badgeCls = r.status === 'Lunas' ? 'badge-success' : (r.status === 'Menunggu' ? 'badge-warning' : 'badge-danger');
        return '<tr>' +
          '<td><strong>' + escapeHTML(r.id) + '</strong></td>' +
          '<td>' + escapeHTML(r.name) + '<div style="font-size:12px;color:var(--text-muted)">' + escapeHTML(r.email) + '</div></td>' +
          '<td>' + escapeHTML(r.plan) + '</td>' +
          '<td><strong>' + formatIDR(r.amount) + '</strong></td>' +
          '<td><span class="badge ' + badgeCls + '">' + escapeHTML(r.status) + '</span></td>' +
        '</tr>';
      }).join('');
    }
  }

  /* ------------------------------------------------------------------------
     CRUD Data Table Page (tables.html)
     ------------------------------------------------------------------------ */
  function initTables() {
    var tableBody = document.getElementById('crudTableBody');
    if (!tableBody) return;

    var state = {
      records: getRecords(),
      search: '',
      status: 'all',
      plan: 'all',
      sortKey: 'date',
      sortAsc: false,
      page: 1,
      perPage: 6,
      editingId: null
    };

    var searchInput = document.getElementById('tableSearch');
    var statusFilter = document.getElementById('statusFilter');
    var planFilter = document.getElementById('planFilter');
    var paginationInfo = document.getElementById('paginationInfo');
    var prevBtn = document.getElementById('prevPageBtn');
    var nextBtn = document.getElementById('nextPageBtn');

    var modal = document.getElementById('recordModal');
    var modalTitle = document.getElementById('recordModalTitle');
    var recordForm = document.getElementById('recordForm');
    var openAddBtn = document.getElementById('openAddModalBtn');
    var closeModalBtns = document.querySelectorAll('[data-close-modal]');

    function getFiltered() {
      return state.records.filter(function (r) {
        var q = state.search.toLowerCase();
        var matchQ = !q || r.name.toLowerCase().indexOf(q) !== -1 || r.email.toLowerCase().indexOf(q) !== -1 || r.id.toLowerCase().indexOf(q) !== -1;
        var matchS = state.status === 'all' || r.status === state.status;
        var matchP = state.plan === 'all' || r.plan === state.plan;
        return matchQ && matchS && matchP;
      }).sort(function (a, b) {
        var va = a[state.sortKey];
        var vb = b[state.sortKey];
        if (state.sortKey === 'amount') {
          return state.sortAsc ? Number(va) - Number(vb) : Number(vb) - Number(va);
        }
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
        if (va < vb) return state.sortAsc ? -1 : 1;
        if (va > vb) return state.sortAsc ? 1 : -1;
        return 0;
      });
    }

    function render() {
      var list = getFiltered();
      var totalPages = Math.max(1, Math.ceil(list.length / state.perPage));
      if (state.page > totalPages) state.page = totalPages;
      var start = (state.page - 1) * state.perPage;
      var slice = list.slice(start, start + state.perPage);

      if (!slice.length) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted)">Tidak ada data yang sesuai filter.</td></tr>';
      } else {
        tableBody.innerHTML = slice.map(function (r) {
          var cls = r.status === 'Lunas' ? 'badge-success' : (r.status === 'Menunggu' ? 'badge-warning' : 'badge-danger');
          return '<tr>' +
            '<td><strong>' + escapeHTML(r.id) + '</strong></td>' +
            '<td><div><strong>' + escapeHTML(r.name) + '</strong></div><div style="font-size:12px;color:var(--text-muted)">' + escapeHTML(r.email) + '</div></td>' +
            '<td><span class="badge badge-primary">' + escapeHTML(r.plan) + '</span></td>' +
            '<td><strong>' + formatIDR(r.amount) + '</strong></td>' +
            '<td><span class="badge ' + cls + '">' + escapeHTML(r.status) + '</span></td>' +
            '<td>' + escapeHTML(r.date) + '</td>' +
            '<td>' +
              '<div style="display:flex;gap:6px">' +
                '<button class="btn btn-outline btn-sm" data-edit="' + escapeHTML(r.id) + '">Edit</button>' +
                '<button class="btn btn-ghost btn-sm" style="color:var(--danger)" data-del="' + escapeHTML(r.id) + '">Hapus</button>' +
              '</div>' +
            '</td>' +
          '</tr>';
        }).join('');
      }

      if (paginationInfo) {
        paginationInfo.textContent = 'Menampilkan ' + (list.length ? start + 1 : 0) + '–' + Math.min(start + state.perPage, list.length) + ' dari ' + list.length + ' data (Hal. ' + state.page + '/' + totalPages + ')';
      }
      if (prevBtn) prevBtn.disabled = state.page <= 1;
      if (nextBtn) nextBtn.disabled = state.page >= totalPages;

      tableBody.querySelectorAll('[data-edit]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          openEditModal(btn.getAttribute('data-edit'));
        });
      });
      tableBody.querySelectorAll('[data-del]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-del');
          state.records = state.records.filter(function (x) { return x.id !== id; });
          saveRecords(state.records);
          render();
          showToast('Data ' + id + ' dihapus', 'danger');
        });
      });
    }

    function openAddModal() {
      state.editingId = null;
      modalTitle.textContent = 'Tambah Transaksi Baru';
      recordForm.reset();
      document.getElementById('fieldDate').value = new Date().toISOString().slice(0, 10);
      modal.classList.add('open');
    }

    function openEditModal(id) {
      var item = state.records.find(function (x) { return x.id === id; });
      if (!item) return;
      state.editingId = id;
      modalTitle.textContent = 'Edit Transaksi ' + id;
      document.getElementById('fieldName').value = item.name;
      document.getElementById('fieldEmail').value = item.email;
      document.getElementById('fieldPlan').value = item.plan;
      document.getElementById('fieldAmount').value = item.amount;
      document.getElementById('fieldStatus').value = item.status;
      document.getElementById('fieldDate').value = item.date;
      modal.classList.add('open');
    }

    function closeModal() {
      modal.classList.remove('open');
    }

    if (openAddBtn) openAddBtn.addEventListener('click', openAddModal);
    closeModalBtns.forEach(function (b) { b.addEventListener('click', closeModal); });
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    if (recordForm) {
      recordForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('fieldName').value.trim();
        var email = document.getElementById('fieldEmail').value.trim();
        var plan = document.getElementById('fieldPlan').value;
        var amount = Number(document.getElementById('fieldAmount').value) || 0;
        var status = document.getElementById('fieldStatus').value;
        var date = document.getElementById('fieldDate').value;

        if (!name || !email) {
          showToast('Nama dan email wajib diisi', 'danger');
          return;
        }

        if (state.editingId) {
          state.records = state.records.map(function (r) {
            return r.id === state.editingId
              ? { id: r.id, name: name, email: email, plan: plan, amount: amount, status: status, date: date }
              : r;
          });
          showToast('Data ' + state.editingId + ' diperbarui', 'success');
        } else {
          var nextNum = 2611 + state.records.length;
          var newId = 'TRX-' + nextNum;
          state.records.unshift({ id: newId, name: name, email: email, plan: plan, amount: amount, status: status, date: date });
          showToast('Data ' + newId + ' berhasil ditambahkan', 'success');
        }
        saveRecords(state.records);
        closeModal();
        render();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.search = searchInput.value;
        state.page = 1;
        render();
      });
    }
    if (statusFilter) {
      statusFilter.addEventListener('change', function () {
        state.status = statusFilter.value;
        state.page = 1;
        render();
      });
    }
    if (planFilter) {
      planFilter.addEventListener('change', function () {
        state.plan = planFilter.value;
        state.page = 1;
        render();
      });
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { if (state.page > 1) { state.page--; render(); } });
    if (nextBtn) nextBtn.addEventListener('click', function () { state.page++; render(); });

    document.querySelectorAll('th[data-sort]').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.getAttribute('data-sort');
        if (state.sortKey === key) state.sortAsc = !state.sortAsc;
        else { state.sortKey = key; state.sortAsc = true; }
        render();
      });
    });

    var exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        var rows = [['ID', 'Nama', 'Email', 'Paket', 'Nominal', 'Status', 'Tanggal']];
        getFiltered().forEach(function (r) {
          rows.push([r.id, r.name, r.email, r.plan, r.amount, r.status, r.date]);
        });
        var csv = rows.map(function (row) {
          return row.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(',');
        }).join('\n');
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'transaksi-ddev-admin.csv';
        a.click();
        URL.revokeObjectURL(url);
        showToast('File CSV berhasil diunduh', 'success');
      });
    }

    var resetBtn = document.getElementById('resetDataBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        state.records = DEFAULT_RECORDS.slice();
        saveRecords(state.records);
        state.page = 1;
        render();
        showToast('Data demo dikembalikan ke kondisi awal', 'info');
      });
    }

    render();
  }

  /* ------------------------------------------------------------------------
     Forms UI Kit Page (forms.html)
     ------------------------------------------------------------------------ */
  function initForms() {
    var profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    // Radio plan cards
    document.querySelectorAll('.radio-card').forEach(function (card) {
      card.addEventListener('click', function () {
        document.querySelectorAll('.radio-card').forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        var radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // Dropzone preview
    var dropzone = document.getElementById('logoDropzone');
    var fileInput = document.getElementById('logoFileInput');
    var fileStatus = document.getElementById('dropzoneStatus');

    function handleFiles(files) {
      if (!files || !files.length) return;
      var f = files[0];
      fileStatus.textContent = 'Berkas terpilih: ' + f.name + ' (' + Math.round(f.size / 1024) + ' KB)';
      showToast('Berkas "' + f.name + '" siap diunggah', 'success');
    }

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', function () { fileInput.click(); });
      fileInput.addEventListener('change', function () { handleFiles(fileInput.files); });
      dropzone.addEventListener('dragover', function (e) { e.preventDefault(); dropzone.classList.add('dragover'); });
      dropzone.addEventListener('dragleave', function () { dropzone.classList.remove('dragover'); });
      dropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
      });
    }

    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var bizName = document.getElementById('bizName');
      var bizEmail = document.getElementById('bizEmail');
      var grpName = bizName.closest('.form-group');
      var grpEmail = bizEmail.closest('.form-group');

      if (!bizName.value.trim()) {
        grpName.classList.add('has-error');
        valid = false;
      } else {
        grpName.classList.remove('has-error');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bizEmail.value.trim())) {
        grpEmail.classList.add('has-error');
        valid = false;
      } else {
        grpEmail.classList.remove('has-error');
      }

      if (valid) {
        showToast('Pengaturan profil bisnis berhasil disimpan', 'success');
      } else {
        showToast('Periksa kembali isian form yang ditandai merah', 'danger');
      }
    });
  }

  /* ------------------------------------------------------------------------
     Printable Invoice Page (invoice.html)
     ------------------------------------------------------------------------ */
  function initInvoice() {
    var invSelector = document.getElementById('invoiceSelector');
    if (!invSelector) return;

    var invoices = {
      'INV-2026-084': {
        client: 'PT Nusantara Digital Kreatif',
        address: 'Jl. Jend. Sudirman Kav. 52, Jakarta Selatan',
        email: 'finance@nusantara.id',
        date: '14 November 2026',
        due: '28 November 2026',
        status: 'Lunas',
        items: [
          { desc: 'Lisensi Ddev Admin Dashboard Pro (Tahunan)', qty: 1, price: 1850000 },
          { desc: 'Integrasi Custom API & Webhook', qty: 1, price: 650000 },
          { desc: 'Dukungan Prioritas 6 Bulan', qty: 1, price: 450000 }
        ]
      },
      'INV-2026-085': {
        client: 'CV Kreasi Kita Mandiri',
        address: 'Jl. Dago No. 118, Bandung, Jawa Barat',
        email: 'billing@kreasikita.co.id',
        date: '12 November 2026',
        due: '26 November 2026',
        status: 'Menunggu',
        items: [
          { desc: 'Paket SaaS UI Kit Multi-Brand', qty: 2, price: 750000 },
          { desc: 'Pelatihan Tim Frontend (Online 2 Sesi)', qty: 1, price: 500000 }
        ]
      }
    };

    function renderInvoice(code) {
      var data = invoices[code] || invoices['INV-2026-084'];
      document.getElementById('invNumber').textContent = code;
      document.getElementById('invClient').textContent = data.client;
      document.getElementById('invAddress').textContent = data.address;
      document.getElementById('invEmail').textContent = data.email;
      document.getElementById('invDate').textContent = data.date;
      document.getElementById('invDue').textContent = data.due;

      var badge = document.getElementById('invStatusBadge');
      badge.textContent = data.status;
      badge.className = 'badge ' + (data.status === 'Lunas' ? 'badge-success' : 'badge-warning');

      var sub = 0;
      var tbody = document.getElementById('invItemsBody');
      tbody.innerHTML = data.items.map(function (item, idx) {
        var lineTotal = item.qty * item.price;
        sub += lineTotal;
        return '<tr>' +
          '<td>' + (idx + 1) + '</td>' +
          '<td><strong>' + escapeHTML(item.desc) + '</strong></td>' +
          '<td>' + item.qty + '</td>' +
          '<td>' + formatIDR(item.price) + '</td>' +
          '<td style="text-align:right"><strong>' + formatIDR(lineTotal) + '</strong></td>' +
        '</tr>';
      }).join('');

      var tax = Math.round(sub * 0.11);
      document.getElementById('invSubtotal').textContent = formatIDR(sub);
      document.getElementById('invTax').textContent = formatIDR(tax);
      document.getElementById('invGrandTotal').textContent = formatIDR(sub + tax);
    }

    invSelector.addEventListener('change', function () {
      renderInvoice(invSelector.value);
    });

    var printBtn = document.getElementById('printInvoiceBtn');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    renderInvoice(invSelector.value);
  }

  /* ------------------------------------------------------------------------
     Auth Page (auth.html)
     ------------------------------------------------------------------------ */
  function initAuth() {
    var authForm = document.getElementById('authForm');
    if (!authForm) return;

    var mode = 'login';
    var tabs = document.querySelectorAll('.auth-tab');
    var nameGroup = document.getElementById('registerNameGroup');
    var submitBtn = document.getElementById('authSubmitBtn');
    var togglePassBtn = document.getElementById('togglePassBtn');
    var passInput = document.getElementById('authPassword');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        mode = tab.getAttribute('data-auth-tab');
        if (nameGroup) nameGroup.style.display = mode === 'register' ? 'flex' : 'none';
        if (submitBtn) submitBtn.textContent = mode === 'register' ? 'Buat Akun Sekarang' : 'Masuk ke Dashboard';
      });
    });

    if (togglePassBtn && passInput) {
      togglePassBtn.addEventListener('click', function () {
        var show = passInput.type === 'password';
        passInput.type = show ? 'text' : 'password';
        togglePassBtn.textContent = show ? 'Sembunyikan' : 'Lihat';
      });
    }

    authForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('authEmail').value.trim();
      var pass = passInput.value.trim();
      if (!email || pass.length < 6) {
        showToast('Masukkan email valid & kata sandi minimal 6 karakter', 'danger');
        return;
      }
      showToast(mode === 'register' ? 'Akun terdaftar! Mengalihkan...' : 'Login berhasil! Membuka dashboard...', 'success');
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 800);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initShell();
    initDashboard();
    initTables();
    initForms();
    initInvoice();
    initAuth();
  });
})();
