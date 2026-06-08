import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, supabaseConfigurado } from '../lib/supabase'
import { CATEGORIAS } from '../data/seed'
import { hoyISO } from '../utils/helpers'

const TiendaContext = createContext(null)

// Agrupa un arreglo por una clave
function agrupar(lista, clave) {
  const mapa = {}
  for (const item of lista) {
    const k = item[clave]
    if (!mapa[k]) mapa[k] = []
    mapa[k].push(item)
  }
  return mapa
}

export function TiendaProvider({ children }) {
  const [restaurantes, setRestaurantes] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(supabaseConfigurado ? null : 'config')

  // Carga todo desde Supabase y arma la forma anidada que usan los componentes
  const recargar = useCallback(async () => {
    if (!supabaseConfigurado) {
      setError('config')
      setCargando(false)
      return
    }
    setCargando(true)
    try {
      const [neg, cat, prod, sol] = await Promise.all([
        supabase.from('negocios').select('*').order('created_at', { ascending: true }),
        supabase.from('categorias').select('*').order('orden', { ascending: true }),
        supabase.from('productos').select('*').order('orden', { ascending: true }),
        supabase.from('solicitudes').select('*').order('created_at', { ascending: false }),
      ])
      const primerError = neg.error || cat.error || prod.error || sol.error
      if (primerError) throw primerError

      const prodPorCat = agrupar(prod.data || [], 'categoria_id')
      const catsPorNeg = agrupar(cat.data || [], 'negocio_id')

      const rests = (neg.data || []).map((n) => ({
        id: n.id,
        nombre: n.nombre,
        categorias: n.tipos || [],
        foto: n.foto || '',
        descripcion: n.descripcion || '',
        direccion: n.direccion || '',
        telefono: n.telefono || '',
        whatsapp: n.whatsapp || '',
        facebook: n.facebook || '',
        instagram: n.instagram || '',
        tiktok: n.tiktok || '',
        sitio_web: n.sitio_web || '',
        usuario: n.usuario || '',
        activo: n.activo,
        creado: n.creado,
        horario: n.horario,
        override: n.override,
        menu: (catsPorNeg[n.id] || []).map((c) => ({
          id: c.id,
          nombre: c.nombre,
          productos: (prodPorCat[c.id] || []).map((p) => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion || '',
            precio: Number(p.precio) || 0,
            foto: p.foto || '',
          })),
        })),
      }))

      const sols = (sol.data || []).map((s) => ({
        id: s.id,
        nombreNegocio: s.nombre_negocio,
        contacto: s.contacto || '',
        whatsapp: s.whatsapp || '',
        mensaje: s.mensaje || '',
        fecha: s.fecha,
        estado: s.estado,
      }))

      // Orden aleatorio en cada carga para que la pantalla se vea variada
      for (let i = rests.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rests[i], rests[j]] = [rests[j], rests[i]]
      }
      setRestaurantes(rests)
      setSolicitudes(sols)
      setError(null)
    } catch (e) {
      console.error('Error cargando datos de Supabase:', e)
      setError(e.message || 'error')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  // Reemplaza por completo el menú de un negocio (borra y re-inserta)
  async function reemplazarMenu(negocioId, menu) {
    await supabase.from('categorias').delete().eq('negocio_id', negocioId)
    for (let i = 0; i < (menu || []).length; i++) {
      const sec = menu[i]
      const { data: catIns, error: e1 } = await supabase
        .from('categorias')
        .insert({ negocio_id: negocioId, nombre: sec.nombre || 'Sin nombre', orden: i })
        .select('id')
        .single()
      if (e1) throw e1
      const prods = (sec.productos || []).map((p, j) => ({
        categoria_id: catIns.id,
        nombre: p.nombre || '',
        descripcion: p.descripcion || '',
        precio: Number(p.precio) || 0,
        foto: p.foto || '',
        orden: j,
      }))
      if (prods.length) {
        const { error: e2 } = await supabase.from('productos').insert(prods)
        if (e2) throw e2
      }
    }
  }

  // Separa los campos del formulario en columnas de la tabla negocios
  function camposNegocio(datos) {
    const obj = {}
    if (datos.nombre !== undefined) obj.nombre = datos.nombre
    if (datos.categorias !== undefined) obj.tipos = datos.categorias
    if (datos.foto !== undefined) obj.foto = datos.foto
    if (datos.descripcion !== undefined) obj.descripcion = datos.descripcion
    if (datos.direccion !== undefined) obj.direccion = datos.direccion
    if (datos.telefono !== undefined) obj.telefono = datos.telefono
    if (datos.whatsapp !== undefined) obj.whatsapp = datos.whatsapp
    if (datos.facebook !== undefined) obj.facebook = datos.facebook || null
    if (datos.instagram !== undefined) obj.instagram = datos.instagram || null
    if (datos.tiktok !== undefined) obj.tiktok = datos.tiktok || null
    if (datos.sitio_web !== undefined) obj.sitio_web = datos.sitio_web || null
    if (datos.usuario !== undefined) obj.usuario = datos.usuario || null
    if (datos.activo !== undefined) obj.activo = datos.activo
    if (datos.creado !== undefined) obj.creado = datos.creado
    if (datos.horario !== undefined) obj.horario = datos.horario
    if (datos.override !== undefined) obj.override = datos.override
    if (datos.delivery !== undefined) obj.delivery = datos.delivery || null
    if (datos.delivery_minimo !== undefined) obj.delivery_minimo = datos.delivery_minimo ? Number(datos.delivery_minimo) : null
    return obj
  }

  // Envuelve una acción con manejo de error básico
  async function ejecutar(fn) {
    try {
      await fn()
      await recargar()
      return true
    } catch (e) {
      console.error('Error guardando en Supabase:', e)
      alert('Ocurrió un error al guardar. Revisa tu conexión e inténtalo de nuevo.')
      return false
    }
  }

  // ---- Restaurantes ----
  const agregarRestaurante = (datos) =>
    ejecutar(async () => {
      const { data, error: e } = await supabase
        .from('negocios')
        .insert({ ...camposNegocio(datos), creado: datos.creado || hoyISO() })
        .select('id')
        .single()
      if (e) throw e
      if (datos.password) {
        await supabase.rpc('set_credenciales', {
          p_negocio_id: data.id,
          p_password: datos.password,
        })
      }
      if (datos.menu) await reemplazarMenu(data.id, datos.menu)
    })

  const actualizarRestaurante = (id, cambios) =>
    ejecutar(async () => {
      const campos = camposNegocio(cambios)
      if (Object.keys(campos).length) {
        const { error: e } = await supabase.from('negocios').update(campos).eq('id', id)
        if (e) throw e
      }
      if (cambios.password) {
        await supabase.rpc('set_credenciales', { p_negocio_id: id, p_password: cambios.password })
      }
      if (cambios.menu !== undefined) await reemplazarMenu(id, cambios.menu)
    })

  const eliminarRestaurante = (id) =>
    ejecutar(async () => {
      const { error: e } = await supabase.from('negocios').delete().eq('id', id)
      if (e) throw e
    })

  const alternarActivo = (id) =>
    ejecutar(async () => {
      const actual = restaurantes.find((r) => r.id === id)
      const { error: e } = await supabase
        .from('negocios')
        .update({ activo: !actual?.activo })
        .eq('id', id)
      if (e) throw e
    })

  const fijarEstadoManual = (id, estado) =>
    ejecutar(async () => {
      const { error: e } = await supabase
        .from('negocios')
        .update({ override: { estado, fecha: hoyISO() } })
        .eq('id', id)
      if (e) throw e
    })

  const usarHorarioAutomatico = (id) =>
    ejecutar(async () => {
      const { error: e } = await supabase.from('negocios').update({ override: null }).eq('id', id)
      if (e) throw e
    })

  // ---- Solicitudes ----
  const agregarSolicitud = (sol) =>
    ejecutar(async () => {
      const { error: e } = await supabase.from('solicitudes').insert({
        nombre_negocio: sol.nombreNegocio,
        contacto: sol.contacto || '',
        whatsapp: sol.whatsapp || '',
        mensaje: sol.mensaje || '',
        fecha: sol.fecha || hoyISO(),
        estado: 'pendiente',
      })
      if (e) throw e
    })

  const actualizarSolicitud = (id, cambios) =>
    ejecutar(async () => {
      const { error: e } = await supabase.from('solicitudes').update(cambios).eq('id', id)
      if (e) throw e
    })

  const eliminarSolicitud = (id) =>
    ejecutar(async () => {
      const { error: e } = await supabase.from('solicitudes').delete().eq('id', id)
      if (e) throw e
    })

  // ---- Configuración / autenticación ----
  const cambiarAdminPassword = async (nueva) => {
    const { error: e } = await supabase.rpc('set_admin_password', { p_nueva: nueva })
    if (e) {
      alert('No se pudo cambiar la contraseña.')
      return false
    }
    return true
  }

  const validarAdmin = async (password) => {
    const { data, error: e } = await supabase.rpc('verificar_admin', { p_password: password })
    if (e) return false
    return data === true
  }

  // Devuelve el id del negocio si las credenciales son válidas, si no null
  const validarNegocio = async (usuario, password) => {
    const { data, error: e } = await supabase.rpc('login_negocio', {
      p_usuario: usuario,
      p_password: password,
    })
    if (e) return null
    return data || null
  }

  const valor = {
    restaurantes,
    solicitudes,
    categorias: CATEGORIAS,
    cargando,
    error,
    recargar,
    agregarRestaurante,
    actualizarRestaurante,
    eliminarRestaurante,
    alternarActivo,
    fijarEstadoManual,
    usarHorarioAutomatico,
    agregarSolicitud,
    actualizarSolicitud,
    eliminarSolicitud,
    cambiarAdminPassword,
    validarAdmin,
    validarNegocio,
  }

  return <TiendaContext.Provider value={valor}>{children}</TiendaContext.Provider>
}

export function useTienda() {
  const ctx = useContext(TiendaContext)
  if (!ctx) throw new Error('useTienda debe usarse dentro de TiendaProvider')
  return ctx
}
