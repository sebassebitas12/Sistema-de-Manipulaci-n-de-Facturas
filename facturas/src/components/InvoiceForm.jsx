import { useState } from 'react';
import { Plus, Check, AlertCircle, FileText, Building2, User, ShoppingBag, Calculator } from 'lucide-react';
import InvoiceItem from './InvoiceItem.jsx';
import { calculateInvoiceTotals } from '../utils/invoiceCalculations.js';
import { formatCurrency } from '../utils/currency.js';
import { INITIAL_EMISOR } from '../data/sampleInvoices.js';

const TIPO_ID_OPTIONS = [
  'Cédula física',
  'Cédula jurídica',
  'DIMEX',
  'NITE',
];

const CONDICION_VENTA_OPTIONS = ['Contado', 'Crédito'];

const MEDIO_PAGO_OPTIONS = [
  'Transferencia / depósito bancario',
  'Tarjeta',
  'Efectivo',
  'Cheque',
  'Otros',
];

const getInitialFormData = (nextInvoiceNumber) => {
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
};

export default function InvoiceForm({ onSaveInvoice, onCancel, nextInvoiceNumber }) {
  const [formData, setFormData] = useState(() => getInitialFormData(nextInvoiceNumber));
  const [errors, setErrors] = useState({});

  // Totales calculados en tiempo real
  const totals = calculateInvoiceTotals(formData.items);

  // Manejadores de Emisor
  const handleEmisorChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      emisor: { ...prev.emisor, [field]: value },
    }));
  };

  // Manejadores de Cliente
  const handleClienteChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      cliente: { ...prev.cliente, [field]: value },
    }));
  };

  // Manejadores de Ítems
  const handleItemChange = (itemId, updatedItem) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === itemId ? updatedItem : it)),
    }));
  };

  const handleAddItem = () => {
    const newItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      descripcion: '',
      cantidad: 1,
      precioUnitario: 15000,
      tasaIVA: 13,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (itemId) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== itemId),
    }));
  };

  // Validación estricta en español
  const validate = () => {
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

    // Emisor
    if (!formData.emisor.nombre?.trim()) {
      newErrors.emisorNombre = 'El nombre del emisor es obligatorio.';
    }
    if (!formData.emisor.identificacion?.trim()) {
      newErrors.emisorId = 'La identificación tributaria del emisor es obligatoria.';
    }

    // Cliente
    if (!formData.cliente.nombre?.trim()) {
      newErrors.clienteNombre = 'El nombre del cliente es obligatorio.';
    }

    // Ítems
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const newInvoice = {
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

    onSaveInvoice(newInvoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Aviso Académico */}
      <div className="rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 text-xs text-amber-900 shadow-2xs">
        <p className="font-bold text-amber-950 flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
          <span>Aviso Académico Tributario — Costa Rica</span>
        </p>
        <p className="mt-1 text-amber-800 leading-relaxed">
          Simulación educativa para fines académicos (Ley 9635). Los documentos generados en esta aplicación no sustituyen comprobantes electrónicos válidos ante la Dirección General de Tributación.
        </p>
      </div>

      {/* Errores globales */}
      {Object.keys(errors).length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-900 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-rose-950 mb-1.5">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>Por favor corrija los siguientes campos antes de continuar:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-rose-700">
            {Object.values(errors).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 1. Datos del Documento */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
            <FileText className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            1. Información del Comprobante
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Número de Factura <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.numeroFactura}
              onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono font-medium text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fecha de Emisión <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.fechaEmision}
              onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fecha de Vencimiento <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.fechaVencimiento}
              onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Condición de Venta
            </label>
            <select
              value={formData.condicionVenta}
              onChange={(e) => setFormData({ ...formData, condicionVenta: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
            >
              {CONDICION_VENTA_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medio de Pago
            </label>
            <select
              value={formData.medioPago}
              onChange={(e) => setFormData({ ...formData, medioPago: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
            >
              {MEDIO_PAGO_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Emisor y Cliente en dos columnas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Emisor */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <Building2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              2. Datos del Emisor
            </h3>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Razón Social / Nombre Comercial <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.emisor.nombre}
                onChange={(e) => handleEmisorChange('nombre', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Identificación
                </label>
                <select
                  value={formData.emisor.tipoIdentificacion}
                  onChange={(e) => handleEmisorChange('tipoIdentificacion', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
                >
                  {TIPO_ID_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Identificación <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="3-101-789456"
                  value={formData.emisor.identificacion}
                  onChange={(e) => handleEmisorChange('identificacion', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.emisor.correo}
                  onChange={(e) => handleEmisorChange('correo', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.emisor.telefono}
                  onChange={(e) => handleEmisorChange('telefono', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Fiscal</label>
              <input
                type="text"
                value={formData.emisor.direccion}
                onChange={(e) => handleEmisorChange('direccion', e.target.value)}
                placeholder="Provincia, cantón, señas exactas"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <User className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              3. Datos del Cliente / Receptor
            </h3>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre / Razón Social <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Corporación Médica del Este S.A."
                value={formData.cliente.nombre}
                onChange={(e) => handleClienteChange('nombre', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Identificación
                </label>
                <select
                  value={formData.cliente.tipoIdentificacion}
                  onChange={(e) => handleClienteChange('tipoIdentificacion', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
                >
                  {TIPO_ID_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Identificación
                </label>
                <input
                  type="text"
                  placeholder="3-101-123456"
                  value={formData.cliente.identificacion}
                  onChange={(e) => handleClienteChange('identificacion', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="contacto@empresa.cr"
                  value={formData.cliente.correo}
                  onChange={(e) => handleClienteChange('correo', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  placeholder="2200-0000"
                  value={formData.cliente.telefono}
                  onChange={(e) => handleClienteChange('telefono', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección del Cliente</label>
              <input
                type="text"
                placeholder="Provincia, cantón, señas"
                value={formData.cliente.direccion}
                onChange={(e) => handleClienteChange('direccion', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detalle de Ítems */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                4. Líneas de Detalle del Comprobante
              </h3>
              <p className="text-xs text-slate-500">
                Tarifas de IVA soportadas para Costa Rica (13%, 4%, 2%, 1%, 0.5%, 0% exento).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/80 px-3.5 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100 card-hover-transition active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Línea</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <InvoiceItem
              key={item.id}
              item={item}
              index={index}
              canDelete={formData.items.length > 1}
              onChange={handleItemChange}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        {/* Resumen de totales dinámicos */}
        <div className="mt-8 flex flex-col items-end border-t border-slate-200 pt-5">
          <div className="w-full max-w-sm rounded-xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200/70">
              <Calculator className="h-3.5 w-3.5 text-slate-400" />
              <span>Resumen Financiero</span>
            </div>

            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal neto:</span>
              <span className="font-mono font-medium text-slate-900 tabular-nums">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
              <span>Total IVA liquidado:</span>
              <span className="font-mono font-medium text-slate-900 tabular-nums">
                {formatCurrency(totals.impuesto)}
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1 text-slate-950">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Total Comprobante:
                </span>
                <span className="block text-[10px] text-slate-400">CRC (₡)</span>
              </div>
              <span className="font-mono text-xl font-bold text-slate-950 tabular-nums">
                {formatCurrency(totals.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 card-hover-transition active:scale-[0.98]"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-sky-700 card-hover-transition active:scale-[0.98]"
        >
          <Check className="h-4 w-4" />
          <span>Guardar y Emitir Factura</span>
        </button>
      </div>
    </form>
  );
}
