import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { TiendaProvider } from './store/tienda.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <TiendaProvider>
        <App />
      </TiendaProvider>
    </HashRouter>
  </React.StrictMode>
)

// Registrar el Service Worker (PWA / offline)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('No se pudo registrar el Service Worker:', err)
    })
  })
}
