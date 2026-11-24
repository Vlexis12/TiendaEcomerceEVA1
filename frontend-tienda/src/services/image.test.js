import { describe, it, expect } from 'vitest';
import { imagePath } from './image';
describe('imagePath', () => {
 it('preserva URLs externas sin anteponer el servidor', () => {
  expect(imagePath(' https://cdn.example.com/image.jpg ')).toBe('https://cdn.example.com/image.jpg');
  expect(imagePath('//cdn.example.com/image.jpg')).toBe('//cdn.example.com/image.jpg');
 });
 it('resuelve rutas locales desde la raíz y tolera imágenes ausentes', () => {
  expect(imagePath('img/shoe.jpg')).toBe('/img/shoe.jpg');
  expect(imagePath('/img/shoe.jpg')).toBe('/img/shoe.jpg');
  expect(imagePath(null)).toBe('');
 });
});
