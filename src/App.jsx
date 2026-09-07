import { useState, useMemo } from 'react';
import {
  Receipt,
  LayoutDashboard,
  Building2,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import InvoicesPage from './pages/InvoicesPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { SAMPLE_INVOICES } from './data/sampleInvoices.js';
import { detectOutliers } from './utils/analytics.js';

export default function App() {
  const [invoices, setInvoices] = useState(SAMPLE_INVOICES);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(
    SAMPLE_INVOICES[0]?.id || null
  );
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'dashboard'

  // Identificar facturas atípicas en memoria
  const outliersData = useMemo(() => {
    return detectOutliers(invoices);
  }, [invoices]);

  const handleAddInvoice = (newInvoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    setSelectedInvoiceId(newInvoice.id);
  };

  const handleResetSampleData = () => {
    setInvoices(SAMPLE_INVOICES);
    setSelectedInvoiceId(SAMPLE_INVOICES[0].id);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Barra de Navegación Principal */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logotipo y Título */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                    Facturación &amp; Dashboard CR
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                    CRC (₡)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Simulación Académica de Facturación y Análisis Tributario
                </p>
              </div>
            </div>

            {/* Pestañas de Navegación */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                id="tab-facturacion"
                onClick={() => setActiveTab('invoices')}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'invoices'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Receipt className="h-4 w-4" />
                <span>Facturación</span>
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    activeTab === 'invoices'
                      ? 'bg-red-800/80 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {invoices.length}
                </span>
              </button>

              <button
                type="button"
                id="tab-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
                {outliersData.outlierCount > 0 && (
                  <span
                    className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      activeTab === 'dashboard'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                    title={`${outliersData.outlierCount} facturas atípicas detectadas`}
                  >
                    !
                  </span>
                )}
              </button>
            </nav>

            {/* Botón de reestablecer dataset de prueba */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSampleData}
                title="Recargar el dataset de 8 facturas de prueba"
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                <span>Dataset de Prueba</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Dinámico */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'invoices' ? (
          <InvoicesPage
            invoices={invoices}
            selectedInvoiceId={selectedInvoiceId}
            onSelectInvoice={setSelectedInvoiceId}
            onAddInvoice={handleAddInvoice}
            outlierIds={outliersData.outlierIds}
          />
        ) : (
          <DashboardPage invoices={invoices} />
        )}
      </main>

      {/* Pie de Página con Notas Académicas */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-slate-400" />
            <span>
              Proyecto Académico de React &amp; Análisis Tributario — Costa Rica (Ley 9635)
            </span>
          </div>
          <div>
            <span>Moneda: Colón Costarricense (₡ CRC) · Tarifas de IVA: 13%, 4%, 2%, 1%, 0.5%, 0%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
