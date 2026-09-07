<div align="center">

# 🧾 Facturación & Dashboard CR

### Sistema de Manipulación de Facturas — Simulación Académica
**React 19 · Vite 6 · TailwindCSS 4 · Recharts · Lucide**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Costa Rica](https://img.shields.io/badge/IVA-Ley%209635-red)](https://www.hacienda.go.cr/)

</div>

---

## 📋 Descripción

**Facturación & Dashboard CR** es una aplicación web de simulación académica que modela el ciclo completo de **emisión y análisis de comprobantes electrónicos** bajo el marco tributario de Costa Rica (Ley 9635 del IVA). Permite emitir facturas con cálculo automático de IVA en múltiples tarifas, visualizar el estado de cada comprobante y analizar métricas de facturación a través de un dashboard interactivo con detección estadística de valores atípicos.

> ⚠️ **Nota Académica:** Esta aplicación es una simulación educativa. No constituye un sistema de facturación electrónica oficial ni está habilitada para uso fiscal real.

---

## ✨ Funcionalidades Principales

### 🗂️ Módulo de Facturación

| Función | Descripción |
|---|---|
| **Emitir facturas** | Formulario completo con datos del emisor, cliente e ítems |
| **Cálculo automático de IVA** | Soporta tarifas 13%, 4%, 2%, 1%, 0.5% y 0% (Ley 9635) |
| **Detección de estado** | Determina automáticamente si una factura es Pagada, Pendiente o Vencida |
| **Previsualización** | Render de comprobante comercial con subtotal, impuesto y total en CRC |
| **Marcado atípica** | Facturas con Z-Score > 1.5σ se resaltan visualmente en la lista |
| **Dataset de prueba** | 8 facturas precargadas representativas, restaurables con un clic |

### 📊 Dashboard Administrativo

| Sección | Descripción |
|---|---|
| **KPIs principales** | Total facturado, número de facturas, ticket promedio, facturas atípicas |
| **Detección de outliers** | Análisis Z-Score poblacional con umbral μ + 1.5σ |
| **Ingresos por período** | Gráfico de barras mensual con Recharts |
| **Distribución por cliente** | Gráfico de torta con participación porcentual |
| **Top 3 clientes** | Ranking con barras de progreso y porcentaje del total |
| **Proyección estimada** | Promedio móvil aritmético de ingresos mensuales |

---

## 🏗️ Estructura del Proyecto

```
facturas/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Invoice.jsx           # Previsualización de comprobante
│   │   ├── InvoiceForm.jsx       # Formulario de emisión
│   │   ├── InvoiceItem.jsx       # Ítem individual en lista
│   │   ├── InvoiceList.jsx       # Lista lateral de facturas
│   │   ├── MetricCard.jsx        # Tarjeta KPI del dashboard
│   │   └── charts/
│   │       ├── RevenueChart.jsx  # Gráfico de barras (ingresos/mes)
│   │       └── ClientChart.jsx   # Gráfico de torta (distribución clientes)
│   ├── data/
│   │   └── sampleInvoices.js     # Dataset de prueba (8 facturas CRC)
│   ├── pages/
│   │   ├── InvoicesPage.jsx      # Página de gestión de facturación
│   │   └── DashboardPage.jsx     # Dashboard analítico
│   ├── utils/
│   │   ├── analytics.js          # Métricas y detección de outliers
│   │   ├── currency.js           # Formateo de moneda CRC (₡)
│   │   ├── invoiceCalculations.js  # Cálculos de IVA por ítem y factura
│   │   └── invoiceStatus.js      # Determinación de estado de facturas
│   ├── App.jsx                   # Componente raíz + navegación
│   ├── main.jsx                  # Punto de entrada React
│   └── index.css                 # Estilos globales
├── docs/
│   ├── arquitectura.md           # Flujo de datos y decisiones de diseño
│   ├── calculo-iva.md            # Lógica de cálculo tributario
│   ├── deteccion-outliers.md     # Algoritmo Z-Score y estadística
│   ├── componentes.md            # API de props de cada componente
│   └── dataset-prueba.md         # Dataset de prueba y casos de uso
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos

- **Node.js** v18+ (recomendado v20 LTS)
- **npm** v9+

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/sebassebitas12/Sistema-de-Manipulaci-n-de-Facturas.git
cd Sistema-de-Manipulaci-n-de-Facturas/facturas

# 2. Instalar dependencias
npm install

# 3. (Opcional) Configurar variables de entorno
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR en puerto 3000 |
| `npm run build` | Compilar para producción en `/dist` |
| `npm run preview` | Previsualizar el build de producción |
| `npm run lint` | Análisis estático con ESLint |
| `npm run clean` | Limpiar carpeta `dist/` |

---

## 🧮 Tarifas de IVA — Ley 9635 (Costa Rica)

| Tarifa | Descripción |
|---|---|
| **13%** | Tarifa general |
| **4%** | Tarifa reducida — Salud / Boletos aéreos |
| **2%** | Tarifa reducida — Medicamentos / Educación |
| **1%** | Tarifa reducida — Canasta básica |
| **0.5%** | Tarifa reducida especial |
| **0%** | Exento / Sin impuesto |

**Fórmula de cálculo por ítem:**

```
subtotal_ítem = cantidad × precio_unitario
impuesto_ítem = subtotal_ítem × (tasaIVA / 100)
total_ítem    = subtotal_ítem + impuesto_ítem
```

---

## 📐 Detección de Facturas Atípicas — Z-Score

El sistema aplica análisis estadístico Z-Score sobre los totales de las facturas para identificar comprobantes que se desvíen del comportamiento normal del dataset.

```
z = |total_factura − μ| / σ
Si z > 1.5  →  Factura ATÍPICA
```

Donde **μ** es el promedio aritmético de los totales y **σ** es la desviación estándar poblacional.

> Ver documentación completa en [`docs/deteccion-outliers.md`](./docs/deteccion-outliers.md)

---

## 📦 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|---|---|---|
| [React](https://react.dev/) | 19 | UI reactiva y gestión de estado |
| [Vite](https://vitejs.dev/) | 6 | Bundler y servidor de desarrollo |
| [TailwindCSS](https://tailwindcss.com/) | 4 | Utilidades de estilos |
| [Recharts](https://recharts.org/) | 3 | Gráficos de barras y torta |
| [Lucide React](https://lucide.dev/) | 0.546 | Íconos SVG |
| [Motion](https://motion.dev/) | 12 | Animaciones fluidas |

---

## 📚 Documentación Técnica

| Documento | Contenido |
|---|---|
| [`docs/arquitectura.md`](./docs/arquitectura.md) | Flujo de datos, jerarquía de componentes y decisiones de diseño |
| [`docs/calculo-iva.md`](./docs/calculo-iva.md) | Fórmulas y lógica de cálculo tributario (Ley 9635) |
| [`docs/deteccion-outliers.md`](./docs/deteccion-outliers.md) | Algoritmo Z-Score y metodología estadística |
| [`docs/componentes.md`](./docs/componentes.md) | API de props y responsabilidades de cada componente |
| [`docs/dataset-prueba.md`](./docs/dataset-prueba.md) | Dataset de 8 facturas de prueba y casos de uso |

---

<div align="center">
<sub>Proyecto Académico de React &amp; Análisis Tributario · Costa Rica (Ley 9635) · Colón Costarricense (₡ CRC) · 2026</sub>
</div>
