/**
 * Dataset inicial de prueba contextualizado en Costa Rica
 * Contiene exactamente las facturas solicitadas para validar cálculos y detección de anomalías:
 * ₡180 000, ₡210 000, ₡195 000, ₡2 450 000 (Atípica), ₡220 000, ₡175 000, ₡205 000, ₡190 000.
 *
 * Estados:
 * - Al menos 2 vencidas (vencimiento antes de Septiembre 2026, sin pagar)
 * - Al menos 1 pendiente (vencimiento posterior, sin pagar)
 * - El resto pagadas
 */

export const INITIAL_EMISOR = {
  nombre: 'Soluciones Tecnológicas del Valle S.A.',
  tipoIdentificacion: 'Cédula jurídica',
  identificacion: '3-101-789456',
  correo: 'facturacion@solucionestec.cr',
  telefono: '2222-3344',
  direccion: 'Oficentro Terra Campus, Edificio 3, Piso 2',
  provincia: 'San José',
  canton: 'Montes de Oca',
  distrito: 'San Pedro',
};

export const SAMPLE_INVOICES = [
  {
    id: 'inv-001',
    numeroFactura: 'FAC-0001',
    fechaEmision: '2026-01-10',
    fechaVencimiento: '2026-02-10', // Vencida
    estadoManual: null,
    pagada: false,
    condicionVenta: 'Crédito',
    medioPago: 'Transferencia / depósito bancario',
    emisor: { ...INITIAL_EMISOR },
    cliente: {
      nombre: 'Constructora Los Cerros S.A.',
      tipoIdentificacion: 'Cédula jurídica',
      identificacion: '3-101-554433',
      correo: 'contabilidad@loscerros.co.cr',
      telefono: '2253-9000',
      direccion: 'Curridabat, San José',
    },
    items: [
      {
        id: 'item-101',
        descripcion: 'Mantenimiento Preventivo de Servidores Rack',
        cantidad: 1,
        precioUnitario: 159292.04,
        tasaIVA: 13,
      },
    ],
  },
  {
    id: 'inv-002',
    numeroFactura: 'FAC-0002',
    fechaEmision: '2026-02-05',
    fechaVencimiento: '2026-03-05', // Vencida
    estadoManual: null,
    pagada: false,
    condicionVenta: 'Crédito',
    medioPago: 'Transferencia / depósito bancario',
    emisor: { ...INITIAL_EMISOR },
    cliente: {
      nombre: 'Farmacia San Rafael Ltda.',
      tipoIdentificacion: 'Cédula jurídica',
      identificacion: '3-102-112233',
      correo: 'admin@sanrafael.cr',
      telefono: '2441-2233',
      direccion: 'Alajuela Centro, Calle Ancha',
    },
    items: [
      {
        id: 'item-201',
        descripcion: 'Licencia Anual Sistema Punto de Venta',
        cantidad: 1,
        precioUnitario: 185840.71,
        tasaIVA: 13,
      },
    ],
  },
  {
    id: 'inv-003',
    numeroFactura: 'FAC-0003',
    fechaEmision: '2026-08-20',
    fechaVencimiento: '2026-10-15', // Pendiente (vence en futuro)
    estadoManual: null,
    pagada: false,
    condicionVenta: 'Crédito',
    medioPago: 'Transferencia / depósito bancario',
    emisor: { ...INITIAL_EMISOR },
    cliente: {
      nombre: 'Distribuidora del Pacífico Sur S.A.',
      tipoIdentificacion: 'Cédula jurídica',
      identificacion: '3-101-998877',
      correo: 'compras@pacificosur.cr',
      telefono: '2771-4455',
      direccion: 'Pérez Zeledón, San José',
    },
    items: [
      {
        id: 'item-301',
        descripcion: 'Monitor Profesional IPS 27 Pulgadas',
        cantidad: 2,
        precioUnitario: 86283.19,
        tasaIVA: 13,
      },
    ],
  },
  {
    id: 'inv-004',
    numeroFactura: 'FAC-0004',
    fechaEmision: '2026-04-12',
    fechaVencimiento: '2026-05-12',
    estadoManual: 'Pagada', // Pagada (Atípica)
    pagada: true,
    condicionVenta: 'Contado',
    medioPago: 'Transferencia / depósito bancario',
    emisor: { ...INITIAL_EMISOR },
    cliente: {
      nombre: 'Corporación Médica Centroamericana',
      tipoIdentificacion: 'Cédula jurídica',
      identificacion: '3-101-448899',
      correo: 'adquisiciones@corpmedica.cr',
      telefono: '2208-1000',
      direccion: 'Escazú, San José',
    },
    items: [
      {
        id: 'item-401',
        descripcion: 'Equipamiento Corporativo Lote 7 Laptops i7 32GB',
        cantidad: 7,
        precioUnitario: 309734.51,
        tasaIVA: 13,
      },
    ],
  },
  {
    id: 'inv-005',
    numeroFactura: 'FAC-0005',
    fechaEmision: '2026-05-18',
    fechaVencimiento: '2026-06-18',
    estadoManual: 'Pagada', // Pagada
    pagada: true,
    condicionVenta: 'Contado',
    medioPago: 'Tarjeta',
    emisor: { ...INITIAL_EMISOR },
    cliente: {
      nombre: 'Constructora Los Cerros S.A.',
      tipoIdentificacion: 'Cédula jurídica',
      identificacion: '3-101-554433',
      correo: 'contabilidad@loscerros.co.cr',
      telefono: '2253-9000',
      direccion: 'Curridabat, San José',
    },
    items: [
      {
        id: 'item-501',
        descripcion: 'Estación de Trabajo Torre CAD Pro',
        cantidad: 1,
        precioUnitario: 194690.27,
        tasaIVA: 13,
      },
    ],
  },
  {
    id: 'inv-006',
    numeroFactura: 'FAC-0006',
    fechaEmision: '2026-06-02',
    fechaVencimiento: '2026-07-02',
    estadoManual: 'Pagada', // Pagada
    pagada: true,
    condicionVenta: 'Contado',
    medioPago: 'Transferencia / depósito bancario',
    emisor: { ...INITIAL_EMISOR },
    cliente: {
      nombre: 'Servicios Turísticos Monteverde S.A.',
      tipoIdentificacion: 'Cédula jurídica',
      identificacion: '3-101-667788',
      correo: 'reservas@monteverdetours.cr',
      telefono: '2645-5000',
      direccion: 'Monteverde, Puntarenas',
    },
    items: [
      {
        id: 'item-601',
        descripcion: 'Impresora Térmica Multifuncional + Consumibles',
        cantidad: 1,
        precioUnitario: 154867.26,
        tasaIVA: 13,
      },
    ],
  },
  {
    id: 'inv-007',
    numeroFactura: 'FAC-0007',
    fechaEmision: '2026-07-14',
    fechaVencimiento: '2026-08-14',
    estadoManual: 'Pagada', // Pagada
    pagada: true,
    condicionVenta: 'Contado',
    medioPago: 'Transferencia / depósito bancario',
    emisor: { ...INITIAL_EMISOR },
    cliente: {
      nombre: 'Farmacia San Rafael Ltda.',
      tipoIdentificacion: 'Cédula jurídica',
      identificacion: '3-102-112233',
      correo: 'admin@sanrafael.cr',
      telefono: '2441-2233',
      direccion: 'Alajuela Centro, Calle Ancha',
    },
    items: [
      {
        id: 'item-701',
        descripcion: 'Conmutador de Red Administrable 24 Puertos PoE',
        cantidad: 1,
        precioUnitario: 181415.93,
        tasaIVA: 13,
      },
    ],
  },
  {
    id: 'inv-008',
    numeroFactura: 'FAC-0008',
    fechaEmision: '2026-08-01',
    fechaVencimiento: '2026-08-31',
    estadoManual: 'Pagada', // Pagada
    pagada: true,
    condicionVenta: 'Contado',
    medioPago: 'Efectivo',
    emisor: { ...INITIAL_EMISOR },
    cliente: {
      nombre: 'Distribuidora del Pacífico Sur S.A.',
      tipoIdentificacion: 'Cédula jurídica',
      identificacion: '3-101-998877',
      correo: 'compras@pacificosur.cr',
      telefono: '2771-4455',
      direccion: 'Pérez Zeledón, San José',
    },
    items: [
      {
        id: 'item-801',
        descripcion: 'Unidad de Almacenamiento NAS Empresarial 4TB',
        cantidad: 1,
        precioUnitario: 168141.59,
        tasaIVA: 13,
      },
    ],
  },
];
