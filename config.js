// Datos de tu proyecto: Supabase > Project Settings > API
// La clave "anon" / "publishable" es pública y puede ir en el repo (la seguridad la da RLS).
// NUNCA pongas acá la clave "service_role" / "secret".
const SUPABASE_URL = 'https://zdryvibetbohfogxgxbt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_34JfXjzZOWWxSNbUapYr-Q_F0_WxfhZ';

// Dominio "falso" para los usuarios: el vendedor escribe "juan" y entra como juan@cellcom.local.
// No es un mail real, no se manda nada. Si Supabase no lo acepta, cambialo (ej: 'cellcom.com.ar').
const DOMINIO_USUARIOS = 'cellcom.local';
