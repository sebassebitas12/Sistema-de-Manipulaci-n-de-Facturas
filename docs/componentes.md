# 🧩 Referencia de Componentes

Documentación de la API de props y responsabilidades de cada componente de la aplicación.

---

## Páginas (`src/pages/`)

### `InvoicesPage.jsx`

Página principal del módulo de facturación. Orquesta la lista lateral, la previsualización y el formulario de emisión.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `invoices` | `Array` | Lista completa de facturas |
| `selectedInvoiceId` | `string \| null` | ID de la factura actualmente seleccionada |
| `onSelectInvoice` | `Function(id)` | Callback para cambiar la factura seleccionada |
| `onAddInvoice` | `Function(invoice)` | Callback para agregar nueva factura al estado global |
| `outlierIds` | `Set<string>` | Set de IDs de facturas clasificadas como atípicas |

**Estado local:**
- `isCreating` (boolean) — alterna entre formulario y previsualización

---

### `DashboardPage.jsx`

Dashboard analítico con KPIs, gráficos y análisis de outliers. Es un componente **puro de presentación** (no tiene estado local).

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `invoices` | `Array` | Lista completa de facturas (fuente de todos los cálculos) |

**Métricas calculadas internamente** (con `useMemo`):
- `totalFacturado`, `numeroFacturas`, `ticketPromedio`
- `topClientes[]`, `outliers`, `proyeccionIngresos`
- `facturasPorEstado`, `ingresosPorMes[]`, `distribucionClientes[]`

---

## Componentes de UI (`src/components/`)

### `Invoice.jsx`

Previsualización de un comprobante fiscal en formato de documento comercial.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `invoice` | `Object \| undefined` | Objeto completo de la factura a previsualizar |

**Renderiza:**
- Datos del emisor y cliente
- Tabla de ítems con cantidades, precios unitarios, IVA y totales
- Resumen: subtotal, impuesto total, **total a pagar**
- Badge de estado (Pagada / Pendiente / Vencida)
- Condición de venta y medio de pago

---

### `InvoiceForm.jsx`

Formulario de emisión de nueva factura comercial. El formulario más complejo de la aplicación.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `onSaveInvoice` | `Function(invoice)` | Callback ejecutado al guardar el formulario |
| `onCancel` | `Function()` | Callback para cancelar y volver a la previsualización |
| `nextInvoiceNumber` | `string` | Correlativo sugerido (ej: `FAC-0009`) |

**Secciones del formulario:**
1. **Datos del Emisor** — nombre, tipo de ID, identificación, correo, teléfono, dirección
2. **Datos del Cliente** — mismos campos que emisor
3. **Condición de venta** — Contado / Crédito
4. **Medio de pago** — Transferencia, Tarjeta, Efectivo, Cheque, Otros
5. **Fecha de emisión** y **Fecha de vencimiento**
6. **Ítems de la factura** — descripción, cantidad, precio unitario, tasa IVA
7. **Resumen de totales** — subtotal, impuesto, total calculado en tiempo real

---

### `InvoiceList.jsx`

Lista lateral scrolleable de todas las facturas registradas.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `invoices` | `Array` | Lista de facturas a mostrar |
| `selectedInvoiceId` | `string \| null` | ID de la factura activa (para resaltarla) |
| `onSelectInvoice` | `Function(id)` | Callback al hacer clic en una factura |
| `outlierIds` | `Set<string>` | IDs de facturas atípicas (para mostrar indicador visual) |

---

### `InvoiceItem.jsx`

Tarjeta individual en la lista de facturas. Muestra un resumen compacto del comprobante.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `invoice` | `Object` | Objeto de factura |
| `isSelected` | `boolean` | Si la tarjeta está actualmente seleccionada |
| `isOutlier` | `boolean` | Si la factura fue clasificada como atípica |
| `onClick` | `Function()` | Callback al hacer clic |

**Muestra:**
- Número de factura y nombre del cliente
- Fecha de emisión y monto total
- Badge de estado (Pagada / Pendiente / Vencida)
- Indicador ámbar si `isOutlier === true`

---

### `MetricCard.jsx`

Tarjeta de KPI para el dashboard. Componente genérico y reutilizable.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `id` | `string` | ID único del elemento (para accesibilidad y testing) |
| `title` | `string` | Título de la métrica |
| `value` | `string` | Valor principal a mostrar |
| `subtitle` | `string` | Texto descriptivo debajo del valor |
| `icon` | `LucideIcon` | Componente de ícono de Lucide |
| `badgeText` | `string` | Texto del badge informativo |
| `badgeType` | `'success' \| 'danger' \| 'warning' \| 'info' \| 'neutral'` | Color del badge |
| `highlight` | `boolean` | Si `true`, aplica un borde de alerta al card |

---

## Componentes de Gráficos (`src/components/charts/`)

### `RevenueChart.jsx`

Gráfico de barras que muestra los ingresos totales por período mensual.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `data` | `Array<{periodo, total, facturas}>` | Serie de datos mensuales |

**Implementación:** `BarChart` de Recharts con eje Y formateado en CRC (₡), tooltip personalizado con nombre del período y monto total.

---

### `ClientChart.jsx`

Gráfico de torta/pie que muestra la distribución porcentual de facturación por cliente.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `data` | `Array<{name, fullName, value, facturas}>` | Serie de datos por cliente |

**Implementación:** `PieChart` de Recharts con `PieLabel` personalizado, leyenda interactiva y tooltip con nombre completo del cliente.

---

## Convenciones de Nomenclatura

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componente React | PascalCase | `InvoiceForm.jsx` |
| Hook personalizado | camelCase con `use` | `useInvoiceState` |
| Función utilitaria | camelCase | `calculateItemTotals` |
| Constante de datos | UPPER_SNAKE_CASE | `SAMPLE_INVOICES` |
| ID de elemento HTML | kebab-case | `kpi-total-facturado` |
