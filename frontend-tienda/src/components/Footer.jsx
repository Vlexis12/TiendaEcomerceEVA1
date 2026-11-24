export default function Footer() {
    return (
        <footer className="bg-white px-4 py-3 text-slate-600 border-t border-slate-200 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[96rem] flex-col items-center gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                <p className="lg:pl-[650px]">© 2026 SneakerX. Todos los derechos reservados.</p>
                <nav className="flex flex-wrap justify-center gap-6">
                    <a href="/nosotros" className="font-semibold text-indigo-600 no-underline transition hover:text-pink-600">Nosotros</a>
                    <a href="/productos" className="font-semibold text-indigo-600 no-underline transition hover:text-pink-600">Catálogo</a>
                    <a href="/contacto" className="font-semibold text-indigo-600 no-underline transition hover:text-pink-600">Contacto</a>
                    <a href="/cuenta" className="font-semibold text-indigo-600 no-underline transition hover:text-pink-600">Mi cuenta</a>
                </nav>
            </div>
        </footer>
    );
}