import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ModalContacto from './ModalContacto'
import { IconoInicio, IconoBuscar, IconoSobre } from './Iconos'

export default function NavBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [mostrarContacto, setMostrarContacto] = useState(false)

  const enInicio = pathname === '/'

  const alBuscar = () => {
    if (enInicio) {
      window.dispatchEvent(new CustomEvent('enfocar-busqueda'))
    } else {
      navigate('/')
    }
  }

  const tab = (activo) =>
    `flex flex-col items-center gap-0.5 min-w-[64px] px-4 py-2 rounded-2xl transition-all duration-150 active:scale-90 select-none ${
      activo ? 'text-marca-naranja' : 'text-gray-400'
    }`

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-md"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-1.5">
          <Link to="/" className={tab(enInicio)}>
            <IconoInicio width={22} height={22} />
            <span className="text-[10px] font-bold">Inicio</span>
          </Link>

          <button onClick={alBuscar} className={tab(false)}>
            <IconoBuscar width={22} height={22} />
            <span className="text-[10px] font-bold">Buscar</span>
          </button>

          <button onClick={() => setMostrarContacto(true)} className={tab(false)}>
            <IconoSobre width={22} height={22} />
            <span className="text-[10px] font-bold">Contacto</span>
          </button>
        </div>
      </nav>

      {mostrarContacto && (
        <ModalContacto onCerrar={() => setMostrarContacto(false)} />
      )}
    </>
  )
}
