import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Productos from './Productos';

const products = [
    { id: 1, name: 'Par caro', price: 30000, image: '/caro.jpg', description: 'Prueba' },
    { id: 2, name: 'Par barato', price: 10000, image: '/barato.jpg', description: 'Prueba' },
    { id: 3, name: 'Par medio', price: 20000, image: '/medio.jpg', description: 'Prueba' },
];

function renderCatalog() {
    return render(
        <Productos
            productos={products}
            carrito={[]}
            onAgregarCarrito={vi.fn()}
            onCambiarCantidad={vi.fn()}
            onEliminarProducto={vi.fn()}
        />,
    );
}

describe('filtro de precios del catálogo', () => {
    it('ordena los productos mostrados desde el menor precio hasta el mayor', async () => {
        const user = userEvent.setup();
        renderCatalog();

        await user.selectOptions(screen.getByLabelText('Ordenar por precio'), 'asc');
        const cards = screen.getAllByRole('article');
        expect(cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent)).toEqual([
            'Par barato',
            'Par medio',
            'Par caro',
        ]);
    });

    it('restablece el orden original al seleccionar el orden recomendado', async () => {
        const user = userEvent.setup();
        renderCatalog();

        const sort = screen.getByLabelText('Ordenar por precio');
        await user.selectOptions(sort, 'asc');
        await user.selectOptions(sort, 'featured');
        const cards = screen.getAllByRole('article');
        expect(cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent)).toEqual([
            'Par caro',
            'Par barato',
            'Par medio',
        ]);
    });
});
