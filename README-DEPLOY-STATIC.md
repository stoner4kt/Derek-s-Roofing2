# Derek's Roofing — Netlify static site

This is a static HTML site that is designed to deploy on Netlify. Netlify Forms receives quote requests, and a Netlify submission event function appends each submission to Google Sheets.

## Deploy to Netlify

1. In Netlify, select **Add new site** and either connect this repository or choose **Deploy manually**.
2. Deploy the repository root. No build command is required.
3. After deployment, submit a test quote request. It should appear under **Forms** in the Netlify dashboard as the `contact` form.

The form in `index.html` is already configured with Netlify's required `name`, `data-netlify`, and hidden `form-name` fields. It redirects successful submissions to `thankyou.html`.

## Save submissions to Google Sheets

The `netlify/functions/submission-created.js` event function runs whenever Netlify receives a form submission. It adds the submission date, name, phone, email, service, and message to columns A–F of the `Sheet1` worksheet.

Before deploying, create a Google Cloud service account with the Google Sheets API enabled, share the target spreadsheet with that service account's email address, and add these environment variables in **Netlify → Site configuration → Environment variables**:

| Variable | Value |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The service account email address. |
| `GOOGLE_PRIVATE_KEY` | The service account private key. Keep escaped newlines (`\\n`) if pasting it as one line. |
| `GOOGLE_SHEET_ID` | The spreadsheet ID from the Google Sheets URL. |

Do not commit service-account credentials to this repository. After setting the variables, trigger a new deploy and submit a test form. Confirm both the Netlify Forms dashboard and the spreadsheet receive the submission.

## Updating business details

Unlike the PHP version, business details are written directly into the HTML files. Use your editor's find-and-replace across files to update:

- Phone number: `071 250 0125`
- Phone link: `+27712500125`
- WhatsApp link: `27712500125`
- Email: `Djlou57@gmail.com`
- Address: `Patrys St, Welgemoed, Cape Town, 7530`

## Updating gallery photos

1. Add the image file to `/images`.
2. In `gallery.html`, copy a `<figure>` in the `<div class="gallery-grid">` block and update it to use the new filename.
3. Optionally add it to the "Recent work" section of `index.html`.
4. Redeploy the site.

## Folder contents

```
index.html       Homepage and Netlify contact form
gallery.html     Photo gallery
faq.html         Frequently asked questions
privacy.html     Privacy policy
terms.html       Terms and conditions
thankyou.html    Form submission confirmation page
netlify/         Google Sheets submission event function
style.css        Site styling
script.js        Navigation, lightbox, and FAQ behaviour
images/          Logo, header background, and gallery photos
```
