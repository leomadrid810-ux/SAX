import Modal from './Modal'

const PASOS_ANDROID = [
  { icono: '🌐', texto: 'Abre Chrome y escribe en la barra de arriba:' },
  { icono: '⋮',  texto: 'Toca los 3 puntitos que están arriba a la derecha' },
  { icono: '➕', texto: 'Toca "Agregar a pantalla de inicio"' },
  { icono: '✅', texto: 'Toca "Instalar" y ¡listo! Ya tienes el ícono en tu celular' },
]

const PASOS_IPHONE = [
  { icono: '🌐', texto: 'Abre Safari y escribe en la barra de arriba:' },
  { icono: '⬆️', texto: 'Toca el botón de compartir (el cuadrito con una flecha apuntando hacia arriba, está abajo de la pantalla)' },
  { icono: '➕', texto: 'Baja un poco y toca "Agregar a pantalla de inicio"' },
  { icono: '✅', texto: 'Toca "Agregar" y ¡listo! Ya tienes el ícono en tu celular' },
]

const PASOS_USO = [
  {
    icono: '🔎',
    titulo: 'Busca un negocio',
    texto: 'Escribe el nombre del negocio en el buscador de arriba.',
  },
  {
    icono: '🏷️',
    titulo: 'Filtra por categoría',
    texto: 'Toca uno de los botones de color (Tacos, Pizzas, Mariscos…) para ver solo ese tipo de negocio.',
  },
  {
    icono: '🟢',
    titulo: 'Saber si está abierto',
    texto: 'Cada tarjeta tiene un letrero verde "Abierto" o rojo "Cerrado" según el horario del negocio.',
  },
  {
    icono: '📋',
    titulo: 'Ver el menú',
    texto: 'Toca la tarjeta del negocio para entrar y ver su menú completo, con fotos y precios.',
  },
  {
    icono: '💬',
    titulo: 'Contactar por WhatsApp',
    texto: 'Dentro del negocio toca el botón verde de WhatsApp para escribirle directo.',
  },
]

function PasoInstalacion({ numero, icono, texto }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-marca-naranja shadow-sm border border-orange-100">
        {numero}
      </div>
      <div className="flex items-start gap-2 pt-0.5">
        <span className="text-lg leading-none">{icono}</span>
        <p className="text-sm leading-snug text-gray-700">{texto}</p>
      </div>
    </div>
  )
}

export default function ModalAyuda({ onCerrar }) {
  return (
    <Modal titulo="¿Cómo usar SAX?" onCerrar={onCerrar}>
      <div className="space-y-6">

        {/* ── Sección instalación ── */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">📲</span>
            <h3 className="text-base font-black text-marca-texto">
              Instala la app en tu celular
            </h3>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Así tendrás un ícono directo en tu pantalla, como cualquier app, sin necesidad de ir a la tienda.
          </p>

          {/* Android */}
          <div className="mb-3 rounded-2xl bg-green-50 border border-green-100 p-4 space-y-3">
            <p className="flex items-center gap-2 font-extrabold text-green-700">
              <span className="text-xl">🤖</span> Para Android (Chrome)
            </p>
            <div className="space-y-3">
              {PASOS_ANDROID.map((p, i) => (
                <div key={i}>
                  <PasoInstalacion numero={i + 1} icono={p.icono} texto={p.texto} />
                  {i === 0 && (
                    <div className="ml-10 mt-1.5 rounded-xl bg-white border border-green-200 px-3 py-2">
                      <p className="select-all font-black tracking-tight text-marca-texto">
                        sax-rho.vercel.app
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* iPhone */}
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 space-y-3">
            <p className="flex items-center gap-2 font-extrabold text-blue-700">
              <span className="text-xl">🍎</span> Para iPhone (Safari)
            </p>
            <div className="space-y-3">
              {PASOS_IPHONE.map((p, i) => (
                <div key={i}>
                  <PasoInstalacion numero={i + 1} icono={p.icono} texto={p.texto} />
                  {i === 0 && (
                    <div className="ml-10 mt-1.5 rounded-xl bg-white border border-blue-200 px-3 py-2">
                      <p className="select-all font-black tracking-tight text-marca-texto">
                        sax-rho.vercel.app
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-xs font-bold text-gray-400">CÓMO USAR LA APP</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* ── Sección uso ── */}
        <div className="space-y-4">
          {PASOS_USO.map((p, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                {p.icono}
              </div>
              <div>
                <h3 className="font-extrabold text-marca-texto">{p.titulo}</h3>
                <p className="text-sm leading-snug text-gray-600">{p.texto}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onCerrar} className="btn-primario w-full">
          ¡Entendido!
        </button>
      </div>
    </Modal>
  )
}
