import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import Cuenta from './Cuenta';

describe('vista de cuenta', () => {
    beforeEach(() => localStorage.clear());

    it('ofrece enlaces para iniciar sesión y crear una cuenta', () => {
        render(<Cuenta />);

        expect(screen.getByRole('link', { name: /Iniciar sesión/ }).getAttribute('href')).toBe('/login');
        expect(screen.getByRole('link', { name: /Crear una cuenta/ }).getAttribute('href')).toBe('/registro');
        expect(screen.getByRole('heading', { name: '¿Qué deseas hacer?' })).toBeTruthy();
    });
});
