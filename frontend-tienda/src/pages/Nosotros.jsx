import Navbar from '../components/Navbar';

function Nosotros({ totalItems = 0 }) {
    return (
        <div className="bg-[#f3f4f6] text-slate-900 antialiased">
            <Navbar totalItems={totalItems} activePath="/nosotros" />

            <main>
                <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
                    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Nuestra forma de ver el movimiento</p>
                            <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">Pisa fuerte.<br />Muévete distinto.</h1>
                            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-500">SneakerX nace para acercar zapatillas con personalidad a quienes convierten cada paso en parte de su estilo.</p>
                        </div>
                        <div className="h-[380px] rounded-3xl bg-cover bg-center shadow-sm lg:h-[460px]" style={{ backgroundImage: "url('/img/yeezy2.jpg')" }} />
                    </div>
                </section>

                <section className="border-y border-slate-200 bg-white">
                    <div className="mx-auto grid max-w-7xl gap-0 px-6 lg:grid-cols-3 lg:px-8">
                        {[
                            ['01', 'Selección con criterio', 'Elegimos modelos que combinan diseño, comodidad y una historia que vale la pena llevar.'],
                            ['02', 'Compra simple', 'Una experiencia clara para encontrar tu próximo par sin perderte entre el ruido.'],
                            ['03', 'Comunidad en movimiento', 'Construimos un espacio para descubrir tendencias y compartir la cultura sneaker.'],
                        ].map(([number, title, text], index) => (
                            <article key={number} className={`py-10 ${index < 2 ? 'border-b border-slate-200 lg:border-b-0 lg:border-r' : ''} ${index === 0 ? 'lg:pr-10' : index === 1 ? 'lg:px-10' : 'lg:pl-10'}`}>
                                <p className="text-3xl font-bold">{number}</p>
                                <h2 className="mt-6 text-xl font-bold">{title}</h2>
                                <p className="mt-3 leading-7 text-slate-500">{text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
                    <div className="h-80 rounded-3xl bg-cover bg-center" style={{ backgroundImage: "url('/img/jordan4.jpg')" }} />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">El siguiente paso</p>
                        <h2 className="mt-3 text-4xl font-bold tracking-tight">Tu estilo no se queda quieto.</h2>
                        <p className="mt-5 leading-8 text-slate-500">Explora nuestra selección y encuentra el par que encaja contigo, desde clásicos esenciales hasta nuevas siluetas.</p>
                        <a href="/productos" className="mt-7 inline-flex rounded-xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Ver catálogo →</a>
                    </div>
                </section>
            </main>

            <footer className="bg-[#111827] px-6 py-8 text-slate-400 lg:px-8">
                <div className="mx-auto flex max-w-7xl justify-between text-sm"><p>© 2026 SneakerX.</p><a href="/" className="transition hover:text-white">Volver al inicio</a></div>
            </footer>
        </div>
    );
}

export default Nosotros;
