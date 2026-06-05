import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Inicio from './pages/Inicio'
import DetalleRestaurante from './pages/DetalleRestaurante'
import AdminLogin from './pages/admin/AdminLogin'
import AdminPanel from './pages/admin/AdminPanel'
import NegocioLogin from './pages/negocio/NegocioLogin'
import NegocioPanel from './pages/negocio/NegocioPanel'
import NavBar from './components/NavBar'
import PantallaCarga from './components/PantallaCarga'
import { sesionAdmin, sesionNegocio } from './store/sesion'

function RutaAdmin({ children }) {
  return sesionAdmin.activa() ? children : <Navigate to="/admin/login" replace />
}

function RutaNegocio({ children }) {
  return sesionNegocio.activa() ? children : <Navigate to="/negocio/panel" replace />
}

function Layout() {
  const { pathname } = useLocation()
  const esPublico =
    !pathname.startsWith('/admin') && !pathname.startsWith('/negocio')

  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/restaurante/:id" element={<DetalleRestaurante />} />

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {esPublico && <NavBar />}
    </>
  )
}

export default function App() {
  const rutaInicial = window.location.hash.replace('#', '') || '/'
  const esPublicoInicial =
    !rutaInicial.startsWith('/admin') && !rutaInicial.startsWith('/negocio')

  const [mostrarCarga, setMostrarCarga] = useState(esPublicoInicial)

  return (
    <>
      {mostrarCarga && (
        <PantallaCarga onFin={() => setMostrarCarga(false)} />
      )}
      <Layout />
    </>
  )
}
