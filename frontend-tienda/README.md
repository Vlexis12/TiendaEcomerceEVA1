# SneakerX React

Aplicación frontend de comercio electrónico para SneakerX, migrada desde páginas
HTML, CSS y JavaScript independientes a una aplicación React ejecutada con Vite.
La aplicación permite explorar zapatillas, buscar productos, administrar un
carrito, crear cuentas, iniciar sesión y simular compras.

## Tecnologías

- React 19
- Vite
- Bootstrap 5
- Tailwind CSS
- Vitest
- React Testing Library
- ESLint

## Instalación y desarrollo

Desde esta carpeta:

```bash
npm install
npm run dev
```

La aplicación queda disponible normalmente en:

```text
http://localhost:5173
```

Otros comandos disponibles:

```bash
npm run build    # genera la compilación de producción en dist/
npm run preview  # sirve localmente la compilación de producción
npm run lint     # revisa problemas de código
npm test         # ejecuta las pruebas
```

Si PowerShell bloquea `npm.ps1`, utiliza `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
```

## Rutas de la tienda

| Ruta | Descripción |
| --- | --- |
| `/` | Página principal con hero, productos destacados y acceso al catálogo. |
| `/productos` | Catálogo completo, selección de talla y orden por precio. |
| `/productos?buscar=Jordan` | Catálogo filtrado por nombre, descripción, marca o categoría. |
| `/carrito` | Carrito completo, modificación de cantidades y eliminación de productos. |
| `/pago` | Formulario de entrega y checkout simulado. |
| `/login` | Inicio de sesión para usuarios y administradores. |
| `/registro` | Registro de una nueva cuenta de usuario. |
| `/cuenta` | Página de acceso y presentación de la cuenta. |
| `/nosotros` | Información sobre SneakerX. |
| `/contacto` | Formulario de contacto. |
| `/blog` | Lista de artículos del blog. |
| `/blog/:id` | Detalle de un artículo, por ejemplo `/blog/1`. |
| `/ofertas` | No es una ruta independiente; el enlace “Ofertas” vuelve a `/`. |

La navegación se resuelve desde `App.jsx`; no hay un archivo HTML independiente
para cada ruta. Vite entrega `index.html` y React decide qué componente mostrar
según `window.location.pathname`.

## Panel de administración

Las cuentas con rol `Administrador` pueden acceder a:

| Ruta | Descripción |
| --- | --- |
| `/admin` | Dashboard con resumen de la tienda. |
| `/admin/usuarios` | Gestión de usuarios y roles. |
| `/admin/productos` | Administración del catálogo. |
| `/admin/compras` | Historial de compras y detalle de boletas. |

Si una persona no ha iniciado sesión, se redirige a `/login`. Si tiene una
cuenta normal, no puede acceder al panel y vuelve a la tienda.

### Usuario administrador inicial

Cuando no existe una lista de usuarios guardada, se crea este usuario de
demostración:

```text
Correo: jhon.doe@adminshop.cl
Contraseña: admin123
```

Para entrar:

1. Abrir `http://localhost:5173/login`.
2. Ingresar las credenciales anteriores.
3. El sistema redirige automáticamente a `/admin`.

Una persona administradora que esté en la tienda ve un ícono de usuario en la
barra superior. Su menú incluye:

- Ir al panel de admin.
- Cerrar sesión.

## Funcionalidades principales

### Catálogo

- Visualización de productos y precios en pesos chilenos.
- Selección de tallas disponibles: 39, 40, 41, 42, 43 y 44.
- Orden recomendado, menor precio a mayor y mayor precio a menor.
- Búsqueda desde la barra superior.
- Mensajes y resultados filtrados mediante el parámetro `buscar`.

### Carrito

- Agregar productos por talla.
- Aumentar o disminuir cantidades.
- Eliminar productos.
- Mini-carrito visible después de agregar un producto.
- Acceso al carrito completo y al proceso de pago.

### Sesión y cuentas

- Registro de usuarios.
- Inicio y cierre de sesión.
- Distinción entre usuarios normales y administradores.
- El mismo formato de sesión es compatible con la versión JavaScript antigua:
  `usuarioLogueado`.

### Checkout

- Datos de comprador y entrega.
- Selección de pago con débito o crédito.
- Cálculo de subtotal, IVA y total.
- Generación de una boleta local.
- Historial visible desde el panel administrativo.

El checkout es una simulación. No procesa pagos reales y no envía información a
un proveedor externo.

### Blog

- Listado de artículos.
- Vista de detalle por identificador.
- Enlaces para volver al listado.

## Persistencia en `localStorage`

La aplicación funciona sin backend y guarda los datos en el navegador actual:

| Clave | Contenido |
| --- | --- |
| `store_users` | Usuarios registrados y sus roles. |
| `usuarioLogueado` | Sesión activa compatible con la versión antigua. |
| `store_products` | Productos del catálogo. |
| `carrito` | Productos actuales del carrito. |
| `store_purchases` | Historial de compras y boletas. |

Los datos solo están disponibles en el mismo navegador y dispositivo. Borrar los
datos del sitio elimina la sesión, el carrito, las compras y las modificaciones
locales.

La autorización en `localStorage` es adecuada para una demostración o entrega
académica, pero no reemplaza una autenticación de servidor en producción.

## Estructura principal

```text
frontend-tienda/
├── public/
│   └── img/                    # Imágenes y recursos públicos
├── src/
│   ├── admin/
│   │   ├── AdminApp.jsx        # Panel administrativo
│   │   └── AdminApp.test.jsx
│   ├── components/
│   │   ├── Navbar.jsx          # Navegación, búsqueda y sesión
│   │   ├── Producto.jsx        # Tarjeta de producto
│   │   └── BlogCard.jsx
│   ├── data/
│   │   ├── db.js               # Productos y carrito
│   │   ├── users.js            # Usuarios y sesión
│   │   ├── purchases.js        # Boletas e historial
│   │   └── blogData.js         # Artículos del blog
│   ├── pages/                  # Vistas de la tienda
│   ├── App.jsx                 # Estado global y selección de rutas
│   ├── main.jsx                # Punto de entrada React
│   └── testSetup.js
├── index.html
├── package.json
└── vite.config.js
```

## Pruebas

Las pruebas se ejecutan con:

```bash
npm test
```

Actualmente cubren:

- Ordenamiento del catálogo.
- Renderizado y selección de productos.
- Operaciones del carrito.
- Validación del checkout.
- Persistencia de boletas.
- Página de contacto.
- Página de cuenta.
- Historial de compras del administrador.

## Migración desde la versión anterior

La versión anterior utilizaba páginas HTML separadas, por ejemplo:

```text
index.html
productos.html
carrito.html
login.html
registro.html
admin/home.html
```

La versión actual conserva las funcionalidades, pero las implementa como
componentes React reutilizables. Las rutas actuales son rutas de la aplicación,
no archivos físicos independientes:

```text
/admin
/admin/usuarios
/admin/productos
/admin/compras
```

La sesión antigua guardaba los datos en `usuarioLogueado`, por lo que React
mantiene esa misma clave para conservar compatibilidad con los usuarios y datos
creados por la versión anterior.
