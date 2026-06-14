import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTienda } from '../../store/tienda'
import { sesionNegocio } from '../../store/sesion'
import EditorRestaurante from '../../components/EditorRestaurante'
import BadgeAbierto from '../../components/BadgeAbierto'
import TutorialNegocio from '../../components/TutorialNegocio'
import { IconoSalir, IconoOjo, IconoOjoCerrado, IconoReloj, IconoCheck, IconoCandado } from '../../components/Iconos'
import {
  estaAbiertoEfectivo,
  hayOverrideHoy,
  horarioDeHoy,
} from '../../utils/helpers'

export default function NegocioPanel() {
  const {
    restaurantes,
    cargando,
    actualizarRestaurante,
    fijarEstadoManual,
    usarHorarioAutomatico,
    cambiarPasswordNegocio,
  } = useTienda()
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)

  const id = sesionNegocio.restauranteId()
  const rest = restaurantes.find((r) => r.id === id)

  const salir = () => {
    sesionNegocio.cerrar()
    navigate('/negocio/login', { replace: true })
  }

  const mostrarToast = (tipo, texto) => {
    setToast({ tipo, texto })
    setTimeout(() => setToast(null), 5000)
  }

  if (!rest && cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center px-6">
          <p className="text-2xl font-bold text-gray-600">Cargando tu negocio…</p>
          <p className="mt-2 text-gray-400">Por favor espera un momento</p>
        </div>
      </div>
    )
  }

  if (!rest) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="text-6xl">😕</span>
        <p className="text-xl font-bold text-marca-texto">
          No encontramos tu restaurante.
        </p>
        <p className="text-gray-500">
          Puede que tu cuenta haya sido desactivada. Contacta al administrador.
        </p>
        <button onClick={salir} className="btn-primario px-8 py-4 text-lg">
          Volver a iniciar sesión
        </button>
      </div>
    )
  }

  const guardar = async (datos) => {
    const { usuario, password, activo, ...editable } = datos
    const ok = await actualizarRestaurante(rest.id, editable)
    if (ok) {
      mostrarToast('ok', '¡Sus datos se guardaron correctamente!')
    } else {
      mostrarToast('error', 'No se pudo guardar. Revisa tu conexión e intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Toast de éxito / error */}
      {toast && (
        <div
          className={`fixed left-4 right-4 top-4 z-50 rounded-2xl px-5 py-4 text-center text-lg font-bold shadow-2xl ${
            toast.tipo === 'ok' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.tipo === 'ok' ? '✅ ' : '❌ '}
          {toast.texto}
        </div>
      )}

      {/* Encabezado */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black text-marca-texto">{rest.nombre}</h1>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-500">Mi panel de negocio</p>
              <BadgeAbierto restaurante={rest} className="px-2 py-0 text-xs" />
            </div>
          </div>
          <button onClick={salir} className="btn-suave px-4 py-3">
            <IconoSalir width={20} height={20} /> Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 pt-5">
        {/* Aviso negocio inactivo */}
        {!rest.activo && (
          <div className="rounded-2xl border-2 border-orange-300 bg-orange-50 p-4">
            <p className="text-base font-bold text-orange-800">
              ⚠️ Tu negocio no es visible para los clientes
            </p>
            <p className="mt-1 text-sm text-orange-700">
              Tu restaurante está inactivo. Por favor contacta al administrador para que lo active.
            </p>
          </div>
        )}

        {/* Control de estado abierto / cerrado */}
        <ControlEstado
          rest={rest}
          fijarEstadoManual={fijarEstadoManual}
          usarHorarioAutomatico={usarHorarioAutomatico}
        />

        <TutorialNegocio />

        {/* Ver mi página */}
        <Link
          to={`/restaurante/${rest.id}`}
          target="_blank"
          className="btn-suave w-full py-4 text-base"
        >
          <IconoOjo width={20} height={20} /> Ver cómo me ven los clientes
        </Link>

        {/* Cambiar contraseña */}
        <CambiarContrasena
          negocioId={rest.id}
          usuario={rest.usuario}
          mostrarToast={mostrarToast}
          cambiarPasswordNegocio={cambiarPasswordNegocio}
        />

        {/* Editor de datos y menú */}
        <div className="rounded-2xl bg-white shadow-sm">
          <EditorRestaurante
            restaurante={rest}
            permitirCredenciales={false}
            modoSimple={true}
            onGuardar={guardar}
            onCancelar={() => navigate('/')}
          />
        </div>
      </main>
    </div>
  )
}

function CambiarContrasena({ negocioId, usuario, mostrarToast, cambiarPasswordNegocio }) {
  const [abierto, setAbierto] = useState(false)
  const [form, setForm] = useState({ actual: '', nueva: '', confirmar: '' })
  const [verActual, setVerActual] = useState(false)
  const [verNueva, setVerNueva] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errorLocal, setErrorLocal] = useState('')

  const cambiar = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErrorLocal('')
  }

  const cerrar = () => {
    setAbierto(false)
    setForm({ actual: '', nueva: '', confirmar: '' })
    setVerActual(false)
    setVerNueva(false)
    setErrorLocal('')
  }

  const guardar = async (e) => {
    e.preventDefault()
    if (!form.actual) { setErrorLocal('Escribe tu contraseña actual.'); return }
    if (!form.nueva || form.nueva.length < 4) { setErrorLocal('La nueva contraseña debe tener al menos 4 caracteres.'); return }
    if (form.nueva !== form.confirmar) { setErrorLocal('Las contraseñas nuevas no coinciden.'); return }
    setGuardando(true)
    const resultado = await cambiarPasswordNegocio(negocioId, usuario, form.actual, form.nueva)
    setGuardando(false)
    if (resultado.ok) {
      cerrar()
      mostrarToast('ok', '¡Su contraseña se cambió correctamente!')
    } else if (resultado.error === 'credenciales') {
      setErrorLocal('La contraseña actual es incorrecta. Verifícala e intenta de nuevo.')
    } else {
      setErrorLocal('No se pudo cambiar. Revisa tu conexión e inténtalo de nuevo.')
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <button
        onClick={() => (abierto ? cerrar() : setAbierto(true))}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <IconoCandado width={22} height={22} className="text-gray-500" />
          <span className="text-base font-bold text-marca-texto">Cambiar contraseña</span>
        </div>
        <span className="text-lg text-gray-400">{abierto ? '▲' : '▼'}</span>
      </button>

      {abierto && (
        <div className="border-t border-gray-100 px-5 pb-6 pt-4">
          <p className="mb-5 text-sm text-gray-500">
            Escribe tu contraseña actual y luego la nueva para confirmar el cambio.
          </p>
          <form onSubmit={guardar} className="space-y-4">
            <div>
              <label className="etiqueta">Contraseña actual</label>
              <div className="relative">
                <input
                  type={verActual ? 'text' : 'password'}
                  className="campo pr-14"
                  value={form.actual}
                  onChange={(e) => cambiar('actual', e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setVerActual((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400"
                  tabIndex={-1}
                  aria-label={verActual ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {verActual
                    ? <IconoOjoCerrado width={22} height={22} />
                    : <IconoOjo width={22} height={22} />}
                </button>
              </div>
            </div>

            <div>
              <label className="etiqueta">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={verNueva ? 'text' : 'password'}
                  className="campo pr-14"
                  value={form.nueva}
                  onChange={(e) => cambiar('nueva', e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setVerNueva((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400"
                  tabIndex={-1}
                  aria-label={verNueva ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {verNueva
                    ? <IconoOjoCerrado width={22} height={22} />
                    : <IconoOjo width={22} height={22} />}
                </button>
              </div>
            </div>

            <div>
              <label className="etiqueta">Confirmar nueva contraseña</label>
              <input
                type={verNueva ? 'text' : 'password'}
                className="campo"
                value={form.confirmar}
                onChange={(e) => cambiar('confirmar', e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {errorLocal && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                ⚠️ {errorLocal}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={cerrar} className="btn-suave flex-1 py-4 text-base">
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primario flex-1 py-4 text-base"
                disabled={guardando}
              >
                {guardando ? 'Guardando…' : 'Cambiar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function ControlEstado({ rest, fijarEstadoManual, usarHorarioAutomatico }) {
  const abierto = estaAbiertoEfectivo(rest)
  const manual = hayOverrideHoy(rest)

  return (
    <div
      className={`rounded-3xl border-2 p-5 ${
        abierto ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      }`}
    >
      <div className="mb-2 flex items-center gap-3">
        <span
          className={`h-4 w-4 rounded-full ${abierto ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <p className="text-xl font-black text-marca-texto">
          {abierto ? 'Ahora estás ABIERTO' : 'Ahora estás CERRADO'}
        </p>
      </div>

      <p className="mb-1 flex items-center gap-2 text-sm text-gray-600">
        <IconoReloj width={16} height={16} />
        Horario de hoy: {horarioDeHoy(rest.horario)}
      </p>

      <p className="mb-5 text-sm text-gray-500">
        {manual
          ? 'Cambiaste tu estado manualmente. Mañana volverá a tu horario normal.'
          : 'Tu estado cambia solo según tu horario. Puedes cambiarlo aquí cuando quieras.'}
      </p>

      {abierto ? (
        <button
          onClick={() => fijarEstadoManual(rest.id, 'cerrado')}
          className="btn-secundario w-full py-4 text-lg"
        >
          🔴 Cerré por hoy
        </button>
      ) : (
        <button
          onClick={() => fijarEstadoManual(rest.id, 'abierto')}
          className="btn w-full bg-green-600 py-4 text-lg text-white hover:brightness-95"
        >
          🟢 Estoy abierto ahora
        </button>
      )}

      {manual && (
        <button
          onClick={() => usarHorarioAutomatico(rest.id)}
          className="btn-suave mt-3 w-full py-3"
        >
          <IconoCheck width={18} height={18} /> Volver a mi horario automático
        </button>
      )}
    </div>
  )
}
