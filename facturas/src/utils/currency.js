/**
 * Formateo oficial de moneda costarricense (CRC - Colón)
 * Cumple con formato estándar: ₡125 000,00 con separador de miles y coma decimal.
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₡0,00';
  }

  // Usamos Intl.NumberFormat con es-CR y currency CRC
  const formatter = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return new Intl.NumberFormat('es-CR').format(num);
};
