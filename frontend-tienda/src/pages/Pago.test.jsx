import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Pago from './Pago';

const cart = [{ id: 3, name: 'Nike Air Force 1', price: 100000, image: '/shoe.jpg', size: 42, cantidad: 2 }];

describe('pago y boleta', () => {
    beforeEach(() => localStorage.clear());

    it('guarda la compra con los datos del comprador y la boleta, sin guardar datos de la tarjeta', async () => {
        const user = userEvent.setup();
        const onPurchaseComplete = vi.fn();
        render(<Pago carrito={cart} onPagoCompletado={onPurchaseComplete} />);

        await user.type(screen.getByLabelText('Nombre'), 'Ana');
        await user.type(screen.getByLabelText('Apellido'), 'Compradora');
        await user.type(screen.getByLabelText('Correo del comprador'), 'ANA@example.com');
        await user.type(screen.getByLabelText('RUT'), '12345678-9');
        await user.type(screen.getByLabelText('Teléfono'), '912345678');
        await user.selectOptions(screen.getByLabelText('Método de pago'), 'Débito');
        await user.type(screen.getByLabelText('Número de tarjeta'), '4111111111111111');
        await user.type(screen.getByLabelText('Vencimiento'), '1228');
        await user.type(screen.getByLabelText('CVV'), '123');
        fireEvent.submit(screen.getByRole('button', { name: 'Pagar ahora' }).closest('form'));

        expect(await screen.findByRole('heading', { name: '¡Compra finalizada!' })).toBeTruthy();
        expect(screen.getByText('ANA@example.com'.toLowerCase())).toBeTruthy();
        expect(screen.getByText(/Nike Air Force 1 · Talla 42 × 2/)).toBeTruthy();
        expect(onPurchaseComplete).toHaveBeenCalledOnce();
        const savedPurchases = JSON.parse(localStorage.getItem('store_purchases'));
        expect(savedPurchases).toHaveLength(1);
        expect(savedPurchases[0].buyer).toMatchObject({ name: 'Ana Compradora', email: 'ana@example.com' });
        expect(savedPurchases[0].items[0]).toMatchObject({ name: 'Nike Air Force 1', quantity: 2 });
        expect(savedPurchases[0]).not.toHaveProperty('tarjeta');
        expect(savedPurchases[0]).not.toHaveProperty('cvv');
        expect(savedPurchases[0]).not.toHaveProperty('vencimiento');
    });

    it('no registra una compra cuando el carrito está vacío', async () => {
        const user = userEvent.setup();
        render(<Pago carrito={[]} onPagoCompletado={vi.fn()} />);

        await user.selectOptions(screen.getByLabelText('Método de pago'), 'Débito');
        fireEvent.submit(screen.getByRole('button', { name: 'Pagar ahora' }).closest('form'));

        expect(screen.getByRole('alert').textContent).toBe('Tu carrito está vacío.');
        expect(localStorage.getItem('store_purchases')).toBeNull();
    });
});
