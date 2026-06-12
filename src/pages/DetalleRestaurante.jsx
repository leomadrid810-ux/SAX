import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTienda } from '../store/tienda'
import ImagenSegura from '../components/ImagenSegura'
import BadgeAbierto from '../components/BadgeAbierto'
import ModalAyuda from '../components/ModalAyuda'
import {
  IconoFlecha,
  IconoWhatsApp,
  IconoReloj,
  IconoAyuda,
  IconoUbicacion,
  IconoComoLlegar,
  IconoFacebook,
  IconoInstagram,
  IconoTikTok,
  IconoGlobo,
  IconoBuscar,
  IconoCerrar,
} from '../components/Iconos'
import {
  precio,
  enlaceWhatsApp,
  enlaceMaps,
  enlaceSocial,
  tituloMenu,
  categoriasDe,
  esNuevo,
  DIAS_NOMBRE,
  ORDEN_DIAS,
  estaAbiertoEfectivo,
} from '../utils/helpers'

export default function DetalleRestaurante() {
  const { id } = useParams()
  const { restaurantes, categorias, cargando } = useTienda()
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const [verHorario, setVerHorario] = useState(false)
  const [productoSel, setProductoSel] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const rest = restaurantes.find((r) => r.id === id)

  if (!rest && cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Cargando…
      </div>
    )
  }

  if (!rest) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">😕</span>
        <p className="text-lg font-bold text-marca-texto">Restaurante no encontrado</p>
        <Link to="/" className="btn-primario">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const busquedaNorm = busqueda.trim().toLowerCase()
  const menuFiltrado = busquedaNorm
    ? (rest.menu || [])
        .map((sec) => ({
          ...sec,
          productos: sec.productos.filter(
            (p) =>
              p.nombre.toLowerCase().includes(busquedaNorm) ||
              (p.descripcion || '').toLowerCase().includes(busquedaNorm)
          ),
        }))
        .filter((sec) => sec.productos.length > 0)
    : rest.menu || []
  const sinResultados = busquedaNorm.length > 0 && menuFiltrado.length === 0

  const cats = categoriasDe(rest)
    .map((cid) => categorias.find((c) => c.id === cid))
    .filter(Boolean)
  const emoji = cats[0]?.icono || '🍽️'
  const abierto = estaAbiertoEfectivo(rest)
  const nuevo = esNuevo(rest.creado)
  const mensajeWa = `Hola ${rest.nombre}, los contacto desde SAX. Quisiera hacer un pedido.`

  return (
    <div className="animar-pagina min-h-screen bg-white pb-44">
      {/* Imagen de portada */}
      <div className="relative">
        <ImagenSegura
          src={rest.foto}
          alt={rest.nombre}
          emoji={emoji}
          className="h-56 w-full object-cover sm:h-72"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Link
          to="/"
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-marca-texto shadow active:scale-95"
          aria-label="Volver"
        >
          <IconoFlecha />
        </Link>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="mb-2 flex items-center gap-2">
            <BadgeAbierto restaurante={rest} className="shadow" />
            {nuevo && (
              <span className="rounded-full bg-marca-rojo px-3 py-1 text-sm font-extrabold text-white shadow">
                ✨ Nuevo
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-white drop-shadow">{rest.nombre}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4">
        {/* Info */}
        <div className="-mt-2 pt-4">
          {/* Todas las categorías */}
          {cats.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cats.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-marca-naranja"
                >
                  <span>{c.icono}</span> {c.nombre}
                </span>
              ))}
            </div>
          )}

          {/* Redes sociales */}
          {(rest.facebook || rest.instagram || rest.tiktok || rest.sitio_web) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {rest.facebook && (
                <a
                  href={enlaceSocial('facebook', rest.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 active:scale-95 transition-all"
                >
                  <IconoFacebook width={18} height={18} /> Facebook
                </a>
              )}
              {rest.instagram && (
                <a
                  href={enlaceSocial('instagram', rest.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl bg-pink-50 px-4 py-2 text-sm font-bold text-pink-600 active:scale-95 transition-all"
                >
                  <IconoInstagram width={18} height={18} /> Instagram
                </a>
              )}
              {rest.tiktok && (
                <a
                  href={enlaceSocial('tiktok', rest.tiktok)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-800 active:scale-95 transition-all"
                >
                  <IconoTikTok width={18} height={18} /> TikTok
                </a>
              )}
              {rest.sitio_web && (
                <a
                  href={enlaceSocial('sitio_web', rest.sitio_web)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl bg-orange-50 px-4 py-2 text-sm font-bold text-marca-naranja active:scale-95 transition-all"
                >
                  <IconoGlobo width={18} height={18} /> Sitio web
                </a>
              )}
            </div>
          )}

          {/* Presentación del negocio */}
          <p className="mt-3 text-gray-600">{rest.descripcion}</p>

          {/* Delivery */}
          {rest.delivery && (
            <div className={`mt-3 flex items-center gap-3 rounded-2xl border p-3 ${
              rest.delivery === 'no'
                ? 'border-gray-100 bg-gray-50'
                : 'border-green-100 bg-green-50'
            }`}>
              <span className="shrink-0 text-xl">🛵</span>
              <span className={`text-sm font-bold ${rest.delivery === 'no' ? 'text-gray-500' : 'text-green-700'}`}>
                {rest.delivery === 'no'  && 'Sin servicio a domicilio'}
                {rest.delivery === 'si'  && 'Servicio a domicilio disponible'}
                {rest.delivery === 'minimo' && `Delivery desde $${rest.delivery_minimo ?? 0}`}
              </span>
            </div>
          )}

          {/* Dirección */}
          {rest.direccion && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-marca-tarjeta border border-gray-100 p-4">
              <IconoUbicacion width={22} height={22} className="mt-0.5 shrink-0 text-marca-rojo" />
              <div className="flex-1">
                <p className="font-bold text-marca-texto">Dirección</p>
                <p className="text-sm text-gray-600">{rest.direccion}</p>
              </div>
            </div>
          )}

          {/* Acciones: Cómo llegar y WhatsApp */}
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {rest.direccion && (
              <a
                href={enlaceMaps(rest.direccion)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primario w-full"
              >
                <IconoComoLlegar width={20} height={20} /> Cómo llegar
              </a>
            )}
            {rest.whatsapp && (
              <a
                href={enlaceWhatsApp(rest.whatsapp, mensajeWa)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full"
              >
                <IconoWhatsApp width={20} height={20} /> WhatsApp
              </a>
            )}
          </div>

          {/* Horario desplegable */}
          <button
            onClick={() => setVerHorario((v) => !v)}
            className="mt-4 flex w-full items-center justify-between rounded-2xl bg-marca-tarjeta border border-gray-100 px-4 py-3 text-left"
          >
            <span className="flex items-center gap-2 font-bold text-marca-texto">
              <IconoReloj width={20} height={20} />
              {abierto ? 'Abierto ahora' : 'Cerrado ahora'}
            </span>
            <span className="text-sm font-semibold text-marca-naranja">
              {verHorario ? 'Ocultar' : 'Ver horario'}
            </span>
          </button>
          {verHorario && (
            <div className="mt-2 rounded-2xl border border-gray-100 bg-white p-2">
              {ORDEN_DIAS.map((d) => {
                const h = rest.horario?.[d]
                return (
                  <div
                    key={d}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span className="font-semibold text-marca-texto">
                      {DIAS_NOMBRE[d]}
                    </span>
                    <span className="text-gray-600">
                      {h && h.abierto ? `${h.apertura} - ${h.cierre}` : 'Cerrado'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Menú / Servicios / Productos según categoría */}
        <h2 className="mb-3 mt-8 text-xl font-black text-marca-texto">
          {tituloMenu(categoriasDe(rest))}
        </h2>

        {/* Buscador dentro del menú */}
        {rest.menu?.length > 0 && (
          <div className="relative mb-5">
            <IconoBuscar
              width={18}
              height={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="campo pl-9 pr-9"
              placeholder="Buscar en el menú..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <IconoCerrar width={16} height={16} />
              </button>
            )}
          </div>
        )}

        {(!rest.menu || rest.menu.length === 0) && (
          <p className="py-6 text-center text-gray-500">
            Este negocio aún no tiene productos en su menú.
          </p>
        )}

        {sinResultados ? (
          <p className="py-8 text-center text-gray-500">
            No encontramos ese producto 🔍
          </p>
        ) : (
          <div className="space-y-7">
            {menuFiltrado.map((seccion) => (
              <section key={seccion.id}>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-marca-texto">
                  <span className="h-5 w-1.5 rounded-full bg-marca-naranja" />
                  {seccion.nombre}
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
                  {seccion.productos.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProductoSel(p)}
                      className="snap-start shrink-0 w-36 flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm text-left transition-transform active:scale-95"
                    >
                      <ImagenSegura
                        src={p.foto}
                        alt={p.nombre}
                        emoji={emoji}
                        className="h-28 w-full shrink-0 object-cover"
                      />
                      <div className="p-2.5">
                        <p className="text-sm font-bold text-marca-texto line-clamp-2 leading-tight">
                          {p.nombre}
                        </p>
                        <p className="mt-1 text-sm font-black text-marca-naranja">
                          {precio(p.precio)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Botón de ayuda */}
        <div className="mt-8">
          <button onClick={() => setMostrarAyuda(true)} className="btn-suave w-full">
            <IconoAyuda width={20} height={20} /> ¿Cómo usar la app?
          </button>
        </div>
      </div>

      {/* Barra fija de WhatsApp — se posa encima de la NavBar (bottom-16) */}
      <div className="fixed inset-x-0 z-30 border-t border-gray-100 bg-white/95 px-4 py-3 backdrop-blur" style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
        <div className="mx-auto max-w-3xl">
          <a
            href={enlaceWhatsApp(rest.whatsapp, mensajeWa)}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full text-lg ${abierto ? 'btn-whatsapp' : 'btn bg-gray-500 text-white hover:brightness-95'}`}
          >
            <IconoWhatsApp width={24} height={24} />
            {abierto ? 'Contactar por WhatsApp' : 'Enviar mensaje (cerrado ahora)'}
          </a>
        </div>
      </div>

      {mostrarAyuda && <ModalAyuda onCerrar={() => setMostrarAyuda(false)} />}

      {productoSel && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
          onClick={() => setProductoSel(null)}
        >
          <div
            className="w-full sm:max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <ImagenSegura
                src={productoSel.foto}
                alt={productoSel.nombre}
                emoji={emoji}
                className="h-[45vh] w-full object-cover"
              />
              <button
                onClick={() => setProductoSel(null)}
                aria-label="Cerrar"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white active:scale-95"
              >
                <IconoCerrar width={20} height={20} />
              </button>
            </div>
            <div className="space-y-2 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-black text-marca-texto">{productoSel.nombre}</h3>
                <span className="shrink-0 text-2xl font-black text-marca-naranja">
                  {precio(productoSel.precio)}
                </span>
              </div>
              {productoSel.descripcion && (
                <p className="text-gray-600">{productoSel.descripcion}</p>
              )}
              <button
                onClick={() => setProductoSel(null)}
                className="btn-suave mt-2 w-full"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
