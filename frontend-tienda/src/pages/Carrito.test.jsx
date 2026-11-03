import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Carrito from './Carrito';

const product = {
    id: 1,
    name: 'Nike Air Force 1',
    price: 10000,
    image: '/af1.webp',
    size: 42,
    cantidad: 2,
};

describe('vista del carrito', () => {
    beforeEach(() => localStorage.clear());

    it('muestra el subtotal, el IVA y el total de los productos', () => {
        render(<Carrito carrito={[product]} onCambiarCantidad={vi.fn()} onEliminarProducto={vi.fn()} />);

        expect(screen.getByText('Nike Air Force 1')).toBeTruthy();
        expect(screen.getAllByText('$20.000')).toHaveLength(2);
        expect(screen.getByText('$3.800')).toBeTruthy();
        expect(screen.getByText('$23.800')).toBeTruthy();
    });

    it('permite aumentar y eliminar un producto del carrito', async () => {
        const user = userEvent.setup();
        const onCambiarCantidad = vi.fn();
        const onEliminarProducto = vi.fn();
        render(<Carrito carrito={[product]} onCambiarCantidad={onCambiarCantidad} onEliminarProducto={onEliminarProducto} />);

        await user.click(screen.getByRole('button', { name: 'Aumentar cantidad de Nike Air Force 1' }));
        await user.click(screen.getByRole('button', { name: 'Eliminar Nike Air Force 1' }));

        expect(onCambiarCantidad).toHaveBeenCalledWith(1, 42, 3);
        expect(onEliminarProducto).toHaveBeenCalledWith(1, 42);
    });
});
