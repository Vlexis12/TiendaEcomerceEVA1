// --- 1. BASE DE DATOS COMPARTIDA ---
function getProducts() {
    let products = localStorage.getItem('store_products');
    if (!products) {
        products = [
            { id: 1, name: "Urban Red Kicks", price: 119990, precioAnterior: "$150.000", description: "Zapatillas urbanas de alto impacto con suela de aire.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1160" },
            { id: 2, name: "Classic Canvas High-Top", price: 59990, precioAnterior: "$75.000", description: "El diseño clásico de lona que nunca pasa de moda.", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1160" },
            { id: 3, name: "Pro Runner White", price: 129990, precioAnterior: "$160.000", description: "Diseñadas para corredores exigentes.", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=1160" },
            { id: 4, name: "Street Skate V2", price: 65000, precioAnterior: "$85.000", description: "Agarre superior para la tabla de skate.", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1160" },
            { id: 5, name: "Retro Basketball 80s", price: 145000, precioAnterior: "$180.000", description: "Inspiradas en las canchas de los años 80.", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1160" },
            { id: 6, name: "Trail Explorer", price: 95990, precioAnterior: "$130.000", description: "Tracción todoterreno para tus aventuras.", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=1160" }
        ];
        localStorage.setItem('store_products', JSON.stringify(products));
    }
    return JSON.parse(products);
}

function saveProducts(products) {
    localStorage.setItem('store_products', JSON.stringify(products));
}

// --- 2. LÓGICA DEL ADMINISTRADOR ---
function renderTable() {
    const tbody = document.getElementById('product-table-body');
    if (!tbody) return; 

    const products = getProducts();
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500">No hay productos registrados.</td></tr>`;
        return;
    }

    products.forEach(p => {
        const descSegura = p.description || p.descripcion || '';
        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="p-4"><img src="${p.image}" class="w-12 h-12 object-cover rounded-md" alt="${p.name}" onerror="this.src='https://placehold.co/50x50?text=Error'"></td>
                <td class="p-4 font-medium">${p.name}</td>
                <td class="p-4 font-medium text-gray-500 max-w-xs truncate">${descSegura}</td>
                <td class="p-4">$${Number(p.price).toLocaleString('es-CL')}</td>
                <td class="p-4 text-center space-x-2">
                    <button onclick="editProduct(${p.id})" class="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm">Editar</button>
                    <button onclick="deleteProduct(${p.id})" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

window.editProduct = function(id) {
    const products = getProducts();
    const p = products.find(prod => prod.id == id);
    if (p) {
        document.getElementById('product-id').value = p.id;
        document.getElementById('name').value = p.name;
        document.getElementById('description').value = p.description || p.descripcion || '';
        document.getElementById('price').value = p.price;
        document.getElementById('image').value = p.image;
        document.getElementById('form-title').innerText = 'Editar Producto';
        document.getElementById('btn-save').innerText = 'Actualizar';
        document.getElementById('btn-cancel').classList.remove('hidden');
    }
};

window.deleteProduct = function(id) {
    if (confirm('¿Estás seguro de eliminar este producto? Se borrará automáticamente del catálogo.')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        renderTable();
        
        let carritoItems = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoItems = carritoItems.filter(item => item.id !== id);
        localStorage.setItem('carrito', JSON.stringify(carritoItems));
    }
};

window.resetForm = function() {
    const form = document.getElementById('product-form');
    if (form) form.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('form-title').innerText = 'Agregar Nuevo Producto';
    document.getElementById('btn-save').innerText = 'Guardar';
    document.getElementById('btn-cancel').classList.add('hidden');
};

// --- 3. INICIALIZACIÓN GLOBAL ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Admin
    const adminForm = document.getElementById('product-form');
    if (adminForm) {
        renderTable();
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('product-id').value;
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const price = parseFloat(document.getElementById('price').value);
            const image = document.getElementById('image').value;

            let products = getProducts();

            if (id) {
                products = products.map(p => p.id == id ? { id: Number(id), name, description, price, image } : p);
            } else {
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                products.push({ id: newId, name, description, price, image });
            }

            saveProducts(products);
            renderTable();
            resetForm();
        });
    }

    // --- 4. LÓGICA DE LA TIENDA Y CARRITO ---
    const contenedorGrid = document.getElementById('grid-productos'); 
    const listaCarritoPagina = document.getElementById('lista-carrito-pagina'); 
    const listaCarrito = document.getElementById('lista-carrito');
    const badgeCarrito = document.getElementById('contador-carrito');
    const modalCarrito = document.getElementById('carrito');
    
    let carritoItems = JSON.parse(localStorage.getItem('carrito')) || [];
    const productos = getProducts(); 

    const guardarCarrito = () => localStorage.setItem('carrito', JSON.stringify(carritoItems));

    const renderizarProductos = () => {
        if (!contenedorGrid) return; 
        contenedorGrid.innerHTML = ''; 
        const fragment = document.createDocumentFragment();

        productos.forEach(producto => {
            const desc = producto.description || producto.descripcion || '';
            const nombre = producto.name || producto.nombre || 'Producto';
            const precio = producto.price || producto.precioActual || 0;
            const imagen = producto.image || producto.imagen || 'https://placehold.co/400x400';
            const precioAnterior = producto.precioAnterior || '';

            const htmlDescripcion = desc ? `<p class="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">${desc}</p>` : '';
            const htmlPrecioAnterior = precioAnterior ? `<span class="block text-xs font-medium text-slate-400 line-through mt-0.5">${precioAnterior}</span>` : '';

            const div = document.createElement('div');
            div.className = "group relative flex flex-col h-full bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden hover:-translate-y-2"; 
            
            div.innerHTML = `
                <div class="relative w-full h-64 sm:h-72 bg-slate-50 overflow-hidden">
                    <img src="${imagen}" alt="${nombre}" class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" onerror="this.src='https://placehold.co/400x400?text=Imagen+No+Disponible'" />
                    <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">
                        <span class="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                            <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            4.9
                        </span>
                    </div>
                </div>
                
                <div class="relative flex flex-col flex-1 p-6 md:p-8">
                    <div class="flex justify-between items-start gap-4">
                        <h3 class="text-xl font-bold text-slate-900 line-clamp-1" title="${nombre}">${nombre}</h3>
                        <div class="text-right shrink-0">
                            <p class="text-xl font-black text-[#2A65F3]">$${Number(precio).toLocaleString('es-CL')}</p>
                            ${htmlPrecioAnterior}
                        </div>
                    </div>
                    
                    ${htmlDescripcion}
                    
                    <div class="mt-auto pt-8">
                        <button type="button" data-id="${producto.id}" class="btn-agregar flex items-center justify-center w-full px-6 py-3.5 text-sm font-bold tracking-wide text-white transition-all bg-[#2A65F3] rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl focus:outline-none hover:-translate-y-1">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            `;
            fragment.appendChild(div);
        });

        contenedorGrid.appendChild(fragment);
        document.querySelectorAll('.btn-agregar').forEach(boton => boton.addEventListener('click', agregarAlCarrito));
    };

    const agregarAlCarrito = (e) => {
        const idProducto = parseInt(e.currentTarget.dataset.id);
        const productoSeleccionado = productos.find(p => p.id === idProducto);
        if (!productoSeleccionado) return;

        const existe = carritoItems.find(item => item.id === idProducto);
        if (existe) {
            existe.cantidad++;
        } else {
            const normalizado = {
                ...productoSeleccionado,
                nombre: productoSeleccionado.name,
                precioActual: productoSeleccionado.price,
                imagen: productoSeleccionado.image
            };
            carritoItems.push({ ...normalizado, cantidad: 1 });
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

    const cambiarCantidad = (id, delta) => {
        const item = carritoItems.find(i => i.id === id);
        if (item) {
            item.cantidad += delta;
            if (item.cantidad <= 0) {
                eliminarDelCarrito(id);
            } else {
                guardarCarrito();
                actualizarVistas();
            }
        }
    };

    const actualizarVistas = () => {
        // Actualizar Insignia
        if (badgeCarrito) {
            const totalItems = carritoItems.reduce((total, item) => total + item.cantidad, 0);
            badgeCarrito.innerText = totalItems;
            totalItems > 0 ? badgeCarrito.classList.remove('hidden') : badgeCarrito.classList.add('hidden');
        }

        // Actualizar Carrito Lateral (Modal)
        if (listaCarrito) {
            listaCarrito.innerHTML = '';
            carritoItems.forEach(item => {
                const precioItem = Number(item.price || item.precioActual || 0);
                listaCarrito.innerHTML += `
                    <li class="flex items-center gap-4">
                        <img src="${item.image || item.imagen}" alt="${item.name || item.nombre}" class="size-16 rounded-sm object-cover" onerror="this.src='https://placehold.co/150?text=Error'"/>
                        <div class="flex-1">
                            <h3 class="text-sm text-gray-900 line-clamp-1">${item.name || item.nombre}</h3>
                            <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">
                                <div><dt class="inline">Precio:</dt> <dd class="inline">$${precioItem.toLocaleString('es-CL')}</dd></div>
                            </dl>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="flex items-center border border-gray-200 rounded">
                                <button type="button" class="btn-restar px-2 py-1 text-gray-600 hover:bg-gray-100 leading-none" data-id="${item.id}">-</button>
                                <span class="px-2 py-1 text-xs text-gray-700 border-x border-gray-200 min-w-[24px] text-center">${item.cantidad}</span>
                                <button type="button" class="btn-sumar px-2 py-1 text-gray-600 hover:bg-gray-100 leading-none" data-id="${item.id}">+</button>
                            </div>
                            <button type="button" class="btn-eliminar text-gray-400 hover:text-red-600 ml-1 transition-colors" data-id="${item.id}" title="Eliminar producto">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke-currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                        </div>
                    </li>
                `;
            });
            
            document.querySelectorAll('#lista-carrito .btn-sumar').forEach(btn => btn.addEventListener('click', (e) => cambiarCantidad(parseInt(e.currentTarget.dataset.id), 1)));
            document.querySelectorAll('#lista-carrito .btn-restar').forEach(btn => btn.addEventListener('click', (e) => cambiarCantidad(parseInt(e.currentTarget.dataset.id), -1)));
            document.querySelectorAll('#lista-carrito .btn-eliminar').forEach(btn => btn.addEventListener('click', (e) => eliminarDelCarrito(parseInt(e.currentTarget.dataset.id))));
        }

        // Actualizar Página Principal de Carrito (Resumen de Compra en dos columnas)
        if (listaCarritoPagina) {
            listaCarritoPagina.innerHTML = '';
            let subtotal = 0;

            if (carritoItems.length === 0) {
                listaCarritoPagina.innerHTML = '<p class="text-slate-500 text-center py-8">Tu carrito está vacío.</p>';
                const subEl = document.getElementById('resumen-subtotal');
                const ivaEl = document.getElementById('resumen-iva');
                const totEl = document.getElementById('resumen-total');
                if(subEl) subEl.innerText = `$0`;
                if(ivaEl) ivaEl.innerText = `$0`;
                if(totEl) totEl.innerText = `$0`;
            } else {
                carritoItems.forEach(item => {
                    const precio = Number(item.price || item.precioActual || 0);
                    const nombre = item.name || item.nombre;
                    const imagen = item.image || item.imagen;
                    subtotal += (precio * item.cantidad);
                    const precioCLP = Math.round(precio).toLocaleString('es-CL');

                    listaCarritoPagina.innerHTML += `
                        <li class="flex flex-col sm:flex-row items-center gap-6 p-6 transition-colors hover:bg-slate-50/50 group">
                            <div class="w-24 h-24 sm:w-28 sm:h-28 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200/60">
                                <img src="${imagen}" alt="${nombre}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://placehold.co/150?text=Error'" />
                            </div>
                            
                            <div class="flex-1 w-full text-center sm:text-left">
                                <h3 class="text-lg font-bold text-slate-900">${nombre}</h3>
                                <p class="mt-1 text-sm font-medium text-slate-500">Precio unitario: $${precioCLP}</p>
                                <span class="inline-block mt-2 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider">En Stock</span>
                            </div>
                            
                            <div class="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                                <div class="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                                    <button type="button" class="btn-restar-pagina px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors" data-id="${item.id}">-</button>
                                    <span class="px-3 py-2 text-sm font-bold text-slate-800 border-x border-slate-200 min-w-[2.5rem] text-center">${item.cantidad}</span>
                                    <button type="button" class="btn-sumar-pagina px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors" data-id="${item.id}">+</button>
                                </div>
                                <button class="text-slate-400 hover:text-red-500 transition-colors btn-eliminar-pagina p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-200" data-id="${item.id}" title="Eliminar producto">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    `;
                });

                const subEl = document.getElementById('resumen-subtotal');
                const ivaEl = document.getElementById('resumen-iva');
                const totEl = document.getElementById('resumen-total');

                const iva = subtotal * 0.19;
                const total = subtotal + iva;

                if (subEl) subEl.innerText = `$${Math.round(subtotal).toLocaleString('es-CL')}`;
                if (ivaEl) ivaEl.innerText = `$${Math.round(iva).toLocaleString('es-CL')}`;
                if (totEl) totEl.innerText = `$${Math.round(total).toLocaleString('es-CL')}`;

                document.querySelectorAll('.btn-sumar-pagina').forEach(btn => btn.addEventListener('click', (e) => cambiarCantidad(parseInt(e.currentTarget.dataset.id), 1)));
                document.querySelectorAll('.btn-restar-pagina').forEach(btn => btn.addEventListener('click', (e) => cambiarCantidad(parseInt(e.currentTarget.dataset.id), -1)));
                document.querySelectorAll('.btn-eliminar-pagina').forEach(btn => btn.addEventListener('click', (e) => eliminarDelCarrito(parseInt(e.currentTarget.dataset.id))));
            }
        }
    };

    const btnCarritoBtn = document.getElementById('btn-carrito');
    if (btnCarritoBtn) btnCarritoBtn.addEventListener('click', () => modalCarrito?.classList.toggle('hidden'));
    document.getElementById('cerrar-carrito')?.addEventListener('click', () => modalCarrito?.classList.add('hidden'));
    document.getElementById('continuar-comprando')?.addEventListener('click', () => modalCarrito?.classList.add('hidden'));

    renderizarProductos(); 
    actualizarVistas(); 
});