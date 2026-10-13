// src/components/Navbar.jsx
import React from 'react';

const Navbar = ({ totalItems, activePath }) => {
    // Definimos los enlaces basándonos en el diseño de la entrega 2
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Categorías', path: '/categorias' },
        { name: 'Ofertas', path: '/ofertas' },
        { name: 'Nosotros', path: '/nosotros' },
        { name: 'Blog', path: '/blog' }, // AQUÍ ESTÁ EL ENLACE AL BLOG
        { name: 'Contacto', path: '/contacto' },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Barra superior con buscador y accesos de usuario */}
            <div className="border-b border-slate-200 py-3">
                <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    {/* Logo */}
                    <a href="/" className="text-2xl font-bold text-slate-900 no-underline">
                        TiendaX
                    </a>

                    {/* Buscador (Visual) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="flex w-full">
                            <input 
                                type="text" 
                                placeholder="Buscar productos..." 
                                className="w-full border border-slate-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button className="bg-slate-100 border border-l-0 border-slate-300 px-4 py-2 rounded-r-md text-slate-600 hover:bg-slate-200 transition">
                                Buscar
                            </button>
                        </div>
                    </div>

                    {/* Botones de Sesión / Registro */}
                    <div className="flex space-x-3">
                        <a href="/login" className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition no-underline">
                            Iniciar Sesión
                        </a>
                        <a href="/registro" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition no-underline">
                            Crear Cuenta
                        </a>
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