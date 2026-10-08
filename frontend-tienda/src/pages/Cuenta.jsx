import Navbar from '../components/Navbar';

function Cuenta({ totalItems = 0 }) {
    return (
        <div className="min-h-screen bg-[#f3f4f6] text-slate-900">
            <Navbar totalItems={totalItems} activePath="/cuenta" />
            <main className="grid min-h-[calc(100vh-57px)] lg:grid-cols-[1.05fr_.95fr]">
            <section className="relative hidden overflow-hidden bg-[#111827] lg:block">
                <img src="/img/fondo_registro_1.jpg" alt="Colección SneakerX" className="absolute inset-0 h-full w-full object-cover opacity-55" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/45 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white xl:p-16">
                    <Brand light />
                    <div className="max-w-md">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Tu próximo par empieza aquí</p>
                        <h1 className="mt-4 text-5xl font-bold tracking-tight xl:text-7xl">Bienvenido a SneakerX.</h1>
                        <p className="mt-5 leading-7 text-slate-300">Descubre una selección creada para quienes convierten cada paso en parte de su estilo.</p>
                    </div>
                </div>
            </section>
            <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
                <div className="w-full max-w-md text-center">
                    <Brand />
                    <p className="mt-12 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 sm:mt-16">Bienvenido a SneakerX</p>
                    <h2 className="mt-3 text-4xl font-bold tracking-tight">¿Qué deseas hacer?</h2>
                    <p className="mt-4 leading-7 text-slate-500">Inicia sesión si ya tienes una cuenta o regístrate para comenzar.</p>
                    <div className="mt-8 grid gap-3">
                        <a href="/login" className="rounded-xl bg-[#111827] px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-700">Iniciar sesión <span className="ml-2">→</span></a>
                        <a href="/registro" className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900">Crear una cuenta <span className="ml-2">→</span></a>
                    </div>
                    <a href="/" className="mt-8 inline-block text-sm text-slate-500 transition hover:text-slate-900">Volver al inicio</a>
                </div>
            </section>
            </main>
        </div>
    );
}

function Brand({ light = false }) {
    return (
        <a href="/" className={`flex items-center gap-3 ${light ? 'text-white' : 'text-slate-900'}`}>
            <span className={`grid h-10 w-10 place-items-center rounded-xl text-lg font-black ${light ? 'bg-white text-[#111827]' : 'bg-[#111827] text-white'}`}>S</span>
            <span className="text-left">
                <strong className="block text-lg tracking-tight">SneakerX</strong>
                <small className={`block text-[10px] font-semibold tracking-[0.22em] ${light ? 'text-slate-300' : 'text-slate-400'}`}>Movimiento Diferente</small>
            </span>
        </a>
    );
}

export default Cuenta;
