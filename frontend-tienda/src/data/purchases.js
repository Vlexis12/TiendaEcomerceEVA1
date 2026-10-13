const PURCHASES_KEY = 'store_purchases';

export function getPurchases() {
    const stored = localStorage.getItem(PURCHASES_KEY);
    if (stored === null) return [];

    const purchases = JSON.parse(stored);
    if (!Array.isArray(purchases)) {
        throw new Error('No se pudo leer el historial de compras.');
    }
    return purchases;
}

export function createPurchase(purchase) {
    const purchases = getPurchases();
    const savedPurchase = {
        ...purchase,
        receiptNumber: `SX-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        purchasedAt: new Date().toISOString(),
    };
    localStorage.setItem(PURCHASES_KEY, JSON.stringify([savedPurchase, ...purchases]));
    return savedPurchase;
}
