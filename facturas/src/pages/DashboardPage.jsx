import { useMemo } from 'react';
import {
  DollarSign,
  FileCheck2,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  Calendar,
  Info,
  ShieldAlert,
} from 'lucide-react';
import MetricCard from '../components/MetricCard.jsx';
import RevenueChart from '../components/charts/RevenueChart.jsx';
import ClientChart from '../components/charts/ClientChart.jsx';
import { computeDashboardMetrics } from '../utils/analytics.js';
import { formatCurrency, formatNumber } from '../utils/currency.js';

export default function DashboardPage({ invoices = [] }) {
  // useMemo para optimizar los cálculos analíticos derivados
  const metrics = useMemo(() => {
    return computeDashboardMetrics(invoices);
  }, [invoices]);

  const {
    totalFacturado,
    numeroFacturas,
    ticketPromedio,
    topClientes,
    outliers,
    proyeccionIngresos,
    facturasPorEstado,
    ingresosPorMes,
    distribucionClientes,
  } = metrics;

  return (
    <div className="space-y-6">
      {/* Encabezado del Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-700" />
            <span>Dashboard Administrativo y Análisis de Facturación</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Métricas clave en tiempo real, detección estadística de valores atípicos y proyecciones basadas en datos emitidos.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Moneda Base: CRC (₡)</span>
        </div>
      </div>

      {/* 1. Tarjetas de Métricas Principales (KPIs) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          id="kpi-total-facturado"
          title="Total Facturado"
          value={formatCurrency(totalFacturado)}
          subtitle="Suma acumulada de facturas emitidas"
          icon={DollarSign}
          badgeText="CRC"
          badgeType="success"
        />

        <MetricCard
          id="kpi-num-facturas"
          title="Número de Facturas"
          value={formatNumber(numeroFacturas)}
          subtitle={`Pagadas: ${facturasPorEstado.pagadas} · Pendientes: ${facturasPorEstado.pendientes} · Vencidas: ${facturasPorEstado.vencidas}`}
          icon={FileCheck2}
          badgeText={`${facturasPorEstado.vencidas} vencidas`}
          badgeType={facturasPorEstado.vencidas > 0 ? 'danger' : 'neutral'}
        />

        <MetricCard
          id="kpi-ticket-promedio"
          title="Ticket Promedio"
          value={formatCurrency(ticketPromedio)}
          subtitle="Monto medio por comprobante"
          icon={TrendingUp}
          badgeText="Media"
          badgeType="info"
        />

        <MetricCard
          id="kpi-facturas-atipicas"
          title="Facturas Atípicas"
          value={`${outliers.outlierCount} detectada${outliers.outlierCount === 1 ? '' : 's'}`}
          subtitle={`Criterio: Z > 1.5σ (σ = ${formatCurrency(outliers.stdDev)})`}
          icon={AlertTriangle}
          badgeText={outliers.outlierCount > 0 ? 'Anomalía Z-Score' : 'Normal'}
          badgeType={outliers.outlierCount > 0 ? 'warning' : 'success'}
          highlight={outliers.outlierCount > 0}
        />
      </div>

      {/* 2. Sección de Alerta y Análisis de Facturas Atípicas */}
      {outliers.outlierCount > 0 && (
        <div className="rounded-xl border border-amber-300/90 bg-amber-50/60 p-5 text-xs text-amber-950 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="rounded-lg bg-amber-100 p-2.5 text-amber-800 border border-amber-200/80 shadow-2xs">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                  <span>Detección Estadística de Facturas Atípicas (Outliers)</span>
                  <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-semibold text-amber-900 border border-amber-300">
                    Criterio Z-Score &gt; 1.5σ
                  </span>
                </h4>
                <p className="mt-1 text-amber-800/90 leading-relaxed text-xs">
                  Se identificaron {outliers.outlierCount} comprobante(s) cuyo monto se desvía más de 1.5 desviaciones
                  estándar (<span className="font-mono font-semibold">1.5σ</span>) respecto a la media poblacional de facturas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-amber-200/90 font-mono text-xs shadow-2xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans font-medium uppercase">Promedio muestral (μ):</span>
                  <span className="font-bold text-slate-800 tabular-nums">{formatCurrency(outliers.mean)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans font-medium uppercase">Desviación estándar (σ):</span>
                  <span className="font-bold text-slate-800 tabular-nums">{formatCurrency(outliers.stdDev)}</span>
                </div>
                <div>
                  <span className="text-amber-800/70 block text-[10px] font-sans font-medium uppercase">Umbral crítico (μ + 1.5σ):</span>
                  <span className="font-bold text-amber-950 tabular-nums">{formatCurrency(outliers.threshold)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <p className="font-semibold text-amber-950 text-xs">Comprobantes identificados como atípicos:</p>
                <div className="flex flex-wrap gap-2">
                  {outliers.itemsWithZ
                    .filter((item) => item.isOutlier)
                    .map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-amber-950 border border-amber-300 shadow-2xs"
                      >
                        <span className="font-mono text-slate-700">{item.numeroFactura}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-bold font-mono text-slate-950 tabular-nums">{formatCurrency(item.total)}</span>
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-mono text-amber-900 border border-amber-200">
                          Z = {item.zScore}σ
                        </span>
                        <span className="text-slate-400 text-[11px] font-normal">({item.cliente})</span>
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Gráficos con Recharts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico 1: Ingresos por Período */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Ingresos por Período Mensual
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evolución de montos facturados en colones costarricenses (CRC).
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <RevenueChart data={ingresosPorMes} />
        </div>

        {/* Gráfico 2: Distribución de Facturación por Cliente */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Distribución por Cliente
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Participación de los principales clientes en la facturación total.
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <ClientChart data={distribucionClientes} />
        </div>
      </div>

      {/* 4. Top 3 Clientes y Proyección Estimada */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Top 3 Clientes */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Top 3 Clientes con Mayor Facturación</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Agrupación calculada dinámicamente según el total de facturas emitidas.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {topClientes.map((cliente, index) => {
                const porcentaje =
                  totalFacturado > 0 ? ((cliente.total / totalFacturado) * 100).toFixed(1) : 0;

                return (
                  <div
                    key={cliente.nombre}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-2xs">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{cliente.nombre}</p>
                          <p className="text-xs text-slate-500">
                            {cliente.facturas} {cliente.facturas === 1 ? 'comprobante emitido' : 'comprobantes emitidos'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold font-mono text-slate-950 tabular-nums">
                          {formatCurrency(cliente.total)}
                        </p>
                        <p className="text-xs text-slate-500 font-mono tabular-nums">{porcentaje}% del total</p>
                      </div>
                    </div>

                    {/* Barra visual de porcentaje */}
                    <div className="mt-3 w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-sky-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}

              {topClientes.length === 0 && (
                <p className="text-center py-8 text-xs text-slate-400">
                  No hay clientes registrados aún.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Proyección Estimada de Ingresos */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Proyección Estimada
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Estimación basada en promedio móvil aritmético</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-5 text-center shadow-2xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ingreso Mensual Proyectado
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950 font-mono tabular-nums">
                {formatCurrency(proyeccionIngresos)}
              </p>
              <p className="mt-1.5 text-[11px] text-slate-600 font-medium">
                Calculado a partir de la media de ingresos por período registrado.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Nota Metodológica Académica</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                Esta proyección representa una simulación académica basada en el promedio móvil aritmético de
                facturación mensual y no constituye estimación fiscal ni contable formal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

