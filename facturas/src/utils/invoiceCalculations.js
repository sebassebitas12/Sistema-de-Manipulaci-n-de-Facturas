/**
 * Opciones de tarifas de IVA vigentes en Costa Rica (Ley 9635)
 */
export const IVA_RATES = [
  { rate: 13, label: '13% — Tarifa general' },
  { rate: 4, label: '4% — Tarifa reducida (Salud/Boletos)' },
  { rate: 2, label: '2% — Tarifa reducida (Medicamentos/Educación)' },
  { rate: 1, label: '1% — Tarifa reducida (Canasta básica)' },
  { rate: 0.5, label: '0,5% — Tarifa reducida' },
  { rate: 0, label: '0% — Exento / Sin impuesto' },
];

/**
 * Calcula los montos derivados de un ítem individual
 * Fórmula:
 * subtotalItem = cantidad * precioUnitario
 * impuestoItem = subtotalItem * (tasaIVA / 100)
 * totalItem = subtotalItem + impuestoItem
 */
export const calculateItemTotals = (item) => {
  const cantidad = Number(item?.cantidad) || 0;
  const precioUnitario = Number(item?.precioUnitario) || 0;
  const tasaIVA = item?.tasaIVA !== undefined ? Number(item.tasaIVA) : 13;

  const subtotal = Math.round(cantidad * precioUnitario * 100) / 100;
  const impuesto = Math.round(subtotal * (tasaIVA / 100) * 100) / 100;
  const total = Math.round((subtotal + impuesto) * 100) / 100;

  return {
    subtotal,
    impuesto,
    total,
  };
};

/**
 * Calcula los totales derivados de una lista de ítems de factura
 * Fórmula:
 * subtotal = suma de subtotales
 * impuesto = suma de impuestos
 * total = subtotal + impuesto
 */
export const calculateInvoiceTotals = (items = []) => {
  let subtotal = 0;
  let impuesto = 0;

  items.forEach((item) => {
    const itemCalculations = calculateItemTotals(item);
    subtotal += itemCalculations.subtotal;
    impuesto += itemCalculations.impuesto;
  });

  subtotal = Math.round(subtotal * 100) / 100;
  impuesto = Math.round(impuesto * 100) / 100;
  const total = Math.round((subtotal + impuesto) * 100) / 100;

  return {
    subtotal,
    impuesto,
    total,
    cantidadLineas: items.length,
  };
};
