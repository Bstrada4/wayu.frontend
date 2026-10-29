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
- Server Action con validación de nombre y apellido, celular peruano, correo y aceptación de condiciones. Los datos personales se descartan, no se guardan ni se envían a terceros.
- Tras enviar el formulario válido se revela `WAYUPERU20`. La bolsa acepta el código desbloqueado, calcula un 20% y permite finalizar una compra simulada.
- La bolsa y el cupón se comparten entre las rutas y se conservan en `sessionStorage` durante la sesión del navegador. Solo se guardan identificadores de producto, cantidades y estado del cupón; no se guardan datos personales. El pop-up se abre automáticamente al cargar o recargar la web, se mantiene cerrado al navegar entre rutas y puede reabrirse desde la cabecera. No hay pagos, pedidos, correos ni integración con el comercio real.
- La oferta del 20% es ficticia. Producto: [Set Tabla, Cuchillo y Tenedor PRM Wayu](https://wayu.com.pe/collections/sets/products/set-tabla-cuchillo-tenedor-prm-wayu). Precio de referencia: S/ 89.90, consultado en la ficha oficial el 25/10/2026. El precio con descuento de una unidad es S/ 71.92. Los cálculos utilizan céntimos para evitar errores de redondeo.

## Recursos

Marca Wayu y fotografías descargadas de https://wayu.com.pe/ y su CDN Shopify para uso académico. `premium-new.json` conserva la ficha del producto PRM indicado por el usuario; `premium.json` corresponde a la referencia inicial reemplazada. Los cinco archivos `public/images/premium-prm-*.jpg` corresponden al set correcto. `app/product.ts` centraliza sus datos, precio y galería.

La gráfica de campaña «Parrilleros, seámoslo siempre» proviene de los archivos proporcionados en `../logotipo/`. La versión de color se utiliza sobre el fondo claro de colecciones y la versión blanca en la campaña y el pop-up. La cabecera y el pie de página usan el logotipo WAYU. El pop-up de Fiestas Patrias combina ambos logotipos, rojo y blanco, una escarapela en CSS y las fechas 28 y 29 de julio. Tipografías DM Sans y Barlow Condensed de Google Fonts, con fuentes de respaldo locales. Interfaz adaptada a móvil y reducción de movimiento.

## Interfaces propias

- `/colecciones`: catálogo de ocho productos, búsqueda y orden por nombre/precio.
- `/colecciones/parrilla`, `/colecciones/cuchillos`, `/colecciones/bar-y-cocktail`: colecciones internas.
- `/productos/[slug]`: ficha de cada producto con galería, cantidades, características y productos relacionados.
- Todos los enlaces comerciales de la interfaz apuntan a rutas locales. Los datos e imágenes de referencia proceden de Wayu; las fichas adicionales consultadas se conservan en `references/`.
- La bolsa admite distintos productos. El cupón del 20% descuenta exclusivamente las unidades del set PRM, calculando importes en céntimos.
- Las páginas se renderizan en servidor por solicitud, con metadatos por colección/producto y respuestas 404 para identificadores inexistentes.

La promoción no es válida en Wayu oficial. Los enlaces a colecciones abren el sitio real. Para un uso comercial se requiere autorización de marca, condiciones promocionales reales y servicios de almacenamiento/pagos.

