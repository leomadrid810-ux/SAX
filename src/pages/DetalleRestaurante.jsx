import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTienda } from '../store/tienda'
import ImagenSegura from '../components/ImagenSegura'
import BadgeAbierto from '../components/BadgeAbierto'
import ModalAyuda from '../components/ModalAyuda'
import Modal from '../components/Modal'
import {
  IconoFlecha,
  IconoWhatsApp,
  IconoReloj,
  IconoAyuda,
  IconoUbicacion,
  IconoTelefono,
  IconoComoLlegar,
} from '../components/Iconos'
import {
  precio,
  enlaceWhatsApp,
  enlaceTelefono,
  enlaceMaps,
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

          {/* Presentación del negocio */}
          <p className="mt-3 text-gray-600">{rest.descripcion}</p>

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

          {/* Acciones: Cómo llegar y Llamar */}
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
            {rest.telefono && (
              <a href={enlaceTelefono(rest.telefono)} className="btn-suave w-full">
                <IconoTelefono width={20} height={20} /> Llamar
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

        {/* Menú */}
        <h2 className="mb-1 mt-8 text-xl font-black text-marca-texto">Menú</h2>
        {(!rest.menu || rest.menu.length === 0) && (
          <p className="py-6 text-center text-gray-500">
            Este restaurante aún no tiene productos en su menú.
          </p>
        )}

        <div className="space-y-7">
          {rest.menu?.map((seccion) => (
            <section key={seccion.id}>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-marca-texto">
                <span className="h-5 w-1.5 rounded-full bg-marca-naranja" />
                {seccion.nombre}
              </h3>
              <div className="space-y-3">
                {seccion.productos.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProductoSel(p)}
                    className="tarjeta flex w-full items-center gap-3 p-3 text-left transition hover:shadow-md active:scale-[0.99]"
                  >
                    <ImagenSegura
                      src={p.foto}
                      alt={p.nombre}
                      emoji={emoji}
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-marca-texto">{p.nombre}</h4>
                        <span className="shrink-0 font-black text-marca-naranja">
                          {precio(p.precio)}
                        </span>
                      </div>
                      {p.descripcion && (
                        <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">
                          {p.descripcion}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

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

      {/* Popup con el detalle del producto */}
      {productoSel && (
        <Modal titulo={productoSel.nombre} onCerrar={() => setProductoSel(null)}>
          <div className="space-y-4">
            <ImagenSegura
              src={productoSel.foto}
              alt={productoSel.nombre}
              emoji={emoji}
              className="h-60 w-full rounded-2xl object-cover"
            />
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-black text-marca-texto">
                {productoSel.nombre}
              </h3>
              <span className="shrink-0 text-2xl font-black text-marca-naranja">
                {precio(productoSel.precio)}
              </span>
            </div>
            {productoSel.descripcion && (
              <p className="text-gray-600">{productoSel.descripcion}</p>
            )}
            <button
              onClick={() => setProductoSel(null)}
              className="btn-suave w-full"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
