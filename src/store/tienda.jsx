import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  RESTAURANTES_EJEMPLO,
  SOLICITUDES_EJEMPLO,
  ADMIN_PASSWORD_DEFECTO,
  CATEGORIAS,
} from '../data/seed'
import { nuevoId, hoyISO } from '../utils/helpers'

const CLAVE = 'sax:datos:v2'

const TiendaContext = createContext(null)

function cargarInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado) {
      const datos = JSON.parse(guardado)
      // Asegurar estructura mínima
      return {
        restaurantes: datos.restaurantes || [],
        solicitudes: datos.solicitudes || [],
        adminPassword: datos.adminPassword || ADMIN_PASSWORD_DEFECTO,
      }
    }
  } catch (e) {
    console.warn('Error leyendo localStorage, se usan datos de ejemplo.', e)
  }
  return {
    restaurantes: RESTAURANTES_EJEMPLO,
    solicitudes: SOLICITUDES_EJEMPLO,
    adminPassword: ADMIN_PASSWORD_DEFECTO,
  }
}

export function TiendaProvider({ children }) {
  const [datos, setDatos] = useState(cargarInicial)

  // Persistir en cada cambio
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(datos))
    } catch (e) {
      console.warn('No se pudo guardar en localStorage', e)
    }
  }, [datos])

  const acciones = useMemo(() => {
    // ---- Restaurantes ----
    const agregarRestaurante = (rest) => {
      const nuevo = {
        id: nuevoId('rest'),
        nombre: '',
        categorias: [CATEGORIAS[0].id],
        activo: true,
        foto: '',
        descripcion: '',
        direccion: '',
        telefono: '',
        whatsapp: '',
        creado: hoyISO(),
        horario: rest.horario,
        usuario: '',
        password: '',
        menu: [],
        ...rest,
      }
      setDatos((d) => ({ ...d, restaurantes: [...d.restaurantes, nuevo] }))
      return nuevo
    }

    const actualizarRestaurante = (id, cambios) => {
      setDatos((d) => ({
        ...d,
        restaurantes: d.restaurantes.map((r) =>
          r.id === id ? { ...r, ...cambios } : r
        ),
      }))
    }

    const eliminarRestaurante = (id) => {
      setDatos((d) => ({
        ...d,
        restaurantes: d.restaurantes.filter((r) => r.id !== id),
      }))
    }

    const alternarActivo = (id) => {
      setDatos((d) => ({
        ...d,
        restaurantes: d.restaurantes.map((r) =>
          r.id === id ? { ...r, activo: !r.activo } : r
        ),
      }))
    }

    // Estado manual del dueño (prioridad sobre el horario), válido para hoy
    const fijarEstadoManual = (id, estado) => {
      setDatos((d) => ({
        ...d,
        restaurantes: d.restaurantes.map((r) =>
          r.id === id ? { ...r, override: { estado, fecha: hoyISO() } } : r
        ),
      }))
    }

    // Volver a regirse por el horario programado
    const usarHorarioAutomatico = (id) => {
      setDatos((d) => ({
        ...d,
        restaurantes: d.restaurantes.map((r) =>
          r.id === id ? { ...r, override: null } : r
        ),
      }))
    }

    // ---- Solicitudes de negocios ----
    const agregarSolicitud = (sol) => {
      const nueva = {
        id: nuevoId('sol'),
        estado: 'pendiente',
        ...sol,
      }
      setDatos((d) => ({ ...d, solicitudes: [nueva, ...d.solicitudes] }))
      return nueva
    }

    const actualizarSolicitud = (id, cambios) => {
      setDatos((d) => ({
        ...d,
        solicitudes: d.solicitudes.map((s) =>
          s.id === id ? { ...s, ...cambios } : s
        ),
      }))
    }

    const eliminarSolicitud = (id) => {
      setDatos((d) => ({
        ...d,
        solicitudes: d.solicitudes.filter((s) => s.id !== id),
      }))
    }

    // ---- Configuración ----
    const cambiarAdminPassword = (nueva) => {
      setDatos((d) => ({ ...d, adminPassword: nueva }))
    }

    // ---- Autenticación ----
    const validarAdmin = (password) => password === datos.adminPassword
    const validarNegocio = (usuario, password) =>
      datos.restaurantes.find(
        (r) => r.usuario === usuario && r.password === password
      ) || null

    const reiniciarDatos = () => {
      setDatos({
        restaurantes: RESTAURANTES_EJEMPLO,
        solicitudes: SOLICITUDES_EJEMPLO,
        adminPassword: ADMIN_PASSWORD_DEFECTO,
      })
    }

    return {
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
      reiniciarDatos,
    }
  }, [datos])

  const valor = {
    restaurantes: datos.restaurantes,
    solicitudes: datos.solicitudes,
    adminPassword: datos.adminPassword,
    categorias: CATEGORIAS,
    ...acciones,
  }

  return <TiendaContext.Provider value={valor}>{children}</TiendaContext.Provider>
}

export function useTienda() {
  const ctx = useContext(TiendaContext)
  if (!ctx) throw new Error('useTienda debe usarse dentro de TiendaProvider')
  return ctx
}
