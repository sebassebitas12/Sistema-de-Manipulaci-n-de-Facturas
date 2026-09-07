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

const CustomClientTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 text-xs text-white shadow-xl backdrop-blur-xs">
        <p className="font-semibold text-slate-200">{item.fullName}</p>
        <p className="mt-1 font-mono text-base font-bold text-teal-400 tabular-nums">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-slate-400 mt-1 text-[11px]">
          {item.facturas} {item.facturas === 1 ? 'comprobante emitido' : 'comprobantes emitidos'}
        </p>
      </div>
    );
  }
  return null;
};

export default function ClientChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-slate-400">
        No hay datos suficientes para graficar clientes.
      </div>
    );
  }

  // Tomamos los 5 principales para legibilidad óptima
  const topData = data.slice(0, 5);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={topData}
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
            tickFormatter={(val) => `₡${(val / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
            width={120}
          />
          <Tooltip content={<CustomClientTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Bar dataKey="value" fill="#0D9488" radius={[0, 6, 6, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

