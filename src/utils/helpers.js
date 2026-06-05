// Utilidades generales de SAX

const DIAS = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab']
export const DIAS_NOMBRE = {
  lun: 'Lunes',
  mar: 'Martes',
  mie: 'Miércoles',
  jue: 'Jueves',
  vie: 'Viernes',
  sab: 'Sábado',
  dom: 'Domingo',
}
export const ORDEN_DIAS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']

// Convierte "HH:MM" a minutos desde medianoche
function aMinutos(hhmm) {
  if (!hhmm || !hhmm.includes(':')) return null
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// Determina si un restaurante está abierto AHORA según su horario.
// Maneja horarios que cruzan medianoche (ej. 18:00 -> 02:00).
export function estaAbierto(horario, ahora = new Date()) {
  if (!horario) return false
  const claveHoy = DIAS[ahora.getDay()]
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes()

  const hoy = horario[claveHoy]
  if (hoy && hoy.abierto) {
    const ap = aMinutos(hoy.apertura)
    const ci = aMinutos(hoy.cierre)
    if (ap != null && ci != null) {
      if (ci > ap) {
        if (minutosAhora >= ap && minutosAhora < ci) return true
      } else {
        // Cruza medianoche
        if (minutosAhora >= ap) return true
      }
    }
  }

  // Revisar si seguimos dentro del horario de ayer que cruzó medianoche
  const claveAyer = DIAS[(ahora.getDay() + 6) % 7]
  const ayer = horario[claveAyer]
  if (ayer && ayer.abierto) {
    const ap = aMinutos(ayer.apertura)
    const ci = aMinutos(ayer.cierre)
    if (ap != null && ci != null && ci <= ap) {
      if (minutosAhora < ci) return true
    }
  }

  return false
}

// Texto del horario de hoy: "Hoy: 10:00 - 23:00" o "Hoy: cerrado"
export function horarioDeHoy(horario, ahora = new Date()) {
  if (!horario) return 'Horario no disponible'
  const claveHoy = DIAS[ahora.getDay()]
  const hoy = horario[claveHoy]
  if (!hoy || !hoy.abierto) return 'Hoy: cerrado'
  return `Hoy: ${hoy.apertura} - ${hoy.cierre}`
}

// Formatear precio en pesos
export function precio(n) {
  const num = Number(n) || 0
  return `$${num.toLocaleString('es-MX')}`
}

// Generar un id único simple (sin Date.now para entornos restringidos del runtime)
let contador = 0
export function nuevoId(prefijo = 'id') {
  contador += 1
  const aleatorio = Math.floor(performance.now() * 1000) % 100000
  return `${prefijo}-${aleatorio}-${contador}`
}

// Limpiar número de WhatsApp y armar enlace
export function enlaceWhatsApp(numero, mensaje = '') {
  const limpio = String(numero || '').replace(/[^\d]/g, '')
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''
  return `https://wa.me/${limpio}${texto}`
}

// Enlace para llamar por teléfono
export function enlaceTelefono(numero) {
  const limpio = String(numero || '').replace(/[^\d+]/g, '')
  return `tel:${limpio}`
}

// Enlace a Google Maps para "Cómo llegar" usando la dirección escrita
export function enlaceMaps(direccion) {
  const q = encodeURIComponent(String(direccion || ''))
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

// Fecha de hoy en formato "YYYY-MM-DD"
export function hoyISO() {
  return new Date().toISOString().slice(0, 10)
}

// ¿El negocio se agregó hace poco? (por defecto, últimos 30 días)
export function esNuevo(creado, dias = 30) {
  if (!creado) return false
  const fecha = new Date(creado + 'T00:00:00')
  if (isNaN(fecha)) return false
  const ahora = new Date()
  const diff = (ahora - fecha) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= dias
}

// ¿Hay un estado manual ("abierto"/"cerrado") fijado por el dueño para HOY?
// El override solo vale el día en que se activó; al día siguiente vuelve al horario.
export function hayOverrideHoy(rest) {
  return !!(rest?.override && rest.override.fecha === hoyISO())
}

// Estado REAL del negocio: el control manual del dueño tiene prioridad sobre
// el horario programado. Si no hay override de hoy, se usa el horario.
export function estaAbiertoEfectivo(rest) {
  if (hayOverrideHoy(rest)) {
    return rest.override.estado === 'abierto'
  }
  return estaAbierto(rest?.horario)
}

// Devuelve siempre un arreglo con las categorías de un restaurante.
// Compatible con datos antiguos que usaban un solo campo "categoria".
export function categoriasDe(rest) {
  if (Array.isArray(rest?.categorias) && rest.categorias.length) return rest.categorias
  if (rest?.categoria) return [rest.categoria]
  return []
}

// Construye la URL correcta para abrir una red social dado un valor libre
// (usuario "@fulanito", URL completa o nombre de página).
export function enlaceSocial(tipo, valor) {
  if (!valor) return ''
  if (valor.startsWith('http://') || valor.startsWith('https://')) return valor
  const v = valor.replace(/^@/, '').trim()
  if (tipo === 'facebook') return `https://facebook.com/${v}`
  if (tipo === 'instagram') return `https://instagram.com/${v}`
  if (tipo === 'tiktok') return `https://tiktok.com/@${v}`
  if (tipo === 'sitio_web') return `https://${v}`
  return valor
}

// Horario vacío por defecto para formularios nuevos
export function horarioVacio() {
  const base = {}
  ORDEN_DIAS.forEach((d) => {
    base[d] = { abierto: true, apertura: '09:00', cierre: '22:00' }
  })
  return base
}
