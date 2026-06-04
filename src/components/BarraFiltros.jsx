// Barra horizontal de filtros por categoría.
export default function BarraFiltros({ categorias, seleccionada, onSeleccionar, conteos }) {
  const Boton = ({ id, etiqueta, icono }) => {
    const activo = seleccionada === id
    const total = conteos ? conteos[id] : undefined
    return (
      <button
        onClick={() => onSeleccionar(id)}
        className={`btn shrink-0 whitespace-nowrap px-4 py-2.5 text-base ${
          activo
            ? 'bg-marca-naranja text-white shadow-sm'
            : 'bg-marca-tarjeta text-marca-texto border border-gray-200'
        }`}
      >
        {icono && <span>{icono}</span>}
        {etiqueta}
        {typeof total === 'number' && (
          <span
            className={`ml-1 rounded-full px-1.5 text-sm font-bold ${
              activo ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {total}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="scroll-oculto -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      <Boton id="todas" etiqueta="Todas" icono="🍴" />
      <Boton id="abierto" etiqueta="Abierto ahora" icono="🟢" />
      {categorias.map((c) => (
        <Boton key={c.id} id={c.id} etiqueta={c.nombre} icono={c.icono} />
      ))}
    </div>
  )
}
