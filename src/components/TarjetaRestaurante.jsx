import { Link } from 'react-router-dom'
import ImagenSegura from './ImagenSegura'
import BadgeAbierto from './BadgeAbierto'
import { IconoReloj, IconoUbicacion } from './Iconos'
import { horarioDeHoy, categoriasDe, esNuevo } from '../utils/helpers'
import { useTienda } from '../store/tienda'

export default function TarjetaRestaurante({ restaurante }) {
  const { categorias } = useTienda()
  const cats = categoriasDe(restaurante)
    .map((id) => categorias.find((c) => c.id === id))
    .filter(Boolean)
  const nuevo = esNuevo(restaurante.creado)

  return (
    <Link
      to={`/restaurante/${restaurante.id}`}
      className="tarjeta block transition-all duration-200 hover:shadow-xl active:scale-[0.97]"
    >
      {/* Imagen con gradiente inferior */}
      <div className="relative overflow-hidden">
        <ImagenSegura
          src={restaurante.foto}
          alt={restaurante.nombre}
          emoji={cats[0]?.icono || '🍽️'}
          className="h-48 w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <BadgeAbierto
          restaurante={restaurante}
          className="absolute left-3 top-3 shadow-md"
        />
        {nuevo && (
          <span className="absolute right-3 top-3 rounded-full bg-marca-rojo px-3 py-1 text-sm font-extrabold text-white shadow-md">
            ✨ Nuevo
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="mb-1.5 text-lg font-extrabold leading-tight text-marca-texto">
          {restaurante.nombre}
        </h3>

        {cats.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-marca-naranja"
              >
                <span>{c.icono}</span> {c.nombre}
              </span>
            ))}
          </div>
        )}

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {restaurante.descripcion}
        </p>

        <div className="mt-3 space-y-1">
          {restaurante.direccion && (
            <div className="flex items-start gap-1.5 text-sm text-gray-500">
              <IconoUbicacion width={14} height={14} className="mt-0.5 shrink-0 text-marca-rojo" />
              <span className="line-clamp-1">{restaurante.direccion}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
            <IconoReloj width={14} height={14} />
            {horarioDeHoy(restaurante.horario)}
          </div>
        </div>
      </div>
    </Link>
  )
}
