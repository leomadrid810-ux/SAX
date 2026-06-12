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
//  - modoSimple: UI accesible con textos grandes y ayudas (panel negocio)
export default function EditorRestaurante({
  restaurante,
  onGuardar,
  onCancelar,
  permitirCredenciales = false,
  permitirCategorias = false,
  modoSimple = false,
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
    delivery: restaurante?.delivery || 'no',
    delivery_minimo: restaurante?.delivery_minimo || '',
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
      menu: [{ id: nuevoId('cat'), nombre: 'Nueva categoría', productos: [] }, ...f.menu],
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

  // Helpers de estilo según modo
  const lbl = modoSimple
    ? 'mb-2 block text-base font-bold text-gray-700'
    : 'etiqueta'
  const secTitle = modoSimple
    ? 'text-xl font-black text-marca-texto'
    : 'text-base font-black text-marca-texto'
  const gap = modoSimple ? 'space-y-5' : 'space-y-3'

  // Texto de ayuda debajo de un campo (solo en modoSimple)
  const hint = (text) =>
    modoSimple ? (
      <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{text}</p>
    ) : null

  return (
    <form onSubmit={guardar} className={modoSimple ? 'space-y-8 p-4' : 'space-y-6'}>

      {/* ── Información del negocio ─────────────────────────── */}
      <section className={gap}>
        <h3 className={secTitle}>Información del negocio</h3>

        <div>
          <label className={lbl}>Nombre del negocio *</label>
          <input className="campo" value={form.nombre} onChange={set('nombre')} required />
          {hint('El nombre que verán los clientes cuando busquen tu negocio.')}
        </div>

        <div>
          <label className={lbl}>Categorías</label>
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
          <label className={lbl}>Foto del negocio</label>
          <SubidorFoto
            valor={form.foto}
            onChange={(url) => setForm((f) => ({ ...f, foto: url }))}
            carpeta="negocios"
          />
          {hint('Sube una foto de tu local o tus platillos. Aparecerá en la parte de arriba de tu página.')}
        </div>

        <div>
          <label className={lbl}>Descripción de tu negocio</label>
          <textarea
            className="campo"
            rows={modoSimple ? 5 : 4}
            value={form.descripcion}
            onChange={set('descripcion')}
            placeholder="Cuéntale a tus clientes quién eres, qué ofreces y qué te hace especial."
          />
          {hint('Escribe 2 o 3 oraciones contando qué vendes y qué te hace especial. No hace falta escribir mucho.')}
        </div>

        <div>
          <label className={lbl}>Dirección completa</label>
          <input
            className="campo"
            value={form.direccion}
            onChange={set('direccion')}
            placeholder="Calle, número, colonia, ciudad"
          />
          {hint('Escribe la dirección completa para que los clientes sepan dónde encontrarte. Ej: Av. Principal 123, Col. Centro, Mérida.')}
        </div>

        <div>
          <label className={lbl}>Teléfono para llamar</label>
          <input
            className="campo"
            value={form.telefono}
            onChange={set('telefono')}
            placeholder="Ej. 5512345678"
            inputMode="tel"
          />
          {hint('Número para que los clientes te llamen directamente. Solo escribe los números, sin espacios ni guiones.')}
        </div>

        <div>
          <label className={lbl}>Número de WhatsApp</label>
          <input
            className="campo"
            value={form.whatsapp}
            onChange={set('whatsapp')}
            placeholder="Ej. 5215512345678"
            inputMode="tel"
          />
          {hint('Número con código de país. Para México empieza con 521. Ejemplo: 5215512345678.')}
        </div>

        {/* Redes sociales */}
        <div className={`rounded-2xl border border-gray-100 bg-marca-tarjeta p-4 ${modoSimple ? 'space-y-5' : 'space-y-3'}`}>
          <p className={modoSimple ? 'text-base font-black text-marca-texto' : 'text-sm font-black text-marca-texto'}>
            Redes sociales y sitio web{' '}
            <span className="font-normal text-gray-400">(opcional)</span>
          </p>
          <div>
            <label className={lbl}>📘 Facebook</label>
            <input
              className="campo"
              value={form.facebook}
              onChange={set('facebook')}
              placeholder="https://facebook.com/tu-pagina  o  nombre-de-pagina"
              inputMode="url"
            />
            {hint('Pega el enlace de tu página de Facebook o escribe solo el nombre de tu página.')}
          </div>
          <div>
            <label className={lbl}>📸 Instagram</label>
            <input
              className="campo"
              value={form.instagram}
              onChange={set('instagram')}
              placeholder="@tu_usuario  o  https://instagram.com/tu_usuario"
            />
            {hint('Escribe tu nombre de usuario de Instagram. Ejemplo: @minegocio.')}
          </div>
          <div>
            <label className={lbl}>🎵 TikTok</label>
            <input
              className="campo"
              value={form.tiktok}
              onChange={set('tiktok')}
              placeholder="@tu_usuario  o  https://tiktok.com/@tu_usuario"
            />
            {hint('Escribe tu nombre de usuario de TikTok. Ejemplo: @minegocio.')}
          </div>
          <div>
            <label className={lbl}>🌐 Sitio web</label>
            <input
              className="campo"
              value={form.sitio_web}
              onChange={set('sitio_web')}
              placeholder="https://tu-sitio.com"
              inputMode="url"
            />
            {hint('Pega el enlace completo de tu sitio web. Ejemplo: https://minegocio.com.')}
          </div>
        </div>
      </section>

      {/* ── Delivery ────────────────────────────────────────── */}
      <section className={`rounded-2xl bg-marca-tarjeta p-4 ${modoSimple ? 'space-y-5' : 'space-y-3'}`}>
        <h3 className={secTitle}>Servicio a domicilio</h3>
        <div>
          <label className={lbl}>¿Haces entregas a domicilio?</label>
          <select className="campo" value={form.delivery} onChange={set('delivery')}>
            <option value="no">No, no hago entregas a domicilio</option>
            <option value="si">Sí, hago entregas a domicilio</option>
            <option value="minimo">Sí, pero a partir de un monto mínimo</option>
          </select>
          {hint('Indica si puedes llevar los pedidos hasta la casa del cliente.')}
        </div>
        {form.delivery === 'minimo' && (
          <div>
            <label className={lbl}>¿Desde qué precio haces la entrega? ($)</label>
            <input
              className="campo"
              type="number"
              value={form.delivery_minimo}
              onChange={set('delivery_minimo')}
              placeholder="Ej. 150"
              inputMode="numeric"
            />
            {hint('Escribe el precio mínimo en pesos para que hagas una entrega. Solo el número, sin el signo $.')}
          </div>
        )}
      </section>

      {/* ── Credenciales (solo admin) ────────────────────────── */}
      {permitirCredenciales && (
        <section className="space-y-3 rounded-2xl bg-marca-tarjeta p-4">
          <h3 className={secTitle}>Acceso del dueño (panel de negocio)</h3>
          <p className="text-sm text-gray-500">
            Con estos datos el dueño podrá entrar a <code>/negocio/login</code>.
          </p>
          <div>
            <label className={lbl}>Usuario</label>
            <input
              className="campo"
              value={form.usuario}
              onChange={set('usuario')}
              autoComplete="off"
            />
          </div>
          <div>
            <label className={lbl}>Contraseña</label>
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

      {/* ── Horario ──────────────────────────────────────────── */}
      <section className={modoSimple ? 'space-y-4' : 'space-y-2'}>
        <h3 className={secTitle}>Horario de atención</h3>
        {hint('Marca los días que abres. Para cada día activo escribe la hora de apertura y la hora de cierre.')}
        <div className={modoSimple ? 'space-y-3' : 'space-y-2'}>
          {ORDEN_DIAS.map((d) => {
            const h = form.horario[d]
            return (
              <div
                key={d}
                className={`flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white ${modoSimple ? 'p-3' : 'p-2'}`}
              >
                <label
                  className={`flex items-center gap-2 font-bold text-marca-texto ${
                    modoSimple ? 'w-32 text-base' : 'w-28'
                  }`}
                >
                  <input
                    type="checkbox"
                    className={`accent-marca-naranja ${modoSimple ? 'h-6 w-6' : 'h-5 w-5'}`}
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
                  <span className={`font-semibold text-gray-400 ${modoSimple ? 'text-base' : 'text-sm'}`}>
                    Cerrado
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Menú ─────────────────────────────────────────────── */}
      <section className={modoSimple ? 'space-y-4' : 'space-y-3'}>
        <div className={modoSimple ? 'space-y-3' : 'flex items-center justify-between'}>
          <h3 className={secTitle}>Mi menú de productos</h3>
          {modoSimple && (
            <p className="text-sm text-gray-500">
              Agrega grupos (por ejemplo: Tacos, Bebidas, Postres) y dentro de cada grupo pon tus productos con nombre, precio y foto.
            </p>
          )}
          <button
            type="button"
            onClick={agregarSeccion}
            className={modoSimple ? 'btn-primario w-full py-4 text-base' : 'btn-suave py-2 text-sm'}
          >
            <IconoMas width={modoSimple ? 22 : 18} height={modoSimple ? 22 : 18} />
            {modoSimple ? 'Agregar nueva sección al menú' : 'Categoría'}
          </button>
        </div>

        {form.menu.length === 0 && (
          <p className={`rounded-2xl bg-marca-tarjeta text-center text-gray-500 ${modoSimple ? 'p-6 text-base' : 'p-4 text-sm'}`}>
            {modoSimple
              ? 'Aún no tienes secciones en tu menú. Toca el botón de arriba para agregar la primera.'
              : 'Agrega categorías (ej. Tacos, Bebidas) y dentro sus productos.'}
          </p>
        )}

        {form.menu.map((seccion) => (
          <div key={seccion.id} className={`rounded-2xl border border-gray-200 ${modoSimple ? 'p-4' : 'p-3'}`}>
            {/* Encabezado de sección */}
            <div className={`flex items-center gap-2 ${modoSimple ? 'mb-4' : 'mb-3'}`}>
              {!modoSimple && <IconoLapiz width={18} height={18} className="text-gray-400" />}
              <div className="flex-1">
                {modoSimple && (
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                    Nombre de la sección
                  </p>
                )}
                <input
                  className={`campo font-bold ${modoSimple ? 'py-3 text-lg' : 'py-2'}`}
                  value={seccion.nombre}
                  onChange={(e) => renombrarSeccion(seccion.id, e.target.value)}
                  placeholder="Nombre de la categoría"
                />
              </div>
              <button
                type="button"
                onClick={() => eliminarSeccion(seccion.id)}
                className={`rounded-xl text-marca-rojo hover:bg-red-50 ${
                  modoSimple
                    ? 'flex items-center gap-1.5 border border-red-200 px-3 py-2 text-sm font-bold'
                    : 'p-2'
                }`}
                aria-label="Eliminar sección"
              >
                <IconoBasura width={20} height={20} />
                {modoSimple && <span>Eliminar sección</span>}
              </button>
            </div>

            {/* Productos */}
            <div className={modoSimple ? 'space-y-4' : 'space-y-3'}>
              {seccion.productos.map((p) => (
                <div key={p.id} className={`rounded-2xl bg-marca-tarjeta ${modoSimple ? 'p-4' : 'p-3'}`}>
                  {modoSimple && (
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-500">Producto</p>
                      <button
                        type="button"
                        onClick={() => eliminarProducto(seccion.id, p.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-1.5 text-sm font-bold text-marca-rojo hover:bg-red-50"
                      >
                        <IconoBasura width={18} height={18} /> Eliminar producto
                      </button>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <ImagenSegura
                      src={p.foto}
                      alt={p.nombre || 'Producto'}
                      className={`shrink-0 rounded-xl object-cover ${modoSimple ? 'h-20 w-20' : 'h-16 w-16'}`}
                    />
                    <div className="flex-1 space-y-2">
                      {modoSimple && (
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          Nombre del producto
                        </p>
                      )}
                      <input
                        className={`campo ${modoSimple ? 'py-3' : 'py-2'}`}
                        value={p.nombre}
                        onChange={(e) =>
                          cambiarProducto(seccion.id, p.id, 'nombre', e.target.value)
                        }
                        placeholder="Nombre del producto"
                      />
                      <div className="flex gap-2">
                        <div className={modoSimple ? 'flex-1' : ''}>
                          {modoSimple && (
                            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                              Precio en pesos ($)
                            </p>
                          )}
                          <input
                            className={`campo ${modoSimple ? 'w-full py-3' : 'w-32 py-2'}`}
                            type="number"
                            min="0"
                            step="1"
                            value={p.precio}
                            onChange={(e) =>
                              cambiarProducto(seccion.id, p.id, 'precio', e.target.value)
                            }
                            placeholder="Precio"
                          />
                        </div>
                        {!modoSimple && (
                          <button
                            type="button"
                            onClick={() => eliminarProducto(seccion.id, p.id)}
                            className="rounded-xl border border-gray-200 bg-white px-3 text-marca-rojo"
                            aria-label="Eliminar producto"
                          >
                            <IconoBasura width={20} height={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {modoSimple && (
                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                      Descripción (opcional)
                    </p>
                  )}
                  <input
                    className={`campo ${modoSimple ? 'mt-1 py-3' : 'mt-2 py-2'}`}
                    value={p.descripcion}
                    onChange={(e) =>
                      cambiarProducto(seccion.id, p.id, 'descripcion', e.target.value)
                    }
                    placeholder={
                      modoSimple
                        ? 'Describe el producto brevemente: ingredientes, tamaño, sabores…'
                        : 'Descripción'
                    }
                  />
                  <SubidorFoto
                    valor={p.foto}
                    onChange={(url) => cambiarProducto(seccion.id, p.id, 'foto', url)}
                    carpeta="productos"
                    className="mt-2"
                  />
                  {modoSimple && (
                    <p className="mt-1.5 text-xs text-gray-400">
                      Sube una foto del producto para que los clientes lo vean.
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => agregarProducto(seccion.id)}
              className={`mt-3 w-full ${modoSimple ? 'btn-suave py-4 text-base' : 'btn-suave py-2 text-sm'}`}
            >
              <IconoMas width={modoSimple ? 22 : 18} height={modoSimple ? 22 : 18} />
              {modoSimple ? `Agregar producto a "${seccion.nombre}"` : 'Agregar producto'}
            </button>
          </div>
        ))}
      </section>

      {/* ── Acciones finales ─────────────────────────────────── */}
      {modoSimple ? (
        <div className="sticky bottom-0 space-y-2 bg-white pt-4 pb-2">
          <button type="submit" className="btn-primario w-full py-5 text-xl">
            ✅ Guardar todos mis cambios
          </button>
          <button type="button" onClick={onCancelar} className="btn-suave w-full py-4 text-base">
            Salir sin guardar
          </button>
        </div>
      ) : (
        <div className="sticky bottom-0 flex gap-2 bg-white pt-2 pb-1">
          <button type="button" onClick={onCancelar} className="btn-suave flex-1">
            Cancelar
          </button>
          <button type="submit" className="btn-primario flex-1">
            Guardar
          </button>
        </div>
      )}
    </form>
  )
}
