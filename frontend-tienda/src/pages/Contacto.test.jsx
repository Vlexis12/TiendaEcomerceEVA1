import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Contacto from './Contacto';

describe('vista de contacto', () => {
    it('confirma el envío del mensaje y permite cerrar la confirmación', async () => {
        const user = userEvent.setup();
        render(<Contacto />);

        await user.type(screen.getByPlaceholderText('Tu nombre'), 'Ana Compradora');
        await user.type(screen.getByPlaceholderText('tu@correo.com'), 'ana@example.com');
        await user.type(screen.getByPlaceholderText('¿En qué podemos ayudarte?'), 'Consulta sobre un pedido');
        await user.type(screen.getByPlaceholderText('Escribe tu mensaje...'), 'Quiero conocer el estado de mi compra.');
        fireEvent.submit(screen.getByRole('button', { name: /Enviar mensaje/ }).closest('form'));

        expect(screen.getByRole('dialog')).toBeTruthy();
        expect(screen.getByRole('heading', { name: 'Mensaje enviado' })).toBeTruthy();
        await user.click(screen.getByRole('button', { name: 'Cerrar' }));
        expect(screen.queryByRole('dialog')).toBeNull();
    });
});
