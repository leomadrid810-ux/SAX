import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTienda } from '../../store/tienda'
import { sesionAdmin } from '../../store/sesion'
import Modal from '../../components/Modal'
import EditorRestaurante from '../../components/EditorRestaurante'
import ImagenSegura from '../../components/ImagenSegura'
import {
  IconoSalir,
  IconoMas,
  IconoLapiz,
  IconoBasura,
  IconoWhatsApp,
  IconoOjo,
  IconoOjoCerrado,
  IconoCheck,
} from '../../components/Iconos'
import { enlaceWhatsApp, horarioVacio, categoriasDe } from '../../utils/helpers'

export default function AdminPanel() {
  const {
    restaurantes,
    solicitudes,
    categorias,
    adminPassword,
    agregarRestaurante,
    actualizarRestaurante,
    eliminarRestaurante,
    alternarActivo,
    actualizarSolicitud,
    eliminarSolicitud,
    cambiarAdminPassword,
    reiniciarDatos,
  } = useTienda()
  const navigate = useNavigate()

  const [pestana, setPestana] = useState('restaurantes')
  const [editando, setEditando] = useState(null) // restaurante o {nuevo:true}

  const salir = () => {
    sesionAdmin.cerrar()
    navigate('/admin/login', { replace: true })
  }

  const guardar = (datos) => {
    if (editando?.nuevo) {
      agregarRestaurante(datos)
    } else {
      actualizarRestaurante(editando.id, datos)
    }
    setEditando(null)
  }

  const nombresCats = (r) =>
    categoriasDe(r)
      .map((id) => categorias.find((c) => c.id === id)?.nombre || id)
      .join(' · ')
  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente').length

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Encabezado */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-black text-marca-texto">Administrador</h1>
            <p className="text-xs font-semibold text-gray-500">Panel de SAX</p>
          </div>
          <button onClick={salir} className="btn-suave py-2 text-sm">
            <IconoSalir width={18} height={18} /> Salir
          </button>
        </div>
        {/* Pestañas */}
        <div className="mx-auto flex max-w-3xl gap-1 px-4">
          {[
            ['restaurantes', 'Restaurantes'],
            ['solicitudes', `Solicitudes${pendientes ? ` (${pendientes})` : ''}`],
            ['ajustes', 'Ajustes'],
          ].map(([id, etiqueta]) => (
            <button
              key={id}
              onClick={() => setPestana(id)}
              className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-bold transition ${
                pestana === id
                  ? 'border-marca-naranja text-marca-naranja'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        {/* ---- RESTAURANTES ---- */}
        {pestana === 'restaurantes' && (
          <>
            <button
              onClick={() => setEditando({ nuevo: true, horario: horarioVacio() })}
              className="btn-primario mb-4 w-full"
            >
              <IconoMas width={20} height={20} /> Agregar restaurante
            </button>

            {restaurantes.length === 0 && (
              <p className="py-10 text-center text-gray-500">
                Aún no hay restaurantes. Agrega el primero.
              </p>
            )}

            <div className="space-y-3">
              {restaurantes.map((r) => (
                <div key={r.id} className="tarjeta flex items-center gap-3 p-3">
                  <ImagenSegura
                    src={r.foto}
                    alt={r.nombre}
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-extrabold text-marca-texto">
                        {r.nombre}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                          r.activo
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {r.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{nombresCats(r)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <button
                      onClick={() => setEditando(r)}
                      className="rounded-xl bg-marca-tarjeta border border-gray-200 p-2 text-marca-naranja"
                      aria-label="Editar"
                      title="Editar"
                    >
                      <IconoLapiz width={18} height={18} />
                    </button>
                    <button
                      onClick={() => alternarActivo(r.id)}
                      className="rounded-xl bg-marca-tarjeta border border-gray-200 p-2 text-gray-600"
                      aria-label={r.activo ? 'Desactivar' : 'Activar'}
                      title={r.activo ? 'Desactivar' : 'Activar'}
                    >
                      {r.activo ? (
                        <IconoOjoCerrado width={18} height={18} />
                      ) : (
                        <IconoOjo width={18} height={18} />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar "${r.nombre}"? Esta acción no se puede deshacer.`)) {
                          eliminarRestaurante(r.id)
                        }
                      }}
                      className="rounded-xl bg-marca-tarjeta border border-gray-200 p-2 text-marca-rojo"
                      aria-label="Eliminar"
                      title="Eliminar"
                    >
                      <IconoBasura width={18} height={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---- SOLICITUDES ---- */}
        {pestana === 'solicitudes' && (
          <div className="space-y-3">
            {solicitudes.length === 0 && (
              <p className="py-10 text-center text-gray-500">
                No hay solicitudes de negocios.
              </p>
            )}
            {solicitudes.map((s) => (
              <div key={s.id} className="tarjeta p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-marca-texto">{s.nombreNegocio}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                      s.estado === 'pendiente'
                        ? 'bg-orange-100 text-marca-naranja'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {s.estado === 'pendiente' ? 'Pendiente' : 'Atendida'}
                  </span>
                </div>
                {s.contacto && (
                  <p className="text-sm text-gray-600">Contacto: {s.contacto}</p>
                )}
                <p className="text-sm text-gray-600">WhatsApp: {s.whatsapp}</p>
                {s.fecha && <p className="text-xs text-gray-400">Fecha: {s.fecha}</p>}
                {s.mensaje && (
                  <p className="mt-2 rounded-xl bg-marca-tarjeta p-3 text-sm text-gray-700">
                    {s.mensaje}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={enlaceWhatsApp(
                      s.whatsapp,
                      `Hola ${s.contacto || ''}, te contactamos desde SAX sobre tu solicitud para ${s.nombreNegocio}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp py-2 text-sm"
                  >
                    <IconoWhatsApp width={18} height={18} /> Responder
                  </a>
                  {s.estado === 'pendiente' && (
                    <button
                      onClick={() => actualizarSolicitud(s.id, { estado: 'atendida' })}
                      className="btn-suave py-2 text-sm"
                    >
                      <IconoCheck width={18} height={18} /> Marcar atendida
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('¿Eliminar esta solicitud?')) eliminarSolicitud(s.id)
                    }}
                    className="btn-suave py-2 text-sm text-marca-rojo"
                  >
                    <IconoBasura width={18} height={18} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- AJUSTES ---- */}
        {pestana === 'ajustes' && (
          <Ajustes
            adminPassword={adminPassword}
            cambiarAdminPassword={cambiarAdminPassword}
            reiniciarDatos={reiniciarDatos}
          />
        )}
      </main>

      {/* Modal de edición / creación */}
      {editando && (
        <Modal
          titulo={editando.nuevo ? 'Nuevo restaurante' : 'Editar restaurante'}
          onCerrar={() => setEditando(null)}
        >
          <EditorRestaurante
            restaurante={editando.nuevo ? null : editando}
            permitirCredenciales
            onGuardar={guardar}
            onCancelar={() => setEditando(null)}
          />
        </Modal>
      )}
    </div>
  )
}

function Ajustes({ adminPassword, cambiarAdminPassword, reiniciarDatos }) {
  const [nueva, setNueva] = useState('')
  const [msg, setMsg] = useState('')

  return (
    <div className="space-y-4">
      <div className="tarjeta p-4">
        <h3 className="mb-2 font-black text-marca-texto">Cambiar contraseña de admin</h3>
        <div className="space-y-2">
          <input
            className="campo"
            type="text"
            placeholder="Nueva contraseña"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
          />
          <button
            onClick={() => {
              if (nueva.trim().length < 4) {
                setMsg('La contraseña debe tener al menos 4 caracteres.')
                return
              }
              cambiarAdminPassword(nueva.trim())
              setNueva('')
              setMsg('Contraseña actualizada correctamente.')
            }}
            className="btn-primario w-full"
          >
            Guardar contraseña
          </button>
          {msg && <p className="text-sm font-semibold text-green-600">{msg}</p>}
          <p className="text-xs text-gray-400">Contraseña actual: {adminPassword}</p>
        </div>
      </div>

      <div className="tarjeta p-4">
        <h3 className="mb-2 font-black text-marca-texto">Restablecer datos de ejemplo</h3>
        <p className="mb-3 text-sm text-gray-500">
          Borra todos los cambios y vuelve a los 3 restaurantes de ejemplo.
        </p>
        <button
          onClick={() => {
            if (confirm('¿Restablecer TODOS los datos a los de ejemplo? Se perderán los cambios.')) {
              reiniciarDatos()
            }
          }}
          className="btn-secundario w-full"
        >
          Restablecer datos
        </button>
      </div>
    </div>
  )
}
