function Navbar({ totalItems = 0, activePath = window.location.pathname, onCartClick, cartOpen = false }) {
    const cartClass = 'relative inline-flex appearance-none items-center rounded-full border border-slate-200 bg-transparent px-4 py-2 text-sm font-semibold leading-normal text-slate-700 no-underline shadow-none transition hover:border-slate-900 hover:bg-slate-50';
    const linkClass = (path) => (
        `no-underline transition ${activePath === path
            ? 'border-b-2 border-[#111827] pb-1 text-slate-900'
            : 'text-slate-500 hover:text-slate-900'}`
    );

    return (
        <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6" aria-label="Navegación principal">
                <a href="/" className="flex items-center gap-3 no-underline">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#111827] text-base font-black text-white">S</span>
                    <span>
                        <strong className="block text-base tracking-tight">SneakerX</strong>
                        <small className="block text-[9px] font-semibold tracking-[0.18em] text-slate-400">Movimiento Diferente</small>
                    </span>
                </a>

                <div className="hidden items-center gap-6 text-sm font-medium md:flex">
                    <a href="/" className={linkClass('/')}>Inicio</a>
                    <a href="/productos" className={linkClass('/productos')}>Catálogo</a>
                    <a href="/nosotros" className={linkClass('/nosotros')}>Nosotros</a>
                    <a href="/contacto" className={linkClass('/contacto')}>Contacto</a>
                </div>

                <div className="flex items-center gap-2">
                    {onCartClick ? (
                        <button
                            type="button"
                            onClick={onCartClick}
                            aria-expanded={cartOpen}
                            aria-controls="mini-carrito"
                            aria-label={`Abrir carrito con ${totalItems} productos`}
                            className={cartClass}
                            style={{ borderRadius: '9999px' }}
                        >
                            🛒 ({totalItems})
                        </button>
                    ) : (
                        <a href="/carrito" aria-label={`Abrir carrito con ${totalItems} productos`} className={cartClass} style={{ borderRadius: '9999px' }}>
                            🛒 ({totalItems})
                        </a>
                    )}
                    <a href="/cuenta" style={{ color: '#111827' }} className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold no-underline shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100 sm:text-sm">Ingresar</a>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
