const formatCLP = value => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(value || 0));

document.addEventListener('DOMContentLoaded', () => {
  const listaCarritoPagina = document.getElementById('lista-carrito-pagina');
  
  // 2. Traemos los productos guardados de la memoria
  const carritoItems = JSON.parse(localStorage.getItem('carrito')) || [];
  // 3. Función para dibujar los productos
  const renderizarResumenPago = () => {
    if (!listaCarritoPagina) return; 
    listaCarritoPagina.innerHTML = '';
    let subtotal = 0;
    if (carritoItems.length === 0) {
      listaCarritoPagina.innerHTML = '<li class="text-muted text-center py-4">Tu carrito está vacío.</li>';
      document.getElementById('resumen-subtotal').innerText = formatCLP(0);
      document.getElementById('resumen-iva').innerText = formatCLP(0);
      document.getElementById('resumen-total').innerText = formatCLP(0);
      return;
    }
    carritoItems.forEach(item => {
      const price = Number(item.price ?? item.precioActual ?? 0);
      const name = item.name || item.nombre || 'Zapatilla';
      const image = item.image || item.imagen;
      subtotal += price * item.cantidad;
      
      const li = document.createElement('li');
      li.className = "flex items-center justify-between gap-4 border-b border-slate-200 py-3";
      
      li.innerHTML = `
        <div class="flex items-center gap-3">
          <img src="${image}" alt="${name}" class="h-12 w-12 rounded-xl object-cover shadow-sm" />
          <div>
            <h6 class="mb-0 text-sm font-bold text-slate-900">${name}</h6>
            <small class="text-xs text-slate-500">Cantidad: ${item.cantidad}</small>
          </div>
        </div>
        <div class="text-right">
          <span class="text-sm font-bold text-slate-900">${formatCLP(price * item.cantidad)}</span>
        </div>
      `;
      listaCarritoPagina.appendChild(li);
    });
    document.getElementById('resumen-subtotal').innerText = formatCLP(subtotal);
    
    const iva = subtotal * 0.19;
    document.getElementById('resumen-iva').innerText = formatCLP(iva);
    
    const total = subtotal + iva;
    document.getElementById('resumen-total').innerText = formatCLP(total);
  };
  renderizarResumenPago();
});
