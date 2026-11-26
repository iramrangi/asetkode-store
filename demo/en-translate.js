/* ==========================================================================
   Ddev Kit — Universal ?lang=en Live Demo Localizer
   Activates ONLY when URL contains ?lang=en (zero impact on Indonesian view)
   ========================================================================== */
(function () {
  'use strict';
  var qs;
  try {
    qs = new URLSearchParams(window.location.search);
  } catch (e) {
    return;
  }
  if (qs.get('lang') !== 'en') return;

  document.documentElement.lang = 'en';

  var EXACT_AND_PHRASE_PAIRS = [
    // Common UI & Actions
    ['Tambah Produk Baru', 'Add New Product'],
    ['Tambah Layanan & Staff', 'Manage Services & Staff'],
    ['Kelola Layanan & Staff', 'Manage Services & Staff'],
    ['Panel Admin & Jadwal', 'Admin & Schedule Panel'],
    ['Form Booking Pelanggan', 'Customer Booking Form'],
    ['Buat Reservasi & Terbitkan Tiket', 'Create Reservation & Issue Ticket'],
    ['Riwayat Dokumen', 'Document History'],
    ['Editor & Preview', 'Editor & Preview'],
    ['Cetak / Simpan PDF', 'Print / Save PDF'],
    ['Kirim WhatsApp', 'Send WhatsApp'],
    ['Konfirmasi WhatsApp', 'WhatsApp Confirmation'],
    ['Ekspor CSV', 'Export CSV'],
    ['Export CSV', 'Export CSV'],
    ['Reset Demo', 'Reset Demo'],
    ['Bayar Sekarang', 'Pay Now'],
    ['Bayar QRIS', 'Pay QRIS'],
    ['Cetak Struk Thermal', 'Print Thermal Receipt'],
    ['Cetak Struk Tiket', 'Print Ticket Receipt'],
    ['Cetak Kartu QR', 'Print QR Cards'],
    ['Cetak Nota', 'Print Receipt'],
    ['Tandai Lunas', 'Mark Paid'],
    ['Belum Lunas', 'Unpaid'],
    ['Menunggu Pembayaran', 'Awaiting Payment'],
    ['Menunggu Konfirmasi', 'Pending Confirmation'],
    ['Dikonfirmasi', 'Confirmed'],
    ['Dibatalkan', 'Cancelled'],
    ['Selesai', 'Completed'],
    ['Lunas', 'Paid'],
    ['Draft', 'Draft'],
    ['Kosongkan Keranjang', 'Clear Cart'],
    ['Kosongkan', 'Clear'],
    ['Simpan & Cetak Struk', 'Save & Print Receipt'],
    ['Simpan Perubahan', 'Save Changes'],
    ['Simpan Pengaturan', 'Save Settings'],
    ['Tampilkan Semua', 'Show All'],
    ['Semua Kategori', 'All Categories'],
    ['Semua Status', 'All Statuses'],
    ['Semua Tanggal', 'All Dates'],
    ['Hari Ini', 'Today'],
    ['Besok', 'Tomorrow'],
    ['Lusa', 'In 2 Days'],

    // Kasir POS (demo/kasir & demo/kasir-php)
    ['Sistem Kasir & Inventaris', 'POS Cashier & Inventory System'],
    ['Inventaris', 'Inventory'],
    ['Kartu Stok', 'Stock Ledger'],
    ['Jurnal Nota', 'Receipt Journal'],
    ['Dashboard', 'Dashboard'],
    ['Ringkasan', 'Overview'],
    ['Kasir', 'Cashier'],
    ['Keranjang Belanja', 'Shopping Cart'],
    ['Total Tagihan', 'Total Bill'],
    ['Subtotal', 'Subtotal'],
    ['Diskon', 'Discount'],
    ['Kembalian', 'Change'],
    ['Uang Diterima', 'Cash Received'],
    ['Uang Pas', 'Exact Cash'],
    ['Metode Bayar', 'Payment Method'],
    ['Tunai', 'Cash'],
    ['Transfer Bank', 'Bank Transfer'],
    ['Stok Menipis', 'Low Stock'],
    ['Produk', 'Products'],
    ['Kategori', 'Category'],
    ['Harga Jual', 'Sell Price'],
    ['Harga Beli', 'Buy Price'],
    ['Jumlah', 'Qty'],
    ['Stok', 'Stock'],
    ['Aktif', 'Active'],

    // Invoice Pro (demo/invoice)
    ['Invoice, Penawaran Harga & Kwitansi Bisnis', 'Business Invoice, Quotation & Receipt Generator'],
    ['PENAWARAN HARGA', 'QUOTATION'],
    ['PENAWARAN', 'QUOTATION'],
    ['KWITANSI', 'OFFICIAL RECEIPT'],
    ['Kepada Yth.', 'Bill To'],
    ['Nomor Dokumen', 'Document Number'],
    ['Tanggal Terbit', 'Issue Date'],
    ['Jatuh Tempo', 'Due Date'],
    ['Deskripsi Item', 'Item Description'],
    ['Harga Satuan', 'Unit Price'],
    ['Tambah Baris', 'Add Row'],
    ['Konversi ke Invoice', 'Convert to Invoice'],
    ['Duplikat Dokumen', 'Duplicate'],
    ['Profil Usaha', 'Company Profile'],

    // Booking (demo/booking)
    ['Klinik & Dokter Gigi', 'Clinic & Dental'],
    ['Barbershop & Salon', 'Barbershop & Salon'],
    ['Bengkel & Servis', 'Auto Workshop'],
    ['Studio Foto & Konsultasi', 'Photo Studio & Consulting'],
    ['Pilih Layanan', 'Select Service'],
    ['Pilih Tanggal Kunjungan', 'Select Visit Date'],
    ['Pilih Jam Kedatangan', 'Select Time Slot'],
    ['Nama Lengkap', 'Full Name'],
    ['Nomor WhatsApp', 'WhatsApp Number'],
    ['Catatan', 'Notes'],
    ['Terisi', 'Booked'],
    ['Tersedia', 'Available'],

    // Laundry (demo/laundry)
    ['Kasir Kiloan & Satuan', 'Laundry POS & Weigh-In'],
    ['Tracking Order', 'Order Tracking'],
    ['Nota Thermal', 'Thermal Receipt'],
    ['Pengaturan Outlet & Data', 'Outlet Settings & Data'],
    ['Diterima', 'Received'],
    ['Dicuci', 'Washing'],
    ['Disetrika', 'Ironing'],
    ['Siap Ambil', 'Ready for Pickup'],
    ['Diambil', 'Picked Up'],
    ['Berat (Kg)', 'Weight (Kg)'],
    ['Layanan', 'Service'],
    ['Estimasi Selesai', 'Estimated Ready'],

    // Queue (demo/antrian)
    ['Panggil Berikutnya', 'Call Next'],
    ['Panggil Ulang', 'Recall'],
    ['Lewati', 'Skip'],
    ['SEDANG DIPANGGIL', 'NOW SERVING'],
    ['NOMOR ANTRIAN DIPANGGIL', 'CURRENTLY SERVING'],
    ['SILAKAN MENUNGGU', 'PLEASE WAIT'],
    ['Belum ada antrian dipanggil', 'No ticket called yet'],
    ['Layanan Umum', 'General Service'],
    ['Layanan Prioritas', 'Priority Service'],
    ['Daftar Antrian Menunggu', 'Waiting Queue'],
    ['Riwayat Panggilan Terakhir', 'Recent Calls'],

    // Absensi QR (demo/absensi)
    ['Scanner Absensi', 'QR Attendance Scanner'],
    ['Admin & Kartu QR', 'Admin & QR Cards'],
    ['Absen Masuk', 'Check In'],
    ['Absen Pulang', 'Check Out'],
    ['Tepat Waktu', 'On Time'],
    ['Terlambat', 'Late'],
    ['Total Anggota', 'Total Members'],
    ['Hadir Hari Ini', 'Present Today'],

    // UI Kit / Agency / Biolink / UMKM / Undangan / Blogger / Payment Kit / Scraper / Bots
    ['Komponen Web E-Commerce & SaaS Siap Copy-Paste', 'Ready-to-Copy E-Commerce & SaaS Web Components'],
    ['Mode Gelap', 'Dark Mode'],
    ['Mode Terang', 'Light Mode'],
    ['Semua', 'All'],
    ['Cari ', 'Search '],
    ['Lihat Detail', 'View Details'],
    ['Beli Sekarang', 'Buy Now'],
    ['Kirim Pesan', 'Send Message'],
    ['Tentang Kami', 'About Us'],
    ['Testimoni', 'Testimonials'],
    ['Pertanyaan', 'FAQ'],
    ['Kontak', 'Contact'],
    ['Simpan ke Google Calendar', 'Save to Google Calendar'],
    ['Petunjuk Google Maps', 'Google Maps Directions'],
    ['Salin No. Rek', 'Copy Account No.'],
    ['Tanda Kasih Digital', 'Digital Wedding Gift'],
    ['Doa & Konfirmasi Kehadiran', 'Wishes & RSVP'],
    ['Kisah Cinta Kami', 'Our Love Story'],
    ['Galeri Foto', 'Photo Gallery'],
    ['Buka Undangan', 'Open Invitation'],
    ['Akad Nikah', 'Wedding Vows'],
    ['Resepsi Pernikahan', 'Wedding Reception'],
    ['Pengeluaran', 'Expenses'],
    ['Pemasukan', 'Income'],
    ['Saldo', 'Balance'],
    ['Pelanggan', 'Customers'],
    ['Laporan', 'Reports'],
    ['Berhasil', 'Success'],
    ['Simpan', 'Save'],
    ['Hapus', 'Delete'],
    ['Tutup', 'Close'],
    ['Batal', 'Cancel'],
    ['Tambah', 'Add'],
    ['Tanggal', 'Date'],
    ['Status', 'Status'],
    ['Total', 'Total'],
    ['Harga', 'Price'],
    ['Nama', 'Name'],
    ['Aksi', 'Action']
  ];

  // Sort longest match first
  EXACT_AND_PHRASE_PAIRS.sort(function (a, b) {
    return b[0].length - a[0].length;
  });

  function translateString(str) {
    if (!str || typeof str !== 'string') return str;
    var out = str;
    for (var i = 0; i < EXACT_AND_PHRASE_PAIRS.length; i++) {
      var idPhrase = EXACT_AND_PHRASE_PAIRS[i][0];
      if (out.indexOf(idPhrase) !== -1) {
        out = out.split(idPhrase).join(EXACT_AND_PHRASE_PAIRS[i][1]);
      }
    }
    return out;
  }

  var isMutating = false;
  function translateSubtree(root) {
    if (!root || isMutating) return;
    isMutating = true;
    try {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      var node;
      while ((node = walker.nextNode())) {
        var parentTag = node.parentElement ? node.parentElement.tagName : '';
        if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'TEXTAREA') continue;
        var orig = node.nodeValue;
        if (!orig || !orig.trim()) continue;
        var next = translateString(orig);
        if (next !== orig) node.nodeValue = next;
      }

      var elems = root.querySelectorAll ? root.querySelectorAll('[placeholder], [title], [aria-label]') : [];
      for (var i = 0; i < elems.length; i++) {
        var el = elems[i];
        ['placeholder', 'title', 'aria-label'].forEach(function (attr) {
          var v = el.getAttribute(attr);
          if (v) {
            var nv = translateString(v);
            if (nv !== v) el.setAttribute(attr, nv);
          }
        });
      }
    } finally {
      isMutating = false;
    }
  }

  function run() {
    document.title = translateString(document.title);
    translateSubtree(document.body);
    if (typeof MutationObserver !== 'undefined') {
      var obs = new MutationObserver(function (mutations) {
        if (isMutating) return;
        mutations.forEach(function (m) {
          if (m.type === 'childList') {
            m.addedNodes.forEach(function (n) {
              if (n.nodeType === 1) translateSubtree(n);
            });
          }
        });
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
