// Datos de ejemplo (semilla) para SAX.
// Se cargan en localStorage la primera vez que se abre la app.

export const CATEGORIAS = [
  { id: 'tacos', nombre: 'Tacos', icono: '🌮' },
  { id: 'pizzas', nombre: 'Pizzas', icono: '🍕' },
  { id: 'hamburguesas', nombre: 'Hamburguesas', icono: '🍔' },
  { id: 'mariscos', nombre: 'Mariscos', icono: '🦐' },
  { id: 'pollos', nombre: 'Pollos y Rosticerías', icono: '🍗' },
  { id: 'economica', nombre: 'Cocina Económica', icono: '🍲' },
  { id: 'cafeterias', nombre: 'Cafeterías', icono: '☕' },
  { id: 'antojitos', nombre: 'Antojitos Mexicanos', icono: '🫔' },
  { id: 'neverias', nombre: 'Neverías y Heladerías', icono: '🍦' },
  { id: 'postres', nombre: 'Postres', icono: '🍰' },
  { id: 'snacks', nombre: 'Snacks', icono: '🍿' },
  { id: 'carniceria', nombre: 'Carnicerías', icono: '🥩' },
  { id: 'belleza', nombre: 'Salones de belleza', icono: '💇' },
  { id: 'ropa', nombre: 'Ropa y calzado', icono: '👗' },
]

// Horario estándar de ejemplo (lun-dom). apertura/cierre en formato 24h "HH:MM".
const horarioEjemplo = (apertura, cierre, cerradoDom = false) => ({
  lun: { abierto: true, apertura, cierre },
  mar: { abierto: true, apertura, cierre },
  mie: { abierto: true, apertura, cierre },
  jue: { abierto: true, apertura, cierre },
  vie: { abierto: true, apertura, cierre },
  sab: { abierto: true, apertura, cierre },
  dom: { abierto: !cerradoDom, apertura, cierre },
})

export const RESTAURANTES_EJEMPLO = [
  {
    id: 'rest-tacos-don-pepe',
    nombre: 'Tacos Don Pepe',
    categorias: ['tacos', 'antojitos'],
    activo: true,
    foto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    descripcion:
      'Somos un negocio familiar con más de 20 años de tradición. Los tacos al pastor más sabrosos de la colonia, con tortilla recién hecha a mano y salsas preparadas en casa todos los días. ¡Te esperamos!',
    direccion: 'Av. Revolución 245, Col. Centro, Ciudad de México, CDMX',
    telefono: '5512345678',
    whatsapp: '5215512345678',
    creado: '2026-01-15',
    horario: horarioEjemplo('10:00', '23:00'),
    usuario: 'donpepe',
    password: 'pepe123',
    menu: [
      {
        id: 'cat-tacos',
        nombre: 'Tacos',
        productos: [
          {
            id: 'p1',
            nombre: 'Taco al Pastor',
            descripcion: 'Carne de cerdo adobada, piña, cebolla y cilantro.',
            precio: 18,
            foto: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&q=80',
          },
          {
            id: 'p2',
            nombre: 'Taco de Bistec',
            descripcion: 'Bistec a la plancha con cebollita y guacamole.',
            precio: 22,
            foto: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80',
          },
          {
            id: 'p3',
            nombre: 'Taco de Suadero',
            descripcion: 'Suadero dorado, doble tortilla y salsa verde.',
            precio: 20,
            foto: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=600&q=80',
          },
        ],
      },
      {
        id: 'cat-antojitos',
        nombre: 'Antojitos',
        productos: [
          {
            id: 'p6',
            nombre: 'Quesadilla de Flor de Calabaza',
            descripcion: 'Tortilla hecha a mano con queso y flor de calabaza.',
            precio: 35,
            foto: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=600&q=80',
          },
        ],
      },
      {
        id: 'cat-bebidas',
        nombre: 'Bebidas',
        productos: [
          {
            id: 'p4',
            nombre: 'Agua de Horchata',
            descripcion: 'Vaso grande de horchata fresca.',
            precio: 25,
            foto: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80',
          },
          {
            id: 'p5',
            nombre: 'Refresco',
            descripcion: 'Lata 355ml, varios sabores.',
            precio: 20,
            foto: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80',
          },
        ],
      },
    ],
  },
  {
    id: 'rest-pizza-bella',
    nombre: 'Pizzería Bella Napoli',
    categorias: ['pizzas'],
    activo: true,
    foto: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    descripcion:
      'Auténtica pizza artesanal horneada en horno de leña. Usamos masa madre fermentada 48 horas e ingredientes importados de Italia. Un pedacito de Nápoles en tu colonia.',
    direccion: 'Calle Madero 88, Col. Roma Norte, Ciudad de México, CDMX',
    telefono: '5587654321',
    whatsapp: '5215587654321',
    creado: '2026-05-20',
    horario: horarioEjemplo('13:00', '22:30', true),
    usuario: 'bella',
    password: 'bella123',
    menu: [
      {
        id: 'cat-pizzas',
        nombre: 'Pizzas',
        productos: [
          {
            id: 'p1',
            nombre: 'Margarita',
            descripcion: 'Salsa de tomate, mozzarella fresca y albahaca.',
            precio: 145,
            foto: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80',
          },
          {
            id: 'p2',
            nombre: 'Pepperoni',
            descripcion: 'Doble pepperoni y queso mozzarella.',
            precio: 165,
            foto: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
          },
          {
            id: 'p3',
            nombre: 'Cuatro Quesos',
            descripcion: 'Mozzarella, gorgonzola, parmesano y de cabra.',
            precio: 180,
            foto: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80',
          },
        ],
      },
      {
        id: 'cat-entradas',
        nombre: 'Entradas',
        productos: [
          {
            id: 'p4',
            nombre: 'Pan de Ajo',
            descripcion: 'Pan recién horneado con mantequilla de ajo y queso.',
            precio: 65,
            foto: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600&q=80',
          },
        ],
      },
    ],
  },
  {
    id: 'rest-mariscos-sirena',
    nombre: 'Mariscos La Sirena',
    categorias: ['mariscos', 'economica'],
    activo: true,
    foto: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80',
    descripcion:
      'Mariscos frescos del día traídos directamente de la costa. Cocteles, tostadas y aguachiles preparados al momento. Ambiente familiar y los mejores precios de la zona.',
    direccion: 'Av. del Mar 1520, Col. Las Palmas, Mazatlán, Sinaloa',
    telefono: '6699887766',
    whatsapp: '5216699887766',
    creado: '2026-02-10',
    horario: horarioEjemplo('11:00', '19:00'),
    usuario: 'sirena',
    password: 'sirena123',
    menu: [
      {
        id: 'cat-cocteles',
        nombre: 'Cócteles',
        productos: [
          {
            id: 'p1',
            nombre: 'Cóctel de Camarón',
            descripcion: 'Camarón fresco, salsa de la casa, aguacate y galletas.',
            precio: 120,
            foto: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=600&q=80',
          },
          {
            id: 'p2',
            nombre: 'Campechana',
            descripcion: 'Mezcla de camarón, pulpo y ostión.',
            precio: 160,
            foto: 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=600&q=80',
          },
        ],
      },
      {
        id: 'cat-tostadas',
        nombre: 'Tostadas',
        productos: [
          {
            id: 'p3',
            nombre: 'Tostada de Ceviche',
            descripcion: 'Pescado fresco marinado en limón con pico de gallo.',
            precio: 55,
            foto: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&q=80',
          },
          {
            id: 'p4',
            nombre: 'Aguachile Verde',
            descripcion: 'Camarón crudo en salsa de chile verde y limón.',
            precio: 140,
            foto: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80',
          },
        ],
      },
      {
        id: 'cat-comida',
        nombre: 'Comida Corrida',
        productos: [
          {
            id: 'p5',
            nombre: 'Filete de Pescado',
            descripcion: 'Filete a la plancha con arroz, ensalada y tortillas.',
            precio: 95,
            foto: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80',
          },
        ],
      },
    ],
  },
]

// Solicitud de ejemplo en el panel de admin
export const SOLICITUDES_EJEMPLO = [
  {
    id: 'sol-1',
    nombreNegocio: 'Pollos El Buen Sabor',
    contacto: 'María González',
    whatsapp: '5215511223344',
    mensaje: 'Tenemos un local de pollos rostizados y nos gustaría aparecer en la app.',
    fecha: '2026-05-28',
    estado: 'pendiente',
  },
]

export const ADMIN_PASSWORD_DEFECTO = 'admin123'
