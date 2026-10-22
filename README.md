# 🛒 Tienda E-commerce - Frontend React

Este es un proyecto de comercio electrónico (E-commerce) completamente migrado a **React.js**. Diseñado bajo una arquitectura modular y el **Principio de Responsabilidad Única**, cuenta con un flujo completo de cliente, panel de administración y operaciones CRUD impulsadas por una base de datos simulada en memoria.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React.js (Vite / CRA)
* **Enrutamiento:** React Router DOM
* **Estilos & Maquetación:** Bootstrap / CSS3 (Diseño 100% Responsivo)
* **Lenguaje:** JavaScript (ES6+)

---

## 📁 Estructura del Proyecto

```text
frontend-tienda/
├── public/
│   └── index.html               # Punto de entrada de la SPA
├── src/
│   ├── assets/                  # Imágenes, íconos y recursos estáticos
│   ├── components/              # Componentes reutilizables (Navbar, Cards, Footer, etc.)
│   ├── views/                   # Vistas/Páginas de la aplicación
│   │   ├── Home.jsx             # Vista principal
│   │   ├── Categorias.jsx       # Catálogo por categorías y ofertas
│   │   ├── Carrito.jsx          # Carrito de compras
│   │   ├── Checkout.jsx         # Flujo de pago y confirmación de orden
│   │   └── admin/               # Panel de Administración
│   │       └── Dashboard.jsx    # Gestión de productos, usuarios y reportes
│   ├── database.js              # Base de datos simulada (Operaciones CRUD)
│   ├── App.jsx                  # Configuración de rutas principales
│   └── main.jsx                 # Renderizado inicial e importación de estilos
├── package.json
└── README.md

Funcionalidades Principales
👤 Flujo de Cliente (Público)
Catálogo: Exploración de productos organizados por categoría.

Carrito de Compras: Añadido interactivo de items y gestión de cantidades en tiempo real.

Checkout: Proceso de compra completo con formularios de envío y confirmación/error de pago.

⚙️ Panel de Administración (/admin)
Gestión de Productos (CRUD): Crear, listar, editar y eliminar productos del inventario.

Control de Usuarios y Órdenes: Visualización de registros y boletas emitidas.

💻 Requisitos Previos
Asegúrate de tener instalado en tu sistema:

Node.js (Versión 18 o superior recomendada)

Un gestor de paquetes (npm o yarn)

⚙️ Instalación y Ejecución Local
Clonar el repositorio:

Bash
git clone <URL_DE_TU_REPOSITORIO>
Acceder a la carpeta del frontend:

Bash
cd frontend-tienda
Instalar dependencias:

Bash
npm install
Iniciar el servidor de desarrollo:

Bash
npm run dev
# o bien: npm start
Abre la dirección generada en tu navegador (por ejemplo http://localhost:5173 o http://localhost:3000).


---

### 💡 Consejo
Para actualizarlo en tu repositorio de GitHub, solo copia el bloque de texto de arriba, reemplaza todo el contenido de tu archivo `README.md` local y ejecuta:

```powershell
git add README.md
git commit -m "docs: actualizar README.md a la arquitectura de React"
git push origin main
