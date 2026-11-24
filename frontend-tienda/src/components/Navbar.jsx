import { useEffect, useState } from 'react';
import { getSession } from '../data/users';
import { authService } from '../services/api';
import { API_BASE } from '../services/api';

const Navbar = ({ totalItems, activePath }) => {
    const [session, setSession] = useState(() => getSession());
    const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('sneakerx_user') || 'null'); } catch { return null; } });
    const [imgError, setImgError] = useState(false);
    const [photoBlobUrl, setPhotoBlobUrl] = useState(null);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(window.location.search).get('buscar') || '');

    useEffect(() => {
        const refresh = () => { try { setUser(JSON.parse(localStorage.getItem('sneakerx_user') || 'null')); setImgError(false); } catch { setUser(null); } };
        refresh();
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
                    if (profile?.id) {
                        try {
                            const token = localStorage.getItem('sneakerx_jwt');
                            const res = await fetch(`${API_BASE}/user/usuarios/${profile.id}/foto`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
                            if (res.ok) { const blob = await res.blob(); const url = URL.createObjectURL(blob); setPhotoBlobUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; }); }
                            else setPhotoBlobUrl(null);
                        } catch { setPhotoBlobUrl(null); }
                    }
                } catch {}
            })();
        }
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Categorías', path: '/productos' },
        { name: 'Nosotros', path: '/nosotros' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contacto', path: '/contacto' },
    ];

    const cerrarSesion = () => { localStorage.clear(); setSession(null); setUser(null); setAccountMenuOpen(false); window.location.href = '/'; };
    const buscarProductos = (event) => { event.preventDefault(); const q = searchTerm.trim(); window.location.href = q ? `/productos?buscar=${encodeURIComponent(q)}` : '/productos'; };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
                <a href="/" className="flex items-center no-underline shrink-0">
                    <img src="/img/logosnk.png" alt="SneakerX" className="h-12 w-auto" />
                </a>
                
                <nav className="hidden md:flex items-center gap-4">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.path} className={`text-sm font-medium no-underline transition-colors ${activePath === link.path || (activePath.startsWith('/blog') && link.path === '/blog') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}>{link.name}</a>
                    ))}
                </nav>

                <form onSubmit={buscarProductos} className="hidden lg:flex flex-1 max-w-xs">
                    <div className="flex w-full">
                        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Buscar productos" className="w-full border border-slate-300 rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        <button type="submit" className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-1.5 rounded-r-md text-slate-600 hover:bg-slate-200 transition text-sm">Buscar</button>
                    </div>
                </form>

                <div className="flex items-center gap-3">
                    <div className="order-2">
                        {session ? (
                            <div className="relative inline-block ml-6">
                                <button 
                                    type="button" 
                                    aria-label={`Abrir menú de ${session.nombre}`} 
                                    aria-expanded={accountMenuOpen} 
                                    onClick={() => setAccountMenuOpen((isOpen) => !isOpen)} 
                                    className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-black/5"
                                >
                                    <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-slate-200 bg-black text-white shadow-sm">
                                        {photoBlobUrl && !imgError ? (
                                            <img src={photoBlobUrl} alt={session.nombre} className="h-full w-full object-cover" onError={() => setImgError(true)} />
                                        ) : (
                                            <span className="text-sm font-bold tracking-wider">
                                                {(session.nombre || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${accountMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {accountMenuOpen && (
                                    <div className="absolute right-0 top-12 z-50 mt-1 w-64 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl ring-1 ring-black/5">
                                        <div className="mb-2 flex items-center gap-3 border-b border-slate-100 px-3 pb-3 pt-2">
                                            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-600">
                                                {photoBlobUrl && !imgError ? (
                                                    <img src={photoBlobUrl} alt={session.nombre} className="h-full w-full object-cover" onError={() => setImgError(true)} />
                                                ) : (
                                                    <span className="text-sm font-bold">
                                                        {(session.nombre || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'U'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <p className="truncate text-sm font-bold text-slate-900">{session.nombre}</p>
                                                <p className="truncate text-xs font-medium text-slate-500">{session.email || user?.email || 'usuario@sneakerx.cl'}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <a href="/mis-compras" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-black">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                                Mis compras
                                            </a>
                                            
                                            <a href="/editar-perfil" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-black">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                Editar perfil
                                            </a>

                                            {session.rol === 'admin' && (
                                                <a href="/admin" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
                                                    <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    Panel Admin
                                                </a>
                                            )}

                                            <div className="my-1 border-t border-slate-100"></div>

                                            <button type="button" onClick={cerrarSesion} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">
                                                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 ml-10 border-l border-slate-200 pl-6">
                                <a 
                                    href="/login" 
                                    className="px-3 py-2 text-sm font-bold text-slate-600 transition-all rounded-lg hover:text-slate-900 hover:bg-slate-100 focus:bg-slate-200 focus:text-black active:scale-95 active:bg-slate-200"
                                >
                                    Ingresar
                                </a>
                                <a 
                                    href="/registro" 
                                    className="px-4 py-2 text-sm font-bold text-white transition-all bg-slate-900 rounded-lg shadow-sm hover:bg-slate-800 active:scale-95"
                                >
                                    Registrarse
                                </a>
                            </div>
                        )}
                    </div>
                    
                    <a href="/carrito" className="order-1 flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                        {totalItems > 0 && <span className="bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">{totalItems}</span>}
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Navbar;