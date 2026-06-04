# 🍴 TuMenú — Directorio de restaurantes locales (PWA)

App web progresiva (instalable y con soporte offline) para mostrar restaurantes locales, sus menús, horarios y contacto por WhatsApp. Hecha con **React + Tailwind CSS** y datos guardados en **localStorage**.

## 🚀 Cómo ejecutar

```bash
npm install
npm run dev
```

Abre la dirección que muestra la terminal (por defecto `http://localhost:5173`).

Para generar la versión de producción:

```bash
npm run build
npm run preview
```

## 📱 Funcionalidades

### Para usuarios (público)
- Pantalla principal con todos los restaurantes en tarjetas.
- Filtros por categoría (Tacos, Pizzas, Pollos, Hamburguesas, Mariscos, Postres, Sushi, Café, Bebidas).
- Buscador por nombre.
- Cada tarjeta muestra foto, nombre, categoría, horario y si está **abierto/cerrado ahora**.
- Página de cada restaurante con menú completo (categorías, productos, fotos y precios).
- Botón de **WhatsApp** para contactar al negocio.
- Botón de **ayuda** (cómo usar la app) y de **contacto** (negocios que quieren unirse).

### Panel de administrador — ruta `/admin`
- Login con contraseña.
- Gestión de restaurantes: agregar, editar, activar/desactivar y eliminar.
- Edición completa: datos, horarios, credenciales del dueño y menú.
- Panel de solicitudes de negocios que quieren unirse.
- Cambio de contraseña y restablecimiento de datos.

**Contraseña de ejemplo:** `admin123`

### Panel de negocio — ruta `/negocio/login`
- Login con usuario y contraseña por negocio.
- El dueño solo edita **su propio** restaurante y menú; no ve otros negocios.

**Cuentas de ejemplo:**
| Usuario | Contraseña |
|---------|-----------|
| donpepe | pepe123 |
| bella   | bella123 |
| sirena  | sirena123 |

## 🎨 Diseño
- Fondo blanco `#FFFFFF`, naranja `#F97316`, rojo `#EF4444`, texto `#1F2937`, tarjetas `#F9FAFB`.
- Tipografía Nunito / Inter, mínimo 16px.
- Mobile-first, botones grandes, todo en español.

## 🛠️ Técnico
- React 18 + React Router (HashRouter) + Tailwind CSS 3 + Vite.
- Datos en `localStorage` (clave `tumenu:datos:v1`).
- `public/manifest.json` + `public/sw.js` para PWA instalable y offline.
- 3 restaurantes de ejemplo con menús precargados.

## 📂 Estructura
```
src/
  components/   Componentes reutilizables (tarjetas, modales, editor, iconos)
  data/         Datos de ejemplo (categorías y restaurantes)
  pages/        Inicio, detalle, admin/, negocio/
  store/        Estado global (localStorage) y sesión
  utils/        Utilidades (horarios, precios, WhatsApp)
public/
  manifest.json, sw.js, icons/
```

> Nota: las fotos de ejemplo se cargan desde internet (Unsplash). El **app shell** funciona offline gracias al Service Worker; las imágenes remotas requieren conexión la primera vez.
