import { formatCLP } from '../data/db';
import Navbar from '../components/Navbar';

function Carrito({ carrito, onCambiarCantidad, onEliminarProducto }) {
    const subtotal = carrito.reduce((sum, item) => sum + Number(item.price) * item.cantidad, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-slate-900 antialiased">
            <Navbar totalItems={carrito.reduce((sum, item) => sum + item.cantidad, 0)} activePath="/carrito" />

            <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
                <div className="mb-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Tu selección</p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight">Carrito</h1>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        {carrito.length === 0 ? (
                            <p className="py-12 text-center text-sm text-slate-500">Tu carrito está vacío. Explora el catálogo para comenzar.</p>
                        ) : (
                            <ul className="space-y-4">
                                {carrito.map((item) => (
                                    <li key={`${item.id}-${item.size}`} className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                        <img src={item.image.startsWith('/') ? item.image : `/${item.image}`} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate text-sm font-semibold">{item.name}</h2>
                                            <p className="mt-1 text-xs text-slate-500">Talla {item.size}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <button type="button" onClick={() => onCambiarCantidad(item.id, item.size, item.cantidad - 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-lg transition hover:border-slate-900" aria-label={`Disminuir cantidad de ${item.name}`}>−</button>
                                                <span className="min-w-6 text-center text-sm font-semibold">{item.cantidad}</span>
                                                <button type="button" onClick={() => onCambiarCantidad(item.id, item.size, item.cantidad + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-lg transition hover:border-slate-900" aria-label={`Aumentar cantidad de ${item.name}`}>+</button>
                                            </div>
                                            <p className="mt-1 text-sm font-semibold">{formatCLP(item.price * item.cantidad)}</p>
                                        </div>
                                        <button type="button" onClick={() => onEliminarProducto(item.id, item.size)} className="rounded-lg p-2 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900" aria-label={`Eliminar ${item.name}`}>
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <aside className="h-fit rounded-2xl bg-[#111827] p-6 text-white">
                        <h2 className="text-lg font-bold">Resumen de compra</h2>
                        <dl className="mt-8 space-y-4 text-sm">
                            <div className="flex justify-between text-slate-400"><dt>Subtotal</dt><dd>{formatCLP(subtotal)}</dd></div>
                            <div className="flex justify-between text-slate-400"><dt>IVA (19%)</dt><dd>{formatCLP(iva)}</dd></div>
                            <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold"><dt>Total</dt><dd>{formatCLP(total)}</dd></div>
                        </dl>
                        <a href="/pago" style={{ color: '#111827' }} className="mt-8 flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold no-underline transition hover:bg-slate-200">Pagar ahora</a>
                        <a href="/productos" className="mt-4 block text-center text-sm text-slate-400 transition hover:text-white">Seguir comprando</a>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default Carrito;
