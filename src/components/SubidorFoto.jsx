import { useRef, useState } from 'react'
import { supabase, supabaseConfigurado } from '../lib/supabase'
import ImagenSegura from './ImagenSegura'

const BUCKET = 'fotos'
const MAX_MB = 5

export default function SubidorFoto({ valor, onChange, carpeta = 'general', className = '' }) {
  const inputRef = useRef(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')

  const manejarArchivo = async (e) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return

    if (!archivo.type.startsWith('image/')) {
      setError('Solo se permiten imágenes.')
      return
    }
    if (archivo.size > MAX_MB * 1024 * 1024) {
      setError(`La imagen no debe superar ${MAX_MB} MB.`)
      return
    }
    if (!supabaseConfigurado || !supabase) {
      setError('Supabase no está configurado.')
      return
    }

    setSubiendo(true)
    setError('')

    try {
      const ext = archivo.name.split('.').pop().toLowerCase() || 'jpg'
      const ruta = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: errSubida } = await supabase.storage
        .from(BUCKET)
        .upload(ruta, archivo, { upsert: true, contentType: archivo.type })

      if (errSubida) throw errSubida

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta)
      onChange(data.publicUrl)
    } catch (err) {
      setError(err.message || 'Error al subir la imagen.')
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {valor && (
        <ImagenSegura
          src={valor}
          alt="Vista previa"
          className="h-32 w-full rounded-2xl object-cover"
        />
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setError(''); inputRef.current?.click() }}
          disabled={subiendo}
          className="btn-suave flex-1 gap-2"
        >
          {subiendo ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Subiendo…
            </>
          ) : (
            valor ? 'Cambiar foto' : 'Subir foto'
          )}
        </button>
        {valor && !subiendo && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-marca-rojo hover:bg-red-50"
          >
            Quitar
          </button>
        )}
      </div>
      {error && <p className="text-xs text-marca-rojo">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={manejarArchivo}
      />
    </div>
  )
}
