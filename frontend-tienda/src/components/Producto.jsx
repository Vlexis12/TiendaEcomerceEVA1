import { useState } from 'react';
import { availableSizes, formatCLP } from '../data/db';

export const Producto = ({ producto, onAgregarCarrito }) => {
    const [talla, setTalla] = useState('');
    const stock = Number(producto.stock ?? 0);
    const agotado = stock <= 0;

    return (
        <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-56 overflow-hidden rounded-t-3xl bg-slate-100">
                <img src={producto.image} alt={producto.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                {agotado && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">AGOTADO</span>
                )}
            </div>
            <div className="flex min-h-[230px] flex-col p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">{producto.category || producto.categoria || "SneakerX"}</p>
                <h3 className="mt-2 font-bold">{producto.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{producto.description}</p>

                <label htmlFor={`talla-${producto.id}`} className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Talla
                </label>
                <select
                    id={`talla-${producto.id}`}
                    value={talla}
                    onChange={(event) => setTalla(event.target.value)}
                    disabled={agotado}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    style={{ borderRadius: '9999px' }}
                >
                    <option value="">Selecciona una talla</option>
                    {availableSizes.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>

                <div className="mt-2 text-xs font-semibold text-slate-500">
                    Stock disponible: <span className={agotado ? 'text-red-600' : 'text-slate-700'}>{stock}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold">{formatCLP(producto.price)}</span>
                    <button
                        type="button"
                        disabled={agotado || !talla}
                        onClick={() => onAgregarCarrito(producto, Number(talla))}
                        className="btn btn-dark btn-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {agotado ? 'Agotado' : 'Añadir'}
                    </button>
                </div>
            </div>
        </article>
    );
};
