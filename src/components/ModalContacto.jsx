import { useState } from 'react'
import Modal from './Modal'
import { IconoCheck } from './Iconos'
import { useTienda } from '../store/tienda'

// Formulario para que un negocio solicite unirse al directorio.
export default function ModalContacto({ onCerrar }) {
  const { agregarSolicitud } = useTienda()
  const [enviado, setEnviado] = useState(false)
  const [form, setForm] = useState({
    nombreNegocio: '',
    contacto: '',
    whatsapp: '',
    mensaje: '',
  })

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (!form.nombreNegocio.trim() || !form.whatsapp.trim()) return
    setEnviando(true)
    const ok = await agregarSolicitud({
      ...form,
      fecha: new Date().toISOString().slice(0, 10),
    })
    setEnviando(false)
    if (ok) setEnviado(true)
  }

  if (enviado) {
    return (
      <Modal titulo="¡Solicitud enviada!" onCerrar={onCerrar}>
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <IconoCheck width={36} height={36} />
          </div>
          <p className="text-marca-texto">
            Gracias por tu interés. Revisaremos tu solicitud y te contactaremos
            pronto por WhatsApp.
          </p>
          <button onClick={onCerrar} className="btn-primario w-full">
            Cerrar
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal titulo="¿Quieres unir tu negocio?" onCerrar={onCerrar}>
      <p className="mb-4 text-sm text-gray-600">
        Llena este formulario y nos pondremos en contacto contigo para sumar tu
        restaurante a SAX.
      </p>
      <form onSubmit={enviar} className="space-y-3">
        <div>
          <label className="etiqueta">Nombre del negocio *</label>
          <input
            className="campo"
            value={form.nombreNegocio}
            onChange={cambiar('nombreNegocio')}
            placeholder="Ej. Tacos El Güero"
            required
          />
        </div>
        <div>
          <label className="etiqueta">Tu nombre</label>
          <input
            className="campo"
            value={form.contacto}
            onChange={cambiar('contacto')}
            placeholder="¿Con quién hablamos?"
          />
        </div>
        <div>
          <label className="etiqueta">WhatsApp *</label>
          <input
            className="campo"
            value={form.whatsapp}
            onChange={cambiar('whatsapp')}
            placeholder="Ej. 5215512345678"
            inputMode="tel"
            required
          />
        </div>
        <div>
          <label className="etiqueta">Mensaje</label>
          <textarea
            className="campo"
            rows={3}
            value={form.mensaje}
            onChange={cambiar('mensaje')}
            placeholder="Cuéntanos sobre tu negocio"
          />
        </div>
        <button type="submit" className="btn-primario w-full" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar solicitud'}
        </button>
      </form>
    </Modal>
  )
}
