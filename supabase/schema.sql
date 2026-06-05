-- ============================================================
--  SAX · Esquema de base de datos para Supabase
--  Pega TODO este archivo en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- ---------- TABLAS ----------

-- Negocios (datos públicos del directorio). NO guarda contraseñas.
create table if not exists negocios (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  tipos       text[] default '{}',          -- categorías de filtro: tacos, pizzas, etc.
  foto        text,
  descripcion text,
  direccion   text,
  telefono    text,
  whatsapp    text,
  usuario     text,                          -- usuario de acceso (nombre, no sensible)
  activo      boolean default true,
  creado      date default current_date,
  horario     jsonb,
  override     jsonb,                         -- estado manual: {estado:'abierto'|'cerrado', fecha:'YYYY-MM-DD'}
  created_at  timestamptz default now()
);

-- Categorías del menú (secciones dentro de cada negocio)
create table if not exists categorias (
  id          uuid primary key default gen_random_uuid(),
  negocio_id  uuid references negocios(id) on delete cascade,
  nombre      text not null,
  orden       int default 0,
  created_at  timestamptz default now()
);

-- Productos (dentro de cada categoría de menú)
create table if not exists productos (
  id            uuid primary key default gen_random_uuid(),
  categoria_id  uuid references categorias(id) on delete cascade,
  nombre        text not null,
  descripcion   text,
  precio        numeric default 0,
  foto          text,
  orden         int default 0,
  created_at    timestamptz default now()
);

-- Solicitudes de negocios que quieren unirse
create table if not exists solicitudes (
  id             uuid primary key default gen_random_uuid(),
  nombre_negocio text not null,
  contacto       text,
  whatsapp       text,
  mensaje        text,
  fecha          date default current_date,
  estado         text default 'pendiente',
  created_at     timestamptz default now()
);

-- Contraseñas de los negocios (TABLA BLOQUEADA: solo accesible vía funciones)
create table if not exists credenciales (
  negocio_id uuid primary key references negocios(id) on delete cascade,
  password   text
);

-- Configuración (contraseña de admin, etc.) (TABLA BLOQUEADA)
create table if not exists config (
  clave text primary key,
  valor text
);
insert into config (clave, valor) values ('admin_password', 'admin123')
  on conflict (clave) do nothing;

-- ---------- SEGURIDAD (Row Level Security) ----------

alter table negocios     enable row level security;
alter table categorias   enable row level security;
alter table productos    enable row level security;
alter table solicitudes  enable row level security;
alter table credenciales enable row level security;
alter table config       enable row level security;

-- Datos del directorio: lectura y escritura abiertas (MVP).
-- ⚠️ Las pantallas de admin/negocio siguen protegidas por contraseña en la app.
drop policy if exists "acceso_publico" on negocios;
create policy "acceso_publico" on negocios    for all using (true) with check (true);
drop policy if exists "acceso_publico" on categorias;
create policy "acceso_publico" on categorias  for all using (true) with check (true);
drop policy if exists "acceso_publico" on productos;
create policy "acceso_publico" on productos   for all using (true) with check (true);
drop policy if exists "acceso_publico" on solicitudes;
create policy "acceso_publico" on solicitudes for all using (true) with check (true);

-- credenciales y config: SIN políticas => inaccesibles desde el cliente.
revoke all on credenciales from anon, authenticated;
revoke all on config       from anon, authenticated;

grant select, insert, update, delete on negocios, categorias, productos, solicitudes to anon, authenticated;

-- ---------- FUNCIONES DE ACCESO (seguras) ----------

-- Verifica la contraseña de admin sin exponerla.
create or replace function verificar_admin(p_password text)
returns boolean
language sql security definer set search_path = public as $$
  select exists (select 1 from config where clave = 'admin_password' and valor = p_password);
$$;

-- Login de negocio: devuelve el id si usuario + contraseña coinciden, si no NULL.
create or replace function login_negocio(p_usuario text, p_password text)
returns uuid
language sql security definer set search_path = public as $$
  select n.id
  from negocios n
  join credenciales c on c.negocio_id = n.id
  where n.usuario = p_usuario and c.password = p_password
  limit 1;
$$;

-- Guarda/actualiza la contraseña de un negocio (la usa el panel admin).
create or replace function set_credenciales(p_negocio_id uuid, p_password text)
returns void
language sql security definer set search_path = public as $$
  insert into credenciales (negocio_id, password)
  values (p_negocio_id, p_password)
  on conflict (negocio_id) do update set password = excluded.password;
$$;

-- Cambia la contraseña de admin.
create or replace function set_admin_password(p_nueva text)
returns void
language sql security definer set search_path = public as $$
  update config set valor = p_nueva where clave = 'admin_password';
$$;

grant execute on function verificar_admin(text)            to anon, authenticated;
grant execute on function login_negocio(text, text)        to anon, authenticated;
grant execute on function set_credenciales(uuid, text)     to anon, authenticated;
grant execute on function set_admin_password(text)         to anon, authenticated;

-- ============================================================
--  DATOS DE EJEMPLO (3 negocios con menú)
-- ============================================================

-- Negocio 1: Tacos Don Pepe
insert into negocios (id, nombre, tipos, foto, descripcion, direccion, telefono, whatsapp, usuario, activo, creado, horario)
values (
  'a0000000-0000-0000-0000-000000000001',
  'Tacos Don Pepe',
  '{tacos,antojitos}',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  'Somos un negocio familiar con más de 20 años de tradición. Los tacos al pastor más sabrosos de la colonia, con tortilla recién hecha a mano y salsas preparadas en casa todos los días. ¡Te esperamos!',
  'Av. Revolución 245, Col. Centro, Ciudad de México, CDMX',
  '5512345678', '5215512345678', 'donpepe', true, '2026-01-15',
  '{"lun":{"abierto":true,"apertura":"10:00","cierre":"23:00"},"mar":{"abierto":true,"apertura":"10:00","cierre":"23:00"},"mie":{"abierto":true,"apertura":"10:00","cierre":"23:00"},"jue":{"abierto":true,"apertura":"10:00","cierre":"23:00"},"vie":{"abierto":true,"apertura":"10:00","cierre":"23:00"},"sab":{"abierto":true,"apertura":"10:00","cierre":"23:00"},"dom":{"abierto":true,"apertura":"10:00","cierre":"23:00"}}'
) on conflict (id) do nothing;

insert into categorias (id, negocio_id, nombre, orden) values
  ('b0000000-0000-0000-0000-000000000011','a0000000-0000-0000-0000-000000000001','Tacos',0),
  ('b0000000-0000-0000-0000-000000000012','a0000000-0000-0000-0000-000000000001','Antojitos',1),
  ('b0000000-0000-0000-0000-000000000013','a0000000-0000-0000-0000-000000000001','Bebidas',2)
  on conflict (id) do nothing;

insert into productos (categoria_id, nombre, descripcion, precio, foto, orden) values
  ('b0000000-0000-0000-0000-000000000011','Taco al Pastor','Carne de cerdo adobada, piña, cebolla y cilantro.',18,'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&q=80',0),
  ('b0000000-0000-0000-0000-000000000011','Taco de Bistec','Bistec a la plancha con cebollita y guacamole.',22,'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80',1),
  ('b0000000-0000-0000-0000-000000000011','Taco de Suadero','Suadero dorado, doble tortilla y salsa verde.',20,'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=600&q=80',2),
  ('b0000000-0000-0000-0000-000000000012','Quesadilla de Flor de Calabaza','Tortilla hecha a mano con queso y flor de calabaza.',35,'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=600&q=80',0),
  ('b0000000-0000-0000-0000-000000000013','Agua de Horchata','Vaso grande de horchata fresca.',25,'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80',0),
  ('b0000000-0000-0000-0000-000000000013','Refresco','Lata 355ml, varios sabores.',20,'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80',1);

-- Negocio 2: Pizzería Bella Napoli
insert into negocios (id, nombre, tipos, foto, descripcion, direccion, telefono, whatsapp, usuario, activo, creado, horario)
values (
  'a0000000-0000-0000-0000-000000000002',
  'Pizzería Bella Napoli',
  '{pizzas}',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
  'Auténtica pizza artesanal horneada en horno de leña. Usamos masa madre fermentada 48 horas e ingredientes importados de Italia. Un pedacito de Nápoles en tu colonia.',
  'Calle Madero 88, Col. Roma Norte, Ciudad de México, CDMX',
  '5587654321', '5215587654321', 'bella', true, '2026-05-20',
  '{"lun":{"abierto":true,"apertura":"13:00","cierre":"22:30"},"mar":{"abierto":true,"apertura":"13:00","cierre":"22:30"},"mie":{"abierto":true,"apertura":"13:00","cierre":"22:30"},"jue":{"abierto":true,"apertura":"13:00","cierre":"22:30"},"vie":{"abierto":true,"apertura":"13:00","cierre":"22:30"},"sab":{"abierto":true,"apertura":"13:00","cierre":"22:30"},"dom":{"abierto":false,"apertura":"13:00","cierre":"22:30"}}'
) on conflict (id) do nothing;

insert into categorias (id, negocio_id, nombre, orden) values
  ('b0000000-0000-0000-0000-000000000021','a0000000-0000-0000-0000-000000000002','Pizzas',0),
  ('b0000000-0000-0000-0000-000000000022','a0000000-0000-0000-0000-000000000002','Entradas',1)
  on conflict (id) do nothing;

insert into productos (categoria_id, nombre, descripcion, precio, foto, orden) values
  ('b0000000-0000-0000-0000-000000000021','Margarita','Salsa de tomate, mozzarella fresca y albahaca.',145,'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80',0),
  ('b0000000-0000-0000-0000-000000000021','Pepperoni','Doble pepperoni y queso mozzarella.',165,'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',1),
  ('b0000000-0000-0000-0000-000000000021','Cuatro Quesos','Mozzarella, gorgonzola, parmesano y de cabra.',180,'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80',2),
  ('b0000000-0000-0000-0000-000000000022','Pan de Ajo','Pan recién horneado con mantequilla de ajo y queso.',65,'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600&q=80',0);

-- Negocio 3: Mariscos La Sirena
insert into negocios (id, nombre, tipos, foto, descripcion, direccion, telefono, whatsapp, usuario, activo, creado, horario)
values (
  'a0000000-0000-0000-0000-000000000003',
  'Mariscos La Sirena',
  '{mariscos,economica}',
  'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80',
  'Mariscos frescos del día traídos directamente de la costa. Cocteles, tostadas y aguachiles preparados al momento. Ambiente familiar y los mejores precios de la zona.',
  'Av. del Mar 1520, Col. Las Palmas, Mazatlán, Sinaloa',
  '6699887766', '5216699887766', 'sirena', true, '2026-02-10',
  '{"lun":{"abierto":true,"apertura":"11:00","cierre":"19:00"},"mar":{"abierto":true,"apertura":"11:00","cierre":"19:00"},"mie":{"abierto":true,"apertura":"11:00","cierre":"19:00"},"jue":{"abierto":true,"apertura":"11:00","cierre":"19:00"},"vie":{"abierto":true,"apertura":"11:00","cierre":"19:00"},"sab":{"abierto":true,"apertura":"11:00","cierre":"19:00"},"dom":{"abierto":true,"apertura":"11:00","cierre":"19:00"}}'
) on conflict (id) do nothing;

insert into categorias (id, negocio_id, nombre, orden) values
  ('b0000000-0000-0000-0000-000000000031','a0000000-0000-0000-0000-000000000003','Cócteles',0),
  ('b0000000-0000-0000-0000-000000000032','a0000000-0000-0000-0000-000000000003','Tostadas',1),
  ('b0000000-0000-0000-0000-000000000033','a0000000-0000-0000-0000-000000000003','Comida Corrida',2)
  on conflict (id) do nothing;

insert into productos (categoria_id, nombre, descripcion, precio, foto, orden) values
  ('b0000000-0000-0000-0000-000000000031','Cóctel de Camarón','Camarón fresco, salsa de la casa, aguacate y galletas.',120,'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=600&q=80',0),
  ('b0000000-0000-0000-0000-000000000031','Campechana','Mezcla de camarón, pulpo y ostión.',160,'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=600&q=80',1),
  ('b0000000-0000-0000-0000-000000000032','Tostada de Ceviche','Pescado fresco marinado en limón con pico de gallo.',55,'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&q=80',0),
  ('b0000000-0000-0000-0000-000000000032','Aguachile Verde','Camarón crudo en salsa de chile verde y limón.',140,'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80',1),
  ('b0000000-0000-0000-0000-000000000033','Filete de Pescado','Filete a la plancha con arroz, ensalada y tortillas.',95,'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80',0);

-- Contraseñas de los negocios de ejemplo
select set_credenciales('a0000000-0000-0000-0000-000000000001','pepe123');
select set_credenciales('a0000000-0000-0000-0000-000000000002','bella123');
select set_credenciales('a0000000-0000-0000-0000-000000000003','sirena123');

-- Solicitud de ejemplo
insert into solicitudes (nombre_negocio, contacto, whatsapp, mensaje, fecha, estado)
values ('Pollos El Buen Sabor','María González','5215511223344','Tenemos un local de pollos rostizados y nos gustaría aparecer en la app.','2026-05-28','pendiente');

-- ---------- STORAGE: Bucket de imágenes ----------
-- Bucket público "fotos" para subir imágenes desde el panel de negocio y admin.

insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

-- Lectura pública (cualquiera puede ver las fotos)
drop policy if exists "fotos_lectura_publica" on storage.objects;
create policy "fotos_lectura_publica" on storage.objects
  for select using (bucket_id = 'fotos');

-- Subida permitida desde la app (anon key)
drop policy if exists "fotos_subida_anonima" on storage.objects;
create policy "fotos_subida_anonima" on storage.objects
  for insert with check (bucket_id = 'fotos');

-- Reemplazar fotos existentes (upsert)
drop policy if exists "fotos_actualizacion_anonima" on storage.objects;
create policy "fotos_actualizacion_anonima" on storage.objects
  for update using (bucket_id = 'fotos');

-- ✅ Listo. La app ya puede leer y escribir aquí.
