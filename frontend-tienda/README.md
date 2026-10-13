# SneakerX React

## Desarrollo

Desde esta carpeta ejecuta:

```powershell
npm install
npm run dev
```

Si PowerShell bloquea `npm.ps1`, utiliza `npm.cmd install` y `npm.cmd run dev`.

## Rutas

- `/` — tienda
- `/login` — inicio de sesión; las cuentas con rol `Administrador` se envían al panel y las cuentas `Usuario` a la tienda
- `/admin/home.html` — resumen
- `/admin/usuarios.html` — gestión de cuentas y roles
- `/admin/productosadmin.html` — gestión del catálogo
- `/admin/compras.html` — historial de compras y detalle de boletas

En el catálogo, el selector **Ordenar por precio** permite ordenar de menor a mayor o de mayor a menor. Al finalizar una compra se registra una boleta con comprador, correo, productos, subtotal, IVA, total y forma de pago. Los compradores sin sesión deben ingresar su correo; con sesión se usa el correo de su cuenta. La información se guarda en `localStorage` bajo `store_purchases`, junto al navegador donde se realizó la compra. No se almacenan número de tarjeta, vencimiento ni CVV.

El checkout actual es una simulación local: no procesa pagos reales ni sincroniza el historial entre dispositivos.

## Pruebas

Ejecuta las pruebas unitarias y de componentes con:

```powershell
npm test
```

Las pruebas cubren ordenamiento del catálogo, persistencia de boletas, validación del checkout y consulta del historial desde el panel administrativo.

Las cuentas, la sesión y los productos se almacenan en `localStorage`. El administrador inicial de demostración es `jhon.doe@adminshop.cl` (`admin123`). Como la autorización se ejecuta en el navegador, esta configuración no sustituye un sistema de autenticación de servidor para producción.
