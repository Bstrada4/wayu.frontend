# Wayu · Fiestas Patrias

Proyecto académico independiente, construido con Next.js 16.4.3 (estable consultada en npm), React 19.3.1 y TypeScript.

## Ejecutar

```sh
npm install
npm run dev
```

Abrir http://127.0.0.1:3000. Para producción: `npm run build` y `npm start`.

## Renderizado y promoción

- App Router con SSR por solicitud (`dynamic = 'force-dynamic'`). El HTML inicial incluye el contenido; los controles se hidratan en cliente.
- Modal accesible con `<dialog>`, apertura inicial, cierre con Escape o botón y bloqueo de scroll. Puede reabrirse desde la franja superior y la ficha del producto.
- Server Action con validación de nombre y apellido, celular peruano, correo y consentimiento. Guarda el registro en Supabase y solicita a Gmail el envío del código. Ver [configuración y verificación del registro](docs/registro-promocion.md).
- Cada persona recibe un código aleatorio `WAYU10-...`. El mismo correo conserva su código por campaña. La bolsa valida el cupón contra Supabase y calcula el 10% solo para las unidades del set PRM.
- La bolsa y el cupón se comparten entre las rutas y se conservan en `sessionStorage` durante la sesión del navegador. Allí solo se guardan identificadores de producto, cantidades y estado del cupón; los datos personales del registro se guardan en Supabase. El pop-up se abre al cargar o recargar y puede reabrirse desde la cabecera. Los correos son reales cuando Gmail está configurado; los pagos y pedidos siguen siendo simulados.
- La oferta del 10% es académica. Producto: [Set Tabla, Cuchillo y Tenedor PRM Wayu](https://wayu.com.pe/collections/sets/products/set-tabla-cuchillo-tenedor-prm-wayu). Precio de referencia: S/ 89.90, consultado el 25/10/2026. El precio de una unidad con descuento es S/ 80.91. Los importes se calculan en céntimos.

## Recursos

Marca Wayu y fotografías descargadas de https://wayu.com.pe/ y su CDN Shopify para uso académico. `premium-new.json` conserva la ficha del producto PRM indicado por el usuario; `premium.json` corresponde a la referencia inicial reemplazada. Los cinco archivos `public/images/premium-prm-*.jpg` corresponden al set correcto. `app/product.ts` centraliza sus datos, precio y galería.

La gráfica de campaña «Parrilleros, seámoslo siempre» proviene de los archivos proporcionados en `../logotipo/`. La versión de color se utiliza sobre el fondo claro de colecciones y la versión blanca en la campaña y el pop-up. La cabecera y el pie de página usan el logotipo WAYU. El pop-up de Fiestas Patrias combina ambos logotipos, rojo y blanco, una escarapela en CSS y las fechas 28 y 29 de julio. Tipografías DM Sans y Barlow Condensed de Google Fonts, con fuentes de respaldo locales. Interfaz adaptada a móvil y reducción de movimiento.

## Interfaces propias

- `/colecciones`: catálogo de ocho productos, búsqueda y orden por nombre/precio.
- `/colecciones/parrilla`, `/colecciones/cuchillos`, `/colecciones/bar-y-cocktail`: colecciones internas.
- `/productos/[slug]`: ficha de cada producto con galería, cantidades, características y productos relacionados.
- Todos los enlaces comerciales de la interfaz apuntan a rutas locales. Los datos e imágenes de referencia proceden de Wayu; las fichas adicionales consultadas se conservan en `references/`.
- La bolsa admite distintos productos. El cupón del 10% descuenta exclusivamente las unidades del set PRM, calculando importes en céntimos.
- Las páginas se renderizan en servidor por solicitud, con metadatos por colección/producto y respuestas 404 para identificadores inexistentes.

La promoción no es válida en Wayu oficial. Todas las colecciones y fichas se abren dentro de esta web. La compra sigue siendo simulada. La tabla `promotion_registrations` ya está creada en el proyecto Supabase `wayu.frontend` de la organización `WAYU`; la migración local conserva la misma versión aplicada en el servidor.

