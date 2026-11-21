'use strict';

const STORE_CONFIG = {
  storeName: 'Kopi & Craft Nusantara',
  whatsappNumber: '6281234567890',
  freeShippingThreshold: 350000,
  defaultMayarUrl: 'https://mayar.id/demo-tokoku-checkout',
  storageCartKey: 'ddev_tokoku_demo_cart_v1',
  storageThemeKey: 'ddev_tokoku_demo_theme'
};

/**
 * Generates crisp layered SVG product artwork so the offline preview never depends on external images.
 */
function buildProductSvg(kind, variantIndex = 0) {
  const palettes = [
    ['#059669', '#064e3b', '#d1fae5'],
    ['#0284c7', '#0f172a', '#e0f2fe'],
    ['#b45309', '#451a03', '#fef3c7'],
    ['#be185d', '#500724', '#fce7f3']
  ];
  const [c1, c2, bg] = palettes[(kind.length + variantIndex) % palettes.length];
  const badgeAngle = variantIndex === 0 ? 'Utama' : variantIndex === 1 ? 'Detail' : 'Kemasan';

  const shapes = {
    slingbag: `
      <path d="M125 90 C125 50, 275 50, 275 90" fill="none" stroke="${c2}" stroke-width="10" stroke-linecap="round"/>
      <rect x="108" y="88" width="184" height="145" rx="22" fill="${c1}"/>
      <rect x="108" y="88" width="184" height="72" rx="22" fill="${c2}" opacity="0.28"/>
      <rect x="172" y="144" width="56" height="22" rx="11" fill="#ffffff" opacity="0.9"/>
      <circle cx="200" cy="155" r="5" fill="${c2}"/>
    `,
    totebag: `
      <path d="M150 96 C150 48, 250 48, 250 96" fill="none" stroke="${c2}" stroke-width="9" stroke-linecap="round"/>
      <path d="M115 96 L285 96 L270 238 C269 246 262 252 254 252 L146 252 C138 252 131 246 130 238 Z" fill="${c1}"/>
      <rect x="148" y="136" width="104" height="58" rx="10" fill="#ffffff" opacity="0.22"/>
      <line x1="164" y1="165" x2="236" y2="165" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    `,
    tws: `
      <rect x="130" y="92" width="140" height="132" rx="44" fill="${c2}"/>
      <rect x="130" y="92" width="140" height="58" rx="34" fill="${c1}"/>
      <line x1="130" y1="146" x2="270" y2="146" stroke="#ffffff" stroke-width="3" opacity="0.5"/>
      <circle cx="200" cy="172" r="7" fill="#34d399"/>
      <circle cx="164" cy="118" r="14" fill="#ffffff" opacity="0.9"/>
      <circle cx="236" cy="118" r="14" fill="#ffffff" opacity="0.9"/>
    `,
    powerbank: `
      <rect x="136" y="64" width="128" height="176" rx="22" fill="${c2}"/>
      <rect x="148" y="76" width="104" height="152" rx="14" fill="${c1}"/>
      <rect x="166" y="96" width="68" height="36" rx="8" fill="#0f172a"/>
      <text x="200" y="120" text-anchor="middle" fill="#34d399" font-size="16" font-weight="800" font-family="sans-serif">100%</text>
      <path d="M204 150 L188 176 L202 176 L196 198 L216 170 L201 170 Z" fill="#fef3c7"/>
    `,
    lamp: `
      <rect x="152" y="218" width="96" height="16" rx="8" fill="${c2}"/>
      <path d="M200 218 L200 130 L248 92" fill="none" stroke="${c2}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="218,74 282,102 258,128 206,96" fill="${c1}"/>
      <polygon points="222,104 274,124 252,188 188,162" fill="#fde68a" opacity="0.45"/>
    `,
    coffee: `
      <path d="M138 72 L262 72 L274 236 C274 244 268 250 260 250 L140 250 C132 250 126 244 126 236 Z" fill="${c2}"/>
      <rect x="148" y="112" width="104" height="86" rx="12" fill="#ffffff"/>
      <circle cx="200" cy="144" r="20" fill="${c1}"/>
      <path d="M194 130 C205 138, 195 150, 206 158" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="166" y="174" width="68" height="10" rx="5" fill="${c2}" opacity="0.35"/>
    `,
    honey: `
      <rect x="158" y="68" width="84" height="26" rx="8" fill="${c2}"/>
      <rect x="142" y="94" width="116" height="148" rx="28" fill="#f59e0b"/>
      <rect x="142" y="94" width="116" height="44" rx="18" fill="#fbbf24"/>
      <rect x="154" y="138" width="92" height="64" rx="10" fill="#ffffff" opacity="0.92"/>
      <circle cx="200" cy="170" r="16" fill="${c1}"/>
    `,
    dripper: `
      <polygon points="132,88 268,88 232,162 168,162" fill="${c1}"/>
      <rect x="152" y="162" width="96" height="14" rx="7" fill="${c2}"/>
      <path d="M156 176 L244 176 L236 242 C235 248 229 252 223 252 L177 252 C171 252 165 248 164 242 Z" fill="${c2}" opacity="0.85"/>
      <path d="M244 190 C270 190, 270 228, 240 228" fill="none" stroke="${c2}" stroke-width="9" stroke-linecap="round"/>
    `,
    serum: `
      <rect x="188" y="54" width="24" height="32" rx="10" fill="${c2}"/>
      <rect x="174" y="84" width="52" height="22" rx="6" fill="#0f172a"/>
      <rect x="152" y="106" width="96" height="140" rx="22" fill="${c1}"/>
      <rect x="166" y="138" width="68" height="78" rx="10" fill="#ffffff" opacity="0.9"/>
      <path d="M200 154 C212 170, 212 190, 200 194 C188 190, 188 170, 200 154 Z" fill="${c1}"/>
    `,
    herbal: `
      <rect x="122" y="114" width="156" height="118" rx="24" fill="${c1}"/>
      <rect x="134" y="92" width="132" height="28" rx="10" fill="${c2}"/>
      <circle cx="200" cy="174" r="32" fill="#ffffff" opacity="0.92"/>
      <path d="M188 184 C188 162, 214 154, 216 154 C216 176, 204 188, 188 184 Z" fill="${c1}"/>
    `
  };

  return `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustrasi produk ${kind}">
      <defs>
        <linearGradient id="bg-${kind}-${variantIndex}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg}"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg-${kind}-${variantIndex})"/>
      <circle cx="330" cy="60" r="70" fill="${c1}" opacity="0.08"/>
      <circle cx="70" cy="250" r="85" fill="${c2}" opacity="0.07"/>
      <ellipse cx="200" cy="254" rx="88" ry="12" fill="#0f172a" opacity="0.12"/>
      ${shapes[kind] || shapes.coffee}
      ${variantIndex > 0 ? `<rect x="292" y="254" width="90" height="26" rx="13" fill="#0f172a" opacity="0.72"/><text x="337" y="271" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700" font-family="sans-serif">${badgeAngle}</text>` : ''}
    </svg>
  `;
}

const PRODUCTS = [
  {
    id: 'p1',
    title: 'Tas Selempang Kulit Vegan Kanvas Anti-Air',
    category: 'Fashion & Tas',
    price: 185000,
    oldPrice: 275000,
    stock: 16,
    sold: 142,
    rating: '4.9',
    variants: ['Hitam Matte', 'Cokelat Kopi', 'Olive Army'],
    art: 'slingbag',
    mayarUrl: 'https://mayar.id/demo/tas-selempang-kanvas',
    desc: 'Tas selempang harian berbahan kanvas water-repellent dengan aksen kulit vegan premium. Muat tablet 10 inch, dompet, powerbank, dan kunci dengan kompartemen terpisah.',
    specs: [
      ['Material', 'Kanvas Waxed + Vegan Leather'],
      ['Dimensi', '26 x 19 x 8 cm'],
      ['Berat', '380 gram'],
      ['Garansi', 'Jahitan & Resleting 6 Bulan']
    ],
    reviews: [
      { user: 'Raka Pratama', rating: '5.0', text: 'Jahitan rapi banget, kena gerimis air langsung turun gak tembus.' },
      { user: 'Dina Maharani', rating: '4.9', text: 'Warna Olive Army-nya cakep buat dipakai kerja atau ngopi.' }
    ]
  },
  {
    id: 'p2',
    title: 'Tote Bag Kerja Laptop 14 Inch Heavy Canvas',
    category: 'Fashion & Tas',
    price: 149000,
    oldPrice: 210000,
    stock: 22,
    sold: 98,
    rating: '4.8',
    variants: ['Cream Natural', 'Charcoal', 'Emerald'],
    art: 'totebag',
    mayarUrl: 'https://mayar.id/demo/tote-bag-laptop',
    desc: 'Tote bag kokoh dengan slot busa khusus laptop hingga 14 inch dan tali bahu tebal. Cocok untuk mahasiswa, pekerja remote, maupun aktivitas kasual.',
    specs: [
      ['Material', 'Marsoto Heavy Canvas 16oz'],
      ['Kapasitas', 'Laptop s/d 14 inch + Tumblr'],
      ['Penutup', 'Resleting YKK Full'],
      ['Berat', '450 gram']
    ],
    reviews: [
      { user: 'Nadia Putri', rating: '5.0', text: 'Bahan tebal berdiri tegak, slot laptopnya aman banget.' }
    ]
  },
  {
    id: 'p3',
    title: 'Earbuds TWS Nusantara ANC Pro Bluetooth 5.3',
    category: 'Elektronik',
    price: 249000,
    oldPrice: 399000,
    stock: 7,
    sold: 215,
    rating: '4.9',
    variants: ['Midnight Black', 'Forest Green'],
    art: 'tws',
    mayarUrl: 'https://mayar.id/demo/tws-anc-pro',
    desc: 'Nikmati audio jernih dengan Active Noise Cancellation hingga 35dB dan total daya tahan baterai 32 jam bersama charging case USB-C fast charging.',
    specs: [
      ['Bluetooth', 'v5.3 Low Latency 45ms'],
      ['Baterai', '7 jam + 25 jam Case'],
      ['Ketahanan', 'IPX5 Tahan Keringat'],
      ['Garansi', 'Resmi 12 Bulan Tukar Baru']
    ],
    reviews: [
      { user: 'Bagus Wijaya', rating: '5.0', text: 'ANC berasa banget di KRL, bass pas gak bikin pusing.' },
      { user: 'Fajar Ramadhan', rating: '4.8', text: 'Mic-nya jelas buat meeting Zoom di luar ruangan.' }
    ]
  },
  {
    id: 'p4',
    title: 'Powerbank Mini 10.000mAh Fast Charge 22.5W LED',
    category: 'Elektronik',
    price: 175000,
    oldPrice: 245000,
    stock: 19,
    sold: 164,
    rating: '4.8',
    variants: ['Hitam LED', 'Putih Ceramic'],
    art: 'powerbank',
    mayarUrl: 'https://mayar.id/demo/powerbank-10000mah',
    desc: 'Powerbank ringkas seukuran kartu dengan layar digital persentase baterai dan dukungan PD 20W + QC 22.5W. Aman dibawa masuk kabin pesawat.',
    specs: [
      ['Kapasitas', '10.000mAh Real Capacity'],
      ['Output', 'USB-C PD 20W & USB-A 22.5W'],
      ['Fitur', 'Flight Safe & Multi-Protect'],
      ['Berat', '195 gram']
    ],
    reviews: [
      { user: 'Ilham Saputra', rating: '4.9', text: 'Kecil muat di saku celana, ngecas iPhone ngebut.' }
    ]
  },
  {
    id: 'p5',
    title: 'Lampu Meja Kerja LED Minimalis Eye-Care Touch',
    category: 'Elektronik',
    price: 159000,
    oldPrice: 229000,
    stock: 11,
    sold: 76,
    rating: '4.9',
    variants: ['Warm & Cool 3 Mode', 'RGB Ambience'],
    art: 'lamp',
    mayarUrl: 'https://mayar.id/demo/lampu-meja-led',
    desc: 'Lampu belajar dan kerja bebas kedip (flicker-free) dengan 3 suhu warna (3000K-6000K) dan dimmer sentuh stepless untuk melindungi mata saat lembur.',
    specs: [
      ['Daya', '8W USB-C Rechargeable'],
      ['Mode Cahaya', 'Warm, Natural, Cool White'],
      ['CRI', 'Ra > 90 Akurasi Warna Tinggi'],
      ['Material', 'Aluminium Alloy + ABS']
    ],
    reviews: [
      { user: 'Sinta Dewi', rating: '5.0', text: 'Meja kerja jadi estetik dan mata gak gampang capek.' }
    ]
  },
  {
    id: 'p6',
    title: 'Kopi Arabika Gayo Aceh Single Origin 250g',
    category: 'Kopi & Kuliner',
    price: 89000,
    oldPrice: 120000,
    stock: 34,
    sold: 389,
    rating: '5.0',
    variants: ['Biji Utuh (Whole Bean)', 'Giling Halus', 'Giling Sedang V60'],
    art: 'coffee',
    mayarUrl: 'https://mayar.id/demo/arabika-gayo-250g',
    desc: 'Dipetik dari ketinggian 1.500 mdpl Dataran Tinggi Gayo, disangrai fresh setiap minggu profil Medium Roast dengan notes dark chocolate, brown sugar, dan rempah hangat.',
    specs: [
      ['Origin', 'Takengon, Aceh Tengah'],
      ['Proses', 'Semi-Washed (Giling Basah)'],
      ['Roast Profile', 'Medium Roast (Fresh Batch)'],
      ['Kemasan', 'Pouch Valve + Zipper 250g']
    ],
    reviews: [
      { user: 'Hendro Susilo', rating: '5.0', text: 'Aroma wanginya langsung keluar pas dibuka. Body tebel mantap!' },
      { user: 'Maya Kusuma', rating: '5.0', text: 'Langganan terus buat seduh V60 pagi hari.' }
    ]
  },
  {
    id: 'p7',
    title: 'Madu Hutan Multiflora Murni Kalimantan 500ml',
    category: 'Kopi & Kuliner',
    price: 115000,
    oldPrice: 155000,
    stock: 25,
    sold: 204,
    rating: '4.9',
    variants: ['Botol Kaca 500ml', 'Paket Hemat 2 Botol'],
    art: 'honey',
    mayarUrl: 'https://mayar.id/demo/madu-hutan-500ml',
    desc: 'Madu hutan mentah (raw honey) tanpa pemanasan dan tanpa campuran gula. Kaya enzim alami untuk menjaga imunitas harian dan campuran minuman sehat.',
    specs: [
      ['Volume', '500 ml / 680 gram'],
      ['Asal Panen', 'Hutan Pedalaman Kalimantan'],
      ['Kemasan', 'Botol Kaca Segel + Bubble'],
      ['Izin Edar', 'P-IRT & Uji Lab Kemurnian']
    ],
    reviews: [
      { user: 'Dewi Lestari', rating: '4.9', text: 'Rasa khas madu hutan asli, pengiriman aman pakai botol kaca tebal.' }
    ]
  },
  {
    id: 'p8',
    title: 'Set Alat Seduh Kopi V60 Keramik & Server Kaca',
    category: 'Kopi & Kuliner',
    price: 165000,
    oldPrice: 235000,
    stock: 9,
    sold: 88,
    rating: '4.9',
    variants: ['Emerald Glaze', 'Matte Slate'],
    art: 'dripper',
    mayarUrl: 'https://mayar.id/demo/v60-keramik-set',
    desc: 'Paket lengkap home brewer: Dripper V60 ukuran 02 berbahan keramik penahan panas, server kaca borosilikat 500ml, dan bonus 40 lembar filter kertas.',
    specs: [
      ['Kapasitas', 'Server 500 ml (1-4 Cups)'],
      ['Material', 'Keramik Porcelain + Borosilicate'],
      ['Kelengkapan', 'Dripper + Server + 40 Filter'],
      ['Tahan Suhu', 'Hingga 150°C']
    ],
    reviews: [
      { user: 'Arif Nugroho', rating: '5.0', text: 'Ekstraksi stabil dan warnanya estetik banget di meja bar.' }
    ]
  },
  {
    id: 'p9',
    title: 'Serum Wajah Niacinamide 10% + Centella Asiatica',
    category: 'Skincare & Herbal',
    price: 98000,
    oldPrice: 145000,
    stock: 28,
    sold: 312,
    rating: '4.9',
    variants: ['Botol 20ml', 'Botol 30ml Jumbo'],
    art: 'serum',
    mayarUrl: 'https://mayar.id/demo/serum-niacinamide',
    desc: 'Formula lembut tanpa alkohol dan pewangi sintetis untuk membantu mencerahkan kulit kusam, menenangkan kemerahan, serta menjaga skin barrier tetap lembap.',
    specs: [
      ['Kandungan Utama', 'Niacinamide 10%, Centella, B5'],
      ['Jenis Kulit', 'Semua Jenis (Sensitif Aman)'],
      ['Registrasi', 'BPOM Certified & Halal'],
      ['Tekstur', 'Ringan Cepat Meresap']
    ],
    reviews: [
      { user: 'Tari Oktavia', rating: '5.0', text: 'Gak lengket sama sekali, bekas jerawat memudar dalam 3 minggu.' }
    ]
  },
  {
    id: 'p10',
    title: 'Paket Aromaterapi Balm & Sabun Herbal Sereh Alami',
    category: 'Skincare & Herbal',
    price: 79000,
    oldPrice: 115000,
    stock: 15,
    sold: 129,
    rating: '4.8',
    variants: ['Sereh & Lavender', 'Eucalyptus & Jahe'],
    art: 'herbal',
    mayarUrl: 'https://mayar.id/demo/paket-herbal-balm',
    desc: 'Set relaksasi alami berisi 1 balsem aromaterapi minyak esensial murni dan 2 batang sabun herbal cold-process. Efektif meredakan pegal dan menyegarkan kulit.',
    specs: [
      ['Isi Paket', '1 Balm 30g + 2 Sabun 80g'],
      ['Komposisi', '100% Minyak Atsiri Lokal'],
      ['Bebas Bahan', 'Tanpa SLS & Paraben'],
      ['Kemasan', 'Gift Box Kraft Ramah Lingkungan']
    ],
    reviews: [
      { user: 'Rina Marlina', rating: '4.9', text: 'Wanginya menenangkan banget, cocok juga buat kado.' }
    ]
  }
];

const state = {
  category: 'Semua',
  search: '',
  sort: 'terbaru',
  cart: loadCart(),
  activeProductId: null,
  activeVariant: '',
  activeQty: 1,
  activeTab: 'desc',
  activeThumb: 0
};

function loadCart() {
  try {
    const raw = localStorage.getItem(STORE_CONFIG.storageCartKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORE_CONFIG.storageCartKey, JSON.stringify(state.cart));
  } catch {
    // Ignore storage quota errors in restricted browsers
  }
}

function formatRupiah(amount) {
  return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
}

function calcDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function showToast(message) {
  const toastEl = document.getElementById('toast');
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

function getFilteredProducts() {
  const query = state.search.trim().toLowerCase();
  const list = PRODUCTS.filter((item) => {
    const matchCat = state.category === 'Semua' || item.category === state.category;
    const matchSearch = !query ||
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  if (state.sort === 'termurah') list.sort((a, b) => a.price - b.price);
  else if (state.sort === 'termahal') list.sort((a, b) => b.price - a.price);
  else if (state.sort === 'diskon') list.sort((a, b) => calcDiscount(b.price, b.oldPrice) - calcDiscount(a.price, a.oldPrice));
  return list;
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  const countEl = document.getElementById('resultCount');
  const items = getFilteredProducts();

  countEl.textContent = `Menampilkan ${items.length} produk`;

  if (!items.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>Produk tidak ditemukan</h3>
        <p>Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
        <button type="button" class="btn-reset" data-reset-filter="1">Tampilkan Semua Produk</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map((p) => {
    const disc = calcDiscount(p.price, p.oldPrice);
    const lowStock = p.stock <= 10;
    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-thumb" data-open-detail="${p.id}">
          ${buildProductSvg(p.art, 0)}
          ${disc > 0 ? `<span class="badge-discount">-${disc}%</span>` : ''}
          <span class="badge-mayar">Mayar / WA</span>
        </div>
        <div class="product-body">
          <div class="product-meta-row">
            <span class="product-cat">${p.category}</span>
            <span class="product-stock ${lowStock ? 'low' : ''}">${lowStock ? `Sisa ${p.stock}!` : `Stok: ${p.stock}`}</span>
          </div>
          <h3 class="product-title" data-open-detail="${p.id}">${p.title}</h3>
          <div class="product-rating">
            <span class="stars">&#9733; ${p.rating}</span>
            <span>&bull; Terjual ${p.sold}</span>
          </div>
          <div class="product-pricing">
            <span class="price-now">${formatRupiah(p.price)}</span>
            ${p.oldPrice > p.price ? `<span class="price-old">${formatRupiah(p.oldPrice)}</span>` : ''}
          </div>
          <div class="product-actions">
            <button type="button" class="btn-detail" data-open-detail="${p.id}">Detail / Varian</button>
            <button type="button" class="btn-add-cart" data-quick-add="${p.id}">+ Keranjang</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function syncCategoryButtons() {
  document.querySelectorAll('#categoryPills .cat-pill, #headerNavList .nav-link[data-cat]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.cat === state.category);
  });
}

function setCategory(cat) {
  state.category = cat;
  syncCategoryButtons();
  renderProducts();
}

function openProductModal(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  state.activeProductId = product.id;
  state.activeVariant = product.variants[0] || 'Standar';
  state.activeQty = 1;
  state.activeTab = 'desc';
  state.activeThumb = 0;

  const disc = calcDiscount(product.price, product.oldPrice);
  document.getElementById('detailCategory').textContent = product.category;
  document.getElementById('detailStock').textContent = `Stok: ${product.stock} unit`;
  document.getElementById('detailTitle').textContent = product.title;
  document.getElementById('detailRating').innerHTML = `<span class="stars">&#9733; ${product.rating}</span> <span>&bull; ${product.sold} terjual &bull; ${product.variants.length} varian</span>`;
  document.getElementById('detailPrice').textContent = formatRupiah(product.price);
  document.getElementById('detailOldPrice').textContent = product.oldPrice > product.price ? formatRupiah(product.oldPrice) : '';
  document.getElementById('detailDiscount').textContent = disc > 0 ? `Hemat ${disc}%` : '';
  document.getElementById('detailDiscount').style.display = disc > 0 ? 'inline-block' : 'none';
  document.getElementById('detailQtyValue').textContent = '1';

  renderModalGallery(product);
  renderModalVariants(product);
  renderModalTab(product);

  const modal = document.getElementById('productModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function renderModalGallery(product) {
  document.getElementById('detailMainArt').innerHTML = buildProductSvg(product.art, state.activeThumb);
  document.getElementById('detailThumbs').innerHTML = [0, 1, 2].map((idx) => `
    <button type="button" class="thumb-btn ${state.activeThumb === idx ? 'active' : ''}" data-thumb-idx="${idx}" aria-label="Tampilan produk ${idx + 1}">
      ${buildProductSvg(product.art, idx)}
    </button>
  `).join('');
}

function renderModalVariants(product) {
  document.getElementById('selectedVariantLabel').textContent = state.activeVariant;
  document.getElementById('detailVariants').innerHTML = product.variants.map((v) => `
    <button type="button" class="variant-chip ${v === state.activeVariant ? 'active' : ''}" data-variant="${v}">${v}</button>
  `).join('');
}

function renderModalTab(product) {
  document.querySelectorAll('.detail-tabs .tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === state.activeTab);
  });
  const container = document.getElementById('detailTabContent');
  if (state.activeTab === 'desc') {
    container.innerHTML = `<p>${product.desc}</p>`;
  } else if (state.activeTab === 'spec') {
    container.innerHTML = `<ul class="spec-list">${product.specs.map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`).join('')}</ul>`;
  } else {
    container.innerHTML = product.reviews.map((r) => `
      <div class="review-item">
        <div class="review-head"><span>${r.user}</span><span class="stars">&#9733; ${r.rating}</span></div>
        <p>${r.text}</p>
      </div>
    `).join('');
  }
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function addToCart(productId, variant, qty = 1) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  const chosenVariant = variant || product.variants[0] || 'Standar';
  const existing = state.cart.find((item) => item.id === product.id && item.variant === chosenVariant);
  if (existing) {
    existing.qty = Math.min(product.stock, existing.qty + qty);
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      art: product.art,
      variant: chosenVariant,
      qty: Math.min(product.stock, qty),
      mayarUrl: product.mayarUrl
    });
  }
  saveCart();
  renderCart();
  showToast(`Ditambahkan: ${product.title} (${chosenVariant})`);
}

function updateCartQty(index, delta) {
  const item = state.cart[index];
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart.splice(index, 1);
  saveCart();
  renderCart();
}

function getShippingInfo() {
  const val = document.getElementById('shippingSelect').value || 'JNE Reguler|15000';
  const [courier, feeStr] = val.split('|');
  return { courier, baseFee: Number(feeStr || 0) };
}

function buildWhatsAppMessage(items, shippingInfo, subtotal, shippingCost, total) {
  const buyerName = document.getElementById('buyerName').value.trim() || '(Belum diisi)';
  const buyerPhone = document.getElementById('buyerPhone').value.trim() || '-';
  const buyerAddress = document.getElementById('buyerAddress').value.trim() || '(Belum diisi)';

  const lines = items.map((it, idx) =>
    `${idx + 1}. ${it.title}\n   Varian: ${it.variant} | Qty: ${it.qty} x ${formatRupiah(it.price)} = ${formatRupiah(it.price * it.qty)}`
  ).join('\n');

  return [
    `Halo Admin *${STORE_CONFIG.storeName}*, saya ingin memesan:`,
    '',
    lines,
    '',
    `Subtotal: ${formatRupiah(subtotal)}`,
    `Kurir: ${shippingInfo.courier} (${shippingCost === 0 ? 'GRATIS ONGKIR' : formatRupiah(shippingCost)})`,
    `*Total Bayar: ${formatRupiah(total)}*`,
    '',
    `Nama: ${buyerName}`,
    `No. WA: ${buyerPhone}`,
    `Alamat: ${buyerAddress}`
  ].join('\n');
}

function renderCart() {
  const totalCount = state.cart.reduce((sum, it) => sum + it.qty, 0);
  const subtotal = state.cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shippingInfo = getShippingInfo();
  const isFreeShipping = subtotal >= STORE_CONFIG.freeShippingThreshold && subtotal > 0;
  const shippingCost = state.cart.length ? (isFreeShipping ? 0 : shippingInfo.baseFee) : 0;
  const grandTotal = subtotal + shippingCost;

  document.getElementById('cartBadge').textContent = totalCount;
  document.getElementById('drawerCount').textContent = totalCount;
  document.getElementById('mobileBarCount').textContent = `${totalCount} item di keranjang`;
  document.getElementById('mobileBarTotal').textContent = formatRupiah(grandTotal);

  const listEl = document.getElementById('cartItemsList');
  const formSec = document.getElementById('checkoutFormSection');

  if (!state.cart.length) {
    listEl.innerHTML = `
      <div class="cart-empty">
        <p style="font-size:15px; font-weight:700; margin-bottom:4px;">Keranjang masih kosong</p>
        <p style="font-size:13px;">Pilih produk favorit Anda untuk mencoba simulasi checkout WhatsApp &amp; Mayar.</p>
      </div>
    `;
    formSec.style.display = 'none';
  } else {
    formSec.style.display = 'flex';
    listEl.innerHTML = state.cart.map((it, idx) => `
      <div class="cart-item">
        <div class="cart-item-thumb">${buildProductSvg(it.art, 0)}</div>
        <div>
          <div class="cart-item-title">${it.title}</div>
          <div class="cart-item-variant">Varian: ${it.variant}</div>
          <div class="cart-item-bottom">
            <span class="cart-item-price">${formatRupiah(it.price * it.qty)}</span>
            <div style="display:flex; align-items:center;">
              <div class="cart-mini-qty">
                <button type="button" data-cart-minus="${idx}" aria-label="Kurangi">&minus;</button>
                <span>${it.qty}</span>
                <button type="button" data-cart-plus="${idx}" aria-label="Tambah">+</button>
              </div>
              <button type="button" class="cart-remove" data-cart-remove="${idx}">Hapus</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  document.getElementById('cartSubtotal').textContent = formatRupiah(subtotal);
  document.getElementById('cartShipping').textContent = state.cart.length
    ? (isFreeShipping ? 'GRATIS (Min. 350rb)' : formatRupiah(shippingCost))
    : 'Rp 0';
  document.getElementById('cartTotal').textContent = formatRupiah(grandTotal);

  const previewText = state.cart.length
    ? buildWhatsAppMessage(state.cart, shippingInfo, subtotal, shippingCost, grandTotal)
    : 'Tambahkan produk untuk melihat format pesan WhatsApp otomatis.';
  document.getElementById('waPreviewText').textContent = previewText;
}

function openCartDrawer() {
  renderCart();
  const drawer = document.getElementById('cartDrawer');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeIconSun').style.display = theme === 'dark' ? 'none' : 'block';
  document.getElementById('themeIconMoon').style.display = theme === 'dark' ? 'block' : 'none';
  try {
    localStorage.setItem(STORE_CONFIG.storageThemeKey, theme);
  } catch {
    // Ignore storage errors
  }
}

function startFlashCountdown() {
  let remaining = 5 * 3600 + 42 * 60 + 18;
  const el = document.getElementById('flashCountdown');
  setInterval(() => {
    remaining = remaining > 0 ? remaining - 1 : 21600;
    const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
    const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

function bindEvents() {
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');

  searchInput.addEventListener('input', (e) => {
    state.search = e.target.value;
    searchClear.classList.toggle('visible', state.search.length > 0);
    renderProducts();
  });

  searchClear.addEventListener('click', () => {
    state.search = '';
    searchInput.value = '';
    searchClear.classList.remove('visible');
    renderProducts();
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderProducts();
  });

  document.getElementById('categoryPills').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (btn) setCategory(btn.dataset.cat);
  });

  document.getElementById('headerNavList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (btn) {
      setCategory(btn.dataset.cat);
      document.getElementById('katalog').scrollIntoView({ behavior: 'smooth' });
    }
  });

  document.querySelectorAll('[data-footer-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setCategory(btn.dataset.footerCat);
      document.getElementById('katalog').scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.getElementById('productGrid').addEventListener('click', (e) => {
    const resetTrigger = e.target.closest('[data-reset-filter]');
    if (resetTrigger) {
      state.category = 'Semua';
      state.search = '';
      document.getElementById('searchInput').value = '';
      document.getElementById('searchClear').classList.remove('visible');
      syncCategoryButtons();
      renderProducts();
      return;
    }
    const detailTrigger = e.target.closest('[data-open-detail]');
    if (detailTrigger) {
      openProductModal(detailTrigger.dataset.openDetail);
      return;
    }
    const addTrigger = e.target.closest('[data-quick-add]');
    if (addTrigger) {
      addToCart(addTrigger.dataset.quickAdd);
    }
  });

  // Modal controls
  document.getElementById('closeModalBtn').addEventListener('click', closeProductModal);
  document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target.id === 'productModal') closeProductModal();
  });

  document.getElementById('detailThumbs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-thumb-idx]');
    if (!btn) return;
    state.activeThumb = Number(btn.dataset.thumbIdx);
    const product = PRODUCTS.find((p) => p.id === state.activeProductId);
    if (product) renderModalGallery(product);
  });

  document.getElementById('detailVariants').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-variant]');
    if (!btn) return;
    state.activeVariant = btn.dataset.variant;
    const product = PRODUCTS.find((p) => p.id === state.activeProductId);
    if (product) renderModalVariants(product);
  });

  document.getElementById('detailQtyMinus').addEventListener('click', () => {
    if (state.activeQty > 1) {
      state.activeQty -= 1;
      document.getElementById('detailQtyValue').textContent = state.activeQty;
    }
  });

  document.getElementById('detailQtyPlus').addEventListener('click', () => {
    const product = PRODUCTS.find((p) => p.id === state.activeProductId);
    const maxStock = product ? product.stock : 99;
    if (state.activeQty < maxStock) {
      state.activeQty += 1;
      document.getElementById('detailQtyValue').textContent = state.activeQty;
    }
  });

  document.querySelectorAll('.detail-tabs .tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.dataset.tab;
      const product = PRODUCTS.find((p) => p.id === state.activeProductId);
      if (product) renderModalTab(product);
    });
  });

  document.getElementById('detailAddCartBtn').addEventListener('click', () => {
    addToCart(state.activeProductId, state.activeVariant, state.activeQty);
    closeProductModal();
    openCartDrawer();
  });

  document.getElementById('detailDirectWaBtn').addEventListener('click', () => {
    const product = PRODUCTS.find((p) => p.id === state.activeProductId);
    if (!product) return;
    const total = product.price * state.activeQty;
    const text = `Halo Admin *${STORE_CONFIG.storeName}*, saya mau pesan langsung:\n\n- ${product.title}\n- Varian: ${state.activeVariant}\n- Jumlah: ${state.activeQty}\n- Total: *${formatRupiah(total)}*\n\nMohon info ongkir & rekening/QRIS ya.`;
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Membuka WhatsApp untuk order langsung...');
  });

  document.getElementById('detailMayarBtn').addEventListener('click', () => {
    const product = PRODUCTS.find((p) => p.id === state.activeProductId);
    if (!product) return;
    showToast(`Simulasi Mayar Payment Link: ${product.mayarUrl}`);
  });

  // Cart drawer controls
  document.getElementById('cartBtn').addEventListener('click', openCartDrawer);
  document.getElementById('heroOpenCartBtn').addEventListener('click', openCartDrawer);
  document.getElementById('mobileCartBtn').addEventListener('click', openCartDrawer);
  document.getElementById('closeDrawerBtn').addEventListener('click', closeCartDrawer);
  document.getElementById('cartDrawer').addEventListener('click', (e) => {
    if (e.target.id === 'cartDrawer') closeCartDrawer();
  });

  document.getElementById('cartItemsList').addEventListener('click', (e) => {
    const minus = e.target.closest('[data-cart-minus]');
    if (minus) return updateCartQty(Number(minus.dataset.cartMinus), -1);
    const plus = e.target.closest('[data-cart-plus]');
    if (plus) return updateCartQty(Number(plus.dataset.cartPlus), 1);
    const remove = e.target.closest('[data-cart-remove]');
    if (remove) {
      state.cart.splice(Number(remove.dataset.cartRemove), 1);
      saveCart();
      renderCart();
    }
  });

  ['shippingSelect', 'buyerName', 'buyerPhone', 'buyerAddress'].forEach((id) => {
    document.getElementById(id).addEventListener('input', renderCart);
    document.getElementById(id).addEventListener('change', renderCart);
  });

  document.getElementById('copyWaBtn').addEventListener('click', async () => {
    const msg = document.getElementById('waPreviewText').textContent;
    if (!state.cart.length) return showToast('Keranjang masih kosong.');
    try {
      await navigator.clipboard.writeText(msg);
      showToast('Format pesan WhatsApp berhasil disalin!');
    } catch {
      showToast('Pesan siap dikirim lewat tombol WhatsApp.');
    }
  });

  document.getElementById('checkoutWaBtn').addEventListener('click', () => {
    if (!state.cart.length) return showToast('Tambahkan produk ke keranjang terlebih dahulu.');
    const msg = document.getElementById('waPreviewText').textContent;
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Mengarahkan ke WhatsApp Admin...');
  });

  document.getElementById('checkoutMayarBtn').addEventListener('click', () => {
    if (!state.cart.length) return showToast('Tambahkan produk ke keranjang terlebih dahulu.');
    const targetUrl = state.cart.length === 1 && state.cart[0].mayarUrl
      ? state.cart[0].mayarUrl
      : STORE_CONFIG.defaultMayarUrl;
    showToast(`Simulasi redirect Pembayaran Instan Mayar (${targetUrl})`);
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeCartDrawer();
    }
  });
}

function init() {
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem(STORE_CONFIG.storageThemeKey) || 'light';
  } catch {
    savedTheme = 'light';
  }
  applyTheme(savedTheme);
  bindEvents();
  renderProducts();
  renderCart();
  startFlashCountdown();
}

document.addEventListener('DOMContentLoaded', init);
