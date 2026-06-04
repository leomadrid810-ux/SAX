import { createClient } from '@supabase/supabase-js'

// Las credenciales se leen de variables de entorno (Vite expone las que
// empiezan con VITE_). En local van en un archivo .env; en Vercel se
// configuran en Settings → Environment Variables.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si faltan, la app muestra un mensaje claro en vez de romperse.
export const supabaseConfigurado = Boolean(url && anonKey)

export const supabase = supabaseConfigurado ? createClient(url, anonKey) : null
