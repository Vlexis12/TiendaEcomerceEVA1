import { beforeEach, describe, expect, it } from 'vitest';
import { sortProductsByPrice } from './db';
import { createPurchase, getPurchases } from './purchases';

describe('ordenamiento del catálogo', () => {
    const products = [
        { id: 1, name: 'A', price: 300 },
        { id: 2, name: 'B', price: 100 },
        { id: 3, name: 'C', price: 200 },
    ];

    it('ordena de menor a mayor sin modificar el catálogo original', () => {
        expect(sortProductsByPrice(products).map((product) => product.price)).toEqual([100, 200, 300]);
        expect(products.map((product) => product.price)).toEqual([300, 100, 200]);
    });

    it('ordena de mayor a menor', () => {
        expect(sortProductsByPrice(products, 'desc').map((product) => product.price)).toEqual([300, 200, 100]);
    });
});

describe('almacenamiento del historial de compras', () => {
    beforeEach(() => localStorage.clear());

    it('guarda la boleta y devuelve primero las compras más recientes', () => {
        const purchase = {
            buyer: { name: 'Alex Comprador', email: 'alex@example.com' },
            items: [{ id: 1, name: 'Nike Air Force 1', price: 100000, size: 42, quantity: 1 }],
            subtotal: 100000,
            tax: 19000,
            total: 119000,
            paymentMethod: 'Débito',
            delivery: { address: 'Calle 123' },
        };

        const firstReceipt = createPurchase(purchase);
        const secondReceipt = createPurchase({ ...purchase, buyer: { name: 'Otra Persona', email: 'otra@example.com' } });

        expect(firstReceipt.receiptNumber).toMatch(/^SX-/);
        expect(firstReceipt.purchasedAt).toBeTruthy();
        expect(getPurchases().map((saved) => saved.receiptNumber)).toEqual([secondReceipt.receiptNumber, firstReceipt.receiptNumber]);
        expect(getPurchases()[0].buyer.email).toBe('otra@example.com');
    });
});
