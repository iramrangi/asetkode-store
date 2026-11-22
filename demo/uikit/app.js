/* ==========================================================================
   UI Kit E-Commerce & SaaS Pro v3.0 — 42 Interactive Components Registry
   ========================================================================== */
(function () {
  'use strict';

  const CATEGORIES = [
    { id: 'navigation', label: 'Navigation & Header' },
    { id: 'hero', label: 'Hero & Conversion CTA' },
    { id: 'ecommerce', label: 'E-Commerce Cards & Cart' },
    { id: 'saas', label: 'SaaS Pricing & Social Proof' },
    { id: 'forms', label: 'Forms, Auth & Checkout' },
    { id: 'dashboard', label: 'Dashboard & Data UI' },
    { id: 'overlays', label: 'Overlays, Feedback & Footer' }
  ];

  // Helper SVG Artwork untuk E-Commerce & Hero (Zero kotak kosong!)
  const SVG_ART = {
    keyboard: `<svg width="112" height="72" viewBox="0 0 112 72" fill="none" aria-hidden="true">
      <rect x="6" y="14" width="100" height="44" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <rect x="13" y="21" width="10" height="8" rx="2" fill="#6366f1"/>
      <rect x="26" y="21" width="10" height="8" rx="2" fill="#e2e8f0"/>
      <rect x="39" y="21" width="10" height="8" rx="2" fill="#e2e8f0"/>
      <rect x="52" y="21" width="10" height="8" rx="2" fill="#e2e8f0"/>
      <rect x="65" y="21" width="10" height="8" rx="2" fill="#e2e8f0"/>
      <rect x="78" y="21" width="20" height="8" rx="2" fill="#818cf8"/>
      <rect x="13" y="32" width="14" height="8" rx="2" fill="#cbd5e1"/>
      <rect x="30" y="32" width="10" height="8" rx="2" fill="#cbd5e1"/>
      <rect x="43" y="32" width="10" height="8" rx="2" fill="#cbd5e1"/>
      <rect x="56" y="32" width="10" height="8" rx="2" fill="#cbd5e1"/>
      <rect x="69" y="32" width="10" height="8" rx="2" fill="#cbd5e1"/>
      <rect x="82" y="32" width="16" height="8" rx="2" fill="#38bdf8"/>
      <rect x="13" y="43" width="14" height="8" rx="2" fill="#94a3b8"/>
      <rect x="30" y="43" width="44" height="8" rx="2" fill="#f59e0b"/>
      <rect x="77" y="43" width="21" height="8" rx="2" fill="#94a3b8"/>
    </svg>`,
    headphone: `<svg width="96" height="82" viewBox="0 0 96 82" fill="none" aria-hidden="true">
      <path d="M20 46C20 28.327 32.536 14 48 14C63.464 14 76 28.327 76 46" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
      <path d="M24 44C24 30 34.7 19 48 19C61.3 19 72 30 72 44" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="13" y="42" width="15" height="26" rx="7.5" fill="#1e293b"/>
      <rect x="17" y="46" width="7" height="18" rx="3.5" fill="#38bdf8"/>
      <rect x="68" y="42" width="15" height="26" rx="7.5" fill="#1e293b"/>
      <rect x="72" y="46" width="7" height="18" rx="3.5" fill="#38bdf8"/>
    </svg>`,
    watch: `<svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
      <rect x="30" y="6" width="26" height="16" rx="4" fill="#334155"/>
      <rect x="30" y="64" width="26" height="16" rx="4" fill="#334155"/>
      <rect x="20" y="18" width="46" height="50" rx="12" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
      <rect x="25" y="23" width="36" height="40" rx="8" fill="#1e1b4b"/>
      <circle cx="43" cy="43" r="12" stroke="#10b981" stroke-width="3.5" stroke-dasharray="56 20"/>
      <path d="M43 36V43L48 46" stroke="#f8fafc" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,
    dashboardHero: `<svg width="100%" height="150" viewBox="0 0 320 150" fill="none" aria-hidden="true">
      <rect x="4" y="6" width="312" height="138" rx="12" fill="#0f172a"/>
      <rect x="18" y="20" width="90" height="10" rx="5" fill="#334155"/>
      <rect x="252" y="18" width="50" height="14" rx="7" fill="#10b981" fill-opacity="0.25"/>
      <rect x="18" y="44" width="84" height="44" rx="8" fill="#1e293b"/>
      <rect x="26" y="54" width="42" height="7" rx="3.5" fill="#64748b"/>
      <rect x="26" y="67" width="60" height="12" rx="4" fill="#f8fafc"/>
      <rect x="114" y="44" width="84" height="44" rx="8" fill="#1e293b"/>
      <rect x="122" y="54" width="44" height="7" rx="3.5" fill="#64748b"/>
      <rect x="122" y="67" width="56" height="12" rx="4" fill="#38bdf8"/>
      <rect x="210" y="44" width="92" height="44" rx="8" fill="#1e293b"/>
      <rect x="218" y="54" width="40" height="7" rx="3.5" fill="#64748b"/>
      <rect x="218" y="67" width="68" height="12" rx="4" fill="#a78bfa"/>
      <path d="M22 126L68 112L110 118L158 98L206 105L254 88L298 95" stroke="#6366f1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="254" cy="88" r="4.5" fill="#38bdf8"/>
    </svg>`
  };

  function formatRp(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  }

  function showToast(msg) {
    const t = document.getElementById('kitToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window.__kitToastTimer);
    window.__kitToastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return fallbackCopy(text);
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  // =========================================================================
  // 42 Komponen UI Nyata (7 Kategori x 6 Komponen)
  // =========================================================================
  const COMPONENTS = [
    // -----------------------------------------------------------------------
    // KATEGORI 1: NAVIGATION & HEADER (01 - 06)
    // -----------------------------------------------------------------------
    {
      id: 'comp-01',
      num: '01',
      category: 'navigation',
      categoryLabel: 'Navigation & Header',
      title: 'Sticky Store Navbar + Cart Badge',
      subtitle: 'Header toko online lengkap dengan search bar, menu aktif, dan badge keranjang real-time',
      tags: 'navbar header menu search cart badge toko',
      html: `<nav class="ui-navbar">
  <div class="ui-logo">
    <span class="ui-logo-dot">N</span>
    <span>NusaStore</span>
  </div>
  <div class="ui-nav-links">
    <a href="#katalog" class="active">Katalog</a>
    <a href="#promo">Promo</a>
    <a href="#lacak">Lacak Order</a>
  </div>
  <input type="search" class="ui-input ui-nav-search" placeholder="Cari produk elektronik..." />
  <div class="ui-nav-actions">
    <button type="button" class="ui-btn ui-btn-outline ui-btn-sm">Masuk</button>
    <button type="button" class="ui-btn ui-btn-primary ui-btn-sm" data-action="add-nav-cart">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Keranjang <span class="ui-pill" data-nav-count>2</span>
    </button>
  </div>
</nav>`,
      css: `.ui-navbar { display: flex; align-items: center; justify-content: space-between; gap: 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 11px 18px; flex-wrap: wrap; }
.ui-pill { background: var(--brand); color: var(--brand-fg); padding: 1px 7px; border-radius: var(--radius-full); font-size: 0.72rem; }`,
      bind(root) {
        let count = 2;
        const badge = root.querySelector('[data-nav-count]');
        root.querySelector('[data-action="add-nav-cart"]').addEventListener('click', () => {
          count += 1;
          badge.textContent = String(count);
          showToast('Item ditambah! Keranjang sekarang ' + count);
        });
      }
    },
    {
      id: 'comp-02',
      num: '02',
      category: 'navigation',
      categoryLabel: 'Navigation & Header',
      title: 'Mega Menu Dropdown',
      subtitle: 'Dropdown kategori multi-kolom dengan ikon SVG dan kartu promo unggulan',
      tags: 'mega menu dropdown kategori navigasi',
      html: `<div class="ui-megamenu-wrap">
  <div class="ui-megamenu-bar">
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <strong style="font-size:0.92rem;">TechGear.id</strong>
      <button type="button" class="ui-mega-trigger" data-mega-toggle aria-expanded="true">
        ☰ Semua Kategori ▾
      </button>
      <span class="ui-muted">Klik tombol kategori untuk buka/tutup panel</span>
    </div>
    <span class="ui-badge ui-badge-brand">Gratis Ongkir Jabodetabek</span>
  </div>
  <div class="ui-mega-panel" data-mega-panel>
    <div class="ui-mega-cols">
      <a href="#audio" class="ui-mega-item">
        <div class="ui-mega-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-3px;"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg></div>
        <div><strong>Audio &amp; Headset</strong><span>ANC Wireless, IEM Studio, Mic</span></div>
      </a>
      <a href="#keyboard" class="ui-mega-item">
        <div class="ui-mega-ico">⌨️</div>
        <div><strong>Mechanical Keyboard</strong><span>Hot-swap, Keycaps PBT, Switch</span></div>
      </a>
      <a href="#wearable" class="ui-mega-item">
        <div class="ui-mega-ico">⌚</div>
        <div><strong>Smartwatch &amp; Fitness</strong><span>AMOLED GPS, Strap Kulit</span></div>
      </a>
      <a href="#saas" class="ui-mega-item">
        <div class="ui-mega-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
        <div><strong>Aksesoris Setup Meja</strong><span>Monitor Arm, USB-C Hub, Dock</span></div>
      </a>
    </div>
    <div class="ui-mega-promo">
      <div>
        <span class="ui-badge" style="background:rgba(255,255,255,0.2);color:#fff;">BUNDLE HEMAT</span>
        <h4 style="margin-top:8px;font-size:1rem;">Setup Work From Home Pro</h4>
        <p style="font-size:0.78rem;opacity:0.9;margin-top:4px;">Diskon hingga 30% untuk pembelian Keyboard + Deskmat.</p>
      </div>
      <button type="button" class="ui-btn ui-btn-ink ui-btn-sm">Lihat Paket →</button>
    </div>
  </div>
</div>`,
      css: `.ui-mega-panel { display: grid; grid-template-columns: 2fr 1fr; gap: 18px; padding: 18px; }
.ui-mega-cols { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }`,
      bind(root) {
        const btn = root.querySelector('[data-mega-toggle]');
        const panel = root.querySelector('[data-mega-panel]');
        btn.addEventListener('click', () => {
          const open = panel.hasAttribute('hidden');
          if (open) {
            panel.removeAttribute('hidden');
            btn.setAttribute('aria-expanded', 'true');
          } else {
            panel.setAttribute('hidden', '');
            btn.setAttribute('aria-expanded', 'false');
          }
        });
      }
    },
    {
      id: 'comp-03',
      num: '03',
      category: 'navigation',
      categoryLabel: 'Navigation & Header',
      title: 'Breadcrumb Multi-level',
      subtitle: 'Jalur navigasi hierarki produk & dashboard dengan ikon Home SVG',
      tags: 'breadcrumb path navigasi hierarki',
      html: `<div class="ui-breadcrumb-box">
  <nav aria-label="Breadcrumb Toko">
    <ol class="ui-breadcrumb">
      <li><a href="#home"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Beranda</a></li>
      <li class="sep">/</li>
      <li><a href="#elektronik">Elektronik</a></li>
      <li class="sep">/</li>
      <li><a href="#aksesoris">Aksesoris PC</a></li>
      <li class="sep">/</li>
      <li class="current">Keychron K2 Pro Wireless</li>
    </ol>
  </nav>
  <nav aria-label="Breadcrumb SaaS">
    <ol class="ui-breadcrumb">
      <li><a href="#ws">Workspace</a></li>
      <li class="sep">›</li>
      <li><a href="#billing">Billing &amp; Plan</a></li>
      <li class="sep">›</li>
      <li class="current">Invoice #INV-2026-089</li>
    </ol>
  </nav>
</div>`,
      css: `.ui-breadcrumb { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; list-style: none; font-size: 0.83rem; }
.ui-breadcrumb .current { font-weight: 700; color: var(--text); }`,
      bind(root) {
        root.querySelectorAll('.ui-breadcrumb a').forEach((a) => {
          a.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Navigasi ke: ' + a.textContent.trim());
          });
        });
      }
    },
    {
      id: 'comp-04',
      num: '04',
      category: 'navigation',
      categoryLabel: 'Navigation & Header',
      title: 'Bottom Mobile App Bar',
      subtitle: 'Navigasi bawah gaya aplikasi mobile dengan indikator aktif & badge notifikasi',
      tags: 'mobile bottom bar tab app navigasi',
      html: `<div class="ui-mobile-frame">
  <div class="ui-mobile-screen">
    <div>
      <strong data-mobile-title>Beranda Toko</strong>
      <div class="ui-muted" style="font-size:0.75rem;">Ketuk tab di bawah untuk berpindah halaman</div>
    </div>
    <span class="ui-badge ui-badge-brand">Mobile PWA</span>
  </div>
  <nav class="ui-bottom-nav" aria-label="Navigasi Mobile">
    <button type="button" class="ui-bottom-tab active" data-tab="Beranda Toko"><span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span><span>Beranda</span></button>
    <button type="button" class="ui-bottom-tab" data-tab="Kategori Produk"><span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg></span><span>Kategori</span></button>
    <button type="button" class="ui-bottom-tab" data-tab="Flash Sale"><span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span><span>Promo</span></button>
    <button type="button" class="ui-bottom-tab" data-tab="Keranjang Belanja">
      <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg></span><span>Keranjang</span><span class="ui-bottom-badge">3</span>
    </button>
    <button type="button" class="ui-bottom-tab" data-tab="Akun Saya"><span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span>Akun</span></button>
  </nav>
</div>`,
      css: `.ui-bottom-nav { display: grid; grid-template-columns: repeat(5, 1fr); background: var(--surface); border-top: 1px solid var(--border); padding: 6px 4px; }
.ui-bottom-tab.active { color: var(--brand); }`,
      bind(root) {
        const title = root.querySelector('[data-mobile-title]');
        const tabs = root.querySelectorAll('.ui-bottom-tab');
        tabs.forEach((tab) => {
          tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            title.textContent = tab.getAttribute('data-tab');
          });
        });
      }
    },
    {
      id: 'comp-05',
      num: '05',
      category: 'navigation',
      categoryLabel: 'Navigation & Header',
      title: 'Announcement Promo Banner',
      subtitle: 'Bar pengumuman atas halaman dengan kode promo klik-untuk-salin & tombol tutup',
      tags: 'announcement banner promo voucher header',
      html: `<div class="ui-promo-banner" data-promo-banner>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
    <span class="ui-badge" style="background:rgba(255,255,255,0.22);color:#fff;">PROMO GAJIAN</span>
    <span style="font-size:0.86rem;font-weight:600;">Diskon ekstra 25% semua paket SaaS &amp; Toko Online hari ini!</span>
    <button type="button" class="ui-promo-code" data-copy-promo="HEMAT25">HEMAT25 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg></button>
  </div>
  <button type="button" class="ui-btn ui-btn-sm" style="background:rgba(0,0,0,0.22);color:#fff;" data-dismiss-promo>Tutup ✕</button>
</div>`,
      css: `.ui-promo-banner { background: var(--brand-gradient); color: #fff; border-radius: var(--radius-md); padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }`,
      bind(root) {
        const banner = root.querySelector('[data-promo-banner]');
        root.querySelector('[data-copy-promo]').addEventListener('click', () => {
          copyToClipboard('HEMAT25');
          showToast('Kode promo HEMAT25 disalin ✓');
        });
        root.querySelector('[data-dismiss-promo]').addEventListener('click', () => {
          banner.style.opacity = '0.45';
          showToast('Banner promo disembunyikan (simulasi preview)');
          setTimeout(() => { banner.style.opacity = '1'; }, 1200);
        });
      }
    },
    {
      id: 'comp-06',
      num: '06',
      category: 'navigation',
      categoryLabel: 'Navigation & Header',
      title: 'Sidebar Collapse Nav',
      subtitle: 'Navigasi samping aplikasi SaaS yang dapat diciutkan menjadi mode ikon',
      tags: 'sidebar collapse drawer admin dashboard nav',
      html: `<div class="ui-sidebar-demo">
  <aside class="ui-sidebar" data-sidebar>
    <div class="ui-sb-head">
      <strong class="sb-text" style="font-size:0.86rem;">KasirCloud</strong>
      <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-sb-toggle title="Toggle Sidebar">⇄</button>
    </div>
    <button type="button" class="ui-sb-link active" data-sb-page="Ringkasan Penjualan"><span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span><span class="sb-text">Dashboard</span></button>
    <button type="button" class="ui-sb-link" data-sb-page="Manajemen Produk"><span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></span><span class="sb-text">Produk</span></button>
    <button type="button" class="ui-sb-link" data-sb-page="Riwayat Transaksi"><span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></span><span class="sb-text">Transaksi</span></button>
    <button type="button" class="ui-sb-link" data-sb-page="Pengaturan Tim"><span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg></span><span class="sb-text">Pengaturan</span></button>
  </aside>
  <div class="ui-sb-main">
    <span class="ui-badge ui-badge-brand">Halaman Aktif</span>
    <h4 style="margin-top:8px;" data-sb-heading>Ringkasan Penjualan</h4>
    <p class="ui-muted" style="margin-top:4px;">Klik tombol <strong>⇄</strong> untuk menciutkan atau melebarkan sidebar navigasi.</p>
  </div>
</div>`,
      css: `.ui-sidebar { width: 220px; border-right: 1px solid var(--border); padding: 12px; transition: width var(--transition-base); }
.ui-sidebar.collapsed { width: 64px; align-items: center; }
.ui-sidebar.collapsed .sb-text { display: none; }`,
      bind(root) {
        const sb = root.querySelector('[data-sidebar]');
        const heading = root.querySelector('[data-sb-heading]');
        root.querySelector('[data-sb-toggle]').addEventListener('click', () => {
          sb.classList.toggle('collapsed');
        });
        root.querySelectorAll('[data-sb-page]').forEach((btn) => {
          btn.addEventListener('click', () => {
            root.querySelectorAll('[data-sb-page]').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            heading.textContent = btn.getAttribute('data-sb-page');
          });
        });
      }
    },

    // -----------------------------------------------------------------------
    // KATEGORI 2: HERO & CONVERSION CTA (07 - 12)
    // -----------------------------------------------------------------------
    {
      id: 'comp-07',
      num: '07',
      category: 'hero',
      categoryLabel: 'Hero & Conversion CTA',
      title: 'Split Hero E-Commerce',
      subtitle: 'Hero section toko 2-kolom dengan social proof rating, dual CTA, dan artwork SVG',
      tags: 'hero split ecommerce landing page cta',
      html: `<section class="ui-hero-split">
  <div>
    <span class="ui-badge ui-badge-brand">Koleksi Desk Setup 2026</span>
    <h2 class="ui-hero-title">Tingkatkan Produktivitas Kerja dengan Gear Ergonomis</h2>
    <p class="ui-muted">Garansi resmi 2 tahun, pengiriman instan hari yang sama, dan cicilan 0% via QRIS &amp; Virtual Account.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:16px 0;">
      <button type="button" class="ui-btn ui-btn-primary">Belanja Sekarang →</button>
      <button type="button" class="ui-btn ui-btn-outline">Lihat Katalog Video</button>
    </div>
    <div style="display:flex;align-items:center;gap:10px;font-size:0.8rem;">
      <span style="color:#f59e0b;">★★★★★</span>
      <strong>4.9/5</strong>
      <span class="ui-muted">dari 3.420+ ulasan terverifikasi</span>
    </div>
  </div>
  <div class="ui-hero-visual">
    <div style="display:flex;justify-content:center;padding:12px 0;">${SVG_ART.keyboard}</div>
    <div class="ui-hero-float">
      <strong style="color:var(--brand);">Hemat 35%</strong>
      <div class="ui-muted" style="font-size:0.7rem;">Stok tersisa 14 unit</div>
    </div>
  </div>
</section>`,
      css: `.ui-hero-split { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 24px; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 26px; }`,
      bind(root) {
        root.querySelectorAll('.ui-btn').forEach((b) => {
          b.addEventListener('click', () => showToast('CTA diklik: ' + b.textContent.trim()));
        });
      }
    },
    {
      id: 'comp-08',
      num: '08',
      category: 'hero',
      categoryLabel: 'Hero & Conversion CTA',
      title: 'SaaS Centered Hero + Waitlist Form',
      subtitle: 'Hero SaaS berpusat dengan formulir early-access interaktif & konfirmasi instan',
      tags: 'saas hero waitlist email signup landing',
      html: `<section class="ui-hero-centered">
  <span class="ui-badge ui-badge-success">Early Access v2.0 Dibuka</span>
  <h2 class="ui-hero-title" style="max-width:620px;margin:12px auto 8px;">Otomatiskan Pembukuan &amp; Laporan Pajak Bisnis dalam 5 Menit</h2>
  <p class="ui-muted" style="max-width:520px;margin:0 auto;">Hubungkan mutasi bank, QRIS, dan marketplace secara otomatis ke satu dashboard real-time.</p>
  <form class="ui-waitlist-form" data-waitlist-form>
    <input type="email" class="ui-input" placeholder="nama@perusahaan.co.id" required />
    <button type="submit" class="ui-btn ui-btn-primary" style="white-space:nowrap;">Gabung Waitlist</button>
  </form>
  <div class="ui-muted" style="font-size:0.76rem;" data-waitlist-msg>Gratis uji coba 14 hari • Tanpa kartu kredit</div>
</section>`,
      css: `.ui-hero-centered { text-align: center; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px 24px; }
.ui-waitlist-form { display: flex; gap: 8px; max-width: 440px; margin: 16px auto 8px; }`,
      bind(root) {
        const form = root.querySelector('[data-waitlist-form]');
        const msg = root.querySelector('[data-waitlist-msg]');
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = form.querySelector('input').value.trim();
          msg.innerHTML = `<span style="color:var(--success);font-weight:700;">✓ Undangan waitlist dikirim ke ${email}</span>`;
          showToast('Terdaftar ke waitlist!');
        });
      }
    },
    {
      id: 'comp-09',
      num: '09',
      category: 'hero',
      categoryLabel: 'Hero & Conversion CTA',
      title: 'Flash Sale Countdown Banner',
      subtitle: 'Banner promo berbatas waktu dengan timer berjalan real-time (Jam : Menit : Detik)',
      tags: 'flash sale countdown timer banner promo',
      html: `<div class="ui-flash-banner">
  <div>
    <span class="ui-badge" style="background:#ef4444;color:#fff;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> FLASH SALE 12.12</span>
    <h3 style="margin-top:8px;font-size:1.25rem;">Diskon Hingga 60% Aksesoris Gaming &amp; Kerja</h3>
    <p style="font-size:0.82rem;opacity:0.82;margin-top:4px;">Berakhir sebelum tengah malam. Kuota voucher terbatas!</p>
  </div>
  <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
    <div class="ui-countdown" data-countdown>
      <div class="ui-cd-box"><strong data-cd-h>04</strong><span>JAM</span></div>
      <span>:</span>
      <div class="ui-cd-box"><strong data-cd-m>28</strong><span>MENIT</span></div>
      <span>:</span>
      <div class="ui-cd-box"><strong data-cd-s>45</strong><span>DETIK</span></div>
    </div>
    <button type="button" class="ui-btn ui-btn-primary">Klaim Diskon →</button>
  </div>
</div>`,
      css: `.ui-flash-banner { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #fff; border-radius: var(--radius-lg); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; }`,
      bind(root) {
        let totalSec = 4 * 3600 + 28 * 60 + 45;
        const hEl = root.querySelector('[data-cd-h]');
        const mEl = root.querySelector('[data-cd-m]');
        const sEl = root.querySelector('[data-cd-s]');
        setInterval(() => {
          if (!document.body.contains(root)) return;
          totalSec = totalSec > 0 ? totalSec - 1 : 16125;
          const h = Math.floor(totalSec / 3600);
          const m = Math.floor((totalSec % 3600) / 60);
          const s = totalSec % 60;
          hEl.textContent = String(h).padStart(2, '0');
          mEl.textContent = String(m).padStart(2, '0');
          sEl.textContent = String(s).padStart(2, '0');
        }, 1000);
      }
    },
    {
      id: 'comp-10',
      num: '10',
      category: 'hero',
      categoryLabel: 'Hero & Conversion CTA',
      title: 'Trust Logo Strip',
      subtitle: 'Deretan logo partner & klien SVG tajam untuk meningkatkan kredibilitas landing page',
      tags: 'trust logo partner client social proof',
      html: `<div class="ui-logo-strip">
  <div class="ui-muted" style="font-size:0.78rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">Dipercaya 1.800+ Bisnis &amp; Startup di Indonesia</div>
  <div class="ui-logos-row">
    <div class="ui-logo-cell">◆ KaryaPay</div>
    <div class="ui-logo-cell">▲ NusantaraLog</div>
    <div class="ui-logo-cell">● WarungSync</div>
    <div class="ui-logo-cell">⬢ CloudKita</div>
    <div class="ui-logo-cell">✦ StudioLokal</div>
    <div class="ui-logo-cell">◈ FinTechID</div>
  </div>
</div>`,
      css: `.ui-logos-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 14px; margin-top: 12px; }`,
      bind() {}
    },
    {
      id: 'comp-11',
      num: '11',
      category: 'hero',
      categoryLabel: 'Hero & Conversion CTA',
      title: 'Newsletter Capture Bar',
      subtitle: 'Bar berlangganan email horizontal dengan pilihan topik & validasi instan',
      tags: 'newsletter subscribe email capture bar',
      html: `<div class="ui-newsletter-bar">
  <div>
    <strong style="font-size:1rem;">Dapatkan Template &amp; Tips UI Mingguan</strong>
    <p class="ui-muted">Gratis 1 komponen baru setiap Jumat langsung ke inbox Anda.</p>
  </div>
  <form class="ui-newsletter-form" data-nl-form>
    <select class="ui-input" style="width:auto;min-width:130px;">
      <option>Semua Topik</option>
      <option>E-Commerce</option>
      <option>SaaS Growth</option>
    </select>
    <input type="email" class="ui-input" style="max-width:230px;" placeholder="email@anda.com" required />
    <button type="submit" class="ui-btn ui-btn-primary">Langganan</button>
  </form>
</div>`,
      css: `.ui-newsletter-bar { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap; }`,
      bind(root) {
        root.querySelector('[data-nl-form]').addEventListener('submit', (e) => {
          e.preventDefault();
          showToast('Berhasil berlangganan newsletter ✓');
        });
      }
    },
    {
      id: 'comp-12',
      num: '12',
      category: 'hero',
      categoryLabel: 'Hero & Conversion CTA',
      title: 'Product Feature Bento Grid',
      subtitle: 'Grid fitur asimetris gaya modern SaaS lengkap dengan mini visual SVG & highlight metrik',
      tags: 'bento grid fitur produk saas showcase',
      html: `<div class="ui-bento-grid">
  <div class="ui-bento-card ui-bento-span2">
    <span class="ui-badge ui-badge-brand">Analitik Real-Time</span>
    <h3 style="margin:8px 0 6px;font-size:1.05rem;">Pantau Konversi &amp; Arus Kas Seketika</h3>
    <p class="ui-muted" style="margin-bottom:12px;">Grafik interaktif otomatis memperbarui data transaksi setiap 5 detik.</p>
    ${SVG_ART.dashboardHero}
  </div>
  <div class="ui-bento-card">
    <span class="ui-badge ui-badge-success">99.98% SLA</span>
    <h4 style="margin:10px 0 6px;">Server Edge Cepat</h4>
    <p class="ui-muted">Latensi rata-rata 18ms di server Asia Tenggara.</p>
    <div style="margin-top:14px;font-size:1.6rem;font-weight:800;color:var(--brand);">18 ms</div>
  </div>
  <div class="ui-bento-card">
    <span class="ui-badge ui-badge-info">API &amp; Webhook</span>
    <h4 style="margin:10px 0 6px;">Integrasi Midtrans &amp; Xendit</h4>
    <p class="ui-muted">Siap QRIS, Virtual Account, dan e-Wallet otomatis.</p>
    <div style="margin-top:14px;display:flex;gap:6px;flex-wrap:wrap;">
      <span class="ui-badge ui-badge-muted">QRIS</span>
      <span class="ui-badge ui-badge-muted">VA BCA</span>
      <span class="ui-badge ui-badge-muted">GoPay</span>
    </div>
  </div>
</div>`,
      css: `.ui-bento-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.ui-bento-span2 { grid-column: span 2; }`,
      bind() {}
    },

    // -----------------------------------------------------------------------
    // KATEGORI 3: E-COMMERCE CARDS & CART (13 - 18)
    // -----------------------------------------------------------------------
    {
      id: 'comp-13',
      num: '13',
      category: 'ecommerce',
      categoryLabel: 'E-Commerce Cards & Cart',
      title: 'Product Card Diskon + Artwork SVG + Quick Add',
      subtitle: 'Kartu produk katalog dengan ilustrasi SVG produk tajam, pemilih varian warna, wishlist & Quick Add',
      tags: 'product card diskon katalog ecommerce quick add',
      html: `<div class="ui-grid-3">
  <article class="ui-prod-card">
    <div class="ui-prod-art" style="background:linear-gradient(135deg,#eef2ff,#e0e7ff);">
      <span class="ui-badge ui-badge-solid" style="position:absolute;top:8px;left:8px;">HEMAT 35%</span>
      <button type="button" class="ui-wish-btn" data-wish aria-label="Wishlist">♡</button>
      ${SVG_ART.keyboard}
    </div>
    <div class="ui-swatch-row">
      <button type="button" class="ui-swatch active" style="background:#1e293b;" title="Midnight"></button>
      <button type="button" class="ui-swatch" style="background:#4f46e5;" title="Indigo"></button>
      <button type="button" class="ui-swatch" style="background:#e2e8f0;" title="Silver"></button>
    </div>
    <div>
      <strong style="font-size:0.94rem;">Mechanical Keyboard 75%</strong>
      <div class="ui-muted" style="font-size:0.78rem;">Hot-swap • Bluetooth 5.1 • RGB</div>
    </div>
    <div class="ui-price-row">
      <span class="ui-price-now">Rp 649.000</span>
      <span class="ui-price-old">Rp 999.000</span>
    </div>
    <button type="button" class="ui-btn ui-btn-primary ui-btn-block" data-quick-add="Mechanical Keyboard 75%">+ Tambah ke Keranjang</button>
  </article>

  <article class="ui-prod-card">
    <div class="ui-prod-art" style="background:linear-gradient(135deg,#ecfeff,#cffafe);">
      <span class="ui-badge ui-badge-warning" style="position:absolute;top:8px;left:8px;">TERLARIS</span>
      <button type="button" class="ui-wish-btn" data-wish aria-label="Wishlist">♡</button>
      ${SVG_ART.headphone}
    </div>
    <div class="ui-swatch-row">
      <button type="button" class="ui-swatch active" style="background:#0f172a;" title="Matte Black"></button>
      <button type="button" class="ui-swatch" style="background:#0284c7;" title="Ocean"></button>
    </div>
    <div>
      <strong style="font-size:0.94rem;">Studio ANC Wireless Pro</strong>
      <div class="ui-muted" style="font-size:0.78rem;">Active Noise Canceling • 40 Jam</div>
    </div>
    <div class="ui-price-row">
      <span class="ui-price-now">Rp 489.000</span>
      <span class="ui-price-old">Rp 750.000</span>
    </div>
    <button type="button" class="ui-btn ui-btn-primary ui-btn-block" data-quick-add="Studio ANC Wireless Pro">+ Tambah ke Keranjang</button>
  </article>

  <article class="ui-prod-card">
    <div class="ui-prod-art" style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);">
      <span class="ui-badge ui-badge-success" style="position:absolute;top:8px;left:8px;">BARU</span>
      <button type="button" class="ui-wish-btn" data-wish aria-label="Wishlist">♡</button>
      ${SVG_ART.watch}
    </div>
    <div class="ui-swatch-row">
      <button type="button" class="ui-swatch active" style="background:#059669;" title="Forest"></button>
      <button type="button" class="ui-swatch" style="background:#334155;" title="Slate"></button>
    </div>
    <div>
      <strong style="font-size:0.94rem;">PulseFit AMOLED Watch</strong>
      <div class="ui-muted" style="font-size:0.78rem;">GPS Built-in • Tahan Air 5ATM</div>
    </div>
    <div class="ui-price-row">
      <span class="ui-price-now">Rp 825.000</span>
      <span class="ui-price-old">Rp 1.150.000</span>
    </div>
    <button type="button" class="ui-btn ui-btn-primary ui-btn-block" data-quick-add="PulseFit AMOLED Watch">+ Tambah ke Keranjang</button>
  </article>
</div>`,
      css: `.ui-prod-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 15px; display: flex; flex-direction: column; gap: 10px; }
.ui-prod-art { height: 142px; border-radius: var(--radius-sm); display: grid; place-items: center; position: relative; }`,
      bind(root) {
        root.querySelectorAll('[data-wish]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const liked = btn.classList.toggle('liked');
            btn.textContent = liked ? '♥' : '♡';
            showToast(liked ? 'Disimpan ke wishlist ♥' : 'Dihapus dari wishlist');
          });
        });
        root.querySelectorAll('.ui-swatch-row').forEach((row) => {
          row.querySelectorAll('.ui-swatch').forEach((sw) => {
            sw.addEventListener('click', () => {
              row.querySelectorAll('.ui-swatch').forEach((s) => s.classList.remove('active'));
              sw.classList.add('active');
            });
          });
        });
        root.querySelectorAll('[data-quick-add]').forEach((btn) => {
          btn.addEventListener('click', () => {
            showToast(btn.getAttribute('data-quick-add') + ' masuk keranjang ✓');
          });
        });
      }
    },
    {
      id: 'comp-14',
      num: '14',
      category: 'ecommerce',
      categoryLabel: 'E-Commerce Cards & Cart',
      title: 'Horizontal Cart Item Row',
      subtitle: 'Baris item keranjang belanja dengan stepper jumlah (+/-) & kalkulasi subtotal otomatis',
      tags: 'cart row quantity stepper keranjang',
      html: `<div class="ui-cart-list">
  <div class="ui-cart-row" data-cart-item data-price="649000">
    <div style="display:flex;align-items:center;gap:12px;">
      <div class="ui-cart-thumb">⌨️</div>
      <div>
        <strong style="font-size:0.9rem;">Mechanical Keyboard 75%</strong>
        <div class="ui-muted" style="font-size:0.76rem;">Varian: Indigo • Switch Brown</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
      <div class="ui-qty-stepper">
        <button type="button" data-qty-minus aria-label="Kurangi">−</button>
        <span data-qty-val>1</span>
        <button type="button" data-qty-plus aria-label="Tambah">+</button>
      </div>
      <strong style="min-width:110px;text-align:right;" data-line-total>Rp 649.000</strong>
      <button type="button" class="ui-btn ui-btn-ghost ui-btn-sm" data-remove-row><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
    </div>
  </div>
  <div class="ui-cart-row" data-cart-item data-price="489000">
    <div style="display:flex;align-items:center;gap:12px;">
      <div class="ui-cart-thumb"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-3px;"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg></div>
      <div>
        <strong style="font-size:0.9rem;">Studio ANC Wireless Pro</strong>
        <div class="ui-muted" style="font-size:0.76rem;">Varian: Matte Black • Garansi 2 Thn</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
      <div class="ui-qty-stepper">
        <button type="button" data-qty-minus aria-label="Kurangi">−</button>
        <span data-qty-val>2</span>
        <button type="button" data-qty-plus aria-label="Tambah">+</button>
      </div>
      <strong style="min-width:110px;text-align:right;" data-line-total>Rp 978.000</strong>
      <button type="button" class="ui-btn ui-btn-ghost ui-btn-sm" data-remove-row><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
    </div>
  </div>
</div>`,
      css: `.ui-cart-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px 16px; }`,
      bind(root) {
        root.querySelectorAll('[data-cart-item]').forEach((row) => {
          const unit = Number(row.getAttribute('data-price'));
          const valEl = row.querySelector('[data-qty-val]');
          const totEl = row.querySelector('[data-line-total]');
          let qty = Number(valEl.textContent);
          const sync = () => {
            valEl.textContent = String(qty);
            totEl.textContent = formatRp(qty * unit);
          };
          row.querySelector('[data-qty-minus]').addEventListener('click', () => {
            if (qty > 1) { qty -= 1; sync(); }
          });
          row.querySelector('[data-qty-plus]').addEventListener('click', () => {
            qty += 1; sync();
          });
          row.querySelector('[data-remove-row]').addEventListener('click', () => {
            showToast('Item dihapus dari simulasi keranjang');
          });
        });
      }
    },
    {
      id: 'comp-15',
      num: '15',
      category: 'ecommerce',
      categoryLabel: 'E-Commerce Cards & Cart',
      title: 'Slide-out Mini Cart Summary',
      subtitle: 'Panel ringkasan mini cart lengkap dengan progress bar gratis ongkir & tombol checkout',
      tags: 'mini cart drawer summary gratis ongkir checkout',
      html: `<div class="ui-minicart">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
    <strong>Keranjang Anda (<span data-mc-count>2</span>)</strong>
    <span class="ui-badge ui-badge-success" data-mc-ship-badge>Gratis Ongkir Aktif!</span>
  </div>
  <div style="background:var(--bg);padding:10px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);margin-bottom:12px;">
    <div style="font-size:0.76rem;font-weight:600;" data-mc-ship-text>Selamat! Anda mendapat Gratis Ongkir Rp 0</div>
    <div class="ui-progress-track"><div class="ui-progress-fill" data-mc-bar style="width:100%;"></div></div>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.86rem;margin-bottom:12px;">
    <span>Simulasi Jumlah Item:</span>
    <div class="ui-qty-stepper">
      <button type="button" data-mc-minus>−</button>
      <span data-mc-qty>2</span>
      <button type="button" data-mc-plus>+</button>
    </div>
  </div>
  <div style="border-top:1px solid var(--border);padding-top:12px;display:flex;flex-direction:column;gap:6px;font-size:0.84rem;">
    <div style="display:flex;justify-content:space-between;"><span class="ui-muted">Subtotal</span><strong data-mc-sub>Rp 500.000</strong></div>
    <div style="display:flex;justify-content:space-between;"><span class="ui-muted">Estimasi Ongkir</span><strong data-mc-ongkir>Rp 0</strong></div>
    <div style="display:flex;justify-content:space-between;font-size:0.98rem;margin-top:4px;"><strong>Total Bayar</strong><strong style="color:var(--brand);" data-mc-total>Rp 500.000</strong></div>
  </div>
  <button type="button" class="ui-btn ui-btn-primary ui-btn-block" style="margin-top:14px;" data-mc-checkout>Lanjut ke Checkout →</button>
</div>`,
      css: `.ui-minicart { max-width: 400px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px; }`,
      bind(root) {
        let qty = 2;
        const unit = 250000;
        const freeMin = 500000;
        const sync = () => {
          const sub = qty * unit;
          const free = sub >= freeMin;
          const ongkir = free ? 0 : 18000;
          const pct = Math.min(100, Math.round((sub / freeMin) * 100));
          root.querySelector('[data-mc-count]').textContent = String(qty);
          root.querySelector('[data-mc-qty]').textContent = String(qty);
          root.querySelector('[data-mc-sub]').textContent = formatRp(sub);
          root.querySelector('[data-mc-ongkir]').textContent = free ? 'Rp 0' : formatRp(ongkir);
          root.querySelector('[data-mc-total]').textContent = formatRp(sub + ongkir);
          root.querySelector('[data-mc-bar]').style.width = pct + '%';
          root.querySelector('[data-mc-ship-badge]').textContent = free ? 'Gratis Ongkir Aktif!' : 'Tambah ' + formatRp(freeMin - sub);
          root.querySelector('[data-mc-ship-text]').textContent = free
            ? 'Selamat! Anda mendapat Gratis Ongkir Rp 0'
            : 'Belanja ' + formatRp(freeMin - sub) + ' lagi untuk Gratis Ongkir';
        };
        root.querySelector('[data-mc-minus]').addEventListener('click', () => { if (qty > 1) { qty -= 1; sync(); } });
        root.querySelector('[data-mc-plus]').addEventListener('click', () => { qty += 1; sync(); });
        root.querySelector('[data-mc-checkout]').addEventListener('click', () => showToast('Membuka halaman checkout...'));
      }
    },
    {
      id: 'comp-16',
      num: '16',
      category: 'ecommerce',
      categoryLabel: 'E-Commerce Cards & Cart',
      title: 'Filter & Sort Toolbar',
      subtitle: 'Toolbar penyaring katalog produk dengan chip kategori, toggle stok & urutkan harga',
      tags: 'filter sort toolbar katalog ecommerce',
      html: `<div class="ui-filter-bar">
  <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;" data-ft-chips>
    <button type="button" class="chip active" data-ft="Semua">Semua</button>
    <button type="button" class="chip" data-ft="Audio">Audio</button>
    <button type="button" class="chip" data-ft="Keyboard">Keyboard</button>
    <button type="button" class="chip" data-ft="Diskon">Diskon &gt;30%</button>
  </div>
  <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
    <label style="display:inline-flex;align-items:center;gap:6px;font-size:0.82rem;font-weight:600;cursor:pointer;">
      <input type="checkbox" checked data-ft-stock /> Ready Stock saja
    </label>
    <select class="ui-input" style="width:auto;" data-ft-sort>
      <option value="popular">Urutkan: Terpopuler</option>
      <option value="low">Harga: Terendah</option>
      <option value="high">Harga: Tertinggi</option>
    </select>
    <span class="ui-badge ui-badge-brand" data-ft-result>48 Produk</span>
  </div>
</div>`,
      css: `.ui-filter-bar { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }`,
      bind(root) {
        const res = root.querySelector('[data-ft-result]');
        const counts = { 'Semua': 48, 'Audio': 16, 'Keyboard': 12, 'Diskon': 9 };
        let current = 'Semua';
        const update = () => {
          const onlyStock = root.querySelector('[data-ft-stock]').checked;
          const total = onlyStock ? counts[current] : counts[current] + 4;
          res.textContent = total + ' Produk';
        };
        root.querySelectorAll('[data-ft]').forEach((btn) => {
          btn.addEventListener('click', () => {
            root.querySelectorAll('[data-ft]').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            current = btn.getAttribute('data-ft');
            update();
          });
        });
        root.querySelector('[data-ft-stock]').addEventListener('change', update);
        root.querySelector('[data-ft-sort]').addEventListener('change', (e) => showToast('Urutan diubah: ' + e.target.options[e.target.selectedIndex].text));
      }
    },
    {
      id: 'comp-17',
      num: '17',
      category: 'ecommerce',
      categoryLabel: 'E-Commerce Cards & Cart',
      title: 'Order Tracking Timeline 4-Tahap',
      subtitle: 'Pelacakan status pengiriman 4 tahap interaktif lengkap dengan salin nomor resi',
      tags: 'order tracking timeline resi pengiriman',
      html: `<div class="ui-surface" style="padding:18px;">
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
    <div>
      <strong>Pesanan #ORD-88241</strong>
      <div class="ui-muted" style="font-size:0.78rem;">Kurir: JNE Express • Resi: <code style="font-family:var(--font-mono);">JNE99284102ID</code></div>
    </div>
    <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-copy-resi>Salin No. Resi</button>
  </div>
  <div class="ui-timeline">
    <div class="ui-tl-step done" data-tl="1"><div class="ui-tl-dot">1</div><strong>Dibayar</strong><div class="ui-muted" style="font-size:0.74rem;">10:15 WIB</div></div>
    <div class="ui-tl-step done" data-tl="2"><div class="ui-tl-dot">2</div><strong>Dikemas</strong><div class="ui-muted" style="font-size:0.74rem;">12:40 WIB</div></div>
    <div class="ui-tl-step done" data-tl="3"><div class="ui-tl-dot">3</div><strong>Dikirim</strong><div class="ui-muted" style="font-size:0.74rem;">Hub Jakarta</div></div>
    <div class="ui-tl-step" data-tl="4"><div class="ui-tl-dot">4</div><strong>Selesai</strong><div class="ui-muted" style="font-size:0.74rem;">Estimasi Besok</div></div>
  </div>
</div>`,
      css: `.ui-timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 14px; }
.ui-tl-step.done { border-color: var(--brand); background: var(--brand-soft); }`,
      bind(root) {
        root.querySelector('[data-copy-resi]').addEventListener('click', () => {
          copyToClipboard('JNE99284102ID');
          showToast('Nomor resi JNE99284102ID disalin ✓');
        });
        const steps = root.querySelectorAll('[data-tl]');
        steps.forEach((st) => {
          st.addEventListener('click', () => {
            const target = Number(st.getAttribute('data-tl'));
            steps.forEach((s) => {
              s.classList.toggle('done', Number(s.getAttribute('data-tl')) <= target);
            });
          });
        });
      }
    },
    {
      id: 'comp-18',
      num: '18',
      category: 'ecommerce',
      categoryLabel: 'E-Commerce Cards & Cart',
      title: 'Promo Coupon & Voucher Input',
      subtitle: 'Input kode voucher checkout dengan validasi kode & kalkulasi potongan otomatis',
      tags: 'coupon voucher promo diskon checkout',
      html: `<div class="ui-surface" style="padding:18px;max-width:480px;margin:0 auto;">
  <strong style="font-size:0.92rem;">Punya Kode Promo / Voucher?</strong>
  <div class="ui-muted" style="font-size:0.76rem;margin:3px 0 10px;">Coba masukkan kode: <code>DISKON20</code> atau <code>HEMAT50K</code></div>
  <form style="display:flex;gap:8px;" data-voucher-form>
    <input type="text" class="ui-input" placeholder="Masukkan kode voucher..." value="DISKON20" />
    <button type="submit" class="ui-btn ui-btn-primary">Terapkan</button>
  </form>
  <div style="margin-top:10px;font-size:0.8rem;" data-voucher-msg>
    <span class="ui-badge ui-badge-success">✓ Kode DISKON20 aktif — Potongan Rp 40.000</span>
  </div>
</div>`,
      css: `/* Menggunakan .ui-surface, .ui-input, .ui-btn, dan .ui-badge dari tokens.css */`,
      bind(root) {
        const form = root.querySelector('[data-voucher-form]');
        const msg = root.querySelector('[data-voucher-msg]');
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const code = form.querySelector('input').value.trim().toUpperCase();
          if (code === 'DISKON20') {
            msg.innerHTML = `<span class="ui-badge ui-badge-success">✓ Kode DISKON20 aktif — Potongan Rp 40.000</span>`;
          } else if (code === 'HEMAT50K') {
            msg.innerHTML = `<span class="ui-badge ui-badge-success">✓ Kode HEMAT50K aktif — Potongan Rp 50.000</span>`;
          } else {
            msg.innerHTML = `<span class="ui-badge ui-badge-danger">✕ Kode "${code || '-'}" tidak valid atau sudah kedaluwarsa</span>`;
          }
        });
      }
    },

    // -----------------------------------------------------------------------
    // KATEGORI 4: SAAS PRICING & SOCIAL PROOF (19 - 24)
    // -----------------------------------------------------------------------
    {
      id: 'comp-19',
      num: '19',
      category: 'saas',
      categoryLabel: 'SaaS Pricing & Social Proof',
      title: 'Pricing Table Toggle Bulanan/Tahunan',
      subtitle: 'Tabel harga SaaS 3-tier interaktif dengan switch bulanan vs tahunan hemat 20%',
      tags: 'pricing table bulanan tahunan saas langganan',
      html: `<div>
  <div class="ui-pricing-toggle">
    <span>Bulanan</span>
    <button type="button" class="ui-switch" data-bill-switch aria-pressed="false" aria-label="Toggle Tahunan"></button>
    <span>Tahunan <span class="ui-badge ui-badge-brand">Hemat 20%</span></span>
  </div>
  <div class="ui-grid-3">
    <div class="ui-price-card">
      <div><strong>Starter</strong><div class="ui-muted">Untuk freelancer &amp; UMKM</div></div>
      <div class="ui-price-big" data-m="Rp 79rb" data-y="Rp 63rb">Rp 79rb</div>
      <ul class="ui-check-list"><li>✓ 3 Proyek Aktif</li><li>✓ Export PDF &amp; Excel</li><li>✓ Support Email</li></ul>
      <button type="button" class="ui-btn ui-btn-outline ui-btn-block">Pilih Starter</button>
    </div>
    <div class="ui-price-card featured">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>Growth Pro</strong><span class="ui-badge ui-badge-solid">POPULER</span>
      </div>
      <div class="ui-price-big" style="color:var(--brand);" data-m="Rp 199rb" data-y="Rp 159rb">Rp 199rb</div>
      <ul class="ui-check-list"><li>✓ Unlimited Proyek</li><li>✓ Custom Domain &amp; SSL</li><li>✓ Integrasi Webhook &amp; WA</li></ul>
      <button type="button" class="ui-btn ui-btn-primary ui-btn-block">Mulai Uji Coba 14 Hari</button>
    </div>
    <div class="ui-price-card">
      <div><strong>Scale Team</strong><div class="ui-muted">Untuk agensi &amp; korporasi</div></div>
      <div class="ui-price-big" data-m="Rp 449rb" data-y="Rp 359rb">Rp 449rb</div>
      <ul class="ui-check-list"><li>✓ 25 Anggota Tim + RBAC</li><li>✓ Dedicated SLA 99.98%</li><li>✓ Priority WhatsApp Support</li></ul>
      <button type="button" class="ui-btn ui-btn-outline ui-btn-block">Pilih Scale</button>
    </div>
  </div>
</div>`,
      css: `.ui-price-card.featured { border: 2px solid var(--brand); box-shadow: var(--shadow-md); }
.ui-switch[aria-pressed="true"] { background: var(--brand); }`,
      bind(root) {
        const sw = root.querySelector('[data-bill-switch]');
        sw.addEventListener('click', () => {
          const yearly = sw.getAttribute('aria-pressed') !== 'true';
          sw.setAttribute('aria-pressed', String(yearly));
          root.querySelectorAll('.ui-price-big').forEach((el) => {
            el.textContent = el.getAttribute(yearly ? 'data-y' : 'data-m');
          });
        });
      }
    },
    {
      id: 'comp-20',
      num: '20',
      category: 'saas',
      categoryLabel: 'SaaS Pricing & Social Proof',
      title: 'Comparison Matrix Table',
      subtitle: 'Tabel perbandingan fitur antar paket dengan kolom unggulan yang disorot',
      tags: 'comparison matrix table fitur paket saas',
      html: `<div class="ui-table-wrap">
  <table class="ui-table">
    <thead>
      <tr>
        <th>Fitur Utama</th>
        <th>Starter</th>
        <th class="col-hl" style="color:var(--brand);">Growth Pro ★</th>
        <th>Enterprise</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Jumlah Anggota Tim</td><td>1 User</td><td class="col-hl">10 Users</td><td>Unlimited</td></tr>
      <tr><td>Custom Domain &amp; White-label</td><td>—</td><td class="col-hl">✓ Termasuk</td><td>✓ Termasuk</td></tr>
      <tr><td>Akses REST API &amp; Webhook</td><td>1.000 req/hr</td><td class="col-hl">50.000 req/hr</td><td>Dedicated</td></tr>
      <tr><td>Audit Log &amp; SSO SAML</td><td>—</td><td class="col-hl">—</td><td>✓ Termasuk</td></tr>
    </tbody>
  </table>
</div>`,
      css: `.ui-table .col-hl { background: var(--brand-soft); font-weight: 700; }`,
      bind() {}
    },
    {
      id: 'comp-21',
      num: '21',
      category: 'saas',
      categoryLabel: 'SaaS Pricing & Social Proof',
      title: 'Enterprise Custom Quote Card',
      subtitle: 'Kartu penawaran Enterprise dengan slider jumlah kursi tim & estimasi harga otomatis',
      tags: 'enterprise custom quote slider pricing saas',
      html: `<div class="ui-surface" style="padding:22px;display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;align-items:center;">
  <div style="flex:1;min-width:240px;">
    <span class="ui-badge ui-badge-brand">ENTERPRISE CUSTOM</span>
    <h3 style="margin:8px 0 6px;">Butuh Skala Khusus untuk Tim Besar?</h3>
    <p class="ui-muted">Geser jumlah anggota tim untuk melihat estimasi paket SLA &amp; Dedicated Server.</p>
    <div style="margin-top:14px;">
      <div style="display:flex;justify-content:space-between;font-size:0.82rem;font-weight:700;margin-bottom:6px;">
        <span>Jumlah Kursi Tim:</span>
        <span style="color:var(--brand);" data-seat-label>50 Anggota</span>
      </div>
      <input type="range" min="20" max="200" step="10" value="50" style="width:100%;accent-color:var(--brand);" data-seat-range />
    </div>
  </div>
  <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-md);padding:18px;min-width:230px;text-align:center;">
    <div class="ui-muted" style="font-size:0.76rem;">Estimasi Mulai Dari</div>
    <div style="font-size:1.5rem;font-weight:800;margin:4px 0;color:var(--brand);" data-seat-price>Rp 1.750.000</div>
    <div class="ui-muted" style="font-size:0.74rem;margin-bottom:12px;">/bulan • Termasuk Account Manager</div>
    <button type="button" class="ui-btn ui-btn-primary ui-btn-block" data-quote-btn>Ajukan Penawaran</button>
  </div>
</div>`,
      css: `/* Menggunakan .ui-surface & range accent-color: var(--brand) */`,
      bind(root) {
        const range = root.querySelector('[data-seat-range]');
        const label = root.querySelector('[data-seat-label]');
        const price = root.querySelector('[data-seat-price]');
        range.addEventListener('input', () => {
          const seats = Number(range.value);
          label.textContent = seats + ' Anggota';
          price.textContent = formatRp(seats * 35000);
        });
        root.querySelector('[data-quote-btn]').addEventListener('click', () => {
          showToast('Permintaan penawaran untuk ' + range.value + ' anggota dikirim ✓');
        });
      }
    },
    {
      id: 'comp-22',
      num: '22',
      category: 'saas',
      categoryLabel: 'SaaS Pricing & Social Proof',
      title: 'Testimonial Quote Cards',
      subtitle: 'Kartu testimoni pelanggan dengan avatar berwarna, rating bintang & badge terverifikasi',
      tags: 'testimonial review quote customer social proof',
      html: `<div class="ui-grid-3">
  <div class="ui-surface" style="padding:18px;display:flex;flex-direction:column;gap:12px;">
    <div style="color:#f59e0b;font-size:0.88rem;">★★★★★</div>
    <p style="font-size:0.85rem;">“Desain komponennya rapi banget. Tinggal ganti warna di <code>tokens.css</code>, web klien langsung jadi dalam 2 jam!”</p>
    <div style="display:flex;align-items:center;gap:10px;margin-top:auto;">
      <div class="ui-avatar-circle" style="background:#4f46e5;">RA</div>
      <div><strong style="font-size:0.84rem;">Rizky Ananda</strong><div class="ui-muted" style="font-size:0.74rem;">Lead Frontend, StudioKarya</div></div>
    </div>
  </div>
  <div class="ui-surface" style="padding:18px;display:flex;flex-direction:column;gap:12px;">
    <div style="color:#f59e0b;font-size:0.88rem;">★★★★★</div>
    <p style="font-size:0.85rem;">“Checkout QRIS &amp; pricing toggle-nya langsung terpakai di proyek Laravel kami tanpa perlu instal library berat.”</p>
    <div style="display:flex;align-items:center;gap:10px;margin-top:auto;">
      <div class="ui-avatar-circle" style="background:#059669;">DP</div>
      <div><strong style="font-size:0.84rem;">Dina Permata</strong><div class="ui-muted" style="font-size:0.74rem;">Founder, TokoBaju.id</div></div>
    </div>
  </div>
  <div class="ui-surface" style="padding:18px;display:flex;flex-direction:column;gap:12px;">
    <div style="color:#f59e0b;font-size:0.88rem;">★★★★★</div>
    <p style="font-size:0.85rem;">“Dark mode bawaan sudah kontras dan enak dilihat. Menghemat waktu tim kami berminggu-minggu.”</p>
    <div style="display:flex;align-items:center;gap:10px;margin-top:auto;">
      <div class="ui-avatar-circle" style="background:#e11d48;">BW</div>
      <div><strong style="font-size:0.84rem;">Bagas Wijaya</strong><div class="ui-muted" style="font-size:0.74rem;">Product Manager, SaaSNow</div></div>
    </div>
  </div>
</div>`,
      css: `.ui-avatar-circle { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: #fff; }`,
      bind() {}
    },
    {
      id: 'comp-23',
      num: '23',
      category: 'saas',
      categoryLabel: 'SaaS Pricing & Social Proof',
      title: 'Metric Stat Bento Grid',
      subtitle: 'Kartu angka traksi bisnis SaaS & toko online untuk bagian social proof landing page',
      tags: 'metric stats bento traction numbers saas',
      html: `<div class="ui-grid-4">
  <div class="ui-surface" style="padding:18px;">
    <div class="ui-muted" style="font-size:0.78rem;font-weight:700;">TRANSAKSI DIPROSES</div>
    <div style="font-size:1.65rem;font-weight:800;color:var(--brand);margin:6px 0;">Rp 48,2 M</div>
    <span class="ui-badge ui-badge-success">↑ +34% YoY</span>
  </div>
  <div class="ui-surface" style="padding:18px;">
    <div class="ui-muted" style="font-size:0.78rem;font-weight:700;">PENGGUNA AKTIF</div>
    <div style="font-size:1.65rem;font-weight:800;margin:6px 0;">124.500+</div>
    <span class="ui-badge ui-badge-brand">Di 34 Provinsi</span>
  </div>
  <div class="ui-surface" style="padding:18px;">
    <div class="ui-muted" style="font-size:0.78rem;font-weight:700;">UPTIME SERVER</div>
    <div style="font-size:1.65rem;font-weight:800;color:var(--success);margin:6px 0;">99.98%</div>
    <span class="ui-badge ui-badge-muted">Monitoring 24/7</span>
  </div>
  <div class="ui-surface" style="padding:18px;">
    <div class="ui-muted" style="font-size:0.78rem;font-weight:700;">SKOR KEPUASAN (NPS)</div>
    <div style="font-size:1.65rem;font-weight:800;margin:6px 0;">4.92 / 5</div>
    <span class="ui-badge ui-badge-warning">★ 2.810 Review</span>
  </div>
</div>`,
      css: `.ui-grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; }`,
      bind() {}
    },
    {
      id: 'comp-24',
      num: '24',
      category: 'saas',
      categoryLabel: 'SaaS Pricing & Social Proof',
      title: 'Rating & Review Breakdown Bar',
      subtitle: 'Distribusi rating 5-bintang hingga 1-bintang yang dapat diklik untuk menyaring ulasan',
      tags: 'rating review breakdown bar ulasan produk',
      html: `<div class="ui-surface" style="padding:20px;display:grid;grid-template-columns:180px 1fr;gap:20px;align-items:center;">
  <div style="text-align:center;border-right:1px solid var(--border);padding-right:16px;">
    <div style="font-size:2.4rem;font-weight:800;line-height:1;">4.9</div>
    <div style="color:#f59e0b;margin:6px 0;">★★★★★</div>
    <div class="ui-muted" style="font-size:0.76rem;" data-rev-filter-info>Total 1.240 ulasan</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div class="ui-rating-row active" data-star="5"><span>5 ★</span><div class="ui-progress-track" style="margin:0;"><div class="ui-progress-fill" style="width:86%;"></div></div><span>86%</span></div>
    <div class="ui-rating-row" data-star="4"><span>4 ★</span><div class="ui-progress-track" style="margin:0;"><div class="ui-progress-fill" style="width:10%;"></div></div><span>10%</span></div>
    <div class="ui-rating-row" data-star="3"><span>3 ★</span><div class="ui-progress-track" style="margin:0;"><div class="ui-progress-fill" style="width:3%;"></div></div><span>3%</span></div>
    <div class="ui-rating-row" data-star="2"><span>2 ★</span><div class="ui-progress-track" style="margin:0;"><div class="ui-progress-fill" style="width:1%;"></div></div><span>1%</span></div>
    <div class="ui-rating-row" data-star="1"><span>1 ★</span><div class="ui-progress-track" style="margin:0;"><div class="ui-progress-fill" style="width:0%;"></div></div><span>0%</span></div>
  </div>
</div>`,
      css: `.ui-rating-row { display: grid; grid-template-columns: 52px 1fr 44px; align-items: center; gap: 10px; font-size: 0.8rem; cursor: pointer; }`,
      bind(root) {
        const info = root.querySelector('[data-rev-filter-info]');
        root.querySelectorAll('.ui-rating-row').forEach((row) => {
          row.addEventListener('click', () => {
            root.querySelectorAll('.ui-rating-row').forEach((r) => r.classList.remove('active'));
            row.classList.add('active');
            info.textContent = 'Filter: Ulasan Bintang ' + row.getAttribute('data-star');
          });
        });
      }
    },

    // -----------------------------------------------------------------------
    // KATEGORI 5: FORMS, AUTH & CHECKOUT (25 - 30)
    // -----------------------------------------------------------------------
    {
      id: 'comp-25',
      num: '25',
      category: 'forms',
      categoryLabel: 'Forms, Auth & Checkout',
      title: 'Login/Register Split Card',
      subtitle: 'Kartu autentikasi 2-kolom dengan tab Masuk/Daftar, toggle sandi & tombol OAuth',
      tags: 'login register auth form card oauth',
      html: `<div class="ui-auth-split">
  <div class="ui-auth-side">
    <div>
      <span class="ui-badge" style="background:rgba(255,255,255,0.2);color:#fff;">Workspace Cloud</span>
      <h3 style="margin-top:12px;font-size:1.3rem;">Kelola Toko &amp; SaaS Anda dari Satu Tempat</h3>
      <p style="font-size:0.82rem;opacity:0.88;margin-top:6px;">Keamanan enkripsi AES-256 &amp; autentikasi 2 langkah siap pakai.</p>
    </div>
    <div style="font-size:0.78rem;opacity:0.9;">“Onboarding tercepat yang pernah tim kami gunakan.”</div>
  </div>
  <div style="padding:22px;">
    <div class="ui-tabs" style="margin-bottom:14px;">
      <button type="button" class="ui-tab-btn active" data-auth-tab="login">Masuk</button>
      <button type="button" class="ui-tab-btn" data-auth-tab="register">Daftar Baru</button>
    </div>
    <form style="display:flex;flex-direction:column;gap:10px;" data-auth-form>
      <div data-reg-only hidden>
        <label style="font-size:0.78rem;font-weight:700;display:block;margin-bottom:4px;">Nama Lengkap</label>
        <input type="text" class="ui-input" placeholder="Andi Pratama" />
      </div>
      <div>
        <label style="font-size:0.78rem;font-weight:700;display:block;margin-bottom:4px;">Email</label>
        <input type="email" class="ui-input" placeholder="andi@bisnis.id" required />
      </div>
      <div>
        <label style="font-size:0.78rem;font-weight:700;display:block;margin-bottom:4px;">Kata Sandi</label>
        <div style="display:flex;gap:6px;">
          <input type="password" class="ui-input" value="rahasia123" data-pw-input required />
          <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-pw-toggle><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>
        </div>
      </div>
      <button type="submit" class="ui-btn ui-btn-primary ui-btn-block" data-auth-submit>Masuk ke Akun</button>
      <button type="button" class="ui-btn ui-btn-outline ui-btn-block">Lanjutkan dengan Google</button>
    </form>
  </div>
</div>`,
      css: `.ui-auth-split { display: grid; grid-template-columns: 1fr 1.1fr; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }`,
      bind(root) {
        const regOnly = root.querySelector('[data-reg-only]');
        const submitBtn = root.querySelector('[data-auth-submit]');
        root.querySelectorAll('[data-auth-tab]').forEach((tab) => {
          tab.addEventListener('click', () => {
            root.querySelectorAll('[data-auth-tab]').forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            const isReg = tab.getAttribute('data-auth-tab') === 'register';
            regOnly.hidden = !isReg;
            submitBtn.textContent = isReg ? 'Buat Akun Gratis' : 'Masuk ke Akun';
          });
        });
        const pwInput = root.querySelector('[data-pw-input]');
        root.querySelector('[data-pw-toggle]').addEventListener('click', () => {
          pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
        });
        root.querySelector('[data-auth-form]').addEventListener('submit', (e) => {
          e.preventDefault();
          showToast(submitBtn.textContent + ' berhasil (demo) ✓');
        });
      }
    },
    {
      id: 'comp-26',
      num: '26',
      category: 'forms',
      categoryLabel: 'Forms, Auth & Checkout',
      title: 'Multi-step Checkout Stepper',
      subtitle: 'Alur checkout bertahap (1. Alamat → 2. Pengiriman → 3. Pembayaran) dengan navigasi Lanjut/Kembali',
      tags: 'multi step checkout stepper wizard form',
      html: `<div class="ui-surface" style="padding:20px;">
  <div class="ui-stepper">
    <div class="ui-step-item active" data-step-ind="1"><span>1</span><span>Alamat Kirim</span></div>
    <div class="ui-step-item" data-step-ind="2"><span>2</span><span>Kurir Pengiriman</span></div>
    <div class="ui-step-item" data-step-ind="3"><span>3</span><span>Konfirmasi Bayar</span></div>
  </div>
  <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;" data-step-body>
    <strong>Langkah 1: Alamat Pengiriman</strong>
    <p class="ui-muted" style="margin:6px 0 12px;">Jl. Jenderal Sudirman Kav. 52, Jakarta Selatan 12190</p>
  </div>
  <div style="display:flex;justify-content:space-between;margin-top:14px;">
    <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-step-prev>← Sebelumnya</button>
    <button type="button" class="ui-btn ui-btn-primary ui-btn-sm" data-step-next>Lanjut Langkah →</button>
  </div>
</div>`,
      css: `.ui-stepper { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.ui-step-item.active { border-color: var(--brand); background: var(--brand-soft); color: var(--brand); }`,
      bind(root) {
        let step = 1;
        const bodies = {
          1: '<strong>Langkah 1: Alamat Pengiriman</strong><p class="ui-muted" style="margin:6px 0 0;">Jl. Jenderal Sudirman Kav. 52, Jakarta Selatan 12190</p>',
          2: '<strong>Langkah 2: Kurir Pengiriman</strong><p class="ui-muted" style="margin:6px 0 0;">JNE REG (Estimasi 1–2 hari) — Gratis Ongkir</p>',
          3: '<strong>Langkah 3: Konfirmasi Pembayaran</strong><p class="ui-muted" style="margin:6px 0 0;">Total tagihan Rp 649.000 siap dibayar via QRIS Instan.</p>'
        };
        const renderStep = () => {
          root.querySelectorAll('[data-step-ind]').forEach((el) => {
            const n = Number(el.getAttribute('data-step-ind'));
            el.classList.toggle('active', n === step);
            el.classList.toggle('done', n < step);
          });
          root.querySelector('[data-step-body]').innerHTML = bodies[step];
        };
        root.querySelector('[data-step-prev]').addEventListener('click', () => { if (step > 1) { step -= 1; renderStep(); } });
        root.querySelector('[data-step-next]').addEventListener('click', () => {
          if (step < 3) { step += 1; renderStep(); } else { showToast('Pesanan dikonfirmasi ✓'); }
        });
      }
    },
    {
      id: 'comp-27',
      num: '27',
      category: 'forms',
      categoryLabel: 'Forms, Auth & Checkout',
      title: 'Payment Method Selector QRIS/VA/Wallet',
      subtitle: 'Pemilih metode pembayaran lokal Indonesia (QRIS, BCA VA, GoPay/OVO) dengan info biaya admin',
      tags: 'payment method qris virtual account gopay ovo checkout',
      html: `<div class="ui-surface" style="padding:18px;max-width:540px;margin:0 auto;">
  <strong style="display:block;margin-bottom:10px;">Pilih Metode Pembayaran</strong>
  <div style="display:flex;flex-direction:column;gap:8px;">
    <label class="ui-pay-option selected" data-pay="QRIS Instan (Gratis Biaya Admin)">
      <div style="display:flex;align-items:center;gap:10px;">
        <input type="radio" name="paymethod" checked />
        <div><strong style="font-size:0.86rem;">QRIS (Semua Bank &amp; E-Wallet)</strong><div class="ui-muted" style="font-size:0.75rem;">Verifikasi otomatis &lt; 5 detik</div></div>
      </div>
      <span class="ui-badge ui-badge-success">Gratis Admin</span>
    </label>
    <label class="ui-pay-option" data-pay="BCA Virtual Account (Admin Rp 4.000)">
      <div style="display:flex;align-items:center;gap:10px;">
        <input type="radio" name="paymethod" />
        <div><strong style="font-size:0.86rem;">Virtual Account (BCA / Mandiri / BRI)</strong><div class="ui-muted" style="font-size:0.75rem;">Transfer nomor VA unik 24 jam</div></div>
      </div>
      <span class="ui-badge ui-badge-muted">+Rp 4.000</span>
    </label>
    <label class="ui-pay-option" data-pay="GoPay / OVO / DANA">
      <div style="display:flex;align-items:center;gap:10px;">
        <input type="radio" name="paymethod" />
        <div><strong style="font-size:0.86rem;">Dompet Digital (GoPay, OVO, DANA)</strong><div class="ui-muted" style="font-size:0.75rem;">Bayar langsung dari aplikasi HP</div></div>
      </div>
      <span class="ui-badge ui-badge-brand">Instan</span>
    </label>
  </div>
  <div class="ui-muted" style="margin-top:10px;font-size:0.78rem;" data-pay-info>Terpilih: <strong>QRIS Instan (Gratis Biaya Admin)</strong></div>
</div>`,
      css: `.ui-pay-option.selected { border-color: var(--brand); background: var(--brand-soft); }`,
      bind(root) {
        const info = root.querySelector('[data-pay-info]');
        const opts = root.querySelectorAll('.ui-pay-option');
        opts.forEach((opt) => {
          opt.addEventListener('click', () => {
            opts.forEach((o) => o.classList.remove('selected'));
            opt.classList.add('selected');
            opt.querySelector('input').checked = true;
            info.innerHTML = 'Terpilih: <strong>' + opt.getAttribute('data-pay') + '</strong>';
          });
        });
      }
    },
    {
      id: 'comp-28',
      num: '28',
      category: 'forms',
      categoryLabel: 'Forms, Auth & Checkout',
      title: 'Floating Label Input Group + Validation',
      subtitle: 'Input dengan label mengambang animasi halus serta validasi format email & WhatsApp real-time',
      tags: 'floating label input validation form',
      html: `<div class="ui-surface" style="padding:18px;">
  <div class="ui-grid-2">
    <div>
      <div class="ui-float-group is-valid" data-fg-email>
        <input type="email" class="ui-float-input" id="flEmail" placeholder=" " value="budi@tokokita.id" />
        <label class="ui-float-label" for="flEmail">Alamat Email Aktif</label>
      </div>
      <div style="font-size:0.74rem;color:var(--success);margin-top:4px;" data-fg-email-msg>✓ Format email valid</div>
    </div>
    <div>
      <div class="ui-float-group" data-fg-wa>
        <input type="tel" class="ui-float-input" id="flWa" placeholder=" " value="08123456789" />
        <label class="ui-float-label" for="flWa">Nomor WhatsApp</label>
      </div>
      <div style="font-size:0.74rem;color:var(--muted);margin-top:4px;" data-fg-wa-msg>Ketik min. 10 digit angka (contoh: 0812...)</div>
    </div>
  </div>
</div>`,
      css: `.ui-float-input:focus + .ui-float-label, .ui-float-input:not(:placeholder-shown) + .ui-float-label { top: 10px; font-size: 0.68rem; font-weight: 700; color: var(--brand); }`,
      bind(root) {
        const emailGroup = root.querySelector('[data-fg-email]');
        const emailMsg = root.querySelector('[data-fg-email-msg]');
        emailGroup.querySelector('input').addEventListener('input', (e) => {
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
          emailGroup.classList.toggle('is-valid', ok);
          emailGroup.classList.toggle('is-error', !ok);
          emailMsg.style.color = ok ? 'var(--success)' : 'var(--danger)';
          emailMsg.textContent = ok ? '✓ Format email valid' : '✕ Masukkan email yang benar';
        });
        const waGroup = root.querySelector('[data-fg-wa]');
        const waMsg = root.querySelector('[data-fg-wa-msg]');
        waGroup.querySelector('input').addEventListener('input', (e) => {
          const ok = /^08\d{8,12}$/.test(e.target.value.trim());
          waGroup.classList.toggle('is-valid', ok);
          waGroup.classList.toggle('is-error', !ok);
          waMsg.style.color = ok ? 'var(--success)' : 'var(--danger)';
          waMsg.textContent = ok ? '✓ Nomor WhatsApp valid' : '✕ Harus diawali 08 dan 10–14 digit';
        });
      }
    },
    {
      id: 'comp-29',
      num: '29',
      category: 'forms',
      categoryLabel: 'Forms, Auth & Checkout',
      title: 'OTP 6-Digit Verification Input',
      subtitle: 'Input kode verifikasi 6 digit dengan auto-focus kotak berikutnya & dukungan paste',
      tags: 'otp 6 digit verification auth security',
      html: `<div class="ui-surface" style="padding:20px;max-width:420px;margin:0 auto;text-align:center;">
  <strong>Verifikasi Kode OTP</strong>
  <p class="ui-muted" style="margin-top:4px;">Masukkan 6 digit kode yang dikirim ke WhatsApp <strong>+62 812-••••-7890</strong></p>
  <div class="ui-otp-row" data-otp-row>
    <input type="text" maxlength="1" inputmode="numeric" class="ui-otp-box" value="4" />
    <input type="text" maxlength="1" inputmode="numeric" class="ui-otp-box" value="8" />
    <input type="text" maxlength="1" inputmode="numeric" class="ui-otp-box" value="2" />
    <input type="text" maxlength="1" inputmode="numeric" class="ui-otp-box" />
    <input type="text" maxlength="1" inputmode="numeric" class="ui-otp-box" />
    <input type="text" maxlength="1" inputmode="numeric" class="ui-otp-box" />
  </div>
  <button type="button" class="ui-btn ui-btn-primary ui-btn-block" data-otp-verify>Verifikasi Kode</button>
</div>`,
      css: `.ui-otp-box { width: 44px; height: 50px; text-align: center; font-size: 1.2rem; font-weight: 800; border: 1px solid var(--border-strong); border-radius: var(--radius-sm); }`,
      bind(root) {
        const boxes = Array.from(root.querySelectorAll('.ui-otp-box'));
        boxes.forEach((box, idx) => {
          box.addEventListener('input', () => {
            box.value = box.value.replace(/\D/g, '').slice(0, 1);
            if (box.value && boxes[idx + 1]) boxes[idx + 1].focus();
          });
          box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && boxes[idx - 1]) boxes[idx - 1].focus();
          });
        });
        root.querySelector('[data-otp-verify]').addEventListener('click', () => {
          const code = boxes.map((b) => b.value).join('');
          showToast(code.length === 6 ? 'Kode OTP ' + code + ' terverifikasi ✓' : 'Lengkapi 6 digit kode OTP!');
        });
      }
    },
    {
      id: 'comp-30',
      num: '30',
      category: 'forms',
      categoryLabel: 'Forms, Auth & Checkout',
      title: 'File Dropzone Uploader',
      subtitle: 'Area unggah file drag-and-drop & klik dengan daftar file terunggah yang bisa dihapus',
      tags: 'file upload dropzone drag drop form',
      html: `<div>
  <label class="ui-dropzone" data-dropzone style="display:block;">
    <input type="file" hidden multiple data-file-input />
    <div style="font-size:1.6rem;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;color:var(--brand);"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg></div>
    <strong style="display:block;margin-top:4px;">Klik atau seret file ke area ini</strong>
    <div class="ui-muted" style="font-size:0.78rem;">Mendukung PNG, JPG, PDF, atau ZIP (Maks. 10 MB)</div>
  </label>
  <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px;" data-file-list>
    <div class="ui-surface" style="padding:8px 12px;display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;">
      <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> bukti-transfer-bca.png <span class="ui-muted">(420 KB)</span></span>
      <span class="ui-badge ui-badge-success">100% Terunggah</span>
    </div>
  </div>
</div>`,
      css: `.ui-dropzone { border: 2px dashed var(--border-strong); border-radius: var(--radius-md); background: var(--surface); padding: 24px; text-align: center; cursor: pointer; }
.ui-dropzone.dragover { border-color: var(--brand); background: var(--brand-soft); }`,
      bind(root) {
        const dz = root.querySelector('[data-dropzone]');
        const input = root.querySelector('[data-file-input]');
        const list = root.querySelector('[data-file-list]');
        const addFiles = (files) => {
          Array.from(files).forEach((f) => {
            const kb = Math.max(1, Math.round(f.size / 1024));
            const row = document.createElement('div');
            row.className = 'ui-surface';
            row.style.cssText = 'padding:8px 12px;display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;';
            row.innerHTML = `<span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> ${f.name} <span class="ui-muted">(${kb} KB)</span></span><span class="ui-badge ui-badge-success">Siap ✓</span>`;
            list.appendChild(row);
          });
        };
        input.addEventListener('change', () => addFiles(input.files));
        dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
        dz.addEventListener('drop', (e) => {
          e.preventDefault();
          dz.classList.remove('dragover');
          addFiles(e.dataTransfer.files);
        });
      }
    },

    // -----------------------------------------------------------------------
    // KATEGORI 6: DASHBOARD & DATA UI (31 - 36)
    // -----------------------------------------------------------------------
    {
      id: 'comp-31',
      num: '31',
      category: 'dashboard',
      categoryLabel: 'Dashboard & Data UI',
      title: 'KPI Metric Sparkline Card',
      subtitle: 'Kartu metrik KPI dashboard lengkap dengan grafik mini polyline SVG & badge pertumbuhan',
      tags: 'kpi metric sparkline chart dashboard card',
      html: `<div class="ui-grid-3">
  <div class="ui-kpi-card">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span class="ui-muted">Pendapatan Bulanan (MRR)</span>
      <span class="ui-badge ui-badge-success">+18.4%</span>
    </div>
    <div class="ui-kpi-val">Rp 84.500.000</div>
    <svg width="100%" height="36" viewBox="0 0 200 36" fill="none">
      <path d="M2 30L35 24L68 27L102 15L135 18L168 8L198 4" stroke="var(--brand)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </div>
  <div class="ui-kpi-card">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span class="ui-muted">Pesanan Baru Hari Ini</span>
      <span class="ui-badge ui-badge-brand">+24 order</span>
    </div>
    <div class="ui-kpi-val">312 Order</div>
    <svg width="100%" height="36" viewBox="0 0 200 36" fill="none">
      <path d="M2 28L35 20L68 22L102 12L135 16L168 10L198 6" stroke="var(--success)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </div>
  <div class="ui-kpi-card">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span class="ui-muted">Tingkat Retensi Pelanggan</span>
      <span class="ui-badge ui-badge-info">Stabil</span>
    </div>
    <div class="ui-kpi-val">94.2%</div>
    <svg width="100%" height="36" viewBox="0 0 200 36" fill="none">
      <path d="M2 18L35 16L68 17L102 14L135 12L168 13L198 9" stroke="var(--info)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </div>
</div>`,
      css: `.ui-kpi-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; }`,
      bind() {}
    },
    {
      id: 'comp-32',
      num: '32',
      category: 'dashboard',
      categoryLabel: 'Dashboard & Data UI',
      title: 'Data Table + Search + Status Pill',
      subtitle: 'Tabel transaksi dashboard interaktif dengan pencarian nama/ID & filter status pembayaran',
      tags: 'data table search status pill transaksi dashboard',
      html: `<div class="ui-surface" style="overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;">
    <input type="search" class="ui-input" style="max-width:250px;" placeholder="Cari invoice atau pelanggan..." data-tbl-search />
    <div style="display:flex;gap:6px;flex-wrap:wrap;">
      <button type="button" class="chip active" data-tbl-status="all">Semua</button>
      <button type="button" class="chip" data-tbl-status="Lunas">Lunas</button>
      <button type="button" class="chip" data-tbl-status="Proses">Proses</button>
      <button type="button" class="chip" data-tbl-status="Gagal">Gagal</button>
    </div>
  </div>
  <div class="ui-table-wrap" style="border:0;border-radius:0;">
    <table class="ui-table" data-tbl-body>
      <thead><tr><th>Invoice</th><th>Pelanggan</th><th>Nominal</th><th>Metode</th><th>Status</th></tr></thead>
      <tbody>
        <tr data-status="Lunas"><td><strong>#INV-1042</strong></td><td>PT Maju Jaya</td><td>Rp 1.490.000</td><td>QRIS</td><td><span class="ui-badge ui-badge-success">Lunas</span></td></tr>
        <tr data-status="Proses"><td><strong>#INV-1041</strong></td><td>Kopi Senja</td><td>Rp 450.000</td><td>BCA VA</td><td><span class="ui-badge ui-badge-warning">Proses</span></td></tr>
        <tr data-status="Lunas"><td><strong>#INV-1040</strong></td><td>Nadia Craft</td><td>Rp 825.000</td><td>GoPay</td><td><span class="ui-badge ui-badge-success">Lunas</span></td></tr>
        <tr data-status="Gagal"><td><strong>#INV-1039</strong></td><td>Bintang Store</td><td>Rp 299.000</td><td>OVO</td><td><span class="ui-badge ui-badge-danger">Gagal</span></td></tr>
      </tbody>
    </table>
  </div>
</div>`,
      css: `/* Menggunakan .ui-table, .ui-input, .chip, dan .ui-badge */`,
      bind(root) {
        let activeStatus = 'all';
        const searchEl = root.querySelector('[data-tbl-search]');
        const rows = root.querySelectorAll('tbody tr');
        const filterRows = () => {
          const q = searchEl.value.trim().toLowerCase();
          rows.forEach((tr) => {
            const st = tr.getAttribute('data-status');
            const matchSt = activeStatus === 'all' || st === activeStatus;
            const matchQ = !q || tr.textContent.toLowerCase().includes(q);
            tr.style.display = matchSt && matchQ ? '' : 'none';
          });
        };
        searchEl.addEventListener('input', filterRows);
        root.querySelectorAll('[data-tbl-status]').forEach((btn) => {
          btn.addEventListener('click', () => {
            root.querySelectorAll('[data-tbl-status]').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            activeStatus = btn.getAttribute('data-tbl-status');
            filterRows();
          });
        });
      }
    },
    {
      id: 'comp-33',
      num: '33',
      category: 'dashboard',
      categoryLabel: 'Dashboard & Data UI',
      title: 'Empty State Actionable',
      subtitle: 'Tampilan kosong informatif dengan ilustrasi SVG, penjelasan singkat & tombol aksi utama',
      tags: 'empty state kosong placeholder cta',
      html: `<div class="ui-surface" style="padding:32px 20px;text-align:center;">
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style="margin:0 auto 10px;display:block;">
    <circle cx="36" cy="36" r="34" fill="var(--brand-soft)"/>
    <rect x="20" y="22" width="32" height="28" rx="5" fill="var(--surface)" stroke="var(--brand)" stroke-width="2"/>
    <path d="M27 33H45M27 40H38" stroke="var(--brand)" stroke-width="2.2" stroke-linecap="round"/>
  </svg>
  <h3>Belum Ada Produk di Etalase</h3>
  <p class="ui-muted" style="max-width:400px;margin:6px auto 16px;">Tambahkan produk pertama Anda atau impor massal dari file Excel/CSV untuk mulai berjualan.</p>
  <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
    <button type="button" class="ui-btn ui-btn-primary">+ Tambah Produk Pertama</button>
    <button type="button" class="ui-btn ui-btn-outline">Impor dari CSV</button>
  </div>
</div>`,
      css: `/* Menggunakan .ui-surface dan SVG bertoken var(--brand) */`,
      bind(root) {
        root.querySelectorAll('.ui-btn').forEach((b) => b.addEventListener('click', () => showToast('Aksi: ' + b.textContent.trim())));
      }
    },
    {
      id: 'comp-34',
      num: '34',
      category: 'dashboard',
      categoryLabel: 'Dashboard & Data UI',
      title: 'Activity Audit Feed',
      subtitle: 'Linimasa aktivitas tim & sistem untuk memantau perubahan penting secara kronologis',
      tags: 'activity feed audit log timeline riwayat',
      html: `<div class="ui-surface" style="padding:18px;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
    <strong>Log Aktivitas Terbaru</strong>
    <span class="ui-badge ui-badge-brand">Live Update</span>
  </div>
  <div class="ui-audit-item">
    <div class="ui-avatar-circle" style="background:#4f46e5;width:32px;height:32px;font-size:0.72rem;">AP</div>
    <div style="flex:1;">
      <div style="font-size:0.84rem;"><strong>Andi Pratama</strong> menerbitkan <strong>Promo Akhir Pekan</strong></div>
      <div class="ui-muted" style="font-size:0.74rem;">2 menit lalu • Modul Marketing</div>
    </div>
    <span class="ui-badge ui-badge-success">Publish</span>
  </div>
  <div class="ui-audit-item">
    <div class="ui-avatar-circle" style="background:#059669;width:32px;height:32px;font-size:0.72rem;">SN</div>
    <div style="flex:1;">
      <div style="font-size:0.84rem;"><strong>Siti Nurhaliza</strong> mengonfirmasi pembayaran <strong>#INV-1042</strong></div>
      <div class="ui-muted" style="font-size:0.74rem;">14 menit lalu • Finance</div>
    </div>
    <span class="ui-badge ui-badge-info">Finance</span>
  </div>
  <div class="ui-audit-item">
    <div class="ui-avatar-circle" style="background:#d97706;width:32px;height:32px;font-size:0.72rem;">SYS</div>
    <div style="flex:1;">
      <div style="font-size:0.84rem;"><strong>Webhook Midtrans</strong> memperbarui status API key produksi</div>
      <div class="ui-muted" style="font-size:0.74rem;">1 jam lalu • Sistem</div>
    </div>
    <span class="ui-badge ui-badge-warning">Security</span>
  </div>
</div>`,
      css: `.ui-audit-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }`,
      bind() {}
    },
    {
      id: 'comp-35',
      num: '35',
      category: 'dashboard',
      categoryLabel: 'Dashboard & Data UI',
      title: 'User Avatar Stack & Role Badge',
      subtitle: 'Grup avatar tim bertumpuk plus daftar hak akses (Owner, Admin, Editor)',
      tags: 'avatar stack role badge team member users',
      html: `<div class="ui-surface" style="padding:18px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;">
  <div style="display:flex;align-items:center;gap:14px;">
    <div class="ui-avatar-stack">
      <div class="ui-avatar-circle" style="background:#4f46e5;">AD</div>
      <div class="ui-avatar-circle" style="background:#059669;">SR</div>
      <div class="ui-avatar-circle" style="background:#e11d48;">MK</div>
      <div class="ui-avatar-circle" style="background:#d97706;">+8</div>
    </div>
    <div>
      <strong style="font-size:0.9rem;">Tim Operasional Toko (11 Anggota)</strong>
      <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;">
        <span class="ui-badge ui-badge-brand">2 Owner</span>
        <span class="ui-badge ui-badge-success">4 Admin</span>
        <span class="ui-badge ui-badge-muted">5 Kasir</span>
      </div>
    </div>
  </div>
  <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-invite-btn>+ Undang Anggota</button>
</div>`,
      css: `.ui-avatar-stack { display: flex; align-items: center; }
.ui-avatar-stack .ui-avatar-circle { margin-left: -10px; border: 2px solid var(--surface); }`,
      bind(root) {
        root.querySelector('[data-invite-btn]').addEventListener('click', () => showToast('Link undangan tim disalin ✓'));
      }
    },
    {
      id: 'comp-36',
      num: '36',
      category: 'dashboard',
      categoryLabel: 'Dashboard & Data UI',
      title: 'Progress Goal Card',
      subtitle: 'Kartu target omzet & penyelesaian onboarding dengan progress bar dan persentase',
      tags: 'progress goal target omzet milestone card',
      html: `<div class="ui-grid-2">
  <div class="ui-surface" style="padding:18px;">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <strong>Target Omzet November</strong>
      <span class="ui-badge ui-badge-brand">78% Tercapai</span>
    </div>
    <div style="font-size:1.25rem;font-weight:800;margin:8px 0 4px;">Rp 78.000.000 <span class="ui-muted" style="font-size:0.82rem;font-weight:500;">/ Rp 100 jt</span></div>
    <div class="ui-progress-track"><div class="ui-progress-fill" style="width:78%;"></div></div>
    <div class="ui-muted" style="font-size:0.76rem;">Sisa 9 hari lagi • Proyeksi akhir bulan: Rp 104 jt</div>
  </div>
  <div class="ui-surface" style="padding:18px;">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <strong>Setup Toko Baru</strong>
      <span class="ui-badge ui-badge-success">4 dari 5 Selesai</span>
    </div>
    <div style="font-size:1.25rem;font-weight:800;margin:8px 0 4px;">80% Siap Rilis</div>
    <div class="ui-progress-track"><div class="ui-progress-fill" style="width:80%;background:var(--success);"></div></div>
    <div class="ui-muted" style="font-size:0.76rem;">Langkah tersisa: Aktifkan Webhook Pembayaran QRIS</div>
  </div>
</div>`,
      css: `.ui-progress-track { height: 8px; background: var(--bg-subtle); border-radius: var(--radius-full); overflow: hidden; }
.ui-progress-fill { height: 100%; background: var(--brand); border-radius: var(--radius-full); }`,
      bind() {}
    },

    // -----------------------------------------------------------------------
    // KATEGORI 7: OVERLAYS, FEEDBACK & FOOTER (37 - 42)
    // -----------------------------------------------------------------------
    {
      id: 'comp-37',
      num: '37',
      category: 'overlays',
      categoryLabel: 'Overlays, Feedback & Footer',
      title: 'Interactive FAQ Accordion',
      subtitle: 'Daftar tanya-jawab (FAQ) lipat-buka mulus menggunakan elemen HTML native semantik',
      tags: 'faq accordion details summary pertanyaan',
      html: `<div class="ui-faq">
  <details open>
    <summary>Apakah semua komponen mendukung Dark Mode &amp; warna brand kustom?</summary>
    <p>Ya! Seluruh 42 komponen membaca CSS Variables dari <code>tokens.css</code>. Mengubah nilai <code>--brand</code> otomatis memperbarui semua tombol, badge, dan highlight.</p>
  </details>
  <details>
    <summary>Apakah bisa dipakai di Laravel Blade, React, atau HTML statis?</summary>
    <p>Tentu. HTML dan CSS bersifat murni tanpa dependensi eksternal, tinggal salin dan tempel.</p>
  </details>
  <details>
    <summary>Bagaimana cara mendapatkan pembaruan komponen di masa depan?</summary>
    <p>Lisensi pembelian sudah termasuk penggunaan unlimited proyek pribadi maupun komersial klien.</p>
  </details>
</div>`,
      css: `.ui-faq details { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 16px; }`,
      bind() {}
    },
    {
      id: 'comp-38',
      num: '38',
      category: 'overlays',
      categoryLabel: 'Overlays, Feedback & Footer',
      title: 'Confirm/Delete Modal Dialog',
      subtitle: 'Dialog modal konfirmasi penghapusan dengan backdrop blur, tombol tutup & ESC handler',
      tags: 'modal dialog confirm delete popup overlay',
      html: `<div class="ui-surface" style="padding:18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
  <div>
    <strong>Simulasi Modal Konfirmasi Hapus</strong>
    <div class="ui-muted" style="font-size:0.78rem;">Klik tombol di samping untuk membuka dialog modal interaktif dengan backdrop.</div>
  </div>
  <button type="button" class="ui-btn ui-btn-danger" data-open-modal><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg> Hapus Produk Demo</button>

  <div class="ui-modal-backdrop" hidden data-modal-backdrop>
    <div class="ui-modal-dialog" role="dialog" aria-modal="true">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span class="ui-badge ui-badge-danger">Konfirmasi Aksi</span>
        <button type="button" class="ui-btn ui-btn-ghost ui-btn-sm" data-close-modal>✕</button>
      </div>
      <h3 style="margin-bottom:6px;">Hapus Produk Ini Secara Permanen?</h3>
      <p class="ui-muted">Data produk dan riwayat varian yang sudah dihapus tidak dapat dikembalikan lagi.</p>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px;">
        <button type="button" class="ui-btn ui-btn-outline" data-close-modal>Batal</button>
        <button type="button" class="ui-btn ui-btn-danger" data-confirm-modal>Ya, Hapus Sekarang</button>
      </div>
    </div>
  </div>
</div>`,
      css: `.ui-modal-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(15, 23, 42, 0.58); backdrop-filter: blur(4px); display: grid; place-items: center; }`,
      bind(root) {
        const backdrop = root.querySelector('[data-modal-backdrop]');
        root.querySelector('[data-open-modal]').addEventListener('click', () => { backdrop.hidden = false; });
        root.querySelectorAll('[data-close-modal]').forEach((btn) => {
          btn.addEventListener('click', () => { backdrop.hidden = true; });
        });
        root.querySelector('[data-confirm-modal]').addEventListener('click', () => {
          backdrop.hidden = true;
          showToast('Item berhasil dihapus (simulasi) ✓');
        });
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) backdrop.hidden = true;
        });
      }
    },
    {
      id: 'comp-39',
      num: '39',
      category: 'overlays',
      categoryLabel: 'Overlays, Feedback & Footer',
      title: 'Toast Notification Stack',
      subtitle: 'Pemicu notifikasi toast 4 varian (Sukses, Info, Peringatan, Error) bertumpuk & bisa ditutup',
      tags: 'toast notification alert stack feedback',
      html: `<div class="ui-surface" style="padding:18px;">
  <div style="display:flex;gap:8px;flex-wrap:wrap;">
    <button type="button" class="ui-btn ui-btn-primary ui-btn-sm" data-add-toast="success">+ Toast Sukses</button>
    <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-add-toast="info">+ Toast Info</button>
    <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-add-toast="warning">+ Toast Peringatan</button>
    <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-add-toast="danger">+ Toast Error</button>
  </div>
  <div class="ui-toast-stack-area" data-toast-stack>
    <div class="ui-toast-item">
      <span><span class="ui-badge ui-badge-success">SUKSES</span> Pengaturan webhook pembayaran berhasil disimpan.</span>
      <button type="button" class="ui-btn ui-btn-ghost ui-btn-sm" data-toast-close>✕</button>
    </div>
  </div>
</div>`,
      css: `.ui-toast-stack-area { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
.ui-toast-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); }`,
      bind(root) {
        const stack = root.querySelector('[data-toast-stack]');
        const map = {
          success: ['ui-badge-success', 'SUKSES', 'Pembayaran QRIS berhasil diverifikasi!'],
          info: ['ui-badge-info', 'INFO', 'Pembaruan sistem v3.0 tersedia.'],
          warning: ['ui-badge-warning', 'PERINGATAN', 'Stok SKU-09 tersisa 3 unit lagi.'],
          danger: ['ui-badge-danger', 'ERROR', 'Gagal terhubung ke server SMTP.']
        };
        const bindClose = (el) => {
          el.querySelector('[data-toast-close]').addEventListener('click', () => el.remove());
        };
        stack.querySelectorAll('.ui-toast-item').forEach(bindClose);
        root.querySelectorAll('[data-add-toast]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const [cls, tag, text] = map[btn.getAttribute('data-add-toast')];
            const item = document.createElement('div');
            item.className = 'ui-toast-item';
            item.innerHTML = `<span><span class="ui-badge ${cls}">${tag}</span> ${text}</span><button type="button" class="ui-btn ui-btn-ghost ui-btn-sm" data-toast-close>✕</button>`;
            bindClose(item);
            stack.prepend(item);
          });
        });
      }
    },
    {
      id: 'comp-40',
      num: '40',
      category: 'overlays',
      categoryLabel: 'Overlays, Feedback & Footer',
      title: 'Cookie/Privacy Consent Banner',
      subtitle: 'Banner persetujuan privasi & analitik dengan tombol pengaturan preferensi',
      tags: 'cookie privacy consent banner gdpr',
      html: `<div class="ui-surface" style="padding:18px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;">
  <div style="flex:1;min-width:240px;">
    <strong><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg> Privasi &amp; Cookie Situs</strong>
    <p class="ui-muted" style="margin-top:4px;">Kami menggunakan cookie esensial untuk keranjang belanja serta analitik anonim guna meningkatkan layanan.</p>
  </div>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
    <label style="font-size:0.78rem;display:inline-flex;align-items:center;gap:5px;cursor:pointer;">
      <input type="checkbox" checked data-cookie-analytics /> Analitik
    </label>
    <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-cookie-save>Simpan Pilihan</button>
    <button type="button" class="ui-btn ui-btn-primary ui-btn-sm" data-cookie-all>Terima Semua</button>
  </div>
</div>`,
      css: `/* Menggunakan .ui-surface, .ui-btn, dan var(--border) */`,
      bind(root) {
        root.querySelector('[data-cookie-save]').addEventListener('click', () => {
          const on = root.querySelector('[data-cookie-analytics]').checked;
          showToast('Preferensi cookie disimpan (Analitik: ' + (on ? 'Aktif' : 'Nonaktif') + ')');
        });
        root.querySelector('[data-cookie-all]').addEventListener('click', () => {
          root.querySelector('[data-cookie-analytics]').checked = true;
          showToast('Semua cookie diterima ✓');
        });
      }
    },
    {
      id: 'comp-41',
      num: '41',
      category: 'overlays',
      categoryLabel: 'Overlays, Feedback & Footer',
      title: 'Multi-column E-Commerce Footer',
      subtitle: 'Footer toko online & SaaS lengkap 4 kolom dengan badge metode bayar dan hak cipta',
      tags: 'footer ecommerce multi column links',
      html: `<footer class="ui-footer">
  <div class="ui-footer-grid">
    <div>
      <div class="ui-logo"><span class="ui-logo-dot">N</span><span>NusaStore</span></div>
      <p class="ui-muted" style="margin-top:8px;">Platform perlengkapan kerja &amp; produk digital terpercaya di Indonesia sejak 2022.</p>
      <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;">
        <span class="ui-badge ui-badge-muted">QRIS</span>
        <span class="ui-badge ui-badge-muted">BCA</span>
        <span class="ui-badge ui-badge-muted">Mandiri</span>
        <span class="ui-badge ui-badge-muted">GoPay</span>
      </div>
    </div>
    <div>
      <strong style="display:block;font-size:0.84rem;margin-bottom:8px;">Produk</strong>
      <ul class="ui-footer-links">
        <li><a href="#f1">Katalog Unggulan</a></li>
        <li><a href="#f2">Paket Bundling</a></li>
        <li><a href="#f3">Promo Flash Sale</a></li>
      </ul>
    </div>
    <div>
      <strong style="display:block;font-size:0.84rem;margin-bottom:8px;">Perusahaan</strong>
      <ul class="ui-footer-links">
        <li><a href="#f4">Tentang Kami</a></li>
        <li><a href="#f5">Blog &amp; Panduan</a></li>
        <li><a href="#f6">Program Afiliasi</a></li>
      </ul>
    </div>
    <div>
      <strong style="display:block;font-size:0.84rem;margin-bottom:8px;">Bantuan</strong>
      <ul class="ui-footer-links">
        <li><a href="#f7">Lacak Pengiriman</a></li>
        <li><a href="#f8">Garansi &amp; Retur</a></li>
        <li><a href="#f9">Hubungi WhatsApp</a></li>
      </ul>
    </div>
  </div>
  <div style="border-top:1px solid var(--border);margin-top:18px;padding-top:14px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:0.78rem;" class="ui-muted">
    <span>© 2026 NusaStore Indonesia. Seluruh hak cipta dilindungi.</span>
    <span>Syarat &amp; Ketentuan • Kebijakan Privasi</span>
  </div>
</footer>`,
      css: `.ui-footer-grid { display: grid; grid-template-columns: 1.5fr repeat(3, 1fr); gap: 20px; }`,
      bind() {}
    },
    {
      id: 'comp-42',
      num: '42',
      category: 'overlays',
      categoryLabel: 'Overlays, Feedback & Footer',
      title: 'Skeleton Loading Card',
      subtitle: 'Animasi shimmer skeleton placeholder dengan switch interaktif Skeleton vs Loaded',
      tags: 'skeleton loading shimmer placeholder card',
      html: `<div>
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
    <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-skel-toggle><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Toggle Mode: Skeleton / Loaded</button>
    <span class="ui-muted" style="font-size:0.78rem;" data-skel-state>Status: Menampilkan Shimmer Skeleton + Konten Terisi</span>
  </div>
  <div class="ui-grid-2">
    <div class="ui-surface" style="padding:18px;" data-skel-card>
      <div class="ui-skel" style="height:110px;width:100%;margin-bottom:12px;"></div>
      <div class="ui-skel" style="height:16px;width:72%;margin-bottom:8px;"></div>
      <div class="ui-skel" style="height:12px;width:90%;margin-bottom:14px;"></div>
      <div class="ui-skel" style="height:36px;width:100%;border-radius:8px;"></div>
    </div>
    <div class="ui-surface" style="padding:18px;" data-loaded-card>
      <div style="height:110px;border-radius:8px;background:var(--brand-soft);display:grid;place-items:center;margin-bottom:12px;">
        <span class="ui-badge ui-badge-brand">✓ Data Siap Ditampilkan</span>
      </div>
      <strong>Paket UI Kit Pro v3.0</strong>
      <p class="ui-muted" style="margin:4px 0 12px;">Contoh tampilan kartu setelah proses fetch API selesai dimuat.</p>
      <button type="button" class="ui-btn ui-btn-primary ui-btn-block">Buka Komponen</button>
    </div>
  </div>
</div>`,
      css: `@keyframes uiShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.ui-skel { background: linear-gradient(90deg, var(--bg-subtle) 25%, var(--border) 50%, var(--bg-subtle) 75%); background-size: 200% 100%; animation: uiShimmer 1.4s infinite linear; }`,
      bind(root) {
        let showSkeletonOnly = false;
        const skelCard = root.querySelector('[data-skel-card]');
        const loadedCard = root.querySelector('[data-loaded-card]');
        const stateEl = root.querySelector('[data-skel-state]');
        root.querySelector('[data-skel-toggle]').addEventListener('click', () => {
          showSkeletonOnly = !showSkeletonOnly;
          if (showSkeletonOnly) {
            loadedCard.style.opacity = '0.45';
            skelCard.style.boxShadow = '0 0 0 2px var(--brand)';
            stateEl.textContent = 'Status: Simulasi Loading Aktif (Skeleton)';
          } else {
            loadedCard.style.opacity = '1';
            skelCard.style.boxShadow = '';
            stateEl.textContent = 'Status: Menampilkan Shimmer Skeleton + Konten Terisi';
          }
        });
      }
    }
  ];

  // =========================================================================
  // Render Showcase & Studio Controls
  // =========================================================================
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  let activeGroup = 'all';
  let searchQuery = '';

  function renderComponents() {
    const grid = document.getElementById('componentsGrid');
    const emptyEl = document.getElementById('emptySearch');
    const statusEl = document.getElementById('kitStatusMeta');
    if (!grid) return;

    const q = searchQuery.trim().toLowerCase();
    const filtered = COMPONENTS.filter((c) => {
      const matchGroup = activeGroup === 'all' || c.category === activeGroup;
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.categoryLabel.toLowerCase().includes(q) ||
        c.tags.toLowerCase().includes(q) ||
        c.num.includes(q);
      return matchGroup && matchSearch;
    });

    if (statusEl) {
      statusEl.innerHTML = `Menampilkan <strong>${filtered.length}</strong> dari <strong>${COMPONENTS.length}</strong> komponen`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    const fragment = document.createDocumentFragment();
    let lastCategory = null;

    filtered.forEach((comp) => {
      if (comp.category !== lastCategory) {
        lastCategory = comp.category;
        const catCount = filtered.filter((x) => x.category === comp.category).length;
        const heading = document.createElement('div');
        heading.className = 'kit-category-heading';
        heading.innerHTML = `<h2>${comp.categoryLabel} <span class="kit-cat-badge">${catCount} komponen</span></h2>`;
        fragment.appendChild(heading);
      }

      const section = document.createElement('section');
      section.className = 'comp-block';
      section.setAttribute('data-group', comp.category);
      section.setAttribute('data-comp-id', comp.id);

      section.innerHTML = `
        <div class="comp-head">
          <div class="comp-title-group">
            <span class="comp-num">${comp.num}</span>
            <div>
              <div class="comp-title">${comp.title}</div>
              <div class="comp-sub">${comp.subtitle}</div>
            </div>
          </div>
          <div class="comp-actions">
            <button type="button" class="ui-btn ui-btn-outline ui-btn-sm" data-toggle-code="${comp.id}">Lihat HTML/CSS</button>
            <button type="button" class="ui-btn ui-btn-primary ui-btn-sm" data-copy-code="${comp.id}">Salin Kode HTML</button>
          </div>
        </div>
        <div class="comp-preview" id="${comp.id}">${comp.html}</div>
        <div class="comp-code-panel" id="${comp.id}-code" hidden>
          <div class="comp-code-tabs">
            <div class="comp-code-tab-btns">
              <button type="button" class="code-tab-btn active" data-code-tab="html">HTML Markup</button>
              <button type="button" class="code-tab-btn" data-code-tab="css">CSS Tokens &amp; Classes</button>
            </div>
            <button type="button" class="ui-btn ui-btn-sm" style="background:rgba(255,255,255,0.12);color:#fff;" data-copy-panel>Salin Snippet</button>
          </div>
          <pre class="comp-code-pre" data-code-view="html"><code>${escapeHtml(comp.html.trim())}</code></pre>
          <pre class="comp-code-pre" data-code-view="css" hidden><code>${escapeHtml(comp.css.trim())}</code></pre>
        </div>
      `;

      // Bind live component interactivity
      const previewEl = section.querySelector('#' + comp.id);
      if (typeof comp.bind === 'function') {
        comp.bind(previewEl);
      }

      // Bind code drawer toggle
      const codePanel = section.querySelector('#' + comp.id + '-code');
      const toggleBtn = section.querySelector(`[data-toggle-code="${comp.id}"]`);
      toggleBtn.addEventListener('click', () => {
        const willOpen = codePanel.hidden;
        codePanel.hidden = !willOpen;
        toggleBtn.textContent = willOpen ? 'Tutup Kode' : 'Lihat HTML/CSS';
      });

      // Bind code tab switching (HTML / CSS)
      let currentTab = 'html';
      const tabBtns = codePanel.querySelectorAll('[data-code-tab]');
      const views = codePanel.querySelectorAll('[data-code-view]');
      tabBtns.forEach((tb) => {
        tb.addEventListener('click', () => {
          currentTab = tb.getAttribute('data-code-tab');
          tabBtns.forEach((b) => b.classList.toggle('active', b === tb));
          views.forEach((v) => {
            v.hidden = v.getAttribute('data-code-view') !== currentTab;
          });
        });
      });

      // Bind Copy HTML button
      section.querySelector(`[data-copy-code="${comp.id}"]`).addEventListener('click', () => {
        copyToClipboard(comp.html.trim()).then(() => showToast('Kode tersalin ✓'));
      });

      // Bind Copy inside code panel
      codePanel.querySelector('[data-copy-panel]').addEventListener('click', () => {
        const text = currentTab === 'html' ? comp.html.trim() : comp.css.trim();
        copyToClipboard(text).then(() => showToast('Kode tersalin ✓'));
      });

      fragment.appendChild(section);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);
  }

  function initStudioControls() {
    const htmlEl = document.documentElement;

    // Theme toggle
    const themeBtn = document.getElementById('toggleTheme');
    const themeLabel = document.getElementById('themeBtnLabel');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', next);
        if (themeLabel) themeLabel.textContent = next === 'dark' ? 'Mode Terang' : 'Mode Gelap';
      });
    }

    // Accent picker
    document.querySelectorAll('#accentPicker .accent-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('#accentPicker .accent-dot').forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');
        const accent = dot.getAttribute('data-accent');
        htmlEl.setAttribute('data-accent', accent);
        showToast('Warna aksen: ' + accent.toUpperCase());
      });
    });

    // Category chips
    document.querySelectorAll('#kitFilter .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#kitFilter .chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        activeGroup = chip.getAttribute('data-group');
        renderComponents();
      });
    });

    // Live Search
    const searchInput = document.getElementById('kitSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value;
        renderComponents();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('resetFilterBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeGroup = 'all';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('#kitFilter .chip').forEach((c) => {
          c.classList.toggle('active', c.getAttribute('data-group') === 'all');
        });
        renderComponents();
      });
    }
  }

  // Expose count for verification
  window.__UI_KIT_COMPONENTS__ = COMPONENTS;
  window.__UI_KIT_CATEGORIES__ = CATEGORIES;

  document.addEventListener('DOMContentLoaded', () => {
    initStudioControls();
    renderComponents();
  });
})();
