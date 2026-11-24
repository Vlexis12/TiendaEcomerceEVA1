import { beforeEach, expect, test } from 'vitest';
import { getProducts } from './db';
import { getUsers } from './users';
import { getBlogs } from './blogData';

beforeEach(() => localStorage.clear());

test('no crea productos, usuarios ni publicaciones de demostración', () => {
    expect(getProducts()).toEqual([]);
    expect(getUsers()).toEqual([]);
    expect(getBlogs()).toEqual([]);
    expect(localStorage.getItem('store_products')).toBeNull();
    expect(localStorage.getItem('store_users')).toBeNull();
});

test('una lista de usuarios vacía no se repuebla automáticamente', () => {
    localStorage.setItem('store_users', '[]');
    expect(getUsers()).toEqual([]);
});
