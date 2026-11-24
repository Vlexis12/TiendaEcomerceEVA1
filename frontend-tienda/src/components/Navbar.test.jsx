import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from './Navbar';
vi.mock('../services/api', () => ({ authService: { getProfile: vi.fn() }, API_BASE: '/api' }));
describe('navegación de la tienda', () => {
 beforeEach(() => localStorage.clear());
 it('abre la navegación móvil, la cierra con Escape y muestra el carrito', async () => {
  const user=userEvent.setup(); render(<Navbar totalItems={3} activePath="/productos"/>);
  expect(screen.getByRole('link', {name:'Carrito, 3 productos'}).getAttribute('href')).toBe('/carrito');
  await user.click(screen.getByRole('button', {name:'Abrir menú'}));
  expect(screen.getByRole('navigation',{name:'Navegación móvil'})).toBeTruthy();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('navigation',{name:'Navegación móvil'})).toBeNull();
 });
 it('ofrece acceso al panel para un vendedor autenticado', async () => {
  localStorage.setItem('usuarioLogueado',JSON.stringify({nombre:'Vendedor',rol:'vendedor'}));
  const user=userEvent.setup(); render(<Navbar/>);
  await user.click(screen.getByRole('button',{name:/Mi cuenta/}));
  expect(screen.getByRole('link',{name:'Panel de gestión'}).getAttribute('href')).toBe('/admin');
 });
});
