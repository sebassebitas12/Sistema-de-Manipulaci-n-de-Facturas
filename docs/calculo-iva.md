# 🧮 Cálculo de IVA — Ley 9635 de Costa Rica

## Marco Legal

La **Ley 9635 "Fortalecimiento de las Finanzas Públicas"** introdujo el Impuesto al Valor Agregado (IVA) en Costa Rica a partir del 1 de julio de 2019, sustituyendo el antiguo Impuesto General sobre las Ventas (IGV). Esta ley establece múltiples tarifas diferenciadas según el tipo de bien o servicio.

---

## Tarifas Vigentes

| Código | Tarifa | Categoría |
|---|---|---|
| `13` | 13% | **Tarifa general** — aplica a la mayoría de bienes y servicios |
| `4` | 4% | **Tarifa reducida** — servicios de salud privados, boletos aéreos nacionales |
| `2` | 2% | **Tarifa reducida** — medicamentos, servicios educativos privados |
| `1` | 1% | **Tarifa reducida** — canasta básica tributaria |
| `0.5` | 0.5% | **Tarifa reducida especial** |
| `0` | 0% | **Exento** — bienes y servicios exonerados expresamente |

---

## Fórmulas de Cálculo

### Por Ítem Individual

```
subtotal_ítem = cantidad × precio_unitario
impuesto_ítem = subtotal_ítem × (tasaIVA / 100)
total_ítem    = subtotal_ítem + impuesto_ítem
```

> Los valores se redondean a 2 decimales en cada paso para evitar errores de punto flotante acumulados.

### Por Factura Completa (suma de ítems)

```
subtotal_factura = Σ subtotal_ítem
impuesto_factura = Σ impuesto_ítem
total_factura    = subtotal_factura + impuesto_factura
```

> Nota: El IVA se suma por ítem y luego se acumula, **no** se aplica una única tasa sobre el subtotal total. Esto permite tarifas mixtas dentro de una misma factura.

---

## Implementación en Código

### `invoiceCalculations.js` — `calculateItemTotals(item)`

```javascript
export const calculateItemTotals = (item) => {
  const cantidad = Number(item?.cantidad) || 0;
  const precioUnitario = Number(item?.precioUnitario) || 0;
  const tasaIVA = item?.tasaIVA !== undefined ? Number(item.tasaIVA) : 13;

  const subtotal = Math.round(cantidad * precioUnitario * 100) / 100;
  const impuesto = Math.round(subtotal * (tasaIVA / 100) * 100) / 100;
  const total = Math.round((subtotal + impuesto) * 100) / 100;

  return { subtotal, impuesto, total };
};
```

**Notas de implementación:**
- Si `tasaIVA` no está definida, se asume `13%` (tarifa general por defecto)
- El redondeo `Math.round(x * 100) / 100` evita errores de punto flotante (e.g., `0.1 + 0.2 ≠ 0.3`)
- Los valores `cantidad` y `precioUnitario` se convierten a `Number` para prevenir concatenaciones de string

### `invoiceCalculations.js` — `calculateInvoiceTotals(items[])`

```javascript
export const calculateInvoiceTotals = (items = []) => {
  let subtotal = 0;
  let impuesto = 0;

  items.forEach((item) => {
    const itemCalc = calculateItemTotals(item);
    subtotal += itemCalc.subtotal;
    impuesto += itemCalc.impuesto;
  });

  subtotal = Math.round(subtotal * 100) / 100;
  impuesto = Math.round(impuesto * 100) / 100;
  const total = Math.round((subtotal + impuesto) * 100) / 100;

  return { subtotal, impuesto, total, cantidadLineas: items.length };
};
```

---

## Ejemplos de Cálculo

### Ejemplo 1 — Tarifa General 13%

| Campo | Valor |
|---|---|
| Descripción | Mantenimiento Preventivo de Servidores |
| Cantidad | 1 |
| Precio Unitario | ₡159,292.04 |
| Tasa IVA | 13% |
| **Subtotal** | **₡159,292.04** |
| **Impuesto** | **₡20,707.97** |
| **Total** | **₡180,000.01** |

### Ejemplo 2 — Tarifa Reducida 4% (Salud)

| Campo | Valor |
|---|---|
| Descripción | Consulta médica privada |
| Cantidad | 3 |
| Precio Unitario | ₡25,000.00 |
| Tasa IVA | 4% |
| **Subtotal** | **₡75,000.00** |
| **Impuesto** | **₡3,000.00** |
| **Total** | **₡78,000.00** |

### Ejemplo 3 — Exento 0%

| Campo | Valor |
|---|---|
| Descripción | Libro de texto universitario |
| Cantidad | 2 |
| Precio Unitario | ₡15,000.00 |
| Tasa IVA | 0% |
| **Subtotal** | **₡30,000.00** |
| **Impuesto** | **₡0.00** |
| **Total** | **₡30,000.00** |

---

## Formateo de Moneda CRC

La aplicación utiliza la API nativa `Intl.NumberFormat` para formatear valores en Colón Costarricense (₡):

```javascript
// currency.js
const formatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
```

**Resultado:** `₡180 000,01` (separador de miles: espacio, decimal: coma — estándar es-CR)

---

## Condiciones de Venta y Medios de Pago

La aplicación soporta los siguientes tipos de transacción típicos en la facturación costarricense:

**Condición de Venta:**
- Contado
- Crédito

**Medio de Pago:**
- Transferencia / depósito bancario
- Tarjeta (débito/crédito)
- Efectivo
- Cheque
- Otros
