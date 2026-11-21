(function () {
  var params = new URLSearchParams(window.location.search || '');
  var qp = params.get('lang');
  var lang = 'id';
  if (qp === 'en' || qp === 'id') {
    lang = qp;
    try { sessionStorage.setItem('ddev_demo_lang', qp); } catch (e) {}
  } else {
    try {
      var sess = sessionStorage.getItem('ddev_demo_lang');
      var stored = localStorage.getItem('ddev_locale_v1');
      if (sess === 'en' || sess === 'id') lang = sess;
      else if (stored === 'en') lang = 'en';
    } catch (e) {}
  }

  var EXACT = {
    'AbsensiQR Pro — Sistem Absensi Siswa & Karyawan QR Code Real-Time': 'AbsensiQR Pro — Real-Time QR Code Student & Staff Attendance',
    'Program Antrian Digital & Suara Panggil Otomatis': 'Digital Queue System & Automated Voice Caller',
    'Sistem Antrian Digital Pro': 'Digital Queue System Pro',
    'Multi-Loket • Suara Panggil Indonesia • Cetak Tiket': 'Multi-Counter • Auto Voice Call • Ticket Printing',
    'Kontrol Pemanggilan Loket': 'Counter Call Controls',
    'Belum ada antrian dipanggil': 'No ticket called yet',
    'Belum ada riwayat panggilan.': 'No call history yet.',
    'Tidak ada antrian menunggu.': 'No customers waiting in queue.',
    'Tambah Antrian Cepat dari Operator:': 'Quick Operator Queue Enqueue:',
    '▶ Panggil Berikutnya': '▶ Call Next',
    '🔊 Panggil Ulang': '🔊 Recall',
    '⏭ Lewati': '⏭ Skip',
    '● Sinkron Otomatis': '● Live Auto-Sync',
    'Riwayat Panggilan Terakhir': 'Recent Call History',
    'NOMOR ANTRIAN DIPANGGIL': 'NOW SERVING TICKET',
    'SILAKAN MENUNGGU': 'PLEASE WAIT',
    'Sisa Menunggu': 'Waiting in Queue',
    'Selamat Datang! Silakan Ambil Nomor Antrian': 'Welcome! Please Take a Queue Ticket',
    'Klik jenis layanan di bawah ini untuk mendapatkan nomor antrian dan cetak struk tiket.': 'Select a service below to generate your queue number and print a ticket.',
    '🖨 Cetak Struk Tiket': '🖨 Print Queue Ticket',
    'SISTEM ANTRIAN DIGITAL': 'DIGITAL QUEUE SYSTEM',
    'Nomor Antrian Anda': 'Your Queue Number',
    'Harap menunggu hingga nomor Anda dipanggil. Terima kasih.': 'Please wait until your number is called. Thank you.',
    'Layanan Umum / Kasir': 'General Service / Cashier',
    'Layanan Prioritas / Pengambilan': 'Priority / Pickup Service',
    'Layanan A (Umum)': 'Service A (General)',
    'Layanan B (CS)': 'Service B (Customer Service)',
    'Layanan C (Prioritas)': 'Service C (Priority)',
    'Loket 1 (Kasir / Umum)': 'Counter 1 (Cashier / General)',
    'Loket 2 (Customer Service)': 'Counter 2 (Customer Service)',
    'Loket 3 (Prioritas / Pengambilan)': 'Counter 3 (Priority / Pickup)',

    'POS & Gudang — Sistem Kasir & Inventaris': 'POS & Warehouse — Cashier & Inventory System',
    'POS Kasir & Inventaris': 'POS Cashier & Inventory',
    'Kasir': 'Cashier',
    'Kartu Stok': 'Stock Ledger',
    'Jurnal Nota': 'Sales Journal',
    'Laba / Rugi': 'Profit & Loss',
    'HARGA': 'PRICE',
    'NOMOR NOTA': 'RECEIPT NO.',
    'RINCIAN BARANG': 'ITEM BREAKDOWN',
    'Potongan Diskon (Rp)': 'Discount Amount',
    'TOTAL TAGIHAN': 'TOTAL DUE',
    'Harga Eceran': 'Retail Price',
    'Tunai': 'Cash',
    'UANG DITERIMA': 'CASH TENDERED',
    'KEMBALIAN': 'CHANGE DUE',
    'Uang Pas': 'Exact Cash',
    'Proses Pembayaran & Cetak Struk': 'Process Payment & Print Receipt',
    'Inventaris & Master Barang Gudang': 'Warehouse Inventory & Master SKUs',
    '+ Tambah Barang': '+ Add Product',
    'TOTAL SKU TERDAFTAR': 'TOTAL REGISTERED SKUS',
    'Semua Kategori': 'All Categories',
    'Semua Status Stok': 'All Stock Statuses',
    'Stok Menipis / Habis': 'Low / Out of Stock',
    'Stok Habis (0)': 'Out of Stock (0)',
    'Stok Aman': 'In Stock',
    'KODE SKU': 'SKU CODE',
    'NAMA BARANG': 'ITEM NAME',
    'LOKASI RAK': 'SHELF LOCATION',
    'STOK FISIK': 'PHYSICAL STOCK',
    'Kartu Stok & Log Mutasi Gudang': 'Stock Card & Warehouse Movement Log',
    'Export Kartu Stok (.xlsx)': 'Export Stock Card (.xlsx)',
    '+ Catat Mutasi Stok': '+ Record Stock Adjustment',
    'Semua Jenis Mutasi': 'All Movement Types',
    'Stok Masuk (+ Pembelian / Restock)': 'Stock In (+ Purchase / Restock)',
    'Stok Keluar (- Penjualan / Rusak)': 'Stock Out (- Sales / Damaged)',
    'SALDO STOK': 'STOCK BALANCE',
    'Jurnal Nota Penjualan & Piutang Kasbon': 'Sales Journal & Receivables Ledger',
    'Export Jurnal Penjualan (.xlsx)': 'Export Sales Journal (.xlsx)',
    'JUMLAH TRANSAKSI': 'TOTAL TRANSACTIONS',
    'TOTAL OMZET PENJUALAN': 'GROSS SALES REVENUE',
    'TOTAL HPP TERJUAL': 'TOTAL COGS SOLD',
    'LABA KOTOR (MARGIN)': 'GROSS PROFIT (MARGIN)',
    'Semua Metode Bayar': 'All Payment Methods',
    'NO. NOTA': 'RECEIPT #',
    'PELANGGAN': 'CUSTOMER',
    'LABA BERSIH': 'NET PROFIT',
    'Laporan Laba Rugi & Kinerja Produk': 'Profit & Loss Report & SKU Performance',
    'Download Pembukuan Lengkap (.xlsx)': 'Download Full Accounting (.xlsx)',
    'OMZET HARI INI': 'TODAY REVENUE',
    'LABA BERSIH HARI INI': 'TODAY NET PROFIT',
    'AKUMULASI BULAN INI': 'MONTH-TO-DATE',
    'Kontribusi Penjualan & Laba per Produk': 'Sales & Profit Contribution by Product',
    'OMZET': 'REVENUE',
    'LABA': 'PROFIT',
    'Barang Wajib Restock (Di Bawah Minimum)': 'Items Needing Restock (Below Minimum)',
    '+ Input Stok Masuk': '+ Add Restock',
    'Sinkronisasi Langsung ke File .xlsx Lokal': 'Live Sync to Local .xlsx Workbook',
    'STATUS BERKAS TERTAUT': 'LINKED FILE STATUS',
    'Tidak ada file .xlsx yang ditautkan': 'No .xlsx workbook linked yet',
    'Buka & Tautkan File .xlsx': 'Open & Link .xlsx File',
    'Buat File .xlsx Baru': 'Create New .xlsx File',
    'Unduh Workbook Lengkap (.xlsx)': 'Download Full Workbook (.xlsx)',
    'Pengaturan Toko & Konfigurasi Struk': 'Store Settings & Receipt Config',
    'Profil Usaha & Printer Kasir': 'Business Profile & Thermal Printer',
    'Nama Toko / Usaha': 'Store / Business Name',
    'Alamat Lengkap': 'Full Address',
    'Simpan Pengaturan': 'Save Settings',
    'Belum ada barang di nota': 'No items in receipt yet',
    'Pilih barang dari katalog di kiri atau scan barcode SKU.': 'Pick items from the left catalog or scan SKU barcode.',
    'Belum ada transaksi': 'No transactions yet',
    'Pratinjau Struk Kasir': 'Receipt Preview',
    'Cetak Struk': 'Print Receipt',
    'Pelanggan Umum': 'Walk-in Customer',

    'Demo Live: Mini POS Kasir PHP & Struk 58mm — Ddev': 'Live Demo: Mini PHP POS Cashier & 58mm Receipt — Ddev',
    'Layar Kasir': 'Cashier Screen',
    'Ringkasan Omzet Harian': 'Daily Revenue Summary',
    'Keranjang Transaksi': 'Transaction Cart',
    'TOTAL BAYAR': 'TOTAL DUE',
    'Uang Diterima': 'Cash Received',
    'Kembalian': 'Change',
    'Bayar & Pratinjau Struk 58mm': 'Pay & Preview 58mm Receipt',
    'Omzet Hari Ini': 'Today Revenue',
    'Estimasi Laba Kotor': 'Estimated Gross Profit',
    'Riwayat Transaksi Hari Ini': 'Today Transaction History',
    'Belum ada barang dipilih': 'No items selected',
    'Lihat Struk': 'View Receipt',

    'AbsensiQR Pro — Real-Time QR Attendance': 'AbsensiQR Pro — Real-Time QR Attendance',
    'Scan Absensi': 'Scan Attendance',
    'Rekap & Laporan': 'Reports & Export',
    'Total Anggota': 'Total Members',
    'Karyawan & Siswa aktif': 'Active staff & students',
    'Hadir Hari Ini': 'Present Today',
    'Masuk ≤ 08:15 WIB': 'Checked in on time',
    'Siap Scan': 'Ready to Scan',
    'Absen Masuk': 'Check In',
    'Absen Pulang': 'Check Out',
    'Suara Beep': 'Beep Sound',
    'Catat Absensi': 'Record Attendance',
    'Simulasi Scan Cepat (Klik untuk Absen):': 'Quick Scan Simulator (Click to Check In/Out):',
    'Kehadiran Hari Ini': 'Today Attendance Log',
    'Tambah Karyawan / Siswa Baru': 'Add New Staff / Student',
    'Nama Lengkap *': 'Full Name *',
    'Nama Lengkap': 'Full Name',
    'Kode QR (Opsional)': 'QR Code (Optional)',
    '+ Tambah & Buat Kartu QR': '+ Add & Generate QR Card',
    'Daftar Kartu QR Anggota': 'Member QR ID Cards',
    'Statistik Kehadiran 7 Hari Terakhir': 'Last 7 Days Attendance Trend',
    'Grafik Mingguan': 'Weekly Chart',
    'Dari Tanggal': 'From Date',
    'Status Kehadiran': 'Attendance Status',
    'Semua Status': 'All Statuses',
    'Semua Divisi/Kelas': 'All Departments / Classes',

    'Ddev Invoice, Penawaran & Kwitansi Bisnis Pro': 'Ddev Invoice, Quotation & Business Receipt Pro',
    'Ddev Invoice & Kwitansi Pro': 'Ddev Invoice & Receipt Pro',
    'Invoice, Penawaran Harga & Kwitansi Bisnis (PDF & WhatsApp)': 'Business Invoices, Quotations & Receipts (A4 PDF & WhatsApp)',
    'Riwayat Dokumen': 'Document History',
    'Profil Usaha': 'Business Profile',
    'Dokumen Baru': 'New Document',
    'Edit Dokumen': 'Edit Document',
    'Perubahan langsung tampil di pratinjau kertas A4': 'Changes update live on the A4 paper preview',
    'Jenis Dokumen': 'Document Type',
    'PENAWARAN': 'QUOTATION',
    'KWITANSI': 'RECEIPT',
    'Nomor Dokumen': 'Document Number',
    'No. Dokumen': 'Document No.',
    'Data Klien / Penerima': 'Client / Recipient Details',
    'Nama Perusahaan / Klien': 'Client / Company Name',
    'Nama Kontak / PIC': 'Contact Person / PIC',
    'WhatsApp Klien': 'Client WhatsApp / Phone',
    'Email Klien': 'Client Email',
    'Alamat Klien': 'Client Address',
    '+ Tambah Baris': '+ Add Line Item',
    'Diskon & Perpajakan': 'Discounts & Taxes',
    'Catatan & Pembayaran': 'Notes & Payment Info',
    'Simpan Dokumen': 'Save Document',
    'Konversi ke Invoice': 'Convert to Invoice',
    'Tandai Lunas → Kwitansi': 'Mark Paid → Receipt',
    'Kirim WhatsApp': 'Send WhatsApp',
    'Cetak / Simpan PDF': 'Print / Save PDF',
    'Arsip & Riwayat Dokumen': 'Document Archive & History',
    'Semua Jenis': 'All Types',
    'Penawaran': 'Quotation',
    'Kwitansi': 'Receipt',
    'Klien / Penerima': 'Client / Recipient',
    'Total Nilai': 'Total Value',
    'Status Dokumen': 'Document Status',
    'Cetak': 'Print',

    'Ddev Laundry POS — Kasir Kiloan/Satuan, Tracking Order & Nota Thermal': 'Ddev Laundry POS — Weight/Piece Cashier, Order Tracking & Thermal Receipt',
    'Kasir Kiloan & Satuan • Tracking Order • Nota Thermal': 'By-Kg & Piece POS • Live Order Tracking • Thermal Receipt',
    'Kasir Order Baru': 'New Laundry Order',
    'Cek Status Pelanggan': 'Track Order Status',
    'Laporan & Export': 'Reports & Export',
    '1. Data Pelanggan & Pengambilan': '1. Customer & Pickup Info',
    '2. Pilih Layanan Kiloan & Satuan': '2. Select By-Kg & Piece Services',
    '3. Parfum, Diskon & Pembayaran': '3. Fragrance, Discount & Payment',
    'Ringkasan & Preview Nota Thermal': 'Summary & Thermal Receipt Preview',
    'Subtotal Layanan': 'Services Subtotal',
    'Estimasi Selesai Otomatis': 'Auto Ready Estimate',
    'Sisa Tagihan Saat Ambil': 'Balance Due at Pickup',
    'Cek Status Cucian Anda': 'Track Your Laundry Order',
    'Kode Order': 'Order Code',
    'Rincian Omzet Harian': 'Daily Revenue Breakdown',
    'Kontrol Laporan, Ekspor & Tema': 'Reports, Export & Theme Controls',
    'Nota Thermal Laundry': 'Laundry Thermal Receipt',
    'Salin Teks Nota': 'Copy Receipt Text',
    'Pengaturan Profil Outlet': 'Outlet Profile Settings',
    'Semua Pembayaran': 'All Payments',

    'Sistem Booking Jadwal & Reservasi Pelanggan — Zero-Config': 'Appointment Booking & Customer Reservation System — Zero-Config',
    'Form Booking Pelanggan': 'Customer Booking Form',
    'Panel Admin & Jadwal': 'Admin & Schedule Panel',
    'Kelola Layanan & Staff': 'Manage Services & Staff',
    'Pilih Layanan': 'Choose a Service',
    'Pilih Staff / Spesialis & Tanggal': 'Select Staff / Specialist & Date',
    'Pilih Staff / Spesialis': 'Choose Staff / Specialist',
    'Hari Ini': 'Today',
    'Pilih Jam Kedatangan': 'Pick Arrival Time Slot',
    'Data Pelanggan & Konfirmasi': 'Customer Details & Confirm',
    'Buat Reservasi & Terbitkan Tiket': 'Book Appointment & Issue Ticket',
    'RINGKASAN RESERVASI': 'RESERVATION SUMMARY',
    'Total Hari Ini': 'Today Bookings',
    'Menunggu Konfirmasi': 'Pending Confirmation',
    'Estimasi Omzet': 'Estimated Revenue',
    'Semua Tanggal': 'All Dates',
    'Cetak Jadwal': 'Print Schedule',
    'Daftar Jadwal & Janji Temu': 'Schedule & Appointment List',
    '+ Buat Booking Baru': '+ New Booking',
    'Kelola Staff / Spesialis': 'Manage Staff / Specialists',
    'Kelola Daftar Layanan': 'Manage Service Catalog',
    'Nama Layanan': 'Service Name',
    'Harga (Rp)': 'Price',
    '+ Tambah Layanan': '+ Add Service',
    '+ Tambah Staff': '+ Add Staff',
    'Tiket Reservasi Pelanggan': 'Customer Booking Ticket',
    'Cetak Tiket': 'Print Ticket',

    'Ddev Kalkulator Finansial & Catatan Keuangan': 'Ddev Financial Calculator & Cashflow Ledger',
    'Ddev Kalkulator Finansial': 'Ddev Financial Calculator',
    'Catat Arus Kas, Anggaran & Target Tabungan': 'Track Cashflow, Budgets & Savings Goals',
    'Total Pemasukan': 'Total Income',
    'Total Pengeluaran': 'Total Expenses',
    'Rasio Tabungan': 'Savings Ratio',
    'Catat Transaksi Baru': 'Record New Transaction',
    'Pemasukan': 'Income',
    'Pengeluaran': 'Expense',
    '+ Simpan Transaksi': '+ Save Transaction',
    'Kalkulator Target Tabungan': 'Savings Goal Calculator',
    'Setoran / Bulan (Rp)': 'Monthly Deposit',
    'Estimasi Imbal Hasil (% per tahun)': 'Estimated Annual Return (%)',
    'Rincian Pengeluaran': 'Expense Breakdown',
    'Riwayat Buku Kas (Ledger)': 'Cashbook Ledger History',
    'Semua Tipe': 'All Types',
    'Simpan Anggaran': 'Save Budget',

    'UI Kit E-Commerce & SaaS Pro — 42 Komponen Siap Copy-Paste': 'UI Kit E-Commerce & SaaS Pro — 42 Ready Copy-Paste Components',
    '42 Komponen Web E-Commerce & SaaS Siap Copy-Paste': '42 E-Commerce & SaaS UI Components Ready to Copy-Paste',
    '42 Komponen': '42 Components',
    'Semua': 'All',
    'Semua Produk': 'All Products',
    'Katalog': 'Catalog',
    'Beranda': 'Home',
    'Tentang': 'About',
    'Tentang Kami': 'About Us',
    'Layanan': 'Services',
    'Paket Harga': 'Pricing Plans',
    'Kontak': 'Contact',
    'Keranjang': 'Cart',
    '+ Keranjang': '+ Cart',
    '+ Tambah ke Keranjang': '+ Add to Cart',
    'Checkout Keranjang': 'Checkout Cart',
    'Total Bayar': 'Total Payment',
    'Salin Link': 'Copy Link',
    'Salin Email': 'Copy Email',
    'Salin Kode HTML': 'Copy HTML Code',
    'Salin Snippet': 'Copy Snippet',
    'Sebelumnya': 'Previous',
    'Berikutnya': 'Next',
    'Tutup': 'Close',
    'Tutup ✕': 'Close ✕',
    'Simpan': 'Save',
    'Hapus': 'Delete',
    'Kembali': 'Back',
    'Konfirmasi': 'Confirm',
    'Selesai': 'Completed',
    'Menunggu': 'Pending',
    'Aktif': 'Active',
    'Buka Undangan': 'Open Invitation',
    'Tamu Undangan': 'Distinguished Guests',
    'Rangkaian Acara': 'Event Schedule',
    'RSVP & Ucapan': 'RSVP & Wishes',
    'Doa & Konfirmasi Kehadiran': 'Wishes & Attendance Confirmation',
    'Kirim Konfirmasi via WhatsApp': 'Confirm Attendance via WhatsApp',
    'Simpan ke Google Calendar': 'Add to Google Calendar',
    'Ekspor CSV': 'Export CSV',
    'Download Laporan (.csv)': 'Download Report (.csv)',
    'Dashboard Analitik': 'Analytics Dashboard',
    'Tabel Data CRUD': 'CRUD Data Tables',
    'Komponen Form': 'Form Components',
    'Faktur / Invoice': 'Billing & Invoices',
    'Halaman Login / Daftar': 'Login / Sign Up Page',
    'Ringkasan Analitik Bisnis': 'Business Analytics Overview',
    'Total Pendapatan': 'Total Revenue',
    'Total Transaksi': 'Total Transactions',
    'Pelanggan Aktif': 'Active Customers',
    'Tagihan Tertunda': 'Pending Invoices',
    'Tren Pendapatan & Operasional': 'Revenue & Operations Trend',
    'Transaksi Terbaru': 'Recent Transactions',
    'Lihat Semua': 'View All',
    'Cetak / PDF': 'Print / PDF',
    'Kembali ke Beranda': 'Back to Home',
    'Terpopuler Pekan Ini': 'Trending This Week',
    'Daftar Isi Artikel': 'Table of Contents',
    'Bagikan artikel ini:': 'Share this article:',
    'Produk Lokal Kurasi Terbaik, Checkout Langsung ke WhatsApp': 'Curated Artisan Products, Instant WhatsApp & Online Checkout',
    'Buka Live Demo ↗': 'Open Live Demo ↗',
    'Detail Proyek': 'Project Details',
    'Pesan Paket Ini →': 'Order This Plan →',
    'Pesan Jasa / Diskusi': 'Book Service / Chat',
    'Simpan Kontak (.vcf)': 'Save Contact (.vcf)'
  };

  var PHRASES = [
    ['Semua Produk', 'All Products'],
    ['Semua Kategori', 'All Categories'],
    ['Semua Status', 'All Statuses'],
    ['Tambah ke Keranjang', 'Add to Cart'],
    ['Keranjang Belanja', 'Shopping Cart'],
    ['Keranjang masih kosong', 'Your cart is empty'],
    ['Harga Termurah', 'Price: Low to High'],
    ['Harga Termahal', 'Price: High to Low'],
    ['Diskon Terbesar', 'Biggest Discount'],
    ['Tampilkan Semua', 'Show All'],
    ['Tidak ditemukan', 'Not found'],
    ['Tidak ada data', 'No data found'],
    ['Cari produk', 'Search products'],
    ['Cari komponen', 'Search components'],
    ['Cari berita', 'Search news'],
    ['Cari anggota', 'Search members'],
    ['Cari dokumentasi', 'Search documentation'],
    ['Cari nomor', 'Search number'],
    ['Simpan Data', 'Save Data'],
    ['Simpan Perubahan', 'Save Changes'],
    ['Salin Tautan', 'Copy Link'],
    ['Tautan berhasil disalin!', 'Link copied!'],
    ['Cetak / Simpan PDF', 'Print / Save PDF'],
    ['Kembali ke Dashboard', 'Back to Dashboard'],
    ['Pembayaran Otomatis', 'Automated Payment'],
    ['Metode Pembayaran', 'Payment Method'],
    ['Status Pembayaran', 'Payment Status'],
    ['Menunggu Pembayaran', 'Awaiting Payment'],
    ['Hari Ini', 'Today'],
    ['Bulan Ini', 'This Month'],
    ['Pesan Sekarang', 'Order Now'],
    ['Masuk ke Akun', 'Sign In'],
    ['Daftar Baru', 'Create Account'],
    ['Kata Sandi', 'Password'],
    ['Alamat Email', 'Email Address'],
    ['Nama Lengkap', 'Full Name'],
    ['Nomor WhatsApp', 'WhatsApp Number'],
    ['Kode Promo', 'Promo Code'],
    ['Total Harga', 'Total Price'],
    ['Ongkos Kirim', 'Shipping Fee'],
    ['Total Bayar', 'Total Due'],
    ['Lihat Demo', 'View Demo'],
    ['Unduh', 'Download'],
    ['Ekspor', 'Export'],
    ['Impor', 'Import'],
    ['Pengaturan', 'Settings'],
    ['Transaksi', 'Transactions'],
    ['Pelanggan', 'Customer'],
    ['Layanan', 'Service'],
    ['Perusahaan', 'Company']
  ];

  function translateString(str) {
    if (!str || typeof str !== 'string') return str;
    var trimmed = str.trim();
    if (!trimmed) return str;
    if (EXACT[trimmed]) {
      return str.replace(trimmed, EXACT[trimmed]);
    }
    var out = str;
    for (var i = 0; i < PHRASES.length; i++) {
      var idTxt = PHRASES[i][0];
      if (out.indexOf(idTxt) !== -1) {
        out = out.split(idTxt).join(PHRASES[i][1]);
      }
    }
    return out;
  }

  function applyDomTranslation() {
    if (lang !== 'en') return;
    document.documentElement.lang = 'en';
    document.title = translateString(document.title);

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA') {
          return NodeFilter.FILTER_REJECT;
        }
        if (p.closest && p.closest('#ddevDemoLangSwitch')) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (var i = 0; i < nodes.length; i++) {
      var orig = nodes[i].nodeValue;
      var tr = translateString(orig);
      if (tr !== orig) nodes[i].nodeValue = tr;
    }

    var els = document.querySelectorAll('[placeholder],[title],[aria-label]');
    for (var j = 0; j < els.length; j++) {
      var el = els[j];
      if (el.id === 'ddevDemoLangSwitch') continue;
      ['placeholder', 'title', 'aria-label'].forEach(function (attr) {
        var v = el.getAttribute(attr);
        if (v) {
          var nv = translateString(v);
          if (nv !== v) el.setAttribute(attr, nv);
        }
      });
    }
  }

  function injectLangSwitch() {
    if (!document.body || document.getElementById('ddevDemoLangSwitch')) return;
    var style = document.createElement('style');
    style.textContent = '@media print { #ddevDemoLangSwitch { display: none !important; } }';
    document.head && document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.id = 'ddevDemoLangSwitch';
    btn.type = 'button';
    btn.title = 'Switch Live Demo Language (ID / EN)';
    btn.style.cssText = [
      'position:fixed',
      'left:14px',
      'bottom:14px',
      'z-index:99999',
      'display:inline-flex',
      'align-items:center',
      'gap:6px',
      'padding:7px 12px',
      'border-radius:999px',
      'border:1px solid rgba(148,163,184,0.45)',
      'background:rgba(15,23,42,0.92)',
      'color:#f8fafc',
      'font:700 12px/1 system-ui,-apple-system,sans-serif',
      'cursor:pointer',
      'box-shadow:0 8px 20px rgba(0,0,0,0.22)',
      'backdrop-filter:blur(8px)'
    ].join(';');
    btn.innerHTML = lang === 'en' ? '🇺🇸 <span>EN Demo</span>' : '🇮🇩 <span>ID Demo</span>';
    btn.addEventListener('click', function () {
      var next = lang === 'en' ? 'id' : 'en';
      try {
        sessionStorage.setItem('ddev_demo_lang', next);
        localStorage.setItem('ddev_locale_v1', next);
      } catch (e) {}
      var u = new URL(window.location.href);
      u.searchParams.set('lang', next);
      window.location.href = u.toString();
    });
    document.body.appendChild(btn);
  }

  function init() {
    injectLangSwitch();
    if (lang === 'en') {
      applyDomTranslation();
      var timer = null;
      var obs = new MutationObserver(function () {
        if (timer) clearTimeout(timer);
        timer = setTimeout(applyDomTranslation, 60);
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
