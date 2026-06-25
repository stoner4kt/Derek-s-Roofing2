# Derek's Roofing — Static HTML Version (Netlify / Vercel)

This is a fully static copy of the site — no PHP, no server needed. Drag-and-drop deploy to Netlify or Vercel.

## What's different from the cPanel/PHP version

| | PHP version (`/php-cpanel`) | Static version (`/static-html`, this folder) |
|---|---|---|
| Pages | `.php` | `.html` |
| Contact form | Sends email via PHP `mail()` | Submits via **Formspree** (or Netlify Forms) |
| Gallery | Auto-scans `/images` folder on the server | Fixed list of images baked into `gallery.html` |
| Admin photo upload | `login.php` / `admin.php` let you upload via browser | **Not available** — static hosts can't run server code. To add/remove photos, edit the image files in `/images` and redeploy (see below) |

## 1. Deploy to Netlify

**Option A — drag and drop:**
1. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Deploy manually"
2. Drag this entire folder in. Done — you'll get a live URL immediately.

**Option B — Netlify Forms (recommended, no sign-up to Formspree needed):**
1. Open `index.html`, find the `<form class="contact-form" ...>` tag.
2. Add `data-netlify="true"` to it and remove the `action="https://formspree.io/..."` attribute.
3. Add a hidden field Netlify needs: `<input type="hidden" name="form-name" value="contact">` inside the form.
4. Redeploy. Submissions will appear under your Netlify site → **Forms**.

## 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → import this folder (or push it to a GitHub repo and import that repo).
2. No build settings are needed — it's plain HTML/CSS/JS, so leave the framework preset as "Other".
3. Deploy. Vercel doesn't have built-in form handling, so keep the Formspree option below for the contact form.

## 3. Set up the contact form (Formspree — works on both Netlify & Vercel)

1. Go to [formspree.io](https://formspree.io), sign up free, create a new form, and copy your **Form ID**.
2. In `index.html`, find:
   ```html
   <form class="contact-form" method="POST" action="https://formspree.io/f/YOUR_FORM_ID">
   ```
3. Replace `YOUR_FORM_ID` with your real ID.
4. Submissions will land in your Formspree inbox and forward to your email. The form already redirects to `thankyou.html` after a successful send.

## 4. Updating business details (phone, email, WhatsApp, address)

Unlike the PHP version, there's no single `config.php` — these details are written directly into each HTML file's footer and floating buttons. To change them, use your editor's "Find & Replace across files" feature on:
- Phone number: `071 250 0125`
- Phone link: `+27712500125`
- WhatsApp link: `27712500125`
- Email: `Djlou57@gmail.com`
- Address: `Patrys St, Welgemoed, Cape Town, 7530`

## 5. Updating gallery photos

1. Add your new image file into `/images`.
2. Open `gallery.html`, find the `<div class="gallery-grid">` block, and copy/paste a `<figure>` line, pointing it at your new filename.
3. (Optional) Do the same in the "Recent work" section of `index.html` if you want it featured on the homepage.
4. Redeploy (drag the folder again on Netlify, or `git push` if connected to a repo).

## Folder contents

```
index.html       Homepage
gallery.html      Photo gallery
faq.html          FAQs
privacy.html      Privacy Policy
terms.html        Terms & Conditions
thankyou.html     Shown after contact form submission
style.css         Styling
script.js         Nav, lightbox, FAQ accordion behaviour
images/           Logo, header background, and gallery photos
```
