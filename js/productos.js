const PRODUCTS_KEY = 'store_products';
const CART_KEY = 'carrito';

const defaultProducts = [
    { id: 1, name: 'Nike Air Force 1', price: 119990, image: 'img/zapatillas/af1.webp', description: 'El clásico blanco que funciona con todo.', previousPrice: 150000 },
    { id: 2, name: 'Nike Jordan 1 Low', price: 129990, image: 'img/zapatillas/jordan1.webp', description: 'Perfil bajo, actitud alta y comodidad diaria.', previousPrice: 160000 },
    { id: 3, name: 'Nike Book 2 Tigers', price: 115990, image: 'img/zapatillas/book21.webp', description: 'Rendimiento y estilo para dominar la cancha.', previousPrice: 180000 },
    { id: 4, name: 'Nike Shox R4', price: 219990, image: 'img/zapatillas/NikeShoxR4.jpg', description: 'El balance justo entre retro y actual.', previousPrice: 320000 },
    { id: 5, name: 'Jordan Retro 11', price: 219990, image: 'img/zapatillas/retro11.jpg', description: 'El balance justo entre retro y actual.', previousPrice: 320000 },
    { id: 6, name: 'Jordan Retro 6', price: 219990, image: 'img/zapatillas/retro6.jpg', description: 'El balance justo entre retro y actual.', previousPrice: 320000 },
    { id: 7, name: 'Jordan Retro 3', price: 219990, image: 'img/zapatillas/retro3.webp', description: 'El balance justo entre retro y actual.', previousPrice: 320000 },
    { id: 8, name: 'Jordan Retro 5', price: 219990, image: 'img/zapatillas/retro5.png', description: 'El balance justo entre retro y actual.', previousPrice: 320000 }
]
function toClpValue(value) {
    const amount = Number(value || 0);
    return amount > 0 && amount < 1000 ? Math.round(amount * 1000) : amount;
}

function formatCLP(value) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(toClpValue(value));
}

function normalizeProduct(product) {
    const name = product.name || product.nombre || 'Zapatilla StepHouse';
    const price = toClpValue(product.price ?? product.precioActual);
    const image = product.image || product.imagen || 'img/zapatillas/af1.webp';
    return {
        id: Number(product.id),
        name,
        price,
        image,
        description: product.description || product.descripcion || 'Zapatilla seleccionada por StepHouse.',
        previousPrice: toClpValue(product.previousPrice || product.precioAnterior?.replace(/[^0-9.]/g, '') || price)
    };
}

function getProducts() {
    const stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || 'null');
    if (!Array.isArray(stored) || stored.length === 0) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
        return defaultProducts.map(normalizeProduct);
    }
    const currentProducts = stored.map(normalizeProduct);
    const existingNames = new Set(currentProducts.map(product => product.name.toLowerCase()));
    const missingFeatured = defaultProducts.filter(product => !existingNames.has(product.name.toLowerCase()));
    if (missingFeatured.length) {
        const mergedProducts = [...currentProducts, ...missingFeatured.map(normalizeProduct)];
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mergedProducts));
        return mergedProducts;
    }
    return currentProducts;
}

function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products.map(normalizeProduct)));
}

function resolveProductImage(image) {
    return window.location.pathname.includes('/admin/') && image.startsWith('img/') ? `../${image}` : image;
}

function getCart() {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(cart) ? cart : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderAdminTable() {
    const tableBody = document.getElementById('product-table-body');
    if (!tableBody) return;
    const products = getProducts();
    tableBody.innerHTML = '';
    if (!products.length) {
        tableBody.innerHTML = '<tr><td colspan="4" class="px-5 py-12 text-center text-sm text-slate-500">No hay zapatillas registradas.</td></tr>';
        return;
    }
    products.forEach(product => {
        tableBody.innerHTML += `<tr class="transition hover:bg-slate-50"><td class="px-5 py-4"><img src="${resolveProductImage(product.image)}" class="h-14 w-14 rounded-xl object-cover" alt="${product.name}"></td><td class="px-5 py-4 font-semibold">${product.name}</td><td class="px-5 py-4">${formatCLP(product.price)}</td><td class="px-5 py-4 text-right"><button type="button" onclick="editProduct(${product.id})" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">Editar</button><button type="button" onclick="deleteProduct(${product.id})" class="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">Eliminar</button></td></tr>`;
    });
}

function getProductForm() {
    return document.getElementById('product-form');
}

function isSneakerName(name) {
    return /zapatilla|nike|air|jordan|runner|sneaker|sport|street|basket|court|force/i.test(name);
}

function setupAdmin() {
    const form = getProductForm();
    if (!form) return;
    form.addEventListener('submit', event => {
        event.preventDefault();
        const id = document.getElementById('product-id').value;
        const name = document.getElementById('name').value.trim();
        const price = Number.parseInt(document.getElementById('price').value, 10);
        const image = document.getElementById('image').value.trim();
        if (!isSneakerName(name)) {
            alert('Solo puedes ingresar zapatillas. Incluye una marca o modelo de zapatilla en el nombre.');
            return;
        }
        if (!Number.isFinite(price) || price <= 0) {
            alert('Ingresa un precio válido para la zapatilla.');
            return;
        }
        const products = getProducts();
        const product = normalizeProduct({ id: id ? Number(id) : Date.now(), name, price, image });
        saveProducts(id ? products.map(item => item.id === Number(id) ? product : item) : [...products, product]);
        renderAdminTable();
        window.resetForm();
    });
    renderAdminTable();
}

window.editProduct = function (id) {
    const product = getProducts().find(item => item.id === Number(id));
    if (!product) return;
    document.getElementById('product-id').value = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('image').value = product.image;
    document.getElementById('form-title').textContent = 'Editar zapatilla';
    document.getElementById('btn-save').textContent = 'Actualizar';
    document.getElementById('btn-cancel').classList.remove('hidden');
};

window.deleteProduct = function (id) {
    if (!confirm('¿Eliminar esta zapatilla del catálogo?')) return;
    saveProducts(getProducts().filter(product => product.id !== Number(id)));
    renderAdminTable();
};

window.resetForm = function () {
    const form = getProductForm();
    if (!form) return;
    form.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('form-title').textContent = 'Agregar Nueva Zapatilla';
    document.getElementById('btn-save').textContent = 'Guardar';
    document.getElementById('btn-cancel').classList.add('hidden');
};

function renderStorefront() {
    const grid = document.getElementById('grid-productos');
    if (!grid) return;
    const products = getProducts();
    grid.innerHTML = products.map(product => `<article class="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"><div class="h-72 overflow-hidden bg-slate-100"><img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover transition duration-500 group-hover:scale-105"></div><div class="flex flex-1 flex-col p-5"><p class="text-xs uppercase tracking-wider text-slate-400">Zapatilla StepHouse</p><h2 class="mt-2 text-lg font-bold">${product.name}</h2><p class="mt-2 flex-1 text-sm leading-6 text-slate-500">${product.description}</p><div class="mt-5 flex items-center justify-between"><div><span class="font-bold">${formatCLP(product.price)}</span><span class="ml-2 text-sm text-slate-400 line-through">${formatCLP(product.previousPrice)}</span></div><button type="button" data-id="${product.id}" class="btn-agregar rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">Añadir</button></div></div></article>`).join('');
    grid.querySelectorAll('.btn-agregar').forEach(button => button.addEventListener('click', event => addToCart(Number(event.currentTarget.dataset.id))));
}

function updateCartBadge() {
    const badge = document.getElementById('contador-carrito');
    if (!badge) return;
    const total = getCart().reduce((sum, item) => sum + Number(item.cantidad || 0), 0);
    badge.textContent = total;
    badge.classList.toggle('hidden', total === 0);
}

function addToCart(id) {
    const product = getProducts().find(item => item.id === id);
    if (!product) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) existing.cantidad += 1;
    else cart.push({ ...product, cantidad: 1 });
    saveCart(cart);
    renderCartViews();
    document.getElementById('carrito')?.classList.remove('hidden');
}

function removeFromCart(id) {
    saveCart(getCart().filter(item => item.id !== id));
    renderCartViews();
}

function cartItemMarkup(item, page) {
    const removeClass = page ? 'btn-eliminar-pagina' : 'btn-eliminar';
    return `<li class="flex items-center gap-4 py-4"><img src="${item.image || item.imagen}" alt="${item.name || item.nombre}" class="h-16 w-16 rounded-xl object-cover"><div class="min-w-0 flex-1"><h3 class="truncate text-sm font-semibold">${item.name || item.nombre}</h3><p class="mt-1 text-xs text-slate-500">${formatCLP(item.price ?? item.precioActual)} · Cantidad: ${item.cantidad}</p></div><button type="button" class="${removeClass} rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900" data-id="${item.id}" aria-label="Eliminar ${item.name || item.nombre}">×</button></li>`;
}

function renderCartViews() {
    const cart = getCart();
    const sideList = document.getElementById('lista-carrito');
    const pageList = document.getElementById('lista-carrito-pagina');
    if (sideList) sideList.innerHTML = cart.length ? cart.map(item => cartItemMarkup(item, false)).join('') : '<li class="py-8 text-center text-sm text-slate-500">Tu carrito está vacío.</li>';
    if (pageList) pageList.innerHTML = cart.length ? cart.map(item => cartItemMarkup(item, true)).join('') : '<li class="py-12 text-center text-sm text-slate-500">Tu carrito está vacío. Explora el catálogo para comenzar.</li>';
    document.querySelectorAll('.btn-eliminar, .btn-eliminar-pagina').forEach(button => button.addEventListener('click', () => removeFromCart(Number(button.dataset.id))));
    const subtotal = cart.reduce((sum, item) => sum + Number(item.price ?? item.precioActual) * Number(item.cantidad), 0);
    const iva = subtotal * 0.19;
    document.getElementById('resumen-subtotal')?.replaceChildren(formatCLP(subtotal));
    document.getElementById('resumen-iva')?.replaceChildren(formatCLP(iva));
    document.getElementById('resumen-total')?.replaceChildren(formatCLP(subtotal + iva));
    const count = cart.reduce((sum, item) => sum + Number(item.cantidad), 0);
    const totalLabel = document.getElementById('cantidad-carrito-total');
    if (totalLabel) totalLabel.textContent = `(${count})`;
    updateCartBadge();
}

function setupCartPanel() {
    const panel = document.getElementById('carrito');
    const toggle = () => panel?.classList.toggle('hidden');
    document.getElementById('btn-carrito')?.addEventListener('click', toggle);
    document.getElementById('cerrar-carrito')?.addEventListener('click', toggle);
    document.getElementById('continuar-comprando')?.addEventListener('click', toggle);
}

document.addEventListener('DOMContentLoaded', () => {
    setupAdmin();
    renderStorefront();
    setupCartPanel();
    renderCartViews();
});
