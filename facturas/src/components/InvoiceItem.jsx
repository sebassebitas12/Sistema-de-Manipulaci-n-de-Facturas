import { Trash2 } from 'lucide-react';
import { IVA_RATES, calculateItemTotals } from '../utils/invoiceCalculations.js';
import { formatCurrency } from '../utils/currency.js';

export default function InvoiceItem({
  item,
  index,
  canDelete,
  onChange,
  onRemove,
}) {
  const { subtotal, impuesto, total } = calculateItemTotals(item);

  const handleFieldChange = (field, val) => {
    onChange(item.id, { ...item, [field]: val });
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-slate-300">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Línea #{index + 1}
        </span>
        {canDelete && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            title="Eliminar esta línea de detalle"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Eliminar</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-12 md:items-end">
        {/* Descripción */}
        <div className="md:col-span-5">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Descripción del bien o servicio <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={item.descripcion}
            onChange={(e) => handleFieldChange('descripcion', e.target.value)}
            placeholder="Ej: Servicio de consultoría técnica especializada"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
          />
        </div>

        {/* Cantidad */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Cantidad <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            step="1"
            required
            value={item.cantidad}
            onChange={(e) => handleFieldChange('cantidad', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none tabular-nums transition-all"
          />
        </div>

        {/* Precio unitario */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Precio unitario (₡) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            step="100"
            required
            value={item.precioUnitario}
            onChange={(e) => handleFieldChange('precioUnitario', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none tabular-nums transition-all"
          />
        </div>

        {/* Tarifa IVA */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tarifa IVA (Costa Rica)
          </label>
          <select
            value={item.tasaIVA}
            onChange={(e) => handleFieldChange('tasaIVA', parseFloat(e.target.value))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all"
          >
            {IVA_RATES.map((rateOption) => (
              <option key={rateOption.rate} value={rateOption.rate}>
                {rateOption.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resumen dinámico por línea */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 px-3.5 py-2 text-xs text-slate-600 border border-slate-100">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400">Subtotal: </span>
            <span className="font-mono font-medium text-slate-800 tabular-nums">{formatCurrency(subtotal)}</span>
          </div>
          <div>
            <span className="text-slate-400">IVA ({item.tasaIVA}%): </span>
            <span className="font-mono font-medium text-slate-800 tabular-nums">{formatCurrency(impuesto)}</span>
          </div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Total línea: </span>
          <span className="font-mono font-bold text-slate-950 tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
