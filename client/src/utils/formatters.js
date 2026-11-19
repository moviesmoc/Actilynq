/**
 * Format currency with Indian or locale numbering system
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '-';
  }
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  } catch (e) {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/**
 * Format date nicely
 */
export function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format date & time
 */
export function formatDateTime(date) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format relative time (e.g., "3 days ago" or "due in 2 hours")
 */
export function formatRelativeTime(date) {
  if (!date) return '-';
  const time = new Date(date).getTime();
  const now = Date.now();
  const diffMs = time - now;
  const isPast = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return isPast ? `${minutes}m ago` : `in ${minutes}m`;
  if (hours < 24) return isPast ? `${hours}h ago` : `in ${hours}h`;
  if (days === 1) return isPast ? 'Yesterday' : 'Tomorrow';
  return isPast ? `${days}d ago` : `in ${days}d`;
}
