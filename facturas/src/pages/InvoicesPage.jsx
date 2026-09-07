import { useState } from 'react';
import { Plus, ArrowLeft, Receipt, Layers } from 'lucide-react';
import InvoiceList from '../components/InvoiceList.jsx';
import Invoice from '../components/Invoice.jsx';
import InvoiceForm from '../components/InvoiceForm.jsx';

export default function InvoicesPage({
  invoices = [],
  selectedInvoiceId,
  onSelectInvoice,
  onAddInvoice,
  outlierIds = new Set(),
}) {
  const [isCreating, setIsCreating] = useState(false);

  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0];

  const handleSave = (newInvoice) => {
    onAddInvoice(newInvoice);
    setIsCreating(false);
  };

  // Generar correlativo sugerido siguiente
  const nextInvoiceNumber = `FAC-${String(invoices.length + 1).padStart(4, '0')}`;

  return (
    <div className="space-y-6">
      {/* Barra de cabecera de la sección */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <Receipt className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Gestión de Facturación
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
              {invoices.length} comprobantes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-10">
            Emisión de comprobantes, cálculo dinámico de IVA (Ley 9635) y previsualización de documentos comerciales.
          </p>
        </div>

        <div>
          {isCreating ? (
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 card-hover-transition active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a Factura</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-sky-700 card-hover-transition active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Factura</span>
            </button>
          )}
        </div>
      </div>

      {/* Distribución de la pantalla */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Columna Izquierda: Listado de Facturas con Scroll Dedicado */}
        <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <span>Registro de Facturas</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {invoices.length} en total
            </span>
          </div>

          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
            <InvoiceList
              invoices={invoices}
              selectedInvoiceId={selectedInvoice?.id}
              onSelectInvoice={(id) => {
                onSelectInvoice(id);
                setIsCreating(false);
              }}
              outlierIds={outlierIds}
            />
          </div>
        </aside>

        {/* Columna Derecha: Formulario o Comprobante */}
        <section className="lg:col-span-8 min-w-0">
          {isCreating ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                <h3 className="text-base font-bold text-slate-900">
                  Emitir Nueva Factura Comercial
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete los datos fiscales del emisor, cliente y detalle de ítems gravados o exentos.
                </p>
              </div>
              <InvoiceForm
                onSaveInvoice={handleSave}
                onCancel={() => setIsCreating(false)}
                nextInvoiceNumber={nextInvoiceNumber}
              />
            </div>
          ) : (
            <Invoice invoice={selectedInvoice} />
          )}
        </section>
      </div>
    </div>
  );
}
