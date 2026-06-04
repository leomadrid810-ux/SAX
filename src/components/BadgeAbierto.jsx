import { estaAbiertoEfectivo, hayOverrideHoy } from '../utils/helpers'

// Etiqueta de "Abierto" / "Cerrado" según el estado REAL del negocio:
// el control manual del dueño tiene prioridad sobre el horario programado.
export default function BadgeAbierto({ restaurante, className = '' }) {
  const abierto = estaAbiertoEfectivo(restaurante)
  const manual = hayOverrideHoy(restaurante)
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
        abierto ? 'bg-green-100 text-green-700' : 'bg-red-100 text-marca-rojo'
      } ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${abierto ? 'bg-green-500' : 'bg-red-500'}`}
      />
      {abierto ? 'Abierto ahora' : 'Cerrado'}
      {manual && <span className="opacity-70">· manual</span>}
    </span>
  )
}
