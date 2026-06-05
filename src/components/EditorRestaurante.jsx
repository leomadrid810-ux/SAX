import { useState } from 'react'
import { useTienda } from '../store/tienda'
import ImagenSegura from './ImagenSegura'
import SubidorFoto from './SubidorFoto'
import { IconoMas, IconoBasura, IconoLapiz } from './Iconos'
import {
  nuevoId,
  horarioVacio,
  hoyISO,
  categoriasDe,
  ORDEN_DIAS,
  DIAS_NOMBRE,
} from '../utils/helpers'

// Editor de datos + menú de un restaurante.
// props:
//  - restaurante: objeto existente o null (para crear)
//  - onGuardar(datos), onCancelar()
//  - permitirCredenciales: muestra usuario/contraseña (panel admin)
//  - permitirCategorias: permite editar categorías (solo panel admin)
export default function EditorRestaurante({
  restaurante,
  onGuardar,
  onCancelar,
  permitirCredenciales = false,
  permitirCategorias = false,
}) {
  const { categorias } = useTienda()

  const [form, setForm] = useState(() => ({
    nombre: restaurante?.nombre || '',
    categorias: categoriasDe(restaurante).length
      ? categoriasDe(restaurante)
      : [categorias[0].id],
    foto: restaurante?.foto || '',
    descripcion: restaurante?.descripcion || '',
    direccion: restaurante?.direccion || '',
    telefono: restaurante?.telefono || '',
    whatsapp: restaurante?.whatsapp || '',
    facebook: restaurante?.facebook || '',
    instagram: restaurante?.instagram || '',
    tiktok: restaurante?.tiktok || '',
    sitio_web: restaurante?.sitio_web || '',
    usuario: restaurante?.usuario || '',
    password: restaurante?.password || '',
    activo: restaurante?.activo ?? true,
    creado: restaurante?.creado || hoyISO(),
    horario: restaurante?.horario
      ? JSON.parse(JSON.stringify(restaurante.horario))
      : horarioVacio(),
    menu: restaurante?.menu
      ? JSON.parse(JSON.stringify(restaurante.menu))
      : [],
  }))

  const set = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }))

  // Activar/desactivar una categoría (selección múltiple)
  const alternarCategoria = (idCat) => {
    setForm((f) => {
      const ya = f.categorias.includes(idCat)
      return {
        ...f,
        categorias: ya
          ? f.categorias.filter((c) => c !== idCat)
          : [...f.categorias, idCat],
      }
    })
  }

  // ---- Horario ----
  const cambiarHorario = (dia, campo, valor) => {
    setForm((f) => ({
      ...f,
      horario: { ...f.horario, [dia]: { ...f.horario[dia], [campo]: valor } },
    }))
  }

  // ---- Secciones del menú ----
  const agregarSeccion = () => {
    setForm((f) => ({
      ...f,
      menu: [...f.menu, { id: nuevoId('cat'), nombre: 'Nueva categoría', productos: [] }],
    }))
  }
  const renombrarSeccion = (idSeccion, nombre) => {
    setForm((f) => ({
      ...f,
      menu: f.menu.map((s) => (s.id === idSeccion ? { ...s, nombre } : s)),
    }))
  }
  const eliminarSeccion = (idSeccion) => {
    setForm((f) => ({ ...f, menu: f.menu.filter((s) => s.id !== idSeccion) }))
  }

  // ---- Productos ----
  const agregarProducto = (idSeccion) => {
    setForm((f) => ({
      ...f,
      menu: f.menu.map((s) =>
        s.id === idSeccion
          ? {
              ...s,
              productos: [
                ...s.productos,
                { id: nuevoId('p'), nombre: '', descripcion: '', precio: 0, foto: '' },
              ],
            }
          : s
      ),
    }))
  }
  const cambiarProducto = (idSeccion, idProd, campo, valor) => {
    setForm((f) => ({
      ...f,
      menu: f.menu.map((s) =>
        s.id === idSeccion
          ? {
              ...s,
              productos: s.productos.map((p) =>
                p.id === idProd ? { ...p, [campo]: valor } : p
              ),
            }
          : s
      ),
    }))
  }
  const eliminarProducto = (idSeccion, idProd) => {
    setForm((f) => ({
      ...f,
      menu: f.menu.map((s) =>
        s.id === idSeccion
          ? { ...s, productos: s.productos.filter((p) => p.id !== idProd) }
          : s
      ),
    }))
  }

  const guardar = (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) {
      alert('El nombre del restaurante es obligatorio.')
      return
    }
    if (!form.categorias.length) {
      alert('Selecciona al menos una categoría.')
      return
    }
    // Normalizar precios a número
    const menu = form.menu.map((s) => ({
      ...s,
      productos: s.productos.map((p) => ({ ...p, precio: Number(p.precio) || 0 })),
    }))
    onGuardar({ ...form, menu })
  }

  return (
    <form onSubmit={guardar} className="space-y-6">
      {/* Datos básicos */}
      <section className="space-y-3">
        <h3 className="text-base font-black text-marca-texto">Datos del restaurante</h3>
        <div>
          <label className="etiqueta">Nombre *</label>
          <input className="campo" value={form.nombre} onChange={set('nombre')} required />
        </div>
        <div>
          <label className="etiqueta">Categorías</label>
          {permitirCategorias ? (
            <div className="grid grid-cols-2 gap-2">
              {categorias.map((c) => {
                const activa = form.categorias.includes(c.id)
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => alternarCategoria(c.id)}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-sm font-bold transition ${
                      activa
                        ? 'border-marca-naranja bg-orange-50 text-marca-naranja'
                        : 'border-gray-200 bg-white text-marca-texto'
                    }`}
                  >
                    <span className="text-lg">{c.icono}</span>
                    <span className="flex-1">{c.nombre}</span>
                    {activa && <span className="text-marca-naranja">✓</span>}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {form.categorias.length > 0
                ? form.categorias.map((id) => {
                    const cat = categorias.find((c) => c.id === id)
                    return cat ? (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-bold text-marca-naranja"
                      >
                        <span>{cat.icono}</span> {cat.nombre}
                      </span>
                    ) : null
                  })
                : <p className="text-sm text-gray-400">Sin categorías asignadas. Contacta al administrador.</p>
              }
            </div>
          )}
        </div>
        <div>
          <label className="etiqueta">Foto del negocio</label>
          <SubidorFoto
            valor={form.foto}
            onChange={(url) => setForm((f) => ({ ...f, foto: url }))}
            carpeta="negocios"
          />
        </div>
        <div>
          <label className="etiqueta">Descripción / presentación del negocio</label>
          <textarea
            className="campo"
            rows={4}
            value={form.descripcion}
            onChange={set('descripcion')}
            placeholder="Cuéntale a tus clientes quién eres, qué ofreces y qué te hace especial."
          />
        </div>
        <div>
          <label className="etiqueta">Dirección completa</label>
          <input
            className="campo"
            value={form.direccion}
            onChange={set('direccion')}
            placeholder="Calle, número, colonia, ciudad"
          />
          <p className="mt-1 text-xs text-gray-400">
            Se usa para mostrar la dirección y el botón "Cómo llegar" (Google Maps).
          </p>
        </div>
        <div>
          <label className="etiqueta">Teléfono (para llamar)</label>
          <input
            className="campo"
            value={form.telefono}
            onChange={set('telefono')}
            placeholder="Ej. 5512345678"
            inputMode="tel"
          />
        </div>
        <div>
          <label className="etiqueta">WhatsApp</label>
          <input
            className="campo"
            value={form.whatsapp}
            onChange={set('whatsapp')}
            placeholder="Ej. 5215512345678"
            inputMode="tel"
          />
        </div>

        {/* Redes sociales */}
        <div className="rounded-2xl border border-gray-100 bg-marca-tarjeta p-4 space-y-3">
          <p className="text-sm font-black text-marca-texto">Redes sociales y sitio web <span className="font-normal text-gray-400">(opcional)</span></p>
          <div>
            <label className="etiqueta">📘 Facebook</label>
            <input
              className="campo"
              value={form.facebook}
              onChange={set('facebook')}
              placeholder="https://facebook.com/tu-pagina  o  nombre-de-pagina"
              inputMode="url"
            />
          </div>
          <div>
            <label className="etiqueta">📸 Instagram</label>
            <input
              className="campo"
              value={form.instagram}
              onChange={set('instagram')}
              placeholder="@tu_usuario  o  https://instagram.com/tu_usuario"
            />
          </div>
          <div>
            <label className="etiqueta">🎵 TikTok</label>
            <input
              className="campo"
              value={form.tiktok}
              onChange={set('tiktok')}
              placeholder="@tu_usuario  o  https://tiktok.com/@tu_usuario"
            />
          </div>
          <div>
            <label className="etiqueta">🌐 Sitio web</label>
            <input
              className="campo"
              value={form.sitio_web}
              onChange={set('sitio_web')}
              placeholder="https://tu-sitio.com"
              inputMode="url"
            />
          </div>
        </div>
      </section>

      {/* Credenciales del negocio (solo admin) */}
      {permitirCredenciales && (
        <section className="space-y-3 rounded-2xl bg-marca-tarjeta p-4">
          <h3 className="text-base font-black text-marca-texto">
            Acceso del dueño (panel de negocio)
          </h3>
          <p className="text-sm text-gray-500">
            Con estos datos el dueño podrá entrar a <code>/negocio/login</code>.
          </p>
          <div>
            <label className="etiqueta">Usuario</label>
            <input
              className="campo"
              value={form.usuario}
              onChange={set('usuario')}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="etiqueta">Contraseña</label>
            <input
              className="campo"
              value={form.password}
              onChange={set('password')}
              autoComplete="off"
              placeholder={restaurante ? 'Dejar en blanco para no cambiarla' : ''}
            />
            {restaurante && (
              <p className="mt-1 text-xs text-gray-400">
                Por seguridad no se muestra la contraseña actual. Escribe una nueva solo
                si quieres cambiarla.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Horario */}
      <section className="space-y-2">
        <h3 className="text-base font-black text-marca-texto">Horario</h3>
        <div className="space-y-2">
          {ORDEN_DIAS.map((d) => {
            const h = form.horario[d]
            return (
              <div
                key={d}
                className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-2"
              >
                <label className="flex w-28 items-center gap-2 font-bold text-marca-texto">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-marca-naranja"
                    checked={h.abierto}
                    onChange={(e) => cambiarHorario(d, 'abierto', e.target.checked)}
                  />
                  {DIAS_NOMBRE[d]}
                </label>
                {h.abierto ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      className="campo w-32 py-2"
                      value={h.apertura}
                      onChange={(e) => cambiarHorario(d, 'apertura', e.target.value)}
                    />
                    <span className="text-gray-400">a</span>
                    <input
                      type="time"
                      className="campo w-32 py-2"
                      value={h.cierre}
                      onChange={(e) => cambiarHorario(d, 'cierre', e.target.value)}
                    />
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-gray-400">Cerrado</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Menú */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-marca-texto">Menú</h3>
          <button type="button" onClick={agregarSeccion} className="btn-suave py-2 text-sm">
            <IconoMas width={18} height={18} /> Categoría
          </button>
        </div>

        {form.menu.length === 0 && (
          <p className="rounded-2xl bg-marca-tarjeta p-4 text-center text-sm text-gray-500">
            Agrega categorías (ej. Tacos, Bebidas) y dentro sus productos.
          </p>
        )}

        {form.menu.map((seccion) => (
          <div key={seccion.id} className="rounded-2xl border border-gray-200 p-3">
            <div className="mb-3 flex items-center gap-2">
              <IconoLapiz width={18} height={18} className="text-gray-400" />
              <input
                className="campo flex-1 py-2 font-bold"
                value={seccion.nombre}
                onChange={(e) => renombrarSeccion(seccion.id, e.target.value)}
                placeholder="Nombre de la categoría"
              />
              <button
                type="button"
                onClick={() => eliminarSeccion(seccion.id)}
                className="rounded-xl p-2 text-marca-rojo hover:bg-red-50"
                aria-label="Eliminar categoría"
              >
                <IconoBasura width={20} height={20} />
              </button>
            </div>

            <div className="space-y-3">
              {seccion.productos.map((p) => (
                <div key={p.id} className="rounded-2xl bg-marca-tarjeta p-3">
                  <div className="flex items-start gap-3">
                    <ImagenSegura
                      src={p.foto}
                      alt={p.nombre || 'Producto'}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        className="campo py-2"
                        value={p.nombre}
                        onChange={(e) =>
                          cambiarProducto(seccion.id, p.id, 'nombre', e.target.value)
                        }
                        placeholder="Nombre del producto"
                      />
                      <div className="flex gap-2">
                        <input
                          className="campo w-32 py-2"
                          type="number"
                          min="0"
                          step="1"
                          value={p.precio}
                          onChange={(e) =>
                            cambiarProducto(seccion.id, p.id, 'precio', e.target.value)
                          }
                          placeholder="Precio"
                        />
                        <button
                          type="button"
                          onClick={() => eliminarProducto(seccion.id, p.id)}
                          className="rounded-xl bg-white px-3 text-marca-rojo border border-gray-200"
                          aria-label="Eliminar producto"
                        >
                          <IconoBasura width={20} height={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <input
                    className="campo mt-2 py-2"
                    value={p.descripcion}
                    onChange={(e) =>
                      cambiarProducto(seccion.id, p.id, 'descripcion', e.target.value)
                    }
                    placeholder="Descripción"
                  />
                  <SubidorFoto
                    valor={p.foto}
                    onChange={(url) => cambiarProducto(seccion.id, p.id, 'foto', url)}
                    carpeta="productos"
                    className="mt-2"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => agregarProducto(seccion.id)}
              className="btn-suave mt-3 w-full py-2 text-sm"
            >
              <IconoMas width={18} height={18} /> Agregar producto
            </button>
          </div>
        ))}
      </section>

      {/* Acciones */}
      <div className="sticky bottom-0 flex gap-2 bg-white pt-2 pb-1">
        <button type="button" onClick={onCancelar} className="btn-suave flex-1">
          Cancelar
        </button>
        <button type="submit" className="btn-primario flex-1">
          Guardar
        </button>
      </div>
    </form>
  )
}
