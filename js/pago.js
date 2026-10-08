const formatCLP = value => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(value || 0));

document.addEventListener('DOMContentLoaded', () => {
  const listaCarritoPagina = document.getElementById('lista-carrito-pagina');
  const paymentForm = document.getElementById('payment-form');
  const errorMsg = document.getElementById('error-msg');
  const modalExito = document.getElementById('modal-exito');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');
  
  const inputTarjeta = document.getElementById('card-number');
  const inputVencimiento = document.getElementById('expiry-date');
  const inputCvv = document.getElementById('cvv');
  const inputTelefono = document.getElementById('telefono');
  const inputRut = document.querySelector('input[aria-label="Rut Cliente"]');
  
  const carritoItems = JSON.parse(localStorage.getItem('carrito')) || [];

  const renderizarResumenPago = () => {
    if (!listaCarritoPagina) return; 
    listaCarritoPagina.innerHTML = '';
    let subtotal = 0;
    
    if (carritoItems.length === 0) {
      listaCarritoPagina.innerHTML = '<li class="text-slate-400 text-center py-4">Tu carrito está vacío.</li>';
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

  if (inputTarjeta) {
    inputTarjeta.addEventListener('input', function (e) {
      let valor = e.target.value.replace(/\D/g, ''); 
      if (valor !== '') {
        valor = valor.match(/.{1,4}/g).join(' '); 
      }
      e.target.value = valor.substring(0, 19); 
    });
  }

  if (inputVencimiento) {
    inputVencimiento.addEventListener('input', function (e) {
      let valor = e.target.value.replace(/\D/g, ''); 
      if (valor.length > 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2, 4); 
      }
      e.target.value = valor.substring(0, 5); 
    });
  }

  if (inputCvv) {
    inputCvv.addEventListener('input', function (e) {
      let valor = e.target.value.replace(/\D/g, ''); 
      e.target.value = valor.substring(0, 3); 
    });
  }

  if (inputTelefono) {
    inputTelefono.type = 'text'; 
    inputTelefono.addEventListener('input', function (e) {
      let valor = e.target.value.replace(/\D/g, '').substring(0, 9); 
      if (valor.length > 5) {
        valor = valor.replace(/^(\d{1})(\d{4})(\d{0,4}).*/, '$1 $2 $3');
      } else if (valor.length > 1) {
        valor = valor.replace(/^(\d{1})(\d{0,4}).*/, '$1 $2');
      }
      e.target.value = valor;
    });
  }

  if (inputRut) {
    inputRut.addEventListener('input', function (e) {
      let valor = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
      valor = valor.substring(0, 9); 
      
      if (valor.length > 1) {
        const cuerpo = valor.slice(0, -1);
        const dv = valor.slice(-1);
        valor = `${cuerpo}-${dv}`;
      }
      e.target.value = valor;
    });
  }

  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const metodoPago = document.getElementById('metodoPago').value;
      if (metodoPago === 'Escoge un método de pago...') {
        errorMsg.classList.remove('hidden');
        errorMsg.innerText = 'Por favor, selecciona un método de pago válido.';
        return;
      }

      errorMsg.classList.add('hidden');

      const nombre = paymentForm.querySelector('input[aria-label="Nombre"]').value;
      const apellido = paymentForm.querySelector('input[aria-label="Apellido"]').value;
      const rut = paymentForm.querySelector('input[aria-label="Rut Cliente"]').value;
      const telefono = document.getElementById('telefono').value;
      const direccion = document.getElementById('direccion').value || 'Retiro en tienda';

      document.getElementById('modal-nombre-cliente').innerText = `${nombre} ${apellido}`;
      document.getElementById('modal-rut-cliente').innerText = rut;
      document.getElementById('modal-tel-cliente').innerText = telefono;
      document.getElementById('modal-dir-cliente').innerText = direccion;

      const modalListaProductos = document.getElementById('modal-lista-productos');
      modalListaProductos.innerHTML = '';
      let subtotalModal = 0;

      carritoItems.forEach(item => {
        const price = Number(item.price ?? item.precioActual ?? 0);
        const name = item.name || item.nombre || 'Zapatilla';
        subtotalModal += price * item.cantidad;

        const div = document.createElement('div');
        div.className = "flex justify-between py-1";
        div.innerHTML = `
          <span>${item.cantidad}x ${name}</span>
          <span class="font-semibold">${formatCLP(price * item.cantidad)}</span>
        `;
        modalListaProductos.appendChild(div);
      });

      const totalModal = subtotalModal * 1.19; 
      document.getElementById('modal-total-pagado').innerText = formatCLP(totalModal);

      modalExito.classList.remove('hidden');
      localStorage.removeItem('carrito');
    });
  }

  if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', () => {
      modalExito.classList.add('hidden');
      window.location.href = 'index.html';
    });
  }
});