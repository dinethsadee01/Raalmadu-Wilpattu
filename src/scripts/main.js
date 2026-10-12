/**
 * Site behaviour. Deliberately small, dependency-free and deferred — it never
 * blocks rendering and contributes nothing measurable to Interaction to Next
 * Paint.
 *
 *   1. mobile navigation drawer (with focus trapping and Escape to close)
 *   2. solid-header-on-scroll state over the hero
 *   3. booking form: keep check-out after check-in
 *   4. gallery lightbox
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- nav ---- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var navEl = document.getElementById('site-nav');

  function setNav(open) {
    if (!toggle || !navEl) return;
    toggle.setAttribute('aria-expanded', String(open));
    navEl.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }

  if (toggle && navEl) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    navEl.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // Reset the drawer if the viewport grows past the mobile breakpoint.
    var mq = window.matchMedia('(min-width: 861px)');
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(
      function () {
        if (mq.matches) setNav(false);
      },
    );
  }

  /* --------------------------------------------------------- hero rotator --- */
  var rotator = document.querySelector('[data-hero-rotator]');
  if (rotator) {
    var slides = rotator.querySelectorAll('[data-hero-slide]');
    var reducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (slides.length > 1 && !reducedMotion) {
      var idx = 0;
      setInterval(function () {
        slides[idx].classList.remove('is-active');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('is-active');
      }, 8500);
    }
  }

  /* ------------------------------------------------------- sticky header --- */
  var header = document.querySelector('[data-header]');
  if (header) {
    // The header is always solid; once the page scrolls it just gains a shadow.
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:120px;height:1px;width:1px;';
    document.body.appendChild(sentinel);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        function (entries) {
          header.classList.toggle('is-stuck', !entries[0].isIntersecting);
        },
        { rootMargin: '0px' },
      ).observe(sentinel);
    }
  }

  /* ----------------------------------------------------- cookie consent --- */
  var CC_KEY = 'raalmadu:cookie-consent';
  var cc = document.querySelector('[data-cookie-consent]');
  var stored = null;
  try { stored = localStorage.getItem(CC_KEY); } catch (e) { /* private mode */ }
  if (cc && !stored) {
    cc.hidden = false;
    requestAnimationFrame(function () { cc.classList.add('is-visible'); });
    var setChoice = function (choice) {
      try { localStorage.setItem(CC_KEY, choice); } catch (e) { /* private mode */ }
      cc.classList.remove('is-visible');
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) { cc.hidden = true; return; }
      setTimeout(function () { cc.hidden = true; }, 450);
    };
    var acceptBtn = cc.querySelector('[data-cookie-accept]');
    var declineBtn = cc.querySelector('[data-cookie-decline]');
    if (acceptBtn) acceptBtn.addEventListener('click', function () { setChoice('accepted'); });
    if (declineBtn) declineBtn.addEventListener('click', function () { setChoice('declined'); });
  }

  /* ------------------------------------------------------ scroll reveals --- */
  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealables = document.querySelectorAll('[data-reveal]');
  if (revealables.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    revealables.forEach(function (el) { revealer.observe(el); });
  } else if (prefersReducedMotion) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------- live radar --- */
  // Pointing at a place in the list holds its blip (and label) lit on the radar.
  var radar = document.querySelector('[data-radar]');
  if (radar) {
    document.querySelectorAll('.nearby__list [data-site]').forEach(function (li) {
      var blip = radar.querySelector('[data-site="' + li.getAttribute('data-site') + '"]');
      if (!blip) return;
      li.addEventListener('mouseenter', function () {
        li.classList.add('is-active');
        blip.classList.add('is-active');
      });
      li.addEventListener('mouseleave', function () {
        li.classList.remove('is-active');
        blip.classList.remove('is-active');
      });
    });
  }

  /* -------------------------------------------------------- booking form --- */
  document.querySelectorAll('[data-booking-form]').forEach(function (form) {
    var checkin = form.querySelector('input[name="checkin"]');
    var checkout = form.querySelector('input[name="checkout"]');
    if (!checkin || !checkout) return;

    function sync() {
      if (!checkin.value) return;
      var next = new Date(checkin.value);
      next.setDate(next.getDate() + 1);
      var min = next.toISOString().slice(0, 10);
      checkout.min = min;
      if (!checkout.value || checkout.value <= checkin.value) checkout.value = min;
    }

    checkin.addEventListener('change', sync);
    sync();
  });

  /* ---------------------------------------------------------- lightbox ---- */
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll('[data-lightbox]'));
    var box = null;
    var index = 0;
    var lastFocus = null;

    function render() {
      var item = items[index];
      var img = item.querySelector('img');
      box.querySelector('.lb__img').src = img.currentSrc || img.src;
      box.querySelector('.lb__img').alt = img.alt;
      box.querySelector('.lb__caption').textContent = img.alt;
      box.querySelector('.lb__count').textContent = index + 1 + ' / ' + items.length;
    }

    function open(i) {
      index = i;
      lastFocus = document.activeElement;
      if (!box) {
        box = document.createElement('div');
        box.className = 'lb';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.setAttribute('aria-label', 'Photo viewer');
        box.innerHTML =
          '<button class="lb__close" type="button" aria-label="Close photo viewer">&times;</button>' +
          '<button class="lb__nav lb__nav--prev" type="button" aria-label="Previous photo">&#8249;</button>' +
          '<figure class="lb__figure"><img class="lb__img" alt="">' +
          '<figcaption class="lb__caption"></figcaption></figure>' +
          '<button class="lb__nav lb__nav--next" type="button" aria-label="Next photo">&#8250;</button>' +
          '<p class="lb__count" aria-live="polite"></p>';
        document.body.appendChild(box);

        box.querySelector('.lb__close').addEventListener('click', close);
        box.querySelector('.lb__nav--prev').addEventListener('click', function () { step(-1); });
        box.querySelector('.lb__nav--next').addEventListener('click', function () { step(1); });
        box.addEventListener('click', function (e) { if (e.target === box) close(); });
      }
      render();
      box.classList.add('is-open');
      document.body.classList.add('nav-open');
      box.querySelector('.lb__close').focus();
    }

    function step(dir) {
      index = (index + dir + items.length) % items.length;
      render();
    }

    function close() {
      if (!box) return;
      box.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      if (lastFocus) lastFocus.focus();
    }

    items.forEach(function (item, i) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        open(i);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (!box || !box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        var focusable = box.querySelectorAll('button');
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
})();
