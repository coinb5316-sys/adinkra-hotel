// src/utils/paystack.js
import PaystackPop from '@paystack/inline-js';

/**
 * Replace this with your Paystack TEST public key.
 * It looks like: pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * NEVER commit your secret key to the frontend.
 */
export const PAYSTACK_PUBLIC_KEY = 'pk_test_afb65d2b2b2ed35199c901e827044ffe4398a99f';

/**
 * Convert GHS to pesewas (Paystack expects the smallest unit).
 * 1 GHS = 100 pesewas
 */
export const ghsToPesewas = (ghs) => Math.round(Number(ghs) * 100);

/**
 * Format a number as GHS currency for display.
 */
export const formatGHS = (amount) =>
  new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0,
  }).format(amount);

/**
 * Generate a unique reference for each transaction.
 * Paystack rejects duplicates.
 */
export const generateReference = () =>
  `ADK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/**
 * Open the Paystack inline modal.
 *
 * @param {Object}  opts
 * @param {string}  opts.email              - Customer email (required by Paystack)
 * @param {number}  opts.amountGHS          - Amount in GHS (we convert to pesewas)
 * @param {string}  [opts.reference]        - Unique reference. Auto-generated if not passed.
 * @param {string}  [opts.currency='GHS']   - Currency code. GHS for Ghana.
 * @param {Object}  [opts.metadata]         - Any extra data (booking details).
 * @param {Function} [opts.onSuccess]       - Called with the Paystack response on success.
 * @param {Function} [opts.onCancel]        - Called if the user closes the modal.
 * @param {Function} [opts.onError]         - Called on error.
 */
export const payWithPaystack = ({
  email,
  amountGHS,
  reference,
  currency = 'GHS',
  metadata = {},
  onSuccess,
  onCancel,
  onError,
}) => {
  if (!email) {
    console.error('[paystack] email is required');
    return;
  }
  if (!amountGHS || amountGHS <= 0) {
    console.error('[paystack] amount must be greater than zero');
    return;
  }

  const paystack = new PaystackPop();
  const finalReference = reference || generateReference();

  paystack.newTransaction({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: ghsToPesewas(amountGHS),
    currency,
    reference: finalReference,
    channels: ['card', 'bank', 'ussd', 'mobile_money', 'bank_transfer'],
    metadata: {
      custom_fields: [
        {
          display_name: 'Booking Type',
          variable_name: 'booking_type',
          value: metadata.bookingType || 'Hotel Reservation',
        },
        {
          display_name: 'Room',
          variable_name: 'room',
          value: metadata.roomName || 'N/A',
        },
        {
          display_name: 'Check-in',
          variable_name: 'check_in',
          value: metadata.checkIn || 'N/A',
        },
        {
          display_name: 'Check-out',
          variable_name: 'check_out',
          value: metadata.checkOut || 'N/A',
        },
        {
          display_name: 'Nights',
          variable_name: 'nights',
          value: String(metadata.nights ?? 'N/A'),
        },
      ],
      ...metadata,
    },
    onSuccess: (response) => {
      // In production, send response.reference to YOUR BACKEND to verify.
      // Frontend trust alone is not secure.
      console.log('[paystack] success:', response.reference);
      onSuccess?.(response);
    },
    onCancel: () => {
      console.log('[paystack] user closed the modal');
      onCancel?.();
    },
    onError: (error) => {
      console.error('[paystack] error:', error);
      onError?.(error);
    },
  });
};