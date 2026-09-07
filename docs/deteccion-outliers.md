# 📐 Detección de Facturas Atípicas — Z-Score

## ¿Qué es un Valor Atípico (Outlier)?

Un **outlier** o valor atípico es una observación que se encuentra muy alejada del resto del conjunto de datos. En el contexto de facturación, una factura atípica podría indicar:

- Un error de captura (precio incorrecto, cantidad multiplicada por error)
- Una transacción extraordinaria legítima (compra de equipo masivo, proyecto especial)
- Una anomalía que merece revisión administrativa

---

## Metodología: Z-Score

El **Z-Score** mide cuántas desviaciones estándar se aleja un valor de la media poblacional. Se calcula como:

```
z = |x − μ| / σ
```

Donde:
- **x** = total de la factura individual
- **μ** = media aritmética de todos los totales de facturas
- **σ** = desviación estándar poblacional del conjunto

### Umbral de Detección

```
Si z > 1.5  →  Factura clasificada como ATÍPICA
```

El umbral de **1.5σ** fue elegido para este sistema porque:
- Un umbral de `2σ` (estándar estadístico del 95%) es muy permisivo para datasets pequeños
- `1.5σ` detecta anomalías relevantes en conjuntos de 8-50 facturas
- Equivale a detectar valores que superan el umbral: **μ + 1.5σ**

---

## Fórmulas Paso a Paso

### 1. Media Aritmética (μ)

```
μ = (Σ total_i) / n
```

### 2. Desviación Estándar Poblacional (σ)

```
σ = √[ Σ(total_i − μ)² / n ]
```

> Se usa la fórmula **poblacional** (dividiendo entre `n`) porque se analiza el universo completo de facturas registradas, no una muestra.

### 3. Z-Score por Factura

```
z_i = |total_i − μ| / σ
```

### 4. Umbral Crítico

```
umbral = μ + 1.5 × σ
```

---

## Implementación en Código

### `analytics.js` — `detectOutliers(invoices[])`

```javascript
export const detectOutliers = (invoices = []) => {
  if (invoices.length < 2) {
    return { mean: 0, stdDev: 0, threshold: 0, outlierCount: 0, outlierIds: new Set(), itemsWithZ: [] };
  }

  // 1. Extraer totales de cada factura
  const totals = invoices.map((inv) => ({
    id: inv.id,
    numeroFactura: inv.numeroFactura,
    cliente: inv.cliente?.nombre || 'Consumidor Final',
    total: calculateInvoiceTotals(inv.items).total,
  }));

  const values = totals.map((t) => t.total);

  // 2. Calcular media y desviación estándar
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values, mean);

  // 3. Calcular Z-Score por factura y clasificar
  const outlierIds = new Set();
  const itemsWithZ = totals.map((item) => {
    const zScore = stdDev > 0 ? Math.abs(item.total - mean) / stdDev : 0;
    const isOutlier = zScore > 1.5;
    if (isOutlier) outlierIds.add(item.id);
    return { ...item, zScore: Math.round(zScore * 100) / 100, isOutlier };
  });

  return {
    mean: Math.round(mean * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    threshold: Math.round((mean + 1.5 * stdDev) * 100) / 100,
    outlierCount: outlierIds.size,
    outlierIds,
    itemsWithZ,
  };
};
```

**Casos especiales:**
- Si hay **menos de 2 facturas**, no se puede calcular desviación estándar → retorna sin outliers
- Si **σ = 0** (todas las facturas tienen el mismo total), todos los Z-Scores son 0 → ninguna es atípica

---

## Ejemplo con el Dataset de Prueba

Dataset de 8 facturas con totales (aprox.):

| Factura | Total (₡) |
|---|---|
| FAC-0001 | 180,000 |
| FAC-0002 | 210,000 |
| FAC-0003 | 195,000 |
| **FAC-0004** | **2,450,000** ← Atípica |
| FAC-0005 | 220,000 |
| FAC-0006 | 175,000 |
| FAC-0007 | 205,000 |
| FAC-0008 | 190,000 |

**Cálculo:**

```
μ = (180,000 + 210,000 + 195,000 + 2,450,000 + 220,000 + 175,000 + 205,000 + 190,000) / 8
μ ≈ 478,125

σ ≈ 795,000  (alta por la factura de ₡2.45M)

umbral = μ + 1.5σ ≈ 478,125 + 1,192,500 ≈ 1,670,625

FAC-0004: z = |2,450,000 − 478,125| / 795,000 ≈ 2.48σ  → ATÍPICA ✓
```

---

## Visualización en la Interfaz

| Elemento UI | Comportamiento |
|---|---|
| **Badge en tab Dashboard** | Aparece `!` en ámbar si hay ≥1 outlier detectado |
| **KPI "Facturas Atípicas"** | Muestra conteo, σ y criterio del umbral |
| **Panel de alerta** | Listado de comprobantes atípicos con número, total y Z-Score |
| **InvoiceList** | Las facturas atípicas reciben un indicador visual (borde ámbar) |

---

## Consideraciones Académicas

> Esta metodología de detección es una **simplificación estadística** con propósitos educativos. En sistemas de facturación real, se utilizarían algoritmos más robustos como:
> - **IQR (Rango Intercuartílico)** — más resistente a outliers extremos
> - **DBSCAN** — clustering para detección multidimensional
> - **Isolation Forest** — machine learning para anomalías complejas
>
> El Z-Score es ideal para introducir el concepto de análisis estadístico en un contexto académico de React.
