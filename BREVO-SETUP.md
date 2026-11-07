# Brevo setup (simple version)

**How it works:** someone takes the sleep test, enters her email and ticks the box. She can **download the PDF for her sleep type right away** on the results page. Brevo saves her email and sleep type and sends a confirmation email (double opt-in). After she confirms, she's on your list for your weekly emails.

No automation and no welcome emails needed.

> Brevo changes its menus now and then. If a label looks slightly different, look for the closest match.

---

## Step 1: Create the contact attribute (1 min)
**Contacts → Settings → Contact attributes → Add a new attribute**
- Name: `SLEEP_TYPE`
- Type: **Text**

## Step 2: Create the list (1 min)
**Contacts → Lists → Create a list** → name it `Sleep Reset`.

## Step 3: Create the subscription form (5–10 min)
**Contacts → Forms → Create a subscription form**
1. Fields: **Email** and **SLEEP_TYPE**. The quiz uses its own design and fills SLEEP_TYPE automatically, so the look of the Brevo form doesn't matter.
2. Add the opt-in checkbox (field `OPT_IN`).
3. List: `Sleep Reset`.
4. **Double opt-in: ON.** Confirmation email text below.
5. After confirming, Brevo can redirect to a page. Use: `https://healthy-longevity.netlify.app/links`
6. Save → **Share → Embed / HTML code** → find the address that looks like `https://….sibforms.com/serve/…` and **send it to Claude**. That's all Claude needs to connect the quiz.

**Confirmation email (double opt-in):**
> **Subject:** One click to stay in touch 🌙
> Hi lovely, thank you for taking my sleep test! Please confirm your email with the button below, so I can send you my weekly tips for calmer evenings and better sleep.
> [Confirm my email]
> Alissa, My Healthy Longevity

## Step 4: Test
Take the quiz with your own email, download the PDF, confirm the email, and check that you appear in **Contacts** with your SLEEP_TYPE filled in.

---

## Sender address
Use `alissa@…` on your own domain as sender as soon as the domain works, and verify the domain in **Senders, Domains & Dedicated IPs → Domains**. Emails from a Gmail sender often land in spam.

## Later (optional)
Because every contact has a SLEEP_TYPE, you can later send emails to just one type, for example a tip only for "The Wired Mind": **Contacts → Segments → SLEEP_TYPE is equal to …**

PDF links, if you ever need them in an email:
- `https://healthy-longevity.netlify.app/downloads/sleep-reset-wired-mind.pdf`
- `https://healthy-longevity.netlify.app/downloads/sleep-reset-late-night-fuel.pdf`
- `https://healthy-longevity.netlify.app/downloads/sleep-reset-shifting-clock.pdf`
- `https://healthy-longevity.netlify.app/downloads/sleep-reset-steady-sleeper.pdf`
