import { calculateInvoiceTotals } from './invoiceCalculations.js';
import { getInvoiceStatus } from './invoiceStatus.js';

/**
 * Calcula el promedio (media aritmética) de un arreglo de números
 */
export const calculateMean = (numbers = []) => {
  if (!numbers.length) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
};

/**
 * Calcula la desviación estándar muestral/poblacional de una lista de valores
 */
export const calculateStdDev = (numbers = [], mean = null) => {
  if (numbers.length <= 1) return 0;
  const avg = mean !== null ? mean : calculateMean(numbers);
  const variance = numbers.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / numbers.length;
  return Math.sqrt(variance);
};

/**
 * Analiza facturas atípicas (outliers) utilizando Z-Score:
 * z = |total - promedio| / desviacionEstandar
 * Si z > 1.5 => factura atípica.
 */
export const detectOutliers = (invoices = []) => {
  if (invoices.length < 2) {
    return {
      mean: invoices.length ? calculateInvoiceTotals(invoices[0].items).total : 0,
      stdDev: 0,
      threshold: 0,
      outlierCount: 0,
      outlierIds: new Set(),
      itemsWithZ: [],
    };
  }

  const totals = invoices.map((inv) => ({
    id: inv.id,
    numeroFactura: inv.numeroFactura,
    cliente: inv.cliente?.nombre || 'Consumidor Final',
    total: calculateInvoiceTotals(inv.items).total,
  }));

  const values = totals.map((t) => t.total);
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values, mean);

  const outlierIds = new Set();
  const itemsWithZ = totals.map((item) => {
    const zScore = stdDev > 0 ? Math.abs(item.total - mean) / stdDev : 0;
    const isOutlier = zScore > 1.5;
    if (isOutlier) {
      outlierIds.add(item.id);
    }
    return {
      ...item,
      zScore: Math.round(zScore * 100) / 100,
      isOutlier,
    };
  });

  return {
    mean: Math.round(mean * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    threshold: Math.round((mean + 1.5 * stdDev) * 100) / 100,
    outlierCount: outlierIds.size,
    outlierIds,
    itemsWithZ,
  };
};

/**
 * Calcula todas las métricas requeridas para el Dashboard
 */
export const computeDashboardMetrics = (invoices = []) => {
  if (!invoices.length) {
    return {
      totalFacturado: 0,
      totalImpuestos: 0,
      totalSubtotal: 0,
      numeroFacturas: 0,
      ticketPromedio: 0,
      topClientes: [],
      outliers: { outlierCount: 0, outlierIds: new Set() },
      proyeccionIngresos: 0,
      facturasPorEstado: { pagadas: 0, pendientes: 0, vencidas: 0 },
      ingresosPorMes: [],
      distribucionClientes: [],
    };
  }

  let totalFacturado = 0;
  let totalImpuestos = 0;
  let totalSubtotal = 0;
  const clientMap = {};
  const monthlyMap = {};
  const statusCounts = { pagadas: 0, pendientes: 0, vencidas: 0 };

  invoices.forEach((invoice) => {
    const { total, impuesto, subtotal } = calculateInvoiceTotals(invoice.items);
    totalFacturado += total;
    totalImpuestos += impuesto;
    totalSubtotal += subtotal;

    // Estado
    const status = getInvoiceStatus(invoice);
    if (status === 'Pagada') statusCounts.pagadas += 1;
    else if (status === 'Vencida') statusCounts.vencidas += 1;
    else statusCounts.pendientes += 1;

    // Agrupación por cliente
    const clienteNombre = invoice.cliente?.nombre?.trim() || 'Consumidor Final';
    if (!clientMap[clienteNombre]) {
      clientMap[clienteNombre] = {
        nombre: clienteNombre,
        total: 0,
        facturas: 0,
      };
    }
    clientMap[clienteNombre].total += total;
    clientMap[clienteNombre].facturas += 1;

    // Agrupación por período mensual (YYYY-MM)
    const fecha = invoice.fechaEmision || '2026-01-01';
    const periodKey = fecha.slice(0, 7); // '2026-03'
    if (!monthlyMap[periodKey]) {
      monthlyMap[periodKey] = {
        periodo: periodKey,
        total: 0,
        facturas: 0,
      };
    }
    monthlyMap[periodKey].total += total;
    monthlyMap[periodKey].facturas += 1;
  });

  const numeroFacturas = invoices.length;
  const ticketPromedio = numeroFacturas > 0 ? totalFacturado / numeroFacturas : 0;

  // Top 3 Clientes ordenados de mayor a menor
  const sortedClients = Object.values(clientMap).sort((a, b) => b.total - a.total);
  const topClientes = sortedClients.slice(0, 3);

  // Detección de atípicas
  const outliers = detectOutliers(invoices);

  // Proyección estimada basada en promedio móvil
  // Si hay períodos mensuales, calculamos el promedio móvil de ingresos mensuales
  const periods = Object.keys(monthlyMap).sort();
  const monthlyRevenues = periods.map((p) => monthlyMap[p].total);
  const proyeccionIngresos = calculateMean(monthlyRevenues);

  // Formatear series de Recharts
  const ingresosPorMes = periods.map((p) => {
    // Formato legible en español Ej: 'Mar 2026'
    const [year, month] = p.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
    const label = `${months[parseInt(month, 10) - 1] || month} ${year}`;
    return {
      periodo: label,
      periodKey: p,
      total: Math.round(monthlyMap[p].total),
      facturas: monthlyMap[p].facturas,
    };
  });

  // Distribución de clientes para gráficos
  const distribucionClientes = sortedClients.map((c) => ({
    name: c.nombre.length > 20 ? c.nombre.slice(0, 18) + '...' : c.nombre,
    fullName: c.nombre,
    value: Math.round(c.total),
    facturas: c.facturas,
  }));

  return {
    totalFacturado: Math.round(totalFacturado * 100) / 100,
    totalImpuestos: Math.round(totalImpuestos * 100) / 100,
    totalSubtotal: Math.round(totalSubtotal * 100) / 100,
    numeroFacturas,
    ticketPromedio: Math.round(ticketPromedio * 100) / 100,
    topClientes,
    outliers,
    proyeccionIngresos: Math.round(proyeccionIngresos * 100) / 100,
    facturasPorEstado: statusCounts,
    ingresosPorMes,
    distribucionClientes,
  };
};
