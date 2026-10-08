// src/data/db.js
const PRODUCTS_KEY = 'store_products';
const CART_KEY = 'carrito';

export const availableSizes = [39, 40, 41, 42, 43, 44];

const defaultProducts = [
    { id: 1, name: 'Nike Air Force 1', price: 119990, image: 'img/zapatillas/af1.webp', description: 'Cuero limpio, amortiguación suave y una silueta que nunca pierde presencia.', previousPrice: 150000 },
    { id: 2, name: 'Nike Jordan 1 Low', price: 129990, image: 'img/zapatillas/jordan1.webp', description: 'Perfil bajo y espíritu de cancha para construir looks urbanos todos los días.', previousPrice: 160000 },
    { id: 3, name: 'Nike Book 2 Tigers', price: 115990, image: 'img/zapatillas/book21.webp', description: 'Respuesta ligera y soporte firme para quienes convierten el movimiento en juego.', previousPrice: 180000 },
    { id: 4, name: 'Nike Shox R4', price: 219990, image: 'img/zapatillas/NikeShoxR4.jpg', description: 'Tecnología visible y estética futurista para destacar desde cada ángulo.', previousPrice: 320000 },
    { id: 5, name: 'Jordan Retro 11', price: 219990, image: 'img/zapatillas/retro11.jpg', description: 'Un acabado elegante con energía competitiva y presencia de colección.', previousPrice: 320000 },
    { id: 6, name: 'Jordan Retro 6', price: 219990, image: 'img/zapatillas/retro6.jpg', description: 'Inspiración noventera, paneles estructurados y una actitud lista para la calle.', previousPrice: 320000 },
    { id: 7, name: 'Jordan Retro 3', price: 219990, image: 'img/zapatillas/retro3.webp', description: 'Texturas clásicas y amortiguación confiable en una forma reconocible al instante.', previousPrice: 320000 },
    { id: 8, name: 'Jordan Retro 5', price: 219990, image: 'img/zapatillas/retro5.png', description: 'Lengüeta protagonista y detalles inspirados en la velocidad para un estilo audaz.', previousPrice: 320000 }
];

// --- OPERACIONES DE PRODUCTOS (CRUD) ---

export const getProducts = () => {
    const stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || 'null');
    if (!Array.isArray(stored) || stored.length === 0) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return stored;
};

export const saveProducts = (products) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
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