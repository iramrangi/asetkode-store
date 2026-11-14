/* ==========================================================================
   Ddev Kalkulator Finansial & Catatan Keuangan Pribadi - App Logic
   Brand: Ddev (https://asetkode.blogspot.com)
   ========================================================================== */

(function () {
  'use strict';

  var THEME_KEY = 'ddev_fin_theme';
  var TX_KEY = 'ddev_fin_tx_v1';
  var BUDGET_KEY = 'ddev_fin_budgets_v1';

  var EXPENSE_CATEGORIES = [
    { name: 'Makan & Minum', color: '#0d9488' },
    { name: 'Tagihan & Kos', color: '#3b82f6' },
    { name: 'Transportasi', color: '#f59e0b' },
    { name: 'Belanja & Kebutuhan', color: '#8b5cf6' },
    { name: 'Hiburan', color: '#ec4899' },
    { name: 'Tabungan & Investasi', color: '#10b981' },
    { name: 'Lainnya', color: '#64748b' }
  ];

  var INCOME_CATEGORIES = ['Gaji Bulanan', 'Freelance / Proyek', 'Bonus & Komisi', 'Hasil Usaha', 'Lainnya'];

  var DEFAULT_BUDGETS = {
    'Makan & Minum': 1800000,
    'Tagihan & Kos': 2000000,
    'Transportasi': 750000,
    'Belanja & Kebutuhan': 1000000,
    'Hiburan': 500000,
    'Tabungan & Investasi': 2000000,
    'Lainnya': 400000
  };

  function currentMonthStr() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    return d.getFullYear() + '-' + m;
  }

  function makeSeedTx() {
    var ym = currentMonthStr();
    return [
      { id: 'f1', type: 'income', title: 'Gaji Pokok Bulanan', category: 'Gaji Bulanan', amount: 8500000, date: ym + '-01' },
      { id: 'f2', type: 'income', title: 'Proyek Desain Landing Page', category: 'Freelance / Proyek', amount: 2200000, date: ym + '-05' },
      { id: 'f3', type: 'expense', title: 'Sewa Kos & Listrik', category: 'Tagihan & Kos', amount: 1750000, date: ym + '-02' },
      { id: 'f4', type: 'expense', title: 'Belanja Bahan Makanan Mingguan', category: 'Makan & Minum', amount: 640000, date: ym + '-04' },
      { id: 'f5', type: 'expense', title: 'Setoran Reksa Dana & Dana Darurat', category: 'Tabungan & Investasi', amount: 1500000, date: ym + '-06' },
      { id: 'f6', type: 'expense', title: 'BBM & Parkir Harian', category: 'Transportasi', amount: 420000, date: ym + '-08' },
      { id: 'f7', type: 'expense', title: 'Kopi, Makan Siang & Jajan', category: 'Makan & Minum', amount: 580000, date: ym + '-10' },
      { id: 'f8', type: 'expense', title: 'Nonton & Langganan Streaming', category: 'Hiburan', amount: 290000, date: ym + '-11' },
      { id: 'f9', type: 'expense', title: 'Kebutuhan Rumah & Sabun', category: 'Belanja & Kebutuhan', amount: 485000, date: ym + '-12' }
    ];
  }

  function formatIDR(n) {
    var num = Number(n || 0);
    var sign = num < 0 ? '-' : '';
    return sign + 'Rp ' + Math.abs(Math.round(num)).toLocaleString('id-ID');
  }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(msg) {
    var box = document.getElementById('toastContainer');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toastContainer';
      box.className = 'toast-container';
      document.body.appendChild(box);
    }
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2600);
  }

  function loadTx() {
    try {
      var raw = localStorage.getItem(TX_KEY);
      if (!raw) {
        var seed = makeSeedTx();
        localStorage.setItem(TX_KEY, JSON.stringify(seed));
        return seed;
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : makeSeedTx();
    } catch (e) {
      return makeSeedTx();
    }
  }

  function saveTx(list) {
    try {
      localStorage.setItem(TX_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function loadBudgets() {
    try {
      var raw = localStorage.getItem(BUDGET_KEY);
      if (!raw) {
        localStorage.setItem(BUDGET_KEY, JSON.stringify(DEFAULT_BUDGETS));
        return Object.assign({}, DEFAULT_BUDGETS);
      }
      return Object.assign({}, DEFAULT_BUDGETS, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, DEFAULT_BUDGETS);
    }
  }

  function saveBudgets(b) {
    try {
      localStorage.setItem(BUDGET_KEY, JSON.stringify(b));
    } catch (e) {}
  }

  /* ------------------------------------------------------------------------
     Theme
     ------------------------------------------------------------------------ */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    var btn = document.getElementById('themeToggleBtn');
    if (btn) {
      var isDark = theme === 'dark';
      btn.title = isDark ? 'Mode Terang' : 'Mode Gelap';
      btn.setAttribute('aria-label', btn.title);
      btn.innerHTML = isDark
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  /* ------------------------------------------------------------------------
     App State & Render
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    var savedTheme = 'light';
    try { savedTheme = localStorage.getItem(THEME_KEY) || 'light'; } catch (e) {}
    applyTheme(savedTheme);

    var themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast('Mode ' + (next === 'dark' ? 'Gelap' : 'Terang') + ' diaktifkan');
      });
    }

    var state = {
      tx: loadTx(),
      budgets: loadBudgets(),
      formType: 'expense',
      filterMonth: currentMonthStr(),
      filterType: 'all',
      filterSearch: ''
    };

    var monthFilterEl = document.getElementById('monthFilter');
    var typeFilterEl = document.getElementById('typeFilter');
    var searchFilterEl = document.getElementById('searchFilter');
    var txDateEl = document.getElementById('txDate');
    var txCatEl = document.getElementById('txCategory');
    var txForm = document.getElementById('txForm');

    if (monthFilterEl) monthFilterEl.value = state.filterMonth;
    if (txDateEl) txDateEl.value = new Date().toISOString().slice(0, 10);

    function syncCategorySelect() {
      var list = state.formType === 'income'
        ? INCOME_CATEGORIES
        : EXPENSE_CATEGORIES.map(function (c) { return c.name; });
      txCatEl.innerHTML = list.map(function (name) {
        return '<option value="' + escapeHTML(name) + '">' + escapeHTML(name) + '</option>';
      }).join('');
    }
    syncCategorySelect();

    document.querySelectorAll('[data-tx-type]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.formType = btn.getAttribute('data-tx-type');
        document.querySelectorAll('[data-tx-type]').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        syncCategorySelect();
      });
    });

    function getMonthTransactions() {
      return state.tx.filter(function (item) {
        return !state.filterMonth || String(item.date).indexOf(state.filterMonth) === 0;
      });
    }

    function getFilteredLedger() {
      return getMonthTransactions().filter(function (item) {
        var okType = state.filterType === 'all' || item.type === state.filterType;
        var q = state.filterSearch.toLowerCase();
        var okSearch = !q || item.title.toLowerCase().indexOf(q) !== -1 || item.category.toLowerCase().indexOf(q) !== -1;
        return okType && okSearch;
      }).sort(function (a, b) {
        return a.date < b.date ? 1 : -1;
      });
    }

    function renderKPIs(monthTx) {
      var inc = 0;
      var exp = 0;
      monthTx.forEach(function (t) {
        if (t.type === 'income') inc += Number(t.amount);
        else exp += Number(t.amount);
      });
      var net = inc - exp;
      var ratio = inc > 0 ? Math.max(0, Math.round(((inc - exp) / inc) * 100)) : 0;

      document.getElementById('kpiIncome').textContent = formatIDR(inc);
      document.getElementById('kpiExpense').textContent = formatIDR(exp);
      document.getElementById('kpiNet').textContent = formatIDR(net);
      document.getElementById('kpiRatio').textContent = ratio + '%';

      var netNote = document.getElementById('kpiNetNote');
      if (netNote) {
        netNote.textContent = net >= 0 ? 'Arus kas bulan ini surplus' : 'Pengeluaran melebihi pemasukan';
      }
      return { inc: inc, exp: exp, net: net, ratio: ratio };
    }

    function renderDonutAndBudgets(monthTx) {
      var catTotals = {};
      var totalExp = 0;
      EXPENSE_CATEGORIES.forEach(function (c) { catTotals[c.name] = 0; });

      monthTx.filter(function (t) { return t.type === 'expense'; }).forEach(function (t) {
        var key = catTotals.hasOwnProperty(t.category) ? t.category : 'Lainnya';
        catTotals[key] += Number(t.amount);
        totalExp += Number(t.amount);
      });

      // SVG Donut
      var donutBox = document.getElementById('expenseDonutBox');
      var donutLegend = document.getElementById('expenseDonutLegend');
      var activeCats = EXPENSE_CATEGORIES.filter(function (c) { return catTotals[c.name] > 0; });

      var r = 58;
      var circ = 2 * Math.PI * r;
      var offset = 0;
      var segsHtml = '';

      if (totalExp > 0) {
        activeCats.forEach(function (cat, idx) {
          var val = catTotals[cat.name];
          var len = (val / totalExp) * circ;
          segsHtml += '<circle class="fin-seg" data-idx="' + idx + '" cx="82" cy="82" r="' + r + '" fill="none" stroke="' + cat.color + '" stroke-width="20" stroke-dasharray="' + len + ' ' + (circ - len) + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 82 82)" style="cursor:pointer;transition:stroke-width 0.15s ease"/>';
          offset += len;
        });
      }

      donutBox.innerHTML =
        '<svg width="164" height="164" viewBox="0 0 164 164">' +
          '<circle cx="82" cy="82" r="' + r + '" fill="none" stroke="var(--surface-alt)" stroke-width="20"/>' +
          segsHtml +
          '<text x="82" y="77" text-anchor="middle" fill="var(--text)" font-size="13" font-weight="800" id="finDonutVal">' + formatIDR(totalExp) + '</text>' +
          '<text x="82" y="96" text-anchor="middle" fill="var(--text-muted)" font-size="11" id="finDonutLbl">Total Keluar</text>' +
        '</svg>';

      if (!activeCats.length) {
        donutLegend.innerHTML = '<div style="text-align:center;color:var(--text-muted);font-size:13px">Belum ada pengeluaran pada bulan ini.</div>';
      } else {
        donutLegend.innerHTML = activeCats.map(function (cat, idx) {
          var val = catTotals[cat.name];
          var pct = Math.round((val / totalExp) * 100);
          return '<div class="legend-row" data-idx="' + idx + '">' +
            '<span class="legend-left"><span class="dot" style="background:' + cat.color + '"></span>' + escapeHTML(cat.name) + ' (' + pct + '%)</span>' +
            '<strong>' + formatIDR(val) + '</strong>' +
          '</div>';
        }).join('');

        var valEl = document.getElementById('finDonutVal');
        var lblEl = document.getElementById('finDonutLbl');
        function focusCat(idx) {
          var c = activeCats[idx];
          var pct = Math.round((catTotals[c.name] / totalExp) * 100);
          valEl.textContent = pct + '%';
          lblEl.textContent = c.name.split(' ')[0];
          donutBox.querySelectorAll('.fin-seg').forEach(function (el, i) {
            el.setAttribute('stroke-width', i === idx ? '24' : '20');
          });
        }
        function clearCat() {
          valEl.textContent = formatIDR(totalExp);
          lblEl.textContent = 'Total Keluar';
          donutBox.querySelectorAll('.fin-seg').forEach(function (el) {
            el.setAttribute('stroke-width', '20');
          });
        }
        donutBox.querySelectorAll('.fin-seg').forEach(function (el) {
          el.addEventListener('mouseenter', function () { focusCat(Number(el.getAttribute('data-idx'))); });
          el.addEventListener('mouseleave', clearCat);
        });
        donutLegend.querySelectorAll('.legend-row').forEach(function (el) {
          el.addEventListener('mouseenter', function () { focusCat(Number(el.getAttribute('data-idx'))); });
          el.addEventListener('mouseleave', clearCat);
        });
      }

      // Category Budget Progress Bars
      var budgetBox = document.getElementById('budgetBarsBox');
      budgetBox.innerHTML = EXPENSE_CATEGORIES.map(function (cat) {
        var spent = catTotals[cat.name] || 0;
        var limit = Number(state.budgets[cat.name] || 0);
        var pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
        var barW = Math.min(100, pct);
        var cls = pct >= 100 ? 'over' : (pct >= 75 ? 'warn' : 'safe');
        return '<div>' +
          '<div class="budget-item-top">' +
            '<span><strong>' + escapeHTML(cat.name) + '</strong></span>' +
            '<span style="color:var(--text-muted)">' + formatIDR(spent) + ' / ' + formatIDR(limit) + ' (' + pct + '%)</span>' +
          '</div>' +
          '<div class="progress-track"><div class="progress-fill ' + cls + '" style="width:' + barW + '%"></div></div>' +
        '</div>';
      }).join('');

      return catTotals;
    }

    function renderLedger() {
      var list = getFilteredLedger();
      var box = document.getElementById('ledgerList');
      if (!list.length) {
        box.innerHTML = '<div style="text-align:center;padding:28px;color:var(--text-muted)">Belum ada transaksi yang cocok dengan filter.</div>';
        return;
      }
      box.innerHTML = list.map(function (t) {
        var isInc = t.type === 'income';
        return '<div class="tx-row">' +
          '<div class="tx-left">' +
            '<div class="tx-badge-icon ' + (isInc ? 'income' : 'expense') + '">' + (isInc ? '+' : '−') + '</div>' +
            '<div style="min-width:0">' +
              '<div class="tx-title">' + escapeHTML(t.title) + '</div>' +
              '<div class="tx-meta">' + escapeHTML(t.category) + ' &bull; ' + escapeHTML(t.date) + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="tx-right">' +
            '<span class="tx-amount ' + (isInc ? 'income' : 'expense') + '">' + (isInc ? '+' : '-') + formatIDR(t.amount) + '</span>' +
            '<button class="del-btn" data-del-tx="' + escapeHTML(t.id) + '" title="Hapus transaksi">&times;</button>' +
          '</div>' +
        '</div>';
      }).join('');

      box.querySelectorAll('[data-del-tx]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-del-tx');
          state.tx = state.tx.filter(function (x) { return x.id !== id; });
          saveTx(state.tx);
          renderAll();
          showToast('Transaksi dihapus');
        });
      });
    }

    var latestSummary = { inc: 0, exp: 0, net: 0, ratio: 0, catTotals: {} };

    function renderAll() {
      var monthTx = getMonthTransactions();
      var kpi = renderKPIs(monthTx);
      var catTotals = renderDonutAndBudgets(monthTx);
      latestSummary = Object.assign({}, kpi, { catTotals: catTotals });
      renderLedger();
    }

    if (txForm) {
      txForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var title = document.getElementById('txTitle').value.trim();
        var amount = Number(document.getElementById('txAmount').value);
        var category = txCatEl.value;
        var date = txDateEl.value || new Date().toISOString().slice(0, 10);

        if (!title || !(amount > 0)) {
          showToast('Isi keterangan dan nominal lebih dari Rp 0');
          return;
        }
        state.tx.unshift({
          id: 'tx_' + Date.now(),
          type: state.formType,
          title: title,
          category: category,
          amount: amount,
          date: date
        });
        saveTx(state.tx);
        document.getElementById('txTitle').value = '';
        document.getElementById('txAmount').value = '';
        if (monthFilterEl && date.slice(0, 7) !== state.filterMonth && state.filterMonth !== '') {
          state.filterMonth = date.slice(0, 7);
          monthFilterEl.value = state.filterMonth;
        }
        renderAll();
        showToast((state.formType === 'income' ? 'Pemasukan' : 'Pengeluaran') + ' dicatat!');
      });
    }

    if (monthFilterEl) {
      monthFilterEl.addEventListener('change', function () {
        state.filterMonth = monthFilterEl.value;
        renderAll();
      });
    }
    if (typeFilterEl) {
      typeFilterEl.addEventListener('change', function () {
        state.filterType = typeFilterEl.value;
        renderLedger();
      });
    }
    if (searchFilterEl) {
      searchFilterEl.addEventListener('input', function () {
        state.filterSearch = searchFilterEl.value;
        renderLedger();
      });
    }

    // Budget Modal
    var budgetModal = document.getElementById('budgetModal');
    var budgetInputsBox = document.getElementById('budgetInputsBox');
    var openBudgetBtn = document.getElementById('openBudgetModalBtn');
    var saveBudgetBtn = document.getElementById('saveBudgetBtn');

    if (openBudgetBtn && budgetModal) {
      openBudgetBtn.addEventListener('click', function () {
        budgetInputsBox.innerHTML = EXPENSE_CATEGORIES.map(function (c) {
          return '<div class="field">' +
            '<label>' + escapeHTML(c.name) + ' (Rp)</label>' +
            '<input type="number" class="input budget-input" data-cat="' + escapeHTML(c.name) + '" min="0" step="50000" value="' + (state.budgets[c.name] || 0) + '">' +
          '</div>';
        }).join('');
        budgetModal.classList.add('open');
      });
    }
    document.querySelectorAll('[data-close-budget]').forEach(function (b) {
      b.addEventListener('click', function () { budgetModal.classList.remove('open'); });
    });
    if (saveBudgetBtn) {
      saveBudgetBtn.addEventListener('click', function () {
        document.querySelectorAll('.budget-input').forEach(function (inp) {
          var cat = inp.getAttribute('data-cat');
          state.budgets[cat] = Math.max(0, Number(inp.value) || 0);
        });
        saveBudgets(state.budgets);
        budgetModal.classList.remove('open');
        renderAll();
        showToast('Batas anggaran kategori diperbarui');
      });
    }

    // Savings Goal Calculator
    var goalTargetEl = document.getElementById('goalTarget');
    var goalInitialEl = document.getElementById('goalInitial');
    var goalMonthlyEl = document.getElementById('goalMonthly');
    var goalRateEl = document.getElementById('goalRate');
    var goalResultEl = document.getElementById('goalResultBox');

    function calcSavingsGoal() {
      var target = Math.max(0, Number(goalTargetEl.value) || 0);
      var initial = Math.max(0, Number(goalInitialEl.value) || 0);
      var monthly = Math.max(0, Number(goalMonthlyEl.value) || 0);
      var annualRate = Math.max(0, Number(goalRateEl.value) || 0);
      var r = (annualRate / 100) / 12;

      if (target <= 0) {
        goalResultEl.innerHTML = '<div style="font-size:13px">Masukkan target nominal tabungan di atas.</div>';
        return;
      }
      if (initial >= target) {
        goalResultEl.innerHTML = '<div class="goal-highlight">Target Sudah Tercapai!</div><div style="font-size:12px">Tabungan awal Anda sudah memenuhi target.</div>';
        return;
      }
      if (monthly <= 0 && r <= 0) {
        goalResultEl.innerHTML = '<div style="font-size:13px">Isi setoran bulanan lebih dari Rp 0 untuk menghitung estimasi waktu.</div>';
        return;
      }

      var balance = initial;
      var months = 0;
      var maxMonths = 600;
      while (balance < target && months < maxMonths) {
        balance = balance * (1 + r) + monthly;
        months++;
      }

      var years = Math.floor(months / 12);
      var remMonths = months % 12;
      var timeText = (years > 0 ? years + ' tahun ' : '') + remMonths + ' bulan';
      if (months >= maxMonths) timeText = '> 50 tahun';

      var totalSetoran = initial + (monthly * months);
      var estBunga = Math.max(0, Math.round(balance - totalSetoran));
      var pctNow = Math.min(100, Math.round((initial / target) * 100));

      goalResultEl.innerHTML =
        '<div style="font-size:12px;font-weight:600">Estimasi Waktu Tercapai</div>' +
        '<div class="goal-highlight">' + timeText + ' (' + months + ' bln)</div>' +
        '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">Progres awal: ' + pctNow + '% &bull; Estimasi imbal hasil: ' + formatIDR(estBunga) + '</div>' +
        '<div class="progress-track"><div class="progress-fill safe" style="width:' + pctNow + '%"></div></div>';
    }

    [goalTargetEl, goalInitialEl, goalMonthlyEl, goalRateEl].forEach(function (el) {
      if (el) el.addEventListener('input', calcSavingsGoal);
    });
    calcSavingsGoal();

    // WhatsApp Summary Share
    var waShareBtn = document.getElementById('waShareBtn');
    if (waShareBtn) {
      waShareBtn.addEventListener('click', function () {
        var periodLabel = state.filterMonth || 'Semua Periode';
        var topCat = '-';
        var topVal = 0;
        Object.keys(latestSummary.catTotals || {}).forEach(function (k) {
          if (latestSummary.catTotals[k] > topVal) {
            topVal = latestSummary.catTotals[k];
            topCat = k;
          }
        });
        var text =
          '*Ringkasan Keuangan (' + periodLabel + ')*\n' +
          'Pemasukan: ' + formatIDR(latestSummary.inc) + '\n' +
          'Pengeluaran: ' + formatIDR(latestSummary.exp) + '\n' +
          'Saldo Bersih: ' + formatIDR(latestSummary.net) + '\n' +
          'Rasio Tabungan: ' + latestSummary.ratio + '%\n' +
          'Pengeluaran Terbesar: ' + topCat + ' (' + formatIDR(topVal) + ')\n' +
          '_Dicatat dengan Ddev Kalkulator Finansial (https://asetkode.blogspot.com)_';
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
      });
    }

    // CSV Export
    var csvBtn = document.getElementById('exportCsvBtn');
    if (csvBtn) {
      csvBtn.addEventListener('click', function () {
        var rows = [['Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Nominal']];
        getFilteredLedger().forEach(function (t) {
          rows.push([t.date, t.type === 'income' ? 'Pemasukan' : 'Pengeluaran', t.category, t.title, t.amount]);
        });
        var csv = '\uFEFF' + rows.map(function (r) {
          return r.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(',');
        }).join('\n');
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'laporan-keuangan-' + (state.filterMonth || 'semua') + '.csv';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Laporan CSV berhasil diunduh');
      });
    }

    // Reset Demo Data
    var resetBtn = document.getElementById('resetDemoBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        state.tx = makeSeedTx();
        state.budgets = Object.assign({}, DEFAULT_BUDGETS);
        saveTx(state.tx);
        saveBudgets(state.budgets);
        state.filterMonth = currentMonthStr();
        if (monthFilterEl) monthFilterEl.value = state.filterMonth;
        renderAll();
        showToast('Data demo berhasil dikembalikan');
      });
    }

    renderAll();
  });
})();
