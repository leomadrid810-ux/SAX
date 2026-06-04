import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTienda } from '../../store/tienda'
import { sesionAdmin } from '../../store/sesion'
import { IconoCandado, IconoFlecha } from '../../components/Iconos'

export default function AdminLogin() {
  const { validarAdmin } = useTienda()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [verificando, setVerificando] = useState(false)

  const entrar = async (e) => {
    e.preventDefault()
    setVerificando(true)
    const ok = await validarAdmin(password)
    setVerificando(false)
    if (ok) {
      sesionAdmin.iniciar()
      navigate('/admin/panel', { replace: true })
    } else {
      setError('Contraseña incorrecta.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
          <IconoFlecha width={18} height={18} /> Volver al inicio
        </Link>
        <div className="tarjeta p-6">
          <div className="mb-5 flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-marca-naranja">
              <IconoCandado width={28} height={28} />
            </div>
            <h1 className="text-xl font-black text-marca-texto">Panel de administrador</h1>
            <p className="text-sm text-gray-500">Ingresa la contraseña para continuar</p>
          </div>
          <form onSubmit={entrar} className="space-y-3">
            <div>
              <label className="etiqueta">Contraseña</label>
              <input
                type="password"
                className="campo"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                autoFocus
              />
            </div>
            {error && <p className="text-sm font-semibold text-marca-rojo">{error}</p>}
            <button type="submit" className="btn-primario w-full" disabled={verificando}>
              {verificando ? 'Verificando…' : 'Entrar'}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-400">
            Contraseña de ejemplo: <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
