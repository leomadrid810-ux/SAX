import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTienda } from '../store/tienda'
import TarjetaRestaurante from '../components/TarjetaRestaurante'
import BarraFiltros from '../components/BarraFiltros'
import ModalAyuda from '../components/ModalAyuda'
import ModalContacto from '../components/ModalContacto'
import { IconoBuscar, IconoAyuda, IconoSobre, IconoCandado, IconoTienda } from '../components/Iconos'
import { estaAbiertoEfectivo, categoriasDe } from '../utils/helpers'

export default function Inicio() {
  const { restaurantes, categorias, cargando, error } = useTienda()
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const [mostrarContacto, setMostrarContacto] = useState(false)
  const refBusqueda = useRef(null)

  useEffect(() => {
    const enfocar = () => {
      refBusqueda.current?.focus()
      refBusqueda.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    window.addEventListener('enfocar-busqueda', enfocar)
    return () => window.removeEventListener('enfocar-busqueda', enfocar)
  }, [])

  // Solo restaurantes activos para el público
  const activos = useMemo(
    () => restaurantes.filter((r) => r.activo),
    [restaurantes]
  )

  // Conteo por categoría y por "abierto ahora" (para los chips)
  const conteos = useMemo(() => {
    const c = {
      todas: activos.length,
      abierto: activos.filter((r) => estaAbiertoEfectivo(r)).length,
    }
    categorias.forEach((cat) => {
      c[cat.id] = activos.filter((r) => categoriasDe(r).includes(cat.id)).length
    })
    return c
  }, [activos, categorias])

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return activos.filter((r) => {
      let coincideCat = true
      if (categoria === 'abierto') {
        coincideCat = estaAbiertoEfectivo(r)
      } else if (categoria !== 'todas') {
        coincideCat = categoriasDe(r).includes(categoria)
      }
      const coincideTexto = !texto || r.nombre.toLowerCase().includes(texto)
      return coincideCat && coincideTexto
    })
  }, [activos, busqueda, categoria])

  // Mostrar solo categorías que tienen al menos un restaurante
  const categoriasConDatos = categorias.filter((c) => conteos[c.id] > 0)

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Encabezado */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-4 pt-4 pb-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <img src="/sax_logo.png" alt="SAX" className="h-11 w-auto" />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMostrarAyuda(true)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-marca-tarjeta text-marca-naranja border border-gray-200 active:scale-95"
                aria-label="Ayuda"
                title="¿Cómo usar la app?"
              >
                <IconoAyuda />
              </button>
              <button
                onClick={() => setMostrarContacto(true)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-marca-tarjeta text-marca-rojo border border-gray-200 active:scale-95"
                aria-label="Contacto"
                title="Unir mi negocio"
              >
                <IconoSobre />
              </button>
              <Link
                to="/negocio/login"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-marca-tarjeta text-marca-texto border border-gray-200 active:scale-95"
                aria-label="Acceso negocios"
                title="Acceso para negocios"
              >
                <IconoTienda />
              </Link>
            </div>
          </div>

          {/* Buscador */}
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <IconoBuscar width={20} height={20} />
            </span>
            <input
              ref={refBusqueda}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar negocio por nombre..."
              className="campo pl-11"
              type="search"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="mx-auto max-w-3xl px-4 pb-3">
          <BarraFiltros
            categorias={categoriasConDatos}
            seleccionada={categoria}
            onSeleccionar={setCategoria}
            conteos={conteos}
          />
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-3xl px-4 pt-4">
        {error === 'config' ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
            <span className="text-5xl">🔌</span>
            <p className="font-bold text-marca-texto">Base de datos no configurada</p>
            <p className="text-sm">
              Falta conectar Supabase. Agrega las variables{' '}
              <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>.
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
            <span className="text-5xl">⚠️</span>
            <p className="font-bold text-marca-texto">No se pudieron cargar los negocios</p>
            <p className="text-sm">Revisa tu conexión e inténtalo de nuevo.</p>
          </div>
        ) : cargando && restaurantes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
            <span className="text-4xl animate-pulse">🍴</span>
            <p className="font-bold text-marca-texto">Cargando negocios…</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
            <span className="text-5xl">🍽️</span>
            <p className="font-bold text-marca-texto">No encontramos negocios</p>
            <p className="text-sm">Prueba con otra categoría o cambia tu búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtrados.map((r) => (
              <TarjetaRestaurante key={r.id} restaurante={r} />
            ))}
          </div>
        )}

        {/* Botones grandes de ayuda y contacto */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button onClick={() => setMostrarAyuda(true)} className="btn-suave w-full">
            <IconoAyuda width={20} height={20} /> ¿Cómo usar la app?
          </button>
          <button
            onClick={() => setMostrarContacto(true)}
            className="btn-secundario w-full"
          >
            <IconoSobre width={20} height={20} /> Unir mi negocio
          </button>
        </div>

        {/* Accesos a paneles */}
        <footer className="mt-10 border-t border-gray-100 pt-6 text-center">
          <p className="mb-3 text-sm font-semibold text-gray-400">Accesos</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link to="/negocio/login" className="btn-suave text-sm">
              <IconoTienda width={18} height={18} /> Soy un negocio
            </Link>
            <Link to="/admin/login" className="btn-suave text-sm">
              <IconoCandado width={18} height={18} /> Administrador
            </Link>
          </div>
          <p className="mt-6 text-xs text-gray-400">
            SAX · Directorio de restaurantes locales
          </p>
        </footer>
      </main>

      {mostrarAyuda && <ModalAyuda onCerrar={() => setMostrarAyuda(false)} />}
      {mostrarContacto && <ModalContacto onCerrar={() => setMostrarContacto(false)} />}
    </div>
  )
}
