import { Download, CheckCircle2, Clock4, AlertCircle, Building2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/currency.js';
import { calculateInvoiceTotals, calculateItemTotals } from '../utils/invoiceCalculations.js';
import { getInvoiceStatus, getStatusBadgeStyle } from '../utils/invoiceStatus.js';

export default function Invoice({ invoice }) {
  if (!invoice) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-2xs">
        <p className="text-sm font-medium">Seleccione una factura del listado para previsualizar el documento comercial.</p>
      </div>
    );
  }

  const { subtotal, impuesto, total } = calculateInvoiceTotals(invoice.items);
  const status = getInvoiceStatus(invoice);

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-printable-document');
    if (!element) return;

    // Usar los links de hojas de estilo ya cargadas en el documento
    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((link) => `<link rel="stylesheet" href="${link.href}" />`)
      .join('\n');

    // Estilos inline embebidos en <style> tags (Vite los inyecta así en dev)
    const styleTags = Array.from(document.querySelectorAll('style'))
      .map((s) => `<style>${s.textContent}</style>`)
      .join('\n');

    const printWindow = window.open('', '_blank', 'width=960,height=800');
    if (!printWindow) {
      alert('El navegador bloqueó la ventana emergente. Permite ventanas emergentes para localhost.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Factura ${invoice.numeroFactura}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
          ${linkTags}
          ${styleTags}
          <style>
            @page { size: A4; margin: 15mm; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
            html, body { background: white !important; margin: 0; padding: 0; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
          </style>
        </head>
        <body>
          ${element.outerHTML}
          <script>
            window.onload = function() { setTimeout(function() { window.print(); }, 400); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      {/* Barra de Controles y Herramientas del Documento (Solo en Pantalla) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-5 py-3 shadow-2xs print:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Vista Previa de Comprobante
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-xs font-semibold text-slate-700">
            {invoice.numeroFactura}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyle(
              status
            )}`}
          >
            {status === 'Pagada' && <CheckCircle2 className="h-3.5 w-3.5" />}
            {status === 'Pendiente' && <Clock4 className="h-3.5 w-3.5" />}
            {status === 'Vencida' && <AlertCircle className="h-3.5 w-3.5" />}
            <span>{status}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPDF}
            aria-label="Guardar factura como PDF"
            className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-red-700 card-hover-transition active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            <span>Guardar como PDF</span>
          </button>
        </div>
      </div>

      {/* Escenario de Fondo Gris para Destacar la Hoja del Documento */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-100/70 p-4 sm:p-6 lg:p-8">
        {/* Hoja de Factura Comercial (Formato de Documento Físico Digitalizado) */}
        <article
          id="invoice-printable-document"
          className="mx-auto w-full max-w-3xl rounded-xl border border-slate-200/90 bg-white p-8 sm:p-12 document-sheet-shadow text-slate-900"
        >
          {/* 1. ENCABEZADO DEL DOCUMENTO */}
          <header className="border-b border-slate-200 pb-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
              {/* Identidad del Emisor */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900">
                      {invoice.emisor?.nombre || 'Soluciones Empresariales S.A.'}
                    </h2>
                    <p className="text-xs font-semibold text-red-700">
                      Emisor Comercial Autorizado
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <p>
                    <span className="text-slate-500">{invoice.emisor?.tipoIdentificacion || 'Cédula Jurídica'}: </span>
                    <span className="font-mono font-medium text-slate-800">
                      {invoice.emisor?.identificacion || '3-101-000000'}
                    </span>
                  </p>
                  {invoice.emisor?.correo && (
                    <p>
                      <span className="text-slate-500">Correo: </span>
                      <span className="text-slate-700">{invoice.emisor.correo}</span>
                    </p>
                  )}
                  {invoice.emisor?.telefono && (
                    <p>
                      <span className="text-slate-500">Teléfono: </span>
                      <span className="text-slate-700">{invoice.emisor.telefono}</span>
                    </p>
                  )}
                  {invoice.emisor?.direccion && (
                    <p className="text-slate-500 max-w-sm pt-0.5">
                      {invoice.emisor.direccion}
                    </p>
                  )}
                </div>
              </div>

              {/* Metadatos de la Factura */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5 sm:min-w-[240px] sm:text-right space-y-2">
                <div className="border-b border-slate-200/80 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Factura Comercial
                  </span>
                  <p className="font-mono text-2xl font-bold tracking-tight text-slate-900">
                    {invoice.numeroFactura}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                    <span className="text-slate-400">Emisión:</span>
                    <span className="font-medium text-slate-800 font-mono">{invoice.fechaEmision}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                    <span className="text-slate-400">Vencimiento:</span>
                    <span className="font-medium text-slate-800 font-mono">{invoice.fechaVencimiento}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                    <span className="text-slate-400">Condición:</span>
                    <span className="font-medium text-slate-800">{invoice.condicionVenta}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                    <span className="text-slate-400">Medio de Pago:</span>
                    <span className="font-medium text-slate-800">{invoice.medioPago}</span>
                  </div>
                </div>

                <div className="pt-2 sm:flex sm:justify-end">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(
                      status
                    )}`}
                  >
                    {status === 'Pagada' && <CheckCircle2 className="h-3 w-3" />}
                    {status === 'Pendiente' && <Clock4 className="h-3 w-3" />}
                    {status === 'Vencida' && <AlertCircle className="h-3 w-3" />}
                    <span>{status}</span>
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* 2. SECCIÓN DEL CLIENTE / RECEPTOR */}
          <section className="my-8 rounded-xl border border-slate-200/80 bg-slate-50/60 p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Facturar a / Receptor
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                Cliente Registrado
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div className="sm:col-span-2 lg:col-span-1">
                <span className="block text-slate-400 mb-0.5">Nombre / Razón Social</span>
                <p className="text-sm font-bold text-slate-900">
                  {invoice.cliente?.nombre || 'Consumidor Final'}
                </p>
              </div>

              <div>
                <span className="block text-slate-400 mb-0.5">
                  {invoice.cliente?.tipoIdentificacion || 'Identificación'}
                </span>
                <p className="font-mono font-medium text-slate-800">
                  {invoice.cliente?.identificacion || 'No especificada'}
                </p>
              </div>

              <div>
                <span className="block text-slate-400 mb-0.5">Correo Electrónico</span>
                <p className="text-slate-800 font-medium truncate">
                  {invoice.cliente?.correo || 'No indicado'}
                </p>
              </div>

              {invoice.cliente?.telefono && (
                <div>
                  <span className="block text-slate-400 mb-0.5">Teléfono</span>
                  <p className="text-slate-800">{invoice.cliente.telefono}</p>
                </div>
              )}

              {invoice.cliente?.direccion && (
                <div className="sm:col-span-2">
                  <span className="block text-slate-400 mb-0.5">Dirección</span>
                  <p className="text-slate-700">{invoice.cliente.direccion}</p>
                </div>
              )}
            </div>
          </section>

          {/* 3. TABLA DE DETALLE DE LÍNEAS */}
          <section className="my-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th scope="col" className="py-3 px-3">Descripción</th>
                    <th scope="col" className="py-3 px-3 text-center w-20">Cantidad</th>
                    <th scope="col" className="py-3 px-3 text-right w-32">Precio Unitario</th>
                    <th scope="col" className="py-3 px-3 text-center w-20">Tarifa IVA</th>
                    <th scope="col" className="py-3 px-3 text-right w-36">Total Línea</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item, idx) => {
                    const itemCalcs = calculateItemTotals(item);
                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3 font-medium text-slate-900">
                          {item.descripcion}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-700 tabular-nums">
                          {item.cantidad}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-slate-700 tabular-nums">
                          {formatCurrency(Number(item.precioUnitario))}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
                            {item.tasaIVA}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {formatCurrency(itemCalcs.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. TOTALES Y CONDICIONES */}
          <section className="border-t border-slate-200 pt-6">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
              {/* Información y Condiciones de Pago */}
              <div className="max-w-sm space-y-4 text-xs">
                <div className="space-y-1.5 rounded-lg border border-slate-200/80 bg-slate-50/50 p-4">
                  <p className="font-semibold text-slate-800">Condiciones Comerciales</p>
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-700">Forma de pago:</span> {invoice.medioPago} ({invoice.condicionVenta}).
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Validez fiscal referencial conforme al régimen tributario de Costa Rica (Ley 9635).
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
                  <p className="font-semibold text-slate-700">Aviso Académico</p>
                  <p className="mt-0.5">
                    Documento generado como simulación académica. No constituye un comprobante electrónico formal ni ha sido transmitido a la Dirección General de Tributación.
                  </p>
                </div>
              </div>

              {/* Panel Resumen de Totales */}
              <div className="w-full md:w-80 rounded-xl border border-slate-200/90 bg-slate-50/40 p-5 space-y-3">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                  <span>Impuesto (IVA):</span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    {formatCurrency(impuesto)}
                  </span>
                </div>

                {/* Gran Total Destacado */}
                <div className="pt-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Total Factura
                      </span>
                      <span className="text-[11px] text-slate-400">CRC (₡)</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-2xl font-black text-slate-950 tabular-nums tracking-tight">
                        {formatCurrency(total)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pie de Página del Documento */}
          <footer className="mt-12 border-t border-slate-100 pt-6 text-center text-[11px] text-slate-400">
            <p>Gracias por su preferencia comercial · Simulación Educativa de Facturación Costa Rica</p>
          </footer>
        </article>
      </div>
    </div>
  );
}
