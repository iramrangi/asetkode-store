/* Landing Page UMKM — Ddev (Upgraded Interactive Edition)
   Semua data usaha dikelola dari config.js */
(function () {
  'use strict';
  const C = window.CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rupiah = (n) => `${C.mataUang || 'Rp'} ${Number(n || 0).toLocaleString('id-ID')}`;

  const ICONS = {
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5-6"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.2.3 1.6 1.2 2.7 2.5 2.7z"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4a1 1 0 0 0-.8-.4H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r=".5"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>'
  };

  /* ---------- Toast & Clipboard ---------- */
  let toastTimer = null;
  const showToast = (msg) => {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2400);
  };

  const copyText = async (text, okMsg) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(okMsg);
    } catch (_) {
      showToast(text);
    }
  };

  /* ---------- Warna, Judul & Data Binding ---------- */
  if (C.warnaUtama) {
    document.documentElement.style.setProperty('--primary', C.warnaUtama);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = C.warnaUtama;
  }
  if (C.namaUsaha) document.title = `${C.namaUsaha} — ${C.tagline || ''}`;
  $$('[data-bind]').forEach((el) => {
    const v = C[el.dataset.bind];
    if (v !== undefined && v !== '') el.textContent = v;
  });

  // Emphasize second half of tagline visually
  const heroTitle = $('#heroTitle');
  if (heroTitle && C.tagline) {
    const commaIdx = C.tagline.indexOf(',');
    if (commaIdx > 0 && commaIdx < C.tagline.length - 1) {
      const part1 = C.tagline.slice(0, commaIdx + 1);
      const part2 = C.tagline.slice(commaIdx + 1).trim();
      heroTitle.innerHTML = `${esc(part1)} <em>${esc(part2)}</em>`;
    }
  }
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Promo Bar ---------- */
  if (C.promo && C.promo.aktif) {
    $('#promoBar').hidden = false;
    $('#promoBadge').textContent = C.promo.badge || 'Promo';
    $('#promoText').textContent = C.promo.teks || '';
    if (C.promo.kode) {
      $('#promoCodeLabel').textContent = C.promo.kode;
      $('#copyPromoBtn').addEventListener('click', () => {
        copyText(C.promo.kode, `Kode promo ${C.promo.kode} disalin!`);
        const input = $('#promoInput');
        if (input && !input.value) input.value = C.promo.kode;
      });
    } else {
      $('#copyPromoBtn').hidden = true;
    }
  }

  /* ---------- Live Open / Closed Status ---------- */
  const parseMinutes = (hhmm) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || '').trim());
    return m ? Number(m[1]) * 60 + Number(m[2]) : null;
  };
  const updateOpenStatus = () => {
    const pill = $('#liveStatusPill');
    const txt = $('#liveStatusText');
    const note = $('#contactStatusNote');
    if (!pill || !txt) return;
    const openM = parseMinutes(C.jamOperasional && C.jamOperasional.buka);
    const closeM = parseMinutes(C.jamOperasional && C.jamOperasional.tutup);
    if (openM === null || closeM === null) {
      txt.textContent = 'Buka Hari Ini';
      return;
    }
    const now = new Date();
    const curM = now.getHours() * 60 + now.getMinutes();
    const isOpen = closeM > openM ? (curM >= openM && curM < closeM) : (curM >= openM || curM < closeM);
    pill.classList.toggle('closed', !isOpen);
    txt.textContent = isOpen
      ? `Buka Sekarang · Tutup ${C.jamOperasional.tutup}`
      : `Sedang Tutup · Buka ${C.jamOperasional.buka}`;
    if (note) note.textContent = isOpen ? 'Status kedai: Sedang Buka sekarang' : `Status kedai: Buka kembali pukul ${C.jamOperasional.buka}`;
  };
  updateOpenStatus();

  /* ---------- WhatsApp Helper ---------- */
  const waLink = (extra = '') => {
    const base = (C.pesanWhatsapp || 'Halo {nama},').replace('{nama}', C.namaUsaha || '');
    const msg = extra ? `${base}\n${extra}` : base;
    return `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
  };
  const bindWa = (root = document) => $$('.js-wa', root).forEach((a) => {
    a.href = waLink(a.dataset.waMsg || '');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Statistik (animasi hitung) ---------- */
  const stats = $('#stats');
  (C.statistik || []).forEach((s) => {
    const d = document.createElement('div');
    d.className = 'stat';
    d.innerHTML = `<strong data-target="${Number(s.angka)}" data-suffix="${esc(s.akhiran)}">0</strong><span>${esc(s.label)}</span>`;
    stats.appendChild(d);
  });
  const countUp = (el) => {
    const target = parseFloat(el.dataset.target);
    const dec = target % 1 ? 1 : 0;
    const t0 = performance.now();
    const dur = 1200;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + el.dataset.suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Keunggulan ---------- */
  $('#featureGrid').innerHTML = (C.keunggulan || []).map((f) => `
    <div class="feature reveal">
      <div class="feature-ico"><svg viewBox="0 0 24 24">${ICONS[f.ikon] || ICONS.star}</svg></div>
      <h3>${esc(f.judul)}</h3><p>${esc(f.teks)}</p>
    </div>`).join('');

  /* ---------- Tentang ---------- */
  if (C.tentang) {
    if (C.tentang.judul) $('#aboutTitle').textContent = C.tentang.judul;
    if (C.tentang.paragraf1) $('#aboutP1').textContent = C.tentang.paragraf1;
    if (C.tentang.paragraf2) $('#aboutP2').textContent = C.tentang.paragraf2;
    const poinList = $('#aboutPoints');
    if (poinList && Array.isArray(C.tentang.poin)) {
      poinList.innerHTML = C.tentang.poin.map((pt) => `
        <li><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS.check}</svg><span>${esc(pt)}</span></li>`).join('');
    }
  }

  /* ---------- Keranjang Pesanan + Menu Interaktif ---------- */
  const menu = C.menu || [];
  const selectedVariant = {};
  menu.forEach((m, idx) => {
    selectedVariant[idx] = Array.isArray(m.varian) && m.varian.length ? m.varian[0] : '';
  });

  const STORAGE_KEY = 'lp_umkm_cart_v1';
  let cart = [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) cart = JSON.parse(raw) || [];
  } catch (_) {
    cart = [];
  }
  let appliedPromo = false;

  const saveCart = () => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (_) {}
  };

  const cartItemKey = (idx, variant) => `${idx}::${variant || ''}`;
  const getItemQtyForMenu = (idx, variant) => {
    const found = cart.find((item) => item.key === cartItemKey(idx, variant));
    return found ? found.qty : 0;
  };
  const getTotalQtyForMenu = (idx) => cart.filter((it) => it.idx === idx).reduce((s, it) => s + it.qty, 0);

  const addToCart = (idx, delta = 1) => {
    const m = menu[idx];
    if (!m) return;
    const variant = selectedVariant[idx] || '';
    const key = cartItemKey(idx, variant);
    const existing = cart.find((it) => it.key === key);
    if (existing) {
      existing.qty += delta;
      if (existing.qty <= 0) cart = cart.filter((it) => it.key !== key);
    } else if (delta > 0) {
      cart.push({ key, idx, nama: m.nama, harga: Number(m.harga), variant, qty: delta });
      showToast(`${m.nama}${variant ? ` (${variant})` : ''} ditambahkan`);
    }
    saveCart();
    syncCartUI();
  };

  const updateCartKeyQty = (key, delta) => {
    const existing = cart.find((it) => it.key === key);
    if (!existing) return;
    existing.qty += delta;
    if (existing.qty <= 0) cart = cart.filter((it) => it.key !== key);
    saveCart();
    syncCartUI();
  };

  /* ---------- Filter, Pencarian & Render Menu ---------- */
  const filters = $('#filters');
  const grid = $('#menuGrid');
  const searchInput = $('#menuSearch');
  const menuEmpty = $('#menuEmpty');
  let activeCat = 'Semua';
  let searchQuery = '';

  const catCounts = { Semua: menu.length };
  menu.forEach((m) => {
    if (m.kategori) catCounts[m.kategori] = (catCounts[m.kategori] || 0) + 1;
  });
  const cats = Object.keys(catCounts);

  const renderFilterButtons = () => {
    filters.innerHTML = cats.map((c) => `
      <button type="button" class="filter-btn${c === activeCat ? ' active' : ''}" role="tab" aria-selected="${c === activeCat}" data-cat="${esc(c)}">
        ${esc(c)} <span>(${catCounts[c]})</span>
      </button>`).join('');
  };

  const renderMenu = () => {
    const q = searchQuery.trim().toLowerCase();
    const list = menu
      .map((m, idx) => ({ m, idx }))
      .filter(({ m }) => activeCat === 'Semua' || m.kategori === activeCat)
      .filter(({ m }) => !q || m.nama.toLowerCase().includes(q) || (m.deskripsi || '').toLowerCase().includes(q) || (m.kategori || '').toLowerCase().includes(q));

    menuEmpty.hidden = list.length > 0;
    grid.innerHTML = list.map(({ m, idx }) => {
      const curVar = selectedVariant[idx] || '';
      const qtyCur = getItemQtyForMenu(idx, curVar);
      const totalIdxQty = getTotalQtyForMenu(idx);
      const varHtml = Array.isArray(m.varian) && m.varian.length
        ? `<div class="variants">${m.varian.map((v) => `
            <button type="button" class="var-pill${v === curVar ? ' active' : ''}" data-idx="${idx}" data-var="${esc(v)}">${esc(v)}</button>`).join('')}</div>`
        : '';

      const actionHtml = qtyCur > 0
        ? `<div class="qty-stepper" aria-label="Jumlah ${esc(m.nama)}">
             <button type="button" class="qty-btn" data-act="dec" data-idx="${idx}" aria-label="Kurangi">−</button>
             <span class="qty-val">${qtyCur}</span>
             <button type="button" class="qty-btn" data-act="inc" data-idx="${idx}" aria-label="Tambah">+</button>
           </div>`
        : `<button type="button" class="btn btn-primary btn-sm" data-act="add" data-idx="${idx}">+ Pesan</button>`;

      return `
        <article class="menu-card${totalIdxQty > 0 ? ' in-cart' : ''}">
          <div class="menu-img">
            <img src="${esc(m.gambar)}" alt="${esc(m.nama)}" loading="lazy">
            ${m.label ? `<span class="badge">${esc(m.label)}</span>` : ''}
          </div>
          <div class="menu-body">
            <span class="menu-cat-tag">${esc(m.kategori || 'Menu')}</span>
            <h3>${esc(m.nama)}</h3>
            <p class="menu-desc">${esc(m.deskripsi)}</p>
            ${varHtml}
            <div class="menu-foot">
              <span class="price">${rupiah(m.harga)}</span>
              ${actionHtml}
            </div>
          </div>
        </article>`;
    }).join('');
  };

  filters.addEventListener('click', (e) => {
    const b = e.target.closest('.filter-btn');
    if (!b) return;
    activeCat = b.dataset.cat;
    renderFilterButtons();
    renderMenu();
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderMenu();
    });
  }

  $('#resetFilterBtn').addEventListener('click', () => {
    activeCat = 'Semua';
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    renderFilterButtons();
    renderMenu();
  });

  grid.addEventListener('click', (e) => {
    const varBtn = e.target.closest('.var-pill');
    if (varBtn) {
      selectedVariant[Number(varBtn.dataset.idx)] = varBtn.dataset.var;
      renderMenu();
      return;
    }
    const actBtn = e.target.closest('[data-act]');
    if (actBtn) {
      const idx = Number(actBtn.dataset.idx);
      const act = actBtn.dataset.act;
      addToCart(idx, act === 'dec' ? -1 : 1);
    }
  });

  /* ---------- Cart Drawer & Order Calculations ---------- */
  const calcTotals = () => {
    const totalItems = cart.reduce((s, it) => s + it.qty, 0);
    const subtotal = cart.reduce((s, it) => s + it.harga * it.qty, 0);
    let discount = 0;
    if (appliedPromo && C.promo && C.promo.aktif && subtotal >= (C.promo.minBelanja || 0)) {
      discount = Math.round(subtotal * ((C.promo.diskonPersen || 0) / 100));
    }
    return { totalItems, subtotal, discount, total: Math.max(0, subtotal - discount) };
  };

  const renderCartDrawer = () => {
    const itemsEl = $('#cartItems');
    const emptyEl = $('#cartEmptyState');
    const formEl = $('#orderForm');
    const footEl = $('#drawerFoot');
    const { subtotal, discount, total } = calcTotals();

    const isEmpty = cart.length === 0;
    emptyEl.hidden = !isEmpty;
    formEl.hidden = isEmpty;
    footEl.hidden = isEmpty;

    itemsEl.innerHTML = cart.map((it) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${esc(it.nama)}</h4>
          ${it.variant ? `<div class="cart-item-meta">Varian: ${esc(it.variant)}</div>` : ''}
          <div class="cart-item-price">${rupiah(it.harga * it.qty)}</div>
        </div>
        <div class="qty-stepper">
          <button type="button" class="qty-btn" data-cart-act="dec" data-key="${esc(it.key)}" aria-label="Kurangi">−</button>
          <span class="qty-val">${it.qty}</span>
          <button type="button" class="qty-btn" data-cart-act="inc" data-key="${esc(it.key)}" aria-label="Tambah">+</button>
        </div>
      </div>`).join('');

    $('#sumSubtotal').textContent = rupiah(subtotal);
    const discRow = $('#sumDiscountRow');
    if (discount > 0 && C.promo) {
      discRow.hidden = false;
      $('#sumDiscountLabel').textContent = `Diskon (${C.promo.kode})`;
      $('#sumDiscount').textContent = `-${rupiah(discount)}`;
    } else {
      discRow.hidden = true;
    }
    $('#sumTotal').textContent = rupiah(total);
  };

  const syncCartUI = () => {
    const { totalItems, total } = calcTotals();
    document.body.classList.toggle('has-cart', totalItems > 0);
    const navBadge = $('#navCartCount');
    navBadge.textContent = totalItems;
    navBadge.hidden = totalItems === 0;

    const bar = $('#cartBar');
    bar.hidden = totalItems === 0;
    $('#cartBarCount').textContent = `${totalItems} item dipilih`;
    $('#cartBarTotal').textContent = rupiah(total);

    renderMenu();
    renderCartDrawer();
  };

  const drawer = $('#cartDrawer');
  const backdrop = $('#cartBackdrop');
  const setDrawerOpen = (open) => {
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    backdrop.hidden = !open;
  };

  $('#openCartBtn').addEventListener('click', () => setDrawerOpen(true));
  $('#cartNavBtn').addEventListener('click', () => setDrawerOpen(true));
  $('#closeCartBtn').addEventListener('click', () => setDrawerOpen(false));
  backdrop.addEventListener('click', () => setDrawerOpen(false));
  $('#browseMenuBtn').addEventListener('click', () => setDrawerOpen(false));

  $('#cartItems').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cart-act]');
    if (!b) return;
    updateCartKeyQty(b.dataset.key, b.dataset.cartAct === 'dec' ? -1 : 1);
  });

  $('#clearCartBtn').addEventListener('click', () => {
    cart = [];
    appliedPromo = false;
    const fb = $('#promoFeedback');
    if (fb) fb.hidden = true;
    saveCart();
    syncCartUI();
    showToast('Keranjang dikosongkan');
  });

  $('#applyPromoBtn').addEventListener('click', () => {
    const code = ($('#promoInput').value || '').trim().toUpperCase();
    const fb = $('#promoFeedback');
    const { subtotal } = calcTotals();
    if (!C.promo || !C.promo.aktif || !C.promo.kode) {
      fb.textContent = 'Saat ini tidak ada kode promo aktif.';
      fb.classList.add('err');
      fb.hidden = false;
      return;
    }
    if (code !== String(C.promo.kode).toUpperCase()) {
      appliedPromo = false;
      fb.textContent = 'Kode promo tidak valid.';
      fb.classList.add('err');
      fb.hidden = false;
      syncCartUI();
      return;
    }
    if (subtotal < (C.promo.minBelanja || 0)) {
      appliedPromo = false;
      fb.textContent = `Minimal belanja ${rupiah(C.promo.minBelanja)} untuk promo ini.`;
      fb.classList.add('err');
      fb.hidden = false;
      syncCartUI();
      return;
    }
    appliedPromo = true;
    fb.textContent = `Promo ${C.promo.kode} diterapkan (-${C.promo.diskonPersen}%)`;
    fb.classList.remove('err');
    fb.hidden = false;
    syncCartUI();
  });

  const buildOrderMessage = () => {
    const { subtotal, discount, total } = calcTotals();
    const custName = ($('#custName').value || '').trim();
    const orderType = $('#orderType').value;
    const custNote = ($('#custNote').value || '').trim();

    const lines = [
      `*Pesanan Baru — ${C.namaUsaha || 'Toko'}*`,
      custName ? `Nama: ${custName}` : null,
      `Tipe: ${orderType}`,
      '',
      '*Daftar Menu:*',
      ...cart.map((it) => `• ${it.qty}x ${it.nama}${it.variant ? ` (${it.variant})` : ''} — ${rupiah(it.harga * it.qty)}`),
      '',
      `Subtotal: ${rupiah(subtotal)}`,
      discount > 0 && C.promo ? `Promo (${C.promo.kode}): -${rupiah(discount)}` : null,
      `*Total: ${rupiah(total)}*`,
      custNote ? `Catatan: ${custNote}` : null
    ].filter((l) => l !== null);

    return lines.join('\n');
  };

  $('#sendWaOrderBtn').addEventListener('click', () => {
    if (!cart.length) return;
    const msg = buildOrderMessage();
    const url = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
  });

  renderFilterButtons();
  syncCartUI();

  /* ---------- Testimoni ---------- */
  $('#testiGrid').innerHTML = (C.testimoni || []).map((t) => `
    <figure class="testi reveal">
      <span class="stars" aria-label="${t.bintang || 5} dari 5 bintang">${'★'.repeat(t.bintang || 5)}</span>
      <blockquote>“${esc(t.teks)}”</blockquote>
      <figcaption class="testi-person">
        <span class="avatar">${esc((t.nama || '?').charAt(0))}</span>
        <div><strong>${esc(t.nama)}</strong><small>${esc(t.peran)}</small></div>
      </figcaption>
    </figure>`).join('');

  /* ---------- FAQ ---------- */
  const faq = $('#faqList');
  faq.innerHTML = (C.faq || []).map((f, i) => `
    <div class="faq-item">
      <button class="faq-q" aria-expanded="false" aria-controls="faq-${i}">${esc(f.tanya)}
        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
      <div class="faq-a" id="faq-${i}"><div><p>${esc(f.jawab)}</p></div></div>
    </div>`).join('');
  faq.addEventListener('click', (e) => {
    const q = e.target.closest('.faq-q');
    if (!q) return;
    const item = q.parentElement;
    const open = !item.classList.contains('open');
    $$('.faq-item', faq).forEach((x) => {
      x.classList.remove('open');
      $('.faq-q', x).setAttribute('aria-expanded', 'false');
    });
    if (open) {
      item.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
    }
  });

  /* ---------- Kontak ---------- */
  const email = $('#emailLink');
  email.textContent = C.email || '';
  email.href = `mailto:${C.email || ''}`;
  if (C.mapsEmbed) $('#mapFrame').src = C.mapsEmbed;
  const openMaps = $('#openMapsBtn');
  if (openMaps) {
    openMaps.href = C.mapsLink || `https://maps.google.com/?q=${encodeURIComponent(C.alamat || C.namaUsaha || '')}`;
  }
  $('#copyAddressBtn').addEventListener('click', () => {
    if (C.alamat) copyText(C.alamat, 'Alamat berhasil disalin!');
  });

  const soc = [];
  if (C.instagram) soc.push(`<a href="https://instagram.com/${esc(C.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
  if (C.tiktok) soc.push(`<a href="https://tiktok.com/@${esc(C.tiktok)}" target="_blank" rel="noopener">TikTok</a>`);
  soc.push('<a href="#" class="js-wa">WhatsApp</a>');
  $('#socials').innerHTML = soc.join('');
  bindWa();

  /* ---------- Navbar, menu mobile, tema, keyboard ---------- */
  const nav = $('#navbar');
  const links = $('#navLinks');
  const toggle = $('#menuToggle');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  $$('a', links).forEach((a) => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setDrawerOpen(false);
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  const root = document.documentElement;
  const saved = localStorage.getItem('lp-theme');
  if (saved) root.dataset.theme = saved;
  else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
  $('#themeToggle').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('lp-theme', root.dataset.theme);
  });

  /* ---------- Animasi saat scroll ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('visible');
    io.unobserve(en.target);
  }), { threshold: 0.1 });
  $$('.reveal').forEach((el) => io.observe(el));

  const so = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) {
      $$('[data-target]', en.target).forEach(countUp);
      so.disconnect();
    }
  }));
  so.observe(stats);
})();
