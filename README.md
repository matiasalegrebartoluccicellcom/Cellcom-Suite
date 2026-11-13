# CELLCOM Suite — GitHub Pages + Supabase

## 1. Supabase
1. Crear proyecto en supabase.com (región São Paulo, la más cercana).
2. **SQL Editor** → correr en orden: `sql/01_esquema.sql`, `sql/02_menu_inicial.sql`, `sql/03_login_usuarios.sql`.
3. Botón **Connect** (o Data API + API Keys): copiar la URL y la clave anon/publishable a `config.js`.

## 2. Login con usuario + contraseña
No se usan mails personales. Cada vendedor tiene un mail "falso" `usuario@cellcom.local`
y en la app escribe solo su usuario.

**Authentication → Sign In / Providers:**
- **Email**: activado, **Confirm email: desactivado**.
- **Allow new users to sign up: desactivado** (los usuarios los crea un admin).

**Authentication → URL Configuration:**
- Site URL: `https://TU-USUARIO.github.io/cellcom-suite/`

## 3. GitHub Pages
1. Repo nuevo `cellcom-suite`, subir: `index.html`, `app.js`, `config.js`, `styles.css` (la carpeta `sql/` es opcional).
2. Settings → Pages → Deploy from branch → `main` / root.

## 4. Crear usuarios
**Authentication → Users → Add user → Create new user**
- Email: `juan@cellcom.local` · Password: la que le des · ✅ Auto Confirm User

Después, en SQL Editor (o Table Editor → perfiles):
```sql
update perfiles
set nombre = 'Juan Pérez', rol = 'vendedor',
    sucursal_id = (select id from sucursales where nombre = 'Centro')
where usuario = 'juan';
```
Roles: `vendedor`, `supervisor`, `gerencia`, `admin`. Tu propio usuario: lo mismo con `rol = 'admin'`.

**Se olvidó la contraseña:** Authentication → Users → el usuario → Reset / cambiar password.
**Dar de baja:** `update perfiles set activo = false where usuario = 'juan';`

## Uso diario
- **Enchufar una herramienta:** Table Editor → `modulos` → poner el link en `url`.
- **Avisos:** Table Editor → `notificaciones` → nueva fila. `para_rol` vacío = todos; o un rol; o `para_usuario` para una persona.
- **Backup:** cada tanto, Table Editor → exportar CSV de las tablas importantes (el plan gratis no hace backups).

## Seguridad
- La clave anon es pública, no pasa nada que esté en el repo: lo que cada uno ve lo decide RLS en la base.
- Nunca subir la clave `service_role` / secret.
