import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTienda } from '../../store/tienda'
import { sesionNegocio } from '../../store/sesion'
import EditorRestaurante from '../../components/EditorRestaurante'
import BadgeAbierto from '../../components/BadgeAbierto'
import { IconoSalir, IconoOjo, IconoReloj, IconoCheck } from '../../components/Iconos'
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
  } = useTienda()
  const navigate = useNavigate()

  const id = sesionNegocio.restauranteId()
  const rest = restaurantes.find((r) => r.id === id)

  const salir = () => {
    sesionNegocio.cerrar()
    navigate('/negocio/login', { replace: true })
  }

  // Mientras carga desde la nube
  if (!rest && cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Cargando tu negocio…
      </div>
    )
  }

  // Si la cuenta ya no existe (ej. eliminada por admin)
  if (!rest) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">😕</span>
        <p className="text-lg font-bold text-marca-texto">
          No encontramos tu restaurante.
        </p>
        <button onClick={salir} className="btn-primario">
          Volver a iniciar sesión
        </button>
      </div>
    )
  }

  const guardar = async (datos) => {
    // El dueño no puede cambiar su usuario/contraseña ni el estado activo desde aquí:
    // se conservan los valores actuales.
    const { usuario, password, activo, ...editable } = datos
    const ok = await actualizarRestaurante(rest.id, editable)
    if (ok) alert('¡Cambios guardados!')
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black text-marca-texto">{rest.nombre}</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-gray-500">Tu panel de negocio</p>
              <BadgeAbierto restaurante={rest} className="px-2 py-0 text-xs" />
            </div>
          </div>
          <button onClick={salir} className="btn-suave py-2 text-sm">
            <IconoSalir width={18} height={18} /> Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        {!rest.activo && (
          <div className="mb-4 rounded-2xl bg-orange-50 border border-orange-200 p-3 text-sm text-marca-naranja">
            Tu restaurante está <strong>inactivo</strong> y no se muestra al público.
            Contacta al administrador para activarlo.
          </div>
        )}

        {/* Control manual de estado (prioridad sobre el horario) */}
        <ControlEstado
          rest={rest}
          fijarEstadoManual={fijarEstadoManual}
          usarHorarioAutomatico={usarHorarioAutomatico}
        />

        <div className="mb-4 mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Edita tus datos y tu menú. Los cambios se ven al instante.
          </p>
          <Link
            to={`/restaurante/${rest.id}`}
            target="_blank"
            className="btn-suave py-2 text-sm"
          >
            <IconoOjo width={18} height={18} /> Ver mi página
          </Link>
        </div>

        <EditorRestaurante
          restaurante={rest}
          permitirCredenciales={false}
          onGuardar={guardar}
          onCancelar={() => navigate('/')}
        />
      </main>
    </div>
  )
}

// Tarjeta grande para abrir/cerrar el negocio manualmente desde el celular.
function ControlEstado({ rest, fijarEstadoManual, usarHorarioAutomatico }) {
  const abierto = estaAbiertoEfectivo(rest)
  const manual = hayOverrideHoy(rest)

  return (
    <div
      className={`rounded-3xl border-2 p-5 transition ${
        abierto
          ? 'border-green-200 bg-green-50'
          : 'border-red-200 bg-red-50'
      }`}
    >
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`h-3.5 w-3.5 rounded-full ${
            abierto ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <p className="text-lg font-black text-marca-texto">
          {abierto ? 'Estás abierto' : 'Estás cerrado'}
        </p>
      </div>

      <p className="mb-1 flex items-center gap-1.5 text-sm text-gray-600">
        <IconoReloj width={16} height={16} />
        {horarioDeHoy(rest.horario)}
      </p>
      <p className="mb-4 text-sm text-gray-500">
        {manual ? (
          <>
            Estado <strong>manual</strong> activado por ti para hoy. Tiene prioridad
            sobre tu horario. Mañana volverá a tu horario automático.
          </>
        ) : (
          <>Tu estado se calcula con tu horario. Puedes cambiarlo manualmente cuando quieras.</>
        )}
      </p>

      {/* Botón grande para cambiar el estado */}
      {abierto ? (
        <button
          onClick={() => fijarEstadoManual(rest.id, 'cerrado')}
          className="btn-secundario w-full text-lg"
        >
          🔴 Cerré por hoy
        </button>
      ) : (
        <button
          onClick={() => fijarEstadoManual(rest.id, 'abierto')}
          className="btn w-full bg-green-600 text-lg text-white hover:brightness-95"
        >
          🟢 Estoy abierto ahora
        </button>
      )}

      {manual && (
        <button
          onClick={() => usarHorarioAutomatico(rest.id)}
          className="btn-suave mt-2 w-full text-sm"
        >
          <IconoCheck width={18} height={18} /> Usar mi horario automático
        </button>
      )}
    </div>
  )
}
