// src/components/Navbar.jsx
import { useEffect, useState } from 'react';
import { getSession } from '../data/users';
import { authService } from '../services/api';
import { API_BASE } from '../services/api';

const Navbar = ({ totalItems, activePath }) => {
    const [session, setSession] = useState(() => getSession());
    const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('sneakerx_user') || 'null'); } catch { return null; } });
    const [imgError, setImgError] = useState(false);
const [photoBlobUrl, setPhotoBlobUrl] = useState(null);

    useEffect(() => {
        const refresh = () => { try { setUser(JSON.parse(localStorage.getItem('sneakerx_user') || 'null')); setImgError(false); } catch { setUser(null); } };
        refresh();
        // Fetch fresh profile to get imagenUrl (Google photo) only if logged in
        if (localStorage.getItem('sneakerx_jwt')) {
            (async () => {
                try {
                    const profile = await authService.getProfile();
                    if (profile) {
                        const u = { ...profile, imagenUrl: profile.imagenUrl || profile.picture };
                        localStorage.setItem('sneakerx_user', JSON.stringify(u));
                        setUser(u);
                        setImgError(false);
                    }
                    // Cargar foto a través del proxy autenticado
                    if (profile?.id) {
                        try {
                            const token = localStorage.getItem('sneakerx_jwt');
                            const res = await fetch(`${API_BASE}/user/usuarios/${profile.id}/foto`, {
                                headers: token ? { Authorization: `Bearer ${token}` } : {},
                            });
                            if (res.ok) {
                                const blob = await res.blob();
                                const url = URL.createObjectURL(blob);
                                setPhotoBlobUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
                            } else {
                                setPhotoBlobUrl(null);
                            }
                        } catch {
                            setPhotoBlobUrl(null);
                        }
                    }
                } catch {}
            })();
        }
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(window.location.search).get('buscar') || '');

    // Definimos los enlaces basándonos en el diseño de la entrega 2
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Categorías', path: '/productos' },
        { name: 'Ofertas', path: '/' },
        { name: 'Nosotros', path: '/nosotros' },
        { name: 'Blog', path: '/blog' }, // AQUÍ ESTÁ EL ENLACE AL BLOG
        { name: 'Contacto', path: '/contacto' },
    ];

    const cerrarSesion = () => {
        localStorage.clear();
        setSession(null);
        setUser(null);
        setAccountMenuOpen(false);
        window.location.href = '/';
    };

    const buscarProductos = (event) => {
        event.preventDefault();
        const query = searchTerm.trim();
        window.location.href = query ? `/productos?buscar=${encodeURIComponent(query)}` : '/productos';
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Barra superior con buscador y accesos de usuario */}
            <div className="border-b border-slate-200 py-3">
                <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    {/* Logo */}
                    <a href="/" className="text-2xl font-bold text-slate-900 no-underline">
                        SneakerX
                    </a>

                    {/* Buscador */}
                    <form onSubmit={buscarProductos} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="flex w-full">
                            <input 
                                type="text" 
                                placeholder="Buscar productos..." 
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                aria-label="Buscar productos"
                                className="w-full border border-slate-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button type="submit" className="bg-slate-100 border border-l-0 border-slate-300 px-4 py-2 rounded-r-md text-slate-600 hover:bg-slate-200 transition">
                                Buscar
                            </button>
                        </div>
                    </form>

                    {/* Acceso de usuario */}
                    <div className="relative flex items-center">
                        {session ? (
                            <>
                                <button
                                    type="button"
                                    aria-label={`Abrir menú de ${session.nombre}`}
                                    aria-expanded={accountMenuOpen}
                                    onClick={() => setAccountMenuOpen((isOpen) => !isOpen)}
                                    className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                                >
                                    {photoBlobUrl && !imgError ? (
                                        <img src={photoBlobUrl} alt={session.nombre} className="h-full w-full object-cover" onError={() => setImgError(true)} />
                                    ) : (
                                        <span className="text-sm font-bold">
                                            {(session.nombre || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'U'}
                                        </span>
                                    )}
                                </button>
                                {accountMenuOpen && (
                                    <div className="absolute right-0 top-12 z-50 min-w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                        <p className="truncate px-3 py-2 text-sm font-semibold text-slate-700">{session.nombre}</p>
                                        <div className="flex flex-col gap-1">
                                            <a
                                                href="/mis-compras"
                                                className="rounded-lg px-3 py-2 text-center text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                                            >
                                                Mis compras
                                            </a>
                                            {session.rol === 'admin' && (
                                                <a
                                                    href="/admin"
                                                    className="rounded-lg px-3 py-2 text-center text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
                                                >
                                                    Ir al panel de admin
                                                </a>
                                            )}
                                            <a
                                                href="/editar-perfil"
                                                className="rounded-lg px-3 py-2 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                Editar perfil
                                            </a>
                                            <button
                                                type="button"
                                                onClick={cerrarSesion}
                                                className="rounded-lg px-3 py-2 text-center text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                            >
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex space-x-3">
                                <a href="/login" className="btn btn-outline-primary btn-sm">
                                    Iniciar Sesión
                                </a>
                                <a href="/registro" className="btn btn-primary btn-sm">
                                    Crear Cuenta
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Barra inferior con navegación principal y carrito */}
            <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                {/* Menú de Navegación */}
                <nav className="hidden md:flex space-x-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            className={`text-sm font-medium no-underline transition-colors ${
                                activePath === link.path || (activePath.startsWith('/blog') && link.path === '/blog')
                                    ? 'text-blue-600 font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Botón del Carrito */}
                <a 
                    href="/carrito" 
                    className="flex items-center gap-2 bg-[#198754] text-white px-4 py-2 rounded-md font-bold hover:bg-green-700 transition no-underline ml-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    Carrito
                    {totalItems > 0 && (
                        <span className="bg-white text-[#198754] text-xs px-2 py-0.5 rounded-full ml-1">
                            {totalItems}
                        </span>
                    )}
                </a>
            </div>
        </header>
    );
};

export default Navbar;