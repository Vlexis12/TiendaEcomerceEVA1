import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { paymentService } from '../services/api';
import { formatCLP } from '../data/db';

function MisCompras({ totalItems = 0 }) {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(0);
    const pageSize = 5;

    useEffect(() => {
        const userId = localStorage.getItem('sneakerx_userId');
        if (!userId) { window.location.replace('/login'); return; }
        (async () => {
            try {
                const data = await paymentService.getHistorial(userId);
                const sorted = (Array.isArray(data) ? data : []).slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                setCompras(sorted);
            } catch (e) {
                setError(e.message || 'No se pudo cargar el historial.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const totalPages = Math.max(1, Math.ceil(compras.length / pageSize));
    const pageItems = compras.slice(page * pageSize, page * pageSize + pageSize);

    const formatFecha = (f) => {
        if (!f) return '';
        try { return new Date(f).toLocaleString('es-CL'); } catch { return f; }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-slate-900 antialiased">
            <Navbar totalItems={totalItems} activePath="/mis-compras" />
            <main className="mx-auto max-w-6xl px-6 py-10">
                <h1 className="text-3xl font-bold tracking-tight">Mis compras</h1>
                <p className="mt-2 text-slate-500">Historial de tus pedidos realizados.</p>
                {loading && <p className="mt-6 text-slate-500">Cargando...</p>}
                {error && <div className="mt-6 text-sm font-semibold text-red-500" role="alert">{error}</div>}
                {!loading && compras.length === 0 && !error && (
                    <p className="mt-6 text-slate-500">Aún no tienes compras registradas.</p>
                )}
                {!loading && compras.length > 0 && (
                    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4">Boleta</th>
                                        <th className="px-5 py-4">Fecha</th>
                                        <th className="px-5 py-4">Productos</th>
                                        <th className="px-5 py-4">Total</th>
                                        <th className="px-5 py-4 text-right">Detalle</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pageItems.map((c) => (
                                        <tr key={c.id || c.receiptNumber} className="hover:bg-slate-50">
                                            <td className="px-5 py-4 text-sm font-semibold">{c.receiptNumber}</td>
                                            <td className="px-5 py-4 text-sm text-slate-500">{formatFecha(c.createdAt)}</td>
                                            <td className="px-5 py-4 text-sm">{Array.isArray(c.items) ? c.items.reduce((s, i) => s + (i.cantidad || 0), 0) : 0}</td>
                                            <td className="px-5 py-4 font-semibold">${Number(c.total || 0).toLocaleString('es-CL')}</td>
                                            <td className="px-5 py-4 text-right">
                                                <button type="button" onClick={() => setSelected(c)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">Ver boleta</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {compras.length > pageSize && (
                            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                                <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40">← Anterior</button>
                                <span className="text-sm text-slate-500">Página {page + 1} de {totalPages}</span>
                                <button type="button" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40">Siguiente →</button>
                            </div>
                        )}
                    </section>
                )}
            </main>

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 px-4 py-8" role="dialog" aria-modal="true">
                    <article className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Comprobante de compra</p>
                                <h2 className="mt-1 text-2xl font-bold">{selected.receiptNumber}</h2>
                            </div>
                            <button type="button" onClick={() => setSelected(null)} aria-label="Cerrar boleta" className="text-2xl leading-none text-slate-400 hover:text-slate-900">×</button>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{formatFecha(selected.createdAt)}</p>
                        <div className="mt-6 grid gap-2 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                            <p><b>Comprador:</b> {selected.buyerName || '—'}</p>
                            <p><b>Correo:</b> {selected.buyerEmail || '—'}</p>
                            <p><b>RUT:</b> {selected.deliveryRut || '—'}</p>
                            <p><b>Entrega:</b> {selected.deliveryAddress || '—'}</p>
                            <p><b>Teléfono:</b> {selected.deliveryPhone || '—'}</p>
                            <p><b>Pago:</b> {selected.metodoPago || '—'}</p>
                            {selected.deliveryNotes && <p className="sm:col-span-2"><b>Notas:</b> {selected.deliveryNotes}</p>}
                        </div>
                        <h3 className="mt-6 font-bold">Detalle de productos</h3>
                        {Array.isArray(selected.items) && selected.items.length > 0 ? (
                            <ul className="mt-3 divide-y divide-slate-100">
                                {selected.items.map((item, index) => (
                                    <li key={`${item.productoId || item.id}-${item.talla}-${index}`} className="flex justify-between gap-4 py-3 text-sm">
                                        <span>{item.nombre || item.name} · Talla {item.talla || item.size} × {item.cantidad || item.quantity}</span>
                                        <span className="font-semibold">{formatCLP(Number(item.precioUnitario || item.price || 0) * (item.cantidad || item.quantity || 0))}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-3 text-sm text-slate-500">Sin detalle de productos.</p>
                        )}
                        <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold">
                                <dt>Total</dt>
                                <dd>{formatCLP(Number(selected.total || 0))}</dd>
                            </div>
                        </dl>
                    </article>
                </div>
            )}
        </div>
    );
}

export default MisCompras;
