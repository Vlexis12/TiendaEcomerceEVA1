import { useState } from 'react';
import Navbar from '../components/Navbar';

const defaultAdmin = {
    id: 1,
    name: 'Jhon Doe',
    role: 'Administrador',
    email: 'jhon.doe@adminshop.cl',
    password: 'admin123',
};

function Login({ totalItems = 0 }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const iniciarSesion = (event) => {
        event.preventDefault();
        const storedUsers = JSON.parse(localStorage.getItem('store_users') || 'null');
        const users = Array.isArray(storedUsers) && storedUsers.length ? storedUsers : [defaultAdmin];
        if (!storedUsers?.length) localStorage.setItem('store_users', JSON.stringify(users));

        const user = users.find((item) => item.email === email.trim() && item.password === password.trim());
        if (!user) {
            setError('Correo o contraseña incorrectos.');
            return;
        }

        const esAdmin = user.role === 'Administrador';
        localStorage.setItem('usuarioLogueado', JSON.stringify({
            nombre: user.name,
            email: user.email,
            rol: esAdmin ? 'admin' : 'usuario',
        }));
        window.location.href = esAdmin ? '/admin/home.html' : '/';
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-slate-900">
            <Navbar totalItems={totalItems} activePath="/login" />
            <main className="grid min-h-[calc(100vh-57px)] lg:grid-cols-[1.05fr_.95fr]">
            <section className="relative hidden overflow-hidden bg-[#111827] lg:block">
                <img src="/img/fondo_registro_1.jpg" alt="Colección SneakerX" className="absolute inset-0 h-full w-full object-cover opacity-55" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/45 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white xl:p-16">
                    <Brand light />
                    <div className="max-w-md"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Tu próximo par empieza aquí</p><h1 className="mt-4 text-5xl font-bold tracking-tight xl:text-7xl">Entra.<br />Muévete.</h1><p className="mt-5 leading-7 text-slate-300">Accede a tu cuenta para continuar descubriendo la selección SneakerX.</p></div>
                </div>
            </section>
            <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
                <div className="w-full max-w-md">
                    <div className="lg:hidden"><Brand /></div>
                    <div className="mt-12 sm:mt-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Bienvenido de nuevo</p>
                        <h2 className="mt-3 text-4xl font-bold tracking-tight">Inicia sesión</h2>
                        <p className="mt-4 leading-7 text-slate-500">Accede para gestionar tus compras o entrar al panel administrativo.</p>
                        {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</div>}
                        <form onSubmit={iniciarSesion} className="mt-8 space-y-5">
                            <label className="block text-sm font-semibold text-slate-700">Correo electrónico<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" placeholder="tu@correo.com" /></label>
                            <label className="block text-sm font-semibold text-slate-700">Contraseña<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" placeholder="Ingresa tu contraseña" /></label>
                            <button type="submit" className="w-full rounded-xl bg-[#111827] px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-700">Iniciar sesión <span className="ml-2">→</span></button>
                        </form>
                        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 text-sm"><a href="/registro" className="font-semibold text-slate-900 hover:underline">Crear una cuenta</a><a href="/" className="text-slate-500 transition hover:text-slate-900">Volver al inicio</a></div>
                    </div>
                </div>
            </section>
            </main>
        </div>
    );
}

function Brand({ light = false }) {
    return <a href="/" className={`flex items-center gap-3 ${light ? 'text-white' : 'text-slate-900'}`}><span className={`grid h-10 w-10 place-items-center rounded-xl text-lg font-black ${light ? 'bg-white text-[#111827]' : 'bg-[#111827] text-white'}`}>S</span><span className="text-left"><strong className="block text-lg tracking-tight">SneakerX</strong><small className={`block text-[10px] font-semibold tracking-[0.22em] ${light ? 'text-slate-300' : 'text-slate-400'}`}>Movimiento Diferente</small></span></a>;
}

export default Login;
