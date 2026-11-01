# Registro de promoción WAYU

Proyecto local: `D:\LESLY\WAYU\web\wayu.frontend`.

## Supabase

Organización **WAYU**, proyecto **wayu.frontend** (`erfjcxnmkteybbymygut`). La tabla `public.promotion_registrations` y las funciones de registro, confirmación del envío y validación del cupón ya están creadas. Migración aplicada: `20261101080459_promotion_registrations`.

Se verificó en la base real el registro, el bloqueo de duplicados, el reintento con el mismo código, el tiempo de espera entre envíos, la caducidad y los permisos. Las pruebas se ejecutaron en una transacción revertida; no dejaron contactos ni enviaron correos.

El 01/11/2026 también se completó una prueba real de la integración del servidor: se guardó el contacto **Prueba de registro WAYU** con el correo del propietario, Gmail aceptó el mensaje y el código personal pasó la validación. Ese registro de prueba se conserva en la tabla. La aceptación SMTP no confirma la ubicación del mensaje en la bandeja de entrada; revisar también spam.

La tabla guarda nombre completo, celular, correo normalizado, campaña, código individual, porcentaje, producto, consentimiento y estado de entrega. Está protegida con RLS; `anon` y `authenticated` no pueden leer ni escribir. Solo el servidor usa la clave secreta. El aviso informativo de Supabase `RLS Enabled No Policy` es intencional: no hay políticas de acceso para visitantes y sus permisos están revocados.

El registro utiliza funciones `SECURITY INVOKER`, sin ampliar los privilegios de quien las llama. El mismo correo obtiene el mismo código por campaña y un segundo formulario no cambia los datos existentes. Los envíos se reservan por dos minutos para evitar solicitudes simultáneas. Hay límites por correo y globales.

## Configuración privada

En `.env.local`:

```dotenv
SUPABASE_URL=https://erfjcxnmkteybbymygut.supabase.co
SUPABASE_SERVICE_ROLE_KEY=clave_secreta_de_tu_proyecto
SMTP_USER=lessdlcc@gmail.com
SMTP_APP_PASSWORD=contraseña_de_aplicación_de_Google
APP_URL=http://127.0.0.1:3011
```

No pegar claves en el chat, no subir `.env.local` a Git y no usar el prefijo `NEXT_PUBLIC_` para secretos. El nombre `SUPABASE_SERVICE_ROLE_KEY` acepta tanto una clave secreta moderna `sb_secret_...` como una clave heredada `service_role`.

Gmail usa `smtp.gmail.com:465` con TLS. La contraseña debe ser una [contraseña de aplicación de Google](https://myaccount.google.com/apppasswords), no la contraseña normal de la cuenta. Requiere la verificación en dos pasos y que esa opción esté disponible para la cuenta. La dirección autenticada es el remitente real.

Al publicar la web, cambiar `APP_URL` por su URL pública y configurar los mismos secretos en el servidor de alojamiento. Un enlace a `127.0.0.1` solo funciona en la misma computadora. Reiniciar Next.js al cambiar variables.

## Verificación

```sh
npm test
npm run typecheck
npm run build
npm run check:registration -- --remote
```

La última comprobación valida Supabase y autentica Gmail, sin enviar correos. Para comprobar solo Gmail: `npm run check:registration -- --smtp-only`.

Prueba real opcional, que crea un registro y envía un correo al propietario (no se ejecuta con `npm test`):

```sh
node --env-file=.env.local --conditions=react-server --import tsx scripts/test-registration-live.ts --send-to-owner
```

Este comando utiliza el mismo analizador de formulario y los mismos servicios de registro, Gmail y validación que la aplicación. Tiene un destinatario fijo autorizado para evitar envíos accidentales a terceros y está sujeto a los mismos límites de reenvío de la campaña.

Con todo configurado, registrarse con un correo propio desde el formulario y comprobar la fila, el mensaje recibido y el cupón en la bolsa. La web solo confirma el envío después de que Gmail acepte el mensaje; eso no garantiza que aparezca en la bandeja principal. Revisar también spam. Si el envío falla, el registro y el código se conservan para un reintento.

## Alcance

Registro de campaña con nombre, celular y correo, sin cuentas con contraseña. Códigos individuales aleatorios del 10%, válidos para el set PRM y verificables en Supabase. No hay pagos reales ni pedidos comerciales. El código no es válido en la tienda oficial de Wayu. No se suscribe al usuario a otras campañas ni se envían SMS. `/privacidad` explica el uso de sus datos y cómo solicitar su eliminación.
