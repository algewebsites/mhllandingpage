"""Builds one 1-page sleep reset per sleep type.

Usage (from the project folder):
    python3 downloads/source/build_type_resets.py

Writes downloads/source/reset-<slug>.html and renders downloads/sleep-reset-<slug>.pdf
with headless Google Chrome. Edit the TYPES content below, then run again.
"""
import html
import os
import re
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
DOWNLOADS = os.path.dirname(HERE)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

TYPES = [
    {
        "slug": "wired-mind",
        "name": "The Wired Mind",
        "title_html": 'The Wired <span class="mark">Mind</span>',
        "aside": "Your body is tired. Your mind didn’t get the memo.",
        "intro": "You go to bed exhausted, but your nervous system is still on duty. It replays the day, plans tomorrow and sometimes wakes you at 3 a.m. to do it all again. For you, better sleep starts before your head hits the pillow.",
        "signs": [
            "You feel tired but wired at night",
            "Your to-do list starts the second you lie down",
            "You wake up between 2 and 4 a.m. and your mind starts working",
            "Small noises keep you awake",
            "If you track: your resting heart rate runs higher, or your HRV lower, at night",
        ],
        "why": [
            ("What’s going on", "Stress hormones are still up at bedtime. Your body wants to rest, but your nervous system keeps scanning for things to solve."),
            ("Feels like", "Racing thoughts, replaying conversations, lying awake for ages, light sleep."),
            ("The good news", "A calm, repeated evening routine teaches your nervous system that it’s safe to switch off."),
        ],
        "tips": [
            ("Screen-free last 2 hours", "No work and no work laptop in the last two hours before bed. Phone out of the bedroom."),
            ("Brain dump on paper", "Write tomorrow’s to-do list and whatever is on your mind. Once it’s on paper, your brain can let it go."),
            ("10 minutes of slow breathing", "In for 4, out for 6. Longer exhales tell your body it can relax."),
            ("Something calm for your brain", "A book, gentle yoga, sound healing, or a calm series on a small screen in night mode. Nothing exciting."),
            ("Same routine, same order", "Do your wind-down in the same order every night. Repetition is what makes it work."),
        ],
        "watch": "How long it takes you to fall asleep, and how you feel in the morning.",
    },
    {
        "slug": "late-night-fuel",
        "name": "The Late-Night Fuel",
        "title_html": 'The Late-Night <span class="mark">Fuel</span>',
        "aside": "You’re asleep. Your body is still working.",
        "intro": "Alcohol, late caffeine or a late dinner keep your system busy at night. You might fall asleep easily, but your heart works harder and your sleep gets lighter, especially in the second half of the night. The good news: this type often changes fastest.",
        "signs": [
            "You fall asleep fine, but wake up unrefreshed",
            "A glass of wine is how you switch off",
            "Your last coffee, tea or matcha is after lunch",
            "Dinner often happens late, close to bedtime",
            "If you track: resting heart rate up, HRV down after drinks or late dinners",
        ],
        "why": [
            ("What’s going on", "Your body is still processing alcohol, caffeine or a big meal while it should be recovering."),
            ("Feels like", "Sleeping, but not resting. Waking up in the early hours. Groggy mornings."),
            ("The good news", "Small changes to your evenings can show up in how you feel within days."),
        ],
        "tips": [
            ("Alcohol-free evenings", "Try one week without alcohol. Keep the ritual: a nice glass, but with something alcohol-free."),
            ("Coffee cut-off at noon", "Last coffee, black tea, matcha or energy drink before 12 p.m."),
            ("Dinner 2 to 3 hours before bed", "If you get hungry later, have something small and light."),
            ("Drink during the day", "Get most of your water in before the evening, so you don’t wake up thirsty or for the bathroom."),
            ("A new evening ritual", "Herbal tea, a short walk or a book instead of the late snack or drink."),
        ],
        "watch": "How rested you feel when you wake up, and whether early-morning wake-ups change.",
    },
    {
        "slug": "shifting-clock",
        "name": "The Shifting Clock",
        "title_html": 'The Shifting <span class="mark">Clock</span>',
        "aside": "Your sleep isn’t short. It’s out of sync.",
        "intro": "Your bedtime and wake-up time keep moving, so your body never quite knows when night starts. Sleeping in on weekends feels great, but it works like a small jet lag every Monday. Your body loves rhythm. Give it one fixed point and the rest follows.",
        "signs": [
            "Your sleep times change by an hour or more during the week",
            "You sleep in on weekends, and Monday feels like jet lag",
            "You’re wide awake on Sunday night",
            "Your energy dips at random times of the day",
            "If you track: your bed and wake-up times look all over the place",
        ],
        "why": [
            ("What’s going on", "Your inner clock keeps getting reset, so sleepiness doesn’t show up when you need it."),
            ("Feels like", "Lying awake when you want to sleep, and tired when you need to be awake."),
            ("The good news", "A steady morning anchor resets your clock, often within a week or two."),
        ],
        "tips": [
            ("One fixed wake-up time", "Same time all 7 days, weekend included, give or take 30 minutes."),
            ("Daylight in the morning", "Get outside within an hour of waking. Even 5 to 10 minutes counts."),
            ("Go to bed when sleepy", "Start your wind-down at the same time, but go to bed when you feel sleepy, not just because the clock says so."),
            ("Dim evenings, bright mornings", "Soft, warm light in the evening. As much light as possible in the morning."),
            ("Weekend rule", "Sleep in for 30 minutes at most. Tired? A short nap in the early afternoon works better."),
        ],
        "watch": "How quickly you fall asleep, and how you feel in the morning.",
    },
    {
        "slug": "steady-sleeper",
        "name": "The Steady Sleeper",
        "title_html": 'The Steady <span class="mark">Sleeper</span>',
        "aside": "Your basics are solid. Now let’s fine-tune.",
        "intro": "Your answers don’t show one big sleep blocker. If you still wake up tired, the reason may be less obvious: stress during the day, your cycle or hormones, or simply needing more sleep than you get. Your next step: listen to your body, before any app.",
        "signs": [
            "You sleep okay, but don’t feel truly rested",
            "Your energy changes with stress or your cycle",
            "Daytime stress stays in your body until the evening",
            "You check your sleep score before checking in with yourself",
            "Your sleep has changed over the last years",
        ],
        "why": [
            ("What’s going on", "Your nights are fine, but your days may not give your nervous system enough moments to come down."),
            ("Feels like", "Okay, but not great. Tired in the afternoon. Good nights and bad nights without a clear reason."),
            ("The good news", "Small adjustments and a bit of self-observation usually reveal your pattern."),
        ],
        "tips": [
            ("Feel-first check", "Every morning, rate your energy from 1 to 5 before you look at any app or score."),
            ("30 more minutes", "For one week, give yourself 30 minutes more in bed. Maybe you simply need more sleep."),
            ("Calm moments by day", "5 to 10 minutes a day for your nervous system: yoga, breathing, a phone-free walk or sound healing."),
            ("Notice your cycle", "If you have a cycle, note where you are in it. Hormones can change how you sleep."),
            ("Protect your last hour", "Keep the last hour before bed calm and screen-light, with a routine that feels good to you."),
        ],
        "watch": "Which evenings come before your best mornings.",
    },
]

STYLE_EXTRA = """
.page { gap: 3mm; padding-top: 9mm; }
.head { grid-template-columns: minmax(0, 1fr) 70mm; }
.check { padding: 3mm 3.6mm; }
.check li { font-size: 7.6pt; }
.check h2 { margin: 1mm 0 1.6mm; }
.check .verdict { margin-top: 1.6mm; padding-top: 1.4mm; }
.intro { max-width: 112mm; }
.why { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2.6mm; }
.why div { background: var(--linen-0); border: 1px solid var(--linen-200); border-radius: 3.5mm; padding: 3mm 3.4mm; }
.why dt { font: 500 6.4pt/1 var(--label); letter-spacing: .12em; text-transform: uppercase; color: var(--gold-700); margin-bottom: 1.4mm; }
.why dd { margin: 0; font-size: 8pt; line-height: 1.38; color: var(--ink-700); }
.why div:last-child { background: var(--sunshine-100); border-color: var(--sunshine-300); }
.tips { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2.6mm; margin-top: 2.4mm; }
.tip { background: var(--linen-0); border: 1px solid var(--linen-200); border-radius: 3.5mm; padding: 2.6mm 3.2mm; display: grid; grid-template-columns: 5.4mm minmax(0, 1fr); gap: 2mm; align-items: start; }
.tip .num { width: 5mm; height: 5mm; font-size: 7.4pt; }
.tip b { display: block; font: 800 9.2pt/1.15 var(--statement); margin-bottom: .9mm; }
.tip span { font-size: 7.8pt; line-height: 1.36; color: var(--ink-700); }
.tip.watch { background: var(--ink-900); border-color: var(--ink-900); color: var(--linen-50); grid-template-columns: 1fr; }
.tip.watch .kicker { color: var(--sunshine-500); }
.tip.watch p { font-size: 7.8pt; line-height: 1.38; color: var(--linen-200); }
.tip.watch p strong { color: var(--linen-50); }
.tracker { display: grid; grid-template-columns: minmax(0, 1fr) 52mm; gap: 4.5mm; align-items: start; margin-top: 2.4mm; }
.foot .cta b { font-size: 8.2pt; }
"""

PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{name}: Your 1-Page Sleep Reset | My Healthy Longevity</title>
<style>
{base_style}
{extra_style}
</style>
</head>
<body>
<div class="page">

  <header class="head">
    <div>
      <div class="brand"><span class="wordmark">my healthy <em>longevity</em></span></div>
      <span class="sticker">Your 1-page sleep reset</span>
      <h1 style="margin-top:3mm">{title_html}
        <span class="aside">{aside}</span></h1>
      <p class="intro">{intro}</p>
    </div>
    <div class="check">
      <p class="kicker">Sound like you?</p>
      <h2>Tick what you recognise</h2>
      <ul>
{signs}
      </ul>
      <p class="verdict"><strong>2 or more ticks?</strong> Then the tips below are made for you.</p>
    </div>
  </header>

  <dl class="why">
{why}
  </dl>

  <section>
    <div class="sec-title"><h2>Your tips to sleep better</h2><span>Start tonight. Pick one or two, not all five at once.</span></div>
    <div class="tips">
{tips}
      <div class="tip watch">
        <div>
          <p class="kicker">What to notice</p>
          <p style="margin-top:1.4mm"><strong>{watch}</strong></p>
          <p style="margin-top:1.4mm">Feel first, check second: rate how you feel before you look at any app.</p>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="sec-title"><h2>Your 7-night check-in</h2><span>Judge by the trend over a week, never by one night.</span></div>
    <div class="tracker">
      <table aria-label="7-night check-in">
        <thead><tr><th style="text-align:left">Night</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr></thead>
        <tbody>
          <tr><th>My tips done? ✓</th><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><th>Morning energy 1–5<small>before you open any app</small></th><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><th>Hours slept</th><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><th>Resting heart rate<small>optional, if you track</small></th><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </tbody>
      </table>
      <p class="rule"><strong>No wearable? No problem.</strong> How you feel in the morning is the most honest measurement there is. If you do track and your feeling and your score disagree, trust the feeling.</p>
    </div>
  </section>

  <section class="bottom">
    <div class="prompt">
      <p class="kicker">Bonus: did it work?</p>
      <h3>Ask your AI <em>after night 7.</em></h3>
<pre>Here are my 7 nights: [paste your check-in or a screenshot of your app’s weekly view, without your name]. My sleep type is {name} and I tried [your tips]. Compare nights 1–3 with nights 5–7. Did my morning energy, sleep or resting heart rate change? Explain it simply, and don’t diagnose anything.</pre>
      <p>Works with ChatGPT, Claude, Gemini or your wearable’s own AI assistant.</p>
    </div>
    <div class="doctor">
      <p class="kicker">Please don’t skip this</p>
      <h3>Talk to a doctor if…</h3>
      <ul>
        <li>you snore loudly, gasp, or someone has noticed breathing pauses</li>
        <li>you’ve slept badly at least 3 nights a week for 3 months or more</li>
        <li>you’re exhausted no matter what you change, or feel low most days</li>
        <li>your sleep changed with perimenopause and it’s affecting your life</li>
      </ul>
    </div>
  </section>

  <footer class="foot">
    <p class="cta">Want help with your sleep, one on one?<b>Book your free Better Sleep Call: link in bio @myhealthylongevity, or simply reply to my email.</b></p>
    <p class="legal">© 2026 My Healthy Longevity. For education and self-awareness only. This is not medical advice and doesn’t replace a diagnosis or treatment by a doctor.</p>
  </footer>
</div>
</body>
</html>
"""


def esc(t):
    return html.escape(t, quote=False)


def main():
    src = open(os.path.join(HERE, "sleep-reset-source.html"), encoding="utf-8").read()
    base_style = re.search(r"<style>(.*?)</style>", src, re.S).group(1)
    for t in TYPES:
        page = PAGE.format(
            name=esc(t["name"]),
            base_style=base_style,
            extra_style=STYLE_EXTRA,
            title_html=t["title_html"],
            aside=esc(t["aside"]),
            intro=esc(t["intro"]),
            signs="\n".join(f'        <li><span class="box"></span><span>{esc(s)}</span></li>' for s in t["signs"]),
            why="\n".join(f"    <div><dt>{esc(a)}</dt><dd>{esc(b)}</dd></div>" for a, b in t["why"]),
            tips="\n".join(
                f'      <div class="tip"><span class="num">{i}</span><div><b>{esc(a)}</b><span>{esc(b)}</span></div></div>'
                for i, (a, b) in enumerate(t["tips"], 1)
            ),
            watch=esc(t["watch"]),
        )
        html_path = os.path.join(HERE, f"reset-{t['slug']}.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(page)
        pdf_path = os.path.join(DOWNLOADS, f"sleep-reset-{t['slug']}.pdf")
        subprocess.run(
            [CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
             "--allow-file-access-from-files", f"--print-to-pdf={pdf_path}",
             "file://" + html_path],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        print("built", os.path.relpath(pdf_path, DOWNLOADS))


if __name__ == "__main__":
    main()
