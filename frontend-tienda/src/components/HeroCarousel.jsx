import { useEffect, useState } from 'react';
import { productService } from '../services/api';

export default function HeroCarousel() {
    const [items, setItems] = useState([]);
    const [destacado, setDestacado] = useState(0);
    const [imagenDestacada, setImagenDestacada] = useState(0);

    useEffect(() => {
        let mounted = true;
        productService.getAll({ size: 1000 }).then((data) => {
            if (!mounted) return;
            const destacados = (Array.isArray(data) ? data : []).filter((p) => p.enCarrusel === true).map((p) => ({
                title: p.nombre || p.name,
                description: p.descripcion || p.description || '',
                images: [p.imagenUrl || p.image || ''],
            })).filter((p) => p.images[0]);
            if (destacados.length) setItems(destacados);
        }).catch(() => {});
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (!items.length) return;
        const t = setInterval(() => setDestacado((c) => (c + 1) % items.length), 8000);
        return () => clearInterval(t);
    }, [items]);

    useEffect(() => {
        if (!items.length) return;
        const t = setInterval(() => setImagenDestacada((c) => (c + 1) % (items[destacado]?.images?.length || 1)), 4000);
        return () => clearInterval(t);
    }, [destacado, items]);

    if (!items.length) return null;

    const coleccion = items[destacado];
    const prev = () => setDestacado((c) => (c - 1 + items.length) % items.length);
    const next = () => setDestacado((c) => (c + 1) % items.length);

    return (
        <section className="px-4 py-2 lg:px-6 lg:py-4" aria-label="Colección destacada">
            <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-lg">
                <div className="relative h-[260px] sm:h-[300px] lg:h-[340px]">
                    <img
                        src={coleccion.images[imagenDestacada]}
                        alt={coleccion.title}
                        className="absolute right-0 top-0 z-10 h-full w-[52%] object-contain object-center mix-blend-multiply transition-opacity duration-700 sm:w-[55%] lg:w-[57%]"
                    />
                    <div className="relative z-20 mx-auto flex h-full max-w-[96rem] items-center px-6 sm:px-10 lg:px-14">
                        <div className="max-w-lg">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500 sm:text-xs">Nueva selección / 2026</p>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">{coleccion.title}</h1>
                            <p className="mt-3 max-w-md text-xs leading-6 text-slate-600 sm:text-sm">{coleccion.description}</p>
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <a href="/productos" className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white no-underline shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-700 sm:text-sm">
                                    Comprar ahora<span className="ml-2 text-base" aria-hidden="true">→</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <button onClick={prev} aria-label="Anterior" className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow transition hover:bg-white hover:scale-110">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={next} aria-label="Siguiente" className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow transition hover:bg-white hover:scale-110">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
                        {items.map((item, index) => (
                            <button
                                key={item.title}
                                type="button"
                                onClick={() => setDestacado(index)}
                                aria-label={`Mostrar ${item.title}`}
                                className={`h-2 rounded-full transition-all ${index === destacado ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-500'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
