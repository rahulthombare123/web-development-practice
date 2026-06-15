// QR Code Generator
// Generates a QR code from user text using the qrcode.js library (loaded via CDN)
// and lets the user download it as a PNG image.

const textInput = document.getElementById('textInput');
const sizeRange = document.getElementById('sizeRange');
const sizeValue = document.getElementById('sizeValue');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrCanvas = document.getElementById('qrCanvas');
const qrWrapper = document.getElementById('qrWrapper');
const message = document.getElementById('message');

// update the size label as the slider moves
sizeRange.addEventListener('input', () => {
  sizeValue.textContent = sizeRange.value;
});

function generateQRCode() {
  const text = textInput.value.trim();

  if (!text) {
    message.textContent = 'Please enter some text or a link first.';
    downloadBtn.disabled = true;
    qrWrapper.classList.remove('visible');
    return;
  }

  const size = parseInt(sizeRange.value, 10);

  QRCode.toCanvas(qrCanvas, text, { width: size, margin: 1 }, (error) => {
    if (error) {
      message.textContent = 'Something went wrong. Please try again.';
      downloadBtn.disabled = true;
      qrWrapper.classList.remove('visible');
      return;
    }

    message.textContent = '';
    qrWrapper.classList.add('visible');
    downloadBtn.disabled = false;
  });
}

generateBtn.addEventListener('click', generateQRCode);

// allow pressing Enter in the text field to generate
textInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    generateQRCode();
  }
});

downloadBtn.addEventListener('click', () => {
  const imageUrl = qrCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'qr-code.png';
  link.click();
});
