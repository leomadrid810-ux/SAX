import { useState } from 'react'

const PASOS = [
  {
    emoji: '📷',
    titulo: 'Subir tu foto principal',
    texto:
      'En el formulario de edición, busca el campo "Foto del negocio". Toca el botón azul "Subir foto" y elige una imagen de tu galería o toma una con tu cámara. La foto aparece de inmediato en tu página.',
  },
  {
    emoji: '🍽️',
    titulo: 'Agregar categorías y productos al menú',
    texto:
      'Baja hasta la sección "Menú" y toca "+ Categoría" para crear grupos (por ejemplo: Tacos, Bebidas, Postres). Dentro de cada categoría toca "+ Agregar producto", escribe el nombre, precio y foto de cada platillo.',
  },
  {
    emoji: '💰',
    titulo: 'Cambiar precios',
    texto:
      'Entra al menú, encuentra el producto que quieres modificar y cambia el número en el campo "Precio". Cuando termines de editar, toca "Guardar" al final del formulario.',
  },
  {
    emoji: '🟢',
    titulo: 'Marcar abierto o cerrado',
    texto:
      'En la parte de arriba de tu panel hay un botón grande verde o rojo. Tócalo para abrir o cerrar tu negocio al instante. Al día siguiente tu horario automático vuelve a funcionar solo.',
  },
  {
    emoji: '📱',
    titulo: 'Editar contacto y redes sociales',
    texto:
      'En el formulario encontrarás campos para Teléfono, WhatsApp, y más abajo una sección de Redes sociales. Puedes poner tu usuario de Instagram o Facebook (por ejemplo @minegocio) y tu sitio web. Los clientes verán botones para ir directo a tus redes.',
  },
]

export default function TutorialNegocio() {
  const [abierto, setAbierto] = useState(() => {
    try {
      return localStorage.getItem('sax_tutorial_cerrado') !== '1'
    } catch {
      return true
    }
  })

  const cerrar = () => {
    setAbierto(false)
    try { localStorage.setItem('sax_tutorial_cerrado', '1') } catch {}
  }

  const abrir = () => {
    setAbierto(true)
    try { localStorage.removeItem('sax_tutorial_cerrado') } catch {}
  }

  if (!abierto) {
    return (
      <button
        onClick={abrir}
        className="mb-4 flex w-full items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-marca-tarjeta px-4 py-3 text-sm font-bold text-gray-500 transition hover:border-marca-naranja hover:text-marca-naranja"
      >
        <span className="text-base">📚</span> Ver guía de uso rápida
      </button>
    )
  }

  return (
    <div className="mb-6 rounded-3xl border border-orange-100 bg-orange-50 overflow-hidden">
      {/* Encabezado */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <div>
            <p className="font-black text-marca-texto">Guía de uso rápida</p>
            <p className="text-xs text-gray-500">Aprende a usar tu panel en 5 pasos</p>
          </div>
        </div>
        <button
          onClick={cerrar}
          className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-gray-500 border border-gray-200 active:scale-95 transition-all"
        >
          Cerrar ✕
        </button>
      </div>

      {/* Pasos */}
      <div className="px-4 pb-5 space-y-3">
        {PASOS.map((paso, i) => (
          <div key={i} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl">
              {paso.emoji}
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-marca-texto">
                {i + 1}. {paso.titulo}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{paso.texto}</p>
            </div>
          </div>
        ))}

        <p className="pt-1 text-center text-xs text-gray-400">
          ¿Tienes dudas? Escríbenos por WhatsApp desde la pantalla de inicio.
        </p>
      </div>
    </div>
  )
}
