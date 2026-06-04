import { useState } from 'react'

// Imagen con respaldo cuando la URL falla o está vacía.
export default function ImagenSegura({ src, alt, className, emoji = '🍽️' }) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 text-4xl ${className || ''}`}
        aria-label={alt}
      >
        <span>{emoji}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  )
}
