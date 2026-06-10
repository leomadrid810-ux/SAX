/**
 * Inserta "Rizos y Lisos" en Supabase.
 * Uso: node --env-file=.env scripts/seed_rizosylisos.js
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
  .ilike('nombre', '%rizos%')

if (existentes?.length) {
  console.log('El negocio ya existe:')
  existentes.forEach(n => console.log(` - ${n.nombre} (${n.id})`))
  process.exit(0)
}

// ── 2. Insertar negocio ──────────────────────────────────────
const { data: negocio, error: errNeg } = await supabase
  .from('negocios')
  .insert({
    nombre: 'Rizos y Lisos',
    tipos: ['belleza'],
    descripcion: 'Estética y servicios de belleza. Servicio a domicilio bajo convenio (+$90).',
    direccion: 'Bulevar Río Xochiac #29, Santa Ana Xalmimilulco, Puebla',
    telefono: '2271053147',
    whatsapp: '2271053147',
    usuario: 'rizosylisos',
    activo: true,
    creado: '2026-06-10',
    horario: {
      lun: { abierto: true, apertura: '09:00', cierre: '20:00' },
      mar: { abierto: true, apertura: '09:00', cierre: '20:00' },
      mie: { abierto: true, apertura: '09:00', cierre: '20:00' },
      jue: { abierto: true, apertura: '09:00', cierre: '20:00' },
      vie: { abierto: true, apertura: '09:00', cierre: '20:00' },
      sab: { abierto: true, apertura: '09:00', cierre: '20:00' },
      dom: { abierto: false, apertura: '09:00', cierre: '20:00' },
    },
  })
  .select('id')
  .single()

if (errNeg) { console.error('Error al insertar negocio:', errNeg.message); process.exit(1) }
const negocioId = negocio.id
console.log(`✓ Negocio insertado (id: ${negocioId})`)

// ── 3. Delivery (costo extra a domicilio) ────────────────────
const { error: errDel } = await supabase
  .from('negocios')
  .update({ delivery: 'minimo', delivery_minimo: 90 })
  .eq('id', negocioId)

if (errDel) console.log('⚠ delivery no actualizado (ejecuta add_delivery.sql primero):', errDel.message)
else console.log('✓ Delivery: a domicilio +$90')

// ── 4. Categorías ────────────────────────────────────────────
const { data: cats, error: errCats } = await supabase
  .from('categorias')
  .insert([
    { negocio_id: negocioId, nombre: 'Cabello', orden: 0 },
    { negocio_id: negocioId, nombre: 'Uñas',    orden: 1 },
  ])
  .select('id, nombre')

if (errCats) { console.error('Error al insertar categorías:', errCats.message); process.exit(1) }
const c = Object.fromEntries(cats.map(x => [x.nombre, x.id]))
console.log(`✓ ${cats.length} categorías insertadas`)

// ── 5. Servicios con imágenes ────────────────────────────────
const { data: prods, error: errProds } = await supabase
  .from('productos')
  .insert([
    // CABELLO
    {
      categoria_id: c['Cabello'],
      nombre: 'Corte sencillo caballero',
      descripcion: null,
      precio: 70,
      foto: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',
      orden: 0,
    },
    {
      categoria_id: c['Cabello'],
      nombre: 'Despunte',
      descripcion: null,
      precio: 70,
      foto: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
      orden: 1,
    },
    {
      categoria_id: c['Cabello'],
      nombre: 'Diseño de corte',
      descripcion: null,
      precio: 80,
      foto: 'https://images.unsplash.com/photo-1568339434343-2a640a1a9946?w=600&q=80',
      orden: 2,
    },
    {
      categoria_id: c['Cabello'],
      nombre: 'Tinte (incluye tinte)',
      descripcion: null,
      precio: 230,
      foto: 'https://images.unsplash.com/photo-1554519934-e32b1629d9ee?w=600&q=80',
      orden: 3,
    },
    // UÑAS
    {
      categoria_id: c['Uñas'],
      nombre: 'Gélish 1 tono',
      descripcion: null,
      precio: 85,
      foto: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&q=80',
      orden: 0,
    },
    {
      categoria_id: c['Uñas'],
      nombre: 'Manicure con gel',
      descripcion: null,
      precio: 250,
      foto: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
      orden: 1,
    },
    {
      categoria_id: c['Uñas'],
      nombre: 'Pedicure con gel',
      descripcion: null,
      precio: 250,
      foto: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&q=80',
      orden: 2,
    },
  ])
  .select('id')

if (errProds) { console.error('Error al insertar servicios:', errProds.message); process.exit(1) }
console.log(`✓ ${prods.length} servicios insertados con imágenes`)

// ── 6. Contraseña ────────────────────────────────────────────
const { error: errPass } = await supabase.rpc('set_credenciales', {
  p_negocio_id: negocioId,
  p_password: 'rizos123',
})
if (errPass) console.warn('Advertencia al establecer contraseña:', errPass.message)
else console.log('✓ Contraseña establecida')

console.log('\n"Rizos y Lisos" insertado correctamente.')
console.log('  Usuario:    rizosylisos')
console.log('  Contraseña: rizos123')
