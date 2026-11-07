# MHL Coaching Landing Page + Sleep Test

Static pages (HTML/CSS/JS, no build step), styled with the My Healthy Longevity design system
(sunshine / linen / ink / gold; Instrument Serif, Figtree, Oswald, Playfair; fonts self-hosted in `assets/quiz/fonts`).

| Page | File | Purpose |
|---|---|---|
| Coaching landing page | `index.html` | Better Sleep Call request, story, how coaching works |
| Sleep test | `sleep-quiz.html` | 60-second quiz → sleep type → Better Sleep Call (type is pre-filled in the form) / sleep reset email |
| Thank-you page | `thanks.html` | Shown after the Better Sleep Call form is sent |

## Going live (Netlify, free)

1. Create a site on Netlify and drag this whole folder into it (or connect a Git repo).
   You get an address like `https://mhl-coaching.netlify.app` (renameable under Site settings).
2. **Linktree:** add two links:
   - "Free Better Sleep Call" → `https://<your-site>.netlify.app/`
   - "Why do you wake up tired? (60-sec test)" → `https://<your-site>.netlify.app/sleep-quiz.html`
3. **Better Sleep Call form:** Netlify → Forms → enable form detection, redeploy, then add an email
   notification for the form `better-sleep-call`.
4. **Brevo:** create a subscription form with double opt-in → Share → Embed → copy the form action URL
   (`https://….sibforms.com/serve/…`) and paste it into `data-brevo-action="…"` in
   `sleep-quiz.html` (sleep reset). Keep the fields `EMAIL` and `OPT_IN`.
5. **Placeholders:** none left on the page.
6. **Legal links:** replace `https://YOUR-DOMAIN/` (privacy, imprint) with the real URLs.

After changing `assets/styles.css` or `assets/main.js`, bump the `?v=` number in the HTML so browsers load the new version.

## Local preview

```bash
python3 -m http.server 4600
```
