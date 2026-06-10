/**
 * Inserta "Red Tomato Jeans" en Supabase.
 * Uso: node --env-file=.env scripts/seed_redtomato.js
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
  .ilike('nombre', '%red tomato%')

if (existentes?.length) {
  console.log('El negocio ya existe:')
  existentes.forEach(n => console.log(` - ${n.nombre} (${n.id})`))
  process.exit(0)
}

// ── 2. Insertar negocio ──────────────────────────────────────
const { data: negocio, error: errNeg } = await supabase
  .from('negocios')
  .insert({
    nombre: 'Red Tomato Jeans',
    tipos: ['ropa'],
    descripcion: 'Jeans y ropa para dama y caballero',
    direccion: 'Santa Ana Xalmimilulco, Puebla',
    telefono: '',
    whatsapp: '',
    usuario: 'redtomatojeans',
    activo: true,
    creado: '2026-06-08',
    horario: {
      lun: { abierto: false, apertura: '08:00', cierre: '18:00' },
      mar: { abierto: false, apertura: '08:00', cierre: '18:00' },
      mie: { abierto: false, apertura: '08:00', cierre: '18:00' },
      jue: { abierto: true,  apertura: '08:00', cierre: '18:00' },
      vie: { abierto: false, apertura: '08:00', cierre: '18:00' },
      sab: { abierto: false, apertura: '08:00', cierre: '18:00' },
      dom: { abierto: true,  apertura: '08:00', cierre: '18:00' },
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
    { negocio_id: negocioId, nombre: 'Jeans Dama',      orden: 0 },
    { negocio_id: negocioId, nombre: 'Jeans Caballero', orden: 1 },
    { negocio_id: negocioId, nombre: 'Shorts',          orden: 2 },
  ])
  .select('id, nombre')

if (errCats) { console.error('Error al insertar categorías:', errCats.message); process.exit(1) }
const c = Object.fromEntries(cats.map(x => [x.nombre, x.id]))
console.log(`✓ ${cats.length} categorías insertadas`)

// ── 4. Productos con imágenes ────────────────────────────────
const { data: prods, error: errProds } = await supabase
  .from('productos')
  .insert([
    // JEANS DAMA
    {
      categoria_id: c['Jeans Dama'],
      nombre: 'Jeans skinny',
      descripcion: null,
      precio: 0,
      foto: 'https://images.pexels.com/photos/2285500/pexels-photo-2285500.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
      orden: 0,
    },
    {
      categoria_id: c['Jeans Dama'],
      nombre: 'Jeans mom fit',
      descripcion: null,
      precio: 0,
      foto: 'https://images.pexels.com/photos/17745134/pexels-photo-17745134.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
      orden: 1,
    },
    {
      categoria_id: c['Jeans Dama'],
      nombre: 'Jeans wide leg',
      descripcion: null,
      precio: 0,
      foto: 'https://images.pexels.com/photos/5714507/pexels-photo-5714507.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
      orden: 2,
    },
    {
      categoria_id: c['Jeans Dama'],
      nombre: 'Jeans boyfriend',
      descripcion: null,
      precio: 0,
      foto: 'https://images.pexels.com/photos/30712815/pexels-photo-30712815.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
      orden: 3,
    },
    // JEANS CABALLERO
    {
      categoria_id: c['Jeans Caballero'],
      nombre: 'Jeans slim',
      descripcion: null,
      precio: 0,
      foto: 'https://images.pexels.com/photos/24779116/pexels-photo-24779116.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
      orden: 0,
    },
    {
      categoria_id: c['Jeans Caballero'],
      nombre: 'Jeans straight',
      descripcion: null,
      precio: 0,
      foto: 'https://images.pexels.com/photos/17858291/pexels-photo-17858291.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
      orden: 1,
    },
    {
      categoria_id: c['Jeans Caballero'],
      nombre: 'Jeans cargo',
      descripcion: null,
      precio: 0,
      foto: 'https://images.pexels.com/photos/18036895/pexels-photo-18036895.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
      orden: 2,
    },
    // SHORTS
    {
      categoria_id: c['Shorts'],
      nombre: 'Short dama',
      descripcion: null,
      precio: 0,
      foto: 'https://images.pexels.com/photos/8095649/pexels-photo-8095649.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
      orden: 0,
    },
    {
      categoria_id: c['Shorts'],
      nombre: 'Short caballero',
      descripcion: null,
      precio: 0,
      foto: 'https://images.pexels.com/photos/2931764/pexels-photo-2931764.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
      orden: 1,
    },
  ])
  .select('id')

if (errProds) { console.error('Error al insertar productos:', errProds.message); process.exit(1) }
console.log(`✓ ${prods.length} productos insertados con imágenes`)

// ── 5. Delivery (solo si la columna ya existe) ───────────────
const { error: errDel } = await supabase
  .from('negocios')
  .update({ delivery: 'si' })
  .eq('id', negocioId)

if (errDel) {
  console.log('⚠ delivery no actualizado (ejecuta add_delivery.sql primero):', errDel.message)
} else {
  console.log('✓ Delivery: si')
}

// ── 6. Contraseña ────────────────────────────────────────────
const { error: errPass } = await supabase.rpc('set_credenciales', {
  p_negocio_id: negocioId,
  p_password: 'redtomato123',
})
if (errPass) console.warn('Advertencia al establecer contraseña:', errPass.message)
else console.log('✓ Contraseña establecida')

console.log('\n"Red Tomato Jeans" insertado correctamente.')
console.log('  Usuario:    redtomatojeans')
console.log('  Contraseña: redtomato123')
console.log('  ⚠ Teléfono pendiente — actualizar desde el panel admin.')
