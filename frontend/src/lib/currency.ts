/**
 * Formats a numeric amount as Algerian Dinar (DZD), the platform's only currency.
 * Example: formatDZD(24000) -> "24 000 DA"
 */
export function formatDZD(amount: number | string | null | undefined): string {
  const value = Number(amount) || 0;
  if (value === 0) return 'Gratuit';
  const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value);
  return `${formatted} DA`;
}

/** Same as formatDZD but never renders "Gratuit" for zero (used in editable admin/instructor forms). */
export function formatDZDRaw(amount: number | string | null | undefined): string {
  const value = Number(amount) || 0;
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)} DA`;
}
