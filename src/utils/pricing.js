// src/utils/pricing.js

/**
 * Ghana hospitality tax rates.
 * These are real, applicable taxes hotels in Ghana must charge.
 */
export const TAX_RATES = {
  vat: 0.15,           // VAT — 15%
  nhil: 0.025,         // National Health Insurance Levy — 2.5%
  getfund: 0.025,      // Ghana Education Trust Fund — 2.5%
  covidLevy: 0.01,     // COVID-19 Health Recovery Levy — 1%
  serviceCharge: 0.1,  // Hotel service charge — 10% (typical for luxury hotels)
};

/**
 * Count nights between two ISO date strings (YYYY-MM-DD).
 * Returns 0 if either date is missing or invalid.
 */
export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  const diff = (b - a) / (1000 * 60 * 60 * 24);
  return diff > 0 ? Math.round(diff) : 0;
}

/**
 * Compute a full booking breakdown from a nightly rate and nights.
 * Returns subtotal, each tax line item, and grand total.
 */
export function computeBookingTotals(nightlyRate, nights) {
  const subtotal = Number(nightlyRate) * Number(nights);

  const service = subtotal * TAX_RATES.serviceCharge;

  // In Ghana, NHIL + GETFund + COVID Levy are levied on the base,
  // and VAT is charged on (base + NHIL + GETFund + COVID).
  // We follow that ordering for accuracy.
  const nhil = subtotal * TAX_RATES.nhil;
  const getfund = subtotal * TAX_RATES.getfund;
  const covid = subtotal * TAX_RATES.covidLevy;
  const vatBase = subtotal + nhil + getfund + covid;
  const vat = vatBase * TAX_RATES.vat;

  const taxes = vat + nhil + getfund + covid;
  const total = subtotal + service + taxes;

  return {
    subtotal,
    service,
    vat,
    nhil,
    getfund,
    covid,
    taxes,
    total,
    nights,
  };
}

/**
 * Format a number as GHS currency for display.
 */
export function formatGHS(amount) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}