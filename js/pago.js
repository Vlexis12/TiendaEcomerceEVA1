document.addEventListener('DOMContentLoaded', () => {
  const listaCarritoPagina = document.getElementById('lista-carrito-pagina');
  
  // 2. Traemos los productos guardados de la memoria
  let carritoItems = JSON.parse(localStorage.getItem('carrito')) || [];
  // 3. Función para dibujar los productos
  const renderizarResumenPago = () => {
    if (!listaCarritoPagina) return; 
    listaCarritoPagina.innerHTML = '';
    let subtotal = 0;
    if (carritoItems.length === 0) {
      listaCarritoPagina.innerHTML = '<li class="text-muted text-center py-4">Tu carrito está vacío.</li>';
      document.getElementById('resumen-subtotal').innerText = `$0.00`;
      document.getElementById('resumen-iva').innerText = `$0.00`;
      document.getElementById('resumen-total').innerText = `$0.00`;
      return;
    }
    carritoItems.forEach(item => {
      subtotal += (item.precioActual * item.cantidad);
      
      const li = document.createElement('li');
      li.className = "d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom";
      li.style.borderColor = "#dee2e6"; 
      
      li.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <img src="${item.imagen}" alt="${item.nombre}" class="rounded shadow-sm" style="width: 50px; height: 50px; object-fit: cover;" />
          <div>
            <h6 class="mb-0 text-dark fw-bold" style="font-size: 0.9rem;">${item.nombre}</h6>
            <small class="text-muted">Cant: ${item.cantidad}</small>
          </div>
        </div>
        <div class="text-end">
          <span class="fw-bold text-dark" style="font-size: 0.95rem;">$${(item.precioActual * item.cantidad).toFixed(2)}</span>
        </div>
      `;
      listaCarritoPagina.appendChild(li);
    });
    document.getElementById('resumen-subtotal').innerText = `$${subtotal.toFixed(2)}`;
    
    const iva = subtotal * 0.19;
    document.getElementById('resumen-iva').innerText = `$${iva.toFixed(2)}`;
    
    const total = subtotal + iva;
    document.getElementById('resumen-total').innerText = `$${total.toFixed(2)}`;
  };
  renderizarResumenPago();
});
