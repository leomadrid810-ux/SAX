import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTienda } from '../../store/tienda'
import { sesionNegocio } from '../../store/sesion'
import { IconoTienda, IconoFlecha } from '../../components/Iconos'

export default function NegocioLogin() {
  const { validarNegocio } = useTienda()
  const navigate = useNavigate()
  const [form, setForm] = useState({ usuario: '', password: '' })
  const [error, setError] = useState('')

  const entrar = (e) => {
    e.preventDefault()
    const rest = validarNegocio(form.usuario.trim(), form.password)
    if (rest) {
      sesionNegocio.iniciar(rest.id)
      navigate('/negocio/panel', { replace: true })
    } else {
      setError('Usuario o contraseña incorrectos.')
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
              <IconoTienda width={28} height={28} />
            </div>
            <h1 className="text-xl font-black text-marca-texto">Panel de negocio</h1>
            <p className="text-sm text-gray-500">Administra tu restaurante y tu menú</p>
          </div>
          <form onSubmit={entrar} className="space-y-3">
            <div>
              <label className="etiqueta">Usuario</label>
              <input
                className="campo"
                value={form.usuario}
                onChange={(e) => {
                  setForm({ ...form, usuario: e.target.value })
                  setError('')
                }}
                autoFocus
                autoComplete="username"
              />
            </div>
            <div>
              <label className="etiqueta">Contraseña</label>
              <input
                type="password"
                className="campo"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value })
                  setError('')
                }}
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm font-semibold text-marca-rojo">{error}</p>}
            <button type="submit" className="btn-primario w-full">
              Entrar
            </button>
          </form>
          <div className="mt-4 rounded-xl bg-marca-tarjeta p-3 text-center text-xs text-gray-500">
            <p className="font-bold text-gray-600">Cuentas de ejemplo:</p>
            <p>donpepe / pepe123</p>
            <p>bella / bella123</p>
            <p>sirena / sirena123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
