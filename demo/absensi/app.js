/**
 * AbsensiQR Pro — Live Interactive Demo Controller
 * Self-contained ES6 + Deterministic QR SVG + WebAudio Beep + Export CSV/XLS
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'ddev_absensi_qr_demo_v2';
  const THEME_KEY = 'ddev_absensi_theme_v1';

  function isoDateOffset(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function createSeedState() {
    const today = isoDateOffset(0);
    const d1 = isoDateOffset(-1);
    const d2 = isoDateOffset(-2);
    const d3 = isoDateOffset(-3);
    const d4 = isoDateOffset(-4);

    return {
      members: [
        { qrCode: 'EMP-001', name: 'Budi Santoso', department: 'Operasional', position: 'Staff Kasir' },
        { qrCode: 'EMP-002', name: 'Siti Aminah', department: 'Logistik', position: 'Admin Gudang' },
        { qrCode: 'EMP-003', name: 'Andi Wijaya', department: 'XII IPA 1', position: 'Ketua Kelas' },
        { qrCode: 'EMP-004', name: 'Rina Marlina', department: 'Pelayanan', position: 'Customer Service' },
        { qrCode: 'EMP-005', name: 'Dewi Lestari', department: 'Keuangan', position: 'Staff Finance' },
        { qrCode: 'EMP-006', name: 'Rizky Pratama', department: 'XII RPL 2', position: 'Siswa Praktik' },
        { qrCode: 'EMP-007', name: 'Fajar Nugroho', department: 'IT & Sistem', position: 'Teknisi Jaringan' },
        { qrCode: 'EMP-008', name: 'Nadia Putri', department: 'XII IPS 1', position: 'Siswa Aktif' }
      ],
      logs: [
        { qrCode: 'EMP-005', name: 'Dewi Lestari', department: 'Keuangan', date: today, checkIn: '07:42:33', checkOut: '17:04:19', status: 'Tepat Waktu', method: 'Kamera Browser' },
        { qrCode: 'EMP-004', name: 'Rina Marlina', department: 'Pelayanan', date: today, checkIn: '08:26:04', checkOut: '', status: 'Terlambat', method: 'Input Manual' },
        { qrCode: 'EMP-003', name: 'Andi Wijaya', department: 'XII IPA 1', date: today, checkIn: '08:09:15', checkOut: '', status: 'Tepat Waktu', method: 'Kamera Browser' },
        { qrCode: 'EMP-002', name: 'Siti Aminah', department: 'Logistik', date: today, checkIn: '07:55:40', checkOut: '', status: 'Tepat Waktu', method: 'Scanner USB' },
        { qrCode: 'EMP-001', name: 'Budi Santoso', department: 'Operasional', date: today, checkIn: '07:48:12', checkOut: '', status: 'Tepat Waktu', method: 'Kamera Browser' },
        { qrCode: 'EMP-001', name: 'Budi Santoso', department: 'Operasional', date: d1, checkIn: '07:51:05', checkOut: '17:02:11', status: 'Tepat Waktu', method: 'Kamera Browser' },
        { qrCode: 'EMP-002', name: 'Siti Aminah', department: 'Logistik', date: d1, checkIn: '08:03:22', checkOut: '17:05:44', status: 'Tepat Waktu', method: 'Scanner USB' },
        { qrCode: 'EMP-003', name: 'Andi Wijaya', department: 'XII IPA 1', date: d1, checkIn: '07:58:10', checkOut: '15:30:00', status: 'Tepat Waktu', method: 'Kamera Browser' },
        { qrCode: 'EMP-006', name: 'Rizky Pratama', department: 'XII RPL 2', date: d1, checkIn: '08:21:47', checkOut: '16:15:10', status: 'Terlambat', method: 'Kamera Browser' },
        { qrCode: 'EMP-007', name: 'Fajar Nugroho', department: 'IT & Sistem', date: d1, checkIn: '07:38:00', checkOut: '17:12:05', status: 'Tepat Waktu', method: 'Scanner USB' },
        { qrCode: 'EMP-001', name: 'Budi Santoso', department: 'Operasional', date: d2, checkIn: '07:45:00', checkOut: '17:01:20', status: 'Tepat Waktu', method: 'Kamera Browser' },
        { qrCode: 'EMP-005', name: 'Dewi Lestari', department: 'Keuangan', date: d2, checkIn: '08:18:30', checkOut: '17:08:00', status: 'Terlambat', method: 'Input Manual' },
        { qrCode: 'EMP-008', name: 'Nadia Putri', department: 'XII IPS 1', date: d2, checkIn: '07:54:25', checkOut: '15:20:00', status: 'Tepat Waktu', method: 'Kamera Browser' },
        { qrCode: 'EMP-004', name: 'Rina Marlina', department: 'Pelayanan', date: d3, checkIn: '07:49:18', checkOut: '17:00:50', status: 'Tepat Waktu', method: 'Kamera Browser' },
        { qrCode: 'EMP-007', name: 'Fajar Nugroho', department: 'IT & Sistem', date: d4, checkIn: '07:41:09', checkOut: '17:06:12', status: 'Tepat Waktu', method: 'Scanner USB' }
      ]
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.members) && Array.isArray(parsed.logs)) {
          return parsed;
        }
      }
    } catch (_) {}
    return createSeedState();
  }

  let state = loadState();
  let scanMode = 'in';
  let cameraStream = null;
  let cameraTimer = null;
  let lastCamCode = '';
  let lastCamAt = 0;

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    renderAll();
  }

  function escapeHtml(val) {
    return String(val ?? '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function getInitials(name) {
    const parts = String(name || 'A').trim().split(/\s+/);
    return ((parts[0] || 'A')[0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  // ==================== DETERMINISTIC QR SVG ====================
  function hashStr(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
  }

  function isFinder(r, c, size) {
    const tl = r < 7 && c < 7;
    const tr = r < 7 && c >= size - 7;
    const bl = r >= size - 7 && c < 7;
    if (!tl && !tr && !bl) return null;
    const lr = r >= size - 7 ? r - (size - 7) : r;
    const lc = c >= size - 7 ? c - (size - 7) : c;
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    return lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
  }

  function generateQrSvg(code) {
    const clean = String(code || 'EMP-000').trim().toUpperCase();
    const size = 21;
    const seedA = hashStr(clean);
    const seedB = hashStr(clean.split('').reverse().join('') + '#QR');
    let rects = '';

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const finder = isFinder(r, c, size);
        let dark = false;
        if (finder !== null) {
          dark = finder;
        } else if (
          (r === 7 && c < 8) || (c === 7 && r < 8) ||
          (r === 7 && c >= size - 8) || (c === size - 8 && r < 8) ||
          (r === size - 8 && c < 8) || (c === 7 && r >= size - 8)
        ) {
          dark = false;
        } else if (r === 6 || c === 6) {
          dark = (r + c) % 2 === 0;
        } else {
          const idx = r * size + c;
          const cc = clean.charCodeAt(idx % clean.length) || 65;
          const mix = (seedA ^ ((seedB >>> (idx % 19)) + idx * 17 + cc * 31)) >>> 0;
          dark = (mix & 1) === 1;
        }
        if (dark) {
          rects += `<rect x="${c + 1}" y="${r + 1}" width="1" height="1" fill="#0f172a"/>`;
        }
      }
    }
    const vb = size + 2;
    return `<svg viewBox="0 0 ${vb} ${vb}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img" aria-label="QR ${escapeHtml(clean)}"><rect width="${vb}" height="${vb}" fill="#ffffff"/>${rects}</svg>`;
  }

  // ==================== WEBAUDIO BEEP & TOAST ====================
  function playBeep(type) {
    const toggle = document.getElementById('soundToggle');
    if (toggle && !toggle.checked) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'ok') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1174, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.11, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.start();
        osc.stop(ctx.currentTime + 0.17);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.23);
      }
    } catch (_) {}
  }

  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => el.classList.remove('show'), 3200);
  }

  function showFeedback(type, msg) {
    const fb = document.getElementById('scanFeedback');
    fb.className = 'alert-banner show ' + type;
    fb.textContent = msg;
  }

  // ==================== SCAN LOGIC (ANTI DOUBLE-SCAN) ====================
  function processScan(rawCode, method) {
    const code = String(rawCode || '').trim().toUpperCase();
    if (!code) {
      showFeedback('warn', 'Masukkan atau scan Kode QR terlebih dahulu.');
      playBeep('err');
      return;
    }

    const member = state.members.find((m) => m.qrCode === code);
    if (!member) {
      const msg = `Kode QR "${code}" tidak ditemukan di daftar anggota.`;
      showFeedback('err', msg);
      showToast(msg);
      playBeep('err');
      return;
    }

    const today = isoDateOffset(0);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
    const existingIdx = state.logs.findIndex((l) => l.qrCode === code && l.date === today);

    if (scanMode === 'in') {
      if (existingIdx !== -1 && state.logs[existingIdx].checkIn) {
        const existing = state.logs[existingIdx];
        const msg = `${member.name} (${code}) sudah Absen Masuk hari ini pukul ${existing.checkIn} (${existing.status}).`;
        showFeedback('warn', msg);
        showToast(msg);
        playBeep('err');
        return;
      }

      const status = timeStr > '08:15:00' ? 'Terlambat' : 'Tepat Waktu';
      const newLog = {
        qrCode: member.qrCode,
        name: member.name,
        department: member.department,
        date: today,
        checkIn: timeStr,
        checkOut: '',
        status,
        method: method || 'Input Manual'
      };
      state.logs.unshift(newLog);
      saveState();

      const msg = `Absen Masuk berhasil: ${member.name} (${code}) pukul ${timeStr} — ${status}.`;
      showFeedback('ok', msg);
      showToast(msg);
      playBeep('ok');
      document.getElementById('scanInput').value = '';
    } else {
      if (existingIdx === -1 || !state.logs[existingIdx].checkIn) {
        const msg = `${member.name} (${code}) belum melakukan Absen Masuk hari ini.`;
        showFeedback('err', msg);
        showToast(msg);
        playBeep('err');
        return;
      }
      if (state.logs[existingIdx].checkOut) {
        const msg = `${member.name} (${code}) sudah Absen Pulang hari ini pukul ${state.logs[existingIdx].checkOut}.`;
        showFeedback('warn', msg);
        showToast(msg);
        playBeep('err');
        return;
      }

      const updated = { ...state.logs[existingIdx], checkOut: timeStr };
      state.logs.splice(existingIdx, 1);
      state.logs.unshift(updated);
      saveState();

      const msg = `Absen Pulang berhasil: ${member.name} (${code}) pukul ${timeStr}.`;
      showFeedback('ok', msg);
      showToast(msg);
      playBeep('ok');
      document.getElementById('scanInput').value = '';
    }
  }

  // ==================== RENDERERS ====================
  function renderDepartmentsDropdowns() {
    const depts = Array.from(new Set(state.members.map((m) => m.department))).sort();
    ['memberDeptFilter', 'filterDept'].forEach((id) => {
      const sel = document.getElementById(id);
      const current = sel.value;
      sel.innerHTML = '<option value="">Semua Divisi/Kelas</option>' +
        depts.map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
      if (depts.includes(current)) sel.value = current;
    });
  }

  function renderKpisAndHeader() {
    const today = isoDateOffset(0);
    const todayLogs = state.logs.filter((l) => l.date === today);
    const total = state.members.length;
    const present = todayLogs.length;
    const onTime = todayLogs.filter((l) => l.status === 'Tepat Waktu').length;
    const late = todayLogs.filter((l) => l.status === 'Terlambat').length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;

    document.getElementById('kpiTotalMembers').textContent = total;
    document.getElementById('kpiPresentToday').textContent = present;
    document.getElementById('kpiPresentPct').textContent = `${pct}% tingkat kehadiran`;
    document.getElementById('kpiOnTime').textContent = onTime;
    document.getElementById('kpiLate').textContent = late;
    document.getElementById('todayCountPill').textContent = `${present} Hadir`;
    document.getElementById('membersCountBadge').textContent = total;
    document.getElementById('logsCountBadge').textContent = state.logs.length;
  }

  function renderQuickChipsAndTodayList() {
    const today = isoDateOffset(0);
    const todayLogs = state.logs.filter((l) => l.date === today);
    const logByCode = {};
    todayLogs.forEach((l) => { logByCode[l.qrCode] = l; });

    document.getElementById('quickScanBtns').innerHTML = state.members.map((m) => {
      const l = logByCode[m.qrCode];
      const dotCls = l ? (l.checkOut ? 'out' : 'in') : '';
      return `<button type="button" class="q-chip" data-scan="${escapeHtml(m.qrCode)}"><span class="dot ${dotCls}"></span><span>${escapeHtml(m.qrCode)} • ${escapeHtml(m.name)}</span></button>`;
    }).join('');

    const q = (document.getElementById('todaySearchInput').value || '').trim().toLowerCase();
    const filtered = todayLogs.filter((l) =>
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.qrCode.toLowerCase().includes(q) ||
      l.department.toLowerCase().includes(q)
    );

    const listEl = document.getElementById('todayAttList');
    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="text-align:center;padding:34px 12px;color:var(--text-muted);">Belum ada data kehadiran yang cocok hari ini.</div>';
      return;
    }

    listEl.innerHTML = filtered.map((l) => {
      const badgeCls = l.status === 'Tepat Waktu' ? 'badge-ok' : 'badge-late';
      return `
        <div class="att-row">
          <div class="att-person">
            <div class="avatar">${escapeHtml(getInitials(l.name))}</div>
            <div style="min-width:0;">
              <div class="att-name">${escapeHtml(l.name)}</div>
              <div class="att-meta"><code>${escapeHtml(l.qrCode)}</code> • ${escapeHtml(l.department)} • ${escapeHtml(l.method)}</div>
            </div>
          </div>
          <div class="att-times">
            <div class="att-clock">IN ${escapeHtml(l.checkIn || '--:--')} | OUT ${escapeHtml(l.checkOut || '--:--')}</div>
            <span class="badge ${badgeCls}">${escapeHtml(l.status)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderMemberCards() {
    const q = (document.getElementById('memberSearchInput').value || '').trim().toLowerCase();
    const dept = document.getElementById('memberDeptFilter').value;

    const list = state.members.filter((m) => {
      if (dept && m.department !== dept) return false;
      if (q && !m.name.toLowerCase().includes(q) && !m.qrCode.toLowerCase().includes(q)) return false;
      return true;
    });

    const grid = document.getElementById('qrCardsGrid');
    if (list.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-muted);">Tidak ada anggota ditemukan.</div>';
      return;
    }

    grid.innerHTML = list.map((m) => `
      <div class="qr-card">
        <div class="qr-card-org">Ddev Tech / SMK Nusantara</div>
        <div class="qr-card-name">${escapeHtml(m.name)}</div>
        <div class="qr-card-role">${escapeHtml(m.department)} • ${escapeHtml(m.position)}</div>
        <div class="qr-svg-wrap">${generateQrSvg(m.qrCode)}</div>
        <div class="qr-code-tag">${escapeHtml(m.qrCode)}</div>
        <div class="qr-card-actions">
          <button type="button" class="btn btn-primary btn-sm" data-card-scan="${escapeHtml(m.qrCode)}">Scan Cepat</button>
          <button type="button" class="btn btn-danger-soft btn-sm" data-card-del="${escapeHtml(m.qrCode)}">Hapus</button>
        </div>
      </div>
    `).join('');
  }

  function getFilteredLogs() {
    const start = document.getElementById('filterStartDate').value;
    const end = document.getElementById('filterEndDate').value;
    const dept = document.getElementById('filterDept').value;
    const status = document.getElementById('filterStatus').value;

    return state.logs.filter((l) => {
      if (start && l.date < start) return false;
      if (end && l.date > end) return false;
      if (dept && l.department !== dept) return false;
      if (status && l.status !== status) return false;
      return true;
    });
  }

  function renderReportAndChart() {
    // 7-day bar chart
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const dt = isoDateOffset(-i);
      const count = state.logs.filter((l) => l.date === dt).length;
      days.push({ label: dt.slice(8, 10) + '/' + dt.slice(5, 7), count });
    }
    const maxCount = Math.max(1, ...days.map((d) => d.count));
    document.getElementById('weeklyChartBars').innerHTML = days.map((d) => {
      const pct = Math.max(6, Math.round((d.count / maxCount) * 100));
      return `
        <div class="chart-col">
          <div class="chart-count">${d.count}</div>
          <div class="chart-bar-wrap"><div class="chart-bar" style="height:${pct}%"></div></div>
          <div class="chart-label">${escapeHtml(d.label)}</div>
        </div>
      `;
    }).join('');

    // Filtered table
    const filtered = getFilteredLogs();
    const tbody = document.getElementById('reportTableBody');
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:28px;color:var(--text-muted);">Tidak ada data absensi pada filter yang dipilih.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map((l) => `
      <tr>
        <td>${escapeHtml(l.date)}</td>
        <td><code>${escapeHtml(l.qrCode)}</code></td>
        <td><strong>${escapeHtml(l.name)}</strong></td>
        <td>${escapeHtml(l.department)}</td>
        <td style="font-family:var(--font-mono);">${escapeHtml(l.checkIn || '-')}</td>
        <td style="font-family:var(--font-mono);">${escapeHtml(l.checkOut || '-')}</td>
        <td>${escapeHtml(l.method)}</td>
        <td><span class="badge ${l.status === 'Tepat Waktu' ? 'badge-ok' : 'badge-late'}">${escapeHtml(l.status)}</span></td>
      </tr>
    `).join('');
  }

  function renderAll() {
    renderDepartmentsDropdowns();
    renderKpisAndHeader();
    renderQuickChipsAndTodayList();
    renderMemberCards();
    renderReportAndChart();
  }

  // ==================== THEME TOGGLE ====================
  function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const btn = document.getElementById('themeToggleBtn');
    btn.innerHTML = isDark
      ? '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
      : '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  }

  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
    updateThemeIcon();
  });

  // ==================== NAVIGATION & EVENTS ====================
  function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.view-panel').forEach((p) => {
      p.classList.toggle('active', p.id === 'tab-' + tabName);
    });
  }

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  document.querySelectorAll('#modeToggle .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#modeToggle .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      scanMode = btn.getAttribute('data-mode') || 'in';
      document.getElementById('scanInput').focus();
    });
  });

  document.getElementById('scanForm').addEventListener('submit', (e) => {
    e.preventDefault();
    processScan(document.getElementById('scanInput').value, 'Input Manual');
  });

  document.getElementById('quickScanBtns').addEventListener('click', (e) => {
    const chip = e.target.closest('.q-chip');
    if (!chip) return;
    const code = chip.getAttribute('data-scan');
    document.getElementById('scanInput').value = code;
    processScan(code, 'Simulasi Cepat');
  });

  document.getElementById('todaySearchInput').addEventListener('input', renderQuickChipsAndTodayList);
  document.getElementById('memberSearchInput').addEventListener('input', renderMemberCards);
  document.getElementById('memberDeptFilter').addEventListener('change', renderMemberCards);

  ['filterStartDate', 'filterEndDate', 'filterDept', 'filterStatus'].forEach((id) => {
    document.getElementById(id).addEventListener('change', renderReportAndChart);
  });

  document.getElementById('addMemberForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('mName').value.trim();
    const department = document.getElementById('mDept').value.trim();
    const position = document.getElementById('mPos').value.trim() || 'Anggota';
    let qrCode = document.getElementById('mCode').value.trim().toUpperCase();

    if (!name || !department) return;
    if (!qrCode) {
      qrCode = `EMP-${String(state.members.length + 1).padStart(3, '0')}`;
    }
    if (state.members.some((m) => m.qrCode === qrCode)) {
      showToast(`Kode QR ${qrCode} sudah digunakan!`);
      playBeep('err');
      return;
    }

    state.members.unshift({ qrCode, name, department, position });
    e.target.reset();
    saveState();
    playBeep('ok');
    showToast(`Kartu QR baru dibuat: ${name} (${qrCode})`);
  });

  document.getElementById('qrCardsGrid').addEventListener('click', (e) => {
    const scanBtn = e.target.closest('[data-card-scan]');
    if (scanBtn) {
      const code = scanBtn.getAttribute('data-card-scan');
      switchTab('scan');
      document.getElementById('scanInput').value = code;
      processScan(code, 'Kartu QR');
      return;
    }

    const delBtn = e.target.closest('[data-card-del]');
    if (delBtn) {
      const code = delBtn.getAttribute('data-card-del');
      state.members = state.members.filter((m) => m.qrCode !== code);
      saveState();
      showToast(`Anggota ${code} dihapus.`);
    }
  });

  document.getElementById('printCardsBtn').addEventListener('click', () => window.print());

  document.getElementById('resetDemoBtn').addEventListener('click', () => {
    state = createSeedState();
    saveState();
    showToast('Data demo berhasil direset ke kondisi awal.');
  });

  // ==================== EXPORT CSV & XLS ====================
  function downloadBlob(content, mime, filename) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  document.getElementById('exportCsvBtn').addEventListener('click', () => {
    const rows = getFilteredLogs();
    const lines = ['No,Tanggal,Kode QR,Nama Lengkap,Divisi/Kelas,Jam Masuk,Jam Pulang,Metode,Status'];
    rows.forEach((r, i) => {
      lines.push([
        i + 1,
        r.date,
        r.qrCode,
        `"${String(r.name).replace(/"/g, '""')}"`,
        `"${String(r.department).replace(/"/g, '""')}"`,
        r.checkIn || '-',
        r.checkOut || '-',
        `"${String(r.method).replace(/"/g, '""')}"`,
        r.status
      ].join(','));
    });
    downloadBlob('\uFEFF' + lines.join('\r\n'), 'text/csv;charset=utf-8;', `rekap-absensi-${isoDateOffset(0)}.csv`);
    showToast(`Export CSV (${rows.length} baris) berhasil diunduh.`);
  });

  document.getElementById('exportXlsBtn').addEventListener('click', () => {
    const rows = getFilteredLogs();
    const trHtml = rows.map((r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(r.date)}</td>
        <td>${escapeHtml(r.qrCode)}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${escapeHtml(r.department)}</td>
        <td>${escapeHtml(r.checkIn || '-')}</td>
        <td>${escapeHtml(r.checkOut || '-')}</td>
        <td>${escapeHtml(r.method)}</td>
        <td>${escapeHtml(r.status)}</td>
      </tr>
    `).join('');

    const html = `<html><head><meta charset="UTF-8"></head><body>
      <h3>Rekapitulasi Absensi QR — Ddev Tech / SMK Nusantara</h3>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead><tr><th>No</th><th>Tanggal</th><th>Kode QR</th><th>Nama</th><th>Divisi/Kelas</th><th>Jam Masuk</th><th>Jam Pulang</th><th>Metode</th><th>Status</th></tr></thead>
        <tbody>${trHtml}</tbody>
      </table>
    </body></html>`;

    downloadBlob('\uFEFF' + html, 'application/vnd.ms-excel;charset=utf-8;', `rekap-absensi-${isoDateOffset(0)}.xls`);
    showToast(`Export Excel (.xls) berhasil diunduh.`);
  });

  // ==================== CAMERA QR SCANNER (OPTIONAL LIVE) ====================
  async function stopCamera() {
    clearInterval(cameraTimer);
    cameraTimer = null;
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      cameraStream = null;
    }
    document.getElementById('cameraVideo').srcObject = null;
    document.getElementById('cameraBox').classList.remove('streaming');
    document.getElementById('toggleCameraBtn').textContent = 'Aktifkan Kamera';
    document.getElementById('cameraStatusText').textContent = 'Input USB & Manual siap';
    document.getElementById('detectorBadge').textContent = 'Siap Scan';
  }

  document.getElementById('toggleCameraBtn').addEventListener('click', async () => {
    if (cameraStream) {
      stopCamera();
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showFeedback('warn', 'Kamera tidak tersedia pada browser/konteks ini. Gunakan input kode atau chip simulasi.');
      return;
    }
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      const video = document.getElementById('cameraVideo');
      video.srcObject = cameraStream;
      await video.play();
      document.getElementById('cameraBox').classList.add('streaming');
      document.getElementById('toggleCameraBtn').textContent = 'Matikan Kamera';

      if ('BarcodeDetector' in window) {
        const detector = new BarcodeDetector({ formats: ['qr_code'] });
        document.getElementById('detectorBadge').textContent = 'Kamera Aktif (QR)';
        document.getElementById('cameraStatusText').textContent = 'Arahkan QR Code ke kamera...';
        cameraTimer = setInterval(async () => {
          if (!cameraStream || video.readyState < 2) return;
          try {
            const codes = await detector.detect(video);
            if (codes && codes.length > 0) {
              const val = (codes[0].rawValue || '').trim().toUpperCase();
              const now = Date.now();
              if (val && (val !== lastCamCode || now - lastCamAt > 3000)) {
                lastCamCode = val;
                lastCamAt = now;
                document.getElementById('scanInput').value = val;
                processScan(val, 'Kamera Browser');
              }
            }
          } catch (_) {}
        }, 350);
      } else {
        document.getElementById('detectorBadge').textContent = 'Kamera Preview';
        document.getElementById('cameraStatusText').textContent = 'BarcodeDetector belum didukung browser ini; gunakan input atau chip simulasi.';
      }
    } catch (err) {
      showFeedback('warn', 'Akses kamera tidak diberikan (' + err.message + '). Gunakan input atau simulasi cepat.');
    }
  });

  // ==================== INIT ====================
  document.getElementById('filterStartDate').value = isoDateOffset(-6);
  document.getElementById('filterEndDate').value = isoDateOffset(0);
  updateThemeIcon();
  document.getElementById('liveClock').textContent = new Date().toLocaleTimeString('id-ID', { hour12: false });
  setInterval(() => {
    document.getElementById('liveClock').textContent = new Date().toLocaleTimeString('id-ID', { hour12: false });
  }, 1000);
  renderAll();
})();
