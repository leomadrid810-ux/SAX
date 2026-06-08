/**
 * Inserta "Tacos y Cemitas El Contorno" en Supabase.
 * Uso: node --env-file=.env scripts/seed_contorno.js
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// ── 1. Verificar duplicados ───────────────────────────────────
const { data: existentes } = await supabase
  .from('negocios')
  .select('id, nombre')
  .ilike('nombre', '%contorno%')

if (existentes?.length) {
  console.log('El negocio ya existe:')
  existentes.forEach(n => console.log(` - ${n.nombre} (${n.id})`))
  process.exit(0)
}

// ── 2. Insertar negocio ──────────────────────────────────────
const { data: negocio, error: errNeg } = await supabase
  .from('negocios')
  .insert({
    nombre: 'Tacos y Cemitas El Contorno',
    tipos: ['tacos', 'antojitos'],
    descripcion: 'Tacos y cemitas al estilo de Santa Ana',
    direccion: 'Calle Volcán #9, Santa Ana Xalmimilulco, Puebla',
    telefono: '2271041922',
    whatsapp: '2271041922',
    usuario: 'elcontorno',
    activo: true,
    creado: '2026-06-08',
    horario: {
      lun: { abierto: false, apertura: '19:00', cierre: '22:30' },
      mar: { abierto: false, apertura: '19:00', cierre: '22:30' },
      mie: { abierto: true,  apertura: '19:00', cierre: '22:30' },
      jue: { abierto: true,  apertura: '19:00', cierre: '22:30' },
      vie: { abierto: true,  apertura: '19:00', cierre: '22:30' },
      sab: { abierto: true,  apertura: '19:00', cierre: '22:30' },
      dom: { abierto: false, apertura: '19:00', cierre: '22:30' },
    },
  })
  .select('id')
  .single()

if (errNeg) { console.error('Error al insertar negocio:', errNeg.message); process.exit(1) }
const negocioId = negocio.id
console.log(`✓ Negocio insertado (id: ${negocioId})`)

// ── 3. Categorías ────────────────────────────────────────────
const { data: cats, error: errCats } = await supabase
  .from('categorias')
  .insert([
    { negocio_id: negocioId, nombre: 'Cemitas', orden: 0 },
    { negocio_id: negocioId, nombre: 'Tacos',   orden: 1 },
    { negocio_id: negocioId, nombre: 'Bebidas', orden: 2 },
  ])
  .select('id, nombre')

if (errCats) { console.error('Error al insertar categorías:', errCats.message); process.exit(1) }
const c = Object.fromEntries(cats.map(x => [x.nombre, x.id]))
console.log(`✓ ${cats.length} categorías insertadas`)

// ── 4. Productos con imágenes ────────────────────────────────
const { data: prods, error: errProds } = await supabase
  .from('productos')
  .insert([
    // CEMITAS
    {
      categoria_id: c['Cemitas'],
      nombre: 'Cemitas',
      descripcion: null,
      precio: 30,
      foto: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Cemita_poblana.jpg',
      orden: 0,
    },
    // TACOS
    {
      categoria_id: c['Tacos'],
      nombre: 'Tacos de bistec',
      descripcion: null,
      precio: 20,
      foto: 'https://upload.wikimedia.org/wikipedia/commons/5/57/El_califa_bistec_tacos.jpg',
      orden: 0,
    },
    {
      categoria_id: c['Tacos'],
      nombre: 'Tacos campechanos',
      descripcion: null,
      precio: 20,
      foto: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Tacos_campechanos_con_salsa.jpg',
      orden: 1,
    },
    {
      categoria_id: c['Tacos'],
      nombre: 'Tacos de longaniza',
      descripcion: null,
      precio: 22,
      foto: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Taco_de_longaniza.jpg',
      orden: 2,
    },
    // BEBIDAS
    {
      categoria_id: c['Bebidas'],
      nombre: 'Boing',
      descripcion: null,
      precio: 20,
      foto: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Boing.JPG',
      orden: 0,
    },
    {
      categoria_id: c['Bebidas'],
      nombre: 'Coca 500ml',
      descripcion: null,
      precio: 22,
      foto: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Coca_Cola_bottles.JPG',
      orden: 1,
    },
    {
      categoria_id: c['Bebidas'],
      nombre: 'Agua 1 litro',
      descripcion: null,
      precio: 16,
      foto: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Plastic_Water_Bottle.jpg',
      orden: 2,
    },
  ])
  .select('id')

if (errProds) { console.error('Error al insertar productos:', errProds.message); process.exit(1) }
console.log(`✓ ${prods.length} productos insertados con imágenes`)

// ── 5. Contraseña ────────────────────────────────────────────
const { error: errPass } = await supabase.rpc('set_credenciales', {
  p_negocio_id: negocioId,
  p_password: 'contorno123',
})
if (errPass) console.warn('Advertencia al establecer contraseña:', errPass.message)
else console.log('✓ Contraseña establecida')

console.log('\n"Tacos y Cemitas El Contorno" insertado correctamente.')
console.log(`  Usuario:    elcontorno`)
console.log(`  Contraseña: contorno123`)
