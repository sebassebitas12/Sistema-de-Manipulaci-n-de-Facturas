/**
 * Determina de forma determinista el estado de una factura
 * Estados posibles:
 * - 'Pagada'
 * - 'Pendiente'
 * - 'Vencida'
 *
 * Reglas:
 * 1. Si está marcada como pagada (estadoManual === 'Pagada' o pagada === true) -> Pagada
 * 2. Si no está pagada y hoy <= fechaVencimiento -> Pendiente
 * 3. Si no está pagada y hoy > fechaVencimiento -> Vencida
 */
export const getInvoiceStatus = (invoice, referenceDate = new Date()) => {
  if (!invoice) return 'Pendiente';

  if (invoice.estadoManual === 'Pagada' || invoice.pagada === true) {
    return 'Pagada';
  }

  if (!invoice.fechaVencimiento) {
    return 'Pendiente';
  }

  // Normalizar fechas para comparar sólo año, mes y día
  const [vencYear, vencMonth, vencDay] = invoice.fechaVencimiento.split('-').map(Number);
  const dueDate = new Date(vencYear, vencMonth - 1, vencDay, 23, 59, 59, 999);

  const refDate = new Date(referenceDate);

  if (refDate.getTime() > dueDate.getTime()) {
    return 'Vencida';
  }

  return 'Pendiente';
};

export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Pagada':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/90 shadow-2xs';
    case 'Vencida':
      return 'bg-rose-50 text-rose-700 border-rose-200/90 shadow-2xs';
    case 'Pendiente':
    default:
      return 'bg-amber-50 text-amber-800 border-amber-200/90 shadow-2xs';
  }
};
