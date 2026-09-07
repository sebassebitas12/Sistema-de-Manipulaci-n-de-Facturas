import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatCurrency } from '../../utils/currency.js';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 text-xs text-white shadow-xl backdrop-blur-xs">
        <p className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">{label}</p>
        <p className="mt-1 font-mono text-base font-bold text-sky-400 tabular-nums">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-slate-400 mt-1 text-[11px]">
          {data.facturas} {data.facturas === 1 ? 'comprobante emitido' : 'comprobantes emitidos'}
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-slate-400">
        No hay datos suficientes para graficar ingresos.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="periodo"
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
            tickFormatter={(val) => `₡${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Bar dataKey="total" fill="#0284C7" radius={[6, 6, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

