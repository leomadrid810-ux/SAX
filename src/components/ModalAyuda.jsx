import Modal from './Modal'

export default function ModalAyuda({ onCerrar }) {
  const pasos = [
    {
      icono: '🔎',
      titulo: 'Busca tu antojo',
      texto: 'Usa el buscador para encontrar un restaurante por su nombre.',
    },
    {
      icono: '🏷️',
      titulo: 'Filtra por categoría',
      texto: 'Toca una categoría (Tacos, Pizzas, Mariscos...) para ver solo esos lugares.',
    },
    {
      icono: '🟢',
      titulo: 'Mira si está abierto',
      texto: 'Cada tarjeta te dice si el restaurante está abierto o cerrado ahora mismo.',
    },
    {
      icono: '📋',
      titulo: 'Revisa el menú',
      texto: 'Entra a un restaurante para ver su menú completo con fotos y precios.',
    },
    {
      icono: '💬',
      titulo: 'Contacta por WhatsApp',
      texto: 'Toca el botón verde de WhatsApp para escribirle directo al negocio.',
    },
    {
      icono: '📲',
      titulo: 'Instala la app',
      texto: 'Desde el menú de tu navegador elige "Agregar a pantalla de inicio".',
    },
  ]

  return (
    <Modal titulo="¿Cómo usar SAX?" onCerrar={onCerrar}>
      <div className="space-y-4">
        {pasos.map((p, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
              {p.icono}
            </div>
            <div>
              <h3 className="font-extrabold text-marca-texto">{p.titulo}</h3>
              <p className="text-sm text-gray-600">{p.texto}</p>
            </div>
          </div>
        ))}
        <button onClick={onCerrar} className="btn-primario w-full">
          ¡Entendido!
        </button>
      </div>
    </Modal>
  )
}
