import React, { useState, useEffect } from 'react';
import { getProducts, getCart, saveCart } from './data/db';
import { Producto } from './components/Producto';
import './App.css'; // Mantenemos tu archivo CSS por si tienes algo ahí

function App() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        setProductos(getProducts());
        setCarrito(getCart());
    }, []);

    const agregarAlCarrito = (producto, talla = 'Unica') => {
        const nuevoCarrito = [...carrito];
        const existente = nuevoCarrito.find(item => item.id === producto.id);
        
        if (existente) {
            existente.cantidad += 1;
        } else {
            nuevoCarrito.push({ ...producto, size: talla, cantidad: 1 });
        }
        
        setCarrito(nuevoCarrito);
        saveCart(nuevoCarrito);
    };

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    return (
        <div className="bg-[#f3f4f6] text-slate-900 antialiased min-h-screen">
            {/* Header / Navbar */}
            <header className="bg-white">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8" aria-label="Navegación principal">
                    <a href="/" className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#111827] text-lg font-black text-white">S</span>
                        <span>
                            <strong className="block text-lg tracking-tight">SneakerX</strong>
                            <small className="block text-[10px] font-semibold tracking-[0.22em] text-slate-400">Movimiento Diferente</small>
                        </span>
                    </a>
                    
                    <div className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
                        <a href="/" className="border-b-2 border-[#111827] pb-1 text-slate-900">Inicio</a>
                        <a href="/productos" className="transition hover:text-slate-900">Catálogo</a>
                        <a href="/nosotros" className="transition hover:text-slate-900">Nosotros</a>
                        <a href="/contacto" className="transition hover:text-slate-900">Contacto</a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-700 transition hover:border-slate-900">
                           🛒 ({totalItems})
                        </button>
                        <a href="/login" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900">Ingresar</a>
                    </div>
                </nav>
            </header>

            {/* Contenido Principal */}
            <main>
                {/* Sección Hero (Imagen destacada) */}
                <section className="relative overflow-hidden bg-[#111827]" aria-label="Colección destacada">
                    <div className="relative h-[430px] sm:h-[500px] lg:h-[540px]">
                        <div className="absolute inset-0 bg-black/35"></div>
                        {/* Como no tengo tu imagen, uso un color de fondo oscuro de prueba */}
                        <div className="absolute inset-0 h-full w-full bg-slate-800 object-cover opacity-100 transition-opacity duration-500 ease-in-out"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent"></div>
                        
                        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
                            <div className="max-w-xl text-white">
                                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Nueva selección / 2026</p>
                                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Colección SneakerX</h1>
                                <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200 sm:text-base">Zapatillas que marcan el paso de la nueva temporada.</p>
                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <a href="/productos" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-slate-200">Ver colección</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección Más Vendidas */}
                <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20" aria-labelledby="bestsellers-title">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Lo que todos están usando</p>
                            <h2 id="bestsellers-title" class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Más vendidas</h2>
                        </div>
                        <a href="/productos" className="text-sm font-semibold text-slate-600 transition hover:text-black">Ver todo el catálogo <span aria-hidden="true">→</span></a>
                    </div>
                    
                    {/* Aquí renderizamos los primeros 4 productos usando tu base de datos simulada */}
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {productos.slice(0, 4).map(producto => (
                            <Producto 
                                key={producto.id} 
                                producto={producto} 
                                onAgregarCarrito={agregarAlCarrito} 
                            />
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#111827] px-6 py-8 text-slate-400 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 SneakerX. Hecho para moverte.</p>
                    <div className="flex gap-5">
                        <a href="/nosotros" className="transition hover:text-white">Nosotros</a>
                        <a href="/productos" className="transition hover:text-white">Catálogo</a>
                        <a href="/login" className="transition hover:text-white">Ingresar</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;