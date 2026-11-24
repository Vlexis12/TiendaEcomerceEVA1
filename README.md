# SneakerX — Frontend

Interfaz web de una tienda de zapatillas, desarrollada con React y Vite. Incluye catálogo, carrito, cuentas de usuario, proceso de compra, blog y panel de administración. La aplicación consume la API del backend para gestionar los datos de la tienda.

Este repositorio contiene el frontend actual en `frontend-tienda/`.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| React 19 | Componentes, vistas y estado de la interfaz |
| Vite 8 | Servidor de desarrollo y compilación |
| JavaScript y JSX | Lógica y componentes |
| Bootstrap 5, Tailwind CSS 4 y CSS | Estilos y diseño adaptable |
| Vitest, React Testing Library y jsdom | Pruebas automatizadas |
| ESLint | Análisis del código |
| Docker y Nginx | Compilación y publicación del frontend |

## Requisitos

- Node.js 22.12 o superior compatible con Vite 8 y npm.
- Backend disponible para las funcionalidades que consultan la API, como autenticación, catálogo, carrito y compras.
- Docker, únicamente si se utiliza la opción de ejecución en contenedor.

Los comandos siguientes parten desde la carpeta `TiendaEcomerceEVA1/`, salvo que se indique otra ubicación.

## Instalación y ejecución

```bash
cd frontend-tienda
npm ci
npm run dev
```

Abre la dirección que indique Vite en la terminal, normalmente `http://localhost:5173`.

El frontend puede iniciar sin el backend, pero las operaciones que dependen de la API requieren que esté disponible. No es una aplicación completamente autónoma con persistencia exclusiva en el navegador.

## Configuración

Crea `frontend-tienda/.env.local` para personalizar la conexión:

```dotenv
VITE_API_BASE=http://localhost:8082/api/v1/sneakerx
```

| Variable | Descripción |
| --- | --- |
| `VITE_API_BASE` | URL base de la API. Si se omite, se utiliza `http://localhost:8082/api/v1/sneakerx`. |
| `VITE_GOOGLE_CLIENT_ID` | Identificador público del cliente de Google para el inicio de sesión con Google. Opcional si no se usa esta función. |

El acceso con Google también requiere configurar los orígenes autorizados y el soporte correspondiente del backend. Un identificador de ejemplo no habilita la integración.

Reinicia Vite después de cambiar las variables. En producción, las variables `VITE_*` se incorporan durante la compilación y son visibles en el navegador: no deben contener contraseñas ni claves privadas.

Las peticiones se centralizan en `src/services/api.js`. El backend debe permitir mediante CORS el origen desde el que se sirve el frontend.

## Funcionalidades

### Tienda

- Inicio con carrusel y productos destacados.
- Catálogo con búsqueda, ordenamiento y selección de talla.
- Precios presentados en pesos chilenos.
- Carrito con modificación de cantidades y eliminación de productos.
- Carrito de visitante identificado mediante una sesión y transferencia al iniciar sesión.
- Registro, inicio y cierre de sesión, acceso con Google y edición de perfil.
- Formulario de compra e historial de compras del usuario.
- Blog con listado y detalle de publicaciones.
- Página de contacto y widget de asistencia con tickets y consulta de IA mediante la API.

La pantalla de pago forma parte del flujo de compra de la aplicación; su existencia no implica una integración con una pasarela bancaria real.

### Panel de gestión

- Resumen de la tienda.
- Gestión de usuarios y roles.
- Administración de productos.
- Consulta de compras.
- Gestión de publicaciones del blog.
- Atención de contactos y tickets.

El panel distingue cuentas administradoras y vendedoras. Las cuentas vendedoras tienen restricciones, incluyendo el acceso a blog y contacto. Las comprobaciones de la interfaz complementan la autorización que debe aplicar el backend.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/` | Inicio |
| `/productos` | Catálogo |
| `/productos?buscar=Jordan` | Ejemplo de búsqueda |
| `/carrito` | Carrito |
| `/pago` | Proceso de compra |
| `/cuenta` | Acceso a la cuenta |
| `/login` | Inicio de sesión |
| `/registro` | Registro |
| `/editar-perfil` | Edición del perfil; requiere sesión |
| `/mis-compras` | Compras del usuario; requiere sesión |
| `/nosotros` | Información de la tienda |
| `/contacto` | Contacto |
| `/blog` | Publicaciones |
| `/blog/:id` | Detalle de una publicación |
| `/admin` | Resumen del panel |
| `/admin/usuarios` | Gestión de usuarios |
| `/admin/productos` | Gestión de productos |
| `/admin/compras` | Consulta de compras |
| `/admin/blogs` | Gestión del blog |
| `/admin/contacto` | Contactos y soporte |

La selección de pantallas se realiza en `App.jsx` y `AdminApp.jsx` mediante la ruta del navegador. Las rutas no corresponden a archivos HTML individuales.

## Estructura

```text
TiendaEcomerceEVA1/
├── README.md
└── frontend-tienda/
    ├── public/                 # Recursos servidos directamente
    │   └── img/                # Imágenes del catálogo y de la tienda
    ├── src/
    │   ├── admin/              # Panel y vistas de gestión
    │   ├── assets/             # Recursos importados por componentes
    │   ├── components/         # Navegación, tarjetas, carrusel y chat
    │   ├── data/               # Utilidades de datos y persistencia local
    │   ├── pages/              # Pantallas de la tienda
    │   ├── services/           # API, blog y tratamiento de imágenes
    │   ├── App.jsx             # Composición y selección de vistas
    │   ├── main.jsx            # Entrada de React
    │   └── testSetup.js        # Preparación del entorno de pruebas
    ├── .env.example            # Ejemplo de configuración de la API
    ├── index.html              # Documento de entrada de Vite
    ├── package.json            # Dependencias y comandos
    ├── package-lock.json       # Versiones resueltas de dependencias
    ├── vite.config.js          # Configuración de Vite y Vitest
    ├── eslint.config.js        # Reglas de análisis
    ├── postcss.config.js       # Procesamiento de CSS
    ├── tailwind.config.js      # Configuración de estilos
    ├── Dockerfile              # Compilación y servidor de producción
    └── nginx.conf              # Publicación con soporte para rutas React
```

## Sesión y almacenamiento

La integración utiliza tokens JWT enviados mediante `Authorization: Bearer …`. El navegador conserva información de sesión y estado auxiliar en `localStorage`, incluyendo:

| Clave | Uso |
| --- | --- |
| `sneakerx_jwt` | Token de autenticación |
| `sneakerx_userId` | Identificador del usuario |
| `usuarioLogueado` | Datos de sesión utilizados por la interfaz |
| `sneakerx_sessionId` | Identificador del carrito de visitante |
| `sneakerx_chat_ticket` | Referencia del ticket de asistencia |

Borrar los datos del sitio elimina esta información local y puede cerrar la sesión. No elimina por sí mismo los registros almacenados en el backend. Las utilidades locales de `src/data/` no sustituyen los servicios de la API.

## Comandos y pruebas

Ejecuta desde `frontend-tienda/`:

| Comando | Función |
| --- | --- |
| `npm ci` | Instalar las dependencias del archivo de bloqueo |
| `npm run dev` | Iniciar el servidor de desarrollo |
| `npm run build` | Generar la versión de producción en `dist/` |
| `npm run preview` | Revisar localmente la compilación |
| `npm run lint` | Analizar el código con ESLint |
| `npm test` | Ejecutar las pruebas con Vitest |

Las pruebas se encuentran junto a los componentes y utilidades en archivos `*.test.jsx` y `*.test.js`. Cubren aspectos del catálogo, carrito, pago, cuentas, contacto, navegación, blog y panel administrativo. No reemplazan una verificación completa con el backend en ejecución.

## Publicación

### Archivos estáticos

```bash
npm run build
npm run preview
```

Publica el contenido de `frontend-tienda/dist/` en el servidor elegido. Configura el servidor para entregar `index.html` cuando se solicite una ruta de la aplicación, por ejemplo `/productos` o `/admin`. El archivo `nginx.conf` incluido ya contempla este comportamiento.

`npm run preview` sirve para revisar la compilación localmente.

### Docker

Desde `frontend-tienda/`:

```bash
docker build -t sneakerx-frontend .
docker run --rm -p 3000:80 sneakerx-frontend
```

Abre `http://localhost:3000`. La imagen compila con Node.js y sirve los archivos mediante Nginx. El contenedor contiene únicamente el frontend.

Define la URL de la API antes de construir la imagen, por ejemplo en `.env.local`. El Dockerfile actual no declara argumentos de compilación para estas variables; pasarlas únicamente con `docker run -e` no cambia una aplicación ya compilada. La URL debe ser accesible desde el navegador del usuario.

## Problemas frecuentes

| Problema | Revisión |
| --- | --- |
| No se puede conectar con el servidor | Comprobar que la API esté activa y que `VITE_API_BASE` sea correcta. |
| El navegador bloquea peticiones por CORS | Habilitar el origen del frontend en la configuración del backend. |
| Una ruta devuelve 404 al recargar en producción | Configurar el retorno a `index.html` en el servidor estático. |
| Cambiar `.env.local` no tiene efecto | Reiniciar Vite o volver a compilar y publicar. |
| El inicio de sesión con Google falla | Revisar el identificador del cliente, los orígenes permitidos y la integración del backend. |
| PowerShell bloquea `npm.ps1` | Ejecutar los comandos con `npm.cmd`. |

## Alcance del repositorio

Este README documenta únicamente el frontend React. El backend se mantiene como proyecto separado en `https://github.com/Gabrielex3/tiendaBackend`.
