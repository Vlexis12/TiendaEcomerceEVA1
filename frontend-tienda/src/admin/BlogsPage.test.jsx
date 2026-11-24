import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BlogsPage from './BlogsPage';
import { blogService } from '../services/api';
vi.mock('../services/api', () => ({ blogService: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() } }));
const blog = { id: 1, title: 'Nike urbano', summary: 'Ideas para vestir', image: '/img/shoe.jpg', content: 'Un contenido original.', date: '2026-11-23' };
describe('administración de blogs', () => {
 beforeEach(() => { vi.clearAllMocks(); blogService.getAll.mockResolvedValue([blog]); });
 it('busca publicaciones y permite volver a la lista', async () => {
  const user = userEvent.setup(); render(<BlogsPage/>);
  await screen.findByRole('heading', { name: blog.title });
  await user.type(screen.getByRole('searchbox'), 'inexistente');
  expect(screen.getByText('No encontramos esa historia.')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }));
  expect(screen.getByRole('heading', { name: blog.title })).toBeTruthy();
 });
 it('guarda la edición con su id y actualiza la tarjeta', async () => {
  const user = userEvent.setup(); blogService.update.mockResolvedValue({ ...blog, title: 'Nueva historia' }); render(<BlogsPage/>);
  await user.click(await screen.findByRole('button', { name: 'Editar '+blog.title }));
  const title = screen.getByRole('textbox', { name: /Título/ });
  await user.clear(title); await user.type(title, 'Nueva historia');
  await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));
  await waitFor(() => expect(blogService.update).toHaveBeenCalledWith(1, { title: 'Nueva historia', summary: blog.summary, image: blog.image, content: blog.content }));
  expect(await screen.findByRole('heading', { name: 'Nueva historia' })).toBeTruthy();
 });
 it('elimina únicamente después de confirmar', async () => {
  const user = userEvent.setup(); const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false); render(<BlogsPage/>);
  const remove = await screen.findByRole('button', { name: 'Eliminar '+blog.title });
  await user.click(remove); expect(blogService.remove).not.toHaveBeenCalled();
  confirm.mockReturnValue(true); blogService.remove.mockResolvedValue(null); await user.click(remove);
  await waitFor(() => expect(blogService.remove).toHaveBeenCalledWith(1));
  expect(await screen.findByText('Tu primera historia empieza aquí.')).toBeTruthy(); confirm.mockRestore();
 });
});
