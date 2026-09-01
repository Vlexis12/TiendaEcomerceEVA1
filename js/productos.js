document.addEventListener('DOMContentLoaded', () => {
  const productos = [
    { id: 1, nombre: "Urban Red Kicks", precioActual: 119.99, precioAnterior: "$150.00", descripcion: "Zapatillas urbanas de alto impacto con suela de aire.", imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1160" },
    { id: 2, nombre: "Classic Canvas High-Top", precioActual: 59.99, precioAnterior: "$75.00", descripcion: "El diseño clásico de lona que nunca pasa de moda.", imagen: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1160" },
    { id: 3, nombre: "Pro Runner White", precioActual: 129.99, precioAnterior: "$160.00", descripcion: "Diseñadas para corredores exigentes.", imagen: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=1160" },
    { id: 4, nombre: "Street Skate V2", precioActual: 65.00, precioAnterior: "$85.00", descripcion: "Agarre superior para la tabla de skate.", imagen: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1160" },
    { id: 5, nombre: "Retro Basketball 80s", precioActual: 145.00, precioAnterior: "$180.00", descripcion: "Inspiradas en las canchas de los años 80.", imagen: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1160" },
    { id: 6, nombre: "Trail Explorer", precioActual: 95.99, precioAnterior: "$130.00", descripcion: "Tracción todoterreno para tus aventuras.", imagen: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=1160" }
  ];


  let carritoItems = JSON.parse(localStorage.getItem('carrito')) || [];

  const guardarCarrito = () => {
    localStorage.setItem('carrito', JSON.stringify(carritoItems));
  };


  const contenedorGrid = document.getElementById('grid-productos'); 
  const listaCarritoPagina = document.getElementById('lista-carrito-pagina'); 
  
  const btnCarrito = document.getElementById('btn-carrito');
  const modalCarrito = document.getElementById('carrito');
  const btnCerrarCarrito = document.getElementById('cerrar-carrito');
  const btnContinuarComprando = document.getElementById('continuar-comprando');
  const listaCarrito = document.getElementById('lista-carrito');
  const textCantidadCarrito = document.getElementById('cantidad-carrito-total');
  
  // NUEVO: Burbuja roja de cantidad sobre el botón
  const badgeCarrito = document.getElementById('contador-carrito');


  const renderizarProductos = () => {
    if (!contenedorGrid) return; 

    contenedorGrid.innerHTML = ''; 
    const fragment = document.createDocumentFragment();

    productos.forEach(producto => {
      const div = document.createElement('div');
      div.className = "group relative flex flex-col h-full overflow-hidden bg-white rounded shadow-sm border border-gray-100"; 
      
      div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72" />
        
        <div class="relative flex flex-col flex-1 bg-white p-6">
          <p class="text-gray-700">
            $${producto.precioActual}
            <span class="text-gray-600 line-through text-sm ml-2">${producto.precioAnterior}</span>
          </p>
          <h3 class="mt-1.5 text-lg font-medium text-gray-900">${producto.nombre}</h3>
          <p class="mt-1.5 line-clamp-3 text-gray-700">${producto.descripcion}</p>
          
          <div class="mt-auto pt-4 flex gap-4">
            <button type="button" data-id="${producto.id}" class="btn-agregar block w-full rounded-sm bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:scale-105">
              Añadir al carrito
            </button>
          </div>
        </div>
      `;
      fragment.appendChild(div);
    });

    contenedorGrid.appendChild(fragment);

    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach(boton => boton.addEventListener('click', agregarAlCarrito));
  };


  const agregarAlCarrito = (e) => {
    const idProducto = parseInt(e.target.dataset.id);
    const productoSeleccionado = productos.find(p => p.id === idProducto);
    const existe = carritoItems.find(item => item.id === idProducto);

    if (existe) {
      existe.cantidad++;
    } else {
      carritoItems.push({ ...productoSeleccionado, cantidad: 1 });
    }

    guardarCarrito(); 
    actualizarVistas(); 
    
    if (modalCarrito) modalCarrito.classList.remove('hidden');
  };

  const eliminarDelCarrito = (id) => {
    carritoItems = carritoItems.filter(item => item.id !== id);
    guardarCarrito(); 
    actualizarVistas(); 
  };

  const actualizarInsigniaCarrito = () => {
    if (!badgeCarrito) return;
    const totalItems = carritoItems.reduce((total, item) => total + item.cantidad, 0);
    if (totalItems > 0) {
      badgeCarrito.innerText = totalItems;
      badgeCarrito.classList.remove('hidden');
    } else {
      badgeCarrito.classList.add('hidden');
    }
  };

  const actualizarVistas = () => {
    if (listaCarrito) renderizarCarritoLateral();
    if (listaCarritoPagina) renderizarCarritoPagina();
    actualizarInsigniaCarrito(); // <-- NUEVO
  };

  const renderizarCarritoLateral = () => {
    if (!listaCarrito) return;
    listaCarrito.innerHTML = '';
    let totalCantidad = 0;

    carritoItems.forEach(item => {
      totalCantidad += item.cantidad;
      const li = document.createElement('li');
      li.className = "flex items-center gap-4";
      li.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}" class="size-16 rounded-sm object-cover" />
        <div class="flex-1">
          <h3 class="text-sm text-gray-900">${item.nombre}</h3>
          <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">
            <div><dt class="inline">Precio:</dt> <dd class="inline">$${item.precioActual}</dd></div>
          </dl>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-700 bg-white border border-gray-300 rounded px-2 py-1">Qty: ${item.cantidad}</span>
          <button type="button" class="btn-eliminar text-gray-600 hover:text-red-600" data-id="${item.id}">
            <span class="sr-only">Eliminar</span>
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      `;
      listaCarrito.appendChild(li);
    });

    if(textCantidadCarrito) textCantidadCarrito.innerText = `(${totalCantidad})`;

    const botonesEliminar = document.querySelectorAll('#lista-carrito .btn-eliminar');
    botonesEliminar.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('button').dataset.id;
        eliminarDelCarrito(parseInt(id));
      });
    });
  };

  const renderizarCarritoPagina = () => {
    if (!listaCarritoPagina) return; 
    listaCarritoPagina.innerHTML = '';
    let subtotal = 0;

    if (carritoItems.length === 0) {
      listaCarritoPagina.innerHTML = '<p class="text-gray-500 text-center py-4">Tu carrito está vacío.</p>';
      
      // Asegurarse de que los subtotales se actualicen a 0 cuando el carrito esté vacío
      const subEl = document.getElementById('resumen-subtotal');
      const ivaEl = document.getElementById('resumen-iva');
      const totEl = document.getElementById('resumen-total');
      if(subEl) subEl.innerText = `$0.00`;
      if(ivaEl) ivaEl.innerText = `$0.00`;
      if(totEl) totEl.innerText = `$0.00`;
      return; // Detiene la función
    }

    carritoItems.forEach(item => {
      subtotal += (item.precioActual * item.cantidad);
      const li = document.createElement('li');
      li.className = "flex items-center gap-4";
      li.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}" class="size-16 rounded-sm object-cover" />
        <div>
          <h3 class="text-sm text-gray-900">${item.nombre}</h3>
          <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">
            <div><dt class="inline">Precio:</dt> <dd class="inline">$${item.precioActual}</dd></div>
          </dl>
        </div>
        <div class="flex flex-1 items-center justify-end gap-2">
          <span class="text-xs text-gray-700 bg-white border border-gray-300 rounded px-2 py-1">Cant: ${item.cantidad}</span>
          <button class="text-gray-600 transition hover:text-red-600 btn-eliminar-pagina" data-id="${item.id}">
            <span class="sr-only">Remove item</span>
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      `;
      listaCarritoPagina.appendChild(li);
    });

    const subEl = document.getElementById('resumen-subtotal');
    const ivaEl = document.getElementById('resumen-iva');
    const totEl = document.getElementById('resumen-total');

    if (subEl) subEl.innerText = `$${subtotal.toFixed(2)}`;
    
    const iva = subtotal * 0.19;
    if (ivaEl) ivaEl.innerText = `$${iva.toFixed(2)}`;
    
    const total = subtotal + iva;
    if (totEl) totEl.innerText = `$${total.toFixed(2)}`;

    const botonesEliminarPagina = document.querySelectorAll('.btn-eliminar-pagina');
    botonesEliminarPagina.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('button').dataset.id;
        eliminarDelCarrito(parseInt(id));
      });
    });
  };

  const toggleCarrito = () => {
    if(modalCarrito) modalCarrito.classList.toggle('hidden');
  };

  if(btnCarrito) btnCarrito.addEventListener('click', toggleCarrito);
  if(btnCerrarCarrito) btnCerrarCarrito.addEventListener('click', toggleCarrito);
  if(btnContinuarComprando) btnContinuarComprando.addEventListener('click', toggleCarrito);

  document.addEventListener('click', (event) => {
    if(modalCarrito && btnCarrito) {
      const isClickInsideCarrito = modalCarrito.contains(event.target);
      const isClickOnBoton = btnCarrito.contains(event.target);
      
      if (!isClickInsideCarrito && !isClickOnBoton && !modalCarrito.classList.contains('hidden')) {
        modalCarrito.classList.add('hidden');
      }
    }
  });

  renderizarProductos(); 
  actualizarVistas();    
});