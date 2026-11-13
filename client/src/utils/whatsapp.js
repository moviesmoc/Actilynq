/**
 * Normalizes phone numbers to standard international format without symbols
 */
export function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) return '';
  // Remove spaces, parentheses, dashes, plus signs
  let cleaned = rawPhone.replace(/[\s\(\)\-\+]/g, '');

  // If standard 10-digit Indian mobile number, prefix with India country code 91
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }

  return cleaned;
}

/**
 * Creates WhatsApp click-to-chat URL with prefilled draft message
 */
export function createWhatsAppUrl(phone, message = '') {
  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone) return '';

  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}${encodedText ? `?text=${encodedText}` : ''}`;
}

/**
 * Creates tel: click-to-dial URL
 */
export function createTelUrl(phone) {
  if (!phone) return '';
  return `tel:${phone.trim()}`;
}
