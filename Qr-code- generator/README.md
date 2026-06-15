# Interactive QR Code Generator

A simple utility that converts any text or link into a downloadable QR code.
Built with plain HTML, CSS and JavaScript - no frameworks, no build tools, no
external fonts.

## Files

- `index.html` - page structure
- `style.css` - all styling and layout (uses CSS variables)
- `script.js` - handles QR code generation and the PNG download
- `qrcode.min.js` - bundled QR code library (runs fully offline)

## Features

- Type any text or URL and generate a QR code instantly
- Slider to control the QR code size (120px - 400px)
- "Download PNG" button to save the QR code as an image
- Press Enter in the text field to generate
- Friendly message if the input is empty

## How it works

This project uses the open-source **qrcode** library (by soldair) to draw the
QR code onto an HTML `<canvas>`. It is bundled locally as `qrcode.min.js` and
loaded directly from the project folder in `index.html`:

```html
<script src="qrcode.min.js"></script>
<script src="script.js"></script>
```

No CDN and no internet connection needed - everything works fully offline.

The download button converts the canvas to a PNG image using
`canvas.toDataURL('image/png')` and triggers a download.

## Fonts

Uses the system font stack (`-apple-system, Segoe UI, Roboto, Helvetica, Arial`)
instead of an external font like Google Fonts. This keeps the page light and
fast.

## How to run

1. Unzip the folder.
2. Open `index.html` in any web browser.

No installation, server, or internet connection needed.

## How to customize

- Change the size range in `index.html` by editing the `min`, `max` and
  `step` attributes of the `#sizeRange` input.
- Change colors by editing the CSS variables at the top of `style.css`
  (`--accent`, `--accent-soft`, etc.).
- To add a "Copy to clipboard" button, you can use the `navigator.clipboard`
  API alongside the existing download button.
