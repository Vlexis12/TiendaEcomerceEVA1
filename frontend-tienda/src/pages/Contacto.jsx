import { useState } from 'react';
import Navbar from '../components/Navbar';

function Contacto({ totalItems = 0 }) {
    const [enviado, setEnviado] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const actualizarMensaje = (event) => {
        setMensaje(event.target.value.slice(0, 200));
    };

    const enviarFormulario = (event) => {
        event.preventDefault();
        event.currentTarget.reset();
        setMensaje('');
        setEnviado(true);
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-slate-900 antialiased">
            <Navbar totalItems={totalItems} activePath="/contacto" />

            <main className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-8 lg:py-16">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Estamos para ayudarte</p>
                    <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-7xl">Hablemos de tu próximo par.</h1>
                    <p className="mt-6 max-w-md text-lg leading-8 text-slate-500">¿Tienes dudas sobre una talla, un producto o tu pedido? Escríbenos y te responderemos lo antes posible.</p>
                    <div className="mt-10 space-y-5 text-sm">
                        <div><p className="font-semibold">Correo</p><a href="mailto:contacto@sneakerx.cl" className="mt-1 block text-slate-500 hover:text-slate-900">contacto@sneakerx.cl</a></div>
                        <div><p className="font-semibold">Horario de atención</p><p className="mt-1 text-slate-500">Lunes a viernes · 09:00 a 18:00</p></div>
                        <div><p className="font-semibold">Ubicación</p><p className="mt-1 text-slate-500">Santiago, Chile</p></div>
                    </div>
                </div>

                <section className="w-full max-w-2xl justify-self-center rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-10">
                    <h2 className="text-2xl font-bold">Envíanos un mensaje</h2>
                    <form onSubmit={enviarFormulario} className="mt-8 space-y-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Tus datos</p>
                            <div className="mt-4 grid gap-5 sm:grid-cols-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Nombre
                                    <input type="text" required placeholder="Tu nombre" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" />
                                </label>
                                <label className="block text-sm font-semibold text-slate-700">
                                    Correo electrónico
                                    <input type="email" required placeholder="tu@correo.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" />
                                </label>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Cuéntanos más</p>
                            <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <label style={{ display: 'block', width: '100%' }} className="text-sm font-semibold text-slate-700">
                                    Asunto
                                    <input type="text" required placeholder="¿En qué podemos ayudarte?" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" />
                                </label>
                                <label style={{ display: 'block', width: '100%' }} className="text-sm font-semibold text-slate-700">
                                    Mensaje
                                    <textarea required value={mensaje} onChange={actualizarMensaje} maxLength={200} style={{ minHeight: '8rem' }} className="mt-2 h-32 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" placeholder="Escribe tu mensaje..." />
                                    <span className="mt-2 block text-right text-xs font-normal text-slate-400">{mensaje.length}/200 caracteres</span>
                                </label>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-6">
                            <button type="submit" style={{ borderRadius: '9999px' }} className="w-full rounded-full bg-[#111827] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700">Enviar mensaje <span className="ml-2">→</span></button>
                            <p className="mt-3 text-center text-xs text-slate-400">Te responderemos dentro de nuestro horario de atención.</p>
                        </div>
                    </form>
                </section>
            </main>

            {enviado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4" role="dialog" aria-modal="true" aria-labelledby="contact-success-title">
                    <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-900 text-2xl text-white" aria-hidden="true">✓</div>
                        <h2 id="contact-success-title" className="mt-5 text-2xl font-bold">Mensaje enviado</h2>
                        <p className="mt-3 leading-7 text-slate-500">Gracias por escribirnos. Nuestro equipo revisará tu mensaje y te responderá pronto.</p>
                        <button type="button" onClick={() => setEnviado(false)} style={{ borderRadius: '9999px' }} className="mt-7 w-full rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Cerrar</button>
                    </div>
                </div>
            )}

            <footer className="bg-[#111827] px-6 py-8 text-slate-400 lg:px-8"><div className="mx-auto flex max-w-7xl justify-between text-sm"><p>© 2026 SneakerX.</p><a href="/" className="transition hover:text-white">Volver al inicio</a></div></footer>
        </div>
    );
}

export default Contacto;
