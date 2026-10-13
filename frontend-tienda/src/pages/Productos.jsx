import { useState } from 'react';
import { Producto } from '../components/Producto';
import { formatCLP } from '../data/db';
import Navbar from '../components/Navbar';

const imagePath = (image) => image.startsWith('/') ? image : `/${image}`;

function Productos({ productos, carrito, onAgregarCarrito, onCambiarCantidad, onEliminarProducto }) {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const [mostrarMiniCarrito, setMostrarMiniCarrito] = useState(false);

    const agregarYMostrarCarrito = (producto, talla) => {
        onAgregarCarrito(producto, talla);
        setMostrarMiniCarrito(true);
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-slate-900 antialiased">
            <Navbar
                totalItems={totalItems}
                activePath="/productos"
                onCartClick={() => setMostrarMiniCarrito((visible) => !visible)}
                cartOpen={mostrarMiniCarrito}
            />

            {mostrarMiniCarrito && (
                <aside id="mini-carrito" className="fixed right-4 top-20 z-40 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15" aria-label="Resumen del carrito">
                    <div className="flex items-center justify-between bg-[#111827] px-5 py-3 text-white">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Tu selección</p>
                            <h2 className="mt-0.5 font-bold">Carrito <span className="ml-1 text-xs font-normal text-slate-300">({totalItems})</span></h2>
                        </div>
                        <button type="button" onClick={() => setMostrarMiniCarrito(false)} className="grid h-9 w-9 place-items-center rounded-full border border-slate-600 text-xl leading-none text-slate-300 transition hover:border-white hover:bg-slate-700 hover:text-white" aria-label="Cerrar resumen del carrito">×</button>
                    </div>

                    {carrito.length === 0 ? (
                        <div className="px-5 py-10 text-center">
                            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-xl">🛒</div>
                            <p className="mt-3 text-sm font-semibold text-slate-700">Tu carrito está vacío</p>
                            <p className="mt-1 text-xs text-slate-500">Agrega una zapatilla para comenzar.</p>
                            <button type="button" onClick={() => setMostrarMiniCarrito(false)} style={{ borderRadius: '9999px' }} className="mt-5 rounded-full bg-[#111827] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700">
                                Seguir comprando
                            </button>
                        </div>
                    ) : (
                        <>
                            <ul className="max-h-72 space-y-3 overflow-y-auto p-4">
                                {carrito.map((item) => (
                                    <li key={`${item.id}-${item.size}`} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                                        <img src={imagePath(item.image)} alt={item.name} className="h-16 w-16 rounded-lg bg-white object-cover ring-1 ring-slate-200" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                                                    <p className="mt-1 text-xs text-slate-500">Talla {item.size}</p>
                                                </div>
                                                <button type="button" onClick={() => onEliminarProducto(item.id, item.size)} className="text-lg leading-none text-slate-400 transition hover:text-red-600" aria-label={`Eliminar ${item.name}`}>×</button>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                                                    <button type="button" onClick={() => onCambiarCantidad(item.id, item.size, item.cantidad - 1)} className="grid h-7 w-7 place-items-center rounded-full text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label={`Disminuir cantidad de ${item.name}`}>−</button>
                                                    <span className="min-w-7 text-center text-xs font-bold text-slate-900">{item.cantidad}</span>
                                                    <button type="button" onClick={() => onCambiarCantidad(item.id, item.size, item.cantidad + 1)} className="grid h-7 w-7 place-items-center rounded-full text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label={`Aumentar cantidad de ${item.name}`}>+</button>
                                                </div>
                                                <p className="text-xs font-bold text-slate-900">{formatCLP(item.price * item.cantidad)}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                                    <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-4">
                                <div className="mb-3 flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Total</span>
                                    <strong className="text-base text-slate-900">{formatCLP(carrito.reduce((sum, item) => sum + Number(item.price) * item.cantidad, 0))}</strong>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                <button type="button" onClick={() => setMostrarMiniCarrito(false)} style={{ borderRadius: '9999px' }} className="flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2.5 text-center text-xs font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-50">
                                    Seguir comprando
                                </button>
                                <a href="/carrito" style={{ color: '#ffffff', borderRadius: '9999px' }} className="flex min-h-10 items-center justify-center rounded-full bg-[#111827] px-3 py-2.5 text-center text-xs font-semibold no-underline transition hover:bg-slate-700">
                                    Ir al carrito
                                </a>
                                </div>
                            </div>
                        </>
                    )}
                </aside>
            )}

            <main className="mx-auto max-w-[100rem] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Selección SneakerX</p>
                        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Elige tu próximo par.</h1>
                        <p className="mt-4 max-w-xl text-slate-500">Siluetas para todos los días.</p>
                    </div>
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-500 ring-1 ring-slate-200">Colección 2026</span>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {productos.map((producto) => (
                        <Producto
                            key={producto.id}
                            producto={{ ...producto, image: imagePath(producto.image) }}
                            onAgregarCarrito={agregarYMostrarCarrito}
                        />
                    ))}
                </div>
            </main>

            <footer className="bg-[#111827] px-6 py-8 text-slate-400 lg:px-8">
                <div className="mx-auto flex max-w-[100rem] flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 SneakerX. Hecho para moverte.</p>
                    <a href="/" className="transition hover:text-white">Volver al inicio</a>
                </div>
            </footer>
        </div>
    );
}

export default Productos;
