/* My Healthy Longevity – "Why do you wake up tired?" sleep quiz
   Answers are scored in the browser and never sent anywhere.
   Only the email (and consent) goes to Brevo when someone asks for the 1-page reset. */
(function () {
  'use strict';

  /* ---------- Questions ----------
     Each option adds points to one or more sleep types:
     W = The Wired Mind, F = The Late-Night Fuel, C = The Shifting Clock
     doctor: true flags "Check with a doctor first" */
  var QUESTIONS = [
    {
      id: 'morning',
      q: 'How do you usually feel 30 minutes after waking up?',
      options: [
        { label: 'Fresh and ready to go', tired: 0 },
        { label: 'Fine, once the coffee kicks in', tired: 1 },
        { label: 'Groggy, like I need another hour', tired: 2 },
        { label: 'Exhausted, even after a full night', tired: 3 }
      ]
    },
    {
      id: 'switchoff',
      q: 'When your head hits the pillow, your mind…',
      options: [
        { label: 'switches off within 15 minutes', W: 0 },
        { label: 'replays the day for a while', W: 1 },
        { label: 'starts tomorrow’s to-do list', W: 2 },
        { label: 'races, and I can’t make it stop', W: 3 }
      ]
    },
    {
      id: 'nightwake',
      q: 'Do you wake up in the middle of the night, around 2 to 4 a.m.?',
      options: [
        { label: 'Rarely', W: 0 },
        { label: 'Sometimes, and I fall back asleep quickly', W: 1 },
        { label: 'Often, and my mind starts working', W: 2, F: 1 },
        { label: 'Most nights, and I lie awake for a long time', W: 2, F: 1 }
      ]
    },
    {
      id: 'alcohol',
      q: 'On how many evenings a week do you drink alcohol?',
      options: [
        { label: 'None', F: 0 },
        { label: '1 to 2', F: 1 },
        { label: '3 to 4', F: 2 },
        { label: '5 or more', F: 3 }
      ]
    },
    {
      id: 'caffeine',
      q: 'Your last coffee, black tea, matcha or energy drink is usually…',
      options: [
        { label: 'before 10 a.m.', F: 0 },
        { label: 'before noon', F: 0 },
        { label: 'in the early afternoon', F: 1 },
        { label: 'after 3 p.m.', F: 2 }
      ]
    },
    {
      id: 'timing',
      q: 'How much do your bedtime and wake-up time change during the week, weekends included?',
      options: [
        { label: 'Less than 30 minutes', C: 0 },
        { label: 'About an hour', C: 1 },
        { label: '1 to 2 hours, weekends run later', C: 2 },
        { label: 'All over the place (shifts, travel, kids, late nights)', C: 3 }
      ]
    },
    {
      id: 'snoring',
      q: 'Has anyone told you that you snore loudly, gasp or stop breathing in your sleep?',
      options: [
        { label: 'No' },
        { label: 'Not sure, I sleep alone' },
        { label: 'Yes', doctor: 'apnea' }
      ]
    },
    {
      id: 'chronic',
      q: 'Have you had trouble falling or staying asleep at least 3 nights a week for 3 months or more?',
      options: [
        { label: 'No' },
        { label: 'Not sure' },
        { label: 'Yes', doctor: 'insomnia' }
      ]
    },
    {
      id: 'wearable',
      q: 'Do you track your sleep with a wearable?',
      hint: 'This only changes what your result tells you to watch.',
      options: [
        { label: 'Yes (Oura, Apple Watch, Garmin, Whoop, Fitbit…)', wearable: true },
        { label: 'No, just me and my feelings', wearable: false }
      ]
    }
  ];

  /* ---------- Results ---------- */
  var RESULTS = {
    W: {
      name: 'The Wired Mind',
      headline: 'Your body is tired. Your mind didn’t get the memo.',
      body: [
        'You go to bed exhausted, but your nervous system is still on duty. It replays the day, plans tomorrow and wakes you at 3 a.m. to do it all again.',
        'That’s why 8 hours in bed don’t feel like 8 hours of recovery. For you, better sleep starts before your head hits the pillow.'
      ],
      experiment: 'A 10-minute switch-off ritual',
      steps: [
        'Same time every evening: lights low, phone out of the bedroom.',
        'Write tomorrow’s to-do list on paper, so your brain can let it go.',
        'Then 10 minutes of slow breathing (in for 4, out for 6) or a guided wind-down.'
      ],
      watchWearable: 'Your overnight resting heart rate and HRV across all 7 nights, not one single night.',
      watchFeel: 'How long it takes you to fall asleep, and your morning energy from 1 to 5.',
      coach: 'As a Wired Mind, you don’t need more sleep hacks. You need a way to switch off. Together we’ll build a wind-down that fits your evenings, and check in your data whether it’s working.'
    },
    F: {
      name: 'The Late-Night Fuel',
      headline: 'You’re asleep. Your body is still working.',
      body: [
        'Alcohol, late caffeine or a late dinner keep your system busy at night. You might fall asleep easily, but your heart works harder and your sleep gets lighter, especially in the second half of the night.',
        'The good news: this is the fastest type to fix, and many people see the difference in their data within days.'
      ],
      experiment: '7 clean evenings',
      steps: [
        'No alcohol for 7 nights.',
        'Last coffee, tea or energy drink before 12 p.m.',
        'Finish dinner at least 2 to 3 hours before bed. Keep everything else the same.'
      ],
      watchWearable: 'Your overnight resting heart rate and HRV. Compare night 1 with night 7.',
      watchFeel: 'How rested you feel when you wake up, and whether the 2 to 4 a.m. wake-ups change.',
      coach: 'Late-Night Fuel is the type that changes fastest. Together we’ll make your 7 clean evenings realistic for your real life, dinners and weekends included.'
    },
    C: {
      name: 'The Shifting Clock',
      headline: 'Your sleep isn’t short. It’s out of sync.',
      body: [
        'Your bedtime and wake-up time keep moving, so your body never quite knows when night starts. Sleeping in on weekends feels great, but it works like a small jet lag every Monday.',
        'Your body loves rhythm. Give it one fixed point and the rest follows.'
      ],
      experiment: 'One fixed wake-up time',
      steps: [
        'Wake up at the same time all 7 days, weekend included (give or take 30 minutes).',
        'Get daylight into your eyes within an hour of waking, even 5 minutes outside counts.',
        'Go to bed when you feel sleepy, not just because the clock says so.'
      ],
      watchWearable: 'How regular your sleep times become, and your resting heart rate trend.',
      watchFeel: 'How quickly you fall asleep, and your morning energy from 1 to 5.',
      coach: 'As a Shifting Clock, you need one anchor, not a perfect schedule. Together we’ll find a wake-up time that survives your actual weekends.'
    },
    S: {
      name: 'The Steady Sleeper',
      headline: 'Your basics are solid. Now let’s fine-tune.',
      body: [
        'Your answers don’t show one big sleep blocker. If you still wake up tired, the reason may be less obvious: stress during the day, your cycle or hormones, or simply needing more sleep than you get.',
        'Your next step is to find out what your body is really telling you, before any app does.'
      ],
      experiment: 'The feel-first check',
      steps: [
        'For 7 mornings, rate your energy from 1 to 5 before you look at any app or score.',
        'Then note how long you slept.',
        'After 7 days, look for the pattern: which nights gave you a 4 or a 5?'
      ],
      watchWearable: 'Whether your own rating matches your sleep score. Trust the rating when they disagree.',
      watchFeel: 'Which evenings come before your best mornings.',
      coach: 'As a Steady Sleeper, the reason you still feel tired is often less obvious. That’s exactly where looking at your answers and your data together makes the difference.'
    }
  };

  var DOCTOR = {
    apnea: 'Loud snoring, gasping or breathing pauses can be a sign of sleep apnea.',
    insomnia: 'Poor sleep on most nights for 3 months or more can be chronic insomnia.'
  };

  /* ---------- State ---------- */
  var answers = new Array(QUESTIONS.length);
  var current = 0;

  var $ = function (sel) { return document.querySelector(sel); };
  var screens = {
    intro: $('#screen-intro'),
    question: $('#screen-question'),
    result: $('#screen-result')
  };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
    var focusTarget = screens[name].querySelector('[data-focus]');
    if (focusTarget) focusTarget.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* ---------- Question screen ---------- */
  var qText = $('#q-text');
  var qHint = $('#q-hint');
  var qOptions = $('#q-options');
  var qCount = $('#q-count');
  var qBar = $('#q-bar');
  var qBack = $('#q-back');

  function renderQuestion() {
    var item = QUESTIONS[current];
    qCount.textContent = 'Question ' + (current + 1) + ' of ' + QUESTIONS.length;
    qBar.style.width = Math.round((current / QUESTIONS.length) * 100) + '%';
    qBar.parentNode.setAttribute('aria-valuenow', String(current));
    qText.textContent = item.q;
    qHint.textContent = item.hint || '';
    qHint.hidden = !item.hint;
    qOptions.innerHTML = '';
    item.options.forEach(function (opt, i) {
      var id = 'opt-' + item.id + '-' + i;
      var label = document.createElement('label');
      label.className = 'option';
      label.setAttribute('for', id);
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'q-' + item.id;
      input.id = id;
      input.value = String(i);
      if (answers[current] === i) input.checked = true;
      var span = document.createElement('span');
      span.textContent = opt.label;
      label.appendChild(input);
      label.appendChild(span);
      qOptions.appendChild(label);
      // Tap or click: answer and move on. Keyboard (arrow keys): only select, then Enter or "Next".
      input.addEventListener('change', function () { answers[current] = i; updateNext(); });
      input.addEventListener('click', function () { if (viaPointer) choose(i); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); choose(i); } });
    });
    qBack.hidden = current === 0;
    qNext.textContent = current === QUESTIONS.length - 1 ? 'See my result' : 'Next';
    updateNext();
    var first = qOptions.querySelector('input:checked') || qOptions.querySelector('input');
    if (first) first.focus({ preventScroll: true });
  }

  var qNext = $('#q-next');
  var viaPointer = false;
  qOptions.addEventListener('pointerdown', function () { viaPointer = true; });
  document.addEventListener('keydown', function () { viaPointer = false; });
  function updateNext() { qNext.disabled = answers[current] === undefined; }
  qNext.addEventListener('click', function () {
    if (answers[current] !== undefined) choose(answers[current]);
  });

  var advancing = false;
  function choose(i) {
    if (advancing) return;
    answers[current] = i;
    advancing = true;
    setTimeout(function () {
      advancing = false;
      if (current < QUESTIONS.length - 1) {
        current += 1;
        renderQuestion();
      } else {
        qBar.style.width = '100%';
        renderResult();
        show('result');
      }
    }, reduceMotion ? 0 : 260);
  }

  qBack.addEventListener('click', function () {
    if (current > 0) { current -= 1; renderQuestion(); }
  });

  /* ---------- Scoring ---------- */
  function score() {
    var s = { W: 0, F: 0, C: 0, tired: 0, doctor: [], wearable: true };
    QUESTIONS.forEach(function (item, qi) {
      var opt = item.options[answers[qi]];
      if (!opt) return;
      ['W', 'F', 'C', 'tired'].forEach(function (k) { if (opt[k]) s[k] += opt[k]; });
      if (opt.doctor) s.doctor.push(opt.doctor);
      if (typeof opt.wearable === 'boolean') s.wearable = opt.wearable;
    });
    // The clock has one question (max 3); scale it to the other types (max 5).
    var scaled = { W: s.W, F: s.F, C: s.C * 5 / 3 };
    var order = ['W', 'F', 'C']; // tie-break: wired mind first
    var type = order.reduce(function (best, k) { return scaled[k] > scaled[best] ? k : best; }, 'W');
    if (scaled[type] < 2) type = 'S';
    s.type = type;
    return s;
  }

  /* ---------- Result screen ---------- */
  function renderResult() {
    var s = score();
    var r = RESULTS[s.type];
    $('#r-name').textContent = r.name;
    $('#r-headline').textContent = r.headline;
    $('#r-body').innerHTML = '';
    r.body.forEach(function (p) {
      var el = document.createElement('p');
      el.textContent = p;
      $('#r-body').appendChild(el);
    });
    $('#r-experiment').textContent = r.experiment;
    var steps = $('#r-steps');
    steps.innerHTML = '';
    r.steps.forEach(function (t) {
      var li = document.createElement('li');
      li.textContent = t;
      steps.appendChild(li);
    });
    $('#r-watch-label').textContent = s.wearable ? 'Watch in your data' : 'Watch how you feel';
    $('#r-watch').textContent = s.wearable ? r.watchWearable : r.watchFeel;

    var doc = $('#r-doctor');
    if (s.doctor.length) {
      var list = $('#r-doctor-reasons');
      list.innerHTML = '';
      s.doctor.forEach(function (d) {
        var li = document.createElement('li');
        li.textContent = DOCTOR[d];
        list.appendChild(li);
      });
      doc.hidden = false;
    } else {
      doc.hidden = true;
    }
    var coachLine = $('#coach-line');
    if (coachLine && r.coach) coachLine.textContent = r.coach;
    var coachCta = $('#coach-cta');
    if (coachCta) coachCta.setAttribute('href', 'index.html?type=' + encodeURIComponent(r.name) + '#better-sleep-call');

    var form = $('#reset-form');
    if (form) form.setAttribute('data-sleep-type', r.name);
    var typeField = $('#reset-type');
    if (typeField) typeField.value = r.name;
    var dl = $('#reset-download');
    if (dl) {
      var slug = r.name.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
      dl.setAttribute('href', 'downloads/sleep-reset-' + slug + '.pdf');
    }
  }

  // Show the screen first: an element inside a hidden screen can't take focus.
  $('#start').addEventListener('click', function () {
    current = 0;
    show('question');
    renderQuestion();
  });
  $('#retake').addEventListener('click', function () {
    answers = new Array(QUESTIONS.length);
    current = 0;
    show('question');
    renderQuestion();
  });

  /* ---------- Brevo signup (double opt-in) ---------- */
  var form = $('#reset-form');
  if (form) {
    var msg = $('#reset-msg');
    var success = $('#reset-success');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      msg.textContent = '';
      msg.className = 'form-msg';
      var email = form.querySelector('input[name=EMAIL]');
      var consent = form.querySelector('input[name=OPT_IN]');
      if (!email.value || !email.checkValidity()) {
        msg.textContent = 'Please enter a valid email address.';
        msg.classList.add('err');
        email.focus();
        return;
      }
      if (!consent.checked) {
        msg.textContent = 'Please tick the box so I’m allowed to save your email.';
        msg.classList.add('err');
        consent.focus();
        return;
      }
      var action = form.getAttribute('data-brevo-action');
      if (!action || action.indexOf('BREVO_') === 0) {
        msg.textContent = 'The signup isn’t connected yet (Brevo form link missing).';
        msg.classList.add('err');
        return;
      }
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      fetch(action + (action.indexOf('?') > -1 ? '&' : '?') + 'isAjax=1', { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json().catch(function () { return { success: r.ok }; }); })
        .then(function (d) {
          if (d && d.success) {
            form.hidden = true;
            success.hidden = false;
            success.focus();
          } else {
            throw new Error('Brevo did not confirm');
          }
        })
        .catch(function () {
          // Fallback: send the form the classic way in a new tab, so nobody gets stuck.
          form.setAttribute('action', action);
          form.setAttribute('method', 'POST');
          form.setAttribute('target', '_blank');
          HTMLFormElement.prototype.submit.call(form);
          form.hidden = true;
          success.hidden = false;
          success.focus();
        })
        .finally(function () {
          btn.disabled = false;
          btn.removeAttribute('aria-busy');
        });
    });
  }

  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
