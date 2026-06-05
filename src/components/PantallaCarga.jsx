import { useEffect, useState } from 'react'

export default function PantallaCarga({ onFin }) {
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setSaliendo(true), 1300)
    const t2 = setTimeout(() => onFin(), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onFin])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
      style={{
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        opacity: saliendo ? 0 : 1,
        transform: saliendo ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: saliendo ? 'none' : 'auto',
      }}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="animar-logo">
          <img
            src="/icons/icon.svg"
            alt="SAX"
            className="h-24 w-24 rounded-[28px] shadow-2xl"
          />
        </div>

        <div className="animar-logo" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-5xl font-black tracking-tight text-marca-texto">
            SA<span className="text-marca-naranja">X</span>
          </h1>
        </div>

        <p className="text-sm font-semibold text-gray-400">Negocios cerca de ti</p>

        <div className="mt-2 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-marca-naranja animar-punto" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-marca-naranja animar-punto" style={{ animationDelay: '180ms' }} />
          <span className="h-2 w-2 rounded-full bg-marca-naranja animar-punto" style={{ animationDelay: '360ms' }} />
        </div>
      </div>
    </div>
  )
}
