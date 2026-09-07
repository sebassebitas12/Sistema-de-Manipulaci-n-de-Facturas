# 🏗️ Arquitectura del Sistema

## Descripción General

La aplicación sigue una arquitectura de **SPA (Single Page Application)** con React 19, gestionando el estado de forma centralizada en el componente raíz `App.jsx` y propagándolo hacia abajo mediante props. No se usa ningún gestor de estado externo (Redux, Zustand, etc.); todo el estado vive en React con `useState` y `useMemo`.

---

## Flujo de Datos

```
App.jsx  (estado global: invoices[], selectedInvoiceId, activeTab)
    │
    ├── InvoicesPage.jsx  (pestaña "Facturación")
    │       ├── InvoiceList.jsx   ← lista lateral de comprobantes
    │       ├── Invoice.jsx       ← previsualización del comprobante seleccionado
    │       └── InvoiceForm.jsx   ← formulario de emisión de nueva factura
    │
    └── DashboardPage.jsx  (pestaña "Dashboard")
            ├── MetricCard.jsx × 4   ← KPIs principales
            ├── RevenueChart.jsx     ← gráfico de barras (Recharts)
            ├── ClientChart.jsx      ← gráfico de torta (Recharts)
            └── Tabla Top 3 Clientes + Proyección
```

---

## Jerarquía de Componentes y Responsabilidades

### `App.jsx` — Componente Raíz

Es el único componente con estado "elevado". Contiene:

- `invoices[]` — lista de todas las facturas (fuente única de verdad)
- `selectedInvoiceId` — ID de la factura actualmente seleccionada
- `activeTab` — pestaña activa (`'invoices'` | `'dashboard'`)
- `outliersData` — calculado con `useMemo` a partir de `invoices`

Maneja:
- `handleAddInvoice(newInvoice)` — agrega una nueva factura al inicio
- `handleResetSampleData()` — restaura el dataset de prueba original

### `InvoicesPage.jsx` — Vista de Facturación

- Recibe `invoices`, `selectedInvoiceId`, `onSelectInvoice`, `onAddInvoice`, `outlierIds`
- Estado local: `isCreating` (boolean) para alternar entre formulario y previsualización
- Calcula el correlativo sugerido: `FAC-000N`

### `DashboardPage.jsx` — Vista Analítica

- Recibe solo `invoices[]`
- Ejecuta `computeDashboardMetrics()` con `useMemo` para evitar recalcular en cada render
- Renderiza todos los widgets sin estado propio

---

## Decisiones de Diseño

### ¿Por qué estado en App.jsx y no Context o Redux?

La app es de tamaño mediano con un único árbol de datos (facturas). Context o Redux añadirían complejidad sin beneficio real para este caso de uso académico. El prop drilling es de un solo nivel en la mayoría de los casos.

### ¿Por qué `useMemo` para los cálculos analíticos?

`computeDashboardMetrics` itera sobre todas las facturas y aplica múltiples reducciones. Sin `useMemo`, este cálculo se ejecutaría en cada re-render del componente padre (App), incluso si `invoices` no cambió. Con `useMemo([invoices])`, solo recalcula cuando el array cambia.

### ¿Por qué los datos están en memoria (no backend)?

Es una simulación académica. La persistencia se logra con el estado de React; al refrescar la página, se restauran las facturas del `SAMPLE_INVOICES`. Esto simplifica la arquitectura eliminando la necesidad de API, base de datos o autenticación.

---

## Capas de la Aplicación

| Capa | Archivos | Responsabilidad |
|---|---|---|
| **UI / Vista** | `pages/`, `components/` | Renderizado, interacción del usuario |
| **Lógica de negocio** | `utils/` | Cálculos tributarios, estadísticas, formateo |
| **Datos** | `data/sampleInvoices.js` | Dataset inicial de prueba |
| **Configuración** | `vite.config.js`, `package.json` | Build, dev server, dependencias |

---

## Diagrama de Estado

```
Estado inicial: SAMPLE_INVOICES (8 facturas)
        │
        ▼
    [Facturación]
    ┌────────────────────────────────────┐
    │ invoices[]                          │
    │ selectedInvoiceId                   │  ←→  InvoiceList (selección)
    │ isCreating (local en InvoicesPage)  │  ←→  InvoiceForm (emisión)
    └────────────────────────────────────┘
                    │
              handleAddInvoice()
                    │
                    ▼
    [Dashboard]  (derivado con useMemo)
    ┌────────────────────────────────────┐
    │ totalFacturado                      │
    │ ticketPromedio                      │
    │ outliers (Z-Score)                  │
    │ ingresosPorMes[]                    │
    │ distribucionClientes[]              │
    │ topClientes[]                       │
    │ proyeccionIngresos                  │
    └────────────────────────────────────┘
```

---

## Tecnologías y Justificación

| Tecnología | Justificación |
|---|---|
| **React 19** | Últimas mejoras de rendimiento, hooks maduros, ecosistema amplio |
| **Vite 6** | Arranque instantáneo, HMR eficiente, soporte nativo ESM |
| **TailwindCSS 4** | Estilos utility-first, sin CSS personalizado verboso |
| **Recharts** | Biblioteca de gráficos declarativa para React, fácil integración |
| **Lucide React** | Íconos SVG ligeros y consistentes con el diseño |
