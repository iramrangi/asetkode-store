(function () {
  'use strict';

  var DOC_GROUPS = [
    {
      id: 'memulai',
      title: 'Memulai',
      articles: [
        {
          id: 'pengenalan-arsitektur',
          title: 'Pengenalan & Arsitektur KitePay v2.4',
          method: '',
          readTime: '4 mnt baca',
          updated: '21 Nov 2026',
          lead: 'Pelajari fondasi arsitektur KitePay Gateway & CloudStack Worker v2.4 untuk memproses transaksi QRIS, Virtual Account, dan webhook real-time berlatensi rendah.',
          snippet: 'Arsitektur API RESTful, Base URL Sandbox vs Production, alur request 3-tahap, dan format respons JSON standar.',
          contentHtml: `
            <h2>Ringkasan Platform</h2>
            <p><strong>KitePay &amp; CloudStack v2.4</strong> adalah infrastruktur pembayaran modern berbasis REST API yang dirancang untuk aplikasi SaaS, marketplace, maupun POS di Indonesia. Seluruh komunikasi API menggunakan JSON over HTTPS (TLS 1.3) dengan dukungan idempotency key otomatis.</p>

            <div class="arch-grid">
              <div class="arch-card">
                <div class="arch-card-step">01 / CLIENT APP</div>
                <h4>Backend Merchant</h4>
                <p>Mengirim permintaan transaksi terautentikasi menggunakan Secret Key ke API Gateway.</p>
              </div>
              <div class="arch-card">
                <div class="arch-card-step">02 / EDGE GATEWAY</div>
                <h4>KitePay Core API</h4>
                <p>Memvalidasi payload, menerbitkan QRIS/VA dinamis, dan mencatat state ke ledger.</p>
              </div>
              <div class="arch-card">
                <div class="arch-card-step">03 / ASYNC WORKER</div>
                <h4>CloudStack Webhook</h4>
                <p>Mengirim notifikasi status pembayaran dengan signature HMAC-SHA256 &amp; retry otomatis.</p>
              </div>
            </div>

            <h2>Base URL &amp; Environment</h2>
            <p>Gunakan endpoint <strong>Sandbox</strong> selama fase pengembangan dan pengujian integrasi. Tidak ada pemotongan saldo nyata pada mode Sandbox.</p>

            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Environment</th>
                    <th>Base URL</th>
                    <th>Prefix API Key</th>
                    <th>Kegunaan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Sandbox</strong></td>
                    <td><code>https://sandbox.api.kitepay.id/v2</code></td>
                    <td><code>sk_test_...</code></td>
                    <td>Simulasi QRIS, VA, dan testing webhook lokal</td>
                  </tr>
                  <tr>
                    <td><strong>Production</strong></td>
                    <td><code>https://api.kitepay.id/v2</code></td>
                    <td><code>sk_live_...</code></td>
                    <td>Transaksi pembayaran riil dengan SLA 99.98%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="callout-info">
              <span class="callout-title">Informasi Kompatibilitas</span>
              Semua endpoint v2.4 menyertakan header <code>X-Request-Id</code> pada setiap respons. Simpan ID ini saat melaporkan kendala ke tim engineering support agar pelacakan log lebih cepat.
            </div>

            <h2>Format Standar Respons JSON</h2>
            <p>Setiap respons sukses maupun error mengikuti amplop JSON yang konsisten agar mudah diparsing oleh SDK maupun client HTTP kustom:</p>

            <pre><code class="language-json">{
  "status": "success",
  "request_id": "req_98f2a1c4b0e7",
  "timestamp": "2026-11-21T12:15:30+07:00",
  "data": {
    "service": "kitepay-core",
    "version": "2.4.1",
    "region": "ap-southeast-3"
  }
}</code></pre>

            <h3>Prasyarat Teknis</h3>
            <ul>
              <li>Node.js <code>&gt;= 18.x</code>, PHP <code>&gt;= 8.1</code>, atau client HTTP dengan dukungan TLS 1.2+.</li>
              <li>Server backend dengan URL HTTPS publik untuk menerima event webhook (atau gunakan tunnel saat lokal).</li>
              <li>Akun Merchant aktif di Dashboard CloudStack untuk memperoleh API Key dan Webhook Secret.</li>
            </ul>
          `
        },
        {
          id: 'instalasi-autentikasi',
          title: 'Instalasi SDK & Autentikasi API Key',
          method: 'GET',
          readTime: '5 mnt baca',
          updated: '21 Nov 2026',
          lead: 'Konfigurasi SDK resmi KitePay pada Node.js dan PHP, amankan kredensial di environment variable, serta verifikasi koneksi menggunakan endpoint whoami.',
          snippet: 'Instalasi npm/composer, konfigurasi Bearer Token, manajemen .env, dan endpoint GET /v2/auth/whoami.',
          contentHtml: `
            <h2>Instalasi Paket SDK</h2>
            <p>Anda dapat memakai SDK resmi untuk mempercepat integrasi atau langsung memanggil REST API dengan library HTTP pilihan Anda.</p>

            <h3>Node.js / TypeScript</h3>
            <pre><code class="language-bash">npm install @kitepay/node-sdk dotenv</code></pre>

            <h3>PHP (Composer)</h3>
            <pre><code class="language-bash">composer require kitepay/php-sdk:^2.4</code></pre>

            <h2>Konfigurasi Environment (.env)</h2>
            <p>Simpan seluruh kredensial sensitif di file <code>.env</code> pada root proyek server Anda:</p>

            <pre><code class="language-bash">KITEPAY_ENV=sandbox
KITEPAY_SECRET_KEY=sk_test_84d9f1a2c6e7b0391f2a4c
KITEPAY_WEBHOOK_SECRET=whsec_319c7e4b0a9d22f18a6c</code></pre>

            <div class="callout-warn">
              <span class="callout-title">Peringatan Keamanan</span>
              Jangan pernah menaruh <code>KITEPAY_SECRET_KEY</code> di kode frontend (React, Vue, Flutter, atau HTML statis) maupun melakukan commit file <code>.env</code> ke repositori Git publik.
            </div>

            <h2>Mekanisme Autentikasi Bearer</h2>
            <p>Setiap permintaan HTTP harus menyertakan header <code>Authorization</code> menggunakan skema Bearer Token:</p>

            <div class="endpoint-bar">
              <span class="http-badge get">GET</span>
              <span class="endpoint-url">https://sandbox.api.kitepay.id/v2/auth/whoami</span>
            </div>

            <pre><code class="language-bash">curl -X GET https://sandbox.api.kitepay.id/v2/auth/whoami \
  -H "Authorization: Bearer sk_test_84d9f1a2c6e7b0391f2a4c" \
  -H "Accept: application/json"</code></pre>

            <h3>Contoh Respons Sukses (200 OK)</h3>
            <pre><code class="language-json">{
  "status": "success",
  "data": {
    "merchant_id": "mrc_ddev_00192",
    "business_name": "Ddev Digital Store",
    "environment": "sandbox",
    "permissions": ["transactions:write", "transactions:read", "refunds:write"]
  }
}</code></pre>

            <div class="callout-tip">
              <span class="callout-title">Tips Pro: Rotasi Key Tanpa Downtime</span>
              CloudStack mendukung hingga 2 Secret Key aktif secara bersamaan selama masa transisi 24 jam sehingga Anda dapat melakukan rotasi kredensial di production tanpa mengganggu transaksi berjalan.
            </div>
          `
        }
      ]
    },
    {
      id: 'integrasi-api',
      title: 'Integrasi API & Webhook',
      articles: [
        {
          id: 'membuat-transaksi-qris',
          title: 'Membuat Transaksi & QRIS Dinamis',
          method: 'POST',
          readTime: '6 mnt baca',
          updated: '21 Nov 2026',
          lead: 'Buat tagihan QRIS dinamis dan Virtual Account secara instan melalui endpoint POST /v2/transactions lengkap dengan parameter idempotency dan batas waktu kadaluarsa.',
          snippet: 'Endpoint POST /v2/transactions, tabel parameter request, contoh cURL, JavaScript fetch, PHP cURL, dan JSON response 201.',
          contentHtml: `
            <h2>Endpoint Pembuatan Transaksi</h2>
            <div class="endpoint-bar">
              <span class="http-badge post">POST</span>
              <span class="endpoint-url">https://api.kitepay.id/v2/transactions</span>
            </div>

            <p>Endpoint ini membuat sesi pembayaran baru dan mengembalikan string payload QRIS (<code>qr_string</code>) beserta URL halaman checkout siap pakai.</p>

            <h2>Parameter Request Body</h2>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Tipe</th>
                    <th>Status</th>
                    <th>Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>order_id</code></td>
                    <td>string</td>
                    <td><span class="req-yes">Wajib</span></td>
                    <td>Nomor invoice/pesanan unik dari database aplikasi Anda (maks. 64 karakter).</td>
                  </tr>
                  <tr>
                    <td><code>amount</code></td>
                    <td>integer</td>
                    <td><span class="req-yes">Wajib</span></td>
                    <td>Nominal tagihan dalam Rupiah tanpa desimal (minimal <code>1000</code>).</td>
                  </tr>
                  <tr>
                    <td><code>payment_method</code></td>
                    <td>string</td>
                    <td><span class="req-yes">Wajib</span></td>
                    <td>Pilihan metode: <code>qris</code>, <code>va_bca</code>, <code>va_mandiri</code>, atau <code>ewallet_dana</code>.</td>
                  </tr>
                  <tr>
                    <td><code>expiry_minutes</code></td>
                    <td>integer</td>
                    <td><span class="req-no">Opsional</span></td>
                    <td>Durasi kadaluarsa tagihan dalam menit (default: <code>30</code>, maks: <code>1440</code>).</td>
                  </tr>
                  <tr>
                    <td><code>customer</code></td>
                    <td>object</td>
                    <td><span class="req-no">Opsional</span></td>
                    <td>Berisi <code>name</code>, <code>email</code>, dan <code>phone</code> untuk resi pembayaran otomatis.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Contoh Implementasi</h2>

            <h3>1. Menggunakan cURL</h3>
            <pre><code class="language-bash">curl -X POST https://api.kitepay.id/v2/transactions \
  -H "Authorization: Bearer sk_live_91a2c3d4e5f6" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: idem-inv-20261121-009" \
  -d '{
    "order_id": "INV-202611-009",
    "amount": 149000,
    "payment_method": "qris",
    "expiry_minutes": 15,
    "customer": {
      "name": "Raka Pratama",
      "email": "raka@contoh.id"
    }
  }'</code></pre>

            <h3>2. Menggunakan JavaScript (Node.js Fetch)</h3>
            <pre><code class="language-javascript">const response = await fetch('https://api.kitepay.id/v2/transactions', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.KITEPAY_SECRET_KEY}\`,
    'Content-Type': 'application/json',
    'Idempotency-Key': 'idem-inv-20261121-009'
  },
  body: JSON.stringify({
    order_id: 'INV-202611-009',
    amount: 149000,
    payment_method: 'qris',
    expiry_minutes: 15
  })
});

const result = await response.json();
console.log('Checkout URL:', result.data.checkout_url);</code></pre>

            <h3>3. Menggunakan PHP (cURL Native)</h3>
            <pre><code class="language-php">&lt;?php
$ch = curl_init('https://api.kitepay.id/v2/transactions');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER =&gt; true,
  CURLOPT_POST           =&gt; true,
  CURLOPT_HTTPHEADER     =&gt; [
    'Authorization: Bearer ' . getenv('KITEPAY_SECRET_KEY'),
    'Content-Type: application/json',
    'Idempotency-Key: idem-inv-20261121-009'
  ],
  CURLOPT_POSTFIELDS     =&gt; json_encode([
    'order_id'       =&gt; 'INV-202611-009',
    'amount'         =&gt; 149000,
    'payment_method' =&gt; 'qris'
  ])
]);

$data = json_decode(curl_exec($ch), true);
curl_close($ch);</code></pre>

            <h2>Contoh Respons (201 Created)</h2>
            <pre><code class="language-json">{
  "status": "success",
  "data": {
    "transaction_id": "trx_kp_7731a9f0c2",
    "order_id": "INV-202611-009",
    "amount": 149000,
    "payment_status": "PENDING",
    "qr_string": "00020101021226620014ID.KITEPAY.WWW0118936009140000123456...",
    "checkout_url": "https://pay.kitepay.id/c/trx_kp_7731a9f0c2",
    "expired_at": "2026-11-21T12:45:00+07:00"
  }
}</code></pre>

            <div class="callout-tip">
              <span class="callout-title">Tips Idempotency</span>
              Selalu kirim header <code>Idempotency-Key</code> saat membuat transaksi agar ketika terjadi timeout jaringan dan client melakukan retry, KitePay tidak membuat tagihan ganda.
            </div>
          `
        },
        {
          id: 'verifikasi-webhook-hmac',
          title: 'Verifikasi Webhook & Signature HMAC-SHA256',
          method: 'POST',
          readTime: '6 mnt baca',
          updated: '21 Nov 2026',
          lead: 'Amankan endpoint callback Anda dari payload palsu dengan memverifikasi tanda tangan kriptografis X-KitePay-Signature menggunakan HMAC-SHA256.',
          snippet: 'Validasi signature raw body pada Express.js & PHP, daftar event payment.paid, serta aturan idempotency webhook.',
          contentHtml: `
            <h2>Cara Kerja Webhook CloudStack</h2>
            <p>Saat pelanggan menyelesaikan pembayaran QRIS atau Virtual Account, worker KitePay mengirimkan request HTTP <code>POST</code> ke URL webhook yang Anda daftarkan di dashboard.</p>

            <div class="endpoint-bar">
              <span class="http-badge post">POST</span>
              <span class="endpoint-url">https://domain-anda.com/api/webhook/kitepay</span>
            </div>

            <h2>Daftar Event Webhook</h2>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Nama Event</th>
                    <th>Pemicu</th>
                    <th>Tindakan Disarankan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>payment.paid</code></td>
                    <td>Dana berhasil diterima dan terverifikasi</td>
                    <td>Aktifkan pesanan / kirim lisensi produk ke pelanggan</td>
                  </tr>
                  <tr>
                    <td><code>payment.expired</code></td>
                    <td>Batas waktu pembayaran terlewati</td>
                    <td>Ubah status invoice menjadi kadaluarsa &amp; kembalikan stok</td>
                  </tr>
                  <tr>
                    <td><code>refund.processed</code></td>
                    <td>Pengembalian dana selesai diproses</td>
                    <td>Catat mutasi refund pada pembukuan internal</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Validasi Signature HMAC-SHA256</h2>
            <p>KitePay menghitung hash HMAC-SHA256 dari <strong>raw JSON body</strong> menggunakan <code>KITEPAY_WEBHOOK_SECRET</code> dan mengirimkannya melalui header <code>X-KitePay-Signature</code>.</p>

            <h3>Implementasi Middleware Express.js</h3>
            <pre><code class="language-javascript">import crypto from 'node:crypto';
import express from 'express';

const app = express();

// Gunakan express.raw agar byte payload asli tidak berubah
app.post('/api/webhook/kitepay', express.raw({ type: 'application/json' }), (req, res) =&gt; {
  const signature = req.header('x-kitepay-signature') || '';
  const expected = crypto
    .createHmac('sha256', process.env.KITEPAY_WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  const isValid =
    signature.length === expected.length &amp;&amp;
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!isValid) {
    return res.status(401).json({ error: 'Signature webhook tidak valid' });
  }

  const event = JSON.parse(req.body.toString('utf8'));
  if (event.type === 'payment.paid') {
    // Proses pemenuhan order secara idempotent di database
    console.log('Pembayaran lunas untuk order:', event.data.order_id);
  }

  return res.status(200).json({ received: true });
});</code></pre>

            <h3>Implementasi PHP Native</h3>
            <pre><code class="language-php">&lt;?php
$rawPayload = file_get_contents('php://input');
$signature  = $_SERVER['HTTP_X_KITEPAY_SIGNATURE'] ?? '';
$expected   = hash_hmac('sha256', $rawPayload, getenv('KITEPAY_WEBHOOK_SECRET'));

if (!hash_equals($expected, $signature)) {
  http_response_code(401);
  exit(json_encode(['error' =&gt; 'Unauthorized signature']));
}

$event = json_decode($rawPayload, true);
http_response_code(200);
echo json_encode(['received' =&gt; true]);</code></pre>

            <div class="callout-warn">
              <span class="callout-title">Wajib Idempotent &amp; Cepat Merespons</span>
              Kembalikan status HTTP <code>200 OK</code> dalam waktu di bawah 5 detik. Jika endpoint lambat atau merespons 5xx, CloudStack akan melakukan retry otomatis hingga 8 kali dalam 24 jam. Pastikan handler mengecek apakah <code>order_id</code> sudah berstatus LUNAS sebelum memproses ulang.
            </div>
          `
        },
        {
          id: 'manajemen-refund-error',
          title: 'Manajemen Refund, Retry & Kode Error',
          method: 'POST',
          readTime: '5 mnt baca',
          updated: '21 Nov 2026',
          lead: 'Tangani pembatalan transaksi melalui endpoint refund, pahami kode status HTTP KitePay, serta terapkan strategi exponential backoff untuk keandalan tinggi.',
          snippet: 'Endpoint POST /v2/refunds, cek status GET /v2/transactions/{id}, tabel HTTP error codes, dan strategi backoff.',
          contentHtml: `
            <h2>Membuat Permintaan Refund</h2>
            <p>Anda dapat melakukan pengembalian dana penuh maupun parsial untuk transaksi berstatus <code>PAID</code> maksimal 90 hari sejak tanggal pembayaran.</p>

            <div class="endpoint-bar">
              <span class="http-badge post">POST</span>
              <span class="endpoint-url">https://api.kitepay.id/v2/refunds</span>
            </div>

            <pre><code class="language-bash">curl -X POST https://api.kitepay.id/v2/refunds \
  -H "Authorization: Bearer sk_live_91a2c3d4e5f6" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "trx_kp_7731a9f0c2",
    "amount": 50000,
    "reason": "Stok varian warna habis"
  }'</code></pre>

            <h3>Cek Status Transaksi Manual</h3>
            <div class="endpoint-bar">
              <span class="http-badge get">GET</span>
              <span class="endpoint-url">https://api.kitepay.id/v2/transactions/{transaction_id}</span>
            </div>

            <h2>Referensi Kode Error API</h2>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>HTTP Status</th>
                    <th>Error Code</th>
                    <th>Penyebab &amp; Solusi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>400</code></td>
                    <td><code>INVALID_JSON</code></td>
                    <td>Format body JSON rusak; pastikan header Content-Type benar.</td>
                  </tr>
                  <tr>
                    <td><code>401</code></td>
                    <td><code>UNAUTHORIZED_KEY</code></td>
                    <td>API Key salah, dicabut, atau tertukar antara Sandbox dan Production.</td>
                  </tr>
                  <tr>
                    <td><code>422</code></td>
                    <td><code>VALIDATION_FAILED</code></td>
                    <td>Field wajib kosong atau nominal di bawah batas minimum transaksi.</td>
                  </tr>
                  <tr>
                    <td><code>429</code></td>
                    <td><code>RATE_LIMIT_EXCEEDED</code></td>
                    <td>Melebihi 120 req/detik. Tunggu sesuai header <code>Retry-After</code>.</td>
                  </tr>
                  <tr>
                    <td><code>500</code></td>
                    <td><code>INTERNAL_GATEWAY_ERROR</code></td>
                    <td>Gangguan sementara pada upstream; lakukan retry dengan backoff.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Strategi Exponential Backoff</h2>
            <p>Untuk error <code>429</code> atau <code>5xx</code>, terapkan jeda retry bertingkat agar tidak membebani koneksi:</p>

            <pre><code class="language-javascript">async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.status !== 429 &amp;&amp; res.status < 500) return res;
    if (attempt === maxRetries) return res;
    const delayMs = Math.pow(2, attempt) * 500 + Math.random() * 200;
    await new Promise((r) =&gt; setTimeout(r, delayMs));
  }
}</code></pre>
          `
        }
      ]
    },
    {
      id: 'panduan-deployment',
      title: 'Panduan Deployment',
      articles: [
        {
          id: 'deploy-docker-nginx',
          title: 'Deploy Production dengan Docker & Nginx',
          method: '',
          readTime: '6 mnt baca',
          updated: '21 Nov 2026',
          lead: 'Bungkus layanan backend integrasi KitePay menggunakan Dockerfile multi-stage yang ramping dan amankan trafik publik memakai Nginx reverse proxy TLS 1.3.',
          snippet: 'Dockerfile multi-stage Node.js Alpine, docker-compose.yml, dan konfigurasi Nginx reverse proxy + rate limiting.',
          contentHtml: `
            <h2>Dockerfile Multi-Stage (Node.js Alpine)</h2>
            <p>Menggunakan multi-stage build menjaga ukuran image container di bawah 150 MB dan menghilangkan devDependencies dari image produksi.</p>

            <pre><code class="language-dockerfile">FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup &amp;&amp; adduser -S appuser -G appgroup
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 3000
CMD ["node", "src/server.js"]</code></pre>

            <h2>Orkestrasi dengan Docker Compose</h2>
            <pre><code class="language-yaml">services:
  kitepay-api:
    build: .
    restart: unless-stopped
    env_file: .env
    ports:
      - "127.0.0.1:3000:3000"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/healthz"]
      interval: 15s
      timeout: 5s
      retries: 3</code></pre>

            <h2>Konfigurasi Nginx Reverse Proxy</h2>
            <p>Pastikan Nginx meneruskan IP asli dan menjaga raw payload untuk endpoint webhook:</p>

            <pre><code class="language-nginx">server {
  listen 443 ssl http2;
  server_name api.tokoanda.id;

  ssl_protocols TLSv1.2 TLSv1.3;
  client_max_body_size 2M;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}</code></pre>

            <div class="callout-info">
              <span class="callout-title">Tips Firewall Webhook</span>
              Anda dapat membatasi akses endpoint <code>/api/webhook/kitepay</code> menggunakan whitelist IP resmi CloudStack selain validasi HMAC-SHA256 untuk pertahanan berlapis.
            </div>
          `
        },
        {
          id: 'monitoring-worker-ci-cd',
          title: 'Monitoring Worker, Queue & CI/CD Pipeline',
          method: 'GET',
          readTime: '5 mnt baca',
          updated: '21 Nov 2026',
          lead: 'Bangun endpoint healthcheck /healthz, otomatisasi pengujian dan deployment via GitHub Actions, serta terapkan logging JSON terstruktur untuk observability.',
          snippet: 'Endpoint GET /healthz, workflow CI/CD GitHub Actions, dan checklist audit pra-rilis production.',
          contentHtml: `
            <h2>Endpoint Healthcheck Standar</h2>
            <div class="endpoint-bar">
              <span class="http-badge get">GET</span>
              <span class="endpoint-url">https://api.tokoanda.id/healthz</span>
            </div>

            <pre><code class="language-javascript">app.get('/healthz', async (req, res) =&gt; {
  try {
    await db.query('SELECT 1');
    return res.status(200).json({
      status: 'healthy',
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});</code></pre>

            <h2>Workflow GitHub Actions CI/CD</h2>
            <p>Setiap kali branch <code>main</code> menerima push, pipeline menjalankan test otomatis sebelum melakukan deploy zero-downtime ke VPS:</p>

            <pre><code class="language-yaml">name: Deploy KitePay Service
on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/kitepay-service
            git pull origin main
            docker compose up -d --build</code></pre>

            <div class="callout-tip">
              <span class="callout-title">Checklist Go-Live Production</span>
              <ul>
                <li>Ganti <code>KITEPAY_SECRET_KEY</code> dari <code>sk_test_...</code> ke <code>sk_live_...</code>.</li>
                <li>Uji minimal 1 transaksi QRIS bernilai Rp 1.000 hingga status berubah menjadi <code>PAID</code>.</li>
                <li>Pastikan log error terpantau dan alert webhook aktif di Dashboard CloudStack.</li>
              </ul>
            </div>
          `
        }
      ]
    }
  ];

  // Flatten articles for easy next/prev & search lookup
  var ALL_ARTICLES = [];
  DOC_GROUPS.forEach(function (group) {
    group.articles.forEach(function (article) {
      ALL_ARTICLES.push({
        id: article.id,
        title: article.title,
        groupId: group.id,
        groupTitle: group.title,
        method: article.method,
        readTime: article.readTime,
        updated: article.updated,
        lead: article.lead,
        snippet: article.snippet,
        contentHtml: article.contentHtml,
        plainText: article.contentHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase()
      });
    });
  });

  var state = {
    viewMode: 'article', // 'article' | 'overview'
    activeArticleId: ALL_ARTICLES[0].id,
    collapsedGroups: {},
    searchSelectedIdx: 0,
    searchMatches: []
  };

  // DOM References
  var docsShell = document.getElementById('docsShell');
  var docsSidebar = document.getElementById('docsSidebar');
  var sidebarBackdrop = document.getElementById('sidebarBackdrop');
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var sidebarNavContainer = document.getElementById('sidebarNavContainer');
  var topNavLinks = document.getElementById('topNavLinks');
  var brandHomeLink = document.getElementById('brandHomeLink');

  var docBreadcrumb = document.getElementById('docBreadcrumb');
  var docArticleView = document.getElementById('docArticleView');
  var docArticleHeader = document.getElementById('docArticleHeader');
  var docArticleBody = document.getElementById('docArticleBody');
  var docPagerContainer = document.getElementById('docPagerContainer');
  var docOverviewView = document.getElementById('docOverviewView');

  var docsTocAside = document.getElementById('docsTocAside');
  var docTocList = document.getElementById('docTocList');

  var searchTriggerBtn = document.getElementById('searchTriggerBtn');
  var searchModal = document.getElementById('searchModal');
  var quickSearchInput = document.getElementById('quickSearchInput');
  var quickSearchResults = document.getElementById('quickSearchResults');
  var closeSearchBtn = document.getElementById('closeSearchBtn');

  var themeToggleBtn = document.getElementById('themeToggleBtn');
  var themeIconSun = document.getElementById('themeIconSun');
  var themeIconMoon = document.getElementById('themeIconMoon');

  var tocItems = [];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function findArticleById(id) {
    for (var i = 0; i < ALL_ARTICLES.length; i++) {
      if (ALL_ARTICLES[i].id === id) return ALL_ARTICLES[i];
    }
    return ALL_ARTICLES[0];
  }

  function findArticleIndex(id) {
    for (var i = 0; i < ALL_ARTICLES.length; i++) {
      if (ALL_ARTICLES[i].id === id) return i;
    }
    return 0;
  }

  // 1. Theme Toggle
  function syncThemeIcons() {
    var cur = document.documentElement.getAttribute('data-theme') || 'dark';
    if (cur === 'dark') {
      themeIconSun.style.display = 'block';
      themeIconMoon.style.display = 'none';
    } else {
      themeIconSun.style.display = 'none';
      themeIconMoon.style.display = 'block';
    }
  }

  themeToggleBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ddev_docspro_demo_theme', next);
    } catch (e) {}
    syncThemeIcons();
  });
  syncThemeIcons();

  // 2. Mobile Drawer
  function closeMobileSidebar() {
    docsSidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('open');
  }

  mobileMenuBtn.addEventListener('click', function () {
    docsSidebar.classList.toggle('open');
    sidebarBackdrop.classList.toggle('open');
  });

  sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // 3. Render Sidebar Groups
  function renderSidebar() {
    sidebarNavContainer.innerHTML = '';

    DOC_GROUPS.forEach(function (group) {
      var groupDiv = document.createElement('div');
      groupDiv.className = 'sidebar-group' + (state.collapsedGroups[group.id] ? ' collapsed' : '');

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sidebar-group-btn';
      btn.innerHTML =
        '<span class="sidebar-group-title-wrap"><span>' + escapeHtml(group.title) + '</span>' +
        '<span class="sidebar-group-count">' + group.articles.length + '</span></span>' +
        '<svg class="sidebar-group-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

      btn.addEventListener('click', function () {
        state.collapsedGroups[group.id] = !state.collapsedGroups[group.id];
        groupDiv.classList.toggle('collapsed');
      });

      var ul = document.createElement('ul');
      ul.className = 'sidebar-group-list';

      group.articles.forEach(function (article) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + article.id;
        a.className = 'sidebar-link' + (state.viewMode === 'article' && state.activeArticleId === article.id ? ' active' : '');

        var labelSpan = document.createElement('span');
        labelSpan.textContent = article.title;
        a.appendChild(labelSpan);

        if (article.method) {
          var badge = document.createElement('span');
          badge.className = 'sidebar-mini-badge ' + article.method.toLowerCase();
          badge.textContent = article.method;
          a.appendChild(badge);
        }

        a.addEventListener('click', function (e) {
          e.preventDefault();
          openArticle(article.id);
          closeMobileSidebar();
        });

        li.appendChild(a);
        ul.appendChild(li);
      });

      groupDiv.appendChild(btn);
      groupDiv.appendChild(ul);
      sidebarNavContainer.appendChild(groupDiv);
    });
  }

  // 4. Enhance Code Blocks with Header + Salin Kode Button
  function enhanceCodeBlocks() {
    var preBlocks = docArticleBody.querySelectorAll('pre');
    preBlocks.forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains('code-block-wrap')) return;
      var codeEl = pre.querySelector('code');
      var lang = 'CODE';
      if (codeEl && codeEl.className) {
        var match = codeEl.className.match(/language-([a-zA-Z0-9_-]+)/);
        if (match) lang = match[1].toUpperCase();
      }

      var wrap = document.createElement('div');
      wrap.className = 'code-block-wrap';

      var header = document.createElement('div');
      header.className = 'code-block-header';
      header.innerHTML =
        '<span class="code-lang-pill"><span class="code-dots"><i></i><i></i><i></i></span><span>' + escapeHtml(lang) + '</span></span>';

      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-code-btn';
      copyBtn.textContent = 'Salin Kode';

      copyBtn.addEventListener('click', function () {
        var textToCopy = codeEl ? codeEl.innerText : pre.innerText;
        copyTextToClipboard(textToCopy, function () {
          copyBtn.textContent = 'Tersalin \u2713';
          copyBtn.classList.add('copied');
          setTimeout(function () {
            copyBtn.textContent = 'Salin Kode';
            copyBtn.classList.remove('copied');
          }, 1800);
        });
      });

      header.appendChild(copyBtn);
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(header);
      wrap.appendChild(pre);
    });
  }

  function copyTextToClipboard(text, onSuccess) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(function () {
        fallbackCopy(text, onSuccess);
      });
    } else {
      fallbackCopy(text, onSuccess);
    }
  }

  function fallbackCopy(text, onSuccess) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (e) {}
    document.body.removeChild(ta);
  }

  // 5. Build Right Table of Contents & ScrollSpy
  function buildTableOfContents() {
    docTocList.innerHTML = '';
    tocItems = [];

    var headings = docArticleBody.querySelectorAll('h2, h3');
    headings.forEach(function (hd, index) {
      if (!hd.id) {
        hd.id = 'sec-' + index + '-' + hd.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }

      var li = document.createElement('li');
      li.className = 'toc-item ' + (hd.tagName === 'H3' ? 'level-3' : 'level-2');

      var a = document.createElement('a');
      a.href = '#' + hd.id;
      a.textContent = hd.textContent;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        hd.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateActiveTocLink(index);
      });

      li.appendChild(a);
      docTocList.appendChild(li);
      tocItems.push({ heading: hd, link: a });
    });

    if (tocItems.length > 0) {
      updateActiveTocLink(0);
    }
  }

  function updateActiveTocLink(activeIdx) {
    tocItems.forEach(function (item, idx) {
      if (idx === activeIdx) item.link.classList.add('active');
      else item.link.classList.remove('active');
    });
  }

  function handleScrollSpy() {
    if (state.viewMode !== 'article' || !tocItems.length) return;
    var scrollPos = window.scrollY + 115;
    var activeIdx = 0;
    for (var i = 0; i < tocItems.length; i++) {
      if (tocItems[i].heading.offsetTop <= scrollPos) {
        activeIdx = i;
      }
    }
    updateActiveTocLink(activeIdx);
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });

  // 6. Render Active Article View
  function openArticle(articleId) {
    var article = findArticleById(articleId);
    state.viewMode = 'article';
    state.activeArticleId = article.id;

    // Ensure parent group is expanded
    state.collapsedGroups[article.groupId] = false;

    docsShell.classList.remove('no-toc');
    docsTocAside.style.display = '';
    docArticleView.style.display = 'block';
    docOverviewView.style.display = 'none';

    docBreadcrumb.innerHTML =
      '<a href="#overview" id="crumbOverviewLink">Beranda Docs</a>' +
      '<span>/</span>' +
      '<span>' + escapeHtml(article.groupTitle) + '</span>' +
      '<span>/</span>' +
      '<span class="crumb-current">' + escapeHtml(article.title) + '</span>';

    var crumbOverviewLink = document.getElementById('crumbOverviewLink');
    if (crumbOverviewLink) {
      crumbOverviewLink.addEventListener('click', function (e) {
        e.preventDefault();
        openOverview();
      });
    }

    var methodBadgeHtml = article.method
      ? '<span class="http-badge ' + article.method.toLowerCase() + '">' + article.method + '</span>'
      : '';

    docArticleHeader.innerHTML =
      '<div class="article-badges-row">' +
        '<span class="doc-label-pill">' + escapeHtml(article.groupTitle) + '</span>' +
        methodBadgeHtml +
      '</div>' +
      '<h1 class="article-title">' + escapeHtml(article.title) + '</h1>' +
      '<p class="article-lead">' + escapeHtml(article.lead) + '</p>' +
      '<div class="article-meta">' +
        '<span>Estimasi: ' + escapeHtml(article.readTime) + '</span>' +
        '<span>&bull;</span>' +
        '<span>Diperbarui: ' + escapeHtml(article.updated) + '</span>' +
        '<span>&bull;</span>' +
        '<span>KitePay API v2.4</span>' +
      '</div>';

    docArticleBody.innerHTML = article.contentHtml;
    enhanceCodeBlocks();
    buildTableOfContents();
    renderPager(article.id);
    renderSidebar();
    syncTopNavState();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderPager(articleId) {
    var idx = findArticleIndex(articleId);
    var prev = idx > 0 ? ALL_ARTICLES[idx - 1] : null;
    var next = idx < ALL_ARTICLES.length - 1 ? ALL_ARTICLES[idx + 1] : null;

    docPagerContainer.innerHTML = '';

    if (prev) {
      var prevLink = document.createElement('a');
      prevLink.href = '#' + prev.id;
      prevLink.className = 'doc-pager-link prev';
      prevLink.innerHTML =
        '<span class="doc-pager-dir">&larr; Sebelumnya (' + escapeHtml(prev.groupTitle) + ')</span>' +
        '<span class="doc-pager-label">' + escapeHtml(prev.title) + '</span>';
      prevLink.addEventListener('click', function (e) {
        e.preventDefault();
        openArticle(prev.id);
      });
      docPagerContainer.appendChild(prevLink);
    } else {
      docPagerContainer.appendChild(document.createElement('div'));
    }

    if (next) {
      var nextLink = document.createElement('a');
      nextLink.href = '#' + next.id;
      nextLink.className = 'doc-pager-link next';
      nextLink.innerHTML =
        '<span class="doc-pager-dir">Berikutnya (' + escapeHtml(next.groupTitle) + ') &rarr;</span>' +
        '<span class="doc-pager-label">' + escapeHtml(next.title) + '</span>';
      nextLink.addEventListener('click', function (e) {
        e.preventDefault();
        openArticle(next.id);
      });
      docPagerContainer.appendChild(nextLink);
    }
  }

  // 7. Overview / Homepage Tutorial Cards View
  function openOverview() {
    state.viewMode = 'overview';
    docsShell.classList.add('no-toc');
    docsTocAside.style.display = 'none';
    docArticleView.style.display = 'none';
    docOverviewView.style.display = 'block';

    docBreadcrumb.innerHTML = '<span class="crumb-current">Beranda Dokumentasi</span>';

    var cardsHtml = ALL_ARTICLES.map(function (art) {
      var methodHtml = art.method
        ? '<span class="http-badge ' + art.method.toLowerCase() + '">' + art.method + '</span>'
        : '';
      return (
        '<article class="doc-card" data-article-id="' + art.id + '">' +
          '<div>' +
            '<div class="article-badges-row">' +
              '<span class="doc-label-pill">' + escapeHtml(art.groupTitle) + '</span>' +
              methodHtml +
            '</div>' +
            '<h3>' + escapeHtml(art.title) + '</h3>' +
            '<p>' + escapeHtml(art.snippet) + '</p>' +
          '</div>' +
          '<div class="doc-card-footer">' +
            '<span>' + escapeHtml(art.readTime) + '</span>' +
            '<span>Baca Panduan &rarr;</span>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    docOverviewView.innerHTML =
      '<div class="hero-docs">' +
        '<span class="doc-label-pill">Ddev DocsPro &bull; Live Preview</span>' +
        '<h2>KitePay &amp; CloudStack Developer Portal</h2>' +
        '<p>Pusat dokumentasi teknis, referensi endpoint REST API, verifikasi webhook HMAC, hingga panduan deployment produksi Docker &amp; Nginx.</p>' +
      '</div>' +
      '<div class="posts-grid">' + cardsHtml + '</div>';

    var cardEls = docOverviewView.querySelectorAll('.doc-card');
    cardEls.forEach(function (card) {
      card.addEventListener('click', function () {
        openArticle(card.getAttribute('data-article-id'));
      });
    });

    renderSidebar();
    syncTopNavState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Top Nav Sync
  function syncTopNavState() {
    var links = topNavLinks.querySelectorAll('a');
    links.forEach(function (a) {
      var navType = a.getAttribute('data-nav');
      var targetId = a.getAttribute('data-article-id');
      a.classList.remove('active');
      if (state.viewMode === 'overview' && navType === 'overview') {
        a.classList.add('active');
      } else if (state.viewMode === 'article') {
        if (targetId === state.activeArticleId) {
          a.classList.add('active');
        } else if (targetId === 'pengenalan-arsitektur' && state.activeArticleId !== 'membuat-transaksi-qris' && state.activeArticleId !== 'deploy-docker-nginx') {
          a.classList.add('active');
        }
      }
    });
  }

  topNavLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var navType = a.getAttribute('data-nav');
      if (navType === 'overview') {
        openOverview();
      } else {
        openArticle(a.getAttribute('data-article-id'));
      }
    });
  });

  brandHomeLink.addEventListener('click', function (e) {
    e.preventDefault();
    openArticle(ALL_ARTICLES[0].id);
  });

  // 8. Quick Search Modal (Ctrl+K)
  function openSearchModal() {
    searchModal.classList.add('open');
    searchModal.setAttribute('aria-hidden', 'false');
    quickSearchInput.value = '';
    renderSearchResults('');
    setTimeout(function () {
      quickSearchInput.focus();
    }, 20);
  }

  function closeSearchModal() {
    searchModal.classList.remove('open');
    searchModal.setAttribute('aria-hidden', 'true');
  }

  function renderSearchResults(rawQuery) {
    var q = (rawQuery || '').toLowerCase().trim();
    var matches = ALL_ARTICLES.filter(function (art) {
      if (!q) return true;
      return (
        art.title.toLowerCase().indexOf(q) !== -1 ||
        art.groupTitle.toLowerCase().indexOf(q) !== -1 ||
        art.snippet.toLowerCase().indexOf(q) !== -1 ||
        art.plainText.indexOf(q) !== -1
      );
    });

    state.searchMatches = matches;
    state.searchSelectedIdx = matches.length ? 0 : -1;

    if (!matches.length) {
      quickSearchResults.innerHTML =
        '<div class="search-empty">Tidak ditemukan dokumentasi untuk kata kunci "<strong>' + escapeHtml(rawQuery) + '</strong>".</div>';
      return;
    }

    quickSearchResults.innerHTML = '';
    matches.forEach(function (art, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-result-item' + (idx === 0 ? ' selected' : '');
      btn.innerHTML =
        '<div class="search-result-top">' +
          '<span class="search-result-title">' + escapeHtml(art.title) + '</span>' +
          '<span class="search-result-cat">' + escapeHtml(art.groupTitle) + '</span>' +
        '</div>' +
        '<div class="search-result-snippet">' + escapeHtml(art.snippet) + '</div>';

      btn.addEventListener('click', function () {
        closeSearchModal();
        openArticle(art.id);
      });

      btn.addEventListener('mouseenter', function () {
        state.searchSelectedIdx = idx;
        updateSearchSelectionHighlight();
      });

      quickSearchResults.appendChild(btn);
    });
  }

  function updateSearchSelectionHighlight() {
    var items = quickSearchResults.querySelectorAll('.search-result-item');
    items.forEach(function (el, idx) {
      if (idx === state.searchSelectedIdx) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('selected');
      }
    });
  }

  searchTriggerBtn.addEventListener('click', openSearchModal);
  closeSearchBtn.addEventListener('click', closeSearchModal);
  searchModal.addEventListener('click', function (e) {
    if (e.target === searchModal) closeSearchModal();
  });

  quickSearchInput.addEventListener('input', function () {
    renderSearchResults(quickSearchInput.value);
  });

  quickSearchInput.addEventListener('keydown', function (e) {
    var count = state.searchMatches.length;
    if (!count) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.searchSelectedIdx = (state.searchSelectedIdx + 1) % count;
      updateSearchSelectionHighlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.searchSelectedIdx = (state.searchSelectedIdx - 1 + count) % count;
      updateSearchSelectionHighlight();
    } else if (e.key === 'Enter' && state.searchSelectedIdx >= 0) {
      e.preventDefault();
      var chosen = state.searchMatches[state.searchSelectedIdx];
      closeSearchModal();
      openArticle(chosen.id);
    }
  });

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal.classList.contains('open')) closeSearchModal();
      else openSearchModal();
    } else if (e.key === 'Escape' && searchModal.classList.contains('open')) {
      closeSearchModal();
    }
  });

  // Initial Boot
  openArticle(ALL_ARTICLES[0].id);
})();
