import { FileText, Calendar, User, ChevronRight, AlertTriangle, CheckCircle2, Clock4, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/currency.js';
import { calculateInvoiceTotals } from '../utils/invoiceCalculations.js';
import { getInvoiceStatus, getStatusBadgeStyle } from '../utils/invoiceStatus.js';

export default function InvoiceList({
  invoices = [],
  selectedInvoiceId,
  onSelectInvoice,
  outlierIds = new Set(),
}) {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
          <FileText className="h-6 w-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800">
          No hay facturas registradas
        </h4>
        <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
          Utilice el botón &quot;Nueva Factura&quot; para emitir el primer comprobante comercial del sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {invoices.map((invoice) => {
        const { total } = calculateInvoiceTotals(invoice.items);
        const status = getInvoiceStatus(invoice);
        const isSelected = invoice.id === selectedInvoiceId;
        const isOutlier = outlierIds.has(invoice.id);

        return (
          <div
            key={invoice.id}
            id={`invoice-item-${invoice.id}`}
            onClick={() => onSelectInvoice(invoice.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectInvoice(invoice.id);
              }
            }}
            className={`group relative rounded-xl border p-4 text-left cursor-pointer card-hover-transition outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
              isSelected
                ? 'border-red-500 bg-red-50/50 shadow-xs ring-1 ring-red-500/20'
                : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60 hover:shadow-2xs'
            }`}
          >
            {/* Indicador de Selección Izquierdo */}
            {isSelected && (
              <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-red-600" />
            )}

            <div className="flex items-start justify-between gap-3">
              {/* Información principal */}
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 tracking-tight">
                    {invoice.numeroFactura}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadgeStyle(
                      status
                    )}`}
                  >
                    {status === 'Pagada' && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                    {status === 'Pendiente' && <Clock4 className="h-3 w-3 shrink-0" />}
                    {status === 'Vencida' && <AlertCircle className="h-3 w-3 shrink-0" />}
                    <span>{status}</span>
                  </span>

                  {isOutlier && (
                    <span
                      title="Monto atípico detectado estadísticamente (> μ + 2σ)"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                    >
                      <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                      <span>Atípica</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-700 truncate">
                  <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="font-semibold truncate">
                    {invoice.cliente?.nombre || 'Consumidor Final'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
                    <span>Emisión: {invoice.fechaEmision}</span>
                  </span>
                  <span>·</span>
                  <span>{invoice.condicionVenta}</span>
                </div>
              </div>

              {/* Monto y flecha indicadora */}
              <div className="flex flex-col items-end justify-between self-stretch pl-2">
                <p className="font-mono text-sm font-bold text-slate-950 tabular-nums">
                  {formatCurrency(total)}
                </p>
                <div className="flex items-center gap-0.5 text-xs font-medium text-slate-400 group-hover:text-red-600 transition-colors">
                  <span className="hidden sm:inline text-[11px]">Ver</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
