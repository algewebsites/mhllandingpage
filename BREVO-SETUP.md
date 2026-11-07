# Brevo setup: personal sleep reset per sleep type

**Goal:** someone takes the sleep test, enters her email, confirms it (double opt-in), and automatically gets the 1-page reset for *her* sleep type.

The quiz already sends two fields to Brevo: `EMAIL` and `SLEEP_TYPE`. `SLEEP_TYPE` contains one of:
`The Wired Mind` · `The Late-Night Fuel` · `The Shifting Clock` · `The Steady Sleeper`

> Brevo changes its menus now and then. If a label below looks slightly different in your account, look for the closest match.

---

## Step 1: Create the contact attribute
**Contacts → Settings → Contact attributes → Add a new attribute**
- Name: `SLEEP_TYPE`
- Type: **Text**

## Step 2: Create the list
**Contacts → Lists → Create a list** → name it `Sleep Reset`.

## Step 3: Create the subscription form
**Contacts → Forms → Create a subscription form**
1. Add the fields **Email** and **SLEEP_TYPE**. If Brevo offers a *hidden field* option, use it for SLEEP_TYPE. If not, a normal text field is fine: the quiz uses its own design and fills the field automatically.
2. Add the opt-in checkbox (Brevo field `OPT_IN`).
3. List: `Sleep Reset`.
4. **Double opt-in: ON**, with a short confirmation email in English (see text below).
5. Save → **Share → Embed** → copy the form action URL (`https://….sibforms.com/serve/…`) and **send it to me** (or paste it into `data-brevo-action="…"` in `sleep-quiz.html`).

**Confirmation email (double opt-in):**
> **Subject:** One click and your sleep reset is on its way
> Hi lovely, please confirm your email with the button below, and I’ll send you your personal 1-page sleep reset right away. 🌙
> [Confirm my email]
> Alissa, My Healthy Longevity

## Step 4: Upload the PDFs (happens with Netlify)
After the site is live, the PDFs are available at:
- `https://healthy-longevity.netlify.app/downloads/sleep-reset-wired-mind.pdf`
- `https://healthy-longevity.netlify.app/downloads/sleep-reset-late-night-fuel.pdf`
- `https://healthy-longevity.netlify.app/downloads/sleep-reset-shifting-clock.pdf`
- `https://healthy-longevity.netlify.app/downloads/sleep-reset-steady-sleeper.pdf`
- Fallback (general reset): `https://healthy-longevity.netlify.app/downloads/why-you-wake-up-tired-sleep-reset.pdf`

Open each link once in your browser to check it works.

## Step 5: The automation
**Automations → Create an automation → from scratch**
1. **Trigger:** *Contact added to a list* → `Sleep Reset` (this fires after the double opt-in confirmation).
2. **Condition / If-else split:** contact attribute `SLEEP_TYPE` **is equal to** `The Wired Mind`
   - Yes → **Send email:** "Wired Mind" email (below)
   - No → next condition: `The Late-Night Fuel` → email
   - No → next condition: `The Shifting Clock` → email
   - No → next condition: `The Steady Sleeper` → email
   - No (empty or anything else) → **Send email:** general reset (fallback)
3. Activate the automation.

> If your Brevo plan does not include conditions in automations, tell me. Alternative: one welcome email with all four PDFs listed, plus a download button directly in the quiz result.

## Step 6: Test
Take the quiz yourself 4 times with your own email (you can use `yourname+wired@gmail.com`, `yourname+fuel@gmail.com` and so on, they all land in your inbox). Confirm each time and check you get the right PDF.

---

## The 5 welcome emails

Sender name: **Alissa | My Healthy Longevity**.

### 1. The Wired Mind
**Subject:** Your reset is here, Wired Mind 🌙
**Preview text:** Your body is tired. Your mind didn’t get the memo.

> Hi lovely,
>
> here it is: your 1-page sleep reset for **The Wired Mind**.
> **[Download my sleep reset]** → `https://healthy-longevity.netlify.app/downloads/sleep-reset-wired-mind.pdf`
>
> Quick reminder of what’s going on: you go to bed exhausted, but your nervous system is still on duty. That’s why 8 hours in bed don’t always feel like 8 hours of recovery.
>
> My tip for tonight: write tomorrow’s to-do list on paper before bed. Once it’s on paper, your brain can let it go.
>
> Pick one or two tips from the page, not all five. Then just notice how you feel in the morning.
>
> And if you’d like to look at your nights together: book your free 30-minute **Better Sleep Call** → `https://healthy-longevity.netlify.app/#better-sleep-call`
>
> Sleep well,
> Alissa

### 2. The Late-Night Fuel
**Subject:** Your reset is here, Late-Night Fuel 🌙
**Preview text:** You’re asleep. Your body is still working.

> Hi lovely,
>
> here it is: your 1-page sleep reset for **The Late-Night Fuel**.
> **[Download my sleep reset]** → `https://healthy-longevity.netlify.app/downloads/sleep-reset-late-night-fuel.pdf`
>
> The good news first: this is the type that often changes fastest. Alcohol, late coffee or a late dinner keep your body busy at night, and small changes to your evenings can show up in how you feel within days.
>
> My tip for tonight: if you love your evening glass, keep the ritual and swap what’s in it.
>
> Pick one or two tips from the page, not all five. Then just notice how you feel in the morning.
>
> Want help making it work with your real life, dinners and weekends included? Book your free 30-minute **Better Sleep Call** → `https://healthy-longevity.netlify.app/#better-sleep-call`
>
> Sleep well,
> Alissa

### 3. The Shifting Clock
**Subject:** Your reset is here, Shifting Clock 🌙
**Preview text:** Your sleep isn’t short. It’s out of sync.

> Hi lovely,
>
> here it is: your 1-page sleep reset for **The Shifting Clock**.
> **[Download my sleep reset]** → `https://healthy-longevity.netlify.app/downloads/sleep-reset-shifting-clock.pdf`
>
> Your bedtime and wake-up time keep moving, so your body never quite knows when night starts. Your body loves rhythm: give it one fixed point and the rest follows.
>
> My tip for tomorrow morning: get outside within an hour of waking up. Even 5 minutes of daylight counts.
>
> Pick one or two tips from the page, not all five. Then just notice how you feel in the morning.
>
> Want to find a rhythm that survives your actual weekends? Book your free 30-minute **Better Sleep Call** → `https://healthy-longevity.netlify.app/#better-sleep-call`
>
> Sleep well,
> Alissa

### 4. The Steady Sleeper
**Subject:** Your reset is here, Steady Sleeper 🌙
**Preview text:** Your basics are solid. Now let’s fine-tune.

> Hi lovely,
>
> here it is: your 1-page sleep reset for **The Steady Sleeper**.
> **[Download my sleep reset]** → `https://healthy-longevity.netlify.app/downloads/sleep-reset-steady-sleeper.pdf`
>
> Your answers didn’t show one big sleep blocker. If you still wake up tired, the reason is often less obvious: stress during the day, your cycle or hormones, or simply needing more sleep than you get.
>
> My tip for tomorrow morning: rate your energy from 1 to 5 before you look at any app. Feel first, check second.
>
> Pick one or two tips from the page, not all five. Then notice which evenings come before your best mornings.
>
> If you’d like to find your pattern together: book your free 30-minute **Better Sleep Call** → `https://healthy-longevity.netlify.app/#better-sleep-call`
>
> Sleep well,
> Alissa

### 5. Fallback (no sleep type)
**Subject:** Your sleep reset is here 🌙
**Preview text:** Why you wake up tired, even after 8 hours.

> Hi lovely,
>
> here it is: your 1-page sleep reset.
> **[Download my sleep reset]** → `https://healthy-longevity.netlify.app/downloads/why-you-wake-up-tired-sleep-reset.pdf`
>
> Haven’t found your sleep type yet? It takes 60 seconds → `https://healthy-longevity.netlify.app/sleep-quiz.html`
>
> And if you’d like to look at your nights together: book your free 30-minute **Better Sleep Call** → `https://healthy-longevity.netlify.app/#better-sleep-call`
>
> Sleep well,
> Alissa

---

**Note:** the general PDF (`why-you-wake-up-tired-sleep-reset.pdf`) still uses the old wording ("7-night experiment"). Tell me if it should be updated too.
