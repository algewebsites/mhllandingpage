(function () {
  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sleep type handed over from the sleep test (index.html?type=...#better-sleep-call)
  try {
    var t = new URLSearchParams(window.location.search).get('type');
    var typeInput = document.getElementById('cf-type');
    if (t && typeInput) {
      typeInput.value = t.slice(0, 60);
      document.getElementById('cf-type-wrap').hidden = false;
    }
  } catch (e) {}

  // Header border on scroll + mobile sticky CTA (hidden while hero or call section is visible)
  var header = document.querySelector('.header');
  var mobileCta = document.getElementById('mobile-cta');
  var callSection = document.getElementById('better-sleep-call');
  function onScroll() {
    var sy = window.scrollY;
    header.classList.toggle('scrolled', sy > 8);
    if (mobileCta && callSection) {
      var r = callSection.getBoundingClientRect();
      var inCall = r.top < window.innerHeight && r.bottom > 0;
      mobileCta.classList.toggle('show', sy > 600 && !inCall);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Newsletter → Brevo (double opt-in form)
  var nl = document.getElementById('nl-form');
  if (nl) {
    var msg = document.getElementById('nl-msg');
    nl.addEventListener('submit', function (ev) {
      ev.preventDefault();
      msg.className = 'nl-msg';
      var email = nl.querySelector('input[name=EMAIL]');
      var consent = nl.querySelector('input[name=OPT_IN]');
      if (!email.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; msg.classList.add('err'); email.focus(); return; }
      if (!consent.checked) { msg.textContent = 'Please confirm that you want to receive the newsletter.'; msg.classList.add('err'); return; }

      var action = nl.getAttribute('data-brevo-action');
      if (!action || action.indexOf('BREVO_') === 0) {
        msg.textContent = 'Newsletter is not connected yet (Brevo form URL missing).';
        msg.classList.add('err');
        return;
      }
      var btn = nl.querySelector('button');
      btn.disabled = true;
      fetch(action + (action.indexOf('?') > -1 ? '&' : '?') + 'isAjax=1', { method: 'POST', body: new FormData(nl) })
        .then(function (r) { return r.json().catch(function () { return { success: r.ok }; }); })
        .then(function (d) {
          if (d && d.success) {
            msg.textContent = 'Almost done! Please check your inbox and confirm your subscription.';
            msg.classList.add('ok');
            nl.reset();
          } else {
            throw new Error('fail');
          }
        })
        .catch(function () {
          msg.textContent = 'Something went wrong. Please try again in a moment.';
          msg.classList.add('err');
        })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
