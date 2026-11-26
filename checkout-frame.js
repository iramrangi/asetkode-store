(function () {
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn[data-copy-email]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var email = btn.getAttribute('data-copy-email') || '';
        if (navigator.clipboard && email) {
          navigator.clipboard.writeText(email).catch(function () {});
        }
        btn.textContent = 'Tersalin!';
        setTimeout(function () {
          btn.textContent = 'Salin';
        }, 1800);
      });
    });
  }

  function initPaymentGateway(cfg) {
    var gasUrl = String(cfg.gasUrl || '');
    var orderTitle = String(cfg.orderTitle || '');
    var orderItems = Array.isArray(cfg.orderItems) ? cfg.orderItems : [];
    var baseBody = String(cfg.baseBody || '');
    var orderEmailTo = String(cfg.orderEmailTo || '');
    var subj = String(cfg.subj || '');

    function syncGmailHref(val) {
      var v = String(val || '').trim();
      var btn = document.getElementById('qrisGmailBtn');
      if (!btn) return;
      var b = baseBody + (v ? '- Email Penerima .ZIP: ' + v + '\n' : '') + '\nTerlampir bukti bayar QRIS saya. Terima kasih!';
      btn.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(orderEmailTo) + '&su=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(b);
    }

    function switchToQris(prefillEmail, reasonText) {
      document.getElementById('stepMayarForm').style.display = 'none';
      document.getElementById('stepMayarWait').style.display = 'none';
      document.getElementById('stepQrisFallback').style.display = 'block';
      var emInput = document.getElementById('buyerEmail');
      if (emInput && prefillEmail) {
        emInput.value = prefillEmail;
        syncGmailHref(prefillEmail);
      }
      var al = document.getElementById('qrisReasonAlert');
      if (al && reasonText) {
        al.textContent = reasonText;
        al.style.display = 'block';
      }
    }

    var buyerEmailEl = document.getElementById('buyerEmail');
    if (buyerEmailEl) {
      buyerEmailEl.addEventListener('input', function () {
        syncGmailHref(this.value);
      });
    }
    var showQrisBtn = document.getElementById('showQrisDirectBtn');
    if (showQrisBtn) {
      showQrisBtn.addEventListener('click', function () {
        var custEmailEl = document.getElementById('custEmail');
        switchToQris(custEmailEl ? custEmailEl.value : '', '');
      });
    }

    var pollTimer = null;
    function startStatusPolling(oid, statusToken) {
      if (pollTimer) clearInterval(pollTimer);
      var sigQ = statusToken ? ('&sig=' + encodeURIComponent(statusToken)) : '';
      pollTimer = setInterval(function () {
        fetch(gasUrl + '?action=status&orderId=' + encodeURIComponent(oid) + sigQ)
          .then(function (r) { return r.json(); })
          .then(function (st) {
            if (st && st.status === 'PAID') {
              clearInterval(pollTimer);
              document.getElementById('stepMayarWait').style.display = 'none';
              document.getElementById('stepPaidSuccess').style.display = 'block';
              var wrap = document.getElementById('paidLinksWrap');
              wrap.innerHTML = (st.downloadLinks || []).map(function (d) {
                var safeUrl = /^https:\/\//i.test(String(d.url || '').trim()) ? String(d.url).trim() : '#';
                var safeName = String(d.name || 'File .ZIP').replace(/[&<>"]/g, function (ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]; });
                var safeHref = safeUrl.replace(/[&<>"]/g, function (ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]; });
                return '<a class="dl-btn" href="' + safeHref + '" target="_blank" rel="noopener">⬇ Unduh: ' + safeName + '</a>';
              }).join('');
            }
          })
          .catch(function () {});
      }, 5000);
    }

    var initForm = document.getElementById('mayarInitForm');
    if (initForm) {
      initForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('custName').value.trim();
        var email = document.getElementById('custEmail').value.trim();
        var phone = document.getElementById('custPhone').value.trim();
        var btn = document.getElementById('mayarCreateBtn');
        if (!gasUrl) {
          switchToQris(email, '');
          return;
        }
        btn.disabled = true;
        btn.textContent = 'Menyiapkan Invoice...';
        fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'create',
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            productTitle: orderTitle,
            items: orderItems
          })
        })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (res && res.ok && res.paymentUrl) {
              document.getElementById('stepMayarForm').style.display = 'none';
              document.getElementById('stepMayarWait').style.display = 'block';
              document.getElementById('waitOrderLabel').textContent = 'Order ID: ' + res.orderId;
              document.getElementById('mayarPayAnchor').href = res.paymentUrl;
              try { window.open(res.paymentUrl, '_blank', 'noopener'); } catch (err) {}
              startStatusPolling(res.orderId, res.statusToken || '');
            } else {
              switchToQris(email, 'Gateway Mayar sedang menunggu aktivasi — silakan bayar cepat via QRIS resmi di bawah ini.');
            }
          })
          .catch(function () {
            switchToQris(email, 'Silakan selesaikan pembayaran cepat via QRIS Ddev Kit di bawah ini.');
          });
      });
    }
  }

  function boot() {
    initCopyButtons();
    var payloadEl = document.getElementById('checkoutPayload');
    if (payloadEl) {
      try {
        var cfg = JSON.parse(payloadEl.textContent || '{}');
        initPaymentGateway(cfg);
      } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
