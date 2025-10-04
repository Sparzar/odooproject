// utils/ocrProcessor.js
// Minimal OCR stub. In production you'd integrate Tesseract / Vision API.
// This returns fake parsed text for demonstration.

async function parseReceipt(fileBuffer, originalName) {
  // Simulate parsed values
  return {
    text: 'FAKE OCR TEXT: Vendor: Cafe ABC; Amount: 123.45; Date: 2025-09-01',
    parsed: {
      amount: 123.45,
      date: '2025-09-01',
      vendor: 'Cafe ABC',
      description: 'Meal'
    }
  };
}

module.exports = { parseReceipt };
