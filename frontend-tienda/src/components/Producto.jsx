import React from 'react';
import { formatCLP } from '../data/db'; // Asegúrate de tener formatCLP exportado en tu db.js

export const Producto = ({ producto, onAgregarCarrito }) => {
    return (
        <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="h-64 overflow-hidden bg-slate-100">
                <img src={producto.image} alt={producto.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5 flex flex-col h-[calc(100%-16rem)]">
                <p className="text-xs uppercase tracking-wider text-slate-400">SneakerX</p>
                <h3 className="mt-2 font-bold">{producto.name}</h3>
                <p className="mt-1 flex-1 text-sm text-slate-500">{producto.description}</p>
                
                <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold">{formatCLP(producto.price)}</span>
                    <button 
                        type="button" 
                        onClick={() => onAgregarCarrito(producto)}
                        className="rounded-lg bg-[#111827] px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                    >
                        Añadir
                    </button>
                </div>
            </div>
        </article>
    );
};