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
      className="tarjeta block transition hover:shadow-md active:scale-[0.99]"
    >
      <div className="relative">
        <ImagenSegura
          src={restaurante.foto}
          alt={restaurante.nombre}
          emoji={cats[0]?.icono || '🍽️'}
          className="h-44 w-full object-cover"
        />
        <BadgeAbierto
          restaurante={restaurante}
          className="absolute left-3 top-3 shadow-sm"
        />
        {nuevo && (
          <span className="absolute right-3 top-3 rounded-full bg-marca-rojo px-3 py-1 text-sm font-extrabold text-white shadow-sm">
            ✨ Nuevo
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-lg font-extrabold leading-tight text-marca-texto">
          {restaurante.nombre}
        </h3>

        {/* Todas las categorías del negocio */}
        {cats.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-sm font-bold text-marca-naranja"
              >
                <span>{c.icono}</span> {c.nombre}
              </span>
            ))}
          </div>
        )}

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {restaurante.descripcion}
        </p>

        {restaurante.direccion && (
          <div className="mt-3 flex items-start gap-1.5 text-sm text-gray-600">
            <IconoUbicacion width={16} height={16} className="mt-0.5 shrink-0 text-marca-rojo" />
            <span className="line-clamp-1">{restaurante.direccion}</span>
          </div>
        )}

        <div className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-600">
          <IconoReloj width={16} height={16} />
          {horarioDeHoy(restaurante.horario)}
        </div>
      </div>
    </Link>
  )
}
