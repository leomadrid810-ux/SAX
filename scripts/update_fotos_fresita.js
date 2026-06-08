/**
 * Asigna imágenes a todos los productos de Fresita.
 * Uso: node --env-file=.env scripts/update_fotos_fresita.js
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Clave: "Categoría|Nombre en DB" → URL
const FOTOS = {
  // ── POSTRES ──────────────────────────────────────────────
  'Postres|Flan napolitano':      'https://images.pexels.com/photos/34474024/pexels-photo-34474024/free-photo-of-delicious-flan-dessert-on-white-plates.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Postres|Concha rellena':       'https://images.pexels.com/photos/12097597/pexels-photo-12097597.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Postres|Cuernito relleno':     'https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?w=600&q=80',
  'Postres|Mini hotcakes 12 pzas':'https://images.pexels.com/photos/36457612/pexels-photo-36457612.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Postres|Mini hotcakes 18 pzas':'https://images.pexels.com/photos/36457612/pexels-photo-36457612.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Postres|Mini hotcakes 25 pzas':'https://images.pexels.com/photos/36457612/pexels-photo-36457612.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Postres|Mini donitas 8 pzas':  'https://images.pexels.com/photos/35224343/pexels-photo-35224343/free-photo-of-delicious-white-iced-donuts-with-star-decorations.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Postres|Mini donitas 12 pzas': 'https://images.pexels.com/photos/35224343/pexels-photo-35224343/free-photo-of-delicious-white-iced-donuts-with-star-decorations.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',

  // ── FRAPPÉ ───────────────────────────────────────────────
  'Frappé|Café':              'https://images.unsplash.com/photo-1605089315761-11748de7ec7d?w=600&q=80',
  'Frappé|Moka':              'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80',
  'Frappé|Chocolate':         'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80',
  'Frappé|Fresa':             'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80',
  'Frappé|Plátano':           'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?w=600&q=80',
  'Frappé|Galleta oreo':      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80',
  'Frappé|Kinder delice':     'https://images.unsplash.com/photo-1718267050202-9b1b6bfb8545?w=600&q=80',
  'Frappé|Lunetas':           'https://images.unsplash.com/photo-1718267050202-9b1b6bfb8545?w=600&q=80',
  'Frappé|Frutos rojos':      'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=600&q=80',
  'Frappé|Nutella':           'https://images.unsplash.com/photo-1648999599232-fd999a6b1d91?w=600&q=80',
  'Frappé|Pay de limón':      'https://images.unsplash.com/photo-1614174486496-344ef3e9d870?w=600&q=80',
  'Frappé|Chocobanana':       'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&q=80',
  'Frappé|Cajeta':            'https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&q=80',
  'Frappé|Carlos V':          'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&q=80',
  'Frappé|Chocoreta':         'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80',
  'Frappé|Bubulubu':          'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80',
  'Frappé|Mazapán':           'https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&q=80',
  'Frappé|Snickers':          'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&q=80',
  'Frappé|Pingüinos':         'https://images.unsplash.com/photo-1718267050202-9b1b6bfb8545?w=600&q=80',
  'Frappé|Chocorroles':       'https://images.unsplash.com/photo-1718267050202-9b1b6bfb8545?w=600&q=80',
  'Frappé|Chokis (galleta)':  'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80',

  // ── CHAMOYADAS ───────────────────────────────────────────
  'Chamoyadas|Limón':                 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=600&q=80',
  'Chamoyadas|Fresada (pica fresa)':  'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80',
  'Chamoyadas|Mangolada':             'https://images.pexels.com/photos/28525188/pexels-photo-28525188/free-photo-of-delicious-mango-sorbet-glass-on-wooden-table.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Chamoyadas|Lucas (muecas)':        'https://images.unsplash.com/photo-1715640476091-022c895f4cd3?w=600&q=80',
  'Chamoyadas|Skwinkles':             'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80',

  // ── CREPAS ───────────────────────────────────────────────
  'Crepas|Nutella':                        'https://images.unsplash.com/photo-1515467837915-15c4777ba46a?w=600&q=80',
  'Crepas|Nutella / Fruta':                'https://images.pexels.com/photos/8601533/pexels-photo-8601533.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Crepas|Nutella / Philadelphia':         'https://images.unsplash.com/photo-1656057205408-4a0a62cf2dfb?w=600&q=80',
  'Crepas|Nutella / Topping':              'https://images.unsplash.com/photo-1515467837915-15c4777ba46a?w=600&q=80',
  'Crepas|Nutella / Fruta / Topping':      'https://images.unsplash.com/photo-1637036124732-cb0fab13bb15?w=600&q=80',
  'Crepas|Crema lotus':                    'https://images.unsplash.com/photo-1672300742770-d286a1c0bd71?w=600&q=80',
  'Crepas|Crema lotus / Fruta':            'https://images.unsplash.com/photo-1637036124732-cb0fab13bb15?w=600&q=80',
  'Crepas|Crema lotus / Topping':          'https://images.unsplash.com/photo-1672300742770-d286a1c0bd71?w=600&q=80',
  'Crepas|Crema lotus / Fruta / Topping':  'https://images.unsplash.com/photo-1637036124732-cb0fab13bb15?w=600&q=80',
  'Crepas|Cajeta':                         'https://images.unsplash.com/photo-1637036124732-cb0fab13bb15?w=600&q=80',
  'Crepas|Cajeta / Fruta':                 'https://images.unsplash.com/photo-1637036124732-cb0fab13bb15?w=600&q=80',
  'Crepas|Mermelada / Fruta':              'https://images.unsplash.com/photo-1637036124732-cb0fab13bb15?w=600&q=80',
  'Crepas|Philadelphia':                   'https://images.unsplash.com/photo-1620980776848-84ac10194945?w=600&q=80',
  'Crepas|Philadelphia / Fruta':           'https://images.unsplash.com/photo-1656057205408-4a0a62cf2dfb?w=600&q=80',
  'Crepas|Hawaiana':                       'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765?w=600&q=80',
  'Crepas|Manchego / Philadelphia':        'https://images.unsplash.com/photo-1661349008073-136bed6e6788?w=600&q=80',

  // ── SNACKS ───────────────────────────────────────────────
  'Snacks|Cuernito de jamón':       'https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?w=600&q=80',
  'Snacks|Sincronizada':            'https://images.pexels.com/photos/32351726/pexels-photo-32351726/free-photo-of-delicious-grilled-quesadilla-with-salsa.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Snacks|Sabrilocas':              'https://images.unsplash.com/photo-1699666397768-0126340e880a?w=600&q=80',
  'Snacks|Mix de verduras Chico':   'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&q=80',
  'Snacks|Mix de verduras Mediano': 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&q=80',
  'Snacks|Mix de verduras Grande':  'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&q=80',
  'Snacks|Gomiboing':               'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600&q=80',

  // ── MOLOTES ──────────────────────────────────────────────
  'Molotes|Tinga':             'https://muybuenoblog.com/wp-content/uploads/2022/11/pueblo-chicken-tinga-empanadas.jpeg',
  'Molotes|Requesón':          'https://muybuenoblog.com/wp-content/uploads/2022/11/pueblo-chicken-tinga-empanadas.jpeg',
  'Molotes|Papa con longaniza':'https://muybuenoblog.com/wp-content/uploads/2022/11/pueblo-chicken-tinga-empanadas.jpeg',
  'Molotes|Quesillo':          'https://muybuenoblog.com/wp-content/uploads/2022/11/pueblo-chicken-tinga-empanadas.jpeg',
  'Molotes|Hawaiano':          'https://muybuenoblog.com/wp-content/uploads/2022/11/pueblo-chicken-tinga-empanadas.jpeg',

  // ── EMPANADAS ────────────────────────────────────────────
  'Empanadas|Camarón':                  'https://images.unsplash.com/photo-1621368859385-0f3730c1966e?w=600&q=80',
  'Empanadas|Hawaiana':                 'https://images.unsplash.com/photo-1624128082323-beb6b8b508db?w=600&q=80',
  'Empanadas|Piña':                     'https://images.unsplash.com/photo-1624128082323-beb6b8b508db?w=600&q=80',
  'Empanadas|Zarzamora / Philadelphia': 'https://images.pexels.com/photos/37099465/pexels-photo-37099465/free-photo-of-enjoying-traditional-argentinian-empanada-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Empanadas|Durazno':                  'https://images.unsplash.com/photo-1625833196424-a1be6544e069?w=600&q=80',
  'Empanadas|Fresa':                    'https://images.unsplash.com/photo-1602663491496-73f07481dbea?w=600&q=80',
  'Empanadas|Cajeta':                   'https://images.unsplash.com/photo-1624128082323-beb6b8b508db?w=600&q=80',

  // ── TOSTADAS ─────────────────────────────────────────────
  'Tostadas|Tinga':           'https://images.pexels.com/photos/27827767/pexels-photo-27827767/free-photo-of-two-tacos-with-meat-and-toppings-on-top-of-them.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Tostadas|Quesillo':        'https://images.unsplash.com/photo-1676081986290-ac79c2968c3f?w=600&q=80',
  'Tostadas|Pollo deshebrado':'https://images.unsplash.com/photo-1619019187211-adf2f6119afd?w=600&q=80',

  // ── TACOS DORADOS ────────────────────────────────────────
  'Tacos Dorados|Tinga':           'https://images.pexels.com/photos/19831906/pexels-photo-19831906/free-photo-of-restaurant-meal-with-cabbage.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Tacos Dorados|Papa / Longaniza':'https://images.pexels.com/photos/5837196/pexels-photo-5837196.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',
  'Tacos Dorados|Pollo deshebrado':'https://images.unsplash.com/photo-1545093149-618ce3bcf49d?w=600&q=80',
  'Tacos Dorados|Quesillo':        'https://images.pexels.com/photos/5837196/pexels-photo-5837196.jpeg?auto=compress&cs=tinysrgb&w=600&q=80',

  // ── BEBIDAS ──────────────────────────────────────────────
  'Bebidas|Boing (lata)':     'https://images.unsplash.com/photo-1640213505284-21352ee0d76b?w=600&q=80',
  'Bebidas|Coca Cola 600 ml': 'https://images.unsplash.com/photo-1648569883125-d01072540b4c?w=600&q=80',
}

// ── 1. Obtener negocio Fresita ────────────────────────────────
const { data: negs } = await supabase
  .from('negocios').select('id, nombre').ilike('nombre', '%fresita%')

if (!negs?.length) { console.error('Negocio Fresita no encontrado'); process.exit(1) }

// Si hay varios, elegir el que tenga más categorías (el menú completo)
let negocioId = negs[0].id
if (negs.length > 1) {
  const counts = await Promise.all(
    negs.map(n => supabase.from('categorias').select('id', { count: 'exact', head: true }).eq('negocio_id', n.id))
  )
  const idx = counts.reduce((best, cur, i) => (cur.count ?? 0) > (counts[best].count ?? 0) ? i : best, 0)
  negocioId = negs[idx].id
  console.log(`Múltiples negocios con "Fresita". Usando el de más categorías: ${negs[idx].nombre} (${negocioId})`)
}

// ── 2. Obtener todos los productos con su categoría ───────────
// Primero obtenemos las categorías del negocio
const { data: cats } = await supabase
  .from('categorias').select('id, nombre').eq('negocio_id', negocioId)

if (!cats?.length) { console.error('Sin categorías para este negocio'); process.exit(1) }

const catIds = cats.map(c => c.id)
const catNombre = Object.fromEntries(cats.map(c => [c.id, c.nombre]))

const { data: productos, error } = await supabase
  .from('productos')
  .select('id, nombre, foto, categoria_id')
  .in('categoria_id', catIds)

if (error) { console.error('Error al obtener productos:', error.message); process.exit(1) }

const fresitaProds = (productos ?? []).map(p => ({
  ...p,
  categorias: { nombre: catNombre[p.categoria_id] }
}))

console.log(`Productos encontrados: ${fresitaProds.length}\n`)

let actualizados = 0
let sinImagen = []
let errores = []

for (const prod of fresitaProds) {
  const cat = prod.categorias?.nombre ?? ''
  const key = `${cat}|${prod.nombre}`
  const url = FOTOS[key]

  if (!url) {
    sinImagen.push(key)
    continue
  }

  const { error: updErr } = await supabase
    .from('productos')
    .update({ foto: url })
    .eq('id', prod.id)

  if (updErr) {
    errores.push(`${key}: ${updErr.message}`)
  } else {
    console.log(`✓ ${key}`)
    actualizados++
  }
}

console.log(`\n─── Resumen ───────────────────────────────────────────`)
console.log(`✓ Actualizados:   ${actualizados}`)
console.log(`⚠ Sin imagen:     ${sinImagen.length}`)
console.log(`✗ Errores:        ${errores.length}`)

if (sinImagen.length) {
  console.log('\nSin imagen:')
  sinImagen.forEach(n => console.log('  -', n))
}
if (errores.length) {
  console.log('\nErrores:')
  errores.forEach(e => console.log('  ✗', e))
}
