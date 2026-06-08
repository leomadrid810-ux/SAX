/**
 * Actualiza el menú completo de Fresita en Supabase.
 * Uso: node --env-file=.env scripts/update_menu_fresita.js
 *
 * Si la versión de Node es < 20.6 y no tiene --env-file, exporta
 * las variables manualmente antes de ejecutar:
 *   $env:VITE_SUPABASE_URL="https://..."; $env:VITE_SUPABASE_ANON_KEY="..."
 *   node scripts/update_menu_fresita.js
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('ERROR: faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

// ── 1. Buscar Fresita por nombre (o crearla si no existe) ────
let negocioId

const { data: encontrados } = await supabase
  .from('negocios')
  .select('id, nombre')
  .ilike('nombre', 'fresita')

if (encontrados && encontrados.length > 0) {
  negocioId = encontrados[0].id
  console.log(`✓ Fresita encontrada (id: ${negocioId})`)
} else {
  console.log('Fresita no existe, insertando negocio...')
  const { data: nuevo, error: errInsert } = await supabase
    .from('negocios')
    .insert({
      nombre: 'Fresita',
      tipos: ['postres', 'snacks', 'cafeterias', 'antojitos'],
      descripcion: 'Postres, snacks y más',
      direccion: 'Santa Ana Xalmimilulco, Puebla',
      telefono: '2213473970',
      whatsapp: '2213473970',
      usuario: 'fresita',
      activo: true,
      creado: '2026-06-07',
      horario: {
        lun: { abierto: true, apertura: '16:00', cierre: '22:00' },
        mar: { abierto: true, apertura: '16:00', cierre: '22:00' },
        mie: { abierto: true, apertura: '16:00', cierre: '22:00' },
        jue: { abierto: true, apertura: '16:00', cierre: '22:00' },
        vie: { abierto: true, apertura: '16:00', cierre: '22:00' },
        sab: { abierto: true, apertura: '16:00', cierre: '22:00' },
        dom: { abierto: true, apertura: '16:00', cierre: '22:00' },
      },
      facebook: 'Postres Fresita',
      tiktok: 'Postres.rosita.fr',
    })
    .select('id')
    .single()

  if (errInsert || !nuevo) {
    console.error('Error al insertar negocio:', errInsert?.message)
    process.exit(1)
  }

  negocioId = nuevo.id
  console.log(`✓ Negocio Fresita creado (id: ${negocioId})`)
}

// ── 2. Borrar categorías anteriores (CASCADE borra productos) ─
const { error: errDel } = await supabase
  .from('categorias')
  .delete()
  .eq('negocio_id', negocioId)

if (errDel) {
  console.error('Error al borrar categorías:', errDel.message)
  process.exit(1)
}
console.log('✓ Categorías y productos anteriores borrados')

// ── 3. Insertar nuevas categorías ────────────────────────────
const { data: cats, error: errCats } = await supabase
  .from('categorias')
  .insert([
    { negocio_id: negocioId, nombre: 'Postres',       orden: 0 },
    { negocio_id: negocioId, nombre: 'Frappé',        orden: 1 },
    { negocio_id: negocioId, nombre: 'Chamoyadas',    orden: 2 },
    { negocio_id: negocioId, nombre: 'Crepas',        orden: 3 },
    { negocio_id: negocioId, nombre: 'Snacks',        orden: 4 },
    { negocio_id: negocioId, nombre: 'Molotes',       orden: 5 },
    { negocio_id: negocioId, nombre: 'Empanadas',     orden: 6 },
    { negocio_id: negocioId, nombre: 'Tostadas',      orden: 7 },
    { negocio_id: negocioId, nombre: 'Tacos Dorados', orden: 8 },
    { negocio_id: negocioId, nombre: 'Bebidas',       orden: 9 },
  ])
  .select('id, nombre')

if (errCats || !cats) {
  console.error('Error al insertar categorías:', errCats?.message)
  process.exit(1)
}
console.log(`✓ ${cats.length} categorías insertadas`)

const c = Object.fromEntries(cats.map(x => [x.nombre, x.id]))

// ── 4. Insertar productos ────────────────────────────────────
const productos = [
  // POSTRES
  { categoria_id: c['Postres'], nombre: 'Flan napolitano',    descripcion: null,                                       precio: 35, orden: 0 },
  { categoria_id: c['Postres'], nombre: 'Concha rellena',     descripcion: '1 untable, chantilly, 1 fruta, 1 topping', precio: 50, orden: 1 },
  { categoria_id: c['Postres'], nombre: 'Cuernito relleno',   descripcion: '1 untable, chantilly, 1 fruta, 1 topping', precio: 50, orden: 2 },
  { categoria_id: c['Postres'], nombre: 'Mini hotcakes 12 pzas', descripcion: '1 untable, 1 fruta, 1 topping',         precio: 40, orden: 3 },
  { categoria_id: c['Postres'], nombre: 'Mini hotcakes 18 pzas', descripcion: '1 untable, 1 fruta, 2 toppings',       precio: 60, orden: 4 },
  { categoria_id: c['Postres'], nombre: 'Mini hotcakes 25 pzas', descripcion: '2 untables, 2 frutas, 2 toppings',     precio: 90, orden: 5 },
  { categoria_id: c['Postres'], nombre: 'Mini donitas 8 pzas',   descripcion: '1 untable, 1 fruta, 1 topping',        precio: 40, orden: 6 },
  { categoria_id: c['Postres'], nombre: 'Mini donitas 12 pzas',  descripcion: '1 untable, 1 fruta, 2 toppings',       precio: 60, orden: 7 },

  // FRAPPÉ
  { categoria_id: c['Frappé'], nombre: 'Café',            descripcion: null, precio: 60, orden:  0 },
  { categoria_id: c['Frappé'], nombre: 'Moka',            descripcion: null, precio: 65, orden:  1 },
  { categoria_id: c['Frappé'], nombre: 'Chocolate',       descripcion: null, precio: 60, orden:  2 },
  { categoria_id: c['Frappé'], nombre: 'Fresa',           descripcion: null, precio: 65, orden:  3 },
  { categoria_id: c['Frappé'], nombre: 'Plátano',         descripcion: null, precio: 60, orden:  4 },
  { categoria_id: c['Frappé'], nombre: 'Galleta oreo',    descripcion: null, precio: 70, orden:  5 },
  { categoria_id: c['Frappé'], nombre: 'Kinder delice',   descripcion: null, precio: 75, orden:  6 },
  { categoria_id: c['Frappé'], nombre: 'Lunetas',         descripcion: null, precio: 60, orden:  7 },
  { categoria_id: c['Frappé'], nombre: 'Frutos rojos',    descripcion: null, precio: 75, orden:  8 },
  { categoria_id: c['Frappé'], nombre: 'Nutella',         descripcion: null, precio: 70, orden:  9 },
  { categoria_id: c['Frappé'], nombre: 'Pay de limón',    descripcion: null, precio: 70, orden: 10 },
  { categoria_id: c['Frappé'], nombre: 'Chocobanana',     descripcion: null, precio: 65, orden: 11 },
  { categoria_id: c['Frappé'], nombre: 'Cajeta',          descripcion: null, precio: 60, orden: 12 },
  { categoria_id: c['Frappé'], nombre: 'Carlos V',        descripcion: null, precio: 65, orden: 13 },
  { categoria_id: c['Frappé'], nombre: 'Chocoreta',       descripcion: null, precio: 65, orden: 14 },
  { categoria_id: c['Frappé'], nombre: 'Bubulubu',        descripcion: null, precio: 70, orden: 15 },
  { categoria_id: c['Frappé'], nombre: 'Mazapán',         descripcion: null, precio: 70, orden: 16 },
  { categoria_id: c['Frappé'], nombre: 'Snickers',        descripcion: null, precio: 80, orden: 17 },
  { categoria_id: c['Frappé'], nombre: 'Pingüinos',       descripcion: null, precio: 80, orden: 18 },
  { categoria_id: c['Frappé'], nombre: 'Chocorroles',     descripcion: null, precio: 80, orden: 19 },
  { categoria_id: c['Frappé'], nombre: 'Chokis (galleta)',descripcion: null, precio: 70, orden: 20 },

  // CHAMOYADAS
  { categoria_id: c['Chamoyadas'], nombre: 'Limón',              descripcion: null, precio: 55, orden: 0 },
  { categoria_id: c['Chamoyadas'], nombre: 'Fresada (pica fresa)',descripcion: null, precio: 65, orden: 1 },
  { categoria_id: c['Chamoyadas'], nombre: 'Mangolada',          descripcion: null, precio: 65, orden: 2 },
  { categoria_id: c['Chamoyadas'], nombre: 'Lucas (muecas)',     descripcion: null, precio: 65, orden: 3 },
  { categoria_id: c['Chamoyadas'], nombre: 'Skwinkles',          descripcion: null, precio: 65, orden: 4 },

  // CREPAS
  { categoria_id: c['Crepas'], nombre: 'Nutella',                    descripcion: null, precio: 50, orden:  0 },
  { categoria_id: c['Crepas'], nombre: 'Nutella / Fruta',            descripcion: null, precio: 60, orden:  1 },
  { categoria_id: c['Crepas'], nombre: 'Nutella / Philadelphia',     descripcion: null, precio: 60, orden:  2 },
  { categoria_id: c['Crepas'], nombre: 'Nutella / Topping',          descripcion: null, precio: 55, orden:  3 },
  { categoria_id: c['Crepas'], nombre: 'Nutella / Fruta / Topping',  descripcion: null, precio: 65, orden:  4 },
  { categoria_id: c['Crepas'], nombre: 'Crema lotus',                descripcion: null, precio: 55, orden:  5 },
  { categoria_id: c['Crepas'], nombre: 'Crema lotus / Fruta',        descripcion: null, precio: 65, orden:  6 },
  { categoria_id: c['Crepas'], nombre: 'Crema lotus / Topping',      descripcion: null, precio: 65, orden:  7 },
  { categoria_id: c['Crepas'], nombre: 'Crema lotus / Fruta / Topping', descripcion: null, precio: 75, orden: 8 },
  { categoria_id: c['Crepas'], nombre: 'Cajeta',                     descripcion: null, precio: 40, orden:  9 },
  { categoria_id: c['Crepas'], nombre: 'Cajeta / Fruta',             descripcion: null, precio: 55, orden: 10 },
  { categoria_id: c['Crepas'], nombre: 'Mermelada / Fruta',          descripcion: null, precio: 50, orden: 11 },
  { categoria_id: c['Crepas'], nombre: 'Philadelphia',               descripcion: null, precio: 45, orden: 12 },
  { categoria_id: c['Crepas'], nombre: 'Philadelphia / Fruta',       descripcion: null, precio: 60, orden: 13 },
  { categoria_id: c['Crepas'], nombre: 'Hawaiana',                   descripcion: null, precio: 65, orden: 14 },
  { categoria_id: c['Crepas'], nombre: 'Manchego / Philadelphia',    descripcion: null, precio: 60, orden: 15 },

  // SNACKS
  { categoria_id: c['Snacks'], nombre: 'Cuernito de jamón',        descripcion: null, precio: 50, orden: 0 },
  { categoria_id: c['Snacks'], nombre: 'Sincronizada',             descripcion: null, precio: 40, orden: 1 },
  { categoria_id: c['Snacks'], nombre: 'Sabrilocas',               descripcion: null, precio: 60, orden: 2 },
  { categoria_id: c['Snacks'], nombre: 'Mix de verduras Chico',    descripcion: null, precio: 30, orden: 3 },
  { categoria_id: c['Snacks'], nombre: 'Mix de verduras Mediano',  descripcion: null, precio: 45, orden: 4 },
  { categoria_id: c['Snacks'], nombre: 'Mix de verduras Grande',   descripcion: null, precio: 60, orden: 5 },
  { categoria_id: c['Snacks'], nombre: 'Gomiboing',                descripcion: null, precio: 30, orden: 6 },

  // MOLOTES
  { categoria_id: c['Molotes'], nombre: 'Tinga',           descripcion: null, precio: 40, orden: 0 },
  { categoria_id: c['Molotes'], nombre: 'Requesón',        descripcion: null, precio: 40, orden: 1 },
  { categoria_id: c['Molotes'], nombre: 'Papa con longaniza', descripcion: null, precio: 40, orden: 2 },
  { categoria_id: c['Molotes'], nombre: 'Quesillo',        descripcion: null, precio: 40, orden: 3 },
  { categoria_id: c['Molotes'], nombre: 'Hawaiano',        descripcion: null, precio: 40, orden: 4 },

  // EMPANADAS
  { categoria_id: c['Empanadas'], nombre: 'Camarón',                   descripcion: null, precio: 50, orden: 0 },
  { categoria_id: c['Empanadas'], nombre: 'Hawaiana',                  descripcion: null, precio: 50, orden: 1 },
  { categoria_id: c['Empanadas'], nombre: 'Piña',                      descripcion: null, precio: 35, orden: 2 },
  { categoria_id: c['Empanadas'], nombre: 'Zarzamora / Philadelphia',  descripcion: null, precio: 50, orden: 3 },
  { categoria_id: c['Empanadas'], nombre: 'Durazno',                   descripcion: null, precio: 35, orden: 4 },
  { categoria_id: c['Empanadas'], nombre: 'Fresa',                     descripcion: null, precio: 35, orden: 5 },
  { categoria_id: c['Empanadas'], nombre: 'Cajeta',                    descripcion: null, precio: 35, orden: 6 },

  // TOSTADAS
  { categoria_id: c['Tostadas'], nombre: 'Tinga',           descripcion: null, precio: 30, orden: 0 },
  { categoria_id: c['Tostadas'], nombre: 'Quesillo',        descripcion: null, precio: 30, orden: 1 },
  { categoria_id: c['Tostadas'], nombre: 'Pollo deshebrado',descripcion: null, precio: 30, orden: 2 },

  // TACOS DORADOS
  { categoria_id: c['Tacos Dorados'], nombre: 'Tinga',           descripcion: '4 piezas', precio: 50, orden: 0 },
  { categoria_id: c['Tacos Dorados'], nombre: 'Papa / Longaniza', descripcion: '4 piezas', precio: 50, orden: 1 },
  { categoria_id: c['Tacos Dorados'], nombre: 'Pollo deshebrado', descripcion: '4 piezas', precio: 50, orden: 2 },
  { categoria_id: c['Tacos Dorados'], nombre: 'Quesillo',         descripcion: '4 piezas', precio: 50, orden: 3 },

  // BEBIDAS (precio 0 = sin precio especificado)
  { categoria_id: c['Bebidas'], nombre: 'Boing (lata)',     descripcion: null, precio: 0, orden: 0 },
  { categoria_id: c['Bebidas'], nombre: 'Coca Cola 600 ml', descripcion: null, precio: 0, orden: 1 },
]

const { data: prods, error: errProds } = await supabase
  .from('productos')
  .insert(productos)
  .select('id')

if (errProds) {
  console.error('Error al insertar productos:', errProds.message)
  process.exit(1)
}

console.log(`✓ ${prods.length} productos insertados`)
console.log('Menú de Fresita actualizado correctamente.')
