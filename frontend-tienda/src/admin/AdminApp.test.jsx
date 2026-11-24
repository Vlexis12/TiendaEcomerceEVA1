import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminApp from './AdminApp';
vi.mock('../services/api', async (importOriginal) => {
 const actual = await importOriginal();
 return { ...actual, authService: { ...actual.authService, getProfile: vi.fn().mockResolvedValue({ username: 'Admin', email: 'admin@example.com', role: 'ADMIN' }) } };
});

describe('historial de compras del administrador', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('sneakerx_jwt', 'test-token');
        window.history.replaceState({}, '', '/admin/compras');
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

        expect(await screen.findByRole('heading', { name: 'Historial de compras' })).toBeTruthy();
        expect(screen.getByText('ana@example.com')).toBeTruthy();
        await user.click(screen.getByRole('button', { name: 'Ver boleta' }));

        expect(screen.getByRole('dialog')).toBeTruthy();
        const receiptDialog = screen.getByRole('dialog');
        expect(within(receiptDialog).getByText('SX-123-ABCDE')).toBeTruthy();
        expect(within(receiptDialog).getByText(/Nike Air Force 1/)).toBeTruthy();
    });
});
