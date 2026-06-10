/**
 * Inserta "Novedades Alfred" en Supabase.
 * Uso: node --env-file=.env scripts/seed_alfred.js
 *
 * Secciones de texto → categoría + 1 producto descriptivo (sin foto).
 * Gorras             → categoría + 1 placeholder hasta que el dueño suba fotos.
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
  .ilike('nombre', '%alfred%')

if (existentes?.length) {
  console.log('El negocio ya existe:')
  existentes.forEach(n => console.log(` - ${n.nombre} (${n.id})`))
  process.exit(0)
}

// ── 2. Insertar negocio ──────────────────────────────────────
const { data: negocio, error: errNeg } = await supabase
  .from('negocios')
  .insert({
    nombre: 'Novedades Alfred',
    tipos: ['ropa'],
    descripcion: 'Tienda de novedades, ropa y artículos de temporada',
    direccion: 'Violetas #16, Santa Ana Xalmimilulco, Puebla',
    telefono: '5574581047',
    whatsapp: '5574581047',
    usuario: 'novedadesalfred',
    activo: true,
    creado: '2026-06-10',
    horario: {
      lun: { abierto: true, apertura: '09:00', cierre: '21:00' },
      mar: { abierto: true, apertura: '09:00', cierre: '21:00' },
      mie: { abierto: true, apertura: '09:00', cierre: '21:00' },
      jue: { abierto: true, apertura: '09:00', cierre: '21:00' },
      vie: { abierto: true, apertura: '09:00', cierre: '21:00' },
      sab: { abierto: true, apertura: '09:00', cierre: '21:00' },
      dom: { abierto: true, apertura: '09:00', cierre: '21:00' },
    },
  })
  .select('id')
  .single()

if (errNeg) { console.error('Error al insertar negocio:', errNeg.message); process.exit(1) }
const negocioId = negocio.id
console.log(`✓ Negocio insertado (id: ${negocioId})`)

// ── 3. Delivery ──────────────────────────────────────────────
const { error: errDel } = await supabase
  .from('negocios').update({ delivery: 'no' }).eq('id', negocioId)
if (errDel) console.log('⚠ delivery no actualizado (ejecuta add_delivery.sql primero)')
else console.log('✓ Delivery: no')

// ── 4. Categorías ────────────────────────────────────────────
const { data: cats, error: errCats } = await supabase
  .from('categorias')
  .insert([
    { negocio_id: negocioId, nombre: '🧵 Mercería',              orden: 0 },
    { negocio_id: negocioId, nombre: '🎉 Artículos de temporada', orden: 1 },
    { negocio_id: negocioId, nombre: '👟 Zapatitos de bebé',      orden: 2 },
    { negocio_id: negocioId, nombre: '🧸 Juguetes',               orden: 3 },
    { negocio_id: negocioId, nombre: '👕 Ropa',                   orden: 4 },
    { negocio_id: negocioId, nombre: '🧢 Gorras',                 orden: 5 },
  ])
  .select('id, nombre')

if (errCats) { console.error('Error al insertar categorías:', errCats.message); process.exit(1) }
const c = Object.fromEntries(cats.map(x => [x.nombre, x.id]))
console.log(`✓ ${cats.length} categorías insertadas`)

// ── 5. Productos ─────────────────────────────────────────────
const { data: prods, error: errProds } = await supabase
  .from('productos')
  .insert([
    // MERCERÍA — tarjeta descriptiva
    {
      categoria_id: c['🧵 Mercería'],
      nombre: 'Mercería',
      descripcion: 'Hilos, agujas, listones, cierres, botones y todo lo que necesitas para coser.',
      precio: 0,
      foto: null,
      orden: 0,
    },
    // ARTÍCULOS DE TEMPORADA
    {
      categoria_id: c['🎉 Artículos de temporada'],
      nombre: 'Artículos de temporada',
      descripcion: 'Decoraciones, disfraces, adornos y todo según la época del año.',
      precio: 0,
      foto: null,
      orden: 0,
    },
    // ZAPATITOS DE BEBÉ
    {
      categoria_id: c['👟 Zapatitos de bebé'],
      nombre: 'Zapatitos de bebé',
      descripcion: 'Calzado suave y cómodo para los más chiquitos.',
      precio: 0,
      foto: null,
      orden: 0,
    },
    // JUGUETES
    {
      categoria_id: c['🧸 Juguetes'],
      nombre: 'Juguetes',
      descripcion: 'Variedad de juguetes para niños de todas las edades.',
      precio: 0,
      foto: null,
      orden: 0,
    },
    // ROPA
    {
      categoria_id: c['👕 Ropa'],
      nombre: 'Ropa',
      descripcion: 'Prendas para toda la familia.',
      precio: 0,
      foto: null,
      orden: 0,
    },
    // GORRAS — placeholder hasta que el dueño suba fotos
    {
      categoria_id: c['🧢 Gorras'],
      nombre: 'Próximamente',
      descripcion: 'El dueño subirá las fotos de las gorras disponibles.',
      precio: 0,
      foto: null,
      orden: 0,
    },
  ])
  .select('id')

if (errProds) { console.error('Error al insertar productos:', errProds.message); process.exit(1) }
console.log(`✓ ${prods.length} productos/secciones insertados`)

// ── 6. Contraseña ────────────────────────────────────────────
const { error: errPass } = await supabase.rpc('set_credenciales', {
  p_negocio_id: negocioId,
  p_password: 'alfred123',
})
if (errPass) console.warn('Advertencia al establecer contraseña:', errPass.message)
else console.log('✓ Contraseña establecida')

console.log('\n"Novedades Alfred" insertado correctamente.')
console.log('  Usuario:    novedadesalfred')
console.log('  Contraseña: alfred123')
console.log('  ⚠ Gorras: el dueño debe agregar productos con fotos desde el panel admin.')
