// src/data/db.js
const PRODUCTS_KEY = 'store_products';
const CART_KEY = 'carrito';

export const availableSizes = [39, 40, 41, 42, 43, 44];

// --- OPERACIONES DE PRODUCTOS (CRUD) ---

export const getProducts = () => {
    const stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || 'null');
    if (!Array.isArray(stored)) {
        return [];
    }
    return stored;
};

export const saveProducts = (products) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const sortProductsByPrice = (products, direction = 'asc') => {
    const multiplier = direction === 'desc' ? -1 : 1;
    return [...products].sort((left, right) => (Number(left.price) - Number(right.price)) * multiplier);
};

export const createProduct = (newProduct) => {
    const products = getProducts();
    products.push(newProduct);
    saveProducts(products);
};

export const deleteProduct = (id) => {
    const products = getProducts();
    const filteredProducts = products.filter(product => product.id !== Number(id));
    saveProducts(filteredProducts);
};

// --- OPERACIONES DEL CARRITO ---

export const getCart = () => {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(cart) ? cart : [];
};

export const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Funciones utilitarias que puedes exportar para usar en tus componentes
export const formatCLP = (value) => {
    const amount = Number(value || 0);
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);
};