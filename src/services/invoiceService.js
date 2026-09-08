import { SAMPLE_INVOICES, INITIAL_EMISOR } from '../data/sampleInvoices.js';

export function getInitialInvoices() {
  return SAMPLE_INVOICES;
}

export function getInitialFormData(nextInvoiceNumber) {
  const today = new Date();
  const dueDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    numeroFactura: nextInvoiceNumber || 'FAC-0009',
    fechaEmision: today.toISOString().split('T')[0],
    fechaVencimiento: dueDate.toISOString().split('T')[0],
    condicionVenta: 'Contado',
    medioPago: 'Transferencia / depósito bancario',
    emisor: { ...INITIAL_EMISOR },
    cliente: {
      nombre: '',
      tipoIdentificacion: 'Cédula jurídica',
      identificacion: '',
      correo: '',
      telefono: '',
      direccion: '',
    },
    items: [
      {
        id: 'item-initial-1',
        descripcion: 'Servicio de consultoría y soporte TI',
        cantidad: 1,
        precioUnitario: 35000,
        tasaIVA: 13,
      },
    ],
  };
}

export function generateNextInvoiceNumber(invoices) {
  return `FAC-${String(invoices.length + 1).padStart(4, '0')}`;
}

export function validateInvoice(formData) {
  const newErrors = {};

  if (!formData.numeroFactura?.trim()) {
    newErrors.numeroFactura = 'El número de factura es obligatorio.';
  }
  if (!formData.fechaEmision) {
    newErrors.fechaEmision = 'La fecha de emisión es obligatoria.';
  }
  if (!formData.fechaVencimiento) {
    newErrors.fechaVencimiento = 'La fecha de vencimiento es obligatoria.';
  }
  if (new Date(formData.fechaVencimiento) < new Date(formData.fechaEmision)) {
    newErrors.fechaVencimiento = 'La fecha de vencimiento no puede ser anterior a la de emisión.';
  }

  if (!formData.emisor?.nombre?.trim()) {
    newErrors.emisorNombre = 'El nombre del emisor es obligatorio.';
  }
  if (!formData.emisor?.identificacion?.trim()) {
    newErrors.emisorId = 'La identificación tributaria del emisor es obligatoria.';
  }

  if (!formData.cliente?.nombre?.trim()) {
    newErrors.clienteNombre = 'El nombre del cliente es obligatorio.';
  }

  if (!formData.items || formData.items.length === 0) {
    newErrors.items = 'Debe existir al menos un ítem en la factura.';
  } else {
    formData.items.forEach((it, idx) => {
      if (!it.descripcion?.trim()) {
        newErrors[`item_${idx}_desc`] = `El ítem #${idx + 1} requiere una descripción.`;
      }
      if (Number(it.cantidad) <= 0) {
        newErrors[`item_${idx}_cant`] = `La cantidad del ítem #${idx + 1} debe ser mayor a 0.`;
      }
      if (Number(it.precioUnitario) <= 0) {
        newErrors[`item_${idx}_precio`] = `El precio unitario del ítem #${idx + 1} debe ser mayor a 0.`;
      }
      if (Number(it.tasaIVA) < 0) {
        newErrors[`item_${idx}_iva`] = `El IVA del ítem #${idx + 1} no puede ser negativo.`;
      }
    });
  }

  return newErrors;
}

export function buildInvoiceFromForm(formData) {
  return {
    id: 'inv-' + Date.now(),
    numeroFactura: formData.numeroFactura.trim(),
    fechaEmision: formData.fechaEmision,
    fechaVencimiento: formData.fechaVencimiento,
    condicionVenta: formData.condicionVenta,
    medioPago: formData.medioPago,
    estadoManual: formData.condicionVenta === 'Contado' ? 'Pagada' : null,
    pagada: formData.condicionVenta === 'Contado',
    emisor: { ...formData.emisor },
    cliente: { ...formData.cliente },
    items: formData.items.map((item) => ({
      ...item,
      cantidad: Number(item.cantidad),
      precioUnitario: Number(item.precioUnitario),
      tasaIVA: Number(item.tasaIVA),
    })),
  };
}

export function createInvoice(formData) {
  return buildInvoiceFromForm(formData);
}

export function resetToSampleData() {
  return SAMPLE_INVOICES;
}

export async function getInvoiceById(id, options = {}) {
  if (!id) {
    throw new Error('El id de la factura es obligatorio.');
  }

  const response = await fetch(`/api/invoices/${encodeURIComponent(id)}`, options);

  if (!response.ok) {
    throw new Error(`No se pudo obtener la factura ${id}.`);
  }

  return response.json();
}
