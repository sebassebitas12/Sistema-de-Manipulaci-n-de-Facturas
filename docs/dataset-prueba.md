# 📊 Dataset de Prueba — 8 Facturas CRC

## Descripción General

El sistema incluye un dataset inicial de **8 facturas precargadas** contextualizadas en el ecosistema empresarial costarricense. Este dataset fue diseñado específicamente para:

1. Demostrar el cálculo correcto de IVA al 13% en diferentes montos
2. Incluir al menos **1 factura atípica** detectable por el algoritmo Z-Score
3. Cubrir los tres estados posibles: Pagada, Pendiente y Vencida
4. Representar múltiples clientes y períodos mensuales para el dashboard

---

## Emisor Predeterminado

Todas las facturas del dataset comparten el mismo emisor:

| Campo | Valor |
|---|---|
| **Nombre** | Soluciones Tecnológicas del Valle S.A. |
| **Tipo de ID** | Cédula jurídica |
| **Identificación** | 3-101-789456 |
| **Correo** | facturacion@solucionestec.cr |
| **Teléfono** | 2222-3344 |
| **Dirección** | Oficentro Terra Campus, Edificio 3, Piso 2 |
| **Provincia** | San José |
| **Cantón** | Montes de Oca |
| **Distrito** | San Pedro |

---

## Detalle de Facturas

### FAC-0001 — Constructora Los Cerros S.A.

| Campo | Valor |
|---|---|
| **ID** | `inv-001` |
| **Estado** | 🔴 Vencida (venció Feb 2026, sin pagar) |
| **Fecha Emisión** | 2026-01-10 |
| **Fecha Vencimiento** | 2026-02-10 |
| **Condición** | Crédito — Transferencia bancaria |
| **Ítem** | Mantenimiento Preventivo de Servidores Rack |
| **Cantidad** | 1 |
| **Precio Unitario** | ₡159,292.04 |
| **IVA** | 13% |
| **Total** | ≈ ₡180,000 |

---

### FAC-0002 — Farmacia San Rafael Ltda.

| Campo | Valor |
|---|---|
| **ID** | `inv-002` |
| **Estado** | 🔴 Vencida (venció Mar 2026, sin pagar) |
| **Fecha Emisión** | 2026-02-05 |
| **Fecha Vencimiento** | 2026-03-05 |
| **Condición** | Crédito — Transferencia bancaria |
| **Ítem** | Licencia Anual Sistema Punto de Venta |
| **Cantidad** | 1 |
| **Precio Unitario** | ₡185,840.71 |
| **IVA** | 13% |
| **Total** | ≈ ₡210,000 |

---

### FAC-0003 — Distribuidora del Pacífico Sur S.A.

| Campo | Valor |
|---|---|
| **ID** | `inv-003` |
| **Estado** | 🟡 Pendiente (vence Oct 2026) |
| **Fecha Emisión** | 2026-08-20 |
| **Fecha Vencimiento** | 2026-10-15 |
| **Condición** | Crédito — Transferencia bancaria |
| **Ítem** | Monitor Profesional IPS 27 Pulgadas |
| **Cantidad** | 2 |
| **Precio Unitario** | ₡86,283.19 |
| **IVA** | 13% |
| **Total** | ≈ ₡195,000 |

---

### FAC-0004 — Corporación Médica Centroamericana ⚠️ ATÍPICA

| Campo | Valor |
|---|---|
| **ID** | `inv-004` |
| **Estado** | 🟢 Pagada |
| **Fecha Emisión** | 2026-04-12 |
| **Fecha Vencimiento** | 2026-05-12 |
| **Condición** | Contado — Transferencia bancaria |
| **Ítem** | Equipamiento Corporativo Lote 7 Laptops i7 32GB |
| **Cantidad** | 7 |
| **Precio Unitario** | ₡309,734.51 |
| **IVA** | 13% |
| **Total** | ≈ ₡2,450,000 |

> ⚠️ **Factura Atípica:** Este comprobante tiene un monto ~12x mayor que la media del dataset (≈₡197,000), lo que genera un Z-Score > 2.4σ, superando el umbral de 1.5σ.

---

### FAC-0005 — Constructora Los Cerros S.A.

| Campo | Valor |
|---|---|
| **ID** | `inv-005` |
| **Estado** | 🟢 Pagada |
| **Fecha Emisión** | 2026-05-18 |
| **Condición** | Contado — Tarjeta |
| **Ítem** | Estación de Trabajo Torre CAD Pro |
| **Cantidad** | 1 |
| **Precio Unitario** | ₡194,690.27 |
| **IVA** | 13% |
| **Total** | ≈ ₡220,000 |

---

### FAC-0006 — Servicios Turísticos Monteverde S.A.

| Campo | Valor |
|---|---|
| **ID** | `inv-006` |
| **Estado** | 🟢 Pagada |
| **Fecha Emisión** | 2026-06-02 |
| **Condición** | Contado — Transferencia bancaria |
| **Ítem** | Impresora Térmica Multifuncional + Consumibles |
| **Cantidad** | 1 |
| **Precio Unitario** | ₡154,867.26 |
| **IVA** | 13% |
| **Total** | ≈ ₡175,000 |

---

### FAC-0007 — Farmacia San Rafael Ltda.

| Campo | Valor |
|---|---|
| **ID** | `inv-007` |
| **Estado** | 🟢 Pagada |
| **Fecha Emisión** | 2026-07-14 |
| **Condición** | Contado — Transferencia bancaria |
| **Ítem** | Conmutador de Red Administrable 24 Puertos PoE |
| **Cantidad** | 1 |
| **Precio Unitario** | ₡181,415.93 |
| **IVA** | 13% |
| **Total** | ≈ ₡205,000 |

---

### FAC-0008 — Distribuidora del Pacífico Sur S.A.

| Campo | Valor |
|---|---|
| **ID** | `inv-008` |
| **Estado** | 🟢 Pagada |
| **Fecha Emisión** | 2026-08-01 |
| **Condición** | Contado — Efectivo |
| **Ítem** | Unidad de Almacenamiento NAS Empresarial 4TB |
| **Cantidad** | 1 |
| **Precio Unitario** | ₡168,141.59 |
| **IVA** | 13% |
| **Total** | ≈ ₡190,000 |

---

## Resumen del Dataset

| Métrica | Valor |
|---|---|
| **Total de facturas** | 8 |
| **Estado Pagadas** | 5 (FAC-0004, 0005, 0006, 0007, 0008) |
| **Estado Pendientes** | 1 (FAC-0003) |
| **Estado Vencidas** | 2 (FAC-0001, FAC-0002) |
| **Facturas atípicas** | 1 (FAC-0004 — Z > 1.5σ) |
| **Clientes únicos** | 4 |
| **Períodos mensuales** | 8 (Ene–Ago 2026) |

## Clientes en el Dataset

| Cliente | Facturas | Participación |
|---|---|---|
| Constructora Los Cerros S.A. | 2 | FAC-0001, FAC-0005 |
| Corporación Médica Centroamericana | 1 | FAC-0004 (atípica) |
| Farmacia San Rafael Ltda. | 2 | FAC-0002, FAC-0007 |
| Distribuidora del Pacífico Sur S.A. | 2 | FAC-0003, FAC-0008 |
| Servicios Turísticos Monteverde S.A. | 1 | FAC-0006 |

---

## Restaurar el Dataset

Si el usuario agrega facturas o modifica el estado, puede restaurar el dataset original haciendo clic en el botón **"Dataset de Prueba"** (ícono 🔄) en la barra de navegación superior.

```javascript
// App.jsx
const handleResetSampleData = () => {
  setInvoices(SAMPLE_INVOICES);
  setSelectedInvoiceId(SAMPLE_INVOICES[0].id);
};
```
