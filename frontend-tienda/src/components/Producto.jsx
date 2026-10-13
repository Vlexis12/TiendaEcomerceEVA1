import { useState } from 'react';
import { availableSizes, formatCLP } from '../data/db';

export const Producto = ({ producto, onAgregarCarrito }) => {
    const [talla, setTalla] = useState('');

    return (
        <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="h-56 overflow-hidden rounded-t-3xl bg-slate-100">
                <img src={producto.image} alt={producto.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="flex min-h-[230px] flex-col p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">SneakerX</p>
                <h3 className="mt-2 font-bold">{producto.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{producto.description}</p>

                <label htmlFor={`talla-${producto.id}`} className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Talla
                </label>
                <select
                    id={`talla-${producto.id}`}
                    value={talla}
                    onChange={(event) => setTalla(event.target.value)}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                    style={{ borderRadius: '9999px' }}
                >
                    <option value="">Selecciona una talla</option>
                    {availableSizes.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>

                <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold">{formatCLP(producto.price)}</span>
                    <button
                        type="button"
                        disabled={!talla}
                        onClick={() => onAgregarCarrito(producto, Number(talla))}
                        className="rounded-full bg-[#111827] px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ borderRadius: '9999px' }}
                    >
                        Añadir
                    </button>
                </div>
            </div>
        </article>
    );
};