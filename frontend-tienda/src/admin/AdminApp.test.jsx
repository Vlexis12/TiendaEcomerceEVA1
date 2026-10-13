import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import AdminApp from './AdminApp';

describe('historial de compras del administrador', () => {
    beforeEach(() => {
        localStorage.clear();
        window.history.replaceState({}, '', '/admin/compras.html');
        localStorage.setItem('store_users', JSON.stringify([
            { id: 1, name: 'Admin', role: 'Administrador', email: 'admin@example.com', password: 'secret' },
        ]));
        localStorage.setItem('usuarioLogueado', JSON.stringify({
            nombre: 'Admin',
            email: 'admin@example.com',
            rol: 'admin',
        }));
        localStorage.setItem('store_purchases', JSON.stringify([{
            receiptNumber: 'SX-123-ABCDE',
            purchasedAt: '2026-10-12T12:00:00.000Z',
            buyer: { name: 'Ana Compradora', email: 'ana@example.com' },
            items: [{ id: 2, name: 'Nike Air Force 1', price: 100000, size: 42, quantity: 1 }],
            subtotal: 100000,
            tax: 19000,
            total: 119000,
            paymentMethod: 'Débito',
            delivery: { address: 'Calle 123', phone: '912345678' },
        }]));
    });

    it('muestra al comprador y permite abrir el detalle de su boleta', async () => {
        const user = userEvent.setup();
        render(<AdminApp />);

        expect(screen.getByRole('heading', { name: 'Historial de compras' })).toBeTruthy();
        expect(screen.getByText('ana@example.com')).toBeTruthy();
        await user.click(screen.getByRole('button', { name: 'Ver boleta' }));

        expect(screen.getByRole('dialog')).toBeTruthy();
        const receiptDialog = screen.getByRole('dialog');
        expect(within(receiptDialog).getByText('SX-123-ABCDE')).toBeTruthy();
        expect(within(receiptDialog).getByText(/Nike Air Force 1/)).toBeTruthy();
    });
});
