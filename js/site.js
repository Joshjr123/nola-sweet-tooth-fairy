/* ===========================================================
   NOLA Sweet Tooth Fairy — shared site script
   nav + footer injection, cart helpers, toast
   =========================================================== */
(function () {

  // ---------- Small safety helper (prevents HTML injection issues) ----------
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---- Contact + social constants (single source of truth) ----
  window.STF = {
    phone: '(504)-354-1704',
    phoneHref: 'tel:+15043541704',
    email: 'nolasweettoothfairy@gmail.com',
    address: '9301 Lake Forest Blvd Ste 113, New Orleans, LA',
    hours: 'Tue–Sun 10a–6p · Monday Closed',

    // CLEANED URLs (no tracking junk, more stable for Netlify sites)
    instagram: 'https://www.instagram.com/nola.sweettoothfairy/',
    facebook: 'https://www.facebook.com/profile.php?id=61557715193801',
    tiktok: 'https://www.tiktok.com/@nola.sweettoothfairy',
    doordash: 'https://www.doordash.com/'
  };

  var ICONS = {
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.86.07s-3.6 0-4.86-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.86c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.52.01-4.76.07-.9.04-1.39.2-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.12.32-.28.81-.32 1.71C3.41 8.48 3.4 8.85 3.4 12s.01 3.52.07 4.76c.04.9.2 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.12.81.28 1.71.32 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.39-.2 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.12-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.2-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.12-.81-.28-1.71-.32C15.52 4.01 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 7.06 12 4.94 4.94 0 0 1 12 7.06Zm0 8.15A3.21 3.21 0 1 0 8.79 12 3.21 3.21 0 0 0 12 15.2Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3v12.27a2.43 2.43 0 1 1-2.43-2.43c.16 0 .31.02.46.05v-3.06a5.5 5.5 0 1 0 4.97 5.47V9.9a7.28 7.28 0 0 0 4.26 1.36v-3a4.28 4.28 0 0 1-3.2-1.44Z"/></svg>'
  };

  function socialsHTML() {
    var s = window.STF;
    return '<div class="socials">' +
      '<a href="' + s.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
      '<a href="' + s.facebook + '" target="_blank" rel="noopener">Facebook</a>' +
      '<a href="' + s.tiktok + '" target="_blank" rel="noopener">TikTok</a>' +
      '</div>';
  }

  var LOGO = '<svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#ff69b4"/></svg>';

  // ---------- NAV ----------
  var pages = [
    ['index.html', 'Home'], ['about.html', 'About'], ['menu.html', 'Menu'],
    ['custom.html', 'Custom Orders'], ['gallery.html', 'Gallery'],
    ['rewards.html', 'Rewards'], ['contact.html', 'Contact']
  ];

  var current = location.pathname.split('/').pop() || 'index.html';

  function buildNav() {
    var holder = document.querySelector('[data-nav]');
    if (!holder) return;

    var links = pages.map(function (p) {
      var active = p[0] === current ? ' class="active"' : '';
      return '<a href="' + p[0] + '"' + active + '>' + p[1] + '</a>';
    }).join('');

    holder.className = 'nav';
    holder.innerHTML =
      '<div class="nav-inner">' +
        '<a class="brand" href="index.html">' + LOGO +
          '<span class="name">NOLA Sweet Tooth Fairy<span>Order online</span></span>' +
        '</a>' +
        '<button class="nav-toggle"><span></span><span></span><span></span></button>' +
        '<nav class="nav-links">' +
          links +
          '<a href="order.html" class="cart-link">' +
            '<span class="btn btn-primary btn-sm">Order Now <span class="cart-count" data-cart-count>0</span></span>' +
          '</a>' +
        '</nav>' +
      '</div>';

    holder.querySelector('.nav-toggle').addEventListener('click', function () {
      holder.querySelector('.nav-links').classList.toggle('open');
    });
  }

  // ---------- FOOTER ----------
  function buildFooter() {
    var holder = document.querySelector('[data-footer]');
    if (!holder) return;

    var s = window.STF;

    holder.className = 'site-footer';
    holder.innerHTML =
      '<div class="footer-grid">' +
        '<div>' +
          '<div class="name">NOLA Sweet Tooth Fairy</div>' +
          '<p>' + escapeHTML(s.address) + '</p>' +
          '<p>' + escapeHTML(s.phone) + '</p>' +
          '<p>' + escapeHTML(s.hours) + '</p>' +
        '</div>' +
        '<div>' +
          '<h4>Links</h4>' +
          '<a href="menu.html">Menu</a><br>' +
          '<a href="order.html">Order</a>' +
        '</div>' +
        '<div>' +
          '<h4>Socials</h4>' +
          socialsHTML() +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">© 2026 NOLA Sweet Tooth Fairy</div>';
  }

  // ---------- CART ----------
  var KEY = 'stf_cart';

  window.Cart = {
    get: function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; }
      catch (e) { return []; }
    },

    save: function (items) {
      localStorage.setItem(KEY, JSON.stringify(items));
      window.Cart.updateCount();
    },

    add: function (name, price, meta) {
      var items = window.Cart.get();
      var id = name + '|' + (meta || '');

      var found = items.find(function (i) { return i.id === id; });

      if (found) found.qty += 1;
      else items.push({ id: id, name: name, price: +price, meta: meta || '', qty: 1 });

      window.Cart.save(items);
    },

    count: function () {
      return window.Cart.get().reduce(function (n, i) {
        return n + i.qty;
      }, 0);
    },

    updateCount: function () {
      var elms = document.querySelectorAll('[data-cart-count]');
      if (!elms.length) return;

      var n = window.Cart.count();
      elms.forEach(function (el) {
        el.textContent = n;
      });
    }
  };

  // ---------- TOAST ----------
  window.toast = function (msg) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;

    document.body.appendChild(t);

    requestAnimationFrame(function () {
      t.classList.add('show');
    });

    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 400);
    }, 2200);
  };

  // ---------- INIT ----------
  document.addEventListener('DOMContentLoaded', function () {
    buildNav();
    buildFooter();
    window.Cart.updateCount();
  });

})();