import { Routes, Route, Navigate } from 'react-router-dom'
import Inicio from './pages/Inicio'
import DetalleRestaurante from './pages/DetalleRestaurante'
import AdminLogin from './pages/admin/AdminLogin'
import AdminPanel from './pages/admin/AdminPanel'
import NegocioLogin from './pages/negocio/NegocioLogin'
import NegocioPanel from './pages/negocio/NegocioPanel'
import { sesionAdmin, sesionNegocio } from './store/sesion'

function RutaAdmin({ children }) {
  return sesionAdmin.activa() ? children : <Navigate to="/admin/login" replace />
}

function RutaNegocio({ children }) {
  return sesionNegocio.activa() ? children : <Navigate to="/negocio/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<Inicio />} />
      <Route path="/restaurante/:id" element={<DetalleRestaurante />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/panel" replace />} />
      <Route
        path="/admin/panel"
        element={
          <RutaAdmin>
            <AdminPanel />
          </RutaAdmin>
        }
      />

      {/* Negocio */}
      <Route path="/negocio/login" element={<NegocioLogin />} />
      <Route path="/negocio" element={<Navigate to="/negocio/panel" replace />} />
      <Route
        path="/negocio/panel"
        element={
          <RutaNegocio>
            <NegocioPanel />
          </RutaNegocio>
        }
      />

      {/* Cualquier otra ruta */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
