import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import AdminShell from './AdminShell';
const session = { nombre: 'Admin', email: 'admin@example.com' };
const media = matches => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() });
describe('navegación administrativa', () => {
 beforeEach(() => { localStorage.clear(); vi.stubGlobal('matchMedia', vi.fn(() => media(false))); });
 afterEach(() => vi.unstubAllGlobals());
 it('muestra el logo y conserva la navegación al contraer la barra', async () => {
  const user = userEvent.setup(); render(<AdminShell page="products" session={session}><h1>Productos</h1></AdminShell>);
  expect(screen.getByAltText('SneakerX').getAttribute('src')).toBe('/img/logosnk.png');
  expect(screen.getByRole('link', { name: 'Productos' }).getAttribute('aria-current')).toBe('page');
  await user.click(screen.getByRole('button', { name: 'Contraer barra lateral' }));
  expect(localStorage.getItem('admin_sidebar_compact')).toBe('true');
  expect(screen.getByRole('button', { name: 'Expandir barra lateral' })).toBeTruthy();
 });
 it('abre el menú móvil y lo cierra con Escape devolviendo el foco', async () => {
  vi.stubGlobal('matchMedia', vi.fn(() => media(true)));
  const user = userEvent.setup(); render(<AdminShell page="dashboard" session={session}><h1>Resumen</h1></AdminShell>);
  const trigger = screen.getByRole('button', { name: 'Abrir menú' }); await user.click(trigger);
  expect(screen.getByRole('dialog', { name: 'Navegación de administración' })).toBeTruthy();
  expect(document.body.style.overflow).toBe('hidden');
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull(); expect(document.activeElement).toBe(trigger);
  expect(document.body.style.overflow).not.toBe('hidden');
 });
 it('limita la navegación de vendedores a sus secciones', () => {
  render(<AdminShell page="dashboard" session={session} isSeller><h1>Resumen</h1></AdminShell>);
  expect(screen.queryByRole('link', { name: 'Blog' })).toBeNull();
  expect(screen.queryByRole('link', { name: 'Atención al cliente' })).toBeNull();
  expect(screen.getByRole('link', { name: 'Clientes' })).toBeTruthy();
 });
});
