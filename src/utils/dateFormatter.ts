/**
 * Utility function to format any date string into dd/mm/yyyy format.
 */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return 'N/A';
  const trimmed = dateStr.trim();

  // If already in DD/MM/YYYY format (e.g. 21/09/2026)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle YYYY-MM-DD (e.g. 2026-09-21 -> 21/09/2026)
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch;
    return `${d}/${m}/${y}`;
  }

  // Handle YYYY/MM/DD (e.g. 2026/09/21 -> 21/09/2026)
  const ymdSlashMatch = trimmed.match(/^(\d{4})\/(\d{2})\/(\d{2})/);
  if (ymdSlashMatch) {
    const [, y, m, d] = ymdSlashMatch;
    return `${d}/${m}/${y}`;
  }

  // Handle MM/DD/YYYY or other JS Date strings
  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) {
    return dateStr;
  }

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Returns today's date formatted as dd/mm/yyyy
 */
export function getTodayDDMMYYYY(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
