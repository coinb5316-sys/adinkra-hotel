// src/components/PaystackButton.jsx
import { useState } from 'react';
import {
  HiOutlineLockClosed,
  HiOutlineArrowLongRight,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { payWithPaystack, formatGHS } from '../utils/paystack';

export default function PaystackButton({
  email,
  amountGHS,
  metadata = {},
  disabled = false,
  label,
  onSuccess,
  onCancel,
  onError,
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleClick = () => {
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address before paying.');
      return;
    }
    if (!amountGHS || amountGHS <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    setProcessing(true);

    payWithPaystack({
      email,
      amountGHS,
      metadata,
      onSuccess: (res) => {
        setProcessing(false);
        onSuccess?.(res);
      },
      onCancel: () => {
        setProcessing(false);
        onCancel?.();
      },
      onError: (err) => {
        setProcessing(false);
        setError(
          err?.message ||
            'Payment could not be started. Please try again or contact us by phone.',
        );
        onError?.(err);
      },
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || processing}
        className={`group w-full flex items-center justify-center gap-3 py-5 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-500 ${
          disabled || processing
            ? 'bg-ink-400 text-cream-200 cursor-not-allowed'
            : 'bg-ink-900 text-cream-100 hover:bg-gold-500 hover:text-white'
        }`}
      >
        <HiOutlineLockClosed className="w-4 h-4" />
        {processing
          ? 'Opening secure checkout…'
          : label || `Reserve · ${formatGHS(amountGHS)}`}
        {!processing && (
          <HiOutlineArrowLongRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
        )}
      </button>

      {error && (
        <p className="mt-3 flex items-start gap-2 text-xs text-red-700 leading-relaxed">
          <HiOutlineExclamationTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </p>
      )}
    </div>
  );
}