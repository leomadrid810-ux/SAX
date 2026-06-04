// Manejo simple de sesión con sessionStorage.
// Admin y dueños de negocio inician sesión por separado.

const CLAVE_ADMIN = 'tumenu:sesion:admin'
const CLAVE_NEGOCIO = 'tumenu:sesion:negocio'

export const sesionAdmin = {
  iniciar() {
    sessionStorage.setItem(CLAVE_ADMIN, '1')
  },
  activa() {
    return sessionStorage.getItem(CLAVE_ADMIN) === '1'
  },
  cerrar() {
    sessionStorage.removeItem(CLAVE_ADMIN)
  },
}

export const sesionNegocio = {
  iniciar(restauranteId) {
    sessionStorage.setItem(CLAVE_NEGOCIO, restauranteId)
  },
  restauranteId() {
    return sessionStorage.getItem(CLAVE_NEGOCIO)
  },
  activa() {
    return !!sessionStorage.getItem(CLAVE_NEGOCIO)
  },
  cerrar() {
    sessionStorage.removeItem(CLAVE_NEGOCIO)
  },
}
