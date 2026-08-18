export const bankInfo = {
  bankName: 'Techcombank',
  // NAPAS bank BIN — used to generate VietQR dynamic (amount-embedded) codes.
  bin: '970407',
  accountNumber: '1907 5423 5360 13',
  // Same account number with no spaces, as required by the VietQR API.
  accountNumberRaw: '19075423536013',
  accountHolder: 'PHAN VIET TU',
  // Static fallback QR (no amount embedded) — used only if VietQR generation fails.
  qrImage: '/images/payment/bank-qr.png',
};
