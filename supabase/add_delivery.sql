-- Agrega soporte de delivery a la tabla negocios
alter table negocios
  add column if not exists delivery       text check (delivery in ('no', 'si', 'minimo')),
  add column if not exists delivery_minimo numeric;
